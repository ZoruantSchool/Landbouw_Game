export type VoedselbosItem = {
  aantal?: number
  afbeelding?: string
  beschrijving: string
  correctTerreinen?: TerreinSoort[]
  footprint?: {
    breedte: number
    hoogte: number
  }
  icoon: string
  id?: string
  laag?: string
  naam: string
  terrein: string
  tip?: string
}

export type SpelScherm =
  | 'start'
  | 'introductie'
  | 'levelKeuze'
  | 'levelUitleg'
  | 'gerechten'
  | 'spel'
  | 'einde'

export type TerreinSoort = 'akker' | 'grasland' | 'heuvel' | 'oever' | 'schaduw' | 'water'

export type VoedselbosVakje = {
  anker: boolean
  item: VoedselbosItem | null
  kolom: number
  index: number
  plaatsingId: number | null
  rij: number
  terrein: TerreinSoort
}

export type VoedselbosPlaatsing = {
  id: number
  item: VoedselbosItem
  vakjes: number[]
}
