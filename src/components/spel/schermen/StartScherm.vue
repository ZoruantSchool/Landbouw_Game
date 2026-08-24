<script setup lang="ts">
import catterpieAfbeelding from '../../../assets/catterpie.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'

defineEmits<{
  start: []
}>()
</script>

<template>
  <main class="start-scherm">
    <div class="sterren" aria-hidden="true">
      <span v-for="ster in 10" :key="ster"></span>
    </div>

    <div class="landschap" aria-hidden="true">
      <div class="bomen bomen-links">
        <span v-for="boom in 3" :key="boom"></span>
      </div>
      <div class="bomen bomen-rechts">
        <span v-for="boom in 3" :key="boom"></span>
      </div>
      <div class="velden">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <section class="start-inhoud">
      <img class="merk-logo" :src="studiestapLogo" alt="Studie-Stap, workshops voor scholieren" />
      <div class="titel-rij">
        <h1>Voedselbos</h1>
        <img class="catterpie" :src="catterpieAfbeelding" alt="" aria-hidden="true" />
      </div>
      <p class="ondertitel">Leer bouwen aan de toekomst van de landbouw</p>
      <span class="scheidingslijn"></span>
      <button type="button" class="speel-knop" @click="$emit('start')">Speel nu</button>
      <button type="button" class="uitleg-knop">Hoe werkt het?</button>
    </section>

  </main>
</template>

<style scoped>
.start-scherm {
  position: relative;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  background: #122f19;
  color: #ffffff;
}

.sterren {
  position: absolute;
  inset: 0 0 auto;
  height: 42%;
  pointer-events: none;
}

.sterren span {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #d9d18a;
}

.sterren span:nth-child(1) {
  top: 10%;
  left: 16%;
}

.sterren span:nth-child(2) {
  top: 17%;
  left: 30%;
}

.sterren span:nth-child(3) {
  top: 7%;
  left: 48%;
}

.sterren span:nth-child(4) {
  top: 14%;
  left: 61%;
}

.sterren span:nth-child(5) {
  top: 20%;
  left: 78%;
}

.sterren span:nth-child(6) {
  top: 8%;
  left: 91%;
}

.sterren span:nth-child(7) {
  top: 30%;
  left: 23%;
}

.sterren span:nth-child(8) {
  top: 25%;
  left: 70%;
}

.sterren span:nth-child(9) {
  top: 12%;
  left: 52%;
}

.sterren span:nth-child(10) {
  top: 27%;
  left: 86%;
}

.landschap {
  position: absolute;
  inset: 43% 0 0;
  background: #284d29;
}

.landschap::before {
  position: absolute;
  inset: 32% 0 auto;
  height: 10px;
  background: #17351d;
  content: '';
}

.bomen {
  position: absolute;
  top: -18%;
  display: flex;
  gap: 38px;
}

.bomen-links {
  left: 4%;
}

.bomen-rechts {
  right: 4%;
}

.bomen span {
  position: relative;
  display: block;
  width: 14px;
  height: 92px;
  background: #102b17;
}

.bomen span::before {
  position: absolute;
  top: -22px;
  left: 50%;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #102b17;
  content: '';
  transform: translateX(-50%);
}

.velden {
  position: absolute;
  inset: 35% 0 0;
  display: grid;
  grid-template-columns: 27% 40% 1fr;
  gap: 14px;
  padding-top: 10px;
  border-top: 8px solid #17351d;
}

.velden span {
  height: 68px;
  background: #1e4223;
}

.start-inhoud {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(90%, 390px);
  place-items: center;
  gap: 10px;
  padding: 34px 44px 28px;
  border: 1px solid #357043;
  border-radius: 8px;
  background: rgba(3, 18, 8, 0.88);
  text-align: center;
}

.merk-logo {
  width: 120px;
  height: auto;
}

.start-inhoud h1 {
  color: #e4ad1a;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
}

.titel-rij {
  position: relative;
  display: inline-grid;
  place-items: center;
  margin-top: 14px;
}

.catterpie {
  position: absolute;
  right: -76px;
  bottom: -12px;
  width: 88px;
  height: auto;
  filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.28));
  pointer-events: none;
}

.ondertitel {
  color: #94b776;
  font-size: 12px;
}

.scheidingslijn {
  width: 130px;
  height: 1px;
  background: #315f36;
}

.start-inhoud button {
  width: 100%;
  min-height: 42px;
  border-radius: 7px;
  font-weight: 700;
}

.speel-knop {
  border: 1px solid #69b84d;
  background: #4c9639;
  color: #ffffff;
}

.speel-knop:hover {
  background: #5aaa43;
}

.uitleg-knop {
  border: 1px solid #3d7d46;
  background: transparent;
  color: #67b94c;
}

@media (max-width: 600px) {
  .start-inhoud {
    padding: 28px 24px 24px;
  }

  .start-inhoud h1 {
    font-size: 42px;
  }

  .catterpie {
    right: -50px;
    width: 66px;
  }
}
</style>
