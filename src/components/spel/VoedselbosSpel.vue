<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { gerechten } from '../../data/voedselbosData'
import { planten, standaardVoedselbosItem } from '../../data/planten'
import { levels, vindLevel } from '../../data/levels'
import type { SpelScherm, TerreinSoort, VoedselbosPlaatsing } from '../../types/spel'
import { useVoedselbosBord } from '../../composables/useVoedselbosBord'
import studiestapLogo from '../../assets/studiestap-logo.svg'
import tutorialScarecrow from '../../assets/tutorial-scarecrow.png'
import ItemPaneel from './ItemPaneel.vue'
import VoedselbosBord from './VoedselbosBord.vue'
import GerechtenScherm from './schermen/GerechtenScherm.vue'
import LevelEindeScherm from './schermen/LevelEindeScherm.vue'
import LevelKeuzeScherm from './schermen/LevelKeuzeScherm.vue'
import StartScherm from './schermen/StartScherm.vue'
import IntroductieScherm from './schermen/IntroductieScherm.vue'
import LevelDrieUitlegScherm from './schermen/LevelDrieUitlegScherm.vue'
import AllePlantenScherm from './schermen/AllePlantenScherm.vue'
import HoeWerktHetScherm from './schermen/HoeWerktHetScherm.vue'

const huidigScherm = ref<SpelScherm>('start')
const vorigSchermVoorPlanten = ref<SpelScherm>('levelKeuze')
const vorigSchermVoorUitleg = ref<SpelScherm>('start')
const informatiePlantId = ref<string>()
const gekozenLevel = ref(1)
const voltooideLevels = ref<number[]>([])
const hoogsteVoltooideLevel = computed(() => voltooideLevels.value.reduce((hoogste, level) => Math.max(hoogste, level), 0))
const tutorialStap = ref(-1)
const tutorialComboGetoond = ref(false)
const levelScores = ref<Record<number, number>>({})
const levelPercentages = ref<Record<number, number>>({})
const snelleHandenBehaald = ref(false)
const levelStartTijd = ref<number | null>(null)
const totaleScore = computed(() => Object.values(levelScores.value).reduce((totaal, score) => totaal + score, 0))
const levelSterren = computed(() =>
  Object.fromEntries(
    Object.entries(levelPercentages.value).map(([level, percentage]) => [
      level,
      percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1,
    ]),
  ),
)
const actiefLevel = computed(() => vindLevel(gekozenLevel.value))
const plantenPerId = computed(() => new Map(planten.map((plant) => [plant.id, plant])))
const actieveItems = computed(() =>
  actiefLevel.value.plantIds
    .map((id) => plantenPerId.value.get(id))
    .map((item) => (
      actiefLevel.value.nummer === 1 && item?.id === 'elstarboom'
        ? { ...item, naam: 'Walnootboom' }
        : item
    ))
    .filter((item): item is NonNullable<typeof item> => Boolean(item)),
)
const doelAantal = computed(() => actieveItems.value.reduce((totaal, item) => totaal + (item.aantal ?? 1), 0))
const alleTerreinen: { id: TerreinSoort; kleur: string; naam: string }[] = [
  { id: 'grasland', kleur: '#3e7540', naam: 'Grasland' },
  { id: 'water', kleur: '#397887', naam: 'Water' },
  { id: 'heuvel', kleur: '#686d5f', naam: 'Heuvel' },
  { id: 'schaduw', kleur: '#2d4824', naam: 'Schaduw' },
  { id: 'oever', kleur: '#819452', naam: 'Oever' },
  { id: 'akker', kleur: '#725f35', naam: 'Akker' },
]
const terreinen = computed(() => {
  const gebruikteTerreinen = new Set(actiefLevel.value.terreinKaart.flat())
  return alleTerreinen.filter((terrein) => gebruikteTerreinen.has(terrein.id))
})
const {
  geselecteerdItem,
  laatItemLos,
  maakVakjeLeeg,
  plaatsItem,
  plaatsingen,
  rasterKolommen,
  rasterRijen,
  resetBord,
  startSlepen,
  vakjes,
} = useVoedselbosBord({
  standaardItem: standaardVoedselbosItem,
  terreinKaart: () => actiefLevel.value.terreinKaart,
})

