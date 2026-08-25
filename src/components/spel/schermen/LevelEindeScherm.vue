<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TerreinSoort } from '../../../types/spel'
import type { LevelConfig } from '../../../data/levels/types'
import { voedselbosItems } from '../../../data/planten'
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import eettafel from '../../../assets/diner/Eettafel.png'
import goudBord from '../../../assets/diner/Goud bord.png'
import leegBord from '../../../assets/diner/Leeg bord.png'
import sterBehaald from '../../../assets/resultaat-ster-behaald.png'
import sterOnbehaald from '../../../assets/resultaat-ster-onbehaald.png'

const props = defineProps<{
  level: number
  levelConfig: LevelConfig
  terreinKaart: TerreinSoort[][]
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
    opbrengst: number
    minimaleOpbrengst: number
    maximaleOpbrengst: number
  }
}>()

defineEmits<{
  levels: []
  opnieuw: []
  volgend: []
}>()

const score = computed(() => props.scoreResultaat?.percentage ?? 0)
const sterren = computed(() => (score.value >= 80 ? 3 : score.value >= 50 ? 2 : 1))
const toonResultaten = ref(false)
const gastenGeserveerd = computed(() => Math.max(1, Math.min(10, Math.round(score.value / 10))))
const bordPosities = [
  { left: 26, top: 41 },
  { left: 38, top: 41 },
  { left: 50, top: 41 },
  { left: 62, top: 41 },
  { left: 74, top: 41 },
  { left: 26, top: 59 },
  { left: 38, top: 59 },
  { left: 50, top: 59 },
  { left: 62, top: 59 },
  { left: 74, top: 59 },
]
function bordStijl(index: number) {
  const pos = bordPosities[index]
  return { left: `${pos.left}%`, top: `${pos.top}%` }
}
const gemisteCombos = computed(() => props.scoreResultaat?.combos.filter((combo) => !combo.actief) ?? [])
const maxComboPunten = computed(() => props.levelConfig.combos.reduce((totaal, combo) => totaal + combo.bonus, 0))
const maxBasisPunten = computed(() => Math.max(0, props.levelConfig.maximaleScore - maxComboPunten.value))
const feedback = computed(() => {
  if (score.value >= 80) return 'Perfecte balans. Je hebt het voedselbos als systeem laten werken. Dit is agroforestry.'
  if (score.value >= 50) return "Goed begin. Maar kijk nog eens naar de gemiste combo's. Denk in lagen en zones."
  return 'De planten werken nog niet genoeg samen. Denk in lagen: boom, struik en kruid.'
})

const optimalePlanten = computed(() =>
  props.levelConfig.optimalePlaatsing.flatMap((plaatsing) => {
    const afbeelding = voedselbosItems.find((item) => item.id === plaatsing.plantId)?.afbeelding
    return afbeelding ? [{ ...plaatsing, afbeelding }] : []
  }),
)
const kaartKolommen = computed(() => props.terreinKaart[0]?.length ?? 12)
const kaartRijen = computed(() => props.terreinKaart.length || 10)

function plantStijl(plant: (typeof optimalePlanten.value)[number]) {
  return {
    left: `${((plant.kolom - 1) / kaartKolommen.value) * 100}%`,
    top: `${((plant.rij - 1) / kaartRijen.value) * 100}%`,
    width: `${(plant.breedte / kaartKolommen.value) * 100}%`,
    height: `${(plant.hoogte / kaartRijen.value) * 100}%`,
  }
}

