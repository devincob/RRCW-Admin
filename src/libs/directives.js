// 让 dialog 支持鼠标拖动
import Vue from 'vue'
import jQueyr from 'jquery'

const MSIE = (/Trident|IE/i.test(navigator.userAgent))

/**
 * 指令
 * 使 Dialog 可移动
 */
Vue.directive('drag-dialog', {
  update(el, binding){
    if (MSIE) return
    if (!binding.value || !binding.value.reset) return
    let dialog = el.querySelector('.el-dialog')
    if (el.hasAttribute('margin-top') && el.style.display === 'none') {
      dialog.style.margin = null
      dialog.style.marginTop = el.getAttribute('margin-top')
      dialog.style.left = null
      dialog.style.top = null
    }
  },
  inserted (el, binding) {
    if (MSIE) return
    let header = el.querySelector('.el-dialog__header')
    let dialog = el.querySelector('.el-dialog')
    let $header = jQueyr(header)
    let $dialog = jQueyr(dialog)
    let $body = jQueyr(document.body)
    let status = 0
    let offsetLeft
    let offsetTop
    if (header) {
      el.setAttribute('margin-top', dialog.style.marginTop)
      $header.addClass('v-drag-header')
      $header.on('mousedown', el.onmousedown = e => {
        if (e.target.className.indexOf('v-drag-header') !== -1){
          status = 1
          offsetLeft = e.pageX - dialog.offsetLeft
          offsetTop = e.pageY - dialog.offsetTop
          $dialog.addClass('v-drag-dialog')
          if (!dialog.style.left) {
            dialog.style.margin = 'initial'
            dialog.style.top = (e.pageY - offsetTop) + 'px'
            dialog.style.left = (global.innerWidth - dialog.offsetWidth) / 2 + 'px'
          }
        }
      })
      $body.on('mousemove', el.onmousemove = e => {
        if (status) {
          let left = (e.pageX - offsetLeft)
          let top = (e.pageY - offsetTop)
          if (binding.value && binding.value.range && binding.value.range === 'body') {
            if (top + dialog.offsetHeight > global.innerHeight) top = global.innerHeight - dialog.offsetHeight
            if (left + dialog.offsetWidth > global.innerWidth) left = global.innerWidth - dialog.offsetWidth
            if (top < 0) top = 0
            if (left < 0) left = 0
          }
          dialog.style.top = top + 'px'
          dialog.style.left = left + 'px'
        }
      })
      $body.on('mouseup', el.onmouseup = e => {
        if (status) {
          status = 0
          $dialog.removeClass('v-drag-dialog')
        }
      })
    }
  },
  unbind (el) {
    if (MSIE) return
    let header = el.querySelector('.el-dialog__header')
    if (header) header.removeEventListener('mousedown', el.onmousedown)
    document.body.removeEventListener('mousemove', el.onmousemove)
    document.body.removeEventListener('mouseup', el.onmouseup)
    el.onmousedown = null
    el.onmouseup = null
    el.onmousemove = null
  }
})

/**
 * 指令
 * 限制只能输入纯数字,不能输入小数点,符号
 * 需要在组件中手动注册
 * directives: {
    NumberInput
  }
 * v-number-input
 */
export const NumberInput = {
  inserted(el){
    el.onkeydown = function (e) {
      if (e.shiftKey) {
        e.preventDefault()
        return false
      }
      if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) return true
      if ((e.keyCode > 47 && e.keyCode < 57) || (e.keyCode > 95 && e.keyCode < 106) || [8].indexOf(e.keyCode) >= 0) return true
      e.preventDefault()
      return false
    }
  }
}

Vue.directive('NumberInput', NumberInput)
