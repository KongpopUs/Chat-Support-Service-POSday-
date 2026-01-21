<template>
  <div class="bg-white flex flex-col h-full">

    <div class="flex-1 overflow-y-auto chant-height">
      <ChatSessionItem
        v-for="session in sessions"
        :key="session.id"
        :name="session.name"
        :lastMessage="session.lastMessage"
        :avatar="session.avatar"
        :hasUnread="session.hasUnread"
      />
    </div>

    <EndJobButton />

  </div>
</template>

<script setup>
import ChatSessionItem from './ChatSessionItem.vue'
import EndJobButton from '../../components/history/EndJobButton.vue'

defineProps({
  sessions: Array
})
</script>
<style lang="css">
  
</style>
