export type VoedselbosItem = {
  naam: string
}

export type SpelScherm = 'start' | 'levelKeuze' | 'gerechten' | 'spel' | 'einde'

export type TerreinSoort = 'grasland' | 'water' | 'heuvel' | 'schaduw'

export type VoedselbosVakje = {
  item: VoedselbosItem | null
  kolom: number
  index: number
  rij: number
  terrein: TerreinSoort
}
