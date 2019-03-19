<template>
  <x-page breadcrumb="auto" title="用户详情">
    <div>
      <el-tabs v-model="activeTabName" type="border-card">
        <el-tab-pane name="info" label="账号信息">
          <el-form
            :model="formInfo"
            :rules="infoRules"
            ref="formUserInfo"
            size="mini"
            label-width="120px">
            <el-row :gutter="20">
              <el-col :md="12">
                <el-form-item label="用户编号：">
                  {{companyUserId}}
                </el-form-item>
                <el-form-item label="绑定手机：">
                  {{formInfo.loginName}}
                </el-form-item>
                <el-form-item v-if="formInfo.userType === 'C'" label="公司简称：">
                  <el-input v-model="formInfo.shortName" style="width: 200px"/>
                </el-form-item>
                <el-form-item v-if="formInfo.userType === 'C'" label="公司全称：" prop="companyUserName">
                  <el-input v-model="formInfo.companyUserName" style="width: 200px"/>
                </el-form-item>
                <el-form-item label="联系人：">
                  <el-input v-model="formInfo.contact" style="width: 200px"/>
                </el-form-item>
                <el-form-item label="联系电话：">
                  <el-input v-model="formInfo.contactPhone" style="width: 200px"/>
                </el-form-item>
                <el-form-item label="发单状态：">
                  <el-radio-group v-model="formInfo.orderStatus">
                    <el-radio label="N">正常</el-radio>
                    <el-radio label="D">取消</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="账号状态：">
                  <el-radio-group v-model="formInfo.status">
                    <el-radio label="N">正常</el-radio>
                    <el-radio label="D">封号</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="收藏夹服务：">
                  <span v-if="favoritesConfig.isOpen">
                    已开通，人数上限{{favoritesConfig.likeCountLimit}}人，有效期至{{favoritesConfig.likeServicesLimit}}
                  </span>
                  <span v-else>未开通</span>
                </el-form-item>
                <el-form-item label="订单确认时间：">
                  <el-input v-model="formInfo.autoPayHour" style="width: 200px"/>
                </el-form-item>
                <!--<el-form-item label="服务费：">-->
                  <!--<el-input v-model="formInfo.serviceChargeRate" style="width: 200px"/>-->
                <!--</el-form-item>-->
                <el-form-item label="授信额度：">
                  <el-input type="number" v-model="formInfo.creditLine" style="width: 200px"/>
                  <br>
                  <!-- <span style="font-size: 12px;color:#999;"> 可用授信额度：{{formInfo.residualCreditLine | currency}}</span> -->
                </el-form-item>
                <el-form-item label="可用授信：">
                  {{formInfo.residualCreditLine | currency}}
                </el-form-item>
                <el-form-item label="账户余额：">
                  {{formInfo.amount | currency}}
                </el-form-item>
                <el-form-item label="注册时间：">
                  {{formInfo.formatRegisterTime}}
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="formInfo.remark" style="width:400px" rows="5"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-upload
                  ref="uploadIdCard"
                  class="avatar-uploader"
                  :class="{'upload-limit-max': idCards && idCards.length >= 1}"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :limit="1"
                  :file-list="idCards"
                  list-type="picture-card"
                  :on-success="handleIdCardUploadSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemoveIDCard"
                  :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-col>
            </el-row>
            <el-form-item class="no-margin">
              <el-button @click="submitForm('formUserInfo')" type="primary" size="mini">保存</el-button>
              <!-- <el-button
                @click="remakeInfo"
                type="primary"
                size="mini"
              >备注</el-button> -->
              <!--<el-button @click="$router.go(-1)">返回列表</el-button>-->
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="trade" label="账户流水">
          <list-trade :user-id="companyUserId" account-type="C"/>
        </el-tab-pane>
        <el-tab-pane name="favorites" label="收藏夹">
          <company-favorites :user-id="companyUserId" @config-loaded="onFavoritesConfigLoaded"/>
        </el-tab-pane>
        <el-tab-pane name="blacklist" label="黑名单">
          <company-blacklist :user-id="companyUserId"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="添加备注"
      :visible.sync="eventDialogVisible"
      width="500px"
      center>
      <el-form
        ref="eventForm"
        :model="eventForm"
        :rules="eventRules"
        size="small"
        label-width="70px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="eventForm.remark" placeholder="请填写备注" type="textarea" :rows="4"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eventDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onHandleEvent">添加备注</el-button>
      </span>
    </el-dialog>
  </x-page>
</template>

<script>
import ListTrade from './ListTrade'
import CompanyFavorites from './child_components/CompanyFavorites'
import CompanyBlacklist from './child_components/CompanyBlacklist'