function verbeterTip(comboId: string) {
  if (comboId === 'bestuiverscombo') return 'Zet Witte Klaver direct naast de Walnootboom.'
  if (comboId === 'oevercombo') return 'Zet wilde aardbei direct naast de vlier op de oever.'
  if (comboId === 'lagencombo') return 'Plaats daslook direct rond een walnootboom of hazelaar.'
  if (comboId === 'beekdalcombo') return 'Zet vlier en wilde aardbeien naast elkaar bij de oever.'
  if (comboId === 'bosrandcombo') return 'Plaats daslook in de invloedszone van de wilde appel.'
  if (comboId === 'bodemcombo') return 'Zet wilde knoflook en brandnetel naast elkaar op de akker.'
  if (comboId === 'schaduwcombo') return 'Zet munt direct naast de kersenboom.'
  if (comboId === 'klaverbodemcombo') return 'Zet klaver dicht bij de invloedszone van de kersenboom, op de akker.'
  return 'Zet wilde knoflook en brandnetel naast elkaar op de akker.'
}
</script>

<template>
  <main class="einde-scherm">
    <header class="einde-kop">
      <img :src="studiestapLogo" alt="Studie-Stap" />
      <span>Level {{ level }} voltooid</span>
    </header>

    <section v-if="!toonResultaten" class="feest-scherm">
      <div class="feest-decor links"></div>
      <div class="feest-decor rechts"></div>

      <h1>Jouw feestmaal</h1>
      <p>Level {{ level }} · Totaalscore {{ score }}/100</p>
      <div class="feest-sterren" :aria-label="`${sterren} van de 3 sterren`">
        <span v-for="ster in 3" :key="ster" :class="{ leeg: ster > sterren }">★</span>
      </div>

      <div class="feest-tafel-wrap">
        <img class="feest-tafel" :src="eettafel" alt="" aria-hidden="true" />
        <img
          v-for="(pos, index) in bordPosities"
          :key="index"
          class="feest-bord"
          :src="index < gastenGeserveerd ? goudBord : leegBord"
          :style="bordStijl(index)"
          alt=""
        />
      </div>

      <h2>{{ gastenGeserveerd }} van de 10 gasten geserveerd</h2>
      <p class="feest-score">Met een score van {{ score }}/100 serveer je vanavond dit gerecht:</p>
      <strong>{{ levelConfig.gerecht ?? levelConfig.titel }}</strong>

      <div class="feest-acties">
        <button type="button" class="opnieuw compact" @click="$emit('opnieuw')">Opnieuw</button>
        <button type="button" class="begin compact" @click="toonResultaten = true">Naar Resultaten</button>
      </div>
    </section>

    <template v-else>
    <section class="resultaat-balk">
      <div>
        <h1>Jouw resultaat</h1>
        <span>Level {{ level }}</span>
      </div>
      <div class="sterren" :aria-label="`${sterren} van de 3 sterren`">
        <img
          v-for="ster in 3"
          :key="ster"
          :src="ster <= sterren ? sterBehaald : sterOnbehaald"
          :class="{ onbehaald: ster > sterren }"
          alt=""
        />
      </div>
      <div v-if="scoreResultaat" class="opbrengst-samenvatting">
        <span>Opbrengst</span>
        <strong>{{ scoreResultaat.opbrengst }} kg</strong>
        <small>max. {{ scoreResultaat.maximaleOpbrengst }} kg</small>
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

        <div v-if="scoreResultaat" class="opbrengst-resultaat">
          <span>Jouw opbrengst</span>
          <strong>{{ scoreResultaat.opbrengst }} kg</strong>
          <small>
            Minimum {{ scoreResultaat.minimaleOpbrengst }} kg · Maximum {{ scoreResultaat.maximaleOpbrengst }} kg
          </small>
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

        <div
          class="mini-kaart"
          :style="{
            gridTemplateColumns: `repeat(${kaartKolommen}, 1fr)`,
            gridTemplateRows: `repeat(${kaartRijen}, 1fr)`,
          }"
          aria-label="Voorbeeld van een optimale plaatsing"
        >
          <template v-for="(rij, rijIndex) in terreinKaart" :key="rijIndex">
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

        <strong class="optimale-metrics">
          Basis {{ maxBasisPunten }}/{{ maxBasisPunten }}<template v-if="maxComboPunten"> · Combo's {{ maxComboPunten }}/{{ maxComboPunten }}</template> → 100%
        </strong>
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
          <p>{{ levelConfig.gerecht ?? `Beloning voor ${levelConfig.titel}` }}</p>
          <span>
            Je haalde:
            {{ level === 1 ? 'walnoot · Bosaardbei · vlierbes' : level === 2 ? 'kersenboom · bramen · frambozen · munt · klaver' : 'walnoot · hazelaar · vlier · daslook · aardbeien' }}
          </span>
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
    </template>
  </main>
