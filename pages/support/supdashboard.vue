<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">

        <ChatHeader />

        <div class="bg-slate-100 m-2 flex-1 flex flex-col">

            <!-- SUMMARY -->
            <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="bg-white rounded-lg">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-sky-500">list_alt</span>
                        คิวทั้งหมด
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-sky-500">
                        {{ dataAll.length }}
                    </div>
                </div>

                <div class="bg-white rounded-lg">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-orange-500">schedule</span>
                        ดำเนินการ
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-orange-500">
                        {{ dataProgress.length }}
                    </div>
                </div>

                <div class="bg-white rounded-lg">
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
                    <input type="text" placeholder="ค้นหาเลขที่คิว, ชื่อลูกค้า, หมายเลขสมาชิก..." class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
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
                    <span class="text-sky-500 ml-1">{{ currentTableData.length }}</span>
                </div>

                <!-- TABLE -->
                <div class="bg-white rounded-lg mx-3 overflow-x-auto flex-1 min-h-0">
                    <table class="min-w-full">
                        <thead class="bg-gray-100 text-gray-700">
                            <tr>
                                <th class="px-4 py-1 text-left">ลำดับ</th>
                                <th class="px-4 py-1 text-left">เลขที่คิว</th>
                                <th class="px-4 py-1 text-left">ชื่อลูกค้า</th>
                                <th class="px-4 py-1 text-left">หมายเลขสมาชิก</th>
                                <th class="px-4 py-1 text-left">วันที่</th>
                                <th class="px-4 py-1 text-left">เวลาขอรับบริการ</th>
                                <th class="px-4 py-1 text-left">สถานะ</th>

                                <!-- คำสั่ง (แสดงทุก tab) -->
                                <th class="px-4 py-1 text-center">
                                    คำสั่ง
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
                                <td class="px-4 py-1 text-sm">{{ item.id }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.que_no }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.user }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.member_no }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.start_date }}</td>
                                <td class="px-4 py-1 text-sm">{{ item.start_time }}</td>

                                <!-- STATUS -->
                                <td class="px-4 py-1 text-sm">
                                    {{ item.status }}
                                </td>

                                <!-- ACTION -->
                                <td class="px-4 py-1 text-center">
                                    <!-- รอดำเนินการ -->
                                    <button v-if="item.status === 'รอดำเนินการ'" @click="openPreviewJob"
                                        class="bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex-shrink-0 w-full py-1">
                                        รับงาน
                                    </button>

                                    <!-- กำลังดำเนินการ -->
                                    <button v-else-if="item.status === 'กำลังดำเนินการ'" disabled
                                        class="bg-gray-300 text-white rounded-lg flex-shrink-0 cursor-not-allowed w-full py-1">
                                        ดำเนินการ
                                    </button>

                                    <!-- สำเร็จ -->
                                    <button v-else-if="item.status === 'สำเร็จ'"
                                        class="bg-green-500 hover:bg-green-600 text-white rounded-lg flex-shrink-0 w-full py-1">
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

        <PreviewJob v-if="showPreviewJob" @close="showPreviewJob = false" />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import NextPageButton from '../../components/button/NextPageButton.vue'
    import AcceptJobButton from '../../components/button/AcceptJobButton.vue'
    import PreviewJob from '../../components/modal/PreviewJob.vue'
    
    /* ================= BASIC STATE ================= */
    
    const activeTab = ref('all')
    const currentPage = ref(1)
    const rowsPerPage = 15
    const showPreviewJob = ref(false)
    
    const tabs = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'ดำเนินการ', value: 'progress' },
        { label: 'สำเร็จ', value: 'done' }
    ]
    
    const openPreviewJob = () => {
        showPreviewJob.value = true
    }
    
    /* ================= DATA ================= */
    // ⭐ FIX: ต้องเป็น ref เพื่อให้ Vue track ได้ถูกต้อง
    const dataAll = ref([
        {
            id: '1',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'กำลังดำเนินการ'
        },
        {
            id: '2',
            que_no: 'Q01090170',
            user: 'แดง ร้านข้าวมันไก่',
            member_no: 'MB002',
            start_date: '09/01/2569',
            start_time: '16:10:12',
            status: 'สำเร็จ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },{
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },
        {
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        },{
            id: '3',
            que_no: 'Q01090169',
            user: 'ไก่ บริษัท เป็ดย่าง',
            member_no: 'MB001',
            start_date: '09/01/2569',
            start_time: '15:49:05',
            status: 'รอดำเนินการ'
        }
        // … data ที่เหลือของคุณ 그대로
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
    
    // ⭐ FIX: sort ครั้งเดียวอย่าง stable
    const sortedAllData = computed(() => {
        return dataAll.value
            .slice() // clone ปลอดภัย
            .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    })
    
    const currentTableData = computed(() => {
        if (activeTab.value === 'progress') return dataProgress.value
        if (activeTab.value === 'done') return dataDone.value
        return sortedAllData.value
    })
    
    /* ================= PAGINATION ================= */
    
    const totalPages = computed(() =>
        Math.ceil(currentTableData.value.length / rowsPerPage)
    )
    
    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage
        const end = start + rowsPerPage
        return currentTableData.value.slice(start, end)
    })
    
    /* ================= UI ================= */
    
    const tabLabel = computed(() =>
        tabs.find(t => t.value === activeTab.value)?.label
    )
    
    // ⭐ FIX: เปลี่ยน tab ต้อง reset หน้าเสมอ
    watch(activeTab, () => {
        currentPage.value = 1
    })
    </script>
    