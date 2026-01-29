// composables/useChatUser.ts

import { ref, onMounted, onUnmounted } from 'vue'
import type { ChatMessage, ChatSession } from '~/types/chat'
import { useSignalR } from './useSignalR'
import { apiService } from '~/services/api.service'

export function useChatUser(initialSession: ChatSession) {
  const { connect, disconnect, on, off, send, joinSession } = useSignalR()

  const session = ref<ChatSession>(initialSession)
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // =============== INIT ===============
  
  const init = async () => {
    try {
      loading.value = true
      error.value = null

      // 1. Connect SignalR ใช้ session.id เป็น userId
      await connect(session.value.id, 'customer')

      // 2. Join session room
      await joinSession(session.value.id)

      // 3. Load messages
      messages.value = await apiService.getChatMessages(session.value.id)

      // 4. Setup SignalR listeners
      setupSignalRListeners()

    } catch (err: any) {
      error.value = err.message || 'เกิดข้อผิดพลาด'
      console.error('❌ Init error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== SIGNALR LISTENERS ===============
  
  const setupSignalRListeners = () => {
    // รับข้อความใหม่
    on('ReceiveMessage', (message: ChatMessage) => {
      if (message.sessionId === session.value.id) {
        messages.value.push(message)
        playNotificationSound()
      }
    })

    // Session updated
    on('SessionUpdated', (updatedSession: ChatSession) => {
      if (updatedSession.id === session.value.id) {
        session.value = updatedSession
      }
    })

    // Support assigned
    on('SupportAssigned', (data: { sessionId: string; supportName: string }) => {
      if (data.sessionId === session.value.id) {
        session.value.supportName = data.supportName
        session.value.status = 'in-progress'
      }
    })

    // Session completed - แสดง rating modal
    on('SessionCompleted', (sessionId: string) => {
      if (sessionId === session.value.id) {
        session.value.status = 'completed'
        // Emit event to parent component
      }
    })
  }

  // =============== SEND MESSAGE ===============
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    try {
      loading.value = true

      // Optimistic update
      const tempMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: session.value.id,
        sender: 'customer',
        text: text.trim(),
        createdAt: new Date().toISOString()
      }

      messages.value.push(tempMessage)

      // Send to API
      const savedMessage = await apiService.sendChatMessage(
        session.value.id,
        text.trim(),
        'customer'
      )

      // Replace temp with real message
      const index = messages.value.findIndex(m => m.id === tempMessage.id)
      if (index !== -1) {
        messages.value[index] = savedMessage
      }

    } catch (err: any) {
      error.value = 'ส่งข้อความไม่สำเร็จ'
      console.error('❌ Send message error:', err)
      
      // Remove failed message
      messages.value = messages.value.filter(m => m.id !== tempMessage.id)
    } finally {
      loading.value = false
    }
  }

  // =============== UPLOAD IMAGE ===============
  
  const uploadImage = async (file: File) => {
    try {
      loading.value = true

      const message = await apiService.uploadChatImage(session.value.id, file)
      messages.value.push(message)

    } catch (err: any) {
      error.value = 'อัปโหลดรูปภาพไม่สำเร็จ'
      console.error('❌ Upload image error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== UPLOAD FILE ===============
  
  const uploadFile = async (file: File) => {
    try {
      loading.value = true

      const message = await apiService.uploadChatFile(session.value.id, file)
      messages.value.push(message)

    } catch (err: any) {
      error.value = 'อัปโหลดไฟล์ไม่สำเร็จ'
      console.error('❌ Upload file error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== RATING ===============
  
  const submitRating = async (rating: number, comment: string) => {
    try {
      loading.value = true

      await apiService.submitRating(session.value.id, rating, comment)
      session.value.status = 'closed'

    } catch (err: any) {
      error.value = 'ส่งคะแนนไม่สำเร็จ'
      console.error('❌ Submit rating error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== UTILITIES ===============
  
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3')
    audio.play().catch(err => console.warn('Cannot play sound:', err))
  }

  // =============== LIFECYCLE ===============
  
  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    disconnect()
    off('ReceiveMessage')
    off('SessionUpdated')
    off('SupportAssigned')
    off('SessionCompleted')
  })

  return {
    // State
    session,
    messages,
    loading,
    error,

    // Actions
    sendMessage,
    uploadImage,
    uploadFile,
    submitRating
  }
}