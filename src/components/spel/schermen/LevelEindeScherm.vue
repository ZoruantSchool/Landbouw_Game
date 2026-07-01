<script setup lang="ts">
import { computed } from 'vue'
import { levelDrieTerreinKaart } from '../../../data/voedselbosData'
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import brandnetelAfbeelding from '../../../assets/plant-brandnetel.png'
import daslookAfbeelding from '../../../assets/plant-daslook.png'
import hazelaarAfbeelding from '../../../assets/plant-hazelaar.png'
import vlierAfbeelding from '../../../assets/plant-vlier.png'
import walnootboomAfbeelding from '../../../assets/plant-walnootboom.png'
import wildeAardbeienAfbeelding from '../../../assets/plant-wilde-aardbeien.png'
import wildeAppelAfbeelding from '../../../assets/plant-wilde-appel.png'
import wildeKnoflookAfbeelding from '../../../assets/plant-wilde-knoflook.png'

const props = defineProps<{
  level: number
  scoreResultaat?: {
    basisPunten: number
    comboPunten: number
    combos: {
      actief: boolean
      actiefTekst: string
      bonus: number
      gemistTekst: string
      id: string
      naam: string
    }[]
    percentage: number
    ruweScore: number
  }
}>()

defineEmits<{
  levels: []
  opnieuw: []
  volgend: []
}>()

const score = computed(() => props.scoreResultaat?.percentage ?? 0)
const sterren = computed(() => (score.value >= 80 ? 3 : score.value >= 50 ? 2 : 1))
const gemisteCombos = computed(() => props.scoreResultaat?.combos.filter((combo) => !combo.actief) ?? [])
const feedback = computed(() => {
  if (score.value >= 80) return 'Perfecte balans. Je hebt het voedselbos als systeem laten werken. Dit is agroforestry.'
  if (score.value >= 50) return "Goed begin. Maar kijk nog eens naar de gemiste combo's. Denk in lagen en zones."
  return 'De planten werken nog niet genoeg samen. Denk in lagen: boom, struik en kruid.'
})

const optimalePlanten = [
  { afbeelding: walnootboomAfbeelding, kolom: 1, rij: 1, breedte: 3, hoogte: 3 },
  { afbeelding: hazelaarAfbeelding, kolom: 1, rij: 5, breedte: 2, hoogte: 2 },
  { afbeelding: hazelaarAfbeelding, kolom: 1, rij: 7, breedte: 2, hoogte: 2 },
  { afbeelding: wildeAppelAfbeelding, kolom: 6, rij: 2, breedte: 2, hoogte: 2 },
  { afbeelding: wildeAppelAfbeelding, kolom: 8, rij: 5, breedte: 2, hoogte: 2 },
  { afbeelding: vlierAfbeelding, kolom: 9, rij: 1, breedte: 2, hoogte: 1 },
  { afbeelding: vlierAfbeelding, kolom: 9, rij: 2, breedte: 2, hoogte: 1 },
  { afbeelding: vlierAfbeelding, kolom: 10, rij: 3, breedte: 2, hoogte: 1 },
  { afbeelding: daslookAfbeelding, kolom: 5, rij: 1, breedte: 1, hoogte: 1 },
  { afbeelding: daslookAfbeelding, kolom: 6, rij: 1, breedte: 1, hoogte: 1 },
  { afbeelding: daslookAfbeelding, kolom: 4, rij: 2, breedte: 1, hoogte: 1 },
  { afbeelding: daslookAfbeelding, kolom: 4, rij: 3, breedte: 1, hoogte: 1 },
  { afbeelding: daslookAfbeelding, kolom: 2, rij: 4, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 8, rij: 1, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 8, rij: 2, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 11, rij: 2, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 8, rij: 3, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 10, rij: 4, breedte: 1, hoogte: 1 },
  { afbeelding: wildeAardbeienAfbeelding, kolom: 11, rij: 4, breedte: 1, hoogte: 1 },
  { afbeelding: wildeKnoflookAfbeelding, kolom: 6, rij: 4, breedte: 1, hoogte: 1 },
  { afbeelding: wildeKnoflookAfbeelding, kolom: 7, rij: 4, breedte: 1, hoogte: 1 },
  { afbeelding: wildeKnoflookAfbeelding, kolom: 5, rij: 5, breedte: 1, hoogte: 1 },
  { afbeelding: wildeKnoflookAfbeelding, kolom: 4, rij: 6, breedte: 1, hoogte: 1 },
  { afbeelding: wildeKnoflookAfbeelding, kolom: 6, rij: 6, breedte: 1, hoogte: 1 },
  { afbeelding: brandnetelAfbeelding, kolom: 6, rij: 5, breedte: 1, hoogte: 1 },
  { afbeelding: brandnetelAfbeelding, kolom: 7, rij: 5, breedte: 1, hoogte: 1 },
  { afbeelding: brandnetelAfbeelding, kolom: 5, rij: 6, breedte: 1, hoogte: 1 },
  { afbeelding: brandnetelAfbeelding, kolom: 7, rij: 6, breedte: 1, hoogte: 1 },
  { afbeelding: brandnetelAfbeelding, kolom: 4, rij: 7, breedte: 1, hoogte: 1 },
]