const geplaatstAantal = computed(() => plaatsingen.value.length)
const bezetteVakjes = computed(() => vakjes.value.filter((vakje) => vakje.item).length)
const vrijeVakjes = computed(() => vakjes.value.length - bezetteVakjes.value)
const resterendAantal = computed(() => Math.max(0, doelAantal.value - geplaatstAantal.value))
const voortgangGraden = computed(() => `${(geplaatstAantal.value / doelAantal.value) * 360}deg`)
const scoreResultaat = computed(() => berekenLevelDrieScore(plaatsingen.value))
const kanAfronden = computed(() => geplaatstAantal.value >= doelAantal.value)
const totaleOpbrengst = computed(() =>
  Math.round(plaatsingen.value.reduce((totaal, plaatsing) => totaal + berekenPlaatsingOpbrengst(plaatsing), 0) * 10) / 10,
)
const geschikteTerreinen = computed(() => geselecteerdItem.value.correctTerreinen ?? [])
const isLevelEen = computed(() => actiefLevel.value.nummer === 1)
const vergrendeldeItemIds = computed(() => {
  if (!isLevelEen.value || tutorialStap.value < 0 || tutorialStap.value >= 6) {
    return []
  }

  const toegestaan = tutorialStap.value === 5 ? 'witte_klaver' : 'elstarboom'
  return actieveItems.value
    .map((item) => item.id ?? item.naam)
    .filter((id) => id !== toegestaan)
})
const tutorialInfo = computed(() => {
  const stappen = [
    {
      label: '',
      titel: 'Wat is een voedselbos?',
      tekst: 'Een voedselbos is een tuin met lagen - bomen, struiken en kruiden die elkaar helpen.',
      extra: 'Jij plaatst de planten op het grid. Hoe beter je kiest, hoe hoger je score en hoe rijker het gerecht.',
      knop: 'Beginnen ->',
      fullscreen: true,
    },
    {
      label: '1/8',
      titel: 'Elk vakje heeft een kleur. Die kleur = het terrein.',
      tekst: 'Grasland = lichtgroen. Oever = donkergroen. Water = blauw - niet speelbaar.',
      knop: 'Volgende',
    },
    {
      label: '2/8',
      titel: 'Klik op een plant links om hem te selecteren.',
      tekst: 'De Walnootboom staat al voor je geselecteerd. Andere planten zijn nog vergrendeld.',
      knop: 'Volgende',
    },
    {
      label: '3/8',
      titel: "Klik op 'Planten' rechtsboven voor info over elke plant.",
      tekst: 'Wetenschappelijke naam, terrein, eigenschappen en beste combinaties.',
      knop: 'Volgende',
    },
    {
      label: '4/8',
      titel: 'De Walnootboom is 2x2 - hij bezet 4 vakjes tegelijk.',
      tekst: 'Klik op een vakje om hem neer te zetten. Hij past alleen op grasland.',
      knop: '',
    },
    {
      label: '5/8',
      titel: 'Goed! Walnootboom op grasland = correct terrein.',
      tekst: 'Fout terrein = 0 punten. Correct terrein = 1 of 2 punten.',
      knop: 'Volgende',
    },
    {
      label: '6/8',
      titel: 'De vakjes rondom de Walnootboom = invloedszone.',
      tekst: 'Witte Klaver hier plaatsen trekt bestuivers aan en geeft 2 punten. Buiten de zone = 1 punt.',
      knop: 'Volgende',
    },
    {
      label: '7/8',
      titel: 'Bestuiverscombo - Walnootboom + Witte Klaver op grasland',
      tekst: 'Witte Klaver trekt bijen en hommels aan die ook de appelbloesem bezoeken. Dit geeft +3 bonuspunten op het eindscherm.',
      knop: 'Begrepen',
    },
    {
      label: '8/8',
      titel: 'Correct terrein + nabijheid voldaan = 2 punten',
      tekst: 'Alleen correct terrein = 1 punt. Fout terrein = 0 punten. Combo’s geven bovendien bonuspunten bovenop.',
      knop: 'Begrepen, speel verder',
    },
  ]

  return stappen[tutorialStap.value]
})
const gemarkeerdeItemIds = computed(() => {
  if (!isLevelEen.value || tutorialStap.value < 0) return []
  if ([2, 4, 5, 6].includes(tutorialStap.value)) return ['elstarboom']
  if (tutorialStap.value === 7) return ['elstarboom', 'witte_klaver']
  if (tutorialStap.value === 8) return actiefLevel.value.plantIds
  return []
})
const gemarkeerdeTerreinen = computed(() => {
  if (!isLevelEen.value || tutorialStap.value < 0) return []
  if (tutorialStap.value === 1) return ['grasland', 'oever', 'water']
  if (tutorialStap.value === 4) return ['grasland']
  return []
})
const elstarPlaatsingen = computed(() => plaatsingenVan('elstarboom'))
const gemarkeerdePlaatsingIds = computed(() => {
  if (!isLevelEen.value || tutorialStap.value < 0) return []
  if ([5, 6].includes(tutorialStap.value)) return elstarPlaatsingen.value.map((plaatsing) => plaatsing.id)
  if (tutorialStap.value === 7) {
    return plaatsingen.value
      .filter((plaatsing) => ['elstarboom', 'witte_klaver'].includes(itemId(plaatsing)))
      .map((plaatsing) => plaatsing.id)
  }
  return []
})
const gemarkeerdeVakjes = computed(() => {
  if (!isLevelEen.value || tutorialStap.value < 0) return []

  if (tutorialStap.value === 1) {
    return vakjes.value.map((vakje) => vakje.index)
  }

  if (tutorialStap.value === 4) {
    return vakjes.value
      .filter((vakje) => vakje.terrein === 'grasland' && !vakje.item)
      .map((vakje) => vakje.index)
  }

  if ([6, 7].includes(tutorialStap.value)) {
    const indices = new Set<number>()
    elstarPlaatsingen.value.forEach((plaatsing) => {
      plaatsing.vakjes.forEach((index) => {
        const { rij, kolom } = coordinaten(index)
        for (let rijOffset = -1; rijOffset <= 1; rijOffset += 1) {
          for (let kolomOffset = -1; kolomOffset <= 1; kolomOffset += 1) {
            const doelRij = rij + rijOffset
            const doelKolom = kolom + kolomOffset
            const doelIndex = doelRij * rasterKolommen.value + doelKolom
            if (
              doelRij >= 0
              && doelKolom >= 0
              && doelRij < rasterRijen.value
              && doelKolom < rasterKolommen.value
              && !plaatsing.vakjes.includes(doelIndex)
            ) {
              indices.add(doelIndex)
            }
          }
        }
      })
    })
    return [...indices]
  }

  return []
})
const plaatsingEffecten = computed<Record<number, {
  status: 'positief' | 'neutraal' | 'negatief'
  tekst: string
}>>(() =>
  Object.fromEntries(plaatsingen.value.map((plaatsing) => {
    const correctTerrein = heeftCorrectTerrein(plaatsing)
    const gunstigeBuren = voldoetAanNabijheid(plaatsing)
    const naam = plantNaam(plaatsing.item)
    const status: 'positief' | 'neutraal' | 'negatief' = !correctTerrein
      ? 'negatief'
      : gunstigeBuren ? 'positief' : 'neutraal'
    const tekst = !correctTerrein
      ? `Negatief: ${naam} staat niet op geschikt terrein.`
      : gunstigeBuren
        ? `Positief: ${naam} staat goed en heeft een gunstige omgeving.`
        : `Nog geen positief planteffect: plaats een passende buurplant dichtbij.`

    return [plaatsing.id, { status, tekst }]
  })),
)

function itemId(plaatsing: VoedselbosPlaatsing) {
  return plaatsing.item.id ?? plaatsing.item.naam
}

