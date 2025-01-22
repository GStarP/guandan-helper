import { AppBar, Button, Toolbar } from '@mui/material'
import { getDefaultStore, useAtomValue } from 'jotai'
import { useState } from 'react'

import { useDefaultLightTheme } from './infra/theme'
import ThemeIconButton from './infra/theme/ThemeIconButton'
import { Route, RouteStore } from './modules/route/store'
import PairPage from './pages/pair/PairPage'
import { PairStore } from './pages/pair/store'
import RoundPage from './pages/round/RoundPage'
import { RoundPageRoute, RoundStore } from './pages/round/store'

function App() {
  useDefaultLightTheme()

  const curRoute = useAtomValue(RouteStore.curRoute)
  const [headerShow, setHeaderShow] = useState(true)

  return (
    <>
      {headerShow ? (
        <AppBar
          position="static"
          color="transparent"
          sx={{
            marginBottom: 0,
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <div className="flex">
              <Button
                variant="text"
                color={curRoute === Route.PAIR ? 'primary' : 'inherit'}
                onClick={() => RouteStore.setRoute(Route.PAIR)}
              >
                报名页
              </Button>
              <Button
                variant="text"
                color={curRoute === Route.ROUND ? 'primary' : 'inherit'}
                onClick={() => RouteStore.setRoute(Route.ROUND)}
              >
                比赛页
              </Button>
            </div>

            <div className="ml-auto flex gap-2">
              <ThemeIconButton />
              <Button variant="outlined" color="error" onClick={reset}>
                重置
              </Button>
              <Button variant="outlined" onClick={() => setHeaderShow(false)}>
                隐藏
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      ) : (
        <div className="absolute w-fit right-4 top-4">
          <Button variant="outlined" onClick={() => setHeaderShow(true)}>
            显示顶部栏
          </Button>
        </div>
      )}

      <main className="full mt-4">
        {curRoute === Route.PAIR ? <PairPage /> : <RoundPage />}
      </main>
    </>
  )
}

const reset = () => {
  const ok = confirm('是否确认重置所有信息？')
  if (!ok) return

  const store = getDefaultStore()
  store.set(RouteStore.curRoute, Route.PAIR)
  store.set(PairStore.pairs, [])
  store.set(RoundStore.rounds, [])
  store.set(RoundStore.curRound, 1)
  store.set(RoundStore.curRoute, RoundPageRoute.GAME)
}

export default App
