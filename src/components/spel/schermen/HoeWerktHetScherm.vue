<script setup lang="ts">
import { computed, ref } from 'vue'
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import tutorialScarecrow from '../../../assets/tutorial-scarecrow.png'
import { planten } from '../../../data/planten'

defineEmits<{
  sluiten: []
}>()

const tutorialDuplicaten = ['elstarboom', 'level1_vlier']
const plantenOverzicht = computed(() => planten.filter((plant) => !tutorialDuplicaten.includes(plant.id ?? '')))

const stap = ref<'uitleg' | 'planten'>('uitleg')

const stappen = [
  { nummer: 1, titel: 'Kies een plant', tekst: 'Selecteer links een plant uit je gewassenlijst. Elke plant heeft een ideaal terreintype — check het icoontje voor een hint.' },
  { nummer: 2, titel: 'Let op terrein en nabijheid', tekst: 'Correcte plaatsing geeft volle punten. Fout terrein of te ver van een companion plant kost punten — en activeert geen combo.' },
  { nummer: 3, titel: 'Plaats een grid', tekst: 'Klik op een vakje op de grid om je plant te plaatsen. Grotere planten zoals de walnoot bezetten meerdere vakjes tegelijk.' },
  { nummer: 4, titel: "Activeer combo’s", tekst: 'Bepaalde plantencombo’s versterken elkaar. Knoflook naast brandnetel, daslook onder een boom — samen geven ze bonuspunten.' },
]

const levels = [
  { naam: 'Level 1', tekst: 'Weinig terreinvariatie, leer de basis van plaatsing' },
  { naam: 'Level 2', tekst: 'Meer soorten, meer zones' },
  { naam: 'Level 3', tekst: 'Heuvel, akker, oever en water' },
]

const terreinen = [
  { naam: 'Grasland', tekst: 'Meeste planten passen hier', klasse: 'grasland' },
  { naam: 'Water', tekst: 'Alleen waterplanten', klasse: 'water' },
  { naam: 'Heuvel', tekst: 'Robuuste soorten', klasse: 'heuvel' },
  { naam: 'Schaduw', tekst: 'Kruiden die schaduw willen', klasse: 'schaduw' },
  { naam: 'Oever', tekst: 'Struiken langs het water', klasse: 'oever' },
]
</script>

