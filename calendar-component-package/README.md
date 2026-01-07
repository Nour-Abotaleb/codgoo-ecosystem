# Calendar Component Package

This package contains a ready-to-use Calendar component extracted from your dashboard project.

## What's Included

- `Calendar.vue` - The main calendar component
- `calendar-styles.css` - All required styles for the calendar
- `package-dependencies.json` - Required npm packages
- `tailwind-config-snippet.js` - Tailwind configuration needed

## Installation Steps

### 1. Install Dependencies

```bash
npm install v-calendar@3.1.2
```

### 2. Copy Files to Your Project

- Copy `Calendar.vue` to your `src/components/` folder
- Import the calendar styles in your main CSS file or `main.js`

### 3. Import Styles

In your `main.js` or main entry file:

```javascript
import 'v-calendar/style.css'
import './calendar-styles.css' // Copy this file to your project
```

### 4. Update Tailwind Config (if using Tailwind)

Add the content from `tailwind-config-snippet.js` to your `tailwind.config.js`

## Usage

### Basic Usage

```vue
<template>
  <div>
    <Calendar @select="handleDateSelect" />
  </div>
</template>

<script setup>
import Calendar from './components/Calendar.vue'

const handleDateSelect = (date) => {
  console.log('Selected date:', date) // Format: YYYY-MM-DD
}
</script>
```

### With Locale Support (Arabic/English)

```vue
<template>
  <div>
    <Calendar 
      :locale="currentLocale" 
      @select="handleDateSelect" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Calendar from './components/Calendar.vue'

const currentLocale = ref('en-US') // or 'ar' for Arabic

const handleDateSelect = (date) => {
  console.log('Selected date:', date)
}
</script>
```

## Props

- `locale` (String, default: 'en-US') - Language locale for the calendar

## Events

- `@select` - Emitted when a date is selected, returns date in YYYY-MM-DD format

## Styling

The calendar uses custom CSS variables and Tailwind classes. The main color scheme uses:
- Primary color: `#ffd036` (yellow/gold)
- Selected date background: `#000` (black)
- Selected date text: `white`

You can customize these colors by modifying the CSS variables in `calendar-styles.css`.

## RTL Support

The calendar automatically supports RTL (Right-to-Left) layout when locale is set to 'ar'.
