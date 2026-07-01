<script setup lang="ts">
import type { VoedselbosVakje } from '../../types/spel'

defineProps<{
  rasterKolommen: number
  rasterRijen: number
  vakjes: VoedselbosVakje[]
}>()

defineEmits<{
  laatItemLos: [index: number]
  maakVakjeLeeg: [index: number]
  plaatsItem: [index: number]
}>()
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
        :class="[`terrein-${vakje.terrein}`, { gevuld: vakje.item }]"
        :aria-label="`Vak rij ${vakje.rij + 1}, kolom ${vakje.kolom + 1}${vakje.item ? ': ' + vakje.item.naam : ''}`"
        @click="$emit('plaatsItem', vakje.index)"
        @contextmenu.prevent="$emit('maakVakjeLeeg', vakje.index)"
        @dragover.prevent
        @drop="$emit('laatItemLos', vakje.index)"
      >
        <span v-if="vakje.item" class="vakje-inhoud">
          <img v-if="vakje.item.afbeelding" :src="vakje.item.afbeelding" :alt="vakje.item.naam" />
          <span v-else class="vakje-icoon">{{ vakje.item.icoon }}</span>
        </span>
      </button>
    </div>

    <p>Klik of sleep een item naar een vak. Rechtermuisklik maakt een vak leeg.</p>
  </section>
</template>

<style scoped>
.bord-gebied {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 24px;
  background: #071b0d;
}

.bord {
  display: grid;
  width: min(100%, 960px);
  aspect-ratio: 16 / 14;
  margin: 0 auto;
  border: 2px solid #14a8ff;
  background: #3f7542;
}

.vakje {
  display: grid;
  min-width: 0;
  min-height: 0;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
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
  background: #3f7542;
}

.terrein-water {
  background: #39788b;
}

.terrein-heuvel {
  background: #725f3d;
}

.terrein-schaduw {
  background: #817d68;
}

.vakje.gevuld {
  box-shadow: inset 0 0 0 3px #f3ca32;
}

.vakje-inhoud {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  place-items: center;
}

.vakje-inhoud img {
  width: 82%;
  height: 82%;
  min-height: 0;
  object-fit: contain;
}

.vakje-icoon {
  font-size: clamp(14px, 2vw, 30px);
  line-height: 1;
}

</style>
