import { AppBar, Button, Toolbar } from '@mui/material'
import { getDefaultStore, useAtomValue } from 'jotai'

import './App.css'
import { Route, RouteStore } from './modules/route/store'
import PairPage from './pages/pair/PairPage'
import { PairStore } from './pages/pair/store'
import RoundPage from './pages/round/RoundPage'
import { RoundPageRoute, RoundStore } from './pages/round/store'

function App() {
  const curRoute = useAtomValue(RouteStore.curRoute)
  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          marginBottom: '1rem',
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

          <div className="ml-auto flex">
            <Button variant="outlined" onClick={reset}>
              重置
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <main className="full">
        {curRoute === Route.PAIR ? <PairPage /> : <RoundPage />}
      </main>
    </>
  )
}

const reset = () => {
  const store = getDefaultStore()
  store.set(RouteStore.curRoute, Route.PAIR)
  store.set(PairStore.pairs, [])
  store.set(RoundStore.rounds, [])
  store.set(RoundStore.curRound, 1)
  store.set(RoundStore.curRoute, RoundPageRoute.GAME)
}

export default App