function plantStijl(plant: (typeof optimalePlanten)[number]) {
  return {
    left: `${((plant.kolom - 1) / 12) * 100}%`,
    top: `${((plant.rij - 1) / 10) * 100}%`,
    width: `${(plant.breedte / 12) * 100}%`,
    height: `${(plant.hoogte / 10) * 100}%`,
  }
}

function verbeterTip(comboId: string) {
  if (comboId === 'lagencombo') return 'Plaats daslook direct rond een walnootboom of hazelaar.'
  if (comboId === 'beekdalcombo') return 'Zet vlier en wilde aardbeien naast elkaar bij de oever.'
  if (comboId === 'bosrandcombo') return 'Plaats daslook in de invloedszone van de wilde appel.'
  return 'Zet wilde knoflook en brandnetel naast elkaar op de akker.'
}
</script>

<template>
  <main class="einde-scherm">
    <header class="einde-kop">
      <img :src="studiestapLogo" alt="Studie-Stap" />
      <span>Level {{ level }} voltooid</span>
    </header>

    <section class="resultaat-balk">
      <div>
        <h1>Jouw resultaat</h1>
        <span>Level {{ level }}</span>
      </div>
      <div class="sterren" :aria-label="`${sterren} van de 3 sterren`">
        <span v-for="ster in 3" :key="ster" :class="{ behaald: ster <= sterren }">★</span>
      </div>
      <strong>{{ score }}%</strong>
    </section>

    <div class="resultaat-grid">
      <section class="paneel score-paneel">
        <h2>Jouw score</h2>
        <div class="totaalscore">
          <span>Totaalscore</span>
          <strong>{{ score }}/100</strong>
        </div>

        <div v-if="scoreResultaat" class="combo-lijst">
          <h3>Actieve combo's</h3>
          <article
            v-for="combo in scoreResultaat.combos"
            :key="combo.id"
            :class="{ gemist: !combo.actief }"
          >
            <strong>{{ combo.actief ? '✓' : '×' }} {{ combo.naam }}{{ combo.actief ? '' : ' gemist' }}</strong>
            <span>{{ combo.actief ? combo.actiefTekst : combo.gemistTekst }}</span>
          </article>
        </div>

        <p class="score-feedback">{{ feedback }}</p>
      </section>

      <section class="paneel optimaal-paneel">
        <h2>Zo kon het ook - optimale plaatsing</h2>
        <div class="optimaal-score"><span></span><small>100/100</small></div>

        <div class="mini-kaart" aria-label="Voorbeeld van een optimale plaatsing">
          <template v-for="(rij, rijIndex) in levelDrieTerreinKaart" :key="rijIndex">
            <span
              v-for="(terrein, kolomIndex) in rij"
              :key="`${rijIndex}-${kolomIndex}`"
              class="mini-vak"
              :class="`terrein-${terrein}`"
            ></span>
          </template>
          <img
            v-for="(plant, index) in optimalePlanten"
            :key="index"
            :src="plant.afbeelding"
            alt=""
            :style="plantStijl(plant)"
          />
        </div>

        <strong class="optimale-metrics">Bio 28/28 · Opbr 23/23 · Kring 30/30 → 100%</strong>
        <aside class="wist-je-dat">
          <strong>Wist je dat?</strong>
          <p>Een voedselbos is niet wie het meest plant, maar wie de planten het best laat samenwerken: lagen, bodem en water versterken elkaar.</p>
        </aside>
      </section>

      <section class="paneel beter-paneel">
        <h2>Wat kon beter</h2>
        <div v-if="gemisteCombos.length" class="verbeteringen">
          <article v-for="combo in gemisteCombos" :key="combo.id">
            <h3>{{ combo.naam }}</h3>
            <div>
              <span>Wat je nodig had:</span>
              <p>{{ verbeterTip(combo.id) }}</p>
              <small>Tip: verplaats de planten dichter naar de juiste zone.</small>
            </div>
          </article>
        </div>
        <p v-else class="alles-goed">Alle combo's zijn actief. Je voedselbos werkt als één sterk systeem.</p>

        <div class="leerblok">
          <h3>Wat leer je hiervan?</h3>
          <p>Een voedselbos werkt in lagen. De boom beschermt de struik, de struik beschermt het kruid. Maar ook de zone telt: terrein en nabijheid vormen samen de combo.</p>
        </div>

        <div class="gerecht">
          <h3>Het gerecht</h3>
          <p>Walnoot-hazelnootpasta met wilde kruiden en bessencompote</p>
          <span>Je haalde: walnoot · hazelaar · vlier · daslook · aardbeien</span>
        </div>
      </section>
    </div>

    <section class="informatie-sectie">
      <h2 class="informatie-tab">Meer informatie</h2>
      <div class="informatie-paneel">
        <a
          href="https://www.wwf.nl/wat-we-doen/waar-zijn-we-actief/nederland/voedselbossen"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voedselbossen - WWF Nederland
        </a>
        <a
          href="https://www.amsterdamsebos.nl/voedselbos/ontwerp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ontwerp en beplanting voedselbos - Amsterdamse Bos
        </a>
        <a
          href="https://www.amsterdamsebos.nl/voedselbos/aan-de-slag-voedselbos"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aan de slag met een voedselbos - Amsterdamse Bos
        </a>
      </div>
    </section>

    <div class="einde-acties">
      <button type="button" class="opnieuw" @click="$emit('opnieuw')">Opnieuw</button>
      <button type="button" class="begin" @click="$emit('levels')">Naar beginscherm</button>
    </div>
  </main>
