<script setup lang="ts">
import type { VoedselbosItem } from '../../types/spel'

defineProps<{
  geselecteerdItem: VoedselbosItem
  items: VoedselbosItem[]
  level: number
}>()

defineEmits<{
  afronden: []
  reset: []
  selecteer: [item: VoedselbosItem]
  startSlepen: [item: VoedselbosItem]
  terug: []
}>()
</script>

<template>
  <aside class="item-paneel">
    <button type="button" @click="$emit('terug')">Terug</button>

    <h1>Level {{ level }}</h1>

    <h2>Items</h2>
    <button
      v-for="item in items"
      :key="item.naam"
      type="button"
      draggable="true"
      :class="{ geselecteerd: geselecteerdItem.naam === item.naam }"
      @click="$emit('selecteer', item)"
      @dragstart="$emit('startSlepen', item)"
    >
      {{ item.naam }}
    </button>

    <p>Geselecteerd: {{ geselecteerdItem.naam }}</p>
    <button type="button" @click="$emit('afronden')">Level afronden</button>
    <button type="button" @click="$emit('reset')">Leegmaken</button>
  </aside>
</template>

<style scoped>
.item-paneel {
  display: flex;
  min-width: 180px;
  flex-direction: column;
  gap: 8px;
}

.item-paneel button {
  text-align: left;
}

.item-paneel button.geselecteerd {
  outline: 2px solid currentColor;
}
</style>
