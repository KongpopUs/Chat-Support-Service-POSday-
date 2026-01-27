<template>
  <div
    class="items-center p-2 grid grid-cols-[3rem_1fr_auto] bg-white border-b border-gray-200"
  >
    <div
      class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm m-3 font-semibold"
    >
      {{ avatar || name?.charAt(0).toUpperCase() || '?' }}
    </div>

    <div class="flex flex-col overflow-hidden m-2">
      <div class="font-medium truncate">
        {{ name || 'ไม่ระบุ' }}
      </div>

      <div class="flex flex-wrap gap-x-4">
        <div
          v-if="merchantId"
          class="flex text-gray-500 text-sm truncate"
        >
          Merchant :
          <span class="text-sky-500 ml-1">
            {{ merchantId }}
          </span>
        </div>

        <div
          v-if="phone"
          class="flex text-gray-500 text-sm truncate"
        >
          เบอร์โทรศัพท์ :
          <span class="text-sky-500 ml-1">
            {{ phone }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="supportTime"
      class="text-gray-500 text-sm flex items-center min-w-0 mr-3"
    >
      ระยะเวลาที่ Support :
      <span class="text-sky-500 ml-1">
        {{ supportTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
  merchantId?: string
  phone?: string
  supportTime?: string
  avatar?: string
}>()
</script>