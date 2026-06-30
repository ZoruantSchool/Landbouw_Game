import type { VoedselbosItem } from '../types/spel'

export const aantalLevels = 3

export const standaardVoedselbosItem: VoedselbosItem = {
  beschrijving: 'Geschikt voor zonnige vakken',
  icoon: '🌳',
  naam: 'Appelboom',
  terrein: 'Grasland',
}

export const voedselbosItems: VoedselbosItem[] = [
  standaardVoedselbosItem,
  {
    beschrijving: 'Groeit goed naast bomen',
    icoon: '🌿',
    naam: 'Bessenstruik',
    terrein: 'Grasland',
  },
  {
    beschrijving: 'Past tussen andere gewassen',
    icoon: '🫙',
    naam: 'Kruiden',
    terrein: 'Alle terreinen',
  },
  {
    beschrijving: 'Heeft een open plek nodig',
    icoon: '🌾',
    naam: 'Graan',
    terrein: 'Grasland',
  },
  {
    beschrijving: 'Groeit langs het water',
    icoon: '☘️',
    naam: 'Waterkers',
    terrein: 'Waterloop',
  },
  {
    beschrijving: 'Geschikt voor hoger terrein',
    icoon: '🌲',
    naam: 'Notenboom',
    terrein: 'Heuvel',
  },
  {
    beschrijving: 'Groeit op donkere plekken',
    icoon: '🍄',
    naam: 'Paddenstoelen',
    terrein: 'Schaduw',
  },
  {
    beschrijving: 'Verbetert de bodem',
    icoon: '♻️',
    naam: 'Composthoop',
    terrein: 'Grasland',
  },
]

export const gerechten = ['Fruitsalade', 'Bessenjam', 'Kruidenthee']