</template>

<style scoped>
.einde-scherm { width: 100%; min-height: 100dvh; background: #173d1d; color: #dce9cf; padding-bottom: 30px; }
.einde-kop { display: flex; height: 66px; align-items: center; justify-content: space-between; padding: 0 28px; border-bottom: 1px solid #2d5932; background: #071b0d; }
.einde-kop img { display: block; width: 63px; height: auto; }
.einde-kop span { color: #719176; font-size: 16px; }
.feest-scherm { position: relative; display: grid; min-height: calc(100dvh - 66px); place-items: center; align-content: center; overflow: hidden; background: radial-gradient(circle at 50% 20%, #1d552b 0, #123d21 42%, #0e3319 100%); padding: 6px 24px 8px; text-align: center; }
.feest-scherm h1 { color: #dda915; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(26px, 4vw, 38px); line-height: 1; }
.feest-scherm > p { margin-top: 2px; color: #a6b99d; font-size: 13px; }
.feest-sterren { display: flex; gap: 34px; margin-top: 4px; color: #e4ad1a; font-size: 22px; line-height: 1; }
.feest-sterren .leeg { color: transparent; -webkit-text-stroke: 2px #e4ad1a; text-stroke: 2px #e4ad1a; }
.feest-tafel-wrap { position: relative; width: min(94vw, 1600px, calc(65dvh * 1.666)); margin-top: -6dvh; }
.feest-tafel { display: block; width: 100%; filter: drop-shadow(0 16px 18px rgba(0, 0, 0, .32)); }
.feest-bord { position: absolute; width: 7.5%; transform: translate(-50%, -50%); filter: drop-shadow(0 3px 4px rgba(0, 0, 0, .35)); }
.feest-scherm h2 { margin-top: -16dvh; color: #dda915; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(20px, 2.4vw, 26px); }
.feest-score { margin-top: 2px; color: #b8c8af; font-size: 13px; }
.feest-scherm strong { margin-top: 2px; color: #e3c45b; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-style: italic; }
.feest-acties { display: flex; gap: 18px; justify-content: center; margin-top: 8px; }
.feest-acties button.compact { width: 170px; min-height: 42px; border-radius: 8px; font-size: 13px; }
.feest-decor { position: absolute; width: 180px; height: 120px; border-radius: 50%; background: rgba(104, 169, 89, .14); pointer-events: none; }
.feest-decor.links { top: -52px; left: -68px; }
.feest-decor.rechts { right: -62px; bottom: -58px; }
.resultaat-balk { display: grid; grid-template-columns: 250px 1fr 155px 80px; align-items: center; gap: 20px; width: calc(100% - 102px); min-height: 124px; margin: 13px auto 8px; padding: 12px 55px; border: 2px solid #079bd9; border-radius: 16px; background: #0d2b13; }
.resultaat-balk h1 { color: #dcaa17; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; }
.resultaat-balk div > span { color: #77977a; font-size: 14px; }
.resultaat-balk > strong { color: #d5a832; font-size: 18px; }
.sterren { display: flex; align-items: center; justify-content: center; gap: 4px; }
.sterren img { display: block; width: 96px; height: 74px; object-fit: contain; filter: drop-shadow(0 4px 5px rgba(0, 0, 0, .45)); }
.sterren img.onbehaald { opacity: .22; filter: grayscale(1) drop-shadow(0 3px 3px rgba(0, 0, 0, .35)); }
.opbrengst-samenvatting { display: grid; min-height: 72px; place-content: center; border: 1px solid #397c38; border-radius: 10px; background: #15371b; padding: 8px 12px; text-align: center; }.opbrengst-samenvatting span { color: #75a270; font-size: 11px; text-transform: uppercase; }.opbrengst-samenvatting strong { color: #8dd46f; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; }.opbrengst-samenvatting small { margin-top: 3px; color: #88a989; font-size: 13px; font-weight: 700; }
.resultaat-grid { display: grid; grid-template-columns: 1fr 1.16fr 1fr; gap: 14px; width: calc(100% - 46px); margin: 0 auto; }
.paneel { display: flex; min-width: 0; min-height: 640px; height: auto; flex-direction: column; padding: 22px 26px; overflow: visible; border: 2px solid #39862b; border-radius: 10px; background: #102e16; }
.paneel h2 { color: #f2f3e9; font-size: 18px; }
.totaalscore { display: grid; width: 68%; min-height: 86px; margin: 27px auto 25px; place-content: center; border: 1px solid #676518; border-radius: 18px; background: #273719; text-align: center; }
.totaalscore span { color: #cba710; font-size: 13px; }
.totaalscore strong { color: #e3ad0b; font-family: Georgia, 'Times New Roman', serif; font-size: 46px; }
.opbrengst-resultaat { display: grid; margin: -10px 0 18px; place-items: center; border: 1px solid #397c38; border-radius: 10px; background: #15371b; padding: 11px 14px; text-align: center; }
.opbrengst-resultaat span { color: #7fa678; font-size: 11px; text-transform: uppercase; }.opbrengst-resultaat strong { margin-top: 3px; color: #8dd46f; font-family: Georgia, 'Times New Roman', serif; font-size: 25px; }.opbrengst-resultaat small { margin-top: 5px; color: #88a989; font-size: 12px; font-weight: 700; }
.combo-lijst { display: grid; gap: 7px; padding-top: 12px; border-top: 1px solid #294c2e; }
.combo-lijst h3 { margin-bottom: 2px; color: #71b25b; font-size: 13px; text-transform: uppercase; }
.combo-lijst article { display: grid; gap: 3px; padding: 9px; border: 1px solid #4aa33a; border-left: 5px solid #4aa33a; border-radius: 6px; background: #183b1d; }
.combo-lijst article.gemist { border-color: #472323; border-left-color: #a12e2e; background: #181818; }
.combo-lijst strong { color: #76b665; font-size: 13px; }
.combo-lijst .gemist strong { color: #a84e4e; }
.combo-lijst span { color: #b2c8b3; font-size: 12px; line-height: 1.45; }
.score-feedback { margin-top: 22px; padding: 18px 20px; border-top: 1px solid #3a653f; color: #c1dda5; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-style: italic; line-height: 1.5; text-align: center; }
.optimaal-score { display: flex; align-items: center; gap: 8px; margin: 6px 0 15px; color: #6a8d5d; font-size: 9px; }
.optimaal-score span { width: 80px; height: 16px; border-radius: 4px; background: #3a9428; }
.mini-kaart { display: grid; position: relative; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(10, 1fr); width: min(90%, 361px); aspect-ratio: 1.16; margin-inline: auto; overflow: hidden; background: #3e7540; }
.mini-vak { border: 1px solid rgba(255, 255, 255, .025); }
.terrein-grasland { background: #3e7540; }.terrein-water { background: #397887; }.terrein-heuvel { background: #686d5f; }.terrein-oever { background: #819452; }.terrein-akker { background: #725f35; }.terrein-schaduw { background: #2d4824; }
.mini-kaart img { position: absolute; z-index: 2; object-fit: contain; pointer-events: none; filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }
.optimale-metrics { margin: 17px 0 12px; color: #4ca442; font-size: 12px; }
.wist-je-dat { margin-top: auto; padding: 12px 16px; border: 1px solid #294c2e; border-radius: 7px; color: #638065; }
.wist-je-dat strong { color: #6ca55e; font-size: 13px; }.wist-je-dat p { margin-top: 6px; font-size: 11px; line-height: 1.5; }
.verbeteringen { display: grid; gap: 12px; margin-top: 14px; }
.verbeteringen h3 { margin-bottom: 7px; color: #ee8d8d; font-size: 15px; }
.verbeteringen article > div { padding: 14px 16px; border: 1px solid #914646; border-radius: 7px; background: #211919; color: #e0b5b7; font-size: 13px; line-height: 1.55; }
.verbeteringen p { margin: 5px 0 9px; color: #f0d4d5; }.verbeteringen small { color: #d98b8b; font-size: 11px; }
.alles-goed { margin-top: 18px; color: #9dd98a; font-size: 14px; line-height: 1.5; }
.leerblok { margin-top: 18px; padding-top: 14px; border-top: 1px solid #294c2e; }
.leerblok h3, .gerecht h3 { color: #a6d78f; font-size: 15px; }.leerblok p, .gerecht p, .gerecht span { margin-top: 8px; color: #c0d2c0; font-size: 13px; line-height: 1.55; }
.gerecht { margin-top: 24px; padding: 15px 17px; border: 1px solid #65b653; border-radius: 8px; background: #15391b; }
.gerecht span { display: block; }
.informatie-sectie { width: calc(100% - 102px); margin: 10px auto 0; }
.informatie-tab { display: flex; width: fit-content; min-width: 180px; height: 38px; align-items: center; padding: 0 14px; border: 1px solid #3f8135; border-bottom: 0; border-radius: 7px 7px 0 0; background: #102e16; color: #8ebf79; font-size: 11px; font-weight: 700; }
.informatie-paneel { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 12px; border: 1px solid #3f8135; border-radius: 0 7px 7px 7px; background: #0d2813; }
.informatie-paneel a { display: flex; min-height: 52px; align-items: center; padding: 11px 14px; border-left: 4px solid #4b963b; background: #15371b; color: #9fc98e; font-size: 12px; line-height: 1.4; text-decoration: none; }
.informatie-paneel a:hover, .informatie-paneel a:focus-visible { background: #1b4622; color: #f2e5bc; outline: 1px solid #6eaf52; }
.einde-acties { display: flex; justify-content: flex-end; gap: 14px; width: calc(100% - 102px); margin: 10px auto 0; }
.einde-acties button { width: 260px; min-height: 66px; border-radius: 10px; font-size: 14px; font-weight: 700; }
.opnieuw { border: 2px solid #284d2d; background: #102e16; color: #638065; }.begin { border: 0; background: #4b963b; color: #fff; }
@media (max-width: 1000px) { .einde-scherm { width: 100%; max-width: none; min-height: 100dvh; margin: 0; }.resultaat-balk { width: calc(100% - 40px); padding: 14px 30px; }.resultaat-grid { grid-template-columns: 1fr 1fr; width: calc(100% - 40px); }.beter-paneel { grid-column: 1 / -1; }.paneel { height: auto; min-height: 500px; }.gerecht { margin-top: 24px; }.informatie-sectie, .einde-acties { width: calc(100% - 40px); } }
@media (max-width: 680px) { .resultaat-balk { grid-template-columns: 1fr auto; padding: 14px 20px; }.sterren { grid-row: 2; grid-column: 1 / -1; }.sterren img { width: 78px; height: 60px; }.opbrengst-samenvatting { grid-column: 1 / -1; }.resultaat-grid { grid-template-columns: 1fr; }.beter-paneel { grid-column: auto; }.paneel { min-height: 0; }.informatie-paneel { grid-template-columns: 1fr; }.einde-acties { flex-direction: column; }.einde-acties button { width: 100%; } }
</style>
