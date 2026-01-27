<template>
  <div class="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">

    <ChatHeader />

    <div class="flex flex-1 min-h-0 h-full">

      <!-- Sidebar -->
      <ChatSessionList
        class="hidden md:block basis-1/4 border-r border-gray-200 h-full max-h-full"
        :assignedSessions="assignedSessions"
        :activeSessionId="activeSession?.id"
        @select="handleSelectSession"
      />

      <!-- Main Chat -->
      <div class="basis-3/3 flex flex-col min-h-0 relative w-full">

        <!-- Session Info -->
        <ChatSessionInfo
          v-if="activeSession"
          :name="activeSession.customerName || 'ลูกค้า'"
          :merchantId="activeSession.merchantId"
          :phone="activeSession.phone"
          :supportTime="chatDuration"
          :avatar="activeSession.customerName?.charAt(0)"
        />

        <!-- Empty state -->
        <div
          v-if="!activeSession"
          class="flex-1 flex items-center justify-center text-gray-400"
        >
          <div class="text-center">
            <span class="material-symbols-outlined text-6xl mb-2">chat_bubble_outline</span>
            <p class="text-lg">เลือกแชทจากด้านซ้าย</p>
          </div>
        </div>

        <!-- Messages -->
        <div v-else class="flex-1 min-h-0 bg-white relative">
          <ChatMessageList
            v-if="messages.length > 0"
            :messages="messages"
            :loading="loading"
          />

          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-gray-400 text-center px-6"
          >
            <div>
              <p class="text-lg font-medium">ยังไม่มีข้อความ</p>
              <p class="text-sm mt-1">พิมพ์ข้อความเพื่อเริ่มต้นการสนทนา</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <ChatInputBar
          v-if="activeSession"
          :disabled="!activeSession || activeSession.status === 'completed'"
          :sending="loading"
          @send="handleSendMessage"
          @toggleMenu="toggleMenu"
          @uploadFile="handleUploadFile"
          @uploadImage="handleUploadImage"
        >
          <template #menu>
            <ChatMenu v-if="showMenu" @close="closeMenu" />
          </template>
        </ChatInputBar>

        <!-- End Job Button -->
        <EndJobButton
          v-if="activeSession && activeSession.status === 'in-progress'"
          @end="handleEndJob"
        />

        <BackdropBlur v-if="showMenu" @click="closeMenu" />

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChatSupport } from '~/composables/useChatSupport'
import ChatHeader from '~/components/chat/ChatHeader.vue'
import ChatSessionList from '~/components/chat/ChatSessionList.vue'
import ChatSessionInfo from '~/components/chat/ChatSessionInfo.vue'
import ChatMessageList from '~/components/chat/ChatMessageList.vue'
import ChatInputBar from '~/components/chat/ChatInputBar.vue'
import ChatMenu from '~/components/chat/ChatMenu.vue'
import EndJobButton from '~/components/button/EndJobButton.vue'
import BackdropBlur from '~/components/ui/BackdropBlur.vue'

// ⚠️ TODO: Get support ID from auth
const SUPPORT_ID = 'support-123'

const {
  assignedSessions,
  messages,
  activeSession,
  loading,
  selectSession,
  sendMessage,
  uploadImage,
  uploadFile,
  completeSession
} = useChatSupport(SUPPORT_ID)

const showMenu = ref(false)
const chatStartTime = ref<Date | null>(null)
const chatDuration = ref('00:00:00')

const toggleMenu = () => (showMenu.value = !showMenu.value)
const closeMenu = () => (showMenu.value = false)

const handleSelectSession = async (sessionId: string) => {
  await selectSession(sessionId)
  chatStartTime.value = new Date()
  updateChatDuration()
}

const handleSendMessage = async (text: string) => {
  await sendMessage(text)
}

const handleUploadImage = async (file: File) => {
  await uploadImage(file)
}

const handleUploadFile = async (file: File) => {
  await uploadFile(file)
}

const handleEndJob = async () => {
  if (!activeSession.value) return

  const confirmed = confirm('คุณต้องการจบงานนี้ใช่หรือไม่?')
  if (!confirmed) return

  await completeSession(activeSession.value.id)
  chatStartTime.value = null
  chatDuration.value = '00:00:00'
}

// Update chat duration every second
let durationInterval: NodeJS.Timeout | null = null

const updateChatDuration = () => {
  if (durationInterval) clearInterval(durationInterval)

  durationInterval = setInterval(() => {
    if (!chatStartTime.value) return

    const now = new Date()
    const diff = now.getTime() - chatStartTime.value.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    chatDuration.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

watch(activeSession, (newSession) => {
  if (!newSession) {
    if (durationInterval) clearInterval(durationInterval)
    chatDuration.value = '00:00:00'
  }
})
</script>