export default {
  name: 'company-user-detail',
  components: {CompanyBlacklist, CompanyFavorites, ListTrade},
  data() {
    return {
      activeTabName: 'info',
      eventDialogVisible: false,
      eventForm: {
        userId: '',
        remark: ''
      },
      eventRules: {
        remark: [
          {required: true, message: '请填写备注', trigger: 'change'}
        ]
      },
      companyUserId: 0,
      formInfo: {
        // 手机号码
        'remark': '',
        'contactPhone': '',
        // 姓名/公司名称
        'companyUserName': '@cname',
        // 用户类型(P:个人,C:企业用户)
        'userType': '',
        // 联系人
        'contact': '',
        // 公司简称
        'shortName': '',
        // 注册时间
        'formatRegisterTime': '',
        // 发单状态(N/D)
        'orderStatus': '',
        // 用户状态(N/D)
        'status': '',
        // 订单自动支付时间
        'autoPayHour': '',
        'serviceChargeRate': '',
        'creditLine': 0,
        'residualCreditLine': 0,
        'photoUrl': ''
      },
      infoRules: {
        userName: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ]
      },
      idCards: [],
      favoritesConfig: {}
    }
  },
  watch: {
    companyUserId(uid, oldUid) {
      if (uid !== oldUid && uid) {
        this.loadUserBInfoDetails()
      }
    },
    activeTabName(tabName) {
      location.hash = tabName
    }
  },
  methods: {
    remakeInfo() {
      this.eventForm.remark = this.formInfo.remark || ''
      this.eventDialogVisible = true
      this.$nextTick(() => {
        this.$refs['eventForm'].clearValidate()
      })
    },
    async onHandleEvent() {
      let valid = await this.$refs['eventForm'].validate()
      if (!valid) {
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.userDoRemarkC(this.eventForm)
        this.eventDialogVisible = false
        this.$message({
          message: `用户备注成功`,
          type: 'success'
        })
        this.loadUserBInfoDetails()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveBUserInfo()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeAvatarUpload() {
      this.loader = this.$loading({text: '正在上传'})
    },
    handleRemove(file, fileList) {
      this.lifePhotos = fileList
    },
    handleRemoveIDCard(file, fileList) {
      this.idCards = fileList
    },
    handlePictureCardPreview(file) {
      window.open(this.getUploadImageUrl(file.fileUrl, null))
    },
    async handleIdCardUploadSuccess(res, file) {
      try {
        if (!res || !res.isSuccess) {
          // this.idCards.pop()
          // noinspection ExceptionCaughtLocallyJS
          throw new Error((res && res.message) || '')
        }
        this.formInfo.photoUrl = res.body.imageUrl
        this.idCards = [{
          name: this.formInfo.photoUrl,
          fileUrl: this.formInfo.photoUrl,
          url: this.getUploadImageUrl(this.formInfo.photoUrl)
        }]
        this.$message.success('上传成功！')
      } catch (e) {
        this.$message.error((e && e.message) || '上传失败')
        this.$refs.uploadIdCard.handleRemove(file)
      } finally {
        this.loader && this.loader.close()
      }
    },
    // 保存用户基本信息
    async saveBUserInfo() {
      const info = {
        companyUserId: this.companyUserId
      }
      Object.keys(this.formInfo).forEach(key => {
        if (!['amount', 'loginName', 'formatRegisterTime'].includes(key)) info[key] = this.formInfo[key]
      })
      const loader = this.$loading({
        lock: true,
        text: '保存用户信息中...'
      })
      try {
        await this.$$main.userBSaveUserInfo(info)
        this.$message.success('信息已保存')
        this.loadUserBInfoDetails()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    async loadUserBInfoDetails() {
      const loader = this.$loading({
        lock: true,
        text: '加载用户信息中...'
      })
      try {
        const info = await this.$$main.userBInfo({
          companyUserId: this.companyUserId
        })
        this.formInfo = info
        if (info.photoUrl) {
          this.idCards = [{
            name: info.photoUrl,
            fileUrl: info.photoUrl,
            url: this.getUploadImageUrl(info.photoUrl)
          }]
        } else {
          this.idCards = []
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    onFavoritesConfigLoaded(config){
      this.favoritesConfig = config
    },
    onPageShow() {
      this.companyUserId = this.$route.query.cid || 0
      this.eventForm.userId = this.$route.query.cid || 0
      if (!this.companyUserId) {
        this.$message.error('错误的参数！')
      }
    }
  },
  mounted() {
    if (this.$route.hash && this.$route.hash.length > 2) {
      this.activeTabName = this.$route.hash.split('#')[1]
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload-list .el-upload-list__item {
    width: auto;
    min-width: 300px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .id-card-upload .el-form-item__content {
    display: flex;
  }

  .upload-limit-max .el-upload.el-upload--picture-card {
    display: none;
  }

  .el-form-upload .el-form-item__content {
    margin-left: 0 !important;
  }
</style>
