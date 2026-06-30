<script setup lang="ts">
import levelEenBeeld from '../../../assets/level-1-pioniersfase.png'
import levelTweeBeeld from '../../../assets/level-2-licht-lucht.png'
import levelDrieBeeld from '../../../assets/level-3-lagen-samenwerking.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'

const props = defineProps<{
  aantalLevels: number
  hoogsteVoltooideLevel: number
}>()

defineEmits<{
  openGerechten: []
  openLevel: [level: number]
  terug: []
}>()

const levels = [
  {
    afbeelding: levelEenBeeld,
    beschrijving: 'Bodemherstel en basisconnecties',
    duur: '5 min',
    moeilijkheid: 'Makkelijk',
    nummer: 1,
    planten: '5 planten',
    titel: 'Pioniersfase',
  },
  {
    afbeelding: levelTweeBeeld,
    beschrijving: 'Trade-offs, concurrentie en de zeven lagen van het bos',
    duur: '8 min',
    moeilijkheid: 'Middel',
    nummer: 2,
    planten: '8 planten',
    titel: 'Licht & Lucht',
  },
  {
    afbeelding: levelDrieBeeld,
    beschrijving: 'Biodiversiteit, klokken en hardware-interactie',
    duur: '12 min',
    moeilijkheid: 'Uitdagend',
    nummer: 3,
    planten: '12 planten',
    titel: 'Lagen & samenwerking',
  },
]

function isVoltooid(level: number) {
  return level <= props.hoogsteVoltooideLevel
}

function isVergrendeld(level: number) {
  return level > props.hoogsteVoltooideLevel + 1
}

function isHuidig(level: number) {
  return level === props.hoogsteVoltooideLevel + 1 && level <= props.aantalLevels
}

function statusVoor(level: number) {
  if (isVoltooid(level)) {
    return 'Voltooid'
  }

  return isVergrendeld(level) ? 'Vergrendeld' : 'Beschikbaar'
}

function knopVoor(level: number) {
  if (isVergrendeld(level)) {
    return 'Vergrendeld'
  }

  return isVoltooid(level) ? 'Opnieuw spelen' : level === 1 ? 'Begin →' : 'Doorgaan →'
}
</script>

<template>
  <main class="level-keuze-scherm">
    <header class="level-kop">
      <button type="button" class="logo-knop" aria-label="Terug naar start" @click="$emit('terug')">
        <img :src="studiestapLogo" alt="" />
      </button>
    </header>

    <nav class="level-tabs" aria-label="Level navigatie">
      <button type="button" class="actief">Levels</button>
      <button type="button" @click="$emit('openGerechten')">Gerechten</button>
      <button type="button">Alle planten</button>
    </nav>

    <section class="level-inhoud">
      <div class="level-titel">
        <h1>Kies een level</h1>
        <p>{{ aantalLevels }} levels — level 1 is de tutorial</p>
      </div>

      <div class="levels">
        <article
          v-for="level in levels"
          :key="level.nummer"
          class="level-kaart"
          :class="{
            huidig: isHuidig(level.nummer),
            vergrendeld: isVergrendeld(level.nummer),
          }"
        >
          <div class="kaart-status">
            <span>{{ statusVoor(level.nummer) }}</span>
            <strong>{{ isVoltooid(level.nummer) ? '★★★' : '' }}</strong>
          </div>

          <img :src="level.afbeelding" :alt="`Illustratie voor level ${level.nummer}: ${level.titel}`" />

          <div class="kaart-inhoud">
            <small>Level {{ level.nummer }}</small>
            <h2>{{ level.titel }}</h2>
            <p>{{ level.beschrijving }}</p>
            <span>Ontdek hoe jouw keuzes het voedselbos en zijn omgeving beïnvloeden.</span>

            <div class="kaart-details">
              <span>{{ level.duur }}</span>
              <span>{{ level.planten }}</span>
              <span>{{ level.moeilijkheid }}</span>
            </div>

            <div class="voortgang">
              <span :style="{ width: isVoltooid(level.nummer) ? '100%' : '0%' }"></span>
            </div>

            <button
              type="button"
              :disabled="isVergrendeld(level.nummer)"
              @click="$emit('openLevel', level.nummer)"
            >
              {{ knopVoor(level.nummer) }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <footer class="level-voet">Totale score: {{ hoogsteVoltooideLevel * 220 }} pts</footer>
  </main>
</template>

<style scoped>
.level-keuze-scherm {
  display: grid;
  grid-template-rows: 52px 44px 1fr 38px;
  min-height: 100vh;
  background: #173d1d;
  color: #dbe6c8;
}

.level-kop {
  display: flex;
  align-items: center;
  padding: 8px 18px;
  background: #071b0d;
}

.logo-knop {
  border: 0;
  background: transparent;
  padding: 0;
}

.logo-knop img {
  display: block;
  width: 96px;
  height: auto;
}

.level-tabs {
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 0 20px;
  border-bottom: 1px solid #315d37;
  background: #102d16;
}

.level-tabs button {
  min-width: 120px;
  height: 34px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #638166;
}

.level-tabs button:hover,
.level-tabs button.actief {
  border-bottom-color: #75bd56;
  color: #83c866;
}

.level-inhoud {
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: 12px 24px 20px;
}

.level-titel h1 {
  color: #eee2bd;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 26px;
  font-weight: 700;
}

.level-titel p {
  color: #618164;
  font-size: 11px;
}

.levels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-top: 14px;
}

