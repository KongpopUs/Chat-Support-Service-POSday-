<template>
  <div class="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">

    <ChatHeader />

    <div class="flex-1 min-h-0 bg-white relative">

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

      <!-- Error message -->
      <div
        v-if="error"
        class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {{ error }}
      </div>

    </div>

    <ChatInputBar
      :disabled="!session || session.status === 'closed'"
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

    <BackdropBlur v-if="showMenu" @click="closeMenu" />

    <!-- Rating Modal -->
    <Rating
      v-if="showRating"
      @close="showRating = false"
      @submit="handleRatingSubmit"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChatUser } from '~/composables/useChatUser'
import ChatHeader from '~/components/chat/ChatHeader.vue'
import ChatMessageList from '~/components/chat/ChatMessageList.vue'
import ChatInputBar from '~/components/chat/ChatInputBar.vue'
import ChatMenu from '~/components/chat/ChatMenu.vue'
import BackdropBlur from '~/components/ui/BackdropBlur.vue'
import Rating from '~/components/modal/Rating.vue'

// ⚠️ TODO: Get customer ID from auth/session
const CUSTOMER_ID = 'customer-123'

const {
  session,
  messages,
  customerInfo,
  loading,
  error,
  sendMessage,
  uploadImage,
  uploadFile,
  submitRating
} = useChatUser(CUSTOMER_ID)

const showMenu = ref(false)
const showRating = ref(false)

const toggleMenu = () => (showMenu.value = !showMenu.value)
const closeMenu = () => (showMenu.value = false)

const handleSendMessage = async (text: string) => {
  await sendMessage(text)
}

const handleUploadImage = async (file: File) => {
  await uploadImage(file)
}

const handleUploadFile = async (file: File) => {
  await uploadFile(file)
}

const handleRatingSubmit = async (payload: { rating: number; comment: string }) => {
  if (!session.value) return
  await submitRating(payload.rating, payload.comment)
  showRating.value = false
}

// Listen for session completion from support
onMounted(() => {
  // TODO: Listen to SignalR event for showing rating modal
})
</script>