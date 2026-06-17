import { computed, ref } from 'vue'
import type { VoedselbosItem } from '../types/spel'

type BordOpties = {
  standaardItem: VoedselbosItem
  rasterGrootte?: number
  vakjeHoogte?: number
  vakjeBreedte?: number
}

export function useVoedselbosBord({
  standaardItem,
  rasterGrootte = 10,
  vakjeHoogte = 36,
  vakjeBreedte = 72,
}: BordOpties) {
  const geselecteerdItem = ref(standaardItem)
  const gesleeptItem = ref<VoedselbosItem | null>(null)
  const cellen = ref<(VoedselbosItem | null)[]>(Array(rasterGrootte * rasterGrootte).fill(null))

  const vakjes = computed(() =>
    cellen.value.map((item, index) => {
      const rij = Math.floor(index / rasterGrootte)
      const kolom = index % rasterGrootte

      return {
        item,
        kolom,
        index,
        rij,
        x: (kolom - rij) * (vakjeBreedte / 2),
        y: (kolom + rij) * (vakjeHoogte / 2),
      }
    }),
  )

  const gevuldeVakjes = computed(() => vakjes.value.filter((vakje) => vakje.item))
  const bordBreedte = computed(() => (rasterGrootte + rasterGrootte) * (vakjeBreedte / 2) + vakjeBreedte)
  const bordHoogte = computed(() => (rasterGrootte + rasterGrootte) * (vakjeHoogte / 2) + 90)
  const bordVerschuiving = computed(() => (rasterGrootte - 1) * (vakjeBreedte / 2) + vakjeBreedte / 2)

  function plaatsItem(index: number, item = geselecteerdItem.value) {
    cellen.value[index] = item
  }

  function maakVakjeLeeg(index: number) {
    cellen.value[index] = null
  }

  function resetBord() {
    cellen.value = Array(rasterGrootte * rasterGrootte).fill(null)
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
    bordBreedte,
    bordHoogte,
    bordVerschuiving,
    geselecteerdItem,
    gevuldeVakjes,
    laatItemLos,
    maakVakjeLeeg,
    plaatsItem,
    rasterGrootte,
    resetBord,
    startSlepen,
    vakjes,
  }
}
