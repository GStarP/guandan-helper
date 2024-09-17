import { atom, getDefaultStore } from 'jotai'

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
  rounds: atom<Round[]>([]),
  curRound: atom(1),
}
