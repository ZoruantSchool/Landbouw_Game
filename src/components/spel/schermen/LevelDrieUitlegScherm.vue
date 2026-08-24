<script setup lang="ts">
import { computed } from 'vue'
import levelEenUitlegBeeld from '../../../assets/level-1-appeltaart-uitleg.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import type { LevelConfig } from '../../../data/levels/types'

const props = defineProps<{
  level: LevelConfig
}>()

defineEmits<{
  start: []
  terug: []
}>()

const terreinKleuren = {
  grasland: '#79cf7c',
  heuvel: '#d4d0ba',
  oever: '#d5e78a',
  water: '#45a8d1',
  schaduw: '#526a36',
  akker: '#bc8c5c',
}

const terreinNamen = {
  grasland: 'Grasland',
  heuvel: 'Heuvel',
  oever: 'Oever',
  water: 'Water - niet speelbaar',
  schaduw: 'Schaduw',
  akker: 'Akker',
}

const terreintypes = computed(() =>
  [...new Set(props.level.terreinKaart.flat())].map((terrein) => ({
    kleur: terreinKleuren[terrein],
    naam: terreinNamen[terrein],
  })),
)

const uitleg = computed(() => props.level.uitleg ?? {
  titel: props.level.titel,
  subtitel: 'Welk gewas past waar?',
  tekst: 'In dit level bouw je een voedselbos dat uit meerdere lagen bestaat. Kies slim waar je elk gewas plaatst en zorg voor sterke combinaties.',
  uitlegTekst: 'Let niet alleen op het terrein, maar ook op de ruimte en op welke planten elkaar versterken.',
  knopTekst: `Start level ${props.level.nummer}`,
})

const beeld = computed(() => props.level.nummer === 1 ? levelEenUitlegBeeld : props.level.afbeelding)
</script>

<template>
  <main class="uitleg-scherm">
    <header class="uitleg-kop">
      <img :src="studiestapLogo" alt="Studie-Stap, workshops voor scholieren" />
      <button type="button" @click="$emit('terug')">← Terug naar levels</button>
    </header>

    <section class="uitleg-inhoud">
      <div class="tekst-kolom">
        <div class="intro">
          <small>Level {{ level.nummer }}</small>
          <h1>{{ uitleg.titel }}</h1>

          <h2>{{ uitleg.subtitel }}</h2>
          <p class="beschrijving">
            {{ uitleg.tekst }}
          </p>
        </div>

        <div class="terrein-groep">
          <h3>Terreintypes in dit level</h3>
          <ul>
            <li v-for="terrein in terreintypes" :key="terrein.naam">
              <span :style="{ backgroundColor: terrein.kleur }"></span>{{ terrein.naam }}
            </li>
          </ul>
        </div>

        <aside class="uitleg-kaart">
          <h3>Uitleg</h3>
          <p>
            {{ uitleg.uitlegTekst }}
          </p>
        </aside>

        <button type="button" class="start-knop" @click="$emit('start')">{{ uitleg.knopTekst }}</button>
      </div>

      <div class="beeld-kolom">
        <img
          :src="beeld"
          :alt="`Illustratie voor level ${level.nummer}: ${level.titel}`"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.uitleg-scherm {
  min-height: 100dvh;
  background: #0d2913;
  color: #789279;
}

.uitleg-kop {
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 0 3.5%;
  border-bottom: 1px solid #244529;
  background: #071b0d;
}

.uitleg-kop img {
  width: 96px;
}

.uitleg-kop button {
  border: 0;
  background: transparent;
  color: #4f6c54;
  font-size: 15px;
  font-weight: 700;
}

.uitleg-kop button:hover {
  color: #8eb391;
}

.uitleg-inhoud {
  display: grid;
  grid-template-columns: minmax(460px, 45%) 1fr;
  height: calc(100dvh - 64px);
}

.tekst-kolom {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding: clamp(28px, 4.2vh, 52px) clamp(32px, 5.5vw, 72px) 34px;
  overflow-y: auto;
}

.intro small {
  color: #67bd4c;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.intro h1,
.subtitel,
.intro h2,
.start-knop {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
}

.intro h1 {
  margin-top: 12px;
  color: #eee3c1;
  font-size: clamp(34px, 3vw, 48px);
  line-height: 1;
}

.subtitel {
  color: #eee3c1;
  font-size: clamp(21px, 1.9vw, 30px);
  line-height: 1.15;
}

.intro h2 {
  margin-top: 34px;
  color: #dcab18;
  font-size: 28px;
}

.beschrijving {
  max-width: 500px;
  margin-top: 12px;
  color: #afc2b0;
  font-size: 16px;
  line-height: 1.55;
}

.terrein-groep {
  margin-top: 24px;
}

.terrein-groep h3 {
  margin-bottom: 8px;
  color: #486e4d;
  color: #78a17d;
  font-size: 12px;
  text-transform: uppercase;
}

.terrein-groep ul {
  padding: 11px 16px;
  border: 1px solid #2d5932;
  border-radius: 12px;
  background: #173d1d;
  list-style: none;
}

.terrein-groep li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 15px;
  line-height: 1.7;
  color: #c3d0b9;
}

.terrein-groep li span {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

.uitleg-kaart {
  position: relative;
  margin-top: 28px;
  padding: 15px 18px 15px 25px;
  border: 1px solid #28502d;
  border-radius: 12px;
}

.uitleg-kaart::before {
  position: absolute;
  top: 0;
  bottom: 38%;
  left: -1px;
  width: 5px;
  border-radius: 5px;
  background: #65bc4d;
  content: '';
}

.uitleg-kaart h3 {
  color: #67bd4c;
  font-size: 16px;
  font-weight: 700;
}

.uitleg-kaart p {
  margin-top: 9px;
  color: #b6c8b6;
  font-size: 14px;
  line-height: 1.55;
}

.start-knop {
  width: 100%;
  min-height: 64px;
  margin-top: auto;
  border: 1px solid #77c957;
  border-radius: 10px;
  background: #4a9139;
  color: #fff8dd;
  font-size: 21px;
}

.start-knop:hover {
  background: #58a943;
}

.beeld-kolom {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.beeld-kolom img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@media (max-width: 800px) {
  .uitleg-inhoud {
    grid-template-columns: 1fr;
    height: auto;
  }

  .tekst-kolom {
    padding: 30px 24px;
    overflow: visible;
  }

  .start-knop {
    margin-top: 24px;
  }

  .beeld-kolom {
    order: -1;
    height: 320px;
  }
}
</style>
