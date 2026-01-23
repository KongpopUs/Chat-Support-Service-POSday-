<template>
    <div class="h-full overflow-y-auto p-2 space-y-4 chant-high">
    <div
      v-for="(msg, index) in messages"
      :key="index"
      class="flex"
      :class="msg.isMe ? 'justify-end' : 'justify-start'"
    >
      <div
        class="max-w-xs px-4 py-2 rounded-2xl text-sm"
        :class="msg.isMe
          ? 'bg-sky-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
        "
      >
        <p>{{ msg.text }}</p>

        <div class="text-[10px] mt-1 text-right opacity-70">
          {{ formatTime(msg.createdAt) }}
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
    defineProps({
      messages: {
        type: Array,
        required: true
      }
    })
    
    const formatTime = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    </script>
    