<template>
  <main class="hoe-werkt-scherm">
    <header class="kop">
      <img :src="studiestapLogo" alt="Studie-Stap, workshops voor scholieren" />
      <button type="button" @click="$emit('sluiten')">Sluit scherm</button>
    </header>

    <nav aria-label="Uitleg">
      <button type="button" :class="{ actief: stap === 'uitleg' }" @click="stap = 'uitleg'">Hoe werkt het?</button>
      <button type="button" :class="{ actief: stap === 'planten' }" @click="stap = 'planten'">Planten</button>
    </nav>

    <div v-if="stap === 'uitleg'" class="inhoud">
      <aside class="mascotte" aria-hidden="true">
        <img :src="tutorialScarecrow" alt="" />
      </aside>

      <section class="uitleg">
        <h1>Hoe werkt de game?</h1>
        <p class="intro">Je bouwt een voedselbos op een grid — elk vakje heeft een terreintype dat hints geeft.<br />Plant slim, activeer combo's en haal de hoogste score.</p>

        <div class="stappen">
          <article v-for="stapItem in stappen" :key="stapItem.nummer">
            <strong class="nummer">{{ stapItem.nummer }}</strong>
            <div>
              <h2>{{ stapItem.titel }}</h2>
              <p>{{ stapItem.tekst }}</p>
            </div>
          </article>
        </div>

        <h3>De drie levels</h3>
        <div class="levels">
          <article v-for="level in levels" :key="level.naam">
            <strong>{{ level.naam }}</strong>
            <span>{{ level.tekst }}</span>
          </article>
        </div>

        <h3>Terreintypen op het grid</h3>
        <div class="terreinen">
          <article v-for="terrein in terreinen" :key="terrein.naam" :class="terrein.klasse">
            <strong>{{ terrein.naam }}</strong>
            <span>{{ terrein.tekst }}</span>
          </article>
        </div>

        <footer>
          <aside>
            <strong>Hoe scoor je punten?</strong>
            <p>Elke correct geplaatste plant geeft punten op drie meters: biodiversiteit, opbrengst en kringloop. Activeer combo's voor bonuspunten. Je eindscore is het gemiddelde van de drie meters.</p>
          </aside>
          <button type="button" @click="stap = 'planten'">Volgende: Planten →</button>
        </footer>
      </section>
    </div>

    <div v-else class="inhoud">
      <aside class="mascotte" aria-hidden="true">
        <img :src="tutorialScarecrow" alt="" />
      </aside>

      <section class="uitleg">
        <h1>De planten</h1>
        <p class="intro">Elke plant heeft een eigen terreinvoorkeur en laag in het voedselbos.<br />Klik in het spel op het info-icoontje naast een plant voor de volledige uitleg en beste combinaties.</p>

        <div class="planten-raster">
          <article v-for="plant in plantenOverzicht" :key="plant.id">
            <span class="plant-beeld"><img v-if="plant.afbeelding" :src="plant.afbeelding" alt="" /></span>
            <div>
              <strong>{{ plant.naam }}</strong>
              <small>{{ plant.laag }}</small>
              <span class="terrein-badge">{{ plant.terrein }}</span>
            </div>
          </article>
        </div>

        <footer>
          <aside>
            <strong>Wist je dat?</strong>
            <p>Planten die goed bij elkaar passen versterken elkaar — dat heet een combo en levert bonuspunten op.</p>
          </aside>
          <button type="button" @click="$emit('sluiten')">Klaar, begin met spelen →</button>
        </footer>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hoe-werkt-scherm { min-height: 100dvh; background: #102f17; color: #d9e3cf; }
.kop { display: flex; height: 64px; align-items: center; justify-content: space-between; padding: 0 22px; border-bottom: 1px solid #244c2a; background: #071b0d; }
.kop img { width: 92px; }
.kop button { border: 1px solid #28582d; border-radius: 8px; background: #14391a; color: #67b94c; padding: 10px 18px; }
nav { display: flex; height: 46px; align-items: end; gap: 8px; padding-left: 32px; border-bottom: 1px solid #2b582f; background: #0c2912; }
nav button { height: 37px; border: 1px solid transparent; border-bottom: 2px solid transparent; border-radius: 7px 7px 0 0; background: transparent; color: #5c8060; padding: 9px 14px; font-size: 13px; font-weight: 700; transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease; }
nav button:hover { color: #8bc873; }
nav button.actief { border-color: #37783a; border-bottom-color: #68c34c; background: #173d1d; color: #69bd50; }
.inhoud { display: grid; min-height: calc(100dvh - 110px); grid-template-columns: minmax(260px, 27%) 1fr; animation: voedselbos-fade-in 0.35s ease both; }
.mascotte { display: flex; align-items: center; justify-content: center; overflow: hidden; border-right: 1px solid #315a35; background: #0c2a13; padding: 28px; }
.mascotte img { width: min(100%, 330px); max-height: 590px; object-fit: contain; animation: voedselbos-bob 3.6s ease-in-out infinite; }
.uitleg { padding: 18px clamp(26px, 3vw, 48px) 34px; background: #173d1d; }
h1 { color: #eee3c1; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(30px, 3vw, 40px); }
.intro { margin: 8px 0 22px; color: #79947b; font-size: 14px; line-height: 1.35; }
.stappen { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
.stappen article { display: grid; min-height: 100px; grid-template-columns: 58px 1fr; overflow: hidden; border: 1px solid #2d5b32; border-radius: 10px; background: #0d2a13; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.stappen article:hover { transform: translateY(-3px); border-color: #45923c; box-shadow: 0 10px 22px rgba(0, 0, 0, 0.3); }
.nummer { display: grid; place-items: center; background: #39762d; color: white; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; }
.stappen article div { padding: 16px 18px; }
.stappen h2 { color: #eee5c9; font-size: 14px; }
.stappen p { margin-top: 8px; color: #718c73; font-size: 12px; line-height: 1.35; }
h3 { margin: 14px 0 7px; color: #66866a; font-size: 10px; text-transform: uppercase; }
.levels, .terreinen { display: grid; gap: 10px; border: 1px solid #2c5931; border-radius: 10px; background: #0c2a13; padding: 10px; }
.levels { grid-template-columns: repeat(3, 1fr); }
.levels article, .terreinen article { display: grid; gap: 7px; border: 1px solid #397c35; border-radius: 8px; background: #13351a; padding: 11px 16px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.levels article:hover, .terreinen article:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.28); }
.levels strong, .terreinen strong { color: #6abd4f; font-size: 12px; }
.levels span, .terreinen span { color: #6d896f; font-size: 10px; }
.terreinen { grid-template-columns: repeat(5, 1fr); }
.terreinen .water { border-color: #245e81; background: #142f3a; }.terreinen .water strong { color: #62a8dc; }
.terreinen .heuvel { border-color: #72551f; background: #2d301c; }.terreinen .heuvel strong { color: #c39451; }
.terreinen .schaduw { border-color: #202c1d; background: #20291b; }.terreinen .schaduw strong { color: #987553; }
.terreinen .oever { border-color: #817421; background: #716a24; }.terreinen .oever strong { color: #d9c955; }
.planten-raster { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.planten-raster article { display: grid; grid-template-rows: 88px auto; overflow: hidden; border: 1px solid #2d5b32; border-radius: 10px; background: #0d2a13; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.planten-raster article:hover { transform: translateY(-3px); border-color: #45923c; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); }
.plant-beeld { display: grid; place-items: center; background: #14351a; padding: 8px; }
.plant-beeld img { width: 56px; height: 56px; object-fit: contain; transition: transform 0.2s ease; }
.planten-raster article:hover .plant-beeld img { transform: scale(1.12); }
.planten-raster article div { display: grid; gap: 4px; padding: 10px 12px 12px; }
.planten-raster strong { color: #eee5c9; font-size: 13px; }
.planten-raster small { color: #6d896f; font-size: 10px; text-transform: uppercase; }
.terrein-badge { justify-self: start; border: 1px solid #397c35; border-radius: 4px; color: #6abd4f; padding: 3px 8px; font-size: 10px; }
footer { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; }
footer aside { border: 1px solid #6b671b; border-radius: 10px; background: #293c1b; padding: 14px 18px; }
footer aside strong { color: #ddb51b; font-size: 10px; text-transform: uppercase; }
footer aside p { margin-top: 10px; color: #c8d0b0; font-size: 12px; line-height: 1.35; }
footer button { border: 1px solid #77ca53; border-radius: 10px; background: #4c9639; color: white; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; }
footer button:hover { background: #59ab41; box-shadow: 0 8px 20px rgba(76, 150, 57, 0.4); }
footer aside { transition: transform 0.2s ease, box-shadow 0.2s ease; }
footer aside:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25); }
@media (max-width: 900px) { .inhoud { grid-template-columns: 1fr; }.mascotte { display: none; }.terreinen { grid-template-columns: repeat(3, 1fr); }.planten-raster { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 620px) { .uitleg { padding-inline: 16px; }.stappen, .levels, footer { grid-template-columns: 1fr; }.terreinen { grid-template-columns: repeat(2, 1fr); }.planten-raster { grid-template-columns: repeat(2, 1fr); } footer button { min-height: 58px; } }
</style>
