export type User = {
  id: number
  userName: string
}

export type Pair = {
  id: number
  users: [User, User]
}

export type Round = {
  id: number
  users: User[]
  pairs: Pair[]
  tables: Table[]
}

export type Table = {
  tableId: number
  pairs: [Pair, Pair]
  levels: [number, number][]
  scores: [Score, Score]
}

export type Score = {
  // 积分
  score: number
  // 级差分
  levelScore: number
  // 级数
  level: number
}

export type RankScore = {
  pair: Pair
  score: Score
  opponents: number[]
  maxScoreOpponent: {
    opponentId: number
    score: Score
  }
}
