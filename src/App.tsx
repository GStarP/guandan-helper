import { useAtomValue } from 'jotai'

import './App.css'
import { Route, RouteStore } from './modules/route/store'
import PairPage from './pages/pair/PairPage'
import RoundPage from './pages/round/RoundPage'

function App() {
  const curRoute = useAtomValue(RouteStore.curRoute)
  return (
    <>
      <header>
        <a onClick={() => RouteStore.setRoute(Route.PAIR)}>报名</a>
        <a onClick={() => RouteStore.setRoute(Route.ROUND)}>比赛</a>
      </header>
      <main>{curRoute === Route.PAIR ? <PairPage /> : <RoundPage />}</main>
    </>
  )
}

export default App
