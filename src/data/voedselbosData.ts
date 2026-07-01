import type { VoedselbosItem } from '../types/spel'
import brandnetelAfbeelding from '../assets/plant-brandnetel.png'
import daslookAfbeelding from '../assets/plant-daslook.png'
import hazelaarAfbeelding from '../assets/plant-hazelaar.png'
import vlierAfbeelding from '../assets/plant-vlier.png'
import walnootboomAfbeelding from '../assets/plant-walnootboom.png'
import wildeAardbeienAfbeelding from '../assets/plant-wilde-aardbeien.png'
import wildeAppelAfbeelding from '../assets/plant-wilde-appel.png'
import wildeKnoflookAfbeelding from '../assets/plant-wilde-knoflook.png'

export const aantalLevels = 3

export const standaardVoedselbosItem: VoedselbosItem = {
  aantal: 1,
  afbeelding: walnootboomAfbeelding,
  beschrijving: 'Grote Europese notenboom die de hoogste laag van het voedselbos vormt en schaduw geeft.',
  correctTerreinen: ['heuvel'],
  footprint: { breedte: 3, hoogte: 3 },
  icoon: '🌳',
  id: 'walnootboom',
  laag: 'Tussenboom',
  naam: 'Walnootboom',
  terrein: 'Heuvel',
  tip: 'Een volwassen walnootboom kan tot 50 kg noten per jaar produceren, genoeg voor een heel gezin.',
}

export const voedselbosItems: VoedselbosItem[] = [
  standaardVoedselbosItem,
  {
    aantal: 2,
    afbeelding: hazelaarAfbeelding,
    beschrijving: 'Inheemse struik die de ruimte tussen grote bomen en kruiden opvult.',
    correctTerreinen: ['grasland', 'schaduw'],
    footprint: { breedte: 2, hoogte: 2 },
    icoon: '🌰',
    id: 'hazelaar',
    laag: 'Grote struik',
    naam: 'Hazelaar',
    terrein: 'Grasland/schaduw',
    tip: 'Hazelnoten zijn een van de rijkste plantaardige eiwitbronnen.',
  },
  {
    aantal: 2,
    afbeelding: wildeAppelAfbeelding,
    beschrijving: 'Inheemse tussenboom met kleine zure appels voor compote of cider.',
    correctTerreinen: ['grasland', 'oever'],
    footprint: { breedte: 2, hoogte: 2 },
    icoon: '🍎',
    id: 'wilde_appels',
    laag: 'Tussenboom',
    naam: 'Wilde Appel',
    terrein: 'Grasland/oever',
    tip: 'De wilde appel is beschermd in Nederland. Door hem te planten help je deze bedreigde soort herstellen.',
  },
  {
    aantal: 3,
    afbeelding: vlierAfbeelding,
    beschrijving: 'Snelgroeiende oeverstruik met witte bloesemschermen en donkerpaarse bessen.',
    correctTerreinen: ['oever'],
    footprint: { breedte: 2, hoogte: 1 },
    icoon: '🌿',
    id: 'vlier',
    laag: 'Struik',
    naam: 'Vlier',
    terrein: 'Oever',
    tip: 'Van de witte bloesemschermen in juni maak je vlierbloesemsiroop.',
  },
  {
    aantal: 5,
    afbeelding: daslookAfbeelding,
    beschrijving: 'Kruid met knoflookgeur dat van nature onder bomen in vochtige bossen groeit.',
    correctTerreinen: ['schaduw'],
    footprint: { breedte: 1, hoogte: 1 },
    icoon: '🌱',
    id: 'daslook',
    laag: 'Kruidlaag',
    naam: 'Daslook',
    terrein: 'Schaduw',
    tip: 'Daslook lijkt op het giftige lelietje-van-dalen. Ruik altijd even voor je plukt.',
  },
  {
    aantal: 6,
    afbeelding: wildeAardbeienAfbeelding,
    beschrijving: 'Bodembedekker met witte bloemen en geurige vruchten die zich via uitlopers verspreidt.',
    correctTerreinen: ['grasland', 'oever'],
    footprint: { breedte: 1, hoogte: 1 },
    icoon: '🍓',
    id: 'wilde_aardbeien',
    laag: 'Kruidlaag',
    naam: 'Wilde Aardbeien',
    terrein: 'Heuvel/oever',
    tip: 'Wilde aardbeien bevatten per gram meer aroma- en smaakstoffen dan gekweekte rassen.',
  },
  {
    aantal: 5,
    afbeelding: wildeKnoflookAfbeelding,
    beschrijving: 'Bolgewas dat de akker tegen insectenplagen helpt beschermen.',
    correctTerreinen: ['akker'],
    footprint: { breedte: 1, hoogte: 1 },
    icoon: '🧄',
    id: 'wilde_knoflook',
    laag: 'Wortellaag',
    naam: 'Wilde Knoflook',
    terrein: 'Akker',
    tip: 'Knoflook wordt al meer dan 5000 jaar gebruikt als voedsel en geneesmiddel.',
  },
  {
    aantal: 5,
    afbeelding: brandnetelAfbeelding,
    beschrijving: 'Inheems kruid dat de bodem met stikstof verrijkt en jonge aanplant beschermt.',
    correctTerreinen: ['akker', 'oever'],
    footprint: { breedte: 1, hoogte: 1 },
    icoon: '🌿',
    id: 'brandnetel',
    laag: 'Kruidlaag',
    naam: 'Brandnetel',
    terrein: 'Oever/Akker',
    tip: 'Meer dan 40 insectensoorten zijn volledig afhankelijk van de brandnetel.',
  },
]

