import { atom } from 'jotai'

import { Pair } from '@/guandan/models'

export const PairStore = {
  pairs: atom<Pair[]>([]),
}
