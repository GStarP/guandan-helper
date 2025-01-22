import { useColorScheme } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'

type Props<T> = React.ComponentProps<typeof AgGridReact<T>> & {
  style?: React.CSSProperties
}

export default function ThemedAgGridReact<T>(props: Props<T>) {
  const { mode } = useColorScheme()

  return (
    <div
      className={mode === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'}
      style={props.style}
    >
      <AgGridReact {...props} />
    </div>
  )
}
