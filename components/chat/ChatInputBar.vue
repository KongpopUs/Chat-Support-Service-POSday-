<template>
  <div class="bg-white p-3 border-t border-gray-200">
    <div class="flex items-center gap-4">

      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="relative">
          <button @click="$emit('toggleMenu')" :disabled="disabled">
            <span class="material-symbols-outlined text-sky-500 text-3xl">
              menu
            </span>
          </button>
          <slot name="menu" />
        </div>

        <button @click="handleFileClick" :disabled="disabled">
          <span class="material-symbols-outlined text-sky-500 text-3xl">
            attach_file
          </span>
        </button>

        <button @click="handleImageClick" :disabled="disabled">
          <span class="material-symbols-outlined text-sky-500 text-3xl">
            photo
          </span>
        </button>
      </div>

      <input
        v-model="message"
        @keyup.enter="onSend"
        :disabled="disabled"
        type="text"
        placeholder="พิมพ์คำถามที่นี่..."
        class="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-sky-500
               disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <button
        @click="onSend"
        :disabled="!message.trim() || disabled || sending"
        class="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2 rounded-lg flex-shrink-0
               disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ sending ? 'กำลังส่ง...' : 'ส่ง' }}
      </button>

    </div>

    <!-- Hidden file inputs -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFileChange"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
    />
    <input
      ref="imageInput"
      type="file"
      class="hidden"
      @change="handleImageChange"
      accept="image/*"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
  sending?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'toggleMenu'): void
  (e: 'uploadFile', file: File): void
  (e: 'uploadImage', file: File): void
}>()

const message = ref('')
const fileInput = ref<HTMLInputElement>()
const imageInput = ref<HTMLInputElement>()

const onSend = () => {
  if (!message.value.trim() || props.disabled || props.sending) return
  emit('send', message.value)
  message.value = ''
}

const handleFileClick = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleImageClick = () => {
  if (props.disabled) return
  imageInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadFile', file)
    target.value = ''
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadImage', file)
    target.value = ''
  }
}
</script>