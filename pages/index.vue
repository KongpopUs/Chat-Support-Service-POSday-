<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="max-w-4xl mx-auto text-center">
      <img
        src="/posday-logo.jpeg"
        alt="POSDAY Logo"
        class="mx-auto mb-8 w-40 h-auto"
      />

      <NuxtLink
        to="/user/chatuser"
        class="inline-block bg-sky-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-sky-600 transition shadow-lg hover:shadow-xl"
      >
        Member
      </NuxtLink>
      <br>
      <br>
      
      <NuxtLink
        to="/support/chatsupport"
        class="inline-block bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-xl"
      >
        Support
      </NuxtLink>
    </div>
  </div>
</template>