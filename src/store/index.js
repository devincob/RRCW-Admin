import Vue from 'vue'
import Vuex from 'vuex'
import {StorageStore} from './plugins'

import router from './modules/router'
import user from './modules/user'
import region from './modules/region'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    count: 0
  },
  actions: {
    setCount ({commit}, payload) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('SET_COUNT', payload.count)
          resolve(payload.count)
        }, 2000)
      })
    }
  },
  mutations: {
    SET_COUNT (state, count) {
      state.count = count
    }
  },
  modules: {
    router,
    user,
    region
  },
  plugins: [StorageStore]
})
