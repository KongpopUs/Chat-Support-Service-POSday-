<template>
  <div class="bg-white p-3 flex justify-between items-center border-b border-gray-200">

    <div class="flex cursor-pointer" @click="logOut">
      <h2 class="text-2xl text-orange-500 font-semibold mr-1">POSDAY</h2>
      <h2 class="text-2xl text-sky-400 font-semibold">Service</h2>
    </div>

    <button @click="goBack" class="material-symbols-outlined text-stone-700 text-3xl">
      close
    </button>

  </div>
</template>

<script setup>
import { useRoute } from '#imports'
import { navigateTo } from '#imports'

const route = useRoute()

const goBack = () => {
  if (route.path.startsWith('/support')) {
    navigateTo('/support/chatsupport')
  } else {
    navigateTo('/user/chatuser')
  }
}

const logOut = () => {
  navigateTo('/')
}
</script>
