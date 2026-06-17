import type { VoedselbosItem } from '../types/spel'

export const aantalLevels = 3

export const standaardVoedselbosItem: VoedselbosItem = { naam: 'Fruitboom' }

export const voedselbosItems: VoedselbosItem[] = [
  standaardVoedselbosItem,
  { naam: 'Bessenstruik' },
  { naam: 'Kruidenplant' },
]

export const gerechten = ['Fruitsalade', 'Bessenjam', 'Kruidenthee']
