<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">

        <ChatHeader />

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

const messages = ref([
    { text: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ', isMe: false },
    { text: 'ผมมีปัญหาเรื่องการใช้งานระบบครับ', isMe: true }
])

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