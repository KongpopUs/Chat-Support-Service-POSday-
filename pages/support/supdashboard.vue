<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">

        <ChatHeader />

        <div class="bg-slate-100 m-2 flex-1 flex flex-col">

            <!-- SUMMARY -->
            <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-sky-300 transition"
                    @click="selectTab('all')">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-sky-500">list_alt</span>
                        คิวทั้งหมด
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-sky-500">
                        {{ dataAll.length }}
                    </div>
                </div>

                <div class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
                    @click="selectTab('progress')">

                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-orange-500">schedule</span>
                        ดำเนินการ
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-orange-500">
                        {{ dataProgress.length }}
                    </div>
                </div>

                <div class="bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-green-300 transition"
                    @click="selectTab('done')">

                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-green-500">check_circle</span>
                        สำเร็จ
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-green-500">
                        {{ dataDone.length }}
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
                    <input v-model="searchText" type="text" placeholder="ค้นหาเลขที่คิว, ชื่อลูกค้า, เลขสมาชิก..."
                        class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>

                <!-- TABS -->
                <div class="flex mx-3 mt-3 gap-3 border-b border-gray-300">
                    <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                        class="w-24 pb-2 transition" :class="activeTab === tab.value
                            ? 'text-sky-500 border-b-2 border-sky-500 font-semibold'
                            : 'text-gray-400 hover:text-sky-400'">
                        {{ tab.label }}
                    </button>
                </div>

                <!-- COUNT -->
                <div class="flex flex-wrap p-3 text-base">
                    {{ tabLabel }}
                    <span class="text-gray-500 ml-1">จำนวน</span>
                    <span class="text-sky-500 ml-1">{{ searchedData.length }}</span>
                </div>

                <!-- TABLE -->
                <div class="bg-white rounded-lg mx-3 overflow-x-auto flex-1 min-h-0">
                    <table class="min-w-full">
                        <thead class="bg-gray-100 text-gray-700">
                            <tr>
                                <th class="px-4 py-1 text-left">ลำดับ</th>
                                <th class="px-4 py-1 text-left">เลขที่คิว</th>
                                <th class="px-4 py-1 text-left">ชื่อลูกค้า</th>
                                <th class="px-4 py-1 text-left">เลขสมาชิก</th>
                                <th class="px-4 py-1 text-left">Merchant</th>
                                <th class="px-4 py-1 text-left">เบอร์โทรศัพท์</th>
                                <th class="px-4 py-1 text-left">วันที่</th>
                                <th class="px-4 py-1 text-left">เวลาขอรับบริการ</th>
                                <th class="px-4 py-1 text-left">สถานะ</th>
                                <th class="px-4 py-1 text-center">คำสั่ง</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="(item, index) in paginatedData" :key="item.que_no" class="hover:bg-gray-50">
                                <td class="px-4 py-1 text-sm">{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.que_no }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.user }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.member_no }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.merchant }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.tel }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.start_date }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.start_time }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.status }}</td>

                                <td class="px-4 py-1 text-center">
                                    <button v-if="item.status === 'รอดำเนินการ'" @click="openPreviewJob(item)"
                                        class="bg-sky-500 hover:bg-sky-600 text-white rounded-lg w-full py-1">
                                        รับงาน
                                    </button>


                                    <button v-else-if="item.status === 'กำลังดำเนินการ'" disabled
                                        class="bg-gray-300 text-white rounded-lg w-full py-1 cursor-not-allowed">
                                        ดำเนินการ
                                    </button>

                                    <button v-else
                                        class="bg-green-500 hover:bg-green-600 text-white rounded-lg w-full py-1">
                                        ดูประวัติ
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- PAGINATION -->
                <div class="mt-auto">
                    <NextPageButton :currentPage="currentPage" :totalPages="totalPages"
                        @update:page="currentPage = $event" />
                </div>

            </div>
        </div>

        <PreviewJob v-if="showPreviewJob" :queue="selectedQueue" @close="showPreviewJob = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NextPageButton from '../../components/button/NextPageButton.vue'
import PreviewJob from '../../components/modal/PreviewJob.vue'

