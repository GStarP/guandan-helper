import { AppBar, Button, Toolbar } from '@mui/material'
import { useAtomValue } from 'jotai'

import './App.css'
import { Route, RouteStore } from './modules/route/store'
import PairPage from './pages/pair/PairPage'
import RoundPage from './pages/round/RoundPage'

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
          <div className="flex ml-auto">
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
        </Toolbar>
      </AppBar>
      <main className="full">
        {curRoute === Route.PAIR ? <PairPage /> : <RoundPage />}
      </main>
    </>
  )
}

export default App