function plantNaam(item: { id?: string; naam: string }) {
  if (actiefLevel.value.nummer === 1 && item.id === 'elstarboom') {
    return 'Walnootboom'
  }

  return planten.find((plant) => plant.id === item.id)?.naam ?? item.naam
}

function vakjeTerrein(index: number) {
  return vakjes.value[index]?.terrein
}

function heeftCorrectTerrein(plaatsing: VoedselbosPlaatsing) {
  const correctTerreinen = plaatsing.item.correctTerreinen

  if (!correctTerreinen?.length) {
    return true
  }

  if (itemId(plaatsing) === 'walnootboom') {
    const middenIndex = plaatsing.vakjes[Math.floor(plaatsing.vakjes.length / 2)]
    return middenIndex !== undefined && correctTerreinen.includes(vakjeTerrein(middenIndex) as TerreinSoort)
  }

  return plaatsing.vakjes.every((index) => correctTerreinen.includes(vakjeTerrein(index) as TerreinSoort))
}

function plaatsingenVan(...ids: string[]) {
  return plaatsingen.value.filter((plaatsing) => ids.includes(itemId(plaatsing)))
}

function coordinaten(index: number) {
  return {
    kolom: index % rasterKolommen.value,
    rij: Math.floor(index / rasterKolommen.value),
  }
}

function zijnAangrenzend(eerste: VoedselbosPlaatsing, tweede: VoedselbosPlaatsing) {
  return eerste.vakjes.some((eersteIndex) => {
    const a = coordinaten(eersteIndex)

    return tweede.vakjes.some((tweedeIndex) => {
      const b = coordinaten(tweedeIndex)
      return Math.max(Math.abs(a.rij - b.rij), Math.abs(a.kolom - b.kolom)) === 1
    })
  })
}

function staatInInvloedszone(kruid: VoedselbosPlaatsing, bron: VoedselbosPlaatsing) {
  return kruid.vakjes.some((kruidIndex) => {
    const kruidCoordinaat = coordinaten(kruidIndex)

    return bron.vakjes.some((bronIndex) => {
      const bronCoordinaat = coordinaten(bronIndex)
      return (
        Math.max(
          Math.abs(kruidCoordinaat.rij - bronCoordinaat.rij),
          Math.abs(kruidCoordinaat.kolom - bronCoordinaat.kolom),
        ) === 1
      )
    })
  })
}

function aangrenzendOpTerrein(eersteId: string, tweedeId: string, terrein: TerreinSoort) {
  return plaatsingenVan(eersteId).some((eerste) =>
    plaatsingenVan(tweedeId).some((tweede) => {
      const staatOpTerrein = [...eerste.vakjes, ...tweede.vakjes].some((index) => vakjeTerrein(index) === terrein)
      return staatOpTerrein && zijnAangrenzend(eerste, tweede)
    }),
  )
}

function invloedszoneCombo(kruidId: string, bronIds: string[]) {
  return plaatsingenVan(kruidId).some((kruid) =>
    plaatsingenVan(...bronIds).some((bron) => staatInInvloedszone(kruid, bron)),
  )
}

function invloedszoneVakjes(bron: VoedselbosPlaatsing) {
  const indices = new Set<number>()

  bron.vakjes.forEach((index) => {
    const { rij, kolom } = coordinaten(index)

    for (let rijOffset = -1; rijOffset <= 1; rijOffset += 1) {
      for (let kolomOffset = -1; kolomOffset <= 1; kolomOffset += 1) {
        const doelRij = rij + rijOffset
        const doelKolom = kolom + kolomOffset
        const doelIndex = doelRij * rasterKolommen.value + doelKolom

        if (
          doelRij >= 0
          && doelKolom >= 0
          && doelRij < rasterRijen.value
          && doelKolom < rasterKolommen.value
          && !bron.vakjes.includes(doelIndex)
        ) {
          indices.add(doelIndex)
        }
      }
    }
  })

  return indices
}

function staatAangrenzendAanInvloedszone(plaatsing: VoedselbosPlaatsing, bron: VoedselbosPlaatsing) {
  const zone = invloedszoneVakjes(bron)

  return plaatsing.vakjes.some((index) => {
    const { rij, kolom } = coordinaten(index)

    for (let rijOffset = -1; rijOffset <= 1; rijOffset += 1) {
      for (let kolomOffset = -1; kolomOffset <= 1; kolomOffset += 1) {
        const doelIndex = (rij + rijOffset) * rasterKolommen.value + (kolom + kolomOffset)
        if (zone.has(doelIndex)) return true
      }
    }

    return false
  })
}

function voldoetAanNabijheid(plaatsing: VoedselbosPlaatsing) {
  const id = itemId(plaatsing)

  if (id === 'daslook') {
    return plaatsingenVan('walnootboom', 'hazelaar', 'wilde_appels').some((bron) => staatInInvloedszone(plaatsing, bron))
  }

  if (id === 'witte_klaver') {
    return plaatsingenVan('elstarboom').some((bron) => staatInInvloedszone(plaatsing, bron))
  }

  if (id === 'bosaardbei') {
    return plaatsingenVan('vlier').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'vlier') {
    return plaatsingenVan('wilde_aardbeien', 'bosaardbei').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'wilde_aardbeien') {
    return plaatsingenVan('vlier').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'wilde_knoflook') {
    return plaatsingenVan('brandnetel').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'brandnetel') {
    return plaatsingenVan('wilde_knoflook').some((ander) => zijnAangrenzend(plaatsing, ander))
  }

  if (id === 'munt') {
    return plaatsingenVan('kersenboom').some((bron) => staatInInvloedszone(plaatsing, bron))
  }

  if (id === 'klaver') {
    return plaatsingenVan('kersenboom').some((bron) => staatAangrenzendAanInvloedszone(plaatsing, bron))
  }

  return true
}

function berekenBasisPunten(plaatsing: VoedselbosPlaatsing) {
  if (!heeftCorrectTerrein(plaatsing)) {
    return 0
  }

  return voldoetAanNabijheid(plaatsing) ? 2 : 1
}

