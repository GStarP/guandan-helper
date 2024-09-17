import { useAtomValue } from 'jotai'
import { createRef, memo } from 'react'

import { Pair } from '@/guandan/models'

import { addManyNewPair, addNewPair, updateUserName } from './biz'
import { PairStore } from './store'

export default function PairPage() {
  const pairs = useAtomValue(PairStore.pairs)
  const inputRef = createRef<HTMLInputElement>()

  return (
    <div>
      <button onClick={addNewPair}>添加</button>
      <button
        onClick={() => addManyNewPair(Number(inputRef.current?.value) ?? 1)}
      >
        添加多个
      </button>
      <input ref={inputRef} type="number" />
      {pairs.map((pair) => (
        <MemoPairItem key={`pair-${pair.pairId}`} {...pair} />
      ))}
    </div>
  )
}

const MemoPairItem = memo(PairItem)
function PairItem(props: Pair) {
  return (
    <div>
      <span>{props.pairId}</span>
      <input
        value={props.user1}
        onChange={(e) =>
          updateUserName(props.pairId, e.target.value, undefined)
        }
      />
      <input
        value={props.user2}
        onChange={(e) =>
          updateUserName(props.pairId, undefined, e.target.value)
        }
      />
    </div>
  )
}
