<template>
    <div class="bg-white p-3 border-t border-t-1 border-gray-200">
      <div class="flex items-center gap-4">
  
        <div class="flex items-center gap-3 flex-shrink-0">

          <div class="relative">
            <button @click="$emit('toggleMenu')">
              <span class="material-symbols-outlined text-sky-500 text-3xl">
                menu
              </span>
            </button>
  
            <slot name="menu" />
          </div>
  
          <button @click="$emit('openFile')">
            <span class="material-symbols-outlined text-sky-500 text-3xl">
              attach_file
            </span>
          </button>
  
          <button @click="$emit('openImage')">
            <span class="material-symbols-outlined text-sky-500 text-3xl">
              photo
            </span>
          </button>
        </div>
  
        <input
          type="text"
          placeholder="พิมพ์คำถามที่นี่..."
          class="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
  
        <button class="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2 rounded-lg flex-shrink-0">
          ส่ง
        </button>
  
      </div>
    </div>
  </template>