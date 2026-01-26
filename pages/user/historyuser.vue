<template>
    <div class="min-h-screen w-full bg-slate-100 flex flex-col">

        <div class="bg-white p-3 flex justify-between items-center border-b border-b-1 border-gray-200">
            <h2 class="text-2xl text-sky-400 font-semibold">
                ประวัติแชท
            </h2>

            <NuxtLink to="/user/chatuser" class="material-symbols-outlined text-stone-700 text-3xl">
                close
            </NuxtLink>

        </div>

        <div class="bg-slate-100 m-2 flex-1 flex">
            <div class="bg-white rounded-lg flex flex-col w-full flex-1 min-h-0">

                <div class="flex flex-wrap p-3">
                    <div class="flex text-base truncate mr-2">
                        ประวัติแชท
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
                                <th class="px-4 py-1 text-left">ชื่อพนักงาน</th>
                                <th class="px-4 py-1 text-left">เวลาสนทนา</th>
                                <th class="px-4 py-1 text-left">เวลาเริ่มต้น</th>
                                <th class="px-4 py-1 text-left">เวลาสิ้นสุด</th>
                                <th class="px-4 py-1 text-center">คำสั่ง</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200 border-b border-b-1 border-gray-200">
                            <tr v-for="(item, index) in paginatedData" :key="index" class="hover:bg-gray-50">
                                <td class="px-4 py-1 text-left text-sm text-gray-600">
                                    {{ (currentPage - 1) * rowsPerPage + index + 1 }}
                                </td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.que_no }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.support }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.chat_time }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.start_date }}</td>
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.end_time }}</td>
                                <td class="px-4 py-1 text-center text-sm text-gray-600 ">
                                    <ViewHistoryButton @click="openHistory(item)" />
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
    </div>

</template>

<script setup lang="ts">
import ViewHistoryButton from '../../components/button/ViewHistoryButton.vue'
import NextPageButton from '../../components/button/NextPageButton.vue'

import { ref, computed } from 'vue'

const rowsPerPage = 15
const currentPage = ref(1)

const totalPages = computed(() =>
    Math.ceil(data.length / rowsPerPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    return data.slice(start, start + rowsPerPage)
})


const openHistory = (item: any) => {
    console.log('ดูประวัติของ:', item)
}


const data = [
    {
        que_no: 'Q001',
        support: 'สมพร',
        chat_time: '00:15:45',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        que_no: 'Q002',
        support: 'สมหมาย',
        chat_time: '00:13:18',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        que_no: 'Q003',
        support: 'สมปอง',
        chat_time: '00:12:05',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        que_no: 'Q004',
        support: 'ประเทือง',
        chat_time: '00:11:14',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        que_no: 'Q005',
        support: 'ประทีป',
        chat_time: '00:13:56',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },

]
</script>
