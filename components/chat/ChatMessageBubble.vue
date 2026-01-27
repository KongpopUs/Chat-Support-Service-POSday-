<template>
  <div
    class="flex"
    :class="isSupport ? 'justify-end' : 'items-start gap-2'"
  >
    <div
      :class="[
        isSupport
          ? 'bg-sky-500 text-white rounded-tr-none'
          : 'bg-white text-gray-800 rounded-tl-none',
        'max-w-[70%] p-3 rounded-2xl shadow'
      ]"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '../../types/chat'
import { computed } from 'vue'

const props = defineProps<{
  message: ChatMessage
}>()

const isSupport = computed(() => props.message.sender === 'support')
</script>
