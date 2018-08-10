import {getState} from '../plugins'
import {Api} from '../../model'

export default {
  state: getState('region') || {
    region: []
  },
  getters: {
    getRegion: state => state.region || []
  },
  actions: {
    setRegion ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Api.use('main').userRegionList({}).then((res) => {
          commit('SET_REGION_INFO', res)
          resolve(res)
        }).catch((err) => {
          commit('SET_REGION_INFO', [])
          reject(err)
        })
      })
    }
  },
  mutations: {
    SET_REGION_INFO (state, region) {
      let regionList = []
      region && region.forEach((i) => {
        if (i.parentId === 1){
          regionList.push({
            parentId: 1,
            provinceName: i.districtName,
            label: i.districtName,
            distictId: i.distictId,
            children: []
          })
        }
      })
      region && region.forEach((i) => {
        regionList.forEach((r) => {
          if (i.parentId === r.distictId){
            r.children.push({
              distictId: i.distictId,
              districtName: i.districtName,
              label: i.districtName
            })
          }
        })
      })
      state.region = regionList
    }
  }
}