function berekenPlaatsingOpbrengst(plaatsing: VoedselbosPlaatsing) {
  const opbrengst = plaatsing.item.opbrengst
  if (!opbrengst) return 0
  if (!heeftCorrectTerrein(plaatsing)) return opbrengst.minimum
  if (voldoetAanNabijheid(plaatsing)) return opbrengst.maximum
  return Math.round(((opbrengst.minimum + opbrengst.maximum) / 2) * 10) / 10
}

function plaatsingHandtekening(id: string, indices: number[]) {
  return `${id}:${[...indices].sort((a, b) => a - b).join(',')}`
}

function isOptimalePlaatsing(huidigePlaatsingen: VoedselbosPlaatsing[]) {
  const verwacht = actiefLevel.value.optimalePlaatsing.map(({ plantId, rij, kolom, breedte, hoogte }) => {
    const indices: number[] = []
    for (let rijOffset = 0; rijOffset < hoogte; rijOffset += 1) {
      for (let kolomOffset = 0; kolomOffset < breedte; kolomOffset += 1) {
        indices.push((rij - 1 + rijOffset) * rasterKolommen.value + kolom - 1 + kolomOffset)
      }
    }
    return plaatsingHandtekening(plantId, indices)
  }).sort()
  const werkelijk = huidigePlaatsingen
    .map((plaatsing) => plaatsingHandtekening(itemId(plaatsing), plaatsing.vakjes))
    .sort()

  return verwacht.length === werkelijk.length && verwacht.every((waarde, index) => waarde === werkelijk[index])
}

function berekenLevelDrieScore(huidigePlaatsingen: VoedselbosPlaatsing[]) {
  const gebruiktOptimalePlaatsing = isOptimalePlaatsing(huidigePlaatsingen)
  const basisPunten = gebruiktOptimalePlaatsing && actiefLevel.value.nummer === 3
    ? 58
    : huidigePlaatsingen.reduce((totaal, plaatsing) => totaal + berekenBasisPunten(plaatsing), 0)
  const comboStatus = actiefLevel.value.combos.map((combo) => {
    const actief =
      (combo.id === 'bestuiverscombo' && invloedszoneCombo('witte_klaver', ['elstarboom'])) ||
      (combo.id === 'oevercombo' && aangrenzendOpTerrein('vlier', 'bosaardbei', 'oever')) ||
      (combo.id === 'lagencombo' && invloedszoneCombo('daslook', ['walnootboom', 'hazelaar'])) ||
      (combo.id === 'beekdalcombo' && aangrenzendOpTerrein('vlier', 'wilde_aardbeien', 'oever')) ||
      (combo.id === 'bosrandcombo' && invloedszoneCombo('daslook', ['wilde_appels'])) ||
      (combo.id === 'bodemcombo' && aangrenzendOpTerrein('wilde_knoflook', 'brandnetel', 'akker')) ||
      (combo.id === 'schaduwcombo' && invloedszoneCombo('munt', ['kersenboom'])) ||
      (combo.id === 'klaverbodemcombo' && plaatsingenVan('klaver').some((klaver) =>
        plaatsingenVan('kersenboom').some((bron) => staatAangrenzendAanInvloedszone(klaver, bron)),
      ))

    return {
      ...combo,
      actief: gebruiktOptimalePlaatsing || actief,
    }
  })
  const comboPunten = comboStatus.reduce((totaal, combo) => totaal + (combo.actief ? combo.bonus : 0), 0)
  const ruweScore = basisPunten + comboPunten
  const percentage = Math.round((ruweScore / actiefLevel.value.maximaleScore) * 100)
  const opbrengst = Math.round(
    huidigePlaatsingen.reduce((totaal, plaatsing) => totaal + berekenPlaatsingOpbrengst(plaatsing), 0) * 10,
  ) / 10
  const minimaleOpbrengst = Math.round(actieveItems.value.reduce(
    (totaal, item) => totaal + (item.aantal ?? 1) * (item.opbrengst?.minimum ?? 0),
    0,
  ) * 10) / 10
  const maximaleOpbrengst = Math.round(actieveItems.value.reduce(
    (totaal, item) => totaal + (item.aantal ?? 1) * (item.opbrengst?.maximum ?? 0),
    0,
  ) * 10) / 10

  return {
    basisPunten,
    comboPunten,
    combos: comboStatus,
    percentage,
    ruweScore,
    opbrengst,
    minimaleOpbrengst,
    maximaleOpbrengst,
  }
}

function plaatsItemMetTutorial(index: number) {
  if (isLevelEen.value && tutorialStap.value >= 0) {
    if (tutorialStap.value < 4 || tutorialStap.value === 5) {
      return
    }

    if (tutorialStap.value === 4 && (geselecteerdItem.value.id ?? '') !== 'elstarboom') {
      return
    }
  }

  const aantalVoor = plaatsingen.value.length
  plaatsItem(index)

  if (isLevelEen.value && tutorialStap.value === 4 && plaatsingen.value.length > aantalVoor) {
    tutorialStap.value = 5
    const klaver = actieveItems.value.find((item) => item.id === 'witte_klaver')
    if (klaver) geselecteerdItem.value = klaver
  }
}

function laatItemLosMetTutorial(index: number) {
  if (isLevelEen.value && tutorialStap.value >= 0) {
    if (tutorialStap.value < 4 || tutorialStap.value === 5) {
      return
    }

    if (tutorialStap.value === 4 && (geselecteerdItem.value.id ?? '') !== 'elstarboom') {
      return
    }
  }

  const aantalVoor = plaatsingen.value.length
  laatItemLos(index)

  if (isLevelEen.value && tutorialStap.value === 4 && plaatsingen.value.length > aantalVoor) {
    tutorialStap.value = 5
    const klaver = actieveItems.value.find((item) => item.id === 'witte_klaver')
    if (klaver) geselecteerdItem.value = klaver
  }
}

function volgendeTutorialStap() {
  if (!isLevelEen.value || tutorialStap.value < 0) {
    return
  }

  if (tutorialStap.value === 8) {
    tutorialStap.value = -1
    return
  }

  if (tutorialStap.value !== 4) {
    tutorialStap.value += 1
  }
}

