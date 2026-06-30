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
import IntroductieScherm from './schermen/IntroductieScherm.vue'
import LevelDrieUitlegScherm from './schermen/LevelDrieUitlegScherm.vue'

const huidigScherm = ref<SpelScherm>('start')
const gekozenLevel = ref(1)
const hoogsteVoltooideLevel = ref(0)
const {
  geselecteerdItem,
  laatItemLos,
  maakVakjeLeeg,
  plaatsItem,
  rasterKolommen,
  rasterRijen,
  resetBord,
  startSlepen,
  vakjes,
} = useVoedselbosBord({ standaardItem: standaardVoedselbosItem })

function openLevel(level: number) {
  if (level > hoogsteVoltooideLevel.value + 1 || level > aantalLevels) {
    return
  }

  gekozenLevel.value = level
  resetBord()
  huidigScherm.value = level === 3 ? 'levelUitleg' : 'spel'
}

function rondLevelAf() {
  hoogsteVoltooideLevel.value = Math.max(hoogsteVoltooideLevel.value, gekozenLevel.value)
  huidigScherm.value = 'einde'
}

function speelLevelOpnieuw() {
  resetBord()
  huidigScherm.value = 'spel'
}

function openVolgendLevel() {
  if (gekozenLevel.value >= aantalLevels) {
    return
  }

  openLevel(gekozenLevel.value + 1)
}
</script>

<template>
  <StartScherm
    v-if="huidigScherm === 'start'"
    @start="huidigScherm = 'introductie'"
  />

  <IntroductieScherm
    v-else-if="huidigScherm === 'introductie'"
    @begin="huidigScherm = 'levelKeuze'"
  />

  <LevelKeuzeScherm
    v-else-if="huidigScherm === 'levelKeuze'"
    :aantal-levels="aantalLevels"
    :hoogste-voltooide-level="hoogsteVoltooideLevel"
    @open-gerechten="huidigScherm = 'gerechten'"
    @open-level="openLevel"
    @terug="huidigScherm = 'start'"
  />

  <GerechtenScherm
    v-else-if="huidigScherm === 'gerechten'"
    :gerechten="gerechten"
    @terug="huidigScherm = 'levelKeuze'"
  />

  <LevelDrieUitlegScherm
    v-else-if="huidigScherm === 'levelUitleg'"
    @start="huidigScherm = 'spel'"
    @terug="huidigScherm = 'levelKeuze'"
  />

  <LevelEindeScherm
    v-else-if="huidigScherm === 'einde'"
    :aantal-levels="aantalLevels"
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
      :raster-kolommen="rasterKolommen"
      :raster-rijen="rasterRijen"
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
  min-height: 100vh;
  align-items: stretch;
  background: #071b0d;
  overflow-x: hidden;
}

@media (max-width: 700px) {
  .spel {
    flex-direction: column;
  }
}
</style>
