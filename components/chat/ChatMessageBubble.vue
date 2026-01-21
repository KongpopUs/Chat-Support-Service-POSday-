<template>
    <div :class="isMe ? 'flex justify-end' : 'flex items-start gap-2'">
      <div
        :class="[
          isMe
            ? 'bg-sky-500 text-white rounded-tr-none'
            : 'bg-white rounded-tl-none',
          'max-w-[70%] p-3 rounded-2xl shadow'
        ]"
      >
        {{ message }}
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: String,
    isMe: Boolean
  })
  </script>
  