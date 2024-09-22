import { atom, getDefaultStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Round } from '@/guandan/models'

export const enum RoundPageRoute {
  GAME = 'game',
  TOTAL_SCORE = 'total-score',
}

export const RoundStore = {
  curRoute: atom<RoundPageRoute>(RoundPageRoute.GAME),
  setRoundPageRoute: (route: RoundPageRoute) => {
    const store = getDefaultStore()
    store.set(RoundStore.curRoute, route)
  },
  rounds: atomWithStorage<Round[]>('rounds', []),
  curRound: atom(1),
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.__RoundStore = RoundStore
