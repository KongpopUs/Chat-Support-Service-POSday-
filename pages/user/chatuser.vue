<template>
  <div class="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">

    <ChatHeader />

    <div class="flex-1 min-h-0 bg-white relative">

      <ChatMessageList v-if="messages.length > 0" :messages="messages" />

      <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 text-center px-6">
        <div>
          <p class="text-lg font-medium">ยังไม่มีข้อความ</p>
          <p class="text-sm mt-1">
            พิมพ์ข้อความเพื่อเริ่มต้นการสนทนา
          </p>
        </div>
      </div>

    </div>


    <ChatInputBar @send="handleSendMessage" @toggleMenu="toggleMenu" @openFile="showFileModal = true"
      @openImage="showImageModal = true">
      <template #menu>
        <ChatMenu v-if="showMenu" @close="closeMenu" />
      </template>
    </ChatInputBar>

    <ImageModal v-if="showImageModal" :images="images" @close="showImageModal = false" />

    <FileModal v-if="showFileModal" @close="showFileModal = false" />

    <BackdropBlur v-if="showMenu" @click="closeMenu" />

  </div>
</template>


<script setup>
import { ref } from 'vue'

import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatInputBar from '@/components/chat/ChatInputBar.vue'
import ChatMenu from '@/components/chat/ChatMenu.vue'
import ImageModal from '@/components/modal/ImageModal.vue'
import FileModal from '@/components/modal/FileModal.vue'
import BackdropBlur from '@/components/ui/BackdropBlur.vue'

const showMenu = ref(false)
const showImageModal = ref(false)
const showFileModal = ref(false)

const toggleMenu = () => (showMenu.value = !showMenu.value)
const closeMenu = () => (showMenu.value = false)

const messages = ref([])

const isTyping = ref(false)

const handleSendMessage = (text) => {
  messages.value.push({
    text,
    isMe: true,
    createdAt: new Date()
  })

  // mock reply
  setTimeout(() => {
    messages.value.push({
      text: 'รับทราบค่ะ เดี๋ยวตรวจสอบให้สักครู่นะคะ 🙏',
      isMe: false,
      createdAt: new Date()
    })
  }, 500)
}


const images = [
  'image01.jpg',
  'image02.jpg',
  'image03.jpg',
  'image04.jpg',
  'image05.jpg',
  'image06.jpg',
  'image07.jpg',
  'image08.jpg'
]
</script>