/* ================= STATE ================= */

const activeTab = ref('all')
const currentPage = ref(1)
const rowsPerPage = 15
const showPreviewJob = ref(false)
const searchText = ref('')
const selectedQueue = ref<any>(null)


const tabs = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'ดำเนินการ', value: 'progress' },
    { label: 'สำเร็จ', value: 'done' }
]

const selectTab = (tab: 'all' | 'progress' | 'done') => {
    activeTab.value = tab
    currentPage.value = 1
}


const openPreviewJob = (item: any) => {
    selectedQueue.value = item
    showPreviewJob.value = true
}


/* ================= DATA ================= */

const dataAll = ref([
    { que_no: 'Q001', user: 'A บริษัท BC', member_no: 'MB001', merchant: '1000001', tel: '023456789', start_date: '09/01/2569', start_time: '15:49:05', status: 'กำลังดำเนินการ' },
    { que_no: 'Q002', user: 'B บริษัท CD', member_no: 'MB002', merchant: '1000002', tel: '024456789', start_date: '09/01/2569', start_time: '16:10:12', status: 'รอดำเนินการ' },
    { que_no: 'Q003', user: 'C บริษัท DE', member_no: 'MB003', merchant: '1000003', tel: '025456789', start_date: '09/01/2569', start_time: '16:20:00', status: 'กำลังดำเนินการ' },
    { que_no: 'Q004', user: 'D บริษัท EF', member_no: 'MB004', merchant: '1000004', tel: '026456789', start_date: '09/01/2569', start_time: '16:28:00', status: 'สำเร็จ' },
    { que_no: 'Q005', user: 'E บริษัท FG', member_no: 'MB005', merchant: '1000005', tel: '027456789', start_date: '09/01/2569', start_time: '16:35:00', status: 'รอดำเนินการ' },
    { que_no: 'Q006', user: 'F บริษัท GH', member_no: 'MB006', merchant: '1000006', tel: '028456789', start_date: '09/01/2569', start_time: '17:18:00', status: 'กำลังดำเนินการ' },
    { que_no: 'Q007', user: 'G บริษัท HI', member_no: 'MB007', merchant: '1000007', tel: '029456789', start_date: '09/01/2569', start_time: '17:20:00', status: 'สำเร็จ' },
    { que_no: 'Q008', user: 'H บริษัท IJ', member_no: 'MB008', merchant: '1000008', tel: '020456789', start_date: '09/01/2569', start_time: '17:38:00', status: 'รอดำเนินการ' },
    // … data ที่เหลือของคุณ
])

/* ================= SUMMARY ================= */

const dataProgress = computed(() =>
    dataAll.value.filter(i => i.status === 'กำลังดำเนินการ')
)

const dataDone = computed(() =>
    dataAll.value.filter(i => i.status === 'สำเร็จ')
)

/* ================= TABLE LOGIC ================= */

const statusOrder: Record<string, number> = {
    'รอดำเนินการ': 1,
    'กำลังดำเนินการ': 2,
    'สำเร็จ': 3
}

const sortedAllData = computed(() =>
    [...dataAll.value].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
)

const currentTableData = computed(() => {
    if (activeTab.value === 'progress') return dataProgress.value
    if (activeTab.value === 'done') return dataDone.value
    return sortedAllData.value
})

/* ================= SEARCH ================= */

const searchedData = computed(() => {
    if (!searchText.value) return currentTableData.value

    const keyword = searchText.value.toLowerCase()
    return currentTableData.value.filter(item =>
        item.que_no.toLowerCase().includes(keyword) ||
        item.user.toLowerCase().includes(keyword) ||
        item.member_no.toLowerCase().includes(keyword)
    )
})

/* ================= PAGINATION ================= */

const totalPages = computed(() =>
    Math.ceil(searchedData.value.length / rowsPerPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    return searchedData.value.slice(start, start + rowsPerPage)
})

/* ================= UI ================= */

const tabLabel = computed(() =>
    tabs.find(t => t.value === activeTab.value)?.label
)

watch([activeTab, searchText], () => {
    currentPage.value = 1
})
</script>
