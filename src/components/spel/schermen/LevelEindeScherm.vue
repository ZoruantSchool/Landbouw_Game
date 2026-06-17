<script setup lang="ts">
defineProps<{
  aantalLevels: number
  level: number
}>()

defineEmits<{
  levels: []
  opnieuw: []
  volgend: []
}>()

const verbeterTeksten = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo sed augue luctus.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo augue vel purus.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis turpis at massa.',
]

const artikelTeksten = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
]
</script>

<template>
  <main class="einde-pagina">
    <div class="einde-venster">
      <header class="einde-balk">
        <span></span>
        <p>Level {{ level }}</p>
        <span></span>
      </header>

      <div class="einde-scherm">
        <section class="resultaat-blok">
          <div class="resultaat-kaart">
            <p>Resultaat</p>
            <h1>Level voltooid</h1>
          </div>

          <div class="score-blok">
            <p>Sterrenscore</p>
            <div class="sterren">
              <span>☆</span>
              <span>☆</span>
              <span>☆</span>
            </div>
            <span class="score-lijn"></span>
          </div>

          <div class="actie-blok">
            <p>Acties</p>
            <div class="einde-acties">
              <button type="button" @click="$emit('levels')">Levels</button>
              <button type="button" @click="$emit('opnieuw')">Opnieuw</button>
              <button type="button" :disabled="level >= aantalLevels" @click="$emit('volgend')">
                Volgende
              </button>
            </div>
          </div>
        </section>

        <section class="tips-blok" aria-labelledby="verbeter-tips-titel">
          <h2 id="verbeter-tips-titel">Verbeterpunten</h2>

          <div v-for="(tekst, index) in verbeterTeksten" :key="tekst" class="tip-placeholder">
            <span></span>
            <p>{{ index + 1 }}. {{ tekst }}</p>
          </div>
        </section>

        <section class="artikelen-blok">
          <h2>Gerelateerde landbouwartikelen</h2>

          <div v-for="(tekst, index) in artikelTeksten" :key="index" class="artikel-placeholder">
            <span></span>
            <p>{{ tekst }}</p>
            <span></span>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.einde-pagina {
  min-height: 100vh;
  padding: 16px 20px;
  background: #111111;
  color: #111111;
}

.einde-venster {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - 32px);
  border: 4px solid #111111;
  background: #ffffff;
}

.einde-balk {
  display: grid;
  grid-template-columns: 72px 1fr 72px;
  gap: 16px;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 2px solid #111111;
}

.einde-balk span {
  height: 10px;
  border: 2px solid #111111;
}

.einde-balk p {
  color: #111111;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.einde-scherm {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 16px;
  padding: 18px;
}

.resultaat-blok,
.tips-blok,
.artikelen-blok {
  min-height: 480px;
  padding: 20px;
}

.resultaat-blok,
.tips-blok {
  border-right: 2px solid #111111;
}

.resultaat-blok {
  display: grid;
  align-content: start;
  gap: 28px;
  text-align: center;
}

.tips-blok,
.artikelen-blok {
  display: grid;
  align-content: start;
  gap: 10px;
}

.resultaat-kaart {
  padding: 22px 16px;
  border: 4px solid #111111;
}

.resultaat-kaart p,
.score-blok > p,
.actie-blok > p,
.tips-blok h2,
.artikelen-blok h2 {
  margin-bottom: 12px;
  color: #111111;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.resultaat-kaart h1 {
  color: #111111;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
}

.score-blok {
  display: grid;
  gap: 10px;
}

.sterren {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 22px 36px;
  border: 2px solid #111111;
}

.sterren span {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  border: 2px solid #111111;
  color: #111111;
  font-size: 24px;
}

.score-lijn {
  justify-self: center;
  width: 110px;
  height: 8px;
  border: 2px solid #111111;
}

.einde-acties {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.einde-acties button {
  min-height: 56px;
  border: 2px solid #111111;
  background: #ffffff;
  color: #111111;
}

.einde-acties button:last-child {
  border-color: #111111;
  background: #111111;
  color: #ffffff;
}

.einde-acties button:disabled {
  opacity: 0.45;
}

.tip-placeholder {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 14px;
  padding: 12px;
  border: 2px solid #111111;
}

.tip-placeholder > span {
  width: 20px;
  height: 20px;
  border: 2px solid #111111;
}

.tip-placeholder p,
.artikel-placeholder p {
  color: #111111;
  font-size: 13px;
  line-height: 1.45;
}

.artikel-placeholder {
  display: grid;
  grid-template-columns: 52px 1fr 18px;
  gap: 10px;
  align-items: start;
  padding: 10px;
  border: 2px solid #111111;
}

.artikel-placeholder > span:first-child {
  height: 48px;
  border: 2px solid #111111;
}

.artikel-placeholder > span:last-child {
  width: 10px;
  height: 10px;
  margin-top: 8px;
  border-top: 2px solid #111111;
  border-right: 2px solid #111111;
  transform: rotate(45deg);
}

@media (max-width: 900px) {
  .einde-scherm {
    grid-template-columns: 1fr;
  }

  .resultaat-blok,
  .tips-blok {
    border-right: 0;
    border-bottom: 2px solid #111111;
  }
}
</style>
