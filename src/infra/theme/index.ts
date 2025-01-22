import { useColorScheme } from '@mui/material'
import { useEffect } from 'react'

export const useDefaultLightTheme = () => {
  const { mode, setMode } = useColorScheme()
  useEffect(() => {
    if (mode === 'system') {
      setMode('light')
    }
  }, [mode, setMode])
}
