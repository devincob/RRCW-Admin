import {getState} from '../plugins'
import {listToTree} from '../../libs/utils'
import {deepCopy} from '../../libs/deepCopy'

export default {
  state: getState('user') || {
    userInfo: {},
    menus: [],
    menuIsCollapse: false
  },
  getters: {
    userCheckLogin: state => {
      return !!(state.userInfo && (state.userInfo.authToken || state.userInfo.sessionId))
    },
    userMenus: state => state.menus && state.menus.length ? listToTree(deepCopy(state.menus)) : [],
    menuIsCollapse: state => state.menuIsCollapse
  },
  actions: {
    setUserInfo ({commit}, payload) {
      commit('SET_USER_INFO', payload)
    },
    clearUserInfo ({commit}) {
      commit('CLEAR_USER_INFO')
    },
    pullMenus ({commit, state}) {
      const permissions = state.userInfo.permissionFullModel || []
      let menus = permissions.map(item => {
        return {
          'id': item.menuId,
          'pid': item.parentMenuId,
          'title': item.menuName,
          'icon': item.icon || 'el-icon-menu',
          'path': item.menuLink,
          'disabled': item.isShow === 'N'
        }
      })
      commit('SET_USER_MENUS', menus)
    },
    setMenuIsCollapse({commit}, val){
      commit('SET_MENU_IS_COLLAPSE', val)
    }
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
    },
    CLEAR_USER_INFO (state) {
      state.userInfo = {}
    },
    SET_USER_MENUS (state, menus) {
      state.menus = menus
    },
    SET_MENU_IS_COLLAPSE (state, status) {
      state.menuIsCollapse = status
    }
  }
}
