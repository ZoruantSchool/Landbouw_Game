<script setup lang="ts">
defineProps<{
  gerechten: string[]
}>()

defineEmits<{
  terug: []
}>()
</script>

<template>
  <main class="gerechten-scherm">
    <button type="button" @click="$emit('terug')">Terug</button>

    <h1>Gerechten</h1>
    <p v-for="gerecht in gerechten" :key="gerecht">{{ gerecht }}</p>
  </main>
</template>

<style scoped>
.gerechten-scherm {
  padding: 16px;
}
</style>
