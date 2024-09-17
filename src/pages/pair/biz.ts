import { getDefaultStore } from 'jotai'

import { PairStore } from './store'

export const addNewPair = () => {
  const store = getDefaultStore()
  store.set(PairStore.pairs, (pairs) => {
    return [
      ...pairs,
      {
        // 从 1 开始
        pairId: pairs.length + 1,
        user1: `选手${pairs.length * 2 + 1}`,
        user2: `选手${pairs.length * 2 + 2}`,
      },
    ]
  })
}

export const addManyNewPair = (size: number) => {
  const store = getDefaultStore()
  store.set(PairStore.pairs, (pairs) => {
    const newPairs = new Array(size).fill(null).map((_, i) => ({
      // 从 1 开始
      pairId: pairs.length + i + 1,
      user1: `选手${(pairs.length + i) * 2 + 1}`,
      user2: `选手${(pairs.length + i) * 2 + 2}`,
    }))
    return [...pairs, ...newPairs]
  })
}

export const updateUserName = (
  pairId: number,
  user1?: string,
  user2?: string,
) => {
  const store = getDefaultStore()
  store.set(PairStore.pairs, (pairs) => {
    const pairsCopy = pairs.slice()
    const targetPair = pairsCopy.find((p) => p.pairId === pairId)
    if (targetPair) {
      if (user1) targetPair.user1 = user1
      if (user2) targetPair.user2 = user2
    }
    return pairsCopy
  })
}
