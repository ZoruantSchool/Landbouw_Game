<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VoedselbosItem, VoedselbosPlaatsing, VoedselbosVakje } from '../../types/spel'

const props = defineProps<{
  effecten: Record<number, { status: 'positief' | 'neutraal' | 'negatief'; tekst: string }>
  geselecteerdItem: VoedselbosItem
  geschikteTerreinen: string[]
  gemarkeerdePlaatsingIds?: number[]
  gemarkeerdeTerreinen?: string[]
  gemarkeerdeVakjes?: number[]
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

function plantNaam(item: VoedselbosItem) {
  return item.naam
}

const hoverIndex = ref<number | null>(null)
const hoverVoorbeeld = computed(() => {
  if (hoverIndex.value === null) return null

  const item = props.geselecteerdItem
  const breedte = item.footprint?.breedte ?? 1
  const hoogte = item.footprint?.hoogte ?? 1
  const hoverRij = Math.floor(hoverIndex.value / props.rasterKolommen)
  const hoverKolom = hoverIndex.value % props.rasterKolommen
  const gebruiktMidden = item.id === 'walnootboom'
  const startRij = gebruiktMidden ? hoverRij - Math.floor(hoogte / 2) : hoverRij
  const startKolom = gebruiktMidden ? hoverKolom - Math.floor(breedte / 2) : hoverKolom
  const binnenBord = startRij >= 0 && startKolom >= 0
    && startRij + hoogte <= props.rasterRijen
    && startKolom + breedte <= props.rasterKolommen
  const voorbeeldVakjes = binnenBord
    ? Array.from({ length: hoogte * breedte }, (_, positie) => {
        const rij = startRij + Math.floor(positie / breedte)
        const kolom = startKolom + (positie % breedte)
        return props.vakjes[rij * props.rasterKolommen + kolom]
      })
    : []
  const vrij = binnenBord && voorbeeldVakjes.every((vakje) => vakje && !vakje.item && vakje.terrein !== 'water')
  const correctTerrein = gebruiktMidden
    ? props.geschikteTerreinen.includes(props.vakjes[hoverIndex.value]?.terrein ?? '')
    : voorbeeldVakjes.every((vakje) => vakje && props.geschikteTerreinen.includes(vakje.terrein))

  return {
    positief: vrij && correctTerrein,
    stijl: {
      height: `${(hoogte / props.rasterRijen) * 100}%`,
      left: `${(Math.max(0, startKolom) / props.rasterKolommen) * 100}%`,
      top: `${(Math.max(0, startRij) / props.rasterRijen) * 100}%`,
      width: `${(breedte / props.rasterKolommen) * 100}%`,
    },
  }
})
</script>

<template>
  <section class="bord-gebied" aria-label="Voedselbos grid">
    <div class="effect-legenda" aria-label="Legenda voor effecten">
      <span><i class="positief"></i> Positief</span>
      <span><i class="neutraal"></i> Combinatie ontbreekt</span>
      <span><i class="negatief"></i> Negatief</span>
    </div>
    <div
      class="bord"
      :style="{
        gridTemplateColumns: `repeat(${rasterKolommen}, 1fr)`,
        gridTemplateRows: `repeat(${rasterRijen}, 1fr)`,
      }"
      @mouseleave="hoverIndex = null"
    >
      <button
        v-for="vakje in vakjes"
        :key="vakje.index"
        type="button"
        class="vakje"
        :class="[
          `terrein-${vakje.terrein}`,
          {
            gevuld: vakje.item,
            anker: vakje.anker,
            'tutorial-vakje-highlight': gemarkeerdeVakjes?.includes(vakje.index),
            'tutorial-terrein-highlight': gemarkeerdeTerreinen?.includes(vakje.terrein),
          },
        ]"
        :aria-label="`Vak rij ${vakje.rij + 1}, kolom ${vakje.kolom + 1}${vakje.item ? ': ' + plantNaam(vakje.item) : ''}`"
        @click="$emit('plaatsItem', vakje.index)"
        @contextmenu.prevent="$emit('maakVakjeLeeg', vakje.index)"
        @dragover.prevent
        @drop="$emit('laatItemLos', vakje.index)"
        @mouseenter="hoverIndex = vakje.index"
      >
      </button>

      <div
        v-if="hoverVoorbeeld"
        class="plant-voorbeeld"
        :class="[hoverVoorbeeld.positief ? 'positief' : 'negatief', `plant-${geselecteerdItem.id}`]"
        :style="hoverVoorbeeld.stijl"
        aria-hidden="true"
      >
        <img v-if="geselecteerdItem.afbeelding" :src="geselecteerdItem.afbeelding" alt="" />
        <span class="voorbeeld-badge">{{ hoverVoorbeeld.positief ? '+' : '−' }}</span>
      </div>

      <div
        v-for="plaatsing in plaatsingen"
        :key="plaatsing.id"
        class="plant-overlay"
        :class="[
          effecten[plaatsing.id]?.status,
          {
            groot: (plaatsing.item.footprint?.breedte ?? 1) > 1 || (plaatsing.item.footprint?.hoogte ?? 1) > 1,
            'tutorial-plaatsing-highlight': gemarkeerdePlaatsingIds?.includes(plaatsing.id),
          },
        ]"
        :style="plaatsingStijl(plaatsing)"
        :title="effecten[plaatsing.id]?.tekst"
        aria-hidden="true"
      >
        <img
          v-if="plaatsing.item.afbeelding"
          :src="plaatsing.item.afbeelding"
          :alt="plantNaam(plaatsing.item)"
        />
        <span v-else class="vakje-icoon">{{ plaatsing.item.icoon }}</span>
        <span class="effect-badge">{{ effecten[plaatsing.id]?.status === 'positief' ? '+' : effecten[plaatsing.id]?.status === 'negatief' ? '−' : '!' }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bord-gebied {
  position: relative;
  display: grid;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  place-items: stretch;
  background: #071f0d;
}

.effect-legenda { display: flex; position: absolute; top: 10px; left: 50%; z-index: 5; gap: 16px; transform: translateX(-50%); border: 2px solid #4c7a4f; border-radius: 8px; background: rgba(4, 22, 8, .96); box-shadow: 0 4px 16px rgba(0, 0, 0, .45); color: #e2ecd9; padding: 8px 13px; font-size: 11px; font-weight: 700; pointer-events: none; white-space: nowrap; }
.effect-legenda span { display: flex; align-items: center; gap: 6px; }.effect-legenda i { width: 12px; height: 12px; border: 2px solid rgba(255, 255, 255, .5); border-radius: 50%; box-shadow: 0 0 8px currentColor; }.effect-legenda .positief { background: #56f044; color: #56f044; }.effect-legenda .neutraal { background: #ffd32f; color: #ffd32f; }.effect-legenda .negatief { background: #ff5145; color: #ff5145; }

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
  transition: outline-color 0.15s ease, filter 0.15s ease;
}

.vakje:hover,
.vakje:focus {
  position: relative;
  z-index: 1;
  outline: 2px solid #f3ca32;
  outline-offset: -2px;
  filter: brightness(1.08);
}

.vakje.tutorial-terrein-highlight,
.vakje.tutorial-vakje-highlight {
  position: relative;
  z-index: 3;
  outline: 3px dashed #f2df73;
  outline-offset: -6px;
  box-shadow: inset 0 0 0 999px rgba(255, 255, 255, .15), inset 0 0 22px rgba(242, 223, 115, .42);
  animation: vakje-tutorial-pulse 1.25s ease-in-out infinite;
}

.vakje.tutorial-vakje-highlight {
  outline-color: #ffd629;
  box-shadow: inset 0 0 0 999px rgba(255, 231, 96, .13), inset 0 0 30px rgba(255, 214, 41, .75), 0 0 20px rgba(255, 214, 41, .65);
}

@keyframes vakje-tutorial-pulse {
  0%, 100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.22);
  }
}

