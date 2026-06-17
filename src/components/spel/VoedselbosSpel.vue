<script setup lang="ts">
import { ref } from 'vue'
import { aantalLevels, gerechten, standaardVoedselbosItem, voedselbosItems } from '../../data/voedselbosData'
import type { SpelScherm } from '../../types/spel'
import { useVoedselbosBord } from '../../composables/useVoedselbosBord'
import ItemPaneel from './ItemPaneel.vue'
import VoedselbosBord from './VoedselbosBord.vue'
import GerechtenScherm from './schermen/GerechtenScherm.vue'
import LevelEindeScherm from './schermen/LevelEindeScherm.vue'
import LevelKeuzeScherm from './schermen/LevelKeuzeScherm.vue'
import StartScherm from './schermen/StartScherm.vue'

const huidigScherm = ref<SpelScherm>('start')
const gekozenLevel = ref(1)
const {
  bordBreedte,
  bordHoogte,
  bordVerschuiving,
  geselecteerdItem,
  gevuldeVakjes,
  laatItemLos,
  maakVakjeLeeg,
  plaatsItem,
  rasterGrootte,
  resetBord,
  startSlepen,
  vakjes,
} = useVoedselbosBord({ standaardItem: standaardVoedselbosItem })

function openLevel(level: number) {
  gekozenLevel.value = level
  resetBord()
  huidigScherm.value = 'spel'
}

function rondLevelAf() {
  huidigScherm.value = 'einde'
}

function speelLevelOpnieuw() {
  resetBord()
  huidigScherm.value = 'spel'
}

function openVolgendLevel() {
  openLevel(gekozenLevel.value + 1)
}
</script>

<template>
  <StartScherm v-if="huidigScherm === 'start'" @start="huidigScherm = 'levelKeuze'" />

  <LevelKeuzeScherm
    v-else-if="huidigScherm === 'levelKeuze'"
    :aantal-levels="aantalLevels"
    @open-gerechten="huidigScherm = 'gerechten'"
    @open-level="openLevel"
    @terug="huidigScherm = 'start'"
  />

  <GerechtenScherm
    v-else-if="huidigScherm === 'gerechten'"
    :gerechten="gerechten"
    @terug="huidigScherm = 'levelKeuze'"
  />

  <LevelEindeScherm
    v-else-if="huidigScherm === 'einde'"
    :level="gekozenLevel"
    @levels="huidigScherm = 'levelKeuze'"
    @opnieuw="speelLevelOpnieuw"
    @volgend="openVolgendLevel"
  />

  <main v-else class="spel">
    <ItemPaneel
      :geselecteerd-item="geselecteerdItem"
      :items="voedselbosItems"
      :level="gekozenLevel"
      @afronden="rondLevelAf"
      @reset="resetBord"
      @selecteer="geselecteerdItem = $event"
      @start-slepen="startSlepen"
      @terug="huidigScherm = 'levelKeuze'"
    />

    <VoedselbosBord
      :bord-breedte="bordBreedte"
      :bord-hoogte="bordHoogte"
      :bord-verschuiving="bordVerschuiving"
      :gevulde-vakjes="gevuldeVakjes"
      :raster-grootte="rasterGrootte"
      :vakjes="vakjes"
      @laat-item-los="laatItemLos"
      @maak-vakje-leeg="maakVakjeLeeg"
      @plaats-item="plaatsItem"
    />
  </main>
</template>

<style scoped>
.spel {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 16px;
  overflow-x: hidden;
}

@media (max-width: 700px) {
  .spel {
    flex-direction: column;
  }
}
</style>
