import { computed, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { TerreinSoort, VoedselbosItem } from '../types/spel'

type BordCel = {
  anker: boolean
  item: VoedselbosItem | null
  plaatsingId: number | null
}

type BordOpties = {
  standaardItem: VoedselbosItem
  terreinKaart: MaybeRefOrGetter<TerreinSoort[][]>
  rasterKolommen?: number
  rasterRijen?: number
}

export function useVoedselbosBord({
  standaardItem,
  terreinKaart,
  rasterKolommen,
  rasterRijen,
}: BordOpties) {
  const kolommen = computed(() => rasterKolommen ?? toValue(terreinKaart)[0]?.length ?? 12)
  const rijen = computed(() => rasterRijen ?? toValue(terreinKaart).length ?? 10)
  const geselecteerdItem = ref(standaardItem)
  const gesleeptItem = ref<VoedselbosItem | null>(null)
  const volgendePlaatsingId = ref(1)
  const cellen = ref<BordCel[]>(maakLegeCellen())

  function maakLegeCellen() {
    return Array.from({ length: kolommen.value * rijen.value }, () => ({
      anker: false,
      item: null,
      plaatsingId: null,
    }))
  }

  function bepaalTerrein(rij: number, kolom: number): TerreinSoort {
    return toValue(terreinKaart)[rij]?.[kolom] ?? 'grasland'
  }

  function bepaalFootprintVakjes(index: number, item: VoedselbosItem) {
    const breedte = item.footprint?.breedte ?? 1
    const hoogte = item.footprint?.hoogte ?? 1
    const klikRij = Math.floor(index / kolommen.value)
    const klikKolom = index % kolommen.value
    const gebruiktMiddenAlsAnker = item.id === 'walnootboom'
    const startRij = gebruiktMiddenAlsAnker ? klikRij - Math.floor(hoogte / 2) : klikRij
    const startKolom = gebruiktMiddenAlsAnker ? klikKolom - Math.floor(breedte / 2) : klikKolom
    const vakjes: number[] = []

    if (startKolom < 0 || startRij < 0 || startKolom + breedte > kolommen.value || startRij + hoogte > rijen.value) {
      return []
    }

    for (let rijOffset = 0; rijOffset < hoogte; rijOffset += 1) {
      for (let kolomOffset = 0; kolomOffset < breedte; kolomOffset += 1) {
        const rij = startRij + rijOffset
        const kolom = startKolom + kolomOffset
        const vakjeIndex = rij * kolommen.value + kolom

        if (bepaalTerrein(rij, kolom) === 'water' || cellen.value[vakjeIndex]?.item) {
          return []
        }

        vakjes.push(vakjeIndex)
      }
    }

    return vakjes
  }

  const vakjes = computed(() =>
    cellen.value.map((cel, index) => {
      const rij = Math.floor(index / kolommen.value)
      const kolom = index % kolommen.value

      return {
        anker: cel.anker,
        item: cel.item,
        kolom,
        index,
        plaatsingId: cel.plaatsingId,
        rij,
        terrein: bepaalTerrein(rij, kolom),
      }
    }),
  )

  const plaatsingen = computed(() => {
    const perId = new Map<number, { id: number; item: VoedselbosItem; vakjes: number[] }>()

    cellen.value.forEach((cel, index) => {
      if (!cel.item || cel.plaatsingId === null) {
        return
      }

      const bestaand = perId.get(cel.plaatsingId)
      if (bestaand) {
        bestaand.vakjes.push(index)
        return
      }

      perId.set(cel.plaatsingId, {
        id: cel.plaatsingId,
        item: cel.item,
        vakjes: [index],
      })
    })

    return [...perId.values()]
  })

  const geplaatsteAantallen = computed(() =>
    plaatsingen.value.reduce<Record<string, number>>((aantallen, plaatsing) => {
      const sleutel = plaatsing.item.id ?? plaatsing.item.naam
      aantallen[sleutel] = (aantallen[sleutel] ?? 0) + 1
      return aantallen
    }, {}),
  )

  function plaatsItem(index: number, item = geselecteerdItem.value) {
    const itemSleutel = item.id ?? item.naam
    const maximum = item.aantal ?? 1

    if ((geplaatsteAantallen.value[itemSleutel] ?? 0) >= maximum) {
      return
    }

    const footprintVakjes = bepaalFootprintVakjes(index, item)

    if (footprintVakjes.length === 0) {
      return
    }

    const plaatsingId = volgendePlaatsingId.value
    volgendePlaatsingId.value += 1

    footprintVakjes.forEach((vakjeIndex, positie) => {
      cellen.value[vakjeIndex] = {
        anker: positie === 0,
        item,
        plaatsingId,
      }
    })
  }

  function maakVakjeLeeg(index: number) {
    const plaatsingId = cellen.value[index]?.plaatsingId

    if (plaatsingId === null) {
      return
    }

    cellen.value = cellen.value.map((cel) =>
      cel.plaatsingId === plaatsingId
        ? {
            anker: false,
            item: null,
            plaatsingId: null,
          }
        : cel,
    )
  }

  function resetBord() {
    cellen.value = maakLegeCellen()
    volgendePlaatsingId.value = 1
  }

  function startSlepen(item: VoedselbosItem) {
    gesleeptItem.value = item
  }

  function laatItemLos(index: number) {
    if (!gesleeptItem.value) {
      return
    }

    plaatsItem(index, gesleeptItem.value)
    gesleeptItem.value = null
  }

  return {
    geselecteerdItem,
    geplaatsteAantallen,
    laatItemLos,
    maakVakjeLeeg,
    plaatsItem,
    plaatsingen,
    rasterKolommen: kolommen,
    rasterRijen: rijen,
    resetBord,
    startSlepen,
    vakjes,
  }
}
