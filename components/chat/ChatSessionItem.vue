<template>
  <div
    class="items-center p-2 grid grid-cols-[4rem_auto_3rem] cursor-pointer hover:bg-gray-200"
    :class="{ 'bg-sky-50': isActive }"
    @click="$emit('select')"
  >
    <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center m-3 text-white font-semibold">
      {{ name.charAt(0).toUpperCase() }}
    </div>

    <div class="flex flex-col overflow-hidden">
      <div class="font-medium truncate">
        {{ name }}
      </div>
      <div class="text-gray-500 text-sm truncate">
        {{ lastMessage || '—' }}
      </div>
    </div>

    <div v-if="hasUnread" class="w-3 h-3 rounded-full bg-orange-500 m-3" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  lastMessage?: string
  hasUnread?: boolean
  isActive?: boolean
}>()

defineEmits<{ (e: 'select'): void }>()
</script>