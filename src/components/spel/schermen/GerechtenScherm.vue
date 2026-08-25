<script setup lang="ts">
import { computed } from 'vue'
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import { levels } from '../../../data/levels'

const props = defineProps<{
  hoogsteVoltooideLevel: number
  voltooideLevels?: number[]
  totaalLevels?: number
  totaleScore?: number
  snelleHandenBehaald?: boolean
}>()

const emit = defineEmits<{
  levels: []
  openPlanten: []
}>()

const receptKaarten = computed(() =>
  levels.map((level) => ({
    naam: level.gerecht ?? level.titel,
    omschrijving: `Beloning van level ${level.nummer} · ${level.titel}`,
    vereistLevel: level.nummer,
    afbeelding: level.afbeelding,
  })),
)

function isOntgrendeld(vereistLevel: number) {
  return props.voltooideLevels?.includes(vereistLevel) ?? false
}

const aantalGerechtenOntgrendeld = computed(() => receptKaarten.value.filter((recept) => isOntgrendeld(recept.vereistLevel)).length)

const achievements = computed(() => [
  {
    icoon: '🐝',
    naam: 'Bijenredder',
    omschrijving: 'Maak 3 bijen-combo’s in één sessie.',
    behaald: false,
    status: 'Nog niet behaald',
    vergrendeld: false,
  },
  {
    icoon: '🌈',
    naam: 'Snelle handen',
    omschrijving: 'Voltooi een level in minder dan 30 seconden.',
    behaald: props.snelleHandenBehaald ?? false,
    status: props.snelleHandenBehaald ? '✓ Behaald' : 'Nog niet behaald',
    vergrendeld: false,
  },
  {
    icoon: '🌱',
    naam: 'Grondbeheerder',
    omschrijving: 'Bereik 100% bodemkwaliteit in level 3.',
    behaald: false,
    status: 'Level 3',
    vergrendeld: true,
  },
])
const aantalAchievementsBehaald = computed(() => achievements.value.filter((achievement) => achievement.behaald).length)
</script>

<template>
  <main class="gerechten-scherm">
    <header class="gerechten-kop">
      <img :src="studiestapLogo" alt="Studie-Stap" />
    </header>

    <nav class="gerechten-tabs" aria-label="Navigatie">
      <button type="button" @click="emit('levels')">Levels</button>
      <button type="button" class="actief">Gerechten</button>
      <button type="button" @click="emit('openPlanten')">Alle planten</button>
    </nav>

    <div class="gerechten-inhoud">
      <h1>Jouw voortgang</h1>

      <section class="statistieken" aria-label="Voortgang">
        <article><strong>{{ totaleScore ?? 0 }}</strong><span>Totale score</span></article>
        <article><strong>{{ voltooideLevels?.length ?? 0 }}/{{ totaalLevels ?? 3 }}</strong><span>Levels voltooid</span></article>
        <article><strong>{{ aantalGerechtenOntgrendeld }}/{{ receptKaarten.length }}</strong><span>Gerechten</span></article>
        <article><strong>{{ aantalAchievementsBehaald }}/{{ achievements.length }}</strong><span>Achievements</span></article>
      </section>

      <h2>Gerechten ontgrendeld</h2>
      <section class="recepten">
        <article
          v-for="(recept, index) in receptKaarten"
          :key="recept.naam"
          class="recept-kaart"
          :class="{ vergrendeld: !isOntgrendeld(recept.vereistLevel) }"
          :style="{ '--index': index }"
        >
          <div class="recept-beeld"><img :src="recept.afbeelding" :alt="recept.naam" /></div>
          <div class="recept-info">
            <strong>{{ recept.naam }}</strong>
            <span>{{ recept.omschrijving }}</span>
            <small>{{ isOntgrendeld(recept.vereistLevel) ? `Level ${recept.vereistLevel} · Voltooid` : `Voltooi level ${recept.vereistLevel}` }}</small>
            <i v-if="isOntgrendeld(recept.vereistLevel)"></i>
          </div>
        </article>
      </section>

      <h2>Achievements</h2>
      <section class="achievements">
        <article v-for="achievement in achievements" :key="achievement.naam" :class="{ vergrendeld: achievement.vergrendeld }">
          <span class="achievement-icoon">{{ achievement.icoon }}</span>
          <div><strong>{{ achievement.naam }}</strong><small>{{ achievement.omschrijving }}</small></div>
          <span class="status">{{ achievement.status }}</span>
        </article>
      </section>
    </div>
    <footer></footer>
  </main>
</template>

