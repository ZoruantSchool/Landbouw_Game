import { computed, ref } from 'vue'
import type { TerreinSoort, VoedselbosItem } from '../types/spel'

type BordOpties = {
  standaardItem: VoedselbosItem
  rasterKolommen?: number
  rasterRijen?: number
}

export function useVoedselbosBord({
  standaardItem,
  rasterKolommen = 16,
  rasterRijen = 14,
}: BordOpties) {
  const geselecteerdItem = ref(standaardItem)
  const gesleeptItem = ref<VoedselbosItem | null>(null)
  const cellen = ref<(VoedselbosItem | null)[]>(Array(rasterKolommen * rasterRijen).fill(null))

  function bepaalTerrein(rij: number, kolom: number): TerreinSoort {
    if (rij === rasterRijen - 1) {
      return 'schaduw'
    }

    if ((kolom === 13 || kolom === 14) && rij >= 2 && rij <= 4) {
      return 'water'
    }

    if (kolom === 13 && rij === 5) {
      return 'water'
    }

    if ((kolom === 1 && rij >= 4 && rij <= 5) || (kolom === 2 && rij === 4)) {
      return 'schaduw'
    }

    const heuvelVakjes =
      (rij === 1 && kolom >= 3 && kolom <= 9) ||
      (rij === 2 && kolom >= 2 && kolom <= 10) ||
      (rij === 3 && kolom >= 2 && kolom <= 11) ||
      (rij === 4 && kolom >= 3 && kolom <= 11) ||
      (rij === 5 && kolom >= 4 && kolom <= 9)

    return heuvelVakjes ? 'heuvel' : 'grasland'
  }

  const vakjes = computed(() =>
    cellen.value.map((item, index) => {
      const rij = Math.floor(index / rasterKolommen)
      const kolom = index % rasterKolommen

      return {
        item,
        kolom,
        index,
        rij,
        terrein: bepaalTerrein(rij, kolom),
      }
    }),
  )

  function plaatsItem(index: number, item = geselecteerdItem.value) {
    cellen.value[index] = item
  }

  function maakVakjeLeeg(index: number) {
    cellen.value[index] = null
  }

  function resetBord() {
    cellen.value = Array(rasterKolommen * rasterRijen).fill(null)
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
    laatItemLos,
    maakVakjeLeeg,
    plaatsItem,
    rasterKolommen,
    rasterRijen,
    resetBord,
    startSlepen,
    vakjes,
  }
}
