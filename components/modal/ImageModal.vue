<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
  
        <div class="flex justify-between items-center p-4">
          <h3 class="text-lg font-semibold">เลือกไฟล์รูปภาพ</h3>
          <button @click="$emit('close')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
  
        <div class="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="img in images"
            :key="img"
            class="border rounded-lg p-2 cursor-pointer hover:ring-2 ring-sky-500"
          >
            <div class="aspect-square bg-gray-200 rounded mb-1"></div>
            <p class="text-xs text-center">{{ img }}</p>
          </div>
        </div>
  
        <div class="p-4 border-t">
          <label
            class="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-sky-500">
            <span class="material-symbols-outlined text-4xl mb-1">
              upload
            </span>
            <p>คลิกเพื่ออัปโหลดไฟล์</p>
            <input type="file" class="hidden" />
          </label>
        </div>
  
        <div class="flex justify-end gap-2 p-4 border-t">
          <button class="px-4 py-2 border rounded-lg" @click="$emit('close')">
            กลับ
          </button>
          <button class="px-4 py-2 bg-sky-500 text-white rounded-lg">
            ยืนยัน
          </button>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    images: Array
  })
  </script>
  