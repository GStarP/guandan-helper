import { Button, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { Game, PairWithTotalScore, Round } from '@/guandan/models'
import { compareTotalScore } from '@/guandan/utils'

import {
  recomputeTotalScore,
  updateCurRound,
  updateGame,
  updateNextRound,
  updateTotalScore,
} from './biz'
import { RoundPageRoute, RoundStore } from './store'

export default function RoundPage() {
  const rounds = useAtomValue(RoundStore.rounds)
  const curRoute = useAtomValue(RoundStore.curRoute)
  const curRound = useAtomValue(RoundStore.curRound)

  const round = rounds.find((r) => r.roundId === curRound)!

  return (
    <div className="full flex-col px-4">
      <div className="flex mb-4 gap-4">
        {rounds.length === 0 ? (
          <Button variant="outlined" onClick={() => updateNextRound(0)}>
            安排首轮对战
          </Button>
        ) : (
          <>
            <Select
              value={curRound}
              label="当前轮次"
              onChange={(e) => updateCurRound(Number(e.target.value))}
              size="small"
            >
              {rounds.map((round) => (
                <MenuItem
                  key={`round-option-${round.roundId}`}
                  value={round.roundId}
                >
                  第 {round.roundId} 轮
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              onClick={() => updateNextRound(curRound)}
            >
              安排第{curRound + 1}轮对战
            </Button>

            <div className="flex ml-auto">
              {curRoute === RoundPageRoute.TOTAL_SCORE && (
                <Button
                  variant="outlined"
                  onClick={() => recomputeTotalScore(round.roundId)}
                >
                  计算总分
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {rounds.length !== 0 && (
        <>
          <Tabs
            className="mb-2"
            value={curRoute}
            onChange={(_, v) => RoundStore.setRoundPageRoute(v)}
          >
            <Tab label="对局" value={RoundPageRoute.GAME}></Tab>
            <Tab label="总分" value={RoundPageRoute.TOTAL_SCORE}></Tab>
          </Tabs>

          {curRoute === RoundPageRoute.GAME ? (
            <GameBox round={round} />
          ) : (
            <TotalScoreBox round={round} />
          )}
        </>
      )}
    </div>
  )
}

const GameColumns: ColDef<Game>[] = [
  {
    field: 'tableId',
    headerName: '桌号',
    flex: 1,
    filter: true,
  },
  {
    field: 'pair1',
    headerName: '对一',
    flex: 2,
    filter: true,
    editable: true,
    cellDataType: 'number',
  },
  {
    field: 'pair2',
    headerName: '对二',
    flex: 2,
    filter: true,
    editable: true,
    cellDataType: 'number',
  },
  {
    field: 'level1',
    headerName: '对一：终局级数',
    flex: 2,
    editable: true,
    cellDataType: 'number',
  },
  {
    field: 'level2',
    headerName: '对二：终局级数',
    flex: 2,
    editable: true,
    cellDataType: 'number',
  },
]
function GameBox(props: { round: Round }) {
  return (
    <div className="full mb-4">
      <div
        className="ag-theme-quartz"
        style={{ width: '100%', height: '100%' }}
      >
        <AgGridReact
          columnDefs={GameColumns}
          rowData={props.round.games}
          onCellValueChanged={(e) => {
            updateGame(props.round.roundId, e.data)
          }}
        />
      </div>
    </div>
  )
}

const TotalScoreColumns: ColDef<PairWithTotalScore>[] = [
  {
    field: 'pairId',
    headerName: '对号',
    filter: true,
  },
  {
    field: 'score.selfScore.score',
    headerName: '总积分',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
  {
    field: 'score.selfScore.levelScore',
    headerName: '总级差分',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
  {
    field: 'score.selfScore.level',
    headerName: '总级数',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
  {
    field: 'score.maxOpponentScore.score',
    headerName: '最高对手积分',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
  {
    field: 'score.maxOpponentScore.levelScore',
    headerName: '最高对手级差分',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
  {
    field: 'score.maxOpponentScore.level',
    headerName: '最高对手级数',
    cellDataType: 'number',
    editable: true,
    flex: 1,
  },
]
function TotalScoreBox(props: { round: Round }) {
  const notComputed = !props.round.totalScores

  const totalScoresSorted = useMemo(() => {
    const totalScores = (props.round.totalScores ?? []).slice()
    return totalScores.sort((a, b) => compareTotalScore(b.score, a.score))
  }, [props.round.totalScores])

  return (
    <div className="full flex-col">
      {notComputed ? (
        <div className="full flex-col items-center">
          <Typography variant="h5" className="up-full">
            尚未计算总分
          </Typography>
          <Typography variant="h5" className="up-full">
            请先录入对局结果
          </Typography>
          <Typography variant="h5" className="up-full">
            再点击右上方按钮计算
          </Typography>
        </div>
      ) : (
        <div className="full mb-4">
          <div
            className="ag-theme-quartz"
            style={{ width: '100%', height: '100%' }}
          >
            <AgGridReact
              columnDefs={TotalScoreColumns}
              rowData={totalScoresSorted}
              onCellValueChanged={(e) =>
                updateTotalScore(props.round.roundId, e.data)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
