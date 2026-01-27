<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">
  
      <div class="bg-white p-3 flex justify-between items-center border-b border-gray-200">
        <h2 class="text-2xl text-sky-400 font-semibold">ประวัติแชท</h2>
        <NuxtLink to="/user/chatuser" class="material-symbols-outlined text-stone-700 text-3xl">
          close
        </NuxtLink>
      </div>
  
      <div class="bg-slate-100 m-2 flex-1 flex">
        <div class="bg-white rounded-lg flex flex-col w-full flex-1 min-h-0">
  
          <div class="flex flex-wrap p-3">
            <div class="flex text-base truncate mr-2">
              ประวัติแชท
              <span class="text-gray-500 ml-1">จำนวน</span>
              <span class="text-sky-500 ml-1">{{ history.length }}</span>
            </div>
          </div>
  
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
  
          <!-- Table -->
          <div v-else class="bg-white rounded-lg mx-3 overflow-x-auto flex-1 min-h-0">
            <table class="min-w-full">
              <thead class="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left">ลำดับ</th>
                  <th class="px-4 py-2 text-left">เลขที่คิว</th>
                  <th class="px-4 py-2 text-left">ชื่อพนักงาน</th>
                  <th class="px-4 py-2 text-left">เวลาสนทนา</th>
                  <th class="px-4 py-2 text-left">เวลาเริ่มต้น</th>
                  <th class="px-4 py-2 text-left">เวลาสิ้นสุด</th>
                  <th class="px-4 py-2 text-center">คำสั่ง</th>
                </tr>
              </thead>
  
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in paginatedData"
                  :key="item.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 text-sm">
                    {{ (currentPage - 1) * rowsPerPage + index + 1 }}
                  </td>
                  <td class="px-4 py-2 text-sm">{{ item.queueNo }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.supportName || '-' }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.chatDuration || '-' }}</td>
                  <td class="px-4 py-2 text-sm">{{ formatDateTime(item.startDate, item.startTime) }}</td>
                  <td class="px-4 py-2 text-sm">{{ formatDateTime(item.endDate, item.endTime) }}</td>
                  <td class="px-4 py-2 text-center">
                    <button
                      class="text-white px-2 py-1 bg-gray-400 hover:bg-gray-500 rounded-lg"
                      @click="viewHistory(item)"
                    >
                      <span class="material-symbols-outlined text-sm">history</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- Empty state -->
            <div
              v-if="history.length === 0"
              class="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <span class="material-symbols-outlined text-5xl mb-2">history</span>
              <p>ยังไม่มีประวัติการแชท</p>
            </div>
          </div>
  
          <!-- Pagination -->
          <div class="mt-auto">
            <NextPageButton
              :currentPage="currentPage"
              :totalPages="totalPages"
              @update:page="currentPage = $event"
            />
          </div>
  
        </div>
      </div>
  
      <!-- History Detail Modal -->
      <HistoryDetailModal
        v-if="selectedHistory"
        :session="selectedHistory"
        @close="selectedHistory = null"
      />
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import type { ChatSession } from '~/types/chat'
  import { apiService } from '~/services/api.service'
  import NextPageButton from '~/components/button/NextPageButton.vue'
  import HistoryDetailModal from '~/components/modal/HistoryDetailModal.vue'
  
  // ⚠️ TODO: Get customer ID from auth
  const CUSTOMER_ID = 'customer-123'
  
  const history = ref<ChatSession[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const rowsPerPage = 15
  const selectedHistory = ref<ChatSession | null>(null)
  
  const totalPages = computed(() =>
    Math.ceil(history.value.length / rowsPerPage)
  )
  
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    return history.value.slice(start, start + rowsPerPage)
  })
  
  const loadHistory = async () => {
    try {
      loading.value = true
      history.value = await apiService.getChatHistory(CUSTOMER_ID)
    } catch (err) {
      console.error('❌ Load history error:', err)
    } finally {
      loading.value = false
    }
  }
  
  const viewHistory = (item: ChatSession) => {
    selectedHistory.value = item
  }
  
  const formatDateTime = (date?: string, time?: string) => {
    if (!date || !time) return '-'
    return `${date} ${time}`
  }
  
  onMounted(() => {
    loadHistory()
  })
  </script>