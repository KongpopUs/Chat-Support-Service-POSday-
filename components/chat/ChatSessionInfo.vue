<template>
    <div
      class="items-center p-2 grid grid-cols-[3rem_1fr_auto] bg-white border-b border-gray-200"
    >

      <div
        class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm m-3"
      >
        {{ avatar }}
      </div>

      <div class="flex flex-col overflow-hidden m-2">
        <div class="font-medium truncate">
          {{ name }}
        </div>
  
        <div class="flex flex-wrap">
          <div class="flex text-gray-500 text-sm truncate mr-2">
            Merchant :
            <span class="text-sky-500 ml-1">
              {{ merchantId }}
            </span>
          </div>
  
          <div class="flex text-gray-500 text-sm truncate">
            เบอร์โทรศัพท์ :
            <span class="text-sky-500 ml-1">
              {{ phone }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-gray-500 text-sm flex items-center min-w-0">
        ระยะเวลาที่ Support :
        <span class="text-sky-500 mr-3 ml-1">
          {{ supportTime }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    name: String,
    merchantId: String,
    phone: String,
    supportTime: String,
    avatar: {
      type: String,
      default: ''
    }
  })
  </script>
  