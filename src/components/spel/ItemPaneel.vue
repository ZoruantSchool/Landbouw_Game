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
    <div class="paneel-kop">
      <button type="button" @click="$emit('terug')">Terug</button>
      <span>Level {{ level }}</span>
    </div>

    <div class="paneel-titel">
      <h2>Gewassen</h2>
      <p>Sleep naar een vakje</p>
    </div>

    <div class="gewassen-lijst">
      <button
        v-for="item in items"
        :key="item.naam"
        type="button"
        class="gewas"
        draggable="true"
        :class="{ geselecteerd: geselecteerdItem.naam === item.naam }"
        @click="$emit('selecteer', item)"
        @dragstart="$emit('startSlepen', item)"
      >
        <span class="gewas-icoon">{{ item.icoon }}</span>
        <span class="gewas-inhoud">
          <strong>{{ item.naam }}</strong>
          <small>{{ item.terrein }}</small>
          <small>{{ item.beschrijving }}</small>
        </span>
      </button>
    </div>

    <div class="paneel-acties">
      <p>Geselecteerd: {{ geselecteerdItem.naam }}</p>
      <button type="button" class="afronden" @click="$emit('afronden')">Level afronden</button>
      <button type="button" class="leegmaken" @click="$emit('reset')">Leegmaken</button>
    </div>
  </aside>
</template>

<style scoped>
.item-paneel {
  display: grid;
  width: 230px;
  min-width: 230px;
  min-height: 100vh;
  align-content: start;
  gap: 14px;
  padding: 14px 10px;
  border-right: 1px solid #21482a;
  background: #071b0d;
  color: #d8ead5;
}

.paneel-kop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.paneel-kop button,
.paneel-kop span {
  border: 1px solid #315b35;
  border-radius: 6px;
  background: #102b17;
  color: #a8d894;
  padding: 7px 10px;
  font-size: 12px;
}

.paneel-titel h2 {
  color: #77b764;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.paneel-titel p {
  margin-top: 3px;
  color: #55765a;
  font-size: 10px;
}

.gewassen-lijst {
  display: grid;
  gap: 5px;
}

.gewas {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 8px;
  min-height: 52px;
  align-items: center;
  border: 1px solid #24502c;
  border-left: 4px solid #4b963e;
  border-radius: 7px;
  background: #102818;
  color: #d8ead5;
  padding: 6px 8px;
  text-align: left;
}

.gewas:hover {
  background: #173620;
}

.gewas.geselecteerd {
  border-color: #f1c40f;
  background: #19341d;
}

.gewas-icoon {
  font-size: 24px;
  text-align: center;
}

.gewas-inhoud {
  display: grid;
  min-width: 0;
}

.gewas-inhoud strong {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gewas-inhoud small {
  overflow: hidden;
  color: #699269;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paneel-acties {
  display: grid;
  gap: 6px;
  padding-top: 4px;
}

.paneel-acties p {
  overflow: hidden;
  color: #7ba37b;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paneel-acties button {
  min-height: 38px;
  border: 1px solid #376a3e;
  border-radius: 6px;
  font-weight: 700;
}

.afronden {
  background: #4d963e;
  color: #ffffff;
}

.leegmaken {
  background: transparent;
  color: #8ab48b;
}
</style>
