<script setup lang="ts">
defineProps<{
  aantalLevels: number
}>()

defineEmits<{
  openGerechten: []
  openLevel: [level: number]
  terug: []
}>()
</script>

<template>
  <main class="level-keuze-scherm">
    <button type="button" @click="$emit('terug')">Terug</button>

    <h1>Kies een level</h1>

    <button type="button" @click="$emit('openGerechten')">Gerechten</button>

    <div class="levels">
      <button v-for="level in aantalLevels" :key="level" type="button" @click="$emit('openLevel', level)">
        Level {{ level }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.level-keuze-scherm {
  padding: 16px;
}

.levels {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 180px;
}
</style>