function skipTutorial() {
  tutorialStap.value = -1
}

watch(scoreResultaat, (resultaat) => {
  if (!isLevelEen.value || tutorialComboGetoond.value || tutorialStap.value < 6) {
    return
  }

  if (resultaat.combos.some((combo) => combo.id === 'bestuiverscombo' && combo.actief)) {
    tutorialComboGetoond.value = true
    tutorialStap.value = 7
  }
})

function openLevel(level: number) {
  const configuratie = levels.find((item) => item.nummer === level)
  if (!configuratie) {
    return
  }

  gekozenLevel.value = level
  geselecteerdItem.value = actieveItems.value[0] ?? standaardVoedselbosItem
  resetBord()
  tutorialStap.value = configuratie.nummer === 1 ? 0 : -1
  tutorialComboGetoond.value = false
  levelStartTijd.value = configuratie.heeftUitleg ? null : Date.now()
  huidigScherm.value = configuratie.heeftUitleg ? 'levelUitleg' : 'spel'
}

function startSpelVanuitUitleg() {
  levelStartTijd.value = Date.now()
  huidigScherm.value = 'spel'
}

function openPlantenInfo(vanaf: SpelScherm, plantId?: string) {
  vorigSchermVoorPlanten.value = vanaf
  informatiePlantId.value = plantId
  huidigScherm.value = 'plantenInfo'
}

function openHoeWerktHet(vanaf: SpelScherm) {
  vorigSchermVoorUitleg.value = vanaf
  huidigScherm.value = 'hoeWerktHet'
}

function openAllePlantenVanuitLevelKeuze() {
  openPlantenInfo('levelKeuze')
}

function sluitPlantenInfo() {
  huidigScherm.value = vorigSchermVoorPlanten.value
}

function rondLevelAf() {
  if (!kanAfronden.value) {
    return
  }

  if (!voltooideLevels.value.includes(gekozenLevel.value)) {
    voltooideLevels.value = [...voltooideLevels.value, gekozenLevel.value]
  }

  const resultaat = scoreResultaat.value
  const huidigeScore = levelScores.value[gekozenLevel.value] ?? 0
  levelScores.value = { ...levelScores.value, [gekozenLevel.value]: Math.max(huidigeScore, resultaat.ruweScore) }
  const huidigPercentage = levelPercentages.value[gekozenLevel.value] ?? 0
  levelPercentages.value = {
    ...levelPercentages.value,
    [gekozenLevel.value]: Math.max(huidigPercentage, resultaat.percentage),
  }

  if (levelStartTijd.value !== null && Date.now() - levelStartTijd.value < 30000) {
    snelleHandenBehaald.value = true
  }

  huidigScherm.value = 'einde'
}

function speelLevelOpnieuw() {
  resetBord()
  tutorialStap.value = gekozenLevel.value === 1 ? 0 : -1
  tutorialComboGetoond.value = false
  levelStartTijd.value = Date.now()
  huidigScherm.value = 'spel'
}

function openVolgendLevel() {
  const huidigIndex = levels.findIndex((level) => level.nummer === gekozenLevel.value)
  const volgendLevel = levels[huidigIndex + 1]
  if (!volgendLevel) {
    return
  }

  openLevel(volgendLevel.nummer)
}
</script>

