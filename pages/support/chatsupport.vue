<template>
  <div class="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">

    <ChatHeader />

    <div class="flex flex-1 min-h-0 h-full">

      <ChatSessionList class="hidden md:block basis-1/4 border-r border-gray-200 h-full max-h-full" :sessions="sessions" @select="selectSession" />

      <div class="basis-3/3 flex flex-col min-h-0 relative w-full">

        <ChatSessionInfo name="คุณไก่ บริษัท เป็ดย่าง" merchantId="1000001" phone="023456789"
          supportTime="00:10:15 นาที" avatar="ก" />

        <ChatMessageList :messages="messages" />

        <ChatInputBar @toggleMenu="toggleMenu" @openFile="showFileModal = true" @openImage="showImageModal = true">
          <template #menu>
            <ChatMenu v-if="showMenu" @close="closeMenu" />
          </template>
        </ChatInputBar>

        <ImageModal v-if="showImageModal" :images="images" @close="showImageModal = false" />

        <FileModal v-if="showFileModal" @close="showFileModal = false" />

        <BackdropBlur v-if="showMenu" @click="closeMenu" />

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatSessionList from '@/components/chat/ChatSessionList.vue'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatInputBar from '@/components/chat/ChatInputBar.vue'
import ChatMenu from '@/components/chat/ChatMenu.vue'
import ChatSessionInfo from '@/components/chat/ChatSessionInfo.vue'


import ImageModal from '@/components/modal/ImageModal.vue'
import FileModal from '@/components/modal/FileModal.vue'
import BackdropBlur from '@/components/ui/BackdropBlur.vue'

const showMenu = ref(false)
const showImageModal = ref(false)
const showFileModal = ref(false)

const sessions = ref([
  {
    id: 1,
    name: 'คุณไก่ บริษัท เป็ดย่าง',
    lastMessage: 'สวัสดีค่ะ มีเรื่องจะสอบถาม...',
    avatar: 'K',
    hasUnread: true
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },
  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },  {
    id: 2,
    name: 'คุณหมู บริษัท หมูกรอบ',
    lastMessage: 'ระบบเข้าไม่ได้ครับ',
    avatar: 'M',
    hasUnread: false
  },

])

const selectSession = (session) => {
  console.log('เลือกห้อง:', session)
}

const messages = ref([
  { text: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ', isMe: false },
  { text: 'ผมมีปัญหาเรื่องการใช้งานระบบครับ', isMe: true }
])

const toggleMenu = () => (showMenu.value = !showMenu.value)
const closeMenu = () => (showMenu.value = false)

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