.plant-voorbeeld { display: grid; position: absolute; z-index: 4; box-sizing: border-box; place-items: center; overflow: visible; border: 4px solid; transform: scale(.94); pointer-events: none; }
.plant-voorbeeld.plant-vlier { transform: scale(.88); transform-origin: center center; }
.plant-voorbeeld.plant-walnootboom { transform: scale(.91); }
.plant-voorbeeld.positief { border-color: #56f044; background: rgba(56, 255, 70, .16); box-shadow: inset 0 0 22px rgba(86, 240, 68, .5), 0 0 16px rgba(86, 240, 68, .9); }
.plant-voorbeeld.negatief { border-color: #ff5145; background: rgba(255, 45, 38, .2); box-shadow: inset 0 0 22px rgba(255, 81, 69, .55), 0 0 16px rgba(255, 81, 69, .9); }
.plant-voorbeeld img { width: calc(100% - 14px); height: calc(100% - 14px); object-fit: contain; opacity: .72; filter: drop-shadow(0 4px 4px rgba(0, 0, 0, .45)); }
.plant-voorbeeld.plant-vlier img { position: absolute; top: 50%; left: 50%; width: 76%; height: 76%; transform: translate(-50%, -52%); }
.plant-voorbeeld.plant-walnootboom img { width: 84%; height: 84%; }
.voorbeeld-badge { display: flex; position: absolute; top: 2px; right: 2px; box-sizing: border-box; width: 28px; height: 28px; align-items: center; justify-content: center; border: 3px solid #071f0d; border-radius: 50%; background: #ff5145; color: #fff; padding: 0 0 2px; font-family: Arial, sans-serif; font-size: 20px; font-weight: 900; line-height: 1; }
.plant-voorbeeld.positief .voorbeeld-badge { background: #56f044; color: #0b3a07; }

.terrein-grasland {
  background: #3e7540;
}

.terrein-water {
  background: #397887;
}

.terrein-heuvel {
  background: #686d5f;
}

.terrein-oever {
  background: #819452;
}

.terrein-akker {
  background: #725f35;
}

.terrein-schaduw {
  background: #2d4824;
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
  animation: voedselbos-pop-in 0.25s ease both;
}

.plant-overlay::after {
  position: absolute;
  inset: 2px;
  border: 4px solid #ffd32f;
  box-shadow: inset 0 0 18px rgba(255, 211, 47, .35), 0 0 12px rgba(255, 211, 47, .8);
  content: '';
}

.plant-overlay.positief::after { border-color: #56f044; background: rgba(56, 255, 70, .12); box-shadow: inset 0 0 22px rgba(86, 240, 68, .45), 0 0 15px rgba(86, 240, 68, .9); }
.plant-overlay.negatief::after { border-color: #ff5145; background: rgba(255, 45, 38, .15); box-shadow: inset 0 0 22px rgba(255, 81, 69, .5), 0 0 15px rgba(255, 81, 69, .9); }
.effect-badge { display: flex; position: absolute; top: -5px; right: -5px; z-index: 3; box-sizing: border-box; width: 26px; height: 26px; align-items: center; justify-content: center; border: 3px solid #071f0d; border-radius: 50%; background: #ffd32f; box-shadow: 0 2px 7px rgba(0, 0, 0, .7), 0 0 10px currentColor; color: #3a2d00; padding: 0 0 2px; font-family: Arial, sans-serif; font-size: 19px; font-weight: 900; line-height: 1; }
.plant-overlay.positief .effect-badge { background: #56f044; color: #0b3a07; }.plant-overlay.negatief .effect-badge { background: #ff5145; color: #fff; }

.plant-overlay.groot::after {
  inset: 3px;
  border-width: 3px;
}

.plant-overlay.tutorial-plaatsing-highlight {
  z-index: 6;
  animation: plant-tutorial-pulse 1.25s ease-in-out infinite;
}

.plant-overlay.tutorial-plaatsing-highlight::after {
  inset: -2px;
  border-color: #ffd629;
  border-width: 5px;
  background: rgba(255, 214, 41, .12);
  box-shadow: inset 0 0 26px rgba(255, 214, 41, .72), 0 0 0 3px rgba(255, 214, 41, .22), 0 0 28px rgba(255, 214, 41, .9);
}

@keyframes plant-tutorial-pulse {
  0%, 100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.18);
  }
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