<template>
  <StartScherm
    v-if="huidigScherm === 'start'"
    @start="huidigScherm = 'introductie'"
    @uitleg="openHoeWerktHet('start')"
  />

  <HoeWerktHetScherm
    v-else-if="huidigScherm === 'hoeWerktHet'"
    @sluiten="huidigScherm = vorigSchermVoorUitleg"
  />

  <IntroductieScherm
    v-else-if="huidigScherm === 'introductie'"
    @begin="huidigScherm = 'levelKeuze'"
    @terug="huidigScherm = 'start'"
  />

  <LevelKeuzeScherm
    v-else-if="huidigScherm === 'levelKeuze'"
    :levels="levels"
    :hoogste-voltooide-level="hoogsteVoltooideLevel"
    :voltooide-levels="voltooideLevels"
    :level-sterren="levelSterren"
    :totale-score="totaleScore"
    @open-gerechten="huidigScherm = 'gerechten'"
    @open-level="openLevel"
    @open-planten="openAllePlantenVanuitLevelKeuze"
    @terug="huidigScherm = 'start'"
  />

  <GerechtenScherm
    v-else-if="huidigScherm === 'gerechten'"
    :gerechten="gerechten"
    :hoogste-voltooide-level="hoogsteVoltooideLevel"
    :voltooide-levels="voltooideLevels"
    :totaal-levels="levels.length"
    :totale-score="totaleScore"
    :snelle-handen-behaald="snelleHandenBehaald"
    @levels="huidigScherm = 'levelKeuze'"
    @open-planten="openPlantenInfo('gerechten')"
  />

  <AllePlantenScherm
    v-else-if="huidigScherm === 'plantenInfo'"
    :plant-ids="vorigSchermVoorPlanten === 'spel' ? actiefLevel.plantIds : undefined"
    :start-plant-id="informatiePlantId"
    :terug-naar-level="vorigSchermVoorPlanten === 'spel'"
    @levels="huidigScherm = 'levelKeuze'"
    @open-gerechten="huidigScherm = 'gerechten'"
    @sluiten="sluitPlantenInfo"
  />

  <LevelDrieUitlegScherm
    v-else-if="huidigScherm === 'levelUitleg'"
    :level="actiefLevel"
    @start="startSpelVanuitUitleg"
    @terug="huidigScherm = 'levelKeuze'"
  />

  <LevelEindeScherm
    v-else-if="huidigScherm === 'einde'"
    :level="gekozenLevel"
    :level-config="actiefLevel"
    :terrein-kaart="actiefLevel.terreinKaart"
    :score-resultaat="scoreResultaat"
    @levels="huidigScherm = 'start'"
    @opnieuw="speelLevelOpnieuw"
    @volgend="openVolgendLevel"
  />

  <main v-else class="spel">
    <header class="spel-kop">
      <div class="kop-links">
        <button type="button" class="logo-knop" aria-label="Terug naar levels" @click="huidigScherm = 'levelKeuze'">
          <img :src="studiestapLogo" alt="Studie-Stap" />
        </button>
        <button type="button" class="terug-knop" @click="huidigScherm = 'levelKeuze'">← Terug</button>
      </div>

      <button type="button" class="level-label">Level {{ gekozenLevel }}</button>

      <div class="stats">
        <div>
          <span>Geplaatst</span>
          <strong>{{ geplaatstAantal }}/{{ doelAantal }}</strong>
        </div>
        <div>
          <span>Vakjes vrij</span>
          <strong>{{ vrijeVakjes }}</strong>
        </div>
        <div>
          <span>Opbrengst</span>
          <strong>{{ totaleOpbrengst }} kg</strong>
        </div>
      </div>

      <ul
        class="legenda"
        :class="{ 'tutorial-highlight': isLevelEen && tutorialStap === 1 }"
        aria-label="Terrein legenda"
      >
        <li v-for="terrein in terreinen" :key="terrein.id">
          <span :style="{ backgroundColor: terrein.kleur }"></span>{{ terrein.naam }}
        </li>
      </ul>

      <nav class="spel-tabs" aria-label="Spel tabbladen">
        <button type="button" @click="openHoeWerktHet('spel')">Uitleg</button>
        <button
          type="button"
          :class="{ 'tutorial-highlight': isLevelEen && tutorialStap === 3 }"
          @click="openPlantenInfo('spel')"
        >
          Planten
        </button>
      </nav>
    </header>

    <div class="spel-inhoud">
      <ItemPaneel
        :geselecteerd-item="geselecteerdItem"
        :gemarkeerde-item-ids="gemarkeerdeItemIds"
        :items="actieveItems"
        :plaatsingen="plaatsingen"
        :vergrendelde-item-ids="vergrendeldeItemIds"
        @open-info="openPlantenInfo('spel', $event.id)"
        @selecteer="geselecteerdItem = $event"
        @start-slepen="startSlepen"
      />

      <VoedselbosBord
        :effecten="plaatsingEffecten"
        :geselecteerd-item="geselecteerdItem"
        :gemarkeerde-plaatsing-ids="gemarkeerdePlaatsingIds"
        :gemarkeerde-terreinen="gemarkeerdeTerreinen"
        :gemarkeerde-vakjes="gemarkeerdeVakjes"
        :geschikte-terreinen="geschikteTerreinen"
        :plaatsingen="plaatsingen"
        :raster-kolommen="rasterKolommen"
        :raster-rijen="rasterRijen"
        :vakjes="vakjes"
        @laat-item-los="laatItemLosMetTutorial"
        @maak-vakje-leeg="maakVakjeLeeg"
        @plaats-item="plaatsItemMetTutorial"
      />

      <aside class="status-paneel">
        <section class="voortgang">
          <h2>Voortgang</h2>
          <div class="ring" :style="{ '--voortgang': voortgangGraden }">
            <strong>{{ geplaatstAantal }}</strong>
            <span>van {{ doelAantal }}</span>
          </div>
        </section>

        <section class="geselecteerd-kaart">
          <h2>Geselecteerd</h2>
          <div class="plant-kaart">
            <img
              v-if="geselecteerdItem.afbeelding"
              :src="geselecteerdItem.afbeelding"
              :alt="plantNaam(geselecteerdItem)"
            />
            <span v-else class="plant-fallback">{{ geselecteerdItem.icoon }}</span>
            <strong>{{ plantNaam(geselecteerdItem) }}</strong>
            <small>Laag: {{ geselecteerdItem.laag ?? 'Plantlaag' }}</small>
            <span>{{ geselecteerdItem.terrein }}</span>
            <span v-if="geselecteerdItem.opbrengst" class="opbrengst-regel">
              {{ geselecteerdItem.opbrengst.minimum }}–{{ geselecteerdItem.opbrengst.maximum }}
              {{ geselecteerdItem.opbrengst.eenheid }} opbrengst
            </span>
          </div>
        </section>

        <section class="tip-kaart">
          <h2>Wist je dat?</h2>
          <p>{{ geselecteerdItem.tip ?? geselecteerdItem.beschrijving }}</p>
        </section>

        <button type="button" class="klaar-knop" :disabled="!kanAfronden" @click="rondLevelAf">
          <strong>Klaar</strong>
          <span>{{ kanAfronden ? 'Bekijk resultaat' : `${resterendAantal} planten nog te plaatsen` }}</span>
        </button>
      </aside>
    </div>

    <div
      v-if="isLevelEen && tutorialInfo"
      class="tutorial-laag"
      :class="{ fullscreen: tutorialInfo.fullscreen, 'plaats-stap': tutorialStap === 4 }"
    >
      <div class="tutorial-scene">
        <img
          class="tutorial-mascotte"
          :src="tutorialScarecrow"
          alt=""
          aria-hidden="true"
        />
        <article class="tutorial-kaart">
          <small v-if="tutorialInfo.label">{{ tutorialInfo.label }}</small>
          <h2>{{ tutorialInfo.titel }}</h2>
          <p>{{ tutorialInfo.tekst }}</p>
          <p v-if="tutorialInfo.extra">{{ tutorialInfo.extra }}</p>
          <div v-if="tutorialStap === 1" class="tutorial-legenda">
            <span><i class="grasland"></i>Grasland</span>
            <span><i class="oever"></i>Oever</span>
            <span><i class="water"></i>Water</span>
          </div>
          <div v-if="tutorialStap === 8" class="punten-schema">
            <strong>Correct terrein + nabijheid voldaan = 2 punten</strong>
            <strong>Alleen correct terrein = 1 punt</strong>
            <strong>Fout terrein = 0 punten</strong>
          </div>
          <div class="tutorial-acties">
            <button
              v-if="tutorialInfo.knop"
              type="button"
              class="tutorial-volgende"
              @click="volgendeTutorialStap"
            >
              {{ tutorialInfo.knop }}
            </button>
            <button type="button" class="tutorial-skip" @click="skipTutorial">Skip Tutorial</button>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.spel {
  display: grid;
  grid-template-rows: 84px minmax(0, 1fr);
  min-height: 100vh;
  background: #061708;
  color: #dce9cf;
  overflow-x: hidden;
}

