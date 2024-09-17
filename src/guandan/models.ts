/**
 * 对（对家两人称为一“对”）
 * @property {number} pairId 对号
 * @property {string} user1 成员1
 * @property {string} user2 成员2
 */
export type Pair = {
  pairId: number
  user1: string
  user2: string
}

/**
 * 单局比赛
 * 当且仅当登记完单局比赛结果后，终局级数才不为空
 * @property {number} tableId 桌号
 * @property {number} pair1 对1
 * @property {number} pair2 对2
 * @property {number} level1 对1终局级数（0为未录入）
 * @property {number} level2 对2终局级数（0为未录入）
 */
export type Game = {
  tableId: number
  pair1: number
  pair2: number
  level1: number
  level2: number
}

/**
 * 得分
 * @property {number} score 积分
 * @property {number} levelScore 级差分
 * @property {number} level 级数
 */
export type Score = {
  score: number
  levelScore: number
  level: number
}

/**
 * 总分
 * @property {Score} selfScore 自身总分
 * @property {Score} maxOpponent 最高对手总分
 */
export type TotalScore = {
  selfScore: Score
  maxOpponentScore: Score
}

/**
 * 轮次
 * 当前仅当所有比赛结果全部登记完之后，才能进行总分的计算
 * 当且仅当总分计算完毕后，当前轮次才能结束，开启下一轮次
 * @property {number} roundId 第X轮
 * @property {Game[]} games 当前轮所有比赛
 * @property {Array} totalScore 总分（不应假设其有序！）
 */
export type Round = {
  roundId: number
  games: Game[]
  totalScores?: PairWithTotalScore[]
}
export type PairWithTotalScore = {
  pairId: number
  score: TotalScore
}
