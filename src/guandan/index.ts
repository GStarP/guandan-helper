import { DEFUALT_SCORE } from './const'
import {
  Game,
  Pair,
  PairWithTotalScore,
  Round,
  Score,
  TotalScore,
} from './models'
import {
  addScore,
  collectEncounteredOpponents,
  compareTotalScore,
} from './utils'

/**
 * 安排对战：
 * 按照强对强、不重复对战的原则。
 * TODO 暂不支持轮空
 * @param pairs 所有对
 * @param roundId 目标轮次
 * @param rounds 所有已进行的轮次
 * @returns 对战安排
 */
export const arrangeGames = (
  pairs: Pair[],
  roundId: number,
  rounds: Round[],
): Game[] => {
  if (pairs.length < 2) {
    throw new Error('对数不足')
  }
  if (pairs.length % 2 !== 0) {
    throw new Error('对数必须为偶数')
  }

  if (roundId === 1) {
    return arrangeGamesFirstRound(pairs)
  }

  const historyRounds = rounds.filter((round) => round.roundId < roundId)
  const lastRound = historyRounds.find((round) => round.roundId === roundId - 1)
  if (!lastRound?.totalScores) {
    throw new Error('上一轮未计算总分')
  }

  const games: Game[] = []
  // 收集每对已经相遇过的对手
  const encounteredOpponents = collectEncounteredOpponents(historyRounds)
  const hasEncountered = (pairId: number, opponentId: number) => {
    return encounteredOpponents.get(pairId)?.has(opponentId) ?? false
  }
  // 对总分进行降序排序
  const lastRoundPairsRank = lastRound
    .totalScores!.concat([])
    .sort((a, b) => compareTotalScore(b.score, a.score))
  const arrangedIndexes = new Set<number>()
  for (let i = 0; i < lastRoundPairsRank.length; i++) {
    const curPair = lastRoundPairsRank[i].pairId
    if (arrangedIndexes.has(curPair)) {
      continue
    }
    // 查找分数最高且未相遇过的对手
    let opponentPair: number | undefined = undefined
    for (let j = i + 1; j < lastRoundPairsRank.length; j++) {
      const maybeOpponentPair = lastRoundPairsRank[j].pairId
      if (!hasEncountered(curPair, maybeOpponentPair)) {
        opponentPair = maybeOpponentPair
        break
      }
    }
    // 极端情况：如果所有对手均已相遇，直接选择分数次高者对战
    if (opponentPair === undefined) {
      console.warn(
        `对${curPair} 与 ${lastRoundPairsRank.slice(i + 1).map((r) => r.pairId)} 均已相遇`,
      )
      opponentPair = lastRoundPairsRank[i + 1].pairId
    }
    // 生成对局
    games.push({
      // 从 1 开始
      tableId: games.length + 1,
      pair1: curPair,
      pair2: opponentPair,
    })
    arrangedIndexes.add(curPair)
    arrangedIndexes.add(opponentPair)
  }

  return games
}
/**
 * 第一轮安排对战：
 * 随机安排所有对战。
 */
const arrangeGamesFirstRound = (pairs: Pair[]): Game[] => {
  // 使用 Knuth-Durstenfeld 洗牌算法
  const pairIds = pairs.map((pair) => pair.pairId)
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairIds[i], pairIds[j]] = [pairIds[j], pairIds[i]]
  }
  const games: Game[] = []
  for (let i = 0; i < pairIds.length; i += 2) {
    games.push({
      tableId: i / 2 + 1,
      pair1: pairIds[i],
      pair2: pairIds[i + 1],
    })
  }
  return games
}

/**
 * 根据轮次比赛结果计算总分：
 * 总分等于上一轮总分加本轮得分。
 */
export const computeTotalScore = (
  roundId: number,
  rounds: Round[],
): PairWithTotalScore[] => {
  const curRound = rounds.find((round) => round.roundId === roundId)
  if (!curRound) {
    throw new Error(`轮次 ${roundId} 不存在！`)
  }

  // * 本局的对手也算作相遇
  const validRounds = rounds.filter((round) => round.roundId <= roundId)
  const encounteredOpponents = collectEncounteredOpponents(validRounds)

  const lastRound = validRounds.find((round) => round.roundId === roundId - 1)

  const lastRoundTotalScore = new Map<number, TotalScore>()
  if (lastRound && lastRound.totalScores) {
    for (const ps of lastRound.totalScores) {
      lastRoundTotalScore.set(ps.pairId, ps.score)
    }
  }
  // 先计算自身总分
  const curRoundTotalScore = new Map<number, TotalScore>()
  curRound.games.forEach((game) => {
    const [score1, score2] = computeGameScore(game)
    curRoundTotalScore.set(game.pair1, {
      selfScore: addScore(
        score1,
        lastRoundTotalScore.get(game.pair1)?.selfScore,
      ),
      maxOpponentScore: DEFUALT_SCORE,
    })
    curRoundTotalScore.set(game.pair2, {
      selfScore: addScore(
        score2,
        lastRoundTotalScore.get(game.pair2)?.selfScore,
      ),
      maxOpponentScore: DEFUALT_SCORE,
    })
  })

  // 再补充最高对手总分
  for (const [pairId, score] of curRoundTotalScore) {
    score.maxOpponentScore = computeMaxOpponentScore(
      (encounteredOpponents.has(pairId)
        ? Array.from(encounteredOpponents.get(pairId)!)
        : []
      ).map((oppoPairId) => curRoundTotalScore.get(oppoPairId)!.selfScore),
    )
  }

  return Array.from(curRoundTotalScore.entries()).map(([pairId, score]) => ({
    pairId,
    score,
  }))
}
/**
 * 计算单局比赛中两对的得分
 */
const computeGameScore = (game: Game): [Score, Score] => {
  if (!game.level1 || !game.level2) {
    throw new Error('比赛结果未录入')
  }

  const levelScoreDiff = game.level1 - game.level2
  const scoreDiff = levelScoreDiff > 0 ? 1 : levelScoreDiff < 0 ? -1 : 0

  return [
    {
      score: 1 + scoreDiff,
      levelScore: 13 + levelScoreDiff,
      level: game.level1,
    },
    {
      score: 1 - scoreDiff,
      levelScore: 13 - levelScoreDiff,
      level: game.level2,
    },
  ]
}

/**
 * 计算最高对手得分：
 * ! 这里采用自己的理解，为了防止以对为单位导致循环排序问题，把三个得分项作为独立的数值。
 */
const computeMaxOpponentScore = (opponentScores: Score[]): Score => {
  const res: Score = {
    level: 0,
    score: 0,
    levelScore: 0,
  }
  for (const s of opponentScores) {
    if (s.level > res.level) res.level = s.level
    if (s.levelScore > res.levelScore) res.levelScore = s.levelScore
    if (s.score > res.score) res.score = s.score
  }
  return res
}
