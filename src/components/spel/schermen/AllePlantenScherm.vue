<script setup lang="ts">
import { computed, ref } from 'vue'
import { planten } from '../../../data/planten'
import bannerBeeld from '../../../assets/level-3-walnoot-hazelnootpasta.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'

const props = defineProps<{
  plantIds?: string[]
  startPlantId?: string
  terugNaarLevel?: boolean
}>()

defineEmits<{
  levels: []
  openGerechten: []
  sluiten: []
}>()

const geselecteerdId = ref(props.startPlantId ?? planten[0]?.id ?? '')
const zichtbarePlanten = computed(() =>
  props.plantIds?.length
    ? planten.filter((plant) => props.plantIds?.includes(plant.id ?? ''))
    : planten,
)
const geselecteerdePlant = computed(() =>
  zichtbarePlanten.value.find((plant) => plant.id === geselecteerdId.value) ?? zichtbarePlanten.value[0] ?? planten[0]!,
)

function plantMetId(id: string) {
  return planten.find((plant) => plant.id === id)
}
</script>

<template>
  <main class="planten-scherm">
    <header class="planten-kop">
      <img :src="studiestapLogo" alt="Studie-Stap" />
      <button v-if="terugNaarLevel" type="button" class="terug-knop" @click="$emit('sluiten')">
        ← Terug naar level
      </button>
    </header>

    <nav class="planten-tabs" aria-label="Informatieschermen">
      <button v-if="!terugNaarLevel" type="button" @click="$emit('levels')">Levels</button>
      <button v-if="!terugNaarLevel" type="button" @click="$emit('openGerechten')">Gerechten</button>
      <button type="button" class="actief">Alle planten</button>
    </nav>

    <div class="planten-layout">
      <section class="planten-overzicht">
        <h1>Planten info</h1>
        <div class="planten-raster">
          <button
            v-for="plant in zichtbarePlanten"
            :key="plant.id"
            type="button"
            class="plant-tegel"
            :class="{ geselecteerd: plant.id === geselecteerdePlant.id }"
            @click="geselecteerdId = plant.id ?? ''"
          >
            <span class="plant-beeld"><img v-if="plant.afbeelding" :src="plant.afbeelding" alt="" /></span>
            <strong>{{ plant.naam }}</strong>
            <small>{{ plant.terrein }}</small>
          </button>
        </div>
      </section>

      <section class="plant-detail">
        <small>Geselecteerde plant</small>
        <div class="gouden-lijn"></div>
        <span class="laag-label">{{ geselecteerdePlant.laag }}</span>
        <div class="detail-banner">
          <img :src="bannerBeeld" alt="Voedselbos in bloei" />
        </div>
        <h2>{{ geselecteerdePlant.naam }}</h2>
        <span class="terrein-label">{{ geselecteerdePlant.terrein }}</span>
        <p class="intro-tekst">{{ geselecteerdePlant.beschrijving }}</p>

        <div class="eigenschappen">
          <h3>Eigenschappen</h3>
          <p>{{ geselecteerdePlant.eigenschappen }}</p>
        </div>

        <div class="combinaties">
          <h3>Beste combinaties</h3>
          <article v-for="combinatie in geselecteerdePlant.combinaties" :key="combinatie.id">
            <img v-if="plantMetId(combinatie.id)?.afbeelding" :src="plantMetId(combinatie.id)?.afbeelding" alt="" />
            <div>
              <strong>{{ plantMetId(combinatie.id)?.naam }}</strong>
              <span>{{ combinatie.relatie }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.planten-scherm { width: 100%; min-height: 100dvh; background: #102d16; color: #dce9cf; }
.planten-kop { display: flex; width: 100%; height: 56px; align-items: center; justify-content: space-between; padding: 0 24px; background: #071b0d; }
.planten-kop img { width: 86px; }.planten-kop button { border: 1px solid #285c2c; border-radius: 6px; background: #153a19; color: #83c376; padding: 10px 17px; font-size: 12px; }
.planten-tabs { display: flex; width: 100%; height: 58px; align-items: end; gap: 12px; padding: 0 28px; border-bottom: 1px solid #2b5630; background: #0e2c14; }
.planten-tabs button { min-width: 145px; height: 46px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: #66856a; padding: 0 17px; font-size: 14px; font-weight: 700; }.planten-tabs .actief { border-bottom-color: #65bc4d; color: #91d57d; }
.planten-layout { display: grid; grid-template-columns: 55% 45%; width: 100%; min-height: calc(100dvh - 114px); }
.planten-overzicht { padding: 16px 30px 38px; background: #102d16; }.planten-overzicht h1 { margin-bottom: 32px; color: #eee2bd; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; }
.planten-raster { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.plant-tegel { display: grid; min-width: 0; height: 210px; grid-template-rows: 112px auto auto; overflow: hidden; border: 1px solid #2d6032; border-radius: 10px; background: #102d16; color: #dce9cf; padding: 0; text-align: left; }
.plant-tegel.geselecteerd { border: 3px solid #dda915; background: #283b16; }.plant-beeld { display: grid; width: 100%; height: 112px; place-items: center; background: #153f1b; }.plant-beeld img { width: 88px; height: 88px; object-fit: contain; }.plant-tegel strong { padding: 12px 16px 3px; color: #f2ebd1; font-size: 15px; }.plant-tegel small { align-self: center; width: fit-content; margin: 4px 16px 12px; border: 1px solid #4b8f45; border-radius: 4px; color: #8bc77b; padding: 5px 9px; font-size: 11px; }
.plant-detail { min-width: 0; padding: 30px 34px; background: #173d1d; }.plant-detail > small, .plant-detail h3 { color: #88a989; font-size: 12px; font-weight: 700; text-transform: uppercase; }.gouden-lijn { height: 5px; margin: 12px 0 10px; border-radius: 2px; background: #dda915; }.laag-label, .terrein-label { display: block; width: fit-content; border-radius: 4px; background: #0b2810; color: #88bd7d; padding: 5px 14px; font-size: 11px; }.detail-banner { height: 150px; margin-top: 12px; overflow: hidden; border-radius: 14px; }.detail-banner img { width: 100%; height: 100%; object-fit: cover; object-position: center 58%; filter: brightness(.72) saturate(.8); }
.plant-detail h2 { margin-top: 14px; color: #eee2bd; font-family: Georgia, 'Times New Roman', serif; font-size: 36px; }.intro-tekst, .eigenschappen p { margin-top: 13px; color: #c0d0bf; font-size: 14px; line-height: 1.6; }.eigenschappen { margin-top: 26px; padding-top: 18px; border-top: 1px solid #3b6940; }.eigenschappen p { margin-top: 10px; }.combinaties { margin-top: 26px; }.combinaties h3 { margin-bottom: 12px; }.combinaties article { display: flex; align-items: center; gap: 15px; margin-top: 10px; border: 1px solid #36713d; border-radius: 8px; background: #0c2a12; padding: 11px 14px; }.combinaties article img { width: 46px; height: 46px; object-fit: contain; }.combinaties article div { display: grid; gap: 3px; }.combinaties article strong { color: #e5efd9; font-size: 14px; }.combinaties article span { color: #91aa93; font-size: 12px; line-height: 1.4; }
@media (max-width: 850px) { .planten-layout { grid-template-columns: 1fr; }.planten-raster { grid-template-columns: repeat(2, minmax(0, 1fr)); }.plant-detail { border-top: 1px solid #2b5630; } }
@media (max-width: 480px) { .planten-raster { grid-template-columns: 1fr; }.plant-tegel { height: 190px; }.planten-overzicht, .plant-detail { padding-inline: 16px; } }
</style>
