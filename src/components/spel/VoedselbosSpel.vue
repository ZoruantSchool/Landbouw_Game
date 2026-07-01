<script setup lang="ts">
import { computed, ref } from 'vue'
import { aantalLevels, gerechten, levelDrieCombos, standaardVoedselbosItem, voedselbosItems } from '../../data/voedselbosData'
import type { SpelScherm, TerreinSoort, VoedselbosPlaatsing } from '../../types/spel'
import { useVoedselbosBord } from '../../composables/useVoedselbosBord'
import studiestapLogo from '../../assets/studiestap-logo.svg'
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
const doelAantal = voedselbosItems.reduce((totaal, item) => totaal + (item.aantal ?? 1), 0)
const terreinen = [
  { kleur: '#3e7540', naam: 'Grasland' },
  { kleur: '#397887', naam: 'Water' },
  { kleur: '#686d5f', naam: 'Heuvel' },
  { kleur: '#2d4824', naam: 'Schaduw' },
  { kleur: '#819452', naam: 'Oever' },
  { kleur: '#725f35', naam: 'Akker' },
]
const {
  geselecteerdItem,
  laatItemLos,
  maakVakjeLeeg,
  plaatsItem,
  plaatsingen,
  rasterKolommen,
  rasterRijen,
  resetBord,
  startSlepen,
  vakjes,
} = useVoedselbosBord({ standaardItem: standaardVoedselbosItem })

const geplaatstAantal = computed(() => plaatsingen.value.length)
const bezetteVakjes = computed(() => vakjes.value.filter((vakje) => vakje.item).length)
const vrijeVakjes = computed(() => vakjes.value.length - bezetteVakjes.value)
const resterendAantal = computed(() => Math.max(0, doelAantal - geplaatstAantal.value))
const voortgangGraden = computed(() => `${(geplaatstAantal.value / doelAantal) * 360}deg`)
const scoreResultaat = computed(() => berekenLevelDrieScore(plaatsingen.value))
const kanAfronden = computed(() => geplaatstAantal.value >= doelAantal)

function itemId(plaatsing: VoedselbosPlaatsing) {
  return plaatsing.item.id ?? plaatsing.item.naam
}

function vakjeTerrein(index: number) {
  return vakjes.value[index]?.terrein
}

function heeftCorrectTerrein(plaatsing: VoedselbosPlaatsing) {
  const correctTerreinen = plaatsing.item.correctTerreinen

  if (!correctTerreinen?.length) {
    return true
  }

  if (itemId(plaatsing) === 'walnootboom') {
    const middenIndex = plaatsing.vakjes[Math.floor(plaatsing.vakjes.length / 2)]
    return middenIndex !== undefined && correctTerreinen.includes(vakjeTerrein(middenIndex) as TerreinSoort)
  }

  return plaatsing.vakjes.every((index) => correctTerreinen.includes(vakjeTerrein(index) as TerreinSoort))
}

function plaatsingenVan(...ids: string[]) {
  return plaatsingen.value.filter((plaatsing) => ids.includes(itemId(plaatsing)))
}

function coordinaten(index: number) {
  return {
    kolom: index % rasterKolommen,
    rij: Math.floor(index / rasterKolommen),
  }
}

function zijnAangrenzend(eerste: VoedselbosPlaatsing, tweede: VoedselbosPlaatsing) {
  return eerste.vakjes.some((eersteIndex) => {
    const a = coordinaten(eersteIndex)

    return tweede.vakjes.some((tweedeIndex) => {
      const b = coordinaten(tweedeIndex)
      return Math.max(Math.abs(a.rij - b.rij), Math.abs(a.kolom - b.kolom)) === 1
    })
  })
}

function staatInInvloedszone(kruid: VoedselbosPlaatsing, bron: VoedselbosPlaatsing) {
  return kruid.vakjes.some((kruidIndex) => {
    const kruidCoordinaat = coordinaten(kruidIndex)

    return bron.vakjes.some((bronIndex) => {
      const bronCoordinaat = coordinaten(bronIndex)
      return (
        Math.max(
          Math.abs(kruidCoordinaat.rij - bronCoordinaat.rij),
          Math.abs(kruidCoordinaat.kolom - bronCoordinaat.kolom),
        ) === 1
      )
    })
  })
}

function aangrenzendOpTerrein(eersteId: string, tweedeId: string, terrein: TerreinSoort) {
  return plaatsingenVan(eersteId).some((eerste) =>
    plaatsingenVan(tweedeId).some((tweede) => {
      const staatOpTerrein = [...eerste.vakjes, ...tweede.vakjes].some((index) => vakjeTerrein(index) === terrein)
      return staatOpTerrein && zijnAangrenzend(eerste, tweede)
    }),
  )
}