<style scoped>
.gerechten-scherm { display: grid; grid-template-rows: 56px 58px minmax(0, 1fr) 42px; min-height: 100dvh; background: #173d1d; color: #dbe7c7; }
.gerechten-kop { display: flex; height: 56px; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #28542d; background: #071b0d; }
.gerechten-kop img { width: 86px; }
.gerechten-kop button { min-width: 98px; border: 1px solid #316537; border-radius: 6px; background: #173f1d; color: #68a85a; padding: 8px 16px; }
.gerechten-tabs { display: flex; height: 58px; align-items: end; gap: 12px; padding: 0 28px; border-bottom: 1px solid #315d37; background: #102d16; }
.gerechten-tabs button { min-width: 145px; height: 46px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: #638166; font-size: 14px; font-weight: 700; transition: color 0.15s ease, border-color 0.15s ease; }
.gerechten-tabs button:hover, .gerechten-tabs button.actief { border-bottom-color: #75bd56; color: #83c866; }
.gerechten-inhoud { width: min(100%, 1480px); padding: 22px 50px 52px; }
h1 { margin: 0 0 14px; color: #eee2bd; font-family: Georgia, serif; font-size: 34px; }
h2 { margin: 28px 0 14px; color: #e0b62b; font-size: 15px; text-transform: uppercase; }
.statistieken { display: grid; width: min(100%, 720px); grid-template-columns: repeat(4, 1fr); gap: 14px; }
.statistieken article { display: grid; height: 88px; place-content: center; border: 1px solid #3b7042; border-radius: 9px; background: #0c2912; text-align: center; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.statistieken article:hover { transform: translateY(-3px); border-color: #4c933c; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); }
.statistieken strong { color: #eee2bd; font-family: Georgia, serif; font-size: 33px; line-height: 1; }.statistieken article:nth-child(odd) strong { color: #e3b41b; }
.statistieken span { margin-top: 9px; color: #779779; font-size: 12px; }
.recepten { display: grid; width: 100%; grid-template-columns: repeat(3, minmax(200px, 340px)); gap: 14px; }
.recept-kaart { min-width: 0; overflow: hidden; border: 2px solid #d5a600; border-radius: 11px; background: #071f0d; box-shadow: 0 5px 13px rgba(0, 0, 0, .25); transition: transform 0.25s ease, box-shadow 0.25s ease; animation: voedselbos-fade-in-up 0.5s ease both; animation-delay: calc(var(--index, 0) * 0.1s); }
.recept-kaart:not(.vergrendeld):hover { transform: translateY(-6px); box-shadow: 0 16px 30px rgba(0, 0, 0, .4); }
.recept-beeld { display: flex; position: relative; height: 200px; align-items: center; justify-content: center; overflow: visible; box-sizing: border-box; background: #111b0d; padding: 16px; }
.recept-beeld img { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; object-fit: contain; object-position: center center; transition: transform 0.3s ease; }
.recept-kaart:not(.vergrendeld):hover .recept-beeld img { transform: scale(1.05); }
.recept-info { display: grid; position: relative; z-index: 2; min-height: 122px; align-content: start; border-top: 2px solid #42602c; background: #071f0d; padding: 14px 17px 12px; }
.recept-info strong { color: #fff7dc; font-size: 17px; font-weight: 900; line-height: 1.3; overflow-wrap: break-word; text-shadow: 0 2px 3px #000; }.recept-info span { margin-top: 7px; color: #b6cbb3; font-size: 12px; line-height: 1.4; }.recept-info small { margin-top: 10px; color: #7fc26c; font-size: 11px; font-weight: 700; }
.recept-info i { width: 58px; height: 5px; margin-top: 8px; border-radius: 3px; background: #4b913f; }
.recept-kaart.vergrendeld { border-color: #315536; }.recept-kaart.vergrendeld .recept-beeld img { opacity: .25; filter: saturate(.35); }.recept-kaart.vergrendeld .recept-info { background: #081d0c; }.recept-kaart.vergrendeld .recept-info strong { color: #dce8d5; }.recept-kaart.vergrendeld .recept-info small { color: #8da58e; }
.achievements { display: grid; max-width: 720px; gap: 11px; }
.achievements article { display: grid; min-height: 72px; grid-template-columns: 48px 1fr auto; align-items: center; gap: 14px; border: 1px solid #35683c; border-radius: 8px; background: #0c2912; padding: 10px 15px; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.achievements article:not(.vergrendeld):hover { transform: translateX(4px); border-color: #4c933c; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28); }
.achievement-icoon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 7px; background: #173b1c; font-size: 23px; }.achievements div { display: grid; }.achievements strong { color: #eee7c8; font-size: 14px; }.achievements small { margin-top: 6px; color: #829984; font-size: 11px; }
.status { border-radius: 5px; background: #123c18; color: #73b961; padding: 8px 11px; font-size: 10px; }
.achievements article.vergrendeld { opacity: .3; filter: saturate(.35); }
footer { width: 100%; min-height: 42px; align-self: end; background: #071b0d; }
@media (max-width: 1100px) { .recepten { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 850px) { .recepten { grid-template-columns: repeat(2, minmax(0, 1fr)); }.gerechten-inhoud { padding-inline: 24px; } }
@media (max-width: 520px) { .gerechten-tabs { padding-left: 12px; }.statistieken { grid-template-columns: repeat(2, 1fr); }.recepten { grid-template-columns: 1fr; }.achievements article { grid-template-columns: 38px 1fr; }.status { grid-column: 2; width: fit-content; } }
</style>
