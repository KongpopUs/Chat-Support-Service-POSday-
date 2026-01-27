<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-xl rounded-xl shadow-lg flex flex-col">

      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">ประเมินความพึงพอใจ</h3>
        <button @click="$emit('close')" :disabled="submitting">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">

        <!-- Rating -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-sm text-gray-600">โปรดเลือกความพึงพอใจในการใช้งาน Chat Support Service</p>

          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="rating = star"
              :disabled="submitting"
              class="material-symbols-outlined text-4xl transition hover:scale-110"
              :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              star
            </button>
          </div>

          <p class="text-sm text-gray-500">
            คะแนนที่เลือก : {{ rating || '-' }}
          </p>
        </div>

        <!-- Comment -->
        <div>
          <label class="block text-sm font-medium mb-1">
            ความคิดเห็นเพิ่มเติม
          </label>
          <textarea
            v-model="comment"
            rows="4"
            :disabled="submitting"
            placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
            class="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100"
          />
        </div>

      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t">
        <button
          class="px-4 py-2 w-full bg-sky-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="!rating || submitting"
          @click="submitRating"
        >
          {{ submitting ? 'กำลังส่ง...' : 'ยืนยัน' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { rating: number; comment: string }): void
}>()

const rating = ref<number>(0)
const comment = ref<string>('')
const submitting = ref(false)

const submitRating = async () => {
  if (!rating.value || submitting.value) return

  submitting.value = true

  try {
    emit('submit', {
      rating: rating.value,
      comment: comment.value
    })
    
    // Close after short delay
    setTimeout(() => {
      emit('close')
    }, 500)
    
  } finally {
    submitting.value = false
  }
}
</script>