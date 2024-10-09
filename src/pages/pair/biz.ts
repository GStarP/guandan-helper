import { getDefaultStore } from 'jotai'

import { Pair } from '@/guandan/models'

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

export const updatePair = (pair: Pair) => {
  const store = getDefaultStore()
  store.set(PairStore.pairs, (pairs) => {
    const pairsCopy = pairs.slice()
    const index = pairsCopy.findIndex((p) => p.pairId === pair.pairId)
    if (index !== -1) {
      pairsCopy[index] = pair
      return pairsCopy
    } else {
      return pairs
    }
  })
}

export const pairWithUser = (pairId: number) => {
  const pair = getDefaultStore()
    .get(PairStore.pairs)
    .find((p) => p.pairId === pairId)
  return `${pairId}（${pair?.user1}，${pair?.user2}）`
}
