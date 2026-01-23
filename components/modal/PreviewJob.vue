<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">

            <div class="flex justify-between items-center p-4">
                <h3 class="text-lg font-semibold">จัดการคิว</h3>
                <button @click="$emit('close')">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div class="px-4 py-3 border-t bg-gray-100">
                <div class="">
                    รายละเอียดลูกค้า
                    <div class="bg-white p-4 my-2 rounded-lg grid grid-cols-2 gap-8 min-h-[160px] border border-gray-200">
                        <div class="text-sm">
                            <div class="py-2 flex">
                                คิวที่ :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                            <div class="py-2 flex">
                                วันที่ :
                                <p class="text-sky-500 ml-1">
                                    09/01/2569
                                </p>
                            </div>
                            <div class="py-2 flex">
                                ชื่อ :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                            <div class="py-2 flex">
                                Merchant :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                        </div>


                        <div class="text-sm">
                            <div class="py-2 flex">
                                เลขที่คิว :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                            <div class="py-2 flex">
                                เวลาขอรับบริการ :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                            <div class="py-2 flex">
                                ร้านค้า :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                            <div class="py-2 flex">
                                เบอร์โทรศัพท์ :
                                <p class="text-sky-500 ml-1">
                                    4
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="">
                    รายละเอียดการสนทนา
                    <div class=" bg-white p-3 mt-2 rounded-lg min-h-[160px] overflow-y-auto border border-gray-200">
                        <div class="">
                            <p class="py-2 text-gray-500">
                                สวัสดีครับ มีเรื่องจะสอบถาม...
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="p-4 border-t">
                <button class="px-4 py-2 bg-sky-500 text-white rounded-lg w-full hover:bg-sky-600">
                    รับงาน
                </button>
            </div>

        </div>
    </div>
</template>