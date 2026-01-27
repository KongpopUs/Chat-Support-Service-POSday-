// composables/useChatUser.ts

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ChatMessage, ChatSession, CustomerInfo } from '~/types/chat'
import { useSignalR } from './useSignalR'
import { apiService } from '~/services/api.service'

export function useChatUser(customerId: string) {
  const { connect, disconnect, on, off, send } = useSignalR()

  const session = ref<ChatSession | null>(null)
  const messages = ref<ChatMessage[]>([])
  const customerInfo = ref<CustomerInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // =============== INIT ===============
  
  const init = async () => {
    try {
      loading.value = true
      error.value = null

      // 1. Connect SignalR
      await connect(customerId, 'customer')

      // 2. Load customer info
      customerInfo.value = await apiService.getCustomerInfo(customerId)

      // 3. Create or get active session
      const sessions = await apiService.getChatSessions('waiting')
      
      if (sessions.length > 0) {
        session.value = sessions[0]
      } else {
        session.value = await apiService.createChatSession(customerId)
      }

      // 4. Load messages
      if (session.value) {
        messages.value = await apiService.getChatMessages(session.value.id)
      }

      // 5. Setup SignalR listeners
      setupSignalRListeners()

      // 6. Send auto-reply if first time
      if (messages.value.length === 0 && session.value) {
        await sendAutoReply()
      }

    } catch (err: any) {
      error.value = err.message
      console.error('❌ Init error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== AUTO REPLY ===============
  
  const sendAutoReply = async () => {
    if (!session.value || !customerInfo.value) return

    const queuePosition = await apiService.getQueuePosition(session.value.id)

    const autoReplyText = `สวัสดีค่ะ คุณลูกค้าหมายเลขสมาชิก ${customerInfo.value.memberNo} บริษัท ${customerInfo.value.companyName} posday service ยินดีให้บริการค่ะ ทางคุณลูกค้าสามารถสอบถาม หรือขอคำปรึกษาได้เลย ทางเจ้าหน้าที่จะรีบเข้ามาติดต่อเร็วที่สุดค่ะ โดยคิวของคุณลูกค้าคือคิวที่ ${queuePosition} ค่ะ`

    const autoMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: session.value.id,
      sender: 'system',
      text: autoReplyText,
      createdAt: new Date().toISOString()
    }

    messages.value.push(autoMessage)
  }

  // =============== SIGNALR LISTENERS ===============
  
  const setupSignalRListeners = () => {
    // รับข้อความใหม่
    on('ReceiveMessage', (message: ChatMessage) => {
      if (message.sessionId === session.value?.id) {
        messages.value.push(message)
        
        // Play notification sound
        playNotificationSound()
      }
    })

    // Session updated
    on('SessionUpdated', (updatedSession: ChatSession) => {
      if (updatedSession.id === session.value?.id) {
        session.value = updatedSession
      }
    })

    // Support assigned
    on('SupportAssigned', (data: { sessionId: string; supportName: string }) => {
      if (data.sessionId === session.value?.id && session.value) {
        session.value.supportName = data.supportName
        session.value.status = 'in-progress'
      }
    })
  }

  // =============== SEND MESSAGE ===============
  
  const sendMessage = async (text: string) => {
    if (!session.value || !text.trim()) return

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

      // Send via SignalR for real-time
      await send('SendMessage', {
        sessionId: session.value.id,
        text: text.trim(),
        sender: 'customer'
      })

    } catch (err: any) {
      error.value = 'ส่งข้อความไม่สำเร็จ'
      console.error('❌ Send message error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== UPLOAD IMAGE ===============
  
  const uploadImage = async (file: File) => {
    if (!session.value) return

    try {
      loading.value = true

      const message = await apiService.uploadChatImage(session.value.id, file)
      messages.value.push(message)

      await send('SendMessage', {
        sessionId: session.value.id,
        imageUrl: message.imageUrl,
        sender: 'customer'
      })

    } catch (err: any) {
      error.value = 'อัปโหลดรูปภาพไม่สำเร็จ'
      console.error('❌ Upload image error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== UPLOAD FILE ===============
  
  const uploadFile = async (file: File) => {
    if (!session.value) return

    try {
      loading.value = true

      const message = await apiService.uploadChatFile(session.value.id, file)
      messages.value.push(message)

      await send('SendMessage', {
        sessionId: session.value.id,
        fileUrl: message.fileUrl,
        sender: 'customer'
      })

    } catch (err: any) {
      error.value = 'อัปโหลดไฟล์ไม่สำเร็จ'
      console.error('❌ Upload file error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== RATING ===============
  
  const submitRating = async (rating: number, comment: string) => {
    if (!session.value) return

    try {
      loading.value = true

      await apiService.submitRating(session.value.id, rating, comment)
      
      if (session.value) {
        session.value.status = 'closed'
      }

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
  })

  return {
    // State
    session,
    messages,
    customerInfo,
    loading,
    error,

    // Actions
    sendMessage,
    uploadImage,
    uploadFile,
    submitRating
  }
}