// composables/useChatUser.ts
import { ref, onMounted, onUnmounted } from 'vue'
import type { ChatMessage, ChatSession } from '~/types/chat'
import { useSignalR } from './useSignalR'
import { apiService } from '~/services/api.service'

export function useChatUser(initialSession: ChatSession) {
  const { connect, disconnect, on, off, joinSession } = useSignalR()

  const session = ref<ChatSession>(initialSession)
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ================== GUARD ==================
  const initialized = ref(false)

  // ================== SIGNALR HANDLERS ==================

  const handleReceiveMessage = (message: ChatMessage) => {
    if (message.sessionId !== session.value.id) return
    if (messages.value.some(m => m.id === message.id)) return // 🛡 กันซ้ำ

    messages.value.push(message)
    playNotificationSound()
  }

  const handleSessionUpdated = (updatedSession: ChatSession) => {
    if (updatedSession.id === session.value.id) {
      session.value = updatedSession
    }
  }

  const handleSupportAssigned = (data: { sessionId: string; supportName: string }) => {
    if (data.sessionId === session.value.id) {
      session.value.supportName = data.supportName
      session.value.status = 'in-progress'
    }
  }

  const handleSessionCompleted = (sessionId: string) => {
    if (sessionId === session.value.id) {
      session.value.status = 'completed'
    }
  }

  // ================== LISTENER SETUP ==================

  const setupSignalRListeners = () => {
    // 🧹 ถอดก่อนเสมอ (กัน register ซ้ำ)
    off('ReceiveMessage', handleReceiveMessage)
    off('SessionUpdated', handleSessionUpdated)
    off('SupportAssigned', handleSupportAssigned)
    off('SessionCompleted', handleSessionCompleted)

    // ✅ ใส่ใหม่
    on('ReceiveMessage', handleReceiveMessage)
    on('SessionUpdated', handleSessionUpdated)
    on('SupportAssigned', handleSupportAssigned)
    on('SessionCompleted', handleSessionCompleted)
  }

  // ================== INIT ==================

  const init = async () => {
    if (initialized.value) return // 🛡 กัน init ซ้ำ
    initialized.value = true

    try {
      loading.value = true
      error.value = null

      // 1. Connect SignalR
      await connect(session.value.id, 'customer')

      // 2. Join room
      await joinSession(session.value.id)

      // 3. Load history
      messages.value = await apiService.getChatMessages(session.value.id)

      // 4. Setup listeners
      setupSignalRListeners()

    } catch (err: any) {
      error.value = err.message || 'เกิดข้อผิดพลาด'
      console.error('❌ Init error:', err)
    } finally {
      loading.value = false
    }
  }

  // ================== SEND MESSAGE ==================

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    try {
      loading.value = true

      // ✅ ส่งอย่างเดียว
      await apiService.sendChatMessage(
        session.value.id,
        text.trim(),
        'customer'
      )

      // ❌ ไม่ push message เอง
      // รอ SignalR ReceiveMessage เท่านั้น

    } catch (err) {
      error.value = 'ส่งข้อความไม่สำเร็จ'
      console.error('❌ Send message error:', err)
    } finally {
      loading.value = false
    }
  }

  // ================== UPLOAD ==================

  const uploadImage = async (file: File) => {
    try {
      loading.value = true
      await apiService.uploadChatImage(session.value.id, file)
    } catch (err) {
      error.value = 'อัปโหลดรูปภาพไม่สำเร็จ'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const uploadFile = async (file: File) => {
    try {
      loading.value = true
      await apiService.uploadChatFile(session.value.id, file)
    } catch (err) {
      error.value = 'อัปโหลดไฟล์ไม่สำเร็จ'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // ================== RATING ==================

  const submitRating = async (rating: number, comment: string) => {
    try {
      loading.value = true
      await apiService.submitRating(session.value.id, rating, comment)
      session.value.status = 'closed'
    } catch (err) {
      error.value = 'ส่งคะแนนไม่สำเร็จ'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // ================== UTIL ==================

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3')
    audio.play().catch(() => {})
  }

  // ================== LIFECYCLE ==================

  onMounted(init)

  onUnmounted(() => {
    off('ReceiveMessage', handleReceiveMessage)
    off('SessionUpdated', handleSessionUpdated)
    off('SupportAssigned', handleSupportAssigned)
    off('SessionCompleted', handleSessionCompleted)
    disconnect()
  })

  return {
    session,
    messages,
    loading,
    error,
    sendMessage,
    uploadImage,
    uploadFile,
    submitRating
  }
}
