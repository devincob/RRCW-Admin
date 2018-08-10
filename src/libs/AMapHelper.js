/**
 * Created by wdj on 2017/4/5.
 * AMapHelper
 */

import AMap from 'vue-amap'

const AMAP_KEY = '852aab7fa75594e4cd65a6d022f4977e'

// 插件
const AMAP_PLUGINS = [
  'AMap.Autocomplete',
  'AMap.PlaceSearch',
  'AMap.Scale',
  'AMap.OverView',
  'AMap.ToolBar',
  'AMap.MapType',
  'AMap.PolyEditor',
  'AMap.CircleEditor'
]

const UI_READY_TIME = 650

let initAMapApiLoaded = false
let loading = false
let uiInitTime = 0

export default {
  ready(fn) {
    if (initAMapApiLoaded) {
      fn && fn()
    } else {
      !loading && this.load()
      setTimeout(() => {
        if (typeof window.AMap !== 'undefined') {
          initAMapApiLoaded = true
        }
        this.ready(fn)
      }, 50)
    }
  },
  UIReady(fn, uTime = UI_READY_TIME) {
    uiInitTime = Date.now()
    this.ready(() => {
      let xTime = Date.now() - uiInitTime
      if (xTime >= uTime) {
        fn && fn()
      } else {
        setTimeout(() => {
          fn && fn()
        }, uTime - xTime)
      }
    })
  },
  load() {
    if (!loading) {
      // 初始化vue-amap
      AMap.initAMapApiLoader({
        // 高德的key
        key: AMAP_KEY,
        // 插件集合
        plugin: AMAP_PLUGINS
      })
      loading = true
    }
  }
}