.spel-kop {
  display: grid;
  grid-template-columns: 230px 145px 290px 1fr 200px;
  align-items: center;
  gap: 20px;
  padding: 0 28px 0 22px;
  border-bottom: 1px solid #2d6c2b;
  background: #061708;
}

.kop-links {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.logo-knop {
  width: fit-content;
  border: 0;
  background: transparent;
  padding: 0;
}

.logo-knop img {
  display: block;
  width: 92px;
  height: auto;
}

.terug-knop {
  min-width: 88px;
  height: 36px;
  border: 1px solid #2e6833;
  border-radius: 7px;
  background: #123417;
  color: #86c978;
  padding: 0 13px;
  font-size: 12px;
  font-weight: 700;
}

.terug-knop:hover,
.terug-knop:focus-visible {
  border-color: #65bc4d;
  background: #1a4820;
  color: #e1f2d7;
}

.level-label,
.spel-tabs button {
  height: 46px;
  border: 2px solid #285b24;
  border-radius: 8px;
  background: #143910;
  color: #65bd48;
  font-weight: 700;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 24px;
}

.stats div {
  display: grid;
  gap: 4px;
}

.stats span,
.voortgang h2,
.geselecteerd-kaart h2 {
  color: #315d31;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.stats strong {
  color: #e7ddaf;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 27px;
  line-height: 1;
}

.legenda {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 0;
  list-style: none;
}

.legenda.tutorial-highlight {
  border: 3px dashed #f2df73;
  border-radius: 8px;
  background: rgba(13, 49, 18, .96);
  box-shadow: 0 0 0 4px rgba(242, 223, 115, .24), 0 0 26px rgba(242, 223, 115, .72);
  padding: 10px 15px;
  animation: tutorial-pulse 1.25s ease-in-out infinite;
}

.legenda li {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #71916e;
  font-size: 10px;
  font-weight: 600;
}

.legenda li span {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: 2px;
}

.spel-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.spel-tabs button {
  color: #8bc66e;
}

.spel-tabs button.tutorial-highlight {
  border-color: #f2df73;
  background: #1d4d25;
  box-shadow: 0 0 0 4px rgba(242, 223, 115, .22), 0 0 24px rgba(242, 223, 115, .62);
  color: #f5e9a6;
  animation: tutorial-pulse 1.25s ease-in-out infinite;
}

.spel-tabs .actief {
  color: #4f8145;
}

.spel-inhoud {
  display: grid;
  grid-template-columns: 270px minmax(520px, 1fr) 270px;
  min-height: 0;
}

.status-paneel {
  display: grid;
  min-width: 270px;
  align-content: start;
  gap: 26px;
  padding: 28px 22px;
  border-left: 1px solid #21482a;
  background: #071f0d;
}

.voortgang {
  display: grid;
  justify-items: center;
  gap: 22px;
  min-height: 285px;
}

.voortgang h2,
.geselecteerd-kaart h2 {
  justify-self: start;
  color: #71ad68;
  font-size: 18px;
  font-weight: 800;
}

.ring {
  --voortgang: 0deg;
  display: grid;
  width: 150px;
  height: 150px;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #071f0d 54%, transparent 56%),
    conic-gradient(#4b9d3b var(--voortgang), #173917 0);
}

.ring strong {
  color: #e7ddaf;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 40px;
  line-height: 1;
}

.ring span {
  margin-top: 26px;
  color: #6f996b;
  font-size: 13px;
  font-weight: 700;
}

.geselecteerd-kaart,
.tip-kaart {
  display: grid;
  gap: 10px;
}

.plant-kaart {
  display: grid;
  min-height: 122px;
  justify-items: center;
  align-content: center;
  border: 1px solid #d0a812;
  border-radius: 8px;
  background: #0f2b15;
  padding: 12px;
  text-align: center;
}

.plant-kaart img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.plant-fallback {
  font-size: 36px;
  line-height: 1;
}

.plant-kaart strong {
  margin-top: 4px;
  color: #e7ddaf;
  font-size: 15px;
}

.plant-kaart small {
  margin-top: 4px;
  color: #72be50;
  font-size: 9px;
}

.plant-kaart span {
  margin-top: 6px;
  color: #3e713b;
  font-size: 8px;
}

.tip-kaart {
  border: 1px solid #3d4511;
  border-radius: 8px;
  background: #1b2c0e;
  padding: 14px;
}

.tip-kaart h2 {
  color: #d0a812;
  font-size: 10px;
}

.tip-kaart p {
  color: #746b24;
  font-size: 8px;
  line-height: 1.35;
}

.klaar-knop {
  display: grid;
  min-height: 52px;
  align-self: end;
  margin-top: 74px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #4c963e;
  color: #ffffff;
}

.klaar-knop strong {
  font-size: 15px;
}

.klaar-knop span {
  color: #b2d8a4;
  font-size: 8px;
}

.klaar-knop:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.tutorial-laag {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  background: rgba(2, 7, 4, .24);
  pointer-events: none;
}

.tutorial-laag.fullscreen {
  background: rgba(2, 7, 4, .68);
}

.tutorial-laag.plaats-stap {
  place-items: end center;
  background: rgba(2, 7, 4, .14);
  padding: 0 292px 24px 220px;
}

@keyframes tutorial-pulse {
  0%, 100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.18);
  }
}

.tutorial-scene {
  display: grid;
  grid-template-columns: minmax(180px, 260px) minmax(0, 520px);
  align-items: end;
  gap: 0;
  pointer-events: none;
}

.tutorial-laag.fullscreen .tutorial-scene {
  grid-template-columns: minmax(190px, 280px) minmax(0, 520px);
  transform: translateX(-2vw);
}

.tutorial-laag.plaats-stap .tutorial-scene {
  grid-template-columns: 124px minmax(0, 360px);
  justify-self: end;
  align-items: end;
}

