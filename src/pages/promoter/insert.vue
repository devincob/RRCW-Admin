<template>
    <x-page breadcrumb="auto" title="新增推广商">
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
          <el-form-item label="推广商名称" prop="promoterName">
            <el-input v-model="form.promoterName" placeholder="推广商名称"/>
          </el-form-item>
          <el-form-item label="推广商电话" prop="phone">
            <el-input v-model="form.phone" placeholder="推广商状态"/>
          </el-form-item>
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="form.loginName" placeholder="登录账号"/>
          </el-form-item>
          <el-form-item label="登录密码" prop="loginPwd">
            <el-input v-model="form.loginPwd" placeholder="登录密码"/>
          </el-form-item>
          <el-form-item label="推广商等级" prop="promoterLevelId">
            <el-select v-model="form.promoterLevelId" placeholder="请选择推广商状态" >
              <el-option
                v-for="item in levelList"
                :key="item.promoterLevelId"
                :label="item.promoterLevelName"
                :value="item.promoterLevelId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推广商状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择推广商状态" >
              <el-option
                v-for="item in status"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </x-page>
</template>

<script>
export default {
  name: 'insert',
  data() {
    return {
      form: {
        promoterName: '', // 姓名
        loginName: '', // 登录名
        loginPwd: '', // 密码
        promoterLevelId: '', // 等级
        status: 'N', // 状态(N/D)
        phone: '', // 电话
        promoterUserId: '' // 编号
      },
      rules: {
        promoterName: [
          { required: true, message: '请输推广商名称', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入推广商电话', trigger: 'change' }
        ],
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'change' }
        ],
        loginPwd: [
          { required: true, message: '请输入登录密码', trigger: 'change' }
        ],
        promoterLevelId: [
          { required: true, message: '请选择推广商等级', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择推广商状态', trigger: 'change' }
        ]
      },
      levelList: [],
      status: [
        {
          key: 'N',
          value: '正常'
        },
        {
          key: 'D',
          value: '禁用'
        }
      ]
    }
  },
  methods: {
    async queryLevelList(){
      try {
        this.levelList = await this.$$main.promoterQueryListLevel()
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    onSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.savePromoter()
        }
      })
    },
    async savePromoter(){
      const loading = this.$loading({
        text: '正在保存',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.promoterDoSave(this.form)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.trainFormDialog = false
        this.formClear()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    formClear(){
      this.form = {
        promoterName: '', // 姓名
        loginName: '', // 登录名
        loginPwd: '', // 密码
        promoterLevelId: '', // 等级
        status: '', // 状态(N/D)
        phone: '', // 电话
        promoterUserId: '' // 编号
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    }
  },
  mounted() {
    this.queryLevelList()
  }
}
</script>
