import { getDefaultStore } from 'jotai'

import { arrangeGames, computeTotalScore } from '@/guandan'
import { Round } from '@/guandan/models'

import { PairStore } from '../pair/store'
import { RoundPageRoute, RoundStore } from './store'

export const updateNextRound = (curRoundId: number) => {
  const store = getDefaultStore()
  const pairs = store.get(PairStore.pairs)
  const rounds = store.get(RoundStore.rounds)

  try {
    const games = arrangeGames(pairs, curRoundId + 1, rounds)
    const newRound: Round = {
      // 从 1 开始
      roundId: curRoundId + 1,
      games,
    }

    store.set(RoundStore.rounds, (rounds) => {
      const roundsCopy = rounds.slice()
      const index = roundsCopy.findIndex((r) => r.roundId === newRound.roundId)
      if (index === -1) {
        roundsCopy.push(newRound)
      } else {
        roundsCopy[index] = newRound
      }
      return roundsCopy
    })
    store.set(RoundStore.curRound, newRound.roundId)
    store.set(RoundStore.curRoute, RoundPageRoute.GAME)
  } catch (e) {
    alert(e)
  }
}

export const updateCurRound = (roundId: number) => {
  const store = getDefaultStore()
  store.set(RoundStore.curRound, roundId)
}

export const updateGameLevel = (
  roundId: number,
  tableId: number,
  level1?: number,
  level2?: number,
) => {
  const store = getDefaultStore()
  store.set(RoundStore.rounds, (rounds) => {
    const roundsCopy = rounds.slice()
    const round = roundsCopy.find((r) => r.roundId === roundId)
    if (!round) {
      alert(`轮次 ${roundId} 不存在！`)
      return rounds
    }
    const game = round.games.find((g) => g.tableId === tableId)
    if (!game) {
      alert(`桌号 ${game} 不存在`)
      return rounds
    }
    if (level1) game.level1 = level1
    if (level2) game.level2 = level2
    return roundsCopy
  })
}

export const updateTotalScore = (roundId: number) => {
  const store = getDefaultStore()
  store.set(RoundStore.rounds, (rounds) => {
    const roundsCopy = rounds.slice()
    const round = roundsCopy.find((r) => r.roundId === roundId)
    if (!round) {
      alert(`轮次 ${roundId} 不存在！`)
      return rounds
    }
    round.totalScores = computeTotalScore(roundId, rounds)
    return roundsCopy
  })
}