.level-kaart {
  display: grid;
  grid-template-rows: 48px 118px 1fr;
  min-height: 450px;
  overflow: hidden;
  border: 1px solid #397036;
  border-radius: 8px;
  background: #102b17;
}

.level-kaart.huidig {
  border: 3px solid #0aa7ff;
}

.level-kaart.vergrendeld {
  opacity: 0.35;
}

.kaart-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
}

.kaart-status span {
  border-radius: 5px;
  background: #448a36;
  color: #ffffff;
  padding: 4px 10px;
  font-size: 10px;
}

.huidig .kaart-status span {
  background: #dda915;
  color: #142416;
}

.kaart-status strong {
  color: #e1ad17;
  letter-spacing: 2px;
}

.level-kaart > img {
  width: 100%;
  height: 118px;
  object-fit: cover;
}

.kaart-inhoud {
  display: grid;
  align-content: start;
  gap: 7px;
  padding: 14px 18px 18px;
}

.kaart-inhoud > small {
  color: #e1ad17;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.kaart-inhoud h2 {
  color: #eee2bd;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 19px;
  font-weight: 700;
}

.kaart-inhoud > p,
.kaart-inhoud > span {
  color: #668568;
  font-size: 10px;
  line-height: 1.45;
}

.kaart-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 3px;
}

.kaart-details span {
  border-radius: 4px;
  background: #204c24;
  color: #77ae66;
  padding: 4px 9px;
  font-size: 8px;
}

.voortgang {
  height: 5px;
  margin: 3px 0 8px;
  overflow: hidden;
  border-radius: 3px;
  background: #071b0d;
}

.voortgang span {
  display: block;
  height: 100%;
  background: #4d963e;
}

.huidig .voortgang span {
  background: #dda915;
}

.kaart-inhoud button {
  min-height: 40px;
  border: 1px solid #4c933c;
  border-radius: 6px;
  background: transparent;
  color: #6fbd55;
  font-weight: 700;
}

.huidig .kaart-inhoud button {
  border-color: #dda915;
  background: #dda915;
  color: #152418;
}

.kaart-inhoud button:disabled {
  background: #071b0d;
}

.level-voet {
  display: flex;
  align-items: center;
  padding: 0 38px;
  background: #071b0d;
  color: #527759;
  font-size: 10px;
}

@media (max-width: 800px) {
  .level-keuze-scherm {
    grid-template-rows: 52px auto 1fr 38px;
  }

  .level-tabs {
    align-items: stretch;
    overflow-x: auto;
  }

  .levels {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .level-kaart {
    min-height: 0;
  }
}
</style>
