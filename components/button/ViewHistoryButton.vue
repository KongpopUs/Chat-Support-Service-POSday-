<template>
  <button
    class="text-white px-1 py-1 w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-lg mr-2"
    @click="emit('view-history')"
  >
    <span class="material-symbols-outlined">
      history
    </span>
  </button>

  <button
    class="text-white px-1 py-1 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg"
    @click="emit('close')"
  >
    <span class="material-symbols-outlined">
      close_small
    </span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'view-history'): void
  (e: 'close'): void
}>()
</script>
