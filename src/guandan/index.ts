import { Pair, RankScore, Round, Score, Table, User } from './models'

/**
 * Core Logic
 */

/**
 * 将未组对用户分配成对
 * @param allUser 所有用户
 * @param allPair 所有对
 * @returns 新的所有对
 */
export function generatePairsByRemainUsers(
  allUser: User[],
  allPair: Pair[],
): Pair[] {
  const freeUsers = allUser.filter(
    (user) => !allPair.some((pair) => pair.users.includes(user)),
  )
  if (freeUsers.length <= 1) {
    return allPair
  } else {
    const newPairId = allPair.length
    const newPairs: Pair[] = []
    for (let i = 0; i < freeUsers.length; i += 2) {
      newPairs.push({
        id: newPairId + i,
        users: [freeUsers[i], freeUsers[i + 1]],
      })
    }
    return allPair.concat(newPairs)
  }
}

/**
 * 按照强对强、不重复对手的原则安排对战
 * @param pairs 所有对
 * @param rank 此前总体排名
 * @returns 对战安排
 */
export function generateTables(pairs: Pair[], rank: RankScore[]): Table[] {
  const pairIdSet = new Set<number>(pairs.map((pair) => pair.id))
  const validRank = rank.filter((rankScore) => pairIdSet.has(rankScore.pair.id))
  const tables: Table[] = []

  while (rank.length > 1) {
    const pair0 = rank[0]
    let pair1: RankScore | undefined
    let pair1Index = -1

    // 查找分数最高且未对战过的对手
    for (let i = 1; i < rank.length; i++) {
      if (!pair0.opponents.includes(validRank[i].pair.id)) {
        pair1 = validRank[i]
        pair1Index = i
        break
      }
    }

    // 边界情况：当所有可选对手均已对战，直接选择分数次高者对战
    if (pair1 === undefined) {
      console.warn(
        `${pair0.pair.id} 与 ${rank.slice(1).map((r) => r.pair.id)} 均已对战`,
      )
      pair1 = validRank[1]
      pair1Index = 1
    }

    tables.push({
      tableId: tables.length,
      pairs: [pair0.pair, pair1.pair],
      levels: [],
      scores: [{ ...DEFAULT_SCORE }, { ...DEFAULT_SCORE }],
    })

    // 剔除已安排对阵的两对
    rank = rank.slice(1).filter((_, i) => i !== pair1Index)
  }

  return tables
}

/**
 * @param table 一桌牌局
 * @returns 本局计分
 */
export function computeTableScore(table: Table): [Score, Score] {
  if (table.levels.length > 0) {
    const [level0, level1] = table.levels[table.levels.length - 1]
    const scoreDiff = level0 > level1 ? 1 : level0 == level1 ? 1 : 0
    const levelScoreDiff = level0 - level1
    return [
      {
        score: 1 + scoreDiff,
        levelScore: 13 + levelScoreDiff,
        level: level0,
      },
      {
        score: 1 - scoreDiff,
        levelScore: 13 - levelScoreDiff,
        level: level1,
      },
    ]
  } else {
    return [{ ...DEFAULT_SCORE }, { ...DEFAULT_SCORE }]
  }
}

/**
 * @param allRound all score-computed rounds
 * @returns overall rank
 */
export function computeRank(allRound: Round[]): RankScore[] {
  const pairRankScoreMap = new Map<number, RankScore>()
  // sum every round scores and collect opponents
  allRound.forEach((round) => {
    round.tables.forEach((table) => {
      for (let i = 0; i < 2; i++) {
        const pair = table.pairs[i]
        const score = table.scores[i]
        if (!pairRankScoreMap.has(pair.id)) {
          pairRankScoreMap.set(pair.id, {
            pair,
            score,
            opponents: [table.pairs[1 - i].id],
            // ignore now
            maxScoreOpponent: {
              opponentId: 0,
              score: { ...DEFAULT_SCORE },
            },
          })
        } else {
          const rankScore = pairRankScoreMap.get(pair.id)!
          rankScore.score.score += score.score
          rankScore.score.levelScore += score.levelScore
          rankScore.score.level += score.level
          rankScore.opponents.push(table.pairs[1 - i].id)
        }
      }
    })
  })

  // select the max-score opponent
  const rank = Array.from(pairRankScoreMap.values()).map((rankScore) => {
    const opponentScoreList = rankScore.opponents
      .map((opponentId) => ({
        opponentId,
        score: pairRankScoreMap.get(opponentId)!.score,
      }))
      .sort((a, b) => {
        return compareScore(a.score, b.score)
      })

    return {
      ...rankScore,
      maxScoreOpponent: {
        opponentId: opponentScoreList[0].opponentId,
        score: opponentScoreList[0].score,
      },
    }
  })

  // rank by score & mapScoreOp
  rank.sort((a, b) => {
    const compareRes = compareScore(a.score, b.score)
    if (compareRes !== 0) {
      return compareRes
    } else {
      return compareScore(a.maxScoreOpponent.score, b.maxScoreOpponent.score)
    }
  })

  return rank
}

/**
 * Utils
 */
const DEFAULT_SCORE = Object.freeze({
  score: 0,
  levelScore: 0,
  level: 0,
})

function compareScore(a: Score, b: Score) {
  if (a.score !== b.score) {
    return b.score - a.score
  } else if (a.levelScore !== b.levelScore) {
    return b.levelScore - a.levelScore
  } else {
    return b.level - a.level
  }
}
