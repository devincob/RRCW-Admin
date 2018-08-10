import Axios from 'axios'
import {currency} from './filters'
import Utils from './utils'
import jQuery from 'jquery'
import Config from '../config'

import XPage from './components/XPage'
import Empty from './components/Empty'
import Image from './components/Image'
import Toast from './components/Toast'

let $toast$Vm

/**
 * 基于 animate.css 动画的封装
 * 动画效果参考 http://daneden.github.io/animate.css/
 * @param {String} animatedName 动画名
 * @param {Function} callback
 */
jQuery.fn.animated = function (animatedName, callback) {
  let el = this
  let $el = jQuery(el)
  let a = ('animated ' + animatedName).replace(/\s+/g, ' ')
  $el.on('webkitAnimationEnd', function () {
    $el.removeClass(a)
    typeof (callback) === 'function' && callback.call(el)
  })
  return $el.addClass(a)
}

export default {
  Config: Config,
  Utils: Utils,
  // Vue.ues(...)
  install(Vue, options) {
    // Vue.prototype['$native'] = Native;
    Vue.prototype['$config'] = Config
    Vue.prototype['$utils'] = Utils
    Vue.prototype['$http'] = Axios
    Vue.prototype.$$ = jQuery

    let modules = {}
    if (options && options.model) {
      let models = options.model
      for (let k in models) {
        if (!modules['$$' + k]) {
          // let _t = instance.execute
          // instance.execute = function (path, options) {
          //   return _t.apply(instance, [path, options])
          // }
          modules['$$' + k] = new models[k]()
        }
      }
    }

    Vue.prototype.$showToast = function (options) {
      if (!$toast$Vm) {
        const ToastC = Vue.extend(Toast)
        $toast$Vm = new ToastC({
          el: document.createElement('div')
        })
        document.body.appendChild($toast$Vm.$el)
      }
      $toast$Vm.push({
        autoClose: 1500,
        message: '',
        type: 'default',
        showTop: false,
        ...options
      })
    }
    const $toast = {};
    ['show', 'error', 'success', 'info', 'warning'].forEach(item => {
      $toast[item] = message => Vue.prototype.$showToast({message, type: item === 'show' ? 'default' : item})
    })
    Vue.prototype.$toast = $toast

    Vue.mixin({
      beforeCreate(){
        Object.assign(this, modules)
        this.$find = function (el) {
          return jQuery(this.$el).find(el)
        }
        this.$m = (name) => {
          return this['$$' + name]
        }
      },
      created() {
        if (this.$store && this.$store.state){
          this.$user = this.$store.state.user
        }
      },
      mounted() {
        this._timeouts = this._timeouts || []
        this._interval = this._interval || []
      },
      destroyed() {
        this._timeouts && this._timeouts.forEach(function (t) {
          clearTimeout(t)
        })
        this._interval && this._interval.forEach(function (t) {
          clearInterval(t)
        })
      },
      methods: {
        /**
         * setTimeout
         * @param fn
         * @param timeout
         */
        setTimeout(fn, timeout) {
          this._timeouts.push(setTimeout(fn, timeout))
        },

        /**
         * setInterval
         * @param fn
         * @param delay
         */
        setInterval(fn, delay) {
          this._interval.push(setInterval(fn, delay))
        }
      }
    })

    // Vue.filter('ms-img', this.getImageUrlPath);
    Vue.filter('currency', currency)
    Vue.filter('array2String', function (array) {
      return array.length === 1 ? array[0] : array.join(' ')
    })
    Vue.filter('json', function (array) {
      return JSON.stringify(array)
    })
    Vue.filter('formatDate', function (date, format) {
      return Utils.dateFormat(date, format)
    })
    Vue.component(XPage.name, XPage)
    Vue.component(Image.name, Image)
    Vue.component(Empty.name, Empty)

    Vue.component('icon', {
      props: {
        name: String,
        size: Number,
        color: String
      },
      computed: {
        styles: function () {
          let style = this.size ? {
            fontSize: this.size + 'px'
          } : {}
          if (this.color) style.color = this.color
          return style
        }
      },
      template: `<i :class="'icon icon-'+this.name" :style="styles"></i>`
    })

    /**
     * 获取图片访问url
     * @param {String} key 图片路径
     * @param {String} [size] 可选 large|middle|small
     * @param taskImage
     * @returns {*|String}
     */
    Vue.prototype.getUploadImageUrl = function (key, size = 'small', taskImage = 'N') {
      let query = ''
      if (key.startsWith('data:')) return key
      if (typeof key === 'function') key = key.call(this)
      if (typeof key === 'string' && key !== '') {
        if (key[0] !== '/') key = '/' + key
        if (size) {
          let dotPos = key.lastIndexOf('.')
          let ext = key.substr(dotPos)
          key = key.substr(0, dotPos) + '_' + size + ext
        }
        query = key
      } else {
        if (taskImage && taskImage === 'Y') {
          return Config.taskErrorImage
        } else {
          return Config.errorImage
        }
      }
      return Config.getImageUrlPath() + query
    }
  }
}
