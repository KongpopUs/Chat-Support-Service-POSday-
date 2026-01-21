<template>
    <div class="absolute bottom-14 left-0 w-48 bg-white border rounded-lg shadow-lg z-50">
      <NuxtLink
        to="/user/historyuser"
        class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sky-500"
        @click="$emit('close')"
      >
        <span class="material-symbols-outlined text-base">
          history
        </span>
        ประวัติการแชท
      </NuxtLink>
    </div>
  </template>
  