<script setup lang="ts">
import levelDrieGerecht from '../../../assets/level-3-walnoot-hazelnootpasta.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'

defineEmits<{
  start: []
  terug: []
}>()

const terreintypes = [
  { kleur: '#79cf7c', naam: 'Grasland' },
  { kleur: '#d4d0ba', naam: 'Heuvel' },
  { kleur: '#d5e78a', naam: 'Oever' },
  { kleur: '#45a8d1', naam: 'Water' },
  { kleur: '#526a36', naam: 'Schaduw' },
  { kleur: '#bc8c5c', naam: 'Akker' },
]
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
          <small>Level 3</small>
          <h1>Walnoot-Hazelnootpasta</h1>
          <p class="subtitel">met wilde kruiden en bessencompote</p>

          <h2>Welk gewas past waar?</h2>
          <p class="beschrijving">
            In dit level bouw je een voedselbos dat uit meerdere lagen bestaat. Bomen, struiken
            en kruiden werken samen, maar nemen ook ruimte in en beïnvloeden elkaar. Kies slim
            waar je elk gewas plaatst en zorg voor een sterke balans tussen biodiversiteit, bodem
            en opbrengst.
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
            In level 3 draait alles om samenwerken in lagen. Grote bomen nemen meerdere vakjes
            in, geven schaduw en beïnvloeden de planten om hen heen. Struiken en kruiden kunnen
            daar juist van profiteren, zolang je ze op de juiste plek zet. Let dus niet alleen op
            het terrein, maar ook op de ruimte en op welke planten elkaar versterken.
          </p>
        </aside>

        <button type="button" class="start-knop" @click="$emit('start')">Start level 3</button>
      </div>

      <div class="beeld-kolom">
        <img
          :src="levelDrieGerecht"
          alt="Hazelnootpasta, bessencompote, brood, kruiden en bessen in een zonnig bos"
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
  font-size: 13px;
}

.uitleg-kop button:hover {
  color: #8eb391;
}

.uitleg-inhoud {
  display: grid;
  grid-template-columns: minmax(390px, 40%) 1fr;
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
  font-size: 11px;
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
  font-size: clamp(28px, 2.7vw, 42px);
  line-height: 1;
}

.subtitel {
  color: #eee3c1;
  font-size: clamp(18px, 1.7vw, 26px);
  line-height: 1.15;
}

.intro h2 {
  margin-top: 34px;
  color: #dcab18;
  font-size: 23px;
}

.beschrijving {
  max-width: 500px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.38;
}

.terrein-groep {
  margin-top: 24px;
}

.terrein-groep h3 {
  margin-bottom: 8px;
  color: #486e4d;
  font-size: 9px;
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
  font-size: 12px;
  line-height: 1.55;
  color: #a6b798;
}

.terrein-groep li span {
  width: 15px;
  height: 15px;
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
  font-size: 12px;
  font-weight: 700;
}

.uitleg-kaart p {
  margin-top: 9px;
  font-size: 11px;
  line-height: 1.35;
}

.start-knop {
  width: 100%;
  min-height: 55px;
  margin-top: auto;
  border: 1px solid #77c957;
  border-radius: 10px;
  background: #4a9139;
  color: #fff8dd;
  font-size: 18px;
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
