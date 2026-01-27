<template>
  <div
    ref="chatContainer"
    class="h-full overflow-y-auto p-4 space-y-4"
  >
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="flex"
      :class="msg.sender === 'support' || msg.sender === 'customer'
        ? (msg.sender === 'support' ? 'justify-end' : 'justify-start')
        : 'justify-center'
      "
    >
      <!-- System message -->
      <div
        v-if="msg.sender === 'system'"
        class="max-w-lg px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm text-center"
      >
        <p>{{ msg.text }}</p>
      </div>

      <!-- User/Support message -->
      <div
        v-else
        class="max-w-xs px-4 py-2 rounded-2xl text-sm"
        :class="msg.sender === 'support'
          ? 'bg-sky-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
        "
      >
        <!-- Image -->
        <img
          v-if="msg.imageUrl"
          :src="msg.imageUrl"
          class="rounded-lg mb-2 max-w-full"
          alt="Image"
        />

        <!-- File -->
        <a
          v-if="msg.fileUrl"
          :href="msg.fileUrl"
          target="_blank"
          class="flex items-center gap-2 underline mb-2"
        >
          <span class="material-symbols-outlined text-base">
            attach_file
          </span>
          ดาวน์โหลดไฟล์
        </a>

        <!-- Text -->
        <p v-if="msg.text">{{ msg.text }}</p>

        <!-- Timestamp -->
        <div class="text-[10px] mt-1 text-right opacity-70">
          {{ formatTime(msg.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ChatMessage } from '~/types/chat'

const props = defineProps<{
  messages: ChatMessage[]
  loading?: boolean
}>()

const chatContainer = ref<HTMLDivElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(
  () => props.messages.length,
  () => {
    scrollToBottom()
  }
)

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>