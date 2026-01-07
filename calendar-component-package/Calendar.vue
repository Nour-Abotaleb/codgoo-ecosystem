<template>
  <div :class="locale === 'ar' ? 'rtl-calendar' : ''">
    <v-date-picker
      v-model="date"
      is-inline
      @dayclick="onSelect"
      :locale="locale"
      class="z-[2000]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  locale: {
    type: String,
    default: 'en-US'
  }
})

const emit = defineEmits(['select'])
const date = ref(new Date())

const onSelect = (day) => {
  const d = day.date
  const formatted = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  emit('select', formatted)
}
</script>

<style scoped>
/* Component-specific styles are in calendar-styles.css */
</style>
