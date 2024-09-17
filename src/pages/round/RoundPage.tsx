import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { Round } from '@/guandan/models'
import { compareTotalScore } from '@/guandan/utils'

import {
  updateCurRound,
  updateGameLevel,
  updateNextRound,
  updateTotalScore,
} from './biz'
import { RoundPageRoute, RoundStore } from './store'

export default function RoundPage() {
  const rounds = useAtomValue(RoundStore.rounds)
  const curRoute = useAtomValue(RoundStore.curRoute)
  const curRound = useAtomValue(RoundStore.curRound)

  return (
    <div>
      {rounds.length === 0 ? (
        <button onClick={() => updateNextRound(0)}>安排首轮对战</button>
      ) : (
        <div>
          <div>
            <select
              value={curRound}
              onChange={(e) => updateCurRound(Number(e.target.value))}
            >
              {rounds.map((round) => (
                <option
                  key={`round-option-${round.roundId}`}
                  value={round.roundId}
                  label={`第${round.roundId}轮`}
                />
              ))}
            </select>
            <button onClick={() => updateNextRound(curRound)}>
              安排下一轮对战
            </button>
            <div>
              <a
                onClick={() =>
                  RoundStore.setRoundPageRoute(RoundPageRoute.GAME)
                }
              >
                对局
              </a>
              <a
                onClick={() =>
                  RoundStore.setRoundPageRoute(RoundPageRoute.TOTAL_SCORE)
                }
              >
                总分
              </a>
            </div>
          </div>

          {curRoute === RoundPageRoute.GAME ? (
            <GameBox round={rounds.find((r) => r.roundId === curRound)!} />
          ) : (
            <TotalScoreBox
              round={rounds.find((r) => r.roundId === curRound)!}
            />
          )}
        </div>
      )}
    </div>
  )
}

function GameBox(props: { round: Round }) {
  return (
    <div>
      {props.round.games.map((game) => (
        <div key={`game-${game.tableId}`}>
          <p>桌号：{game.tableId}</p>
          <p>对1：{game.pair1}</p>
          <p>对2：{game.pair2}</p>
          <input
            type="number"
            value={game.level1 ?? 0}
            onChange={(e) =>
              updateGameLevel(
                props.round.roundId,
                game.tableId,
                Number(e.target.value),
                undefined,
              )
            }
          ></input>
          <input
            type="number"
            value={game.level2 ?? 0}
            onChange={(e) =>
              updateGameLevel(
                props.round.roundId,
                game.tableId,
                undefined,
                Number(e.target.value),
              )
            }
          ></input>
        </div>
      ))}
    </div>
  )
}

function TotalScoreBox(props: { round: Round }) {
  const notComputed = !props.round.totalScores

  const totalScoresSorted = useMemo(() => {
    const totalScores = (props.round.totalScores ?? []).slice()
    return totalScores.sort((a, b) => compareTotalScore(b.score, a.score))
  }, [props.round.totalScores])

  return (
    <div>
      <button onClick={() => updateTotalScore(props.round.roundId)}>
        计算总分
      </button>
      {notComputed ? (
        <h2>还未计算总分，请录入对局结果后点击上方按钮计算！</h2>
      ) : (
        <div>
          {totalScoresSorted.map((ps) => (
            <div key={`total-score-${ps.pairId}`}>
              <p>对号：{ps.pairId}</p>
              <p>总积分：{ps.score.selfScore.score}</p>
              <p>总级差分：{ps.score.selfScore.levelScore}</p>
              <p>总级数：{ps.score.selfScore.level}</p>
              <p>最高对手积分：{ps.score.maxOpponentScore.score}</p>
              <p>最高对手级差分：{ps.score.maxOpponentScore.levelScore}</p>
              <p>最高对手级数：{ps.score.maxOpponentScore.level}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
