import { atom, getDefaultStore } from 'jotai'

export enum Route {
  PAIR = 'pair',
  ROUND = 'round',
}

export const RouteStore = {
  curRoute: atom<Route>(Route.PAIR),
  setRoute: (route: Route) => {
    getDefaultStore().set(RouteStore.curRoute, route)
  },
}