.tutorial-kaart {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(520px, calc(100vw - 36px));
  gap: 18px;
  border-radius: 10px;
  background: #133d1a;
  box-shadow: 0 18px 36px rgba(0, 0, 0, .34);
  color: #e9e1bd;
  padding: 42px 38px 34px;
  pointer-events: auto;
}

.tutorial-kaart::before {
  position: absolute;
  left: -42px;
  bottom: 58px;
  width: 56px;
  height: 38px;
  background: #133d1a;
  clip-path: polygon(100% 0, 0 58%, 100% 100%);
  content: '';
  filter: drop-shadow(-6px 8px 7px rgba(0, 0, 0, .2));
}

.tutorial-laag:not(.fullscreen) .tutorial-kaart {
  transform: translateY(-6vh);
}

.tutorial-laag.plaats-stap .tutorial-kaart {
  width: min(360px, calc(100vw - 36px));
  gap: 12px;
  margin-left: 0;
  padding: 22px 24px;
  transform: none;
}

.tutorial-laag.plaats-stap .tutorial-kaart::before {
  left: -28px;
  bottom: 32px;
  width: 36px;
  height: 25px;
}

.tutorial-laag.plaats-stap .tutorial-kaart h2 {
  font-size: 21px;
}

.tutorial-laag.plaats-stap .tutorial-kaart p {
  font-size: 13px;
}

.tutorial-laag.plaats-stap .tutorial-acties {
  grid-template-columns: 1fr;
  margin-top: 4px;
}

.tutorial-laag.plaats-stap .tutorial-acties button {
  min-height: 42px;
}

.tutorial-kaart small {
  color: #e8d188;
  font-size: 12px;
  font-weight: 800;
}

.tutorial-kaart h2 {
  max-width: 460px;
  color: #eee3c1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(23px, 2.4vw, 30px);
  line-height: 1.12;
}

.tutorial-kaart p {
  max-width: 430px;
  color: #85a882;
  font-size: 15px;
  line-height: 1.45;
}

.tutorial-acties {
  display: grid;
  grid-template-columns: minmax(0, 200px) minmax(0, 200px);
  gap: 18px;
  margin-top: 16px;
}

.tutorial-acties button {
  min-height: 54px;
  border-radius: 8px;
  font-weight: 700;
}

.tutorial-volgende {
  border: 0;
  background: #dda915;
  color: #201b05;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
}

.tutorial-skip {
  border: 1px solid #2f6632;
  background: transparent;
  color: #74bd59;
}

.tutorial-mascotte {
  z-index: 1;
  justify-self: end;
  width: min(260px, 24vw);
  max-height: 54vh;
  object-fit: contain;
  object-position: bottom;
  pointer-events: none;
  transform: translate(28px, 16px);
}

.tutorial-laag.fullscreen .tutorial-mascotte {
  width: min(280px, 25vw);
}

.tutorial-laag.plaats-stap .tutorial-mascotte {
  width: 150px;
  max-height: 26vh;
  transform: translate(18px, 16px);
}

.tutorial-legenda,
.punten-schema {
  display: grid;
  gap: 9px;
  border: 1px solid #2f6533;
  border-radius: 8px;
  background: #0d2c13;
  padding: 12px 14px;
}

.tutorial-legenda {
  grid-template-columns: repeat(3, max-content);
}

.tutorial-legenda span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #cbd6b8;
  font-size: 12px;
  font-weight: 700;
}

.tutorial-legenda i {
  width: 13px;
  height: 13px;
  border-radius: 2px;
}

.tutorial-legenda .grasland {
  background: #79cf7c;
}

.tutorial-legenda .oever {
  background: #d5e78a;
}

.tutorial-legenda .water {
  background: #45a8d1;
}

.punten-schema strong {
  color: #eee3c1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.25;
}

@media (max-width: 1000px) {
  .spel-kop {
    grid-template-columns: minmax(170px, 1fr) 120px 1fr;
    height: auto;
    gap: 12px;
    padding: 12px;
  }

  .legenda,
  .spel-tabs {
    grid-column: 1 / -1;
  }

  .spel-inhoud {
    grid-template-columns: 270px minmax(460px, 1fr);
  }

  .status-paneel {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-width: 0;
  }

  .voortgang {
    min-height: 0;
  }

  .klaar-knop {
    margin-top: 0;
  }

  .tutorial-mascotte {
    width: 180px;
  }

  .tutorial-laag.plaats-stap {
    padding-right: 18px;
    padding-left: 18px;
  }

  .tutorial-scene,
  .tutorial-laag.fullscreen .tutorial-scene {
    grid-template-columns: minmax(110px, 170px) minmax(0, 1fr);
    width: calc(100vw - 28px);
    transform: none;
  }

  .tutorial-laag.plaats-stap .tutorial-scene {
    grid-template-columns: 98px minmax(0, 1fr);
    width: min(520px, calc(100vw - 36px));
  }

  .tutorial-kaart::before {
    left: -28px;
    width: 38px;
    height: 28px;
  }
}

@media (max-width: 700px) {
  .spel {
    grid-template-rows: auto minmax(0, 1fr);
  }

  .spel-inhoud {
    grid-template-columns: 1fr;
  }

  .status-paneel {
    grid-template-columns: 1fr;
  }

  .tutorial-laag:not(.fullscreen) .tutorial-kaart {
    margin-left: 0;
  }

  .tutorial-scene,
  .tutorial-laag.fullscreen .tutorial-scene,
  .tutorial-laag.plaats-stap .tutorial-scene {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .tutorial-mascotte {
    display: block;
    width: 150px;
    max-height: 24vh;
    transform: translateY(22px);
  }

  .tutorial-laag.plaats-stap .tutorial-mascotte {
    width: 118px;
    transform: translateY(18px);
  }

  .tutorial-kaart::before {
    left: 46%;
    bottom: auto;
    top: -30px;
    width: 42px;
    height: 36px;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
  }

  .tutorial-acties,
  .tutorial-legenda {
    grid-template-columns: 1fr;
  }
}
</style>
