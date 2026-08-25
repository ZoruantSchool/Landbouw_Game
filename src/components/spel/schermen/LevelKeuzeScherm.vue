<script setup lang="ts">
import studiestapLogo from '../../../assets/studiestap-logo.svg'
import type { LevelConfig } from '../../../data/levels/types'

const props = defineProps<{
  levels: readonly LevelConfig[]
  hoogsteVoltooideLevel: number
  voltooideLevels?: number[]
  levelSterren?: Record<string, number>
  totaleScore?: number
}>()

const emit = defineEmits<{
  openGerechten: []
  openLevel: [level: number]
  openPlanten: []
  terug: []
}>()

function isVoltooid(level: number) {
  return props.voltooideLevels?.includes(level) ?? false
}

function isVergrendeld(level: number) {
  return !props.levels.some((configuratie) => configuratie.nummer === level)
}

function isHuidig(level: number) {
  return level === props.hoogsteVoltooideLevel + 1 && !isVergrendeld(level)
}

function statusVoor(level: number) {
  if (isVoltooid(level)) {
    return 'Voltooid'
  }

  if (isVergrendeld(level)) {
    return 'Vergrendeld'
  }

  if (isHuidig(level)) {
    return 'Volgende'
  }

  return props.levels.find((configuratie) => configuratie.nummer === level)?.uitgelicht ? 'Nog te doen' : 'Beschikbaar'
}

function sterrenVoor(level: number) {
  const aantal = props.levelSterren?.[level] ?? 0
  return '★'.repeat(aantal) + '☆'.repeat(3 - aantal)
}

function knopVoor(level: number) {
  if (isVergrendeld(level)) {
    return 'Vergrendeld'
  }

  if (props.levels.find((configuratie) => configuratie.nummer === level)?.uitgelicht) {
    return isVoltooid(level) ? 'Opnieuw spelen' : 'Spelen'
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
      <button type="button" class="terug-knop" @click="$emit('terug')">← Terug</button>
    </header>

    <nav class="level-tabs" aria-label="Level navigatie">
      <button type="button" class="actief">Levels</button>
      <button type="button" @click="$emit('openGerechten')">Gerechten</button>
      <button type="button" @click="emit('openPlanten')">Alle planten</button>
    </nav>

    <section class="level-inhoud">
      <div class="level-titel">
        <h1>Kies een level</h1>
        <p>{{ levels.length }} levels — level 1 is de tutorial</p>
      </div>

      <div class="levels">
        <article
          v-for="(level, index) in levels"
          :key="level.nummer"
          class="level-kaart"
          :class="{
            huidig: isHuidig(level.nummer),
            vergrendeld: isVergrendeld(level.nummer),
          }"
          :style="{ '--index': index }"
        >
          <div class="kaart-status">
            <span>{{ statusVoor(level.nummer) }}</span>
            <strong>{{ sterrenVoor(level.nummer) }}</strong>
          </div>

          <img :src="level.afbeelding" :alt="`Illustratie voor level ${level.nummer}: ${level.titel}`" />

          <div class="kaart-inhoud">
            <small>Level {{ level.nummer }}<template v-if="!level.uitgelicht"> · {{ level.beschrijving }}</template></small>
            <h2>{{ level.titel }}</h2>
            <p v-if="level.uitgelicht">{{ level.beschrijving }}</p>

            <div class="kaart-details">
              <span>{{ level.duur }}</span>
              <span>{{ level.plantIds.length }} planten</span>
              <span>{{ level.moeilijkheid }}</span>
            </div>

            <div class="voortgang">
              <span :style="{ width: isVoltooid(level.nummer) ? '100%' : '0%' }"></span>
            </div>
            <small class="voortgang-label">
              {{ isVoltooid(level.nummer) ? '100% voltooid' : '0% voltooid' }}
            </small>

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

    <footer class="level-voet">Totale score: {{ totaleScore ?? 0 }} pts</footer>
  </main>
</template>

<style scoped>
.level-keuze-scherm {
  display: grid;
  grid-template-rows: 56px 58px 1fr 38px;
  min-height: 100vh;
  background: #173d1d;
  color: #dbe6c8;
}

.level-kop {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.terug-knop {
  border: 1px solid #285c2c;
  border-radius: 6px;
  background: #153a19;
  color: #83c376;
  padding: 9px 15px;
  font-size: 12px;
  font-weight: 700;
}

.terug-knop:hover {
  background: #1c4a21;
  color: #b8e5a8;
}

.level-tabs {
  display: flex;
  align-items: end;
  gap: 12px;
  padding: 0 28px;
  border-bottom: 1px solid #315d37;
  background: #102d16;
}

.level-tabs button {
  min-width: 145px;
  height: 46px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #638166;
  font-size: 14px;
  font-weight: 700;
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
  grid-template-rows: 48px 130px 1fr;
  min-height: 460px;
  overflow: hidden;
  border: 1px solid #397036;
  border-radius: 16px;
  background: #102b17;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: voedselbos-fade-in-up 0.5s ease both;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

.level-kaart:not(.vergrendeld):hover {
  transform: translateY(-6px);
  border-color: #4c933c;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
}

.level-kaart.huidig {
  border: 3px solid #dda915;
}

.level-kaart.vergrendeld {
  opacity: 0.35;
}

.kaart-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 8px;
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
  height: 130px;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.level-kaart:not(.vergrendeld):hover > img {
  transform: scale(1.06);
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

.kaart-inhoud > p {
  color: #eee2bd;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
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

.voortgang-label {
  color: #6c8a6e;
  font-size: 9px;
}

.kaart-inhoud button {
  min-height: 40px;
  border: 1px solid #4c933c;
  border-radius: 6px;
  background: transparent;
  color: #6fbd55;
  font-weight: 700;
}

.kaart-inhoud button:not(:disabled):hover {
  background: rgba(111, 189, 85, 0.14);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

.huidig .kaart-inhoud button {
  border-color: #dda915;
  color: #f0c94a;
}

.huidig .kaart-inhoud button:not(:disabled):hover {
  background: rgba(221, 169, 21, 0.16);
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
