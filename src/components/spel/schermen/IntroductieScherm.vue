<script setup lang="ts">
import introductieBeeld from '../../../assets/landbouw-introductie.png'
import studiestapLogo from '../../../assets/studiestap-logo.svg'

defineEmits<{
  begin: []
}>()

const leerwegen = [
  {
    beschrijving: 'Agroforestry en voedselbossen',
    kleur: 'groen',
    tekst: 'Werk samen met natuurlijke processen en geef biodiversiteit de ruimte.',
    titel: 'Samen met de natuur',
  },
  {
    beschrijving: 'Grote akkers en mechanisatie',
    kleur: 'geel',
    tekst: 'Ontdek hoe schaal en efficiëntie de opbrengst van landbouw beïnvloeden.',
    titel: 'Maximale efficiëntie',
  },
  {
    beschrijving: 'Compost en reststromen',
    kleur: 'bruin',
    tekst: 'Gebruik materialen opnieuw en maak de kringloop op het land compleet.',
    titel: 'Kringloop in landbouw',
  },
  {
    beschrijving: 'Kweekvlees en vertical farming',
    kleur: 'blauw',
    tekst: 'Onderzoek nieuwe technieken voor het voedselbos van de toekomst.',
    titel: 'Landbouwinnovatie',
  },
]
</script>

<template>
  <main class="introductie-scherm">
    <header class="introductie-kop">
      <img :src="studiestapLogo" alt="Studie-Stap, workshops voor scholieren" />
    </header>

    <section class="introductie-beeld">
      <img :src="introductieBeeld" alt="Illustratie van duurzame landbouw met een landbouwmachine" />
    </section>

    <section class="introductie-inhoud">
      <div class="introductie-titel">
        <p>Wat leer je in deze game?</p>
        <h1>Vier wegen naar <strong>duurzame landbouw</strong></h1>
        <span>
          Ontdek hoe verschillende landbouwvormen invloed hebben op natuur, voedsel en de
          toekomst van het landschap.
        </span>
      </div>

      <div class="leerwegen">
        <article
          v-for="(leerweg, index) in leerwegen"
          :key="leerweg.titel"
          class="leerweg"
          :class="`leerweg-${leerweg.kleur}`"
        >
          <h2>{{ index + 1 }}. {{ leerweg.titel }}</h2>
          <p>{{ leerweg.beschrijving }}</p>
          <span>{{ leerweg.tekst }}</span>
        </article>
      </div>

      <div class="game-uitleg">
        <h2>In de game</h2>
        <p>
          Kies de juiste strategie voor ieder stuk land en ontdek de gevolgen voor natuur,
          economie en voedsel.
        </p>
      </div>

      <p class="doelgroep">Doelgroep: havo/vwo bovenbouw · Vak: Biologie — Ecologie & Milieu</p>
      <button type="button" class="begin-knop" @click="$emit('begin')">Begin →</button>
    </section>
  </main>
</template>

<style scoped>
.introductie-scherm {
  display: grid;
  grid-template-columns: minmax(320px, 38%) 1fr;
  grid-template-rows: 56px minmax(0, 1fr);
  width: 100%;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: #1b4321;
  color: #dce8cc;
}

.introductie-kop {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  padding: 8px 24px;
  background: #071b0d;
}

.introductie-kop img {
  width: 96px;
  height: auto;
}

.introductie-beeld {
  min-height: 0;
  border: 2px solid #0aa7ff;
  overflow: hidden;
}

.introductie-beeld img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.introductie-inhoud {
  display: grid;
  align-content: center;
  min-width: 0;
  min-height: 0;
  gap: 8px;
  overflow-y: auto;
  padding: 16px 5%;
}

.introductie-titel {
  display: grid;
  max-width: 700px;
  gap: 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid #315c36;
}

.introductie-titel > p,
.game-uitleg h2 {
  color: #68b850;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.introductie-titel h1 {
  max-width: 560px;
  color: #eee3c1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.08;
}

.introductie-titel strong {
  color: #e2ad1b;
  font-weight: 700;
}

.introductie-titel span,
.game-uitleg p {
  color: #8baa82;
  font-size: 13px;
  line-height: 1.4;
}

.leerwegen {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
}

.leerweg {
  min-height: 88px;
  padding: 11px 14px;
  border: 1px solid #315a34;
  border-left-width: 6px;
  border-radius: 8px;
  background: #102b17;
}

.leerweg h2 {
  color: #e5e7d5;
  font-size: 13px;
  font-weight: 700;
}

.leerweg p,
.leerweg span {
  display: block;
  margin-top: 4px;
  color: #6f9870;
  font-size: 11px;
}

.leerweg-groen {
  border-left-color: #67bd4c;
}

.leerweg-geel {
  border-left-color: #e1ae20;
}

.leerweg-bruin {
  border-left-color: #985328;
}

.leerweg-blauw {
  border-left-color: #4389d0;
}

.game-uitleg {
  padding: 10px 14px;
  border: 1px solid #8a741c;
  border-radius: 8px;
  background: #254b29;
}

.game-uitleg h2 {
  color: #e1ae20;
}

.game-uitleg p {
  margin-top: 3px;
  color: #ced8b5;
}

.doelgroep {
  color: #66846a;
  font-size: 11px;
}

.begin-knop {
  width: 195px;
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  background: #397d2d;
  color: #ffffff;
  font-weight: 700;
}

.begin-knop:hover {
  background: #4a9538;
}

@media (max-width: 800px) {
  .introductie-scherm {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 320px auto;
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }

  .introductie-kop {
    grid-column: 1;
  }

  .introductie-inhoud {
    overflow: visible;
    padding: 30px 20px;
  }
}

@media (min-width: 801px) and (max-height: 620px) {
  .introductie-scherm {
    grid-template-rows: 48px minmax(0, 1fr);
  }

  .introductie-kop {
    padding-block: 5px;
  }

  .introductie-kop img {
    width: 82px;
  }

  .introductie-inhoud {
    gap: 6px;
    padding-block: 10px;
  }

  .introductie-titel h1 {
    font-size: 26px;
  }

  .introductie-titel > span,
  .leerweg span,
  .doelgroep {
    display: none;
  }

  .leerweg {
    min-height: 62px;
    padding-block: 8px;
  }

  .game-uitleg {
    padding-block: 8px;
  }
}

@media (max-width: 560px) {
  .introductie-titel h1 {
    font-size: 30px;
  }

  .leerwegen {
    grid-template-columns: 1fr;
  }

  .begin-knop {
    width: 100%;
  }
}
</style>
