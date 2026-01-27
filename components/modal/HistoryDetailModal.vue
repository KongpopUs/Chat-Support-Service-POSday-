<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-3xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
  
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">ประวัติการสนทนา - {{ session.queueNo }}</h3>
          <button @click="$emit('close')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
  
        <!-- Session Info -->
        <div class="p-4 border-b bg-gray-50">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600">ชื่อพนักงาน:</span>
              <span class="text-sky-500 ml-1">{{ session.supportName || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-600">เวลาสนทนา:</span>
              <span class="text-sky-500 ml-1">{{ session.chatDuration || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-600">คะแนน:</span>
              <span class="text-yellow-500 ml-1">
                {{ session.rating ? `${session.rating} ⭐` : '-' }}
              </span>
            </div>
          </div>
        </div>
  
        <!-- Messages (Read-only) -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender === 'customer' ? 'justify-start' : 'justify-end'"
          >
            <div
              class="max-w-xs px-4 py-2 rounded-2xl text-sm"
              :class="msg.sender === 'customer'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-sky-500 text-white'
              "
            >
              <p>{{ msg.text }}</p>
              <div class="text-[10px] mt-1 opacity-70">
                {{ formatTime(msg.createdAt) }}
              </div>
            </div>
          </div>
  
          <div v-if="loading" class="flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
          </div>
        </div>
  
        <div class="p-4 border-t">
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded-lg w-full"
            @click="$emit('close')"
          >
            ปิด
          </button>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import type { ChatSession, ChatMessage } from '~/types/chat'
  import { apiService } from '~/services/api.service'
  
  const props = defineProps<{
    session: ChatSession
  }>()
  
  defineEmits<{
    (e: 'close'): void
  }>()
  
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  
  const loadMessages = async () => {
    try {
      loading.value = true
      messages.value = await apiService.getChatMessages(props.session.id)
    } catch (err) {
      console.error('❌ Load messages error:', err)
    } finally {
      loading.value = false
    }
  }
  
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  onMounted(() => {
    loadMessages()
  })
  </script>