</template>

<style scoped>
.einde-scherm { width: 100%; min-height: 100dvh; background: #173d1d; color: #dce9cf; padding-bottom: 30px; }
.einde-kop { display: flex; height: 55px; align-items: center; justify-content: space-between; padding: 0 22px; border-bottom: 1px solid #2d5932; background: #071b0d; }
.einde-kop img { display: block; width: 63px; height: auto; }
.einde-kop span { color: #537458; font-size: 13px; }
.resultaat-balk { display: grid; grid-template-columns: 280px 1fr 80px; align-items: center; width: calc(100% - 102px); min-height: 91px; margin: 13px auto 5px; padding: 12px 80px; border: 2px solid #079bd9; border-radius: 16px; background: #0d2b13; }
.resultaat-balk h1 { color: #dcaa17; font-family: Georgia, 'Times New Roman', serif; font-size: 29px; }
.resultaat-balk div > span { color: #628264; font-size: 12px; }
.resultaat-balk > strong { color: #5b391a; font-size: 12px; }
.sterren { display: flex; gap: 8px; font-size: 36px; }
.sterren span { color: #3d4f2c; }
.sterren .behaald { color: #e4b423; text-shadow: 0 1px #fff2a8; }
.resultaat-grid { display: grid; grid-template-columns: 1fr 1.16fr 1fr; gap: 14px; width: calc(100% - 46px); margin: 0 auto; }
.paneel { display: flex; min-width: 0; height: 522px; flex-direction: column; padding: 14px 19px; overflow: hidden; border: 2px solid #39862b; border-radius: 10px; background: #102e16; }
.paneel h2 { color: #f2f3e9; font-size: 14px; }
.totaalscore { display: grid; width: 68%; min-height: 86px; margin: 27px auto 25px; place-content: center; border: 1px solid #676518; border-radius: 18px; background: #273719; text-align: center; }
.totaalscore span { color: #cba710; font-size: 11px; }
.totaalscore strong { color: #e3ad0b; font-family: Georgia, 'Times New Roman', serif; font-size: 38px; }
.combo-lijst { display: grid; gap: 7px; padding-top: 12px; border-top: 1px solid #294c2e; }
.combo-lijst h3 { margin-bottom: 2px; color: #71b25b; font-size: 11px; text-transform: uppercase; }
.combo-lijst article { display: grid; gap: 3px; padding: 9px; border: 1px solid #4aa33a; border-left: 5px solid #4aa33a; border-radius: 6px; background: #183b1d; }
.combo-lijst article.gemist { border-color: #472323; border-left-color: #a12e2e; background: #181818; }
.combo-lijst strong { color: #76b665; font-size: 11px; }
.combo-lijst .gemist strong { color: #a84e4e; }
.combo-lijst span { color: #58765b; font-size: 9px; }
.score-feedback { margin-top: auto; padding: 18px 20px 0; color: #80a957; font-family: Georgia, 'Times New Roman', serif; font-size: 10px; font-style: italic; text-align: center; }
.optimaal-score { display: flex; align-items: center; gap: 8px; margin: 6px 0 15px; color: #6a8d5d; font-size: 9px; }
.optimaal-score span { width: 80px; height: 16px; border-radius: 4px; background: #3a9428; }
.mini-kaart { display: grid; position: relative; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(10, 1fr); width: min(90%, 361px); aspect-ratio: 1.16; margin-inline: auto; overflow: hidden; background: #3e7540; }
.mini-vak { border: 1px solid rgba(255, 255, 255, .025); }
.terrein-grasland { background: #3e7540; }.terrein-water { background: #397887; }.terrein-heuvel { background: #686d5f; }.terrein-oever { background: #819452; }.terrein-akker { background: #725f35; }.terrein-schaduw { background: #2d4824; }
.mini-kaart img { position: absolute; z-index: 2; object-fit: contain; pointer-events: none; filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }
.optimale-metrics { margin: 17px 0 12px; color: #4ca442; font-size: 10px; }
.wist-je-dat { margin-top: auto; padding: 12px 16px; border: 1px solid #294c2e; border-radius: 7px; color: #638065; }
.wist-je-dat strong { color: #6ca55e; font-size: 10px; }.wist-je-dat p { margin-top: 4px; font-size: 9px; line-height: 1.45; }
.verbeteringen { display: grid; gap: 12px; margin-top: 14px; }
.verbeteringen h3 { margin-bottom: 5px; color: #a84e4e; font-size: 11px; }
.verbeteringen article > div { padding: 10px 13px; border: 1px solid #4d2929; border-radius: 6px; background: #181818; color: #865f63; font-size: 9px; line-height: 1.45; }
.verbeteringen p { margin: 3px 0 7px; }.verbeteringen small { color: #a45a5a; }
.alles-goed { margin-top: 16px; color: #76b665; font-size: 11px; }
.leerblok { margin-top: 18px; padding-top: 14px; border-top: 1px solid #294c2e; }
.leerblok h3, .gerecht h3 { color: #78ae5f; font-size: 10px; }.leerblok p, .gerecht p, .gerecht span { margin-top: 6px; color: #658065; font-size: 9px; line-height: 1.5; }
.gerecht { margin-top: auto; padding: 12px 14px; border: 1px solid #4a9e39; border-radius: 7px; }
.gerecht span { display: block; }
.informatie-sectie { width: calc(100% - 102px); margin: 10px auto 0; }
.informatie-tab { display: flex; width: fit-content; min-width: 180px; height: 38px; align-items: center; padding: 0 14px; border: 1px solid #3f8135; border-bottom: 0; border-radius: 7px 7px 0 0; background: #102e16; color: #8ebf79; font-size: 11px; font-weight: 700; }
.informatie-paneel { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 12px; border: 1px solid #3f8135; border-radius: 0 7px 7px 7px; background: #0d2813; }
.informatie-paneel a { display: flex; min-height: 44px; align-items: center; padding: 9px 12px; border-left: 3px solid #4b963b; background: #15371b; color: #9fc98e; font-size: 10px; line-height: 1.35; text-decoration: none; }
.informatie-paneel a:hover, .informatie-paneel a:focus-visible { background: #1b4622; color: #f2e5bc; outline: 1px solid #6eaf52; }
.einde-acties { display: flex; justify-content: flex-end; gap: 14px; width: calc(100% - 102px); margin: 10px auto 0; }
.einde-acties button { width: 245px; min-height: 60px; border-radius: 10px; font-weight: 700; }
.opnieuw { border: 2px solid #284d2d; background: #102e16; color: #638065; }.begin { border: 0; background: #4b963b; color: #fff; }
@media (max-width: 1000px) { .einde-scherm { width: 100%; max-width: none; min-height: 100dvh; margin: 0; }.resultaat-balk { width: calc(100% - 40px); padding: 14px 30px; }.resultaat-grid { grid-template-columns: 1fr 1fr; width: calc(100% - 40px); }.beter-paneel { grid-column: 1 / -1; }.paneel { height: auto; min-height: 500px; }.gerecht { margin-top: 24px; }.informatie-sectie, .einde-acties { width: calc(100% - 40px); } }
@media (max-width: 680px) { .resultaat-balk { grid-template-columns: 1fr auto; padding: 14px 20px; }.sterren { grid-row: 2; font-size: 27px; }.resultaat-grid { grid-template-columns: 1fr; }.beter-paneel { grid-column: auto; }.paneel { min-height: 0; }.informatie-paneel { grid-template-columns: 1fr; }.einde-acties { flex-direction: column; }.einde-acties button { width: 100%; } }
</style>
