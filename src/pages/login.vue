<template>
  <x-page ref="page">
    <div style="max-width: 360px; margin: auto;padding-top: 100px;">
      <div class="farm-box login top-colors">
        <h1>
          你好！欢迎使用<br>人人财务交易管理系统
          <div class="logo"></div>
        </h1>
        <section style="text-align: left">
          <div id="ember1834" class="ember-view">
            <el-form :model="fromData" @submit.native.prevent="handleFormSubmit" ref="loginFrom" label-position="top" label-width="80px">
              <el-form-item prop="loginName" label="用户名" :rules="[{
                required: true, message: '用户名不能为空'
              }]">
                <el-input v-model="fromData.loginName" placeholder="手机号/ID/登录名"/>
              </el-form-item>
              <el-form-item prop="password" label="密码" :rules="{required: true, message: '密码不能为空'}">
                <el-input type="password" v-model="fromData.password" placeholder="登录密码"/>
              </el-form-item>
              <el-form-item class="verifyCode" prop="verifyCode" label="验证码" :rules="{required: true, message: '请输入图片中的内容'}">
                <el-col :span="10">
                  <el-input type="tel" v-model="fromData.verifyCode" style="width: 120px" placeholder="右侧图片字符"/>
                </el-col>
                <el-col :span="11">
                  <div v-if="!verifyCodeInfo.base64Image" class="verifyCodeImg">验证码图片</div>
                  <img v-else :src="verifyCodeInfo.base64Image" @click="verifyCode" class="verifyCodeImg" title="点击刷新验证码" alt="验证码图片">
                </el-col>
              </el-form-item>
              <p class="text-center">
                <el-button type="primary" native-type="submit" class="no-border no-border-radius"
                           :loading="loading">{{loading ? '登录中...' : '登录'}}</el-button>
              </p>
            </el-form>
          </div>
        </section>
      </div>
    </div>
  </x-page>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'login',
  $refs: {page: 0, loginFrom: 0},
  data() {
    return {
      loading: false,
      fromData: {
        loginName: '',
        password: '',
        verifyCode: ''
      },
      verifyCodeInfo: {}
    }
  },
  watch: {
    loading(status){
      // status ? this.$vux.loading.show('登录中') : this.$vux.loading.hide()
      if (status){
        this.loader = this.$loading({
          lock: true,
          background: 'rgba(255, 255, 255, 0.7)',
          target: '.farm-box',
          text: '登录中...'
        })
      } else {
        this.loader && this.loader.close()
      }
    }
  },
  methods: {
    ...mapActions(['setUserInfo', 'pullMenus']),
    async verifyCode(){
      try {
        const verifyCodeInfo = await this.$$main.commonCreateCode()
        if (verifyCodeInfo && !verifyCodeInfo.base64Image.startsWith('data:image')) {
          verifyCodeInfo.base64Image = 'data:image/jpg;base64,' + verifyCodeInfo.base64Image
        }
        this.verifyCodeInfo = verifyCodeInfo
      } catch (e) {
        console.error(e.message)
      }
    },
    async handleFormSubmit(e) {
      let redirect = this.$route.query['redirect'] || ''
      try {
        this.loading = true
        const isValid = await this.$refs.loginFrom.validate()
        if (!isValid) return
        const userInfo = await this.$$main.commonLogin({
          loginName: this.fromData.loginName,
          loginPwd: this.fromData.password,
          code: this.fromData.verifyCode,
          codeSn: this.verifyCodeInfo.codeSn
        })
        this.loading = false
        this.$message.success('登录成功')
        await this.setUserInfo(userInfo)
        await this.pullMenus()
        this.$router.replace(redirect || '/')
      } catch (e) {
        this.loading = false
        e.message && this.$message.error(e.message)
        this.verifyCode()
      }
    }
  },
  mounted(){
    this.$refs.page.setTitle('人人财务交易管理系统')
    this.verifyCode()
  }
}
</script>