export const levelDrieTerreinKaart = [
  ['heuvel', 'heuvel', 'heuvel', 'heuvel', 'schaduw', 'schaduw', 'grasland', 'grasland', 'oever', 'oever', 'water', 'water'],
  ['heuvel', 'heuvel', 'heuvel', 'schaduw', 'schaduw', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'oever', 'water'],
  ['heuvel', 'heuvel', 'schaduw', 'schaduw', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'water'],
  ['heuvel', 'schaduw', 'schaduw', 'grasland', 'grasland', 'akker', 'akker', 'grasland', 'grasland', 'oever', 'oever', 'water'],
  ['grasland', 'grasland', 'grasland', 'grasland', 'akker', 'akker', 'akker', 'grasland', 'grasland', 'oever', 'oever', 'water'],
  ['grasland', 'grasland', 'grasland', 'akker', 'akker', 'akker', 'akker', 'grasland', 'grasland', 'grasland', 'oever', 'water'],
  ['grasland', 'grasland', 'grasland', 'akker', 'akker', 'akker', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever'],
  ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever'],
  ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'water'],
  ['grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'grasland', 'oever', 'oever', 'water', 'water'],
] as const

export const levelDrieCombos = [
  {
    id: 'lagencombo',
    naam: 'Lagencombo',
    bonus: 4,
    actiefTekst: 'Walnoot + Hazelaar + Daslook in invloedszone',
    gemistTekst: 'Daslook staat niet in de invloedszone van walnoot of hazelaar',
  },
  {
    id: 'beekdalcombo',
    naam: 'Beekdalcombo',
    bonus: 3,
    actiefTekst: 'Vlier + wilde aardbeien aangrenzend op de oever',
    gemistTekst: 'Vlier en wilde aardbeien raken elkaar niet op de oever',
  },
  {
    id: 'bosrandcombo',
    naam: 'Bosrandcombo',
    bonus: 3,
    actiefTekst: 'Wilde appel + daslook in invloedszone',
    gemistTekst: 'Daslook staat niet in de invloedszone van wilde appel',
  },
  {
    id: 'bodemcombo',
    naam: 'Bodemcombo',
    bonus: 4,
    actiefTekst: 'Knoflook + brandnetel naast elkaar op de akker',
    gemistTekst: 'Knoflook staat niet naast brandnetel op de akker',
  },
]

export const gerechten = ['Fruitsalade', 'Bessenjam', 'Walnoot-hazelnootpasta']
