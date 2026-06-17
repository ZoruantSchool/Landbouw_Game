export type VoedselbosItem = {
  naam: string
}

export type SpelScherm = 'start' | 'levelKeuze' | 'gerechten' | 'spel' | 'einde'

export type VoedselbosVakje = {
  item: VoedselbosItem | null
  kolom: number
  index: number
  rij: number
  x: number
  y: number
}