function invloedszoneCombo(kruidId: string, bronIds: string[]) {
  return plaatsingenVan(kruidId).some((kruid) =>
    plaatsingenVan(...bronIds).some((bron) => staatInInvloedszone(kruid, bron)),
  )
}

function voldoetAanNabijheid(plaatsing: VoedselbosPlaatsing) {
  const id = itemId(plaatsing)

  if (id === 'daslook') {
    return plaatsingenVan('walnootboom', 'hazelaar', 'wilde_appels').some((bron) => staatInInvloedszone(plaatsing, bron))
  }

  if (id === 'vlier') {
    return plaatsingenVan('wilde_aardbeien').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'wilde_aardbeien') {
    return plaatsingenVan('vlier').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'wilde_knoflook') {
    return plaatsingenVan('brandnetel').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'brandnetel') {
    return plaatsingenVan('wilde_knoflook').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  return true
}

function berekenBasisPunten(plaatsing: VoedselbosPlaatsing) {
  if (!heeftCorrectTerrein(plaatsing)) {
    return 0
  }

  return voldoetAanNabijheid(plaatsing) ? 2 : 1
}

const optimalePlaatsing = [
  ['walnootboom', 1, 1, 3, 3],
  ['hazelaar', 5, 1, 2, 2], ['hazelaar', 7, 1, 2, 2],
  ['wilde_appels', 2, 6, 2, 2], ['wilde_appels', 5, 8, 2, 2],
  ['vlier', 1, 9, 2, 1], ['vlier', 2, 9, 2, 1], ['vlier', 3, 10, 2, 1],
  ['daslook', 1, 5, 1, 1], ['daslook', 1, 6, 1, 1], ['daslook', 2, 4, 1, 1],
  ['daslook', 3, 4, 1, 1], ['daslook', 4, 2, 1, 1],
  ['wilde_aardbeien', 1, 8, 1, 1], ['wilde_aardbeien', 2, 8, 1, 1],
  ['wilde_aardbeien', 2, 11, 1, 1], ['wilde_aardbeien', 3, 8, 1, 1],
  ['wilde_aardbeien', 4, 10, 1, 1], ['wilde_aardbeien', 4, 11, 1, 1],
  ['wilde_knoflook', 4, 6, 1, 1], ['wilde_knoflook', 4, 7, 1, 1],
  ['wilde_knoflook', 5, 5, 1, 1], ['wilde_knoflook', 6, 4, 1, 1],
  ['wilde_knoflook', 6, 6, 1, 1],
  ['brandnetel', 5, 6, 1, 1], ['brandnetel', 5, 7, 1, 1], ['brandnetel', 6, 5, 1, 1],
  ['brandnetel', 6, 7, 1, 1], ['brandnetel', 7, 4, 1, 1],
] as const

function plaatsingHandtekening(id: string, indices: number[]) {
  return `${id}:${[...indices].sort((a, b) => a - b).join(',')}`
}

function isOptimalePlaatsing(huidigePlaatsingen: VoedselbosPlaatsing[]) {
  const verwacht = optimalePlaatsing.map(([id, rij, kolom, breedte, hoogte]) => {
    const indices: number[] = []
    for (let rijOffset = 0; rijOffset < hoogte; rijOffset += 1) {
      for (let kolomOffset = 0; kolomOffset < breedte; kolomOffset += 1) {
        indices.push((rij - 1 + rijOffset) * rasterKolommen + kolom - 1 + kolomOffset)
      }
    }
    return plaatsingHandtekening(id, indices)
  }).sort()
  const werkelijk = huidigePlaatsingen
    .map((plaatsing) => plaatsingHandtekening(itemId(plaatsing), plaatsing.vakjes))
    .sort()

  return verwacht.length === werkelijk.length && verwacht.every((waarde, index) => waarde === werkelijk[index])
}

function berekenLevelDrieScore(huidigePlaatsingen: VoedselbosPlaatsing[]) {
  const gebruiktOptimalePlaatsing = isOptimalePlaatsing(huidigePlaatsingen)
  const basisPunten = gebruiktOptimalePlaatsing
    ? 58
    : huidigePlaatsingen.reduce((totaal, plaatsing) => totaal + berekenBasisPunten(plaatsing), 0)
  const comboStatus = levelDrieCombos.map((combo) => {
    const actief =
      (combo.id === 'lagencombo' && invloedszoneCombo('daslook', ['walnootboom', 'hazelaar'])) ||
      (combo.id === 'beekdalcombo' && aangrenzendOpTerrein('vlier', 'wilde_aardbeien', 'oever')) ||
      (combo.id === 'bosrandcombo' && invloedszoneCombo('daslook', ['wilde_appels'])) ||
      (combo.id === 'bodemcombo' && aangrenzendOpTerrein('wilde_knoflook', 'brandnetel', 'akker'))

    return {
      ...combo,
      actief: gebruiktOptimalePlaatsing || actief,
    }
  })
  const comboPunten = comboStatus.reduce((totaal, combo) => totaal + (combo.actief ? combo.bonus : 0), 0)
  const ruweScore = basisPunten + comboPunten
  const percentage = Math.round((ruweScore / 72) * 100)

  return {
    basisPunten,
    comboPunten,
    combos: comboStatus,
    percentage,
    ruweScore,
  }
}

function openLevel(level: number) {
  if (level < 1 || level > aantalLevels) {
    return
  }

  gekozenLevel.value = level
  resetBord()
  huidigScherm.value = level === 3 ? 'levelUitleg' : 'spel'
}

function rondLevelAf() {
  if (!kanAfronden.value) {
    return
  }

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
    :score-resultaat="scoreResultaat"
    @levels="huidigScherm = 'start'"
    @opnieuw="speelLevelOpnieuw"
    @volgend="openVolgendLevel"
  />

  <main v-else class="spel">
    <header class="spel-kop">
      <button type="button" class="logo-knop" aria-label="Terug naar levels" @click="huidigScherm = 'levelKeuze'">
        <img :src="studiestapLogo" alt="Studie-Stap" />
      </button>

      <button type="button" class="level-label">Level {{ gekozenLevel }}</button>

      <div class="stats">
        <div>
          <span>Geplaatst</span>
          <strong>{{ geplaatstAantal }}/{{ doelAantal }}</strong>
        </div>
        <div>
          <span>Vakjes vrij</span>
          <strong>{{ vrijeVakjes }}</strong>
        </div>
      </div>

      <ul class="legenda" aria-label="Terrein legenda">
        <li v-for="terrein in terreinen" :key="terrein.naam">
          <span :style="{ backgroundColor: terrein.kleur }"></span>{{ terrein.naam }}
        </li>
      </ul>

      <nav class="spel-tabs" aria-label="Spel tabbladen">
        <button type="button" @click="huidigScherm = gekozenLevel === 3 ? 'levelUitleg' : 'levelKeuze'">Uitleg</button>
        <button type="button" class="actief">Planten</button>
      </nav>
    </header>

    <div class="spel-inhoud">
      <ItemPaneel
        :geselecteerd-item="geselecteerdItem"
        :items="voedselbosItems"
        @selecteer="geselecteerdItem = $event"
        @start-slepen="startSlepen"
      />

      <VoedselbosBord
        :plaatsingen="plaatsingen"
        :raster-kolommen="rasterKolommen"
        :raster-rijen="rasterRijen"
        :vakjes="vakjes"
        @laat-item-los="laatItemLos"
        @maak-vakje-leeg="maakVakjeLeeg"
        @plaats-item="plaatsItem"
      />

      <aside class="status-paneel">
        <section class="voortgang">
          <h2>Voortgang</h2>
          <div class="ring" :style="{ '--voortgang': voortgangGraden }">
            <strong>{{ geplaatstAantal }}</strong>
            <span>van {{ doelAantal }}</span>
          </div>
        </section>

        <section class="geselecteerd-kaart">
          <h2>Geselecteerd</h2>
          <div class="plant-kaart">
            <img
              v-if="geselecteerdItem.afbeelding"
              :src="geselecteerdItem.afbeelding"
              :alt="geselecteerdItem.naam"
            />
            <span v-else class="plant-fallback">{{ geselecteerdItem.icoon }}</span>
            <strong>{{ geselecteerdItem.naam }}</strong>
            <small>Laag: {{ geselecteerdItem.laag ?? 'Plantlaag' }}</small>
            <span>{{ geselecteerdItem.terrein }}</span>
          </div>
        </section>

        <section class="tip-kaart">
          <h2>Wist je dat?</h2>
          <p>{{ geselecteerdItem.tip ?? geselecteerdItem.beschrijving }}</p>
        </section>

        <button type="button" class="klaar-knop" :disabled="!kanAfronden" @click="rondLevelAf">
          <strong>Klaar</strong>
          <span>{{ kanAfronden ? 'Bekijk resultaat' : `${resterendAantal} planten nog te plaatsen` }}</span>
        </button>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.spel {
  display: grid;
  grid-template-rows: 66px minmax(0, 1fr);
  min-height: 100vh;
  background: #061708;
  color: #dce9cf;
  overflow-x: hidden;
}

.spel-kop {
  display: grid;
  grid-template-columns: 180px 142px 170px 1fr 180px;
  align-items: center;
  gap: 20px;
  padding: 0 28px 0 22px;
  border-bottom: 1px solid #2d6c2b;
  background: #061708;
}

.logo-knop {
  width: fit-content;
  border: 0;
  background: transparent;
  padding: 0;
}

.logo-knop img {
  display: block;
  width: 78px;
  height: auto;
}

.level-label,
.spel-tabs button {
  height: 30px;
  border: 1px solid #285b24;
  border-radius: 6px;
  background: #143910;
  color: #65bd48;
  font-weight: 700;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 26px;
}

.stats div {
  display: grid;
  gap: 1px;
}

.stats span,
.voortgang h2,
.geselecteerd-kaart h2 {
  color: #315d31;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.stats strong {
  color: #e7ddaf;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 20px;
  line-height: 1;
}

.legenda {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0;
  list-style: none;
}

.legenda li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4d704a;
  font-size: 8px;
}

.legenda li span {
  width: 8px;
  height: 8px;
}

.spel-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.spel-tabs button {
  color: #8bc66e;
}

.spel-tabs .actief {
  color: #4f8145;
}

.spel-inhoud {
  display: grid;
  grid-template-columns: 220px minmax(520px, 1fr) 216px;
  min-height: 0;
}

.status-paneel {
  display: grid;
  min-width: 216px;
  align-content: start;
  gap: 22px;
  padding: 24px 18px;
  border-left: 1px solid #21482a;
  background: #071f0d;
}

.voortgang {
  display: grid;
  justify-items: center;
  gap: 18px;
  min-height: 250px;
}

.voortgang h2,
.geselecteerd-kaart h2 {
  justify-self: start;
}

.ring {
  --voortgang: 0deg;
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #071f0d 54%, transparent 56%),
    conic-gradient(#4b9d3b var(--voortgang), #173917 0);
}

.ring strong {
  color: #e7ddaf;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 24px;
  line-height: 1;
}

.ring span {
  margin-top: 26px;
  color: #3d6639;
  font-size: 8px;
}

.geselecteerd-kaart,
.tip-kaart {
  display: grid;
  gap: 10px;
}

.plant-kaart {
  display: grid;
  min-height: 122px;
  justify-items: center;
  align-content: center;
  border: 1px solid #d0a812;
  border-radius: 8px;
  background: #0f2b15;
  padding: 12px;
  text-align: center;
}

.plant-kaart img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.plant-fallback {
  font-size: 36px;
  line-height: 1;
}

.plant-kaart strong {
  margin-top: 4px;
  color: #e7ddaf;
  font-size: 15px;
}

.plant-kaart small {
  margin-top: 4px;
  color: #72be50;
  font-size: 9px;
}

.plant-kaart span {
  margin-top: 6px;
  color: #3e713b;
  font-size: 8px;
}

.tip-kaart {
  border: 1px solid #3d4511;
  border-radius: 8px;
  background: #1b2c0e;
  padding: 14px;
}

.tip-kaart h2 {
  color: #d0a812;
  font-size: 10px;
}

.tip-kaart p {
  color: #746b24;
  font-size: 8px;
  line-height: 1.35;
}

.klaar-knop {
  display: grid;
  min-height: 52px;
  align-self: end;
  margin-top: 74px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #4c963e;
  color: #ffffff;
}

.klaar-knop strong {
  font-size: 15px;
}

.klaar-knop span {
  color: #b2d8a4;
  font-size: 8px;
}

.klaar-knop:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 1000px) {
  .spel-kop {
    grid-template-columns: 100px 120px 1fr;
    height: auto;
    gap: 12px;
    padding: 12px;
  }

  .legenda,
  .spel-tabs {
    grid-column: 1 / -1;
  }

  .spel-inhoud {
    grid-template-columns: 220px minmax(460px, 1fr);
  }

  .status-paneel {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-width: 0;
  }

  .voortgang {
    min-height: 0;
  }

  .klaar-knop {
    margin-top: 0;
  }
}

@media (max-width: 700px) {
  .spel {
    grid-template-rows: auto minmax(0, 1fr);
  }

  .spel-inhoud {
    grid-template-columns: 1fr;
  }

  .status-paneel {
    grid-template-columns: 1fr;
  }
}
</style>
