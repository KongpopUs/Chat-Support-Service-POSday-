<template>

    <div class="items-center p-2 grid grid-cols-[4rem_auto_3rem] cursor-pointer hover:bg-gray-300">
      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm m-3">
        {{ avatar }}
      </div>
  
      <div class="flex flex-col overflow-hidden">
        <div class="font-medium truncate">
          {{ name }}
        </div>
        <div class="text-gray-500 text-sm truncate">
          {{ lastMessage }}
        </div>
      </div>
  
      <div
        v-if="hasUnread"
        class="w-4 h-4 rounded-full m-3 bg-orange-500"
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    name: String,
    lastMessage: String,
    avatar: {
      type: String,
      default: 'S'
    },
    hasUnread: Boolean
  })
  </script>
  