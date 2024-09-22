import { atomWithStorage } from 'jotai/utils'

import { Pair } from '@/guandan/models'

export const PairStore = {
  pairs: atomWithStorage<Pair[]>('paris', []),
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.__PairStore = PairStore
