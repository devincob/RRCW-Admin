// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import ICaiWu from './libs/icaiwu'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/app.scss'

import './libs/directives'

import App from './App'
import router from './router'
import store from './store'
import model from './model'

import AMap from 'vue-amap'
import AMapHelper from './libs/AMapHelper'

Vue.use(ElementUI)
Vue.use(ICaiWu, {
  model
})

// 引入vue-amap
Vue.use(AMap)

Vue.component('EChart', ECharts)

process.env.NODE_ENV === 'development' && process.env.MOCK_JS && require('../mock')

Vue.config.productionTip = !(process.env.NODE_ENV === 'development')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted(){
    AMapHelper.load()
  }
})
