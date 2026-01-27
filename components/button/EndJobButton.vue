<template>
    <div class="p-4 mt-auto">
      <button
  class="w-full text-white bg-red-500 hover:bg-red-600 rounded-lg py-2"
  @click="emit('end')"
>
  จบงาน
</button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'end'): void
}>()
</script>