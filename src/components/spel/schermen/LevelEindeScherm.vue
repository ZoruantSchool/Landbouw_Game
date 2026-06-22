<script setup lang="ts">
defineProps<{
  level: number
}>()

defineEmits<{
  levels: []
  opnieuw: []
  volgend: []
}>()
</script>

<template>
  <main class="einde-scherm">
    <p>Level {{ level }}</p>
    <h1>Goed gedaan</h1>
    <p>Je voedselbos is klaar voor dit level.</p>

    <div class="einde-acties">
      <button type="button" @click="$emit('volgend')">Volgend level</button>
      <button type="button" @click="$emit('opnieuw')">Opnieuw spelen</button>
      <button type="button" @click="$emit('levels')">Levels</button>
    </div>
  </main>
</template>

<style scoped>
.einde-scherm {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: 12px;
  padding: 16px;
  text-align: center;
}

.einde-acties {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
</style>
