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
                                <th class="px-4 py-1 text-left">Support</th>
                                <th class="px-4 py-1 text-left">เวลาสนทนา</th>
                                <th class="px-4 py-1 text-left">เวลาเริ่มต้น</th>
                                <th class="px-4 py-1 text-left">เวลาสิ้นสุด</th>
                                <th class="px-4 py-1 text-center">คำสั่ง</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200 border-b border-b-1 border-gray-200">
                            <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
                                <td class="px-4 py-1 text-left text-sm text-gray-600">{{ item.id }}</td>
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
    // ตัวอย่างในอนาคต
    // navigateTo(`/user/history/${item.id}`)
    // หรือเปิด modal
}


const data = [
    {
        id: '1',
        que_no: 'Q01090169',
        support: 'สมพร',
        chat_time: '00:15:45',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        id: '2',
        que_no: 'Q02090169',
        support: 'สมหมาย',
        chat_time: '00:14:21',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '3',
        que_no: 'Q03090169',
        support: 'สุพล',
        chat_time: '00:13:05',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '4',
        que_no: 'Q04090169',
        support: 'สุชาติ',
        chat_time: '00:12:19',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '5',
        que_no: 'Q05090169',
        support: 'สุนีย์',
        chat_time: '00:16:38',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        id: '6',
        que_no: 'Q06090169',
        support: 'สุรีย์พร',
        chat_time: '00:11:10',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีค่ะ จะสอบถาม...'
    },
    {
        id: '7',
        que_no: 'Q07090169',
        support: 'สมพล',
        chat_time: '00:10:48',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '8',
        que_no: 'Q08090169',
        support: 'สมปอง',
        chat_time: '00:09:48',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '9',
        que_no: 'Q09090169',
        support: 'ประเทือง',
        chat_time: '00:17:06',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '10',
        que_no: 'Q10090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '11',
        que_no: 'Q11090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '12',
        que_no: 'Q12090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '13',
        que_no: 'Q13090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '14',
        que_no: 'Q14090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '15',
        que_no: 'Q15090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '16',
        que_no: 'Q16090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '17',
        que_no: 'Q17090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    },
    {
        id: '18',
        que_no: 'Q18090169',
        support: 'ประสิทธิ์',
        chat_time: '00:15:36',
        start_date: '09/01/2569',
        end_time: '09/01/2569',
        history: 'สวัสดีครับ จะสอบถาม...'
    }

]
</script>
