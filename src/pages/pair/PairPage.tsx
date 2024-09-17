import { Button } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useAtomValue } from 'jotai'
import { createRef } from 'react'

import { Pair } from '@/guandan/models'

import './PairPage.css'
import { addManyNewPair, addNewPair, updatePair } from './biz'
import { PairStore } from './store'

const PairColumns: ColDef<Pair>[] = [
  {
    field: 'pairId',
    headerName: '对号',
    flex: 1,
    filter: true,
  },
  {
    field: 'user1',
    headerName: '成员一',
    flex: 2,
    editable: true,
  },
  {
    field: 'user2',
    headerName: '成员二',
    flex: 2,
    editable: true,
  },
]

export default function PairPage() {
  const pairs = useAtomValue(PairStore.pairs)
  const inputRef = createRef<HTMLInputElement>()

  return (
    <div className="full flex-col px-4">
      <div
        className="flex gap-4 mb-4"
        style={{
          height: '40px',
        }}
      >
        <Button variant="outlined" onClick={addNewPair}>
          新增一对
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => addManyNewPair(Number(inputRef.current?.value) ?? 1)}
          >
            新增多对
          </Button>
          <input className="number-input" ref={inputRef} type="number" />
        </div>
      </div>

      <div className="full mb-4">
        <div
          className="ag-theme-quartz"
          style={{ width: '100%', height: '100%' }}
        >
          <AgGridReact
            columnDefs={PairColumns}
            rowData={pairs}
            onCellValueChanged={(e) => updatePair(e.data)}
          />
        </div>
      </div>
    </div>
  )
}
