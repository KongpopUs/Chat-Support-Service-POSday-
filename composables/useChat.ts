// composables/useChat.ts
import { ref, computed } from 'vue'
import type { ChatMessage, ChatSession } from '../types/chat'
import { useSignalR } from './useSignalR'
import { useFetch } from '#app'

export function useChat() {
  const { connect, on, send } = useSignalR()

  const sessions = ref<ChatSession[]>([])
  const messages = ref<ChatMessage[]>([])
  const activeSessionId = ref<string | null>(null)

  /* ================= COMPUTED ================= */

  const waitingSessions = computed(() =>
    sessions.value.filter(s => s.status === 'waiting')
  )

  const assignedSessions = computed(() =>
    sessions.value.filter(s => s.status === 'assigned')
  )

  /* ================= INIT ================= */

  const init = async () => {
    await connect()

    // 🔹 ดึง session จาก backend
    const { data } = await useFetch<ChatSession[]>('/api/chat/session')
    if (data.value) sessions.value = data.value

    // 🔹 รับข้อความ realtime
    on('ReceiveMessage', (msg: ChatMessage) => {
      if (msg.sessionId === activeSessionId.value) {
        messages.value.push(msg)
      }

      const session = sessions.value.find(s => s.id === msg.sessionId)
      if (session) {
        session.lastMessage = msg.text
        session.hasUnread = msg.sessionId !== activeSessionId.value
      }
    })
  }

  /* ================= ACTIONS ================= */

  const selectSession = async (sessionId: string) => {
    activeSessionId.value = sessionId

    const { data } = await useFetch<ChatMessage[]>(
      `/api/chat/session/${sessionId}/messages`
    )

    messages.value = data.value ?? []

    const session = sessions.value.find(s => s.id === sessionId)
    if (session) session.hasUnread = false
  }

  const sendMessage = async (text: string) => {
    if (!activeSessionId.value) return

    await send('SendMessage', {
      sessionId: activeSessionId.value,
      text
    })
  }

  const acceptSession = async (sessionId: string) => {
    await useFetch('/api/chat/accept', {
      method: 'POST',
      body: { sessionId }
    })
  }

  const closeSession = async (sessionId: string) => {
    await useFetch('/api/chat/close', {
      method: 'POST',
      body: { sessionId }
    })
  }

  return {
    init,
    sessions,
    waitingSessions,
    assignedSessions,
    messages,
    activeSessionId,
    selectSession,
    sendMessage,
    acceptSession,
    closeSession
  }
}
