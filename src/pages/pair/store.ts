import { atom } from 'jotai'

import { Pair } from '@/guandan/models'

export const PairStore = {
  pairs: atom<Pair[]>([]),
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.__PairStore = PairStore
