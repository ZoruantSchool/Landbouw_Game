import type { VoedselbosItem } from '../types/spel'
import brandnetelAfbeelding from '../assets/plant-brandnetel.png'
import daslookAfbeelding from '../assets/plant-daslook.png'
import hazelaarAfbeelding from '../assets/plant-hazelaar.png'
import walnootboomAfbeelding from '../assets/plant-walnootboom.png'
import wildeAardbeienAfbeelding from '../assets/plant-wilde-aardbeien.png'
import wildeAppelAfbeelding from '../assets/plant-wilde-appel.png'
import wildeKnoflookAfbeelding from '../assets/plant-wilde-knoflook.png'

export const aantalLevels = 3

export const standaardVoedselbosItem: VoedselbosItem = {
  afbeelding: walnootboomAfbeelding,
  beschrijving: 'Grote boom die ruimte en schaduw maakt',
  icoon: '🌳',
  naam: 'Walnootboom',
  terrein: 'Heuvel',
}

export const voedselbosItems: VoedselbosItem[] = [
  standaardVoedselbosItem,
  {
    afbeelding: hazelaarAfbeelding,
    beschrijving: 'Struiklaag die goed bij bomen past',
    icoon: '🌰',
    naam: 'Hazelaar',
    terrein: 'Grasland',
  },
  {
    afbeelding: wildeAppelAfbeelding,
    beschrijving: 'Fruitboom voor lichte plekken',
    icoon: '🍎',
    naam: 'Wilde Appel',
    terrein: 'Grasland',
  },
  {
    beschrijving: 'Bloeit aan bosranden en trekt insecten aan',
    icoon: '🌿',
    naam: 'Vlier',
    terrein: 'Schaduw',
  },
  {
    afbeelding: daslookAfbeelding,
    beschrijving: 'Kruidlaag voor koele, beschutte plekken',
    icoon: '🌱',
    naam: 'Daslook',
    terrein: 'Schaduw',
  },
  {
    afbeelding: wildeAardbeienAfbeelding,
    beschrijving: 'Bodembedekker met eetbare vruchten',
    icoon: '🍓',
    naam: 'Wilde Aardbeien',
    terrein: 'Grasland',
  },
  {
    afbeelding: wildeKnoflookAfbeelding,
    beschrijving: 'Kruid dat graag in de onderlaag groeit',
    icoon: '🧄',
    naam: 'Wilde Knoflook',
    terrein: 'Schaduw',
  },
  {
    afbeelding: brandnetelAfbeelding,
    beschrijving: 'Sterke plant die de bodem voedt',
    icoon: '🌿',
    naam: 'Brandnetel',
    terrein: 'Akker',
  },
]

export const gerechten = ['Fruitsalade', 'Bessenjam', 'Kruidenthee']
