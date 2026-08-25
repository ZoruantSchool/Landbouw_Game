import afbeelding from '../../assets/level-1-appeltaart.png'
import type { LevelConfig } from './types'

const levelEen = {
  nummer: 1,
  titel: 'Appeltaart',
  beschrijving: 'Tutorial',
  toelichting: 'Leer terrein, voetprint, nabijheid en je eerste combo.',
  afbeelding,
  duur: '5 min',
  moeilijkheid: 'Makkelijk',
  plantIds: [
    'elstarboom',
    'witte_klaver',
    'bosaardbei',
    'vlier',
  ],
  terreinKaart: [
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'water', 'water'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'water'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'water'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'water'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever'],
  ],
  maximaleScore: 32,
  optimalePlaatsing: [
    { plantId: 'elstarboom', rij: 1, kolom: 1, breedte: 2, hoogte: 2 },
    { plantId: 'elstarboom', rij: 4, kolom: 3, breedte: 2, hoogte: 2 },
    { plantId: 'witte_klaver', rij: 1, kolom: 3, breedte: 1, hoogte: 1 },
    { plantId: 'witte_klaver', rij: 2, kolom: 3, breedte: 1, hoogte: 1 },
    { plantId: 'witte_klaver', rij: 3, kolom: 2, breedte: 1, hoogte: 1 },
    { plantId: 'witte_klaver', rij: 4, kolom: 5, breedte: 1, hoogte: 1 },
    { plantId: 'vlier', rij: 2, kolom: 6, breedte: 2, hoogte: 1 },
    { plantId: 'vlier', rij: 3, kolom: 6, breedte: 2, hoogte: 1 },
    { plantId: 'vlier', rij: 5, kolom: 7, breedte: 2, hoogte: 1 },
    { plantId: 'bosaardbei', rij: 1, kolom: 6, breedte: 1, hoogte: 1 },
    { plantId: 'bosaardbei', rij: 4, kolom: 7, breedte: 1, hoogte: 1 },
    { plantId: 'bosaardbei', rij: 6, kolom: 7, breedte: 1, hoogte: 1 },
    { plantId: 'bosaardbei', rij: 6, kolom: 8, breedte: 1, hoogte: 1 },
  ],
  combos: [
    { id: 'bestuiverscombo', naam: 'Bestuiverscombo', bonus: 3, actiefTekst: 'Witte Klaver in invloedszone van Walnootboom', gemistTekst: 'Witte Klaver niet in invloedszone van Walnootboom. Tip: zet Witte Klaver direct naast de boom.' },
    { id: 'oevercombo', naam: 'Oevercombo', bonus: 3, actiefTekst: 'Vlier + Bosaardbei op oever', gemistTekst: 'Bosaardbei niet aangrenzend aan Vlier. Tip: zet Bosaardbei direct naast de Vlier op de oever.' },
  ],
  gerecht: 'Appeltaart met bessentopping',
  heeftUitleg: true,
  uitleg: {
    titel: 'Appeltaart',
    subtitel: 'Welk gewas past waar?',
    tekst: 'In dit level leer je hoe een voedselbos werkt. Je plaatst de eerste planten, ontdekt wat terrein en nabijheid betekenen, en activeert je eerste combo.',
    uitlegTekst: 'Level 1 is een tutoriallevel. Je krijgt stap voor stap uitleg terwijl je speelt. De eerste stappen worden afgedwongen - daarna speel je vrij. Aan het einde zie je je score en wat je kunt leren voor level 2.',
    knopTekst: 'Start level 1',
  },
} satisfies LevelConfig

export default levelEen
