import { Round, Score, TotalScore } from './models'

/**
 * 比较得分：
 * 先比较积分，再比较级差分，最后比较级数
 */
export const compareScore = (s1: Score, s2: Score): number => {
  if (s1.score !== s2.score) {
    return s1.score - s2.score
  } else if (s1.levelScore !== s2.levelScore) {
    return s1.levelScore - s2.levelScore
  } else {
    return s1.level - s2.level
  }
}

/**
 * 比较总分：
 * 先比较自身总分，最后比较最高对手总分
 */
export const compareTotalScore = (s1: TotalScore, s2: TotalScore): number => {
  const selfScoreDiff = compareScore(s1.selfScore, s2.selfScore)
  if (selfScoreDiff !== 0) {
    return selfScoreDiff
  } else {
    return compareScore(s1.maxOpponentScore, s2.maxOpponentScore)
  }
}

/**
 * 得分相加
 */
export const addScore = (s1: Score, s2?: Score): Score => {
  return {
    level: s1.level + (s2?.level ?? 0),
    score: s1.score + (s2?.score ?? 0),
    levelScore: s1.levelScore + (s2?.levelScore ?? 0),
  }
}

/**
 * 收集已经相遇过的对手
 */
export const collectEncounteredOpponents = (
  rounds: Round[],
): Map<number, Set<number>> => {
  const encounteredOpponents = new Map<number, Set<number>>()
  rounds.forEach((round) => {
    round.games.forEach((game) => {
      if (!encounteredOpponents.has(game.pair1)) {
        encounteredOpponents.set(game.pair1, new Set())
      }
      encounteredOpponents.get(game.pair1)!.add(game.pair2)
      if (!encounteredOpponents.has(game.pair2)) {
        encounteredOpponents.set(game.pair2, new Set())
      }
      encounteredOpponents.get(game.pair2)!.add(game.pair1)
    })
  })
  return encounteredOpponents
}
