<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">

      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">จัดการคิว</h3>
        <button @click="$emit('close')">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="px-4 py-3 bg-gray-100 overflow-y-auto flex-1">
        
        <!-- Customer Info -->
        <div class="mb-4">
          <p class="font-semibold mb-2">รายละเอียดลูกค้า</p>
          <div class="bg-white p-4 rounded-lg grid grid-cols-2 gap-4 border border-gray-200">
            
            <div class="py-2 flex">
              <span class="text-gray-600">เลขที่คิว :</span>
              <p class="text-sky-500 ml-1">
                {{ queue?.queueNo || '-' }}
              </p>
            </div>

            <div class="py-2 flex">
              <span class="text-gray-600">วันที่ :</span>
              <p class="text-sky-500 ml-1">
                {{ formatThaiDate(queue?.startDate) }}
              </p>
            </div>

            <div class="py-2 flex">
              <span class="text-gray-600">ชื่อ :</span>
              <p class="text-sky-500 ml-1">
                {{ queue?.customerName || '-' }}
              </p>
            </div>

            <div class="py-2 flex">
              <span class="text-gray-600">รหัสร้านค้า :</span>
              <p class="text-sky-500 ml-1">
                {{ queue?.merchantId || '-' }}
              </p>
            </div>

            <div class="py-2 flex">
              <span class="text-gray-600">เบอร์โทรศัพท์ :</span>
              <p class="text-sky-500 ml-1">
                {{ queue?.phone || '-' }}
              </p>
            </div>

            <div class="py-2 flex">
              <span class="text-gray-600">เวลาขอรับบริการ :</span>
              <p class="text-sky-500 ml-1">
                {{ formatThaiTime(queue?.startDate) }}
              </p>
            </div>

          </div>
        </div>

        <!-- Chat Preview -->
        <div class="mb-4">
          <p class="font-semibold mb-2">รายละเอียดการสนทนา</p>
          <div class="bg-white p-3 rounded-lg min-h-[160px] max-h-[200px] overflow-y-auto border border-gray-200">
            <div v-if="messages && messages.length > 0">
              <p
                v-for="msg in messages"
                :key="msg.id"
                class="py-2 text-gray-600 text-sm"
              >
                {{ msg.text }}
              </p>
            </div>
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <p class="text-sm">ยังไม่มีข้อความ</p>
            </div>
          </div>
        </div>

      </div>

      <div class="p-4 border-t">
        <button
          class="px-4 py-2 bg-sky-500 text-white rounded-lg w-full hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="$emit('accept')"
        >
          {{ loading ? 'กำลังรับงาน...' : 'รับงาน' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatSession, ChatMessage } from '~/types/chat'

const props = withDefaults(
  defineProps<{
    queue: ChatSession | null
    messages?: ChatMessage[]
    loading?: boolean
  }>(),
  {
    messages: () => [],
    loading: false
  }
)

defineEmits<{
  (e: 'close'): void
  (e: 'accept'): void
}>()

const formatThaiDate = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)

  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatThaiTime = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)

  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}
</script>