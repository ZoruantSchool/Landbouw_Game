<script setup lang="ts">
import gewassenNaamIcoon from '../../assets/gewassen-naam-icoon.png'
import type { VoedselbosItem } from '../../types/spel'

defineProps<{
  geselecteerdItem: VoedselbosItem
  items: VoedselbosItem[]
}>()

defineEmits<{
  selecteer: [item: VoedselbosItem]
  startSlepen: [item: VoedselbosItem]
}>()
</script>

<template>
  <aside class="item-paneel">
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
        <span class="gewas-icoon">
          <img v-if="item.afbeelding" :src="item.afbeelding" :alt="item.naam" />
          <span v-else>{{ item.icoon }}</span>
        </span>
        <span class="gewas-inhoud">
          <strong>
            <span>{{ item.naam }}</span>
            <img :src="gewassenNaamIcoon" alt="" />
          </strong>
          <small>{{ item.terrein }} · {{ item.aantal ?? 1 }}x</small>
          <small>{{ geselecteerdItem.naam === item.naam ? 'Geselecteerd' : 'Nog te plaatsen' }}</small>
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.item-paneel {
  display: grid;
  width: 220px;
  min-width: 220px;
  min-height: 0;
  align-content: start;
  gap: 10px;
  padding: 22px 10px;
  border-right: 1px solid #21482a;
  background: #071f0d;
  color: #d8ead5;
}

.paneel-titel h2 {
  color: #477a42;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.paneel-titel p {
  margin-top: 3px;
  color: #315b35;
  font-size: 8px;
}

.gewassen-lijst {
  display: grid;
  gap: 5px;
}

.gewas {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 9px;
  min-height: 52px;
  align-items: center;
  border: 1px solid #24502c;
  border-left: 4px solid #43943a;
  border-radius: 6px;
  background: #102a16;
  color: #d8ead5;
  padding: 5px 8px;
  text-align: left;
}

.gewas:hover {
  background: #173620;
}

.gewas.geselecteerd {
  border-color: #f1c40f;
  background: #153218;
}

.gewas-icoon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  overflow: hidden;
  font-size: 24px;
  text-align: center;
}

.gewas-icoon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gewas-inhoud {
  display: grid;
  min-width: 0;
}

.gewas-inhoud strong {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  color: #d9e4bd;
  font-size: 11px;
  line-height: 1.15;
  white-space: nowrap;
}

.gewas-inhoud strong img {
  width: 12px;
  height: 10px;
  flex: 0 0 auto;
  object-fit: contain;
}

.gewas-inhoud strong span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gewas-inhoud small {
  overflow: hidden;
  color: #416d3c;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gewas.geselecteerd small:last-child {
  color: #e6bf15;
}
</style>
