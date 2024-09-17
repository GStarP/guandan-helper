import { getDefaultStore } from 'jotai'

import { arrangeGames, computeTotalScore } from '@/guandan'
import { Game, PairWithTotalScore, Round } from '@/guandan/models'

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

export const updateGame = (roundId: number, game: Game) => {
  const store = getDefaultStore()
  store.set(RoundStore.rounds, (rounds) => {
    const roundsCopy = rounds.slice()
    const round = roundsCopy.find((r) => r.roundId === roundId)
    if (!round) {
      alert(`轮次 ${roundId} 不存在！`)
      return rounds
    }
    const index = round.games.findIndex((g) => g.tableId === game?.tableId)
    if (index === -1) {
      alert(`桌号 ${game} 不存在`)
      return rounds
    } else {
      round.games[index] = game
      return roundsCopy
    }
  })
}

export const parseLevel = (input: string): number => {
  try {
    return parseInt(input)
  } catch (e) {
    // do nothing
  }

  switch (input) {
    case 'J':
      return 11
    case 'Q':
      return 12
    case 'K':
      return 13
    case 'A':
      return 14
    case 'A+':
      return 15
    default:
      return 0
  }
}

export const recomputeTotalScore = (roundId: number) => {
  const store = getDefaultStore()
  store.set(RoundStore.rounds, (rounds) => {
    const roundsCopy = rounds.slice()
    const round = roundsCopy.find((r) => r.roundId === roundId)
    if (!round) {
      alert(`轮次 ${roundId} 不存在！`)
      return rounds
    }
    try {
      round.totalScores = computeTotalScore(roundId, rounds)
      return roundsCopy
    } catch (e) {
      alert(e)
      return rounds
    }
  })
}

export const updateTotalScore = (
  roundId: number,
  totalScore: PairWithTotalScore,
) => {
  const store = getDefaultStore()
  store.set(RoundStore.rounds, (rounds) => {
    const roundsCopy = rounds.slice()
    const round = roundsCopy.find((r) => r.roundId === roundId)
    if (!round) {
      alert(`轮次 ${roundId} 不存在！`)
      return rounds
    }

    if (!round.totalScores) {
      alert(`轮次 ${roundId} 尚未计算总分！`)
      return rounds
    }

    const index = round.totalScores.findIndex(
      (ts) => ts.pairId === totalScore.pairId,
    )
    if (index === -1) {
      alert(`找不到对 ${totalScore.pairId}！`)
      return rounds
    } else {
      round.totalScores[index] = totalScore
      return roundsCopy
    }
  })
}
