export default {
  state: {
    pageDirection: 'fade',
    routeChain: [],
    cachePages: []
  },
  getters: {
    routerPageDirection: state => state.pageDirection,
    routerCachePages: state => state.cachePages
  },
  actions: {
    setCachePages({commit, state}) {
      setTimeout(() => {
        let routes = []
        state.routeChain.forEach(route => {
          routes.push(route.name || 'index')
        })
        commit('SET_CACHE_PAGES', {
          cachePages: routes
        })
      }, 100)
    }
  },
  mutations: {
    addRouteChain(state, route) {
      state.routeChain.push(route)
      state.cachePages.push(route.name || 'index')
    },
    popRouteChain(state) {
      state.routeChain.pop()
    },
    setPageDirection(state, dir) {
      state.pageDirection = dir
    },
    SET_CACHE_PAGES(state, payload) {
      state.cachePages = payload.cachePages
    }
  }
}
