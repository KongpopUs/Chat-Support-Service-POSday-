<template>
  <div class="absolute bottom-14 left-0 w-48 bg-white border rounded-lg shadow-lg z-50">
    <NuxtLink
      :to="historyRoute"
      class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sky-500"
      @click="$emit('close')"
    >
      <span class="material-symbols-outlined text-base">
        {{ menuIcon }}
      </span>
      {{ menuLabel }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { useRoute } from '#imports'

const route = useRoute()

const historyRoute = computed(() => {
  if (route.path.startsWith('/user')) {
    return '/user/historyuser'
  }
  if (route.path.startsWith('/support')) {
    return '/support/supdashboard'
  }
  return '/'
})

const menuLabel = computed(() => {
  if (route.path.startsWith('/support')) {
    return 'คิวทั้งหมด'
  }
  return 'ประวัติการแชท'
})

const menuIcon = computed(() =>
  route.path.startsWith('/support') ? 'list_alt' : 'history'
)
</script>
