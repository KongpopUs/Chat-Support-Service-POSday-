import { ref } from "vue"
import type { ChatSession, ChatMessage } from "../types/chat"

// ===== STATE กลาง =====
const sessions = ref<ChatSession[]>([])
const messages = ref<ChatMessage[]>([])
const activeSession = ref<ChatSession | null>(null)

export function useChat() {

  // ===== ACTIONS =====
  const selectSession = (session: ChatSession) => {
    activeSession.value = session
    messages.value = session.messages ?? []
  }

  const sendMessage = (text: string) => {
    if (!text || !activeSession.value) return

    const msg: ChatMessage = {
      sender: "support",
      text,
      createdAt: new Date()
    }

    messages.value.push(msg)
  }

  return {
    // state
    sessions,
    messages,
    activeSession,

    // actions
    selectSession,
    sendMessage
  }
}
