<script setup lang="ts">
defineEmits<{
  start: []
}>()
</script>

<template>
  <main class="start-scherm">
    <h1>Voedselbos maken</h1>
    <button type="button" @click="$emit('start')">Start</button>
  </main>
</template>

<style scoped>
.start-scherm {
  padding: 16px;
}
</style>
