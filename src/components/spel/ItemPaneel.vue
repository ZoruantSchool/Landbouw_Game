<script setup lang="ts">
import gewassenNaamIcoon from '../../assets/gewassen-naam-icoon.png'
import type { VoedselbosItem, VoedselbosPlaatsing } from '../../types/spel'

const props = defineProps<{
  geselecteerdItem: VoedselbosItem
  items: VoedselbosItem[]
  gemarkeerdeItemIds?: string[]
  plaatsingen: VoedselbosPlaatsing[]
  vergrendeldeItemIds?: string[]
}>()

defineEmits<{
  openInfo: [item: VoedselbosItem]
  selecteer: [item: VoedselbosItem]
  startSlepen: [item: VoedselbosItem]
}>()

function resterendAantal(item: VoedselbosItem) {
  const sleutel = item.id ?? item.naam
  const geplaatst = props.plaatsingen.filter((plaatsing) =>
    (plaatsing.item.id ?? plaatsing.item.naam) === sleutel,
  ).length
  return Math.max(0, (item.aantal ?? 1) - geplaatst)
}

function isVergrendeld(item: VoedselbosItem) {
  return props.vergrendeldeItemIds?.includes(item.id ?? item.naam) ?? false
}

function isGemarkeerd(item: VoedselbosItem) {
  return props.gemarkeerdeItemIds?.includes(item.id ?? item.naam) ?? false
}

function plantNaam(item: VoedselbosItem) {
  return item.naam
}
</script>

<template>
  <aside class="item-paneel">
    <div class="paneel-titel">
      <h2>Gewassen</h2>
      <p>Sleep naar een vakje</p>
    </div>

    <div class="gewassen-lijst">
      <div
        v-for="item in items"
        :key="item.id ?? item.naam"
        class="gewas"
        draggable="true"
        :class="{
          geselecteerd: (geselecteerdItem.id ?? geselecteerdItem.naam) === (item.id ?? item.naam),
          gemarkeerd: isGemarkeerd(item),
          voltooid: resterendAantal(item) === 0,
          vergrendeld: isVergrendeld(item),
        }"
        @dragstart="!isVergrendeld(item) && $emit('startSlepen', item)"
      >
        <button
          type="button"
          class="gewas-selectie"
          :disabled="isVergrendeld(item)"
          @click="!isVergrendeld(item) && $emit('selecteer', item)"
        >
          <span class="gewas-icoon">
            <img v-if="item.afbeelding" :src="item.afbeelding" :alt="plantNaam(item)" />
            <span v-else>{{ item.icoon }}</span>
          </span>
          <span class="gewas-inhoud">
            <strong>{{ plantNaam(item) }}</strong>
            <small>{{ item.terrein }}</small>
            <small v-if="item.opbrengst">
              Opbrengst {{ item.opbrengst.minimum }}–{{ item.opbrengst.maximum }} {{ item.opbrengst.eenheid }}
            </small>
            <small>
              {{ resterendAantal(item) === 0
                ? '✓ Alles geplaatst'
                : `${resterendAantal(item)}x nog te plaatsen` }}
            </small>
          </span>
        </button>
        <button
          type="button"
          class="info-knop"
          :aria-label="`Meer informatie over ${plantNaam(item)}`"
          :title="`Meer informatie over ${plantNaam(item)}`"
          @click="$emit('openInfo', item)"
        >
          <img :src="gewassenNaamIcoon" alt="" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.item-paneel {
  display: grid;
  width: 270px;
  min-width: 270px;
  min-height: 0;
  align-content: start;
  gap: 14px;
  padding: 26px 14px;
  border-right: 1px solid #21482a;
  background: #071f0d;
  color: #d8ead5;
}

.paneel-titel h2 {
  color: #71ad68;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
}

.paneel-titel p {
  margin-top: 3px;
  color: #59845d;
  font-size: 12px;
}

.gewassen-lijst {
  display: grid;
  gap: 8px;
}

.gewas {
  position: relative;
  min-height: 64px;
  border: 1px solid #24502c;
  border-left: 4px solid #43943a;
  border-radius: 6px;
  background: #102a16;
  color: #d8ead5;
  overflow: hidden;
}

.gewas-selectie {
  display: grid;
  width: 100%;
  min-height: 72px;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 7px 34px 7px 10px;
  text-align: left;
}

.gewas:hover {
  background: #173620;
}

.gewas.geselecteerd {
  border-color: #f1c40f;
  background: #153218;
}

.gewas.gemarkeerd {
  border-color: #f2df73;
  border-left-color: #ffd629;
  background: #183f1f;
  box-shadow: 0 0 0 3px rgba(242, 223, 115, .36), 0 0 24px rgba(242, 223, 115, .76);
  animation: gewas-tutorial-pulse 1.25s ease-in-out infinite;
}

@keyframes gewas-tutorial-pulse {
  0%, 100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.2);
  }
}

.gewas.voltooid { border-left-color: #8bcf6b; background: #0d2512; }
.gewas.voltooid .gewas-icoon { opacity: .58; }
.gewas.voltooid .gewas-inhoud small:last-child { color: #78bd61; }
.gewas.vergrendeld { opacity: .28; }
.gewas.vergrendeld .gewas-selectie { cursor: not-allowed; }

.gewas-icoon {
  display: grid;
  width: 44px;
  height: 44px;
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
  display: block;
  min-width: 0;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  color: #d9e4bd;
  font-size: 14px;
  line-height: 1.15;
  white-space: nowrap;
}

.info-knop { display: grid; position: absolute; top: 8px; right: 7px; width: 22px; height: 22px; place-items: center; border: 0; border-radius: 50%; background: transparent; padding: 0; }
.info-knop:hover, .info-knop:focus-visible { background: #285b2c; outline: 1px solid #79bd62; }
.info-knop img { width: 13px; height: 13px; object-fit: contain; }

.gewas-inhoud small {
  overflow: hidden;
  color: #416d3c;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gewas.geselecteerd small:last-child {
  color: #e6bf15;
}
</style>
