<template>
  <div class="absolute bottom-14 left-0 w-48 bg-white border rounded-lg shadow-lg z-50">
    <NuxtLink
      :to="historyRoute"
      class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sky-500"
      @click="emit('close')"
    >
      <span class="material-symbols-outlined text-base">
        {{ menuIcon }}
      </span>
      {{ menuLabel }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()

const isSupport = computed(() =>
  route.path.startsWith('/support')
)

const historyRoute = computed(() =>
  isSupport.value
    ? '/support/supdashboard'
    : '/user/historyuser'
)

const menuLabel = computed(() =>
  isSupport.value ? 'คิวทั้งหมด' : 'ประวัติการแชท'
)

const menuIcon = computed(() =>
  isSupport.value ? 'list_alt' : 'history'
)
</script>
