<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-xl rounded-xl shadow-lg flex flex-col">

      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">ประเมินความพึงพอใจ</h3>
        <button @click="$emit('close')">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">

        <!-- Rating -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-sm text-gray-600">โปรดเลือกความพึงพอใจในการใช้งาน Chat Supoort Service</p>

          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="rating = star"
              class="material-symbols-outlined text-4xl transition"
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
            placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
            class="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t">
        <button
          class="px-4 py-2 w-full bg-sky-500 text-white rounded-lg"
          :disabled="!rating"
          @click="submitRating"
        >
          ยืนยัน
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rating = ref(0)
const comment = ref('')

const submitRating = () => {
  const payload = {
    rating: rating.value,
    comment: comment.value
  }

  console.log('submit rating:', payload)

  // TODO:
  // - ส่ง API
  // - emit กลับ parent
}
</script>
