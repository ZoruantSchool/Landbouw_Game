import plantenCsv from './planten.csv?raw'
import type { TerreinSoort, VoedselbosItem } from '../types/spel'

export type PlantInformatie = VoedselbosItem & {
  eigenschappen: string
  combinaties: { id: string; relatie: string }[]
}

const afbeeldingen = import.meta.glob<string>('../assets/plant-*', {
  eager: true,
  import: 'default',
  query: '?url',
})

function leesCsv(csv: string) {
  const rijen: string[][] = []
  let rij: string[] = []
  let veld = ''
  let inAanhalingstekens = false

  for (let index = 0; index < csv.length; index += 1) {
    const teken = csv[index]
    const volgendTeken = csv[index + 1]

    if (teken === '"' && inAanhalingstekens && volgendTeken === '"') {
      veld += '"'
      index += 1
    } else if (teken === '"') {
      inAanhalingstekens = !inAanhalingstekens
    } else if (teken === ',' && !inAanhalingstekens) {
      rij.push(veld)
      veld = ''
    } else if ((teken === '\n' || teken === '\r') && !inAanhalingstekens) {
      if (teken === '\r' && volgendTeken === '\n') index += 1
      rij.push(veld)
      if (rij.some(Boolean)) rijen.push(rij)
      rij = []
      veld = ''
    } else {
      veld += teken
    }
  }

  if (veld || rij.length) {
    rij.push(veld)
    rijen.push(rij)
  }

  const [koppen = [], ...gegevens] = rijen
  return gegevens.map((waarden) => Object.fromEntries(koppen.map((kop, index) => [kop, waarden[index] ?? ''])))
}

function getal(waarde: string, standaard: number) {
  const resultaat = Number(waarde)
  return Number.isFinite(resultaat) ? resultaat : standaard
}

function combinaties(waarde: string) {
  if (!waarde) return []
  return waarde.split('||').map((combinatie) => {
    const [id = '', relatie = ''] = combinatie.split('::')
    return { id, relatie }
  })
}

export const planten: PlantInformatie[] = leesCsv(plantenCsv).map((rij) => ({
  id: rij.id ?? '',
  naam: rij.naam ?? '',
  icoon: '',
  afbeelding: afbeeldingen[`../assets/${rij.afbeelding ?? ''}`],
  beschrijving: rij.beschrijving ?? '',
  aantal: getal(rij.aantal ?? '', 1),
  opbrengst: {
    minimum: getal(rij.minOpbrengst ?? '', 0),
    maximum: getal(rij.maxOpbrengst ?? '', 0),
    eenheid: rij.opbrengstEenheid ?? 'kg',
  },
  footprint: { breedte: getal(rij.breedte ?? '', 1), hoogte: getal(rij.hoogte ?? '', 1) },
  laag: rij.laag ?? '',
  terrein: rij.terrein ?? '',
  correctTerreinen: (rij.correctTerreinen ?? '').split('|').filter(Boolean) as TerreinSoort[],
  tip: rij.tip ?? '',
  eigenschappen: rij.eigenschappen ?? '',
  combinaties: combinaties(rij.combinaties ?? ''),
}))

export const voedselbosItems: VoedselbosItem[] = planten
export const standaardVoedselbosItem = planten[0]!
