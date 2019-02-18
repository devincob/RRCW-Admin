<template>
  <div id="app">
    <transition name="vue-pop-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    const $body = this.$$(document.body)
    setTimeout(() => $body.addClass('x-app-ready'), 100)
    setTimeout(() => $body.addClass('x-app-loading-hide'), 400)
    // 处理登录已过期
    this.$$(document).on('login_expired', (e, err) => {
      this.$message.error(err.message || '登录已过期，请重新登录')
      setTimeout(() => {
        this.$confirm('是否重新登录?', err.message || '登录已过期，请重新登录', {
          confirmButtonText: '重新登录',
          callback: t => {
            if (t === 'confirm') {
              this.$store.dispatch('clearUserInfo')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
          }
        })
      }, 2000)
    })
  }
}
</script>
