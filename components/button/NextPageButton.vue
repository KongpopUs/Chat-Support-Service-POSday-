<template>
    <div class="flex justify-center items-center text-gray-500 m-4 p-3 gap-1">
      <!-- First -->
      <button @click="goFirst" :disabled="currentPage === 1">
        <span class="material-symbols-outlined p-1 hover:bg-slate-100 w-8 h-8 rounded-full">
          keyboard_double_arrow_left
        </span>
      </button>
  
      <!-- Prev -->
      <button @click="goPrev" :disabled="currentPage === 1">
        <span class="material-symbols-outlined p-1 hover:bg-slate-100 w-8 h-8 rounded-full">
          keyboard_arrow_left
        </span>
      </button>
  
      <!-- Page numbers (limit = 3) -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goPage(page)"
        class="w-8 h-8 rounded-full"
        :class="page === currentPage
          ? 'bg-sky-100 text-sky-600'
          : 'hover:bg-slate-100 text-gray-600'"
      >
        {{ page }}
      </button>
  
      <!-- Next -->
      <button @click="goNext" :disabled="currentPage === totalPages">
        <span class="material-symbols-outlined p-1 hover:bg-slate-100 w-8 h-8 rounded-full">
          keyboard_arrow_right
        </span>
      </button>
  
      <!-- Last -->
      <button @click="goLast" :disabled="currentPage === totalPages">
        <span class="material-symbols-outlined p-1 hover:bg-slate-100 w-8 h-8 rounded-full">
          keyboard_double_arrow_right
        </span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    currentPage: number
    totalPages: number
  }>()
  
  const emit = defineEmits<{
    (e: 'update:page', page: number): void
  }>()
  
  /* 🔥 จำกัดเลขหน้าแค่ 3 ตัว */
  const visiblePages = computed(() => {
    const pages: number[] = []
    let start = Math.max(props.currentPage - 1, 1)
    let end = Math.min(start + 2, props.totalPages)
  
    // กรณีท้าย ๆ เช่น totalPages = 10, current = 10
    start = Math.max(end - 2, 1)
  
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  
    return pages
  })
  
  const goFirst = () => emit('update:page', 1)
  const goLast = () => emit('update:page', props.totalPages)
  const goPrev = () => emit('update:page', props.currentPage - 1)
  const goNext = () => emit('update:page', props.currentPage + 1)
  const goPage = (page: number) => emit('update:page', page)
  </script>
  