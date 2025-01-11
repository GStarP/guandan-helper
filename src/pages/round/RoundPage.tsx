/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { getDefaultStore, useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { Game, PairWithTotalScore, Round } from '@/guandan/models'
import { compareTotalScore } from '@/guandan/utils'
import { pairWithUser } from '@/pages/pair/biz'

import {
  levelWithNickname,
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
      <div className="flex mb-2 gap-4">
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
    sortable: false,
  },
  {
    field: 'pair1',
    headerName: '对一',
    flex: 2,
    filter: true,
    editable: true,
    sortable: false,
    cellDataType: 'number',
    cellRenderer: (params: any) => pairWithUser(params.value),
  },
  {
    field: 'pair2',
    headerName: '对二',
    flex: 2,
    filter: true,
    editable: true,
    sortable: false,
    cellDataType: 'number',
    cellRenderer: (params: any) => pairWithUser(params.value),
  },
  {
    field: 'level1',
    headerName: '对一：终局级数',
    flex: 2,
    editable: true,
    sortable: false,
    cellDataType: 'number',
    cellRenderer: (params: any) => levelWithNickname(params.value),
  },
  {
    field: 'level2',
    headerName: '对二：终局级数',
    flex: 2,
    editable: true,
    sortable: false,
    cellDataType: 'number',
    cellRenderer: (params: any) => levelWithNickname(params.value),
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
          suppressScrollOnNewData
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
    sortable: false,
    cellRenderer: (params: any) => pairWithUser(params.value),
  },
  {
    field: 'score.selfScore.score',
    headerName: '总积分（本轮积分）',
    cellDataType: 'number',
    editable: true,
    sortable: false,
    flex: 1,
    // TODO: duplicate
    cellRenderer: (params: any) => {
      const store = getDefaultStore()
      const round = store
        .get(RoundStore.rounds)
        .find((r) => r.roundId === store.get(RoundStore.curRound) - 1)
      const preV =
        round?.totalScores?.find((s) => s.pairId === params.data.pairId)?.score
          .selfScore.score ?? 0
      const inc = params.value - preV
      return `${params.value} (+${inc})`
    },
  },
  {
    field: 'score.selfScore.levelScore',
    headerName: '总级差分（本轮级差分）',
    cellDataType: 'number',
    editable: true,
    sortable: false,
    flex: 1,
    cellRenderer: (params: any) => {
      const store = getDefaultStore()
      const round = store
        .get(RoundStore.rounds)
        .find((r) => r.roundId === store.get(RoundStore.curRound) - 1)
      const preV =
        round?.totalScores?.find((s) => s.pairId === params.data.pairId)?.score
          .selfScore.levelScore ?? 0
      const inc = params.value - preV
      return `${params.value} (+${inc})`
    },
  },
  {
    field: 'score.selfScore.level',
    headerName: '总级数（本轮级数）',
    cellDataType: 'number',
    editable: true,
    sortable: false,
    flex: 1,
    cellRenderer: (params: any) => {
      const store = getDefaultStore()
      const round = store
        .get(RoundStore.rounds)
        .find((r) => r.roundId === store.get(RoundStore.curRound) - 1)
      const preV =
        round?.totalScores?.find((s) => s.pairId === params.data.pairId)?.score
          .selfScore.level ?? 0
      const inc = params.value - preV
      return `${params.value} (+${inc})`
    },
  },
  {
    field: 'score.maxOpponentScore.score',
    headerName: '最高对手积分',
    cellDataType: 'number',
    editable: true,
    sortable: false,
    flex: 1,
  },
  {
    field: 'score.maxOpponentScore.levelScore',
    headerName: '最高对手级差分',
    cellDataType: 'number',
    editable: true,
    sortable: false,
    flex: 1,
  },
  {
    field: 'score.maxOpponentScore.level',
    headerName: '最高对手级数',
    cellDataType: 'number',
    editable: true,
    sortable: false,
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
              suppressScrollOnNewData
            />
          </div>
        </div>
      )}
    </div>
  )
}
