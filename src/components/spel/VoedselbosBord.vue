<script setup lang="ts">
import type { VoedselbosPlaatsing, VoedselbosVakje } from '../../types/spel'

const props = defineProps<{
  plaatsingen: VoedselbosPlaatsing[]
  rasterKolommen: number
  rasterRijen: number
  vakjes: VoedselbosVakje[]
}>()

defineEmits<{
  laatItemLos: [index: number]
  maakVakjeLeeg: [index: number]
  plaatsItem: [index: number]
}>()

function plaatsingStijl(plaatsing: VoedselbosPlaatsing) {
  const ankerIndex = Math.min(...plaatsing.vakjes)
  const breedte = plaatsing.item.footprint?.breedte ?? 1
  const hoogte = plaatsing.item.footprint?.hoogte ?? 1
  const kolom = ankerIndex % props.rasterKolommen
  const rij = Math.floor(ankerIndex / props.rasterKolommen)

  return {
    height: `${(hoogte / props.rasterRijen) * 100}%`,
    left: `${(kolom / props.rasterKolommen) * 100}%`,
    top: `${(rij / props.rasterRijen) * 100}%`,
    width: `${(breedte / props.rasterKolommen) * 100}%`,
  }
}
</script>

<template>
  <section class="bord-gebied" aria-label="Voedselbos grid">
    <div
      class="bord"
      :style="{
        gridTemplateColumns: `repeat(${rasterKolommen}, 1fr)`,
        gridTemplateRows: `repeat(${rasterRijen}, 1fr)`,
      }"
    >
      <button
        v-for="vakje in vakjes"
        :key="vakje.index"
        type="button"
        class="vakje"
        :class="[`terrein-${vakje.terrein}`, { gevuld: vakje.item, anker: vakje.anker }]"
        :aria-label="`Vak rij ${vakje.rij + 1}, kolom ${vakje.kolom + 1}${vakje.item ? ': ' + vakje.item.naam : ''}`"
        @click="$emit('plaatsItem', vakje.index)"
        @contextmenu.prevent="$emit('maakVakjeLeeg', vakje.index)"
        @dragover.prevent
        @drop="$emit('laatItemLos', vakje.index)"
      >
      </button>

      <div
        v-for="plaatsing in plaatsingen"
        :key="plaatsing.id"
        class="plant-overlay"
        :class="{ groot: (plaatsing.item.footprint?.breedte ?? 1) > 1 || (plaatsing.item.footprint?.hoogte ?? 1) > 1 }"
        :style="plaatsingStijl(plaatsing)"
        aria-hidden="true"
      >
        <img
          v-if="plaatsing.item.afbeelding"
          :src="plaatsing.item.afbeelding"
          :alt="plaatsing.item.naam"
        />
        <span v-else class="vakje-icoon">{{ plaatsing.item.icoon }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bord-gebied {
  display: grid;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  place-items: stretch;
  background: #071f0d;
}

.bord {
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #244529;
  background: #3f7542;
}

.vakje {
  display: grid;
  min-width: 0;
  min-height: 0;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.035);
  border-radius: 0;
  padding: 2px;
}

.vakje:hover,
.vakje:focus {
  position: relative;
  z-index: 1;
  outline: 2px solid #f3ca32;
  outline-offset: -2px;
}

.terrein-grasland {
  background: #3e7540;
}

.terrein-water {
  background: #397887;
}

.terrein-heuvel {
  background: #2d4824;
}

.terrein-oever {
  background: #819452;
}

.terrein-akker {
  background: #725f35;
}

.terrein-schaduw {
  background: #686d5f;
}

.vakje.gevuld:not(.anker) {
  opacity: 0.82;
}

.plant-overlay {
  display: grid;
  position: absolute;
  min-width: 0;
  min-height: 0;
  pointer-events: none;
  place-items: center;
  z-index: 2;
}

.plant-overlay::after {
  position: absolute;
  inset: 2px;
  border: 2px solid rgba(243, 202, 50, 0.72);
  content: '';
}

.plant-overlay.groot::after {
  inset: 3px;
  border-width: 3px;
}

.plant-overlay img {
  width: 94%;
  height: 94%;
  min-height: 0;
  object-fit: contain;
  filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.28));
}

.vakje-icoon {
  font-size: clamp(14px, 2vw, 30px);
  line-height: 1;
}

</style>
