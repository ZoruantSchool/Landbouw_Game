<script setup lang="ts">
import type { VoedselbosVakje } from '../../types/spel'

defineProps<{
  bordBreedte: number
  bordHoogte: number
  bordVerschuiving: number
  gevuldeVakjes: VoedselbosVakje[]
  rasterGrootte: number
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
        width: `${bordBreedte}px`,
        height: `${bordHoogte}px`,
      }"
    >
      <button
        v-for="vakje in vakjes"
        :key="vakje.index"
        type="button"
        class="vakje"
        :class="{ gevuld: vakje.item }"
        :style="{
          left: `${vakje.x + bordVerschuiving}px`,
          top: `${vakje.y}px`,
          zIndex: vakje.item ? rasterGrootte * rasterGrootte + vakje.rij + vakje.kolom : vakje.rij + vakje.kolom,
        }"
        :aria-label="`Vak rij ${vakje.rij + 1}, kolom ${vakje.kolom + 1}${vakje.item ? ': ' + vakje.item.naam : ''}`"
        @click="$emit('plaatsItem', vakje.index)"
        @contextmenu.prevent="$emit('maakVakjeLeeg', vakje.index)"
        @dragover.prevent
        @drop="$emit('laatItemLos', vakje.index)"
      >
      </button>

      <div
        v-for="vakje in gevuldeVakjes"
        :key="`item-${vakje.index}`"
        class="geplaatst-item"
        :style="{
          left: `${vakje.x + bordVerschuiving}px`,
          top: `${vakje.y}px`,
          zIndex: rasterGrootte * rasterGrootte + vakje.rij + vakje.kolom,
        }"
      >
        <small>{{ vakje.item?.naam }}</small>
      </div>
    </div>

    <p>Klik of sleep een item naar een vak. Rechtermuisklik maakt een vak leeg.</p>
  </section>
</template>

<style scoped>
.bord-gebied {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 24px;
}

.bord {
  position: relative;
  margin: 0 auto;
  max-width: 100%;
}

.vakje {
  position: absolute;
  width: 72px;
  height: 36px;
  border: 0;
  background: #8bc46b;
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  transform: translate(-50%, 0);
}

.vakje:hover,
.vakje:focus {
  background: #9ed17f;
}

.geplaatst-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #111;
  font-weight: 700;
  transform: translate(-50%, -22px);
  transform-origin: bottom center;
  pointer-events: none;
}

.geplaatst-item small {
  font-size: 10px;
}
</style>
