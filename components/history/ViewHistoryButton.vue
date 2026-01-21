<template>
  <button class="text-white px-1 py-1 w-8 h-8 bg-gray-400 rounded-lg mr-2" @click="$emit('click')">
    <span class="material-symbols-outlined">
      history
    </span>
  </button>

  <button class="text-white px-1 py-1 w-8 h-8 bg-red-500 rounded-lg" @click="$emit('click')">
    <span class="material-symbols-outlined">
      close_small
    </span>
  </button>
</template>