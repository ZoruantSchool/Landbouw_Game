import afbeelding from '../../assets/level-2-bramen-frambozenjam.png'
import type { LevelConfig } from './types'

const levelTwee = {
  nummer: 2,
  titel: 'Bramen-frambozenjam met munt',
  beschrijving: 'Een kleiner voedselbos met één boom, twee struiken en twee bodemplanten',
  toelichting: 'Ontdek welke planten schaduw geven, welke daarvan profiteren en welke de bodem verbeteren voor hun buren.',
  afbeelding,
  duur: '8 min',
  moeilijkheid: 'Middel',
  plantIds: [
    'kersenboom',
    'bramenstruik',
    'frambozenstruik',
    'munt',
    'klaver',
  ],
  terreinKaart: [
    ['grasland', 'grasland', 'grasland', 'schaduw', 'schaduw', 'oever', 'oever', 'oever'],
    ['grasland', 'grasland', 'schaduw', 'schaduw', 'oever', 'oever', 'oever', 'oever'],
    ['grasland', 'grasland', 'grasland', 'schaduw', 'oever', 'oever', 'akker', 'akker'],
    ['grasland', 'grasland', 'akker', 'akker', 'akker', 'oever', 'akker', 'akker'],
    ['grasland', 'akker', 'akker', 'akker', 'akker', 'akker', 'akker', 'oever'],
    ['grasland', 'grasland', 'akker', 'akker', 'akker', 'akker', 'oever', 'oever'],
    ['grasland', 'grasland', 'grasland', 'akker', 'akker', 'oever', 'oever', 'oever'],
    ['grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'oever', 'oever'],
  ],
  combos: [
    {
      id: 'schaduwcombo',
      naam: 'Schaduwcombo',
      bonus: 3,
      actiefTekst: 'Munt in invloedszone van Kersenboom',
      gemistTekst: 'Geen munt in de invloedszone van de kersenboom. Gevolg: de munt kreeg te veel zon en verdroogde (~2 opbr.). Tip: zet munt direct naast de kersenboom.',
    },
    {
      id: 'klaverbodemcombo',
      naam: 'Bodemcombo',
      bonus: 3,
      actiefTekst: 'Klaver aangrenzend aan de invloedszone van Kersenboom',
      gemistTekst: 'Geen klaver aangrenzend aan de invloedszone van de kersenboom. Tip: zet klaver dicht bij de boom, op de akker.',
    },
  ],
  maximaleScore: 31,
  optimalePlaatsing: [
    { plantId: 'kersenboom', rij: 1, kolom: 1, breedte: 2, hoogte: 2 },
    { plantId: 'bramenstruik', rij: 1, kolom: 6, breedte: 1, hoogte: 1 },
    { plantId: 'bramenstruik', rij: 1, kolom: 7, breedte: 1, hoogte: 1 },
    { plantId: 'bramenstruik', rij: 1, kolom: 8, breedte: 1, hoogte: 1 },
    { plantId: 'frambozenstruik', rij: 3, kolom: 1, breedte: 1, hoogte: 1 },
    { plantId: 'frambozenstruik', rij: 3, kolom: 2, breedte: 1, hoogte: 1 },
    { plantId: 'frambozenstruik', rij: 3, kolom: 3, breedte: 1, hoogte: 1 },
    { plantId: 'munt', rij: 2, kolom: 3, breedte: 1, hoogte: 1 },
    { plantId: 'munt', rij: 1, kolom: 4, breedte: 1, hoogte: 1 },
    { plantId: 'munt', rij: 1, kolom: 5, breedte: 1, hoogte: 1 },
    { plantId: 'munt', rij: 2, kolom: 4, breedte: 1, hoogte: 1 },
    { plantId: 'klaver', rij: 4, kolom: 3, breedte: 1, hoogte: 1 },
    { plantId: 'klaver', rij: 4, kolom: 4, breedte: 1, hoogte: 1 },
    { plantId: 'klaver', rij: 5, kolom: 2, breedte: 1, hoogte: 1 },
    { plantId: 'klaver', rij: 5, kolom: 3, breedte: 1, hoogte: 1 },
  ],
  gerecht: 'Bramen-frambozenjam met munt',
  heeftUitleg: true,
  uitleg: {
    titel: 'Bramen-frambozenjam met munt',
    subtitel: 'Welk gewas past waar?',
    tekst: 'In dit level bouw je een kleiner voedselbos met één boom, twee struiken en twee bodemplanten. Let op welke planten schaduw geven en welke daarvan profiteren, en welke planten de bodem juist verbeteren voor hun buren.',
    uitlegTekst: 'Let niet alleen op het terrein, maar ook op de ruimte en op welke planten elkaar versterken.',
    knopTekst: 'Start level 2',
  },
} satisfies LevelConfig

export default levelTwee
