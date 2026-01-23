<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">

        <ChatHeader />

        <div class="bg-slate-100 m-2 flex-1 flex flex-col">
            <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="bg-white rounded-lg">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-sky-500">
                            list_alt
                        </span>
                        คิวทั้งหมด
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-sky-500">
                        2
                    </div>
                </div>
                <div class="bg-white rounded-lg">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-orange-500">
                            schedule
                        </span>
                        คิวที่รอ
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-orange-500">
                        2
                    </div>
                </div>
                <div class="bg-white rounded-lg">
                    <div class="text-lg flex mx-3 my-3">
                        <span class="material-symbols-outlined mr-2 text-green-500">
                            check_circle
                        </span>
                        สำเร็จ
                    </div>
                    <div class="flex justify-center mb-8 text-xl text-green-500">
                        2
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg flex flex-col w-full flex-1 min-h-0">

                <div class="mx-3 mt-3 relative">
                    <span
                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none">
                        search
                    </span>
                    <input type="text" placeholder="ค้นหาเลขที่คิว, ชื่อลูกค้า, หมายเลขสมาชิก..." class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>

                <div class="flex mx-3 mt-3 gap-3 border-b border-gray-300">
                    <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                        class="w-24 pb-2 transition" :class="activeTab === tab.value
                            ? 'text-sky-500 border-b-2 border-sky-500 font-semibold'
                            : 'text-gray-400 hover:text-sky-400'">
                        {{ tab.label }}
                    </button>
                </div>

                <div class="flex flex-wrap p-3">
                    <div class="flex text-base truncate mr-2">
                        คิวทั้งหมด
                        <span class="text-gray-500 ml-1">
                            จำนวน
                        </span>
                        <span class="text-sky-500 ml-1">
                            {{ data.length }}
                        </span>
                    </div>

                </div>

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
                                <th class="px-4 py-1 text-center">คำสั่ง</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200 border-b border-b-1 border-gray-200">
                            <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.id }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.que_no }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.user }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.member_no }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.start_date }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.start_time }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.status }}</td>
                                <td class="px-4 py-1 text-center text-sm text-gray-600 ">
                                    <AcceptJobButton @accept="openPreviewJob" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

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
import NextPageButton from '../../components/button/NextPageButton.vue'
import AcceptJobButton from '../../components/button/AcceptJobButton.vue'

import { ref, computed } from 'vue'
import PreviewJob from '../../components/modal/PreviewJob.vue'

const openPreviewJob = () => {
  showPreviewJob.value = true
}

const rowsPerPage = 15
const currentPage = ref(1)
const showPreviewJob = ref(false)

const totalPages = computed(() =>
    Math.ceil(data.length / rowsPerPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    return data.slice(start, start + rowsPerPage)
})

const activeTab = ref('all')

const tabs = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'ดำเนินการ', value: 'progress' },
    { label: 'สำเร็จ', value: 'done' }
]


const data = [
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
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },
    {
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },{
        id: '1',
        que_no: 'Q01090169',
        user: 'ไก่ บริษัท เป็ดย่าง',
        member_no: 'MB001',
        start_date: '09/01/2569',
        start_time: '15:49:05',
        status: 'กำลังดำเนินการ'
    },

]
</script>
