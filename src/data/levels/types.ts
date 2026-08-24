import type { TerreinSoort } from '../../types/spel'

export type LevelCombo = {
  id: string
  naam: string
  bonus: number
  actiefTekst: string
  gemistTekst: string
}

export type LevelConfig = {
  nummer: number
  titel: string
  beschrijving: string
  toelichting?: string
  afbeelding: string
  duur: string
  moeilijkheid: string
  plantIds: string[]
  terreinKaart: TerreinSoort[][]
  combos: LevelCombo[]
  maximaleScore: number
  optimalePlaatsing: {
    plantId: string
    rij: number
    kolom: number
    breedte: number
    hoogte: number
  }[]
  gerecht?: string
  heeftUitleg: boolean
  uitleg?: {
    titel: string
    subtitel: string
    tekst: string
    uitlegTekst: string
    knopTekst: string
  }
  uitgelicht?: boolean
}
