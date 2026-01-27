// composables/useChatSupport.ts

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ChatMessage, ChatSession, ChatQueue } from '~/types/chat'
import { useSignalR } from './useSignalR'
import { apiService } from '~/services/api.service'

export function useChatSupport(supportId: string) {
  const { connect, disconnect, on, off, send, isConnected } = useSignalR()

  // State
  const allSessions = ref<ChatSession[]>([])
  const messages = ref<ChatMessage[]>([])
  const activeSession = ref<ChatSession | null>(null)
  const queues = ref<ChatQueue[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const waitingSessions = computed(() =>
    allSessions.value.filter(s => s.status === 'waiting')
  )

  const assignedSessions = computed(() =>
    allSessions.value.filter(s => 
      s.status === 'assigned' || s.status === 'in-progress'
    )
  )

  const completedSessions = computed(() =>
    allSessions.value.filter(s => s.status === 'completed')
  )

  // =============== INIT ===============
  
  const init = async () => {
    try {
      loading.value = true
      error.value = null

      // 1. Connect SignalR
      await connect(supportId, 'support')

      // 2. Load all sessions
      await loadSessions()

      // 3. Load queues
      await loadQueues()

      // 4. Setup SignalR listeners
      setupSignalRListeners()

    } catch (err: any) {
      error.value = err.message
      console.error('❌ Init error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== LOAD DATA ===============
  
  const loadSessions = async () => {
    try {
      allSessions.value = await apiService.getChatSessions()
    } catch (err) {
      console.error('❌ Load sessions error:', err)
    }
  }

  const loadQueues = async () => {
    try {
      queues.value = await apiService.getChatQueues()
    } catch (err) {
      console.error('❌ Load queues error:', err)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      messages.value = await apiService.getChatMessages(sessionId)
    } catch (err) {
      console.error('❌ Load messages error:', err)
    }
  }

  // =============== SIGNALR LISTENERS ===============
  
  const setupSignalRListeners = () => {
    // 🔔 มีลูกค้าเข้ามาใหม่
    on('NewCustomerArrived', async (session: ChatSession) => {
      allSessions.value.unshift(session)
      playNotificationSound()
      showNotification('มีลูกค้าเข้าคิวใหม่', session.customerName)
      
      // Reload queues
      await loadQueues()
    })

    // 💬 รับข้อความใหม่
    on('ReceiveMessage', (message: ChatMessage) => {
      // Update last message in session
      const session = allSessions.value.find(s => s.id === message.sessionId)
      if (session) {
        session.lastMessage = message.text
        session.hasUnread = message.sessionId !== activeSession.value?.id
      }

      // Add to messages if active
      if (message.sessionId === activeSession.value?.id) {
        messages.value.push(message)
      } else {
        playNotificationSound()
      }
    })

    // ✅ Session updated
    on('SessionUpdated', (updatedSession: ChatSession) => {
      const index = allSessions.value.findIndex(s => s.id === updatedSession.id)
      if (index !== -1) {
        allSessions.value[index] = updatedSession
      }

      if (activeSession.value?.id === updatedSession.id) {
        activeSession.value = updatedSession
      }
    })

    // 🎯 Session completed
    on('SessionCompleted', (sessionId: string) => {
      const session = allSessions.value.find(s => s.id === sessionId)
      if (session) {
        session.status = 'completed'
      }

      if (activeSession.value?.id === sessionId) {
        activeSession.value = null
        messages.value = []
      }
    })
  }

  // =============== ACCEPT SESSION ===============
  
  const acceptSession = async (sessionId: string) => {
    try {
      loading.value = true

      // Update via API
      const updatedSession = await apiService.acceptChatSession(sessionId, supportId)

      // Update local state
      const index = allSessions.value.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        allSessions.value[index] = {
          ...updatedSession,
          status: 'in-progress',
          supportId: supportId
        }
      }

      // Notify via SignalR
      await send('AcceptSession', {
        sessionId,
        supportId
      })

      // Update queues
      await loadQueues()

      return updatedSession

    } catch (err: any) {
      error.value = 'รับงานไม่สำเร็จ'
      console.error('❌ Accept session error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // =============== SELECT SESSION ===============
  
  const selectSession = async (sessionId: string) => {
    try {
      loading.value = true

      // Load session details
      const session = await apiService.getChatSessionById(sessionId)
      activeSession.value = session

      // Load messages
      await loadMessages(sessionId)

      // Mark as read
      const sessionInList = allSessions.value.find(s => s.id === sessionId)
      if (sessionInList) {
        sessionInList.hasUnread = false
      }

    } catch (err: any) {
      error.value = 'โหลดแชทไม่สำเร็จ'
      console.error('❌ Select session error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== SEND MESSAGE ===============
  
  const sendMessage = async (text: string) => {
    if (!activeSession.value || !text.trim()) return

    try {
      loading.value = true

      // Optimistic update
      const tempMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: activeSession.value.id,
        sender: 'support',
        text: text.trim(),
        createdAt: new Date().toISOString()
      }

      messages.value.push(tempMessage)

      // Update last message
      const session = allSessions.value.find(s => s.id === activeSession.value?.id)
      if (session) {
        session.lastMessage = text.trim()
      }

      // Send to API
      const savedMessage = await apiService.sendChatMessage(
        activeSession.value.id,
        text.trim(),
        'support'
      )

      // Replace temp with real message
      const index = messages.value.findIndex(m => m.id === tempMessage.id)
      if (index !== -1) {
        messages.value[index] = savedMessage
      }

      // Send via SignalR for real-time
      await send('SendMessage', {
        sessionId: activeSession.value.id,
        text: text.trim(),
        sender: 'support'
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
    if (!activeSession.value) return

    try {
      loading.value = true

      const message = await apiService.uploadChatImage(activeSession.value.id, file)
      messages.value.push(message)

      await send('SendMessage', {
        sessionId: activeSession.value.id,
        imageUrl: message.imageUrl,
        sender: 'support'
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
    if (!activeSession.value) return

    try {
      loading.value = true

      const message = await apiService.uploadChatFile(activeSession.value.id, file)
      messages.value.push(message)

      await send('SendMessage', {
        sessionId: activeSession.value.id,
        fileUrl: message.fileUrl,
        sender: 'support'
      })

    } catch (err: any) {
      error.value = 'อัปโหลดไฟล์ไม่สำเร็จ'
      console.error('❌ Upload file error:', err)
    } finally {
      loading.value = false
    }
  }

  // =============== COMPLETE SESSION ===============
  
  const completeSession = async (sessionId: string) => {
    try {
      loading.value = true

      // Complete via API
      await apiService.completeChatSession(sessionId)

      // Update local state
      const session = allSessions.value.find(s => s.id === sessionId)
      if (session) {
        session.status = 'completed'
        session.endDate = new Date().toLocaleDateString('th-TH')
        session.endTime = new Date().toLocaleTimeString('th-TH')
      }

      // Notify via SignalR
      await send('CompleteSession', { sessionId })

      // Clear active if current
      if (activeSession.value?.id === sessionId) {
        activeSession.value = null
        messages.value = []
      }

      // Reload queues
      await loadQueues()

    } catch (err: any) {
      error.value = 'จบงานไม่สำเร็จ'
      console.error('❌ Complete session error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // =============== UTILITIES ===============
  
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3')
    audio.play().catch(err => console.warn('Cannot play sound:', err))
  }

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/posday-logo.jpeg' })
    }
  }

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end.getTime() - start.getTime()
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // =============== REQUEST NOTIFICATION PERMISSION ===============
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  // =============== LIFECYCLE ===============
  
  onMounted(() => {
    init()
    requestNotificationPermission()
  })

  onUnmounted(() => {
    disconnect()
    off('NewCustomerArrived')
    off('ReceiveMessage')
    off('SessionUpdated')
    off('SessionCompleted')
  })

  return {
    // State
    allSessions,
    waitingSessions,
    assignedSessions,
    completedSessions,
    messages,
    activeSession,
    queues,
    loading,
    error,
    isConnected,

    // Actions
    acceptSession,
    selectSession,
    sendMessage,
    uploadImage,
    uploadFile,
    completeSession,
    calculateDuration
  }
}