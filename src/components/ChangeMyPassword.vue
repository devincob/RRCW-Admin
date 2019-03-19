<template>
  <el-form ref="form" :model="form" size="mini" >
    <el-form-item prop="password" label="旧密码" :rules="{required: true, message: '旧密码不能为空'}">
      <el-input name="password" v-model="form.password" placeholder="当前账号的登录密码"/>
    </el-form-item>
    <el-form-item prop="newPassword" label="新密码" :rules="{required: true, message: '新密码不能为空'}">
      <el-input v-model="form.newPassword" placeholder="您要设置的新密码"/>
    </el-form-item>
    <el-form-item prop="rePassword" label="确认密码" :rules="{required: true, validator: checkPassword}">
      <el-input v-model="form.rePassword" placeholder="再输入一次新密码"/>
    </el-form-item>
    <el-form-item class="text-right">
      <el-button type="primary" :loading="loading" @click="onSaveNewPassword">保存密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'change-my-password',
  data(){
    return {
      loading: false,
      form: {
        password: '',
        newPassword: '',
        rePassword: ''
      }
    }
  },
  methods: {
    checkPassword (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    async onSaveNewPassword(){
      try {
        await this.$refs.form.validate()
        this.loading = true
        const isChanged = await this.$$main.userUpdatePwd({
          'oldPwd': this.form.password,
          'newPwd': this.form.newPassword
        })
        if (isChanged) {
          this.$message.success('恭喜你，密码修改完成')
          this.$emit('change-success')
        }
        this.loading = false
      } catch (e){
        this.loading = false
        e && e.message && this.$message.error(e.message)
      }
    }
  }
}
</script>

<style scoped>

</style>
