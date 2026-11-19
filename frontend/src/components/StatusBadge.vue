<script setup>
defineProps({
  verfuegbar: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <span class="status" :class="verfuegbar ? 'status--ja' : 'status--nein'">
    {{ verfuegbar ? 'Verfügbar' : 'Ausgeliehen' }}
  </span>
</template>
