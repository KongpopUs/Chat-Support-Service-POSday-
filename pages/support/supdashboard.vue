<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">
  
      <ChatHeader />
  
      <div class="bg-slate-100 m-2 flex-1 flex flex-col">
  
        <!-- SUMMARY -->
        <div class="grid grid-cols-3 gap-2 mb-2">
          <div
            class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-sky-300 transition"
            @click="selectTab('all')"
          >
            <div class="text-lg flex mx-3 my-3">
              <span class="material-symbols-outlined mr-2 text-sky-500">list_alt</span>
              คิวทั้งหมด
            </div>
            <div class="flex justify-center mb-8 text-xl text-sky-500">
              {{ queues.length }}
            </div>
          </div>
  
          <div
            class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
            @click="selectTab('progress')"
          >
            <div class="text-lg flex mx-3 my-3">
              <span class="material-symbols-outlined mr-2 text-orange-500">schedule</span>
              ดำเนินการ
            </div>
            <div class="flex justify-center mb-8 text-xl text-orange-500">
              {{ inProgressCount }}
            </div>
          </div>
  
          <div
            class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-green-300 transition"
            @click="selectTab('done')"
          >
            <div class="text-lg flex mx-3 my-3">
              <span class="material-symbols-outlined mr-2 text-green-500">check_circle</span>
              สำเร็จ
            </div>
            <div class="flex justify-center mb-8 text-xl text-green-500">
              {{ completedCount }}
            </div>
          </div>
        </div>
  
        <!-- TABLE -->
        <div class="bg-white rounded-lg flex flex-col w-full flex-1 min-h-0">
  
          <!-- SEARCH -->
          <div class="mx-3 mt-3 relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-500">
              search
            </span>
            <input
              v-model="searchText"
              type="text"
              placeholder="ค้นหาเลขที่คิว, ชื่อลูกค้า, เลขสมาชิก..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
  
          <!-- TABS -->
          <div class="flex mx-3 mt-3 gap-3 border-b border-gray-300">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              class="w-24 pb-2 transition"
              :class="activeTab === tab.value
                ? 'text-sky-500 border-b-2 border-sky-500 font-semibold'
                : 'text-gray-400 hover:text-sky-400'"
            >
              {{ tab.label }}
            </button>
          </div>
  
          <!-- COUNT -->
          <div class="flex flex-wrap p-3 text-base">
            {{ tabLabel }}
            <span class="text-gray-500 ml-1">จำนวน</span>
            <span class="text-sky-500 ml-1">{{ filteredData.length }}</span>
          </div>
  
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
  
          <!-- TABLE -->
          <div v-else class="bg-white rounded-lg mx-3 overflow-x-auto flex-1 min-h-0">
            <table class="min-w-full">
              <thead class="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left">ลำดับ</th>
                  <th class="px-4 py-2 text-left">เลขที่คิว</th>
                  <th class="px-4 py-2 text-left">ชื่อลูกค้า</th>
                  <th class="px-4 py-2 text-left">เลขสมาชิก</th>
                  <th class="px-4 py-2 text-left">รหัสร้านค้า</th>
                  <th class="px-4 py-2 text-left">เบอร์โทรศัพท์</th>
                  <th class="px-4 py-2 text-left">วันที่</th>
                  <th class="px-4 py-2 text-left">เวลาขอรับบริการ</th>
                  <th class="px-4 py-2 text-left">สถานะ</th>
                  <th class="px-4 py-2 text-center">คำสั่ง</th>
                </tr>
              </thead>
  
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in paginatedData"
                  :key="item.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 text-sm">{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.queueNo }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.customerName }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.memberNo }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.merchantId }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.phone }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.startDate }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.startTime }}</td>
                  <td class="px-4 py-2 text-sm">
                    <span
                      class="px-2 py-1 rounded-full text-xs"
                      :class="{
                        'bg-yellow-100 text-yellow-800': item.status === 'waiting',
                        'bg-orange-100 text-orange-800': item.status === 'in-progress',
                        'bg-green-100 text-green-800': item.status === 'completed'
                      }"
                    >
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
  
                  <td class="px-4 py-2 text-center">
                    <button
                      v-if="item.status === 'waiting'"
                      @click="openPreviewJob(item)"
                      class="bg-sky-500 hover:bg-sky-600 text-white rounded-lg w-full py-1"
                    >
                      รับงาน
                    </button>
  
                    <button
                      v-else-if="item.status === 'in-progress'"
                      @click="goToChat(item.id)"
                      class="bg-orange-500 hover:bg-orange-600 text-white rounded-lg w-full py-1"
                    >
                      เข้าแชท
                    </button>
  
                    <button
                      v-else
                      @click="viewHistory(item)"
                      class="bg-green-500 hover:bg-green-600 text-white rounded-lg w-full py-1"
                    >
                      ดูประวัติ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- Empty state -->
            <div
              v-if="filteredData.length === 0"
              class="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <span class="material-symbols-outlined text-5xl mb-2">inbox</span>
              <p>ไม่มีข้อมูล</p>
            </div>
          </div>
  
          <!-- PAGINATION -->
          <div class="mt-auto">
            <NextPageButton
              :currentPage="currentPage"
              :totalPages="totalPages"
              @update:page="currentPage = $event"
            />
          </div>
  
        </div>
      </div>
  
      <!-- Preview Modal -->
      <PreviewJob
        v-if="showPreviewJob && selectedSession"
        :queue="selectedSession"
        :messages="previewMessages"
        :loading="accepting"
        @close="showPreviewJob = false"
        @accept="handleAcceptJob"
      />
  
      <!-- History Modal -->
      <HistoryDetailModal
        v-if="selectedHistory"
        :session="selectedHistory"
        @close="selectedHistory = null"
      />
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import type { ChatSession, ChatMessage } from '~/types/chat'
  import { useChatSupport } from '~/composables/useChatSupport'
  import { apiService } from '~/services/api.service'
  import ChatHeader from '~/components/chat/ChatHeader.vue'
  import NextPageButton from '~/components/button/NextPageButton.vue'
  import PreviewJob from '~/components/modal/PreviewJob.vue'
  import HistoryDetailModal from '~/components/modal/HistoryDetailModal.vue'
  
  // ⚠️ TODO: Get support ID from auth
  const SUPPORT_ID = 'support-123'
  
  const router = useRouter()
  
  const {
    allSessions,
    waitingSessions,
    assignedSessions,
    completedSessions,
    queues,
    loading,
    acceptSession
  } = useChatSupport(SUPPORT_ID)
  
  const activeTab = ref('all')
  const currentPage = ref(1)
  const rowsPerPage = 15
  const searchText = ref('')
  const showPreviewJob = ref(false)
  const selectedSession = ref<ChatSession | null>(null)
  const selectedHistory = ref<ChatSession | null>(null)
  const previewMessages = ref<ChatMessage[]>([])
  const accepting = ref(false)
  
  const tabs = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'ดำเนินการ', value: 'progress' },
    { label: 'สำเร็จ', value: 'done' }
  ]
  
  // Computed
  const inProgressCount = computed(() => 
    allSessions.value.filter(s => s.status === 'in-progress').length
  )
  
  const completedCount = computed(() => 
    completedSessions.value.length
  )
  
  const currentTableData = computed(() => {
    if (activeTab.value === 'progress') {
      return allSessions.value.filter(s => s.status === 'in-progress')
    }
    if (activeTab.value === 'done') {
      return completedSessions.value
    }
    return allSessions.value
  })
  
  const filteredData = computed(() => {
    if (!searchText.value) return currentTableData.value
  
    const keyword = searchText.value.toLowerCase()
    return currentTableData.value.filter(item =>
      item.queueNo?.toLowerCase().includes(keyword) ||
      item.customerName?.toLowerCase().includes(keyword) ||
      item.memberNo?.toLowerCase().includes(keyword)
    )
  })
  
  const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / rowsPerPage)
  )
  
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    return filteredData.value.slice(start, start + rowsPerPage)
  })
  
  const tabLabel = computed(() =>
    tabs.find(t => t.value === activeTab.value)?.label
  )
  
  // Methods
  const selectTab = (tab: 'all' | 'progress' | 'done') => {
    activeTab.value = tab
    currentPage.value = 1
  }
  
  const openPreviewJob = async (session: ChatSession) => {
    selectedSession.value = session
    
    // Load preview messages
    try {
      previewMessages.value = await apiService.getChatMessages(session.id)
    } catch (err) {
      console.error('❌ Load preview messages error:', err)
    }
    
    showPreviewJob.value = true
  }
  
  const handleAcceptJob = async () => {
    if (!selectedSession.value) return
  
    try {
      accepting.value = true
      await acceptSession(selectedSession.value.id)
      showPreviewJob.value = false
      
      // Navigate to chat
      router.push('/support/chatsupport')
    } catch (err) {
      alert('รับงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      accepting.value = false
    }
  }
  
  const goToChat = (sessionId: string) => {
    router.push(`/support/chatsupport?session=${sessionId}`)
  }
  
  const viewHistory = (session: ChatSession) => {
    selectedHistory.value = session
  }
  
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'waiting': 'รอดำเนินการ',
      'in-progress': 'กำลังดำเนินการ',
      'completed': 'สำเร็จ',
      'closed': 'ปิดแล้ว'
    }
    return statusMap[status] || status
  }
  
  watch([activeTab, searchText], () => {
    currentPage.value = 1
  })
  
  onMounted(() => {
    // Data will be loaded by composable
  })
  </script>