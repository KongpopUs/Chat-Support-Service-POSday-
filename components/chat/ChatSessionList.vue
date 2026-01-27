<template>
  <div class="bg-white flex flex-col h-full">
    <div class="p-3 border-b border-gray-200">
      <h3 class="font-semibold text-base text-gray-600">แชทที่รับแล้ว</h3>
    </div>

    <div class="flex-1 overflow-y-auto">
      <!-- Empty state -->
      <div
        v-if="assignedSessions.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-400 p-4"
      >
        <span class="material-symbols-outlined text-5xl mb-2">
          chat_bubble_outline
        </span>
        <p class="text-sm text-center">ยังไม่มีแชทที่รับ</p>
      </div>

      <!-- Sessions list -->
      <ChatSessionItem
        v-for="session in assignedSessions"
        :key="session.id"
        :name="session.customerName || 'ลูกค้า'"
        :lastMessage="session.lastMessage"
        :hasUnread="session.hasUnread"
        :isActive="activeSessionId === session.id"
        @select="$emit('select', session.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatSession } from '~/types/chat'
import ChatSessionItem from './ChatSessionItem.vue'

defineProps<{
  assignedSessions: ChatSession[]
  activeSessionId?: string | null
}>()

defineEmits<{
  (e: 'select', sessionId: string): void
}>()
</script>