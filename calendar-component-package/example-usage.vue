<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Calendar Component Example</h1>
    
    <!-- Language Switcher -->
    <div class="mb-4">
      <button 
        @click="locale = 'en-US'" 
        class="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
        :class="{ 'bg-blue-700': locale === 'en-US' }"
      >
        English
      </button>
      <button 
        @click="locale = 'ar'" 
        class="px-4 py-2 bg-blue-500 text-white rounded"
        :class="{ 'bg-blue-700': locale === 'ar' }"
      >
        Arabic
      </button>
    </div>

    <!-- Calendar Component -->
    <div class="max-w-md bg-white rounded-lg shadow-lg p-6">
      <Calendar 
        :locale="locale" 
        @select="handleDateSelect" 
      />
    </div>

    <!-- Selected Date Display -->
    <div v-if="selectedDate" class="mt-4 p-4 bg-gray-100 rounded">
      <p class="font-semibold">Selected Date:</p>
      <p class="text-lg">{{ selectedDate }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Calendar from './Calendar.vue'

const locale = ref('en-US')
const selectedDate = ref(null)

const handleDateSelect = (date) => {
  selectedDate.value = date
  console.log('Selected date:', date)
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
