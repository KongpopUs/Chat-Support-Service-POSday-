<template>
    <div class=" bg-white flex-1 overflow-y-auto p-4 space-y-4 m-2 rounded-lg">
      <ChatMessageBubble
        v-for="(msg, index) in messages"
        :key="index"
        :message="msg.text"
        :isMe="msg.isMe"
      />
    </div>
  </template>
  
  <script setup>
  import ChatMessageBubble from './ChatMessageBubble.vue'
  
  defineProps({
    messages: Array
  })
  </script>