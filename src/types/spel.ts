export type VoedselbosItem = {
  afbeelding?: string
  beschrijving: string
  icoon: string
  naam: string
  terrein: string
}

export type SpelScherm =
  | 'start'
  | 'introductie'
  | 'levelKeuze'
  | 'levelUitleg'
  | 'gerechten'
  | 'spel'
  | 'einde'

export type TerreinSoort = 'grasland' | 'water' | 'heuvel' | 'schaduw'

export type VoedselbosVakje = {
  item: VoedselbosItem | null
  kolom: number
  index: number
  rij: number
  terrein: TerreinSoort
}
