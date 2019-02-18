<template>
  <x-page breadcrumb="auto" title="用户详情">
    <div class="clearfix">
      <el-row :gutter="20">
        <el-col :md="12" style="max-width: 480px;">
          <el-card class="el-card-mini no-border-radius no-box-shadow" >
            <div slot="header">认证信息</div>
            <el-form label-position="top" size="mini" label-width="80px">
              <el-form-item label="身份证正反面" class="id-card-upload">
                <el-upload
                  class="avatar-uploader"
                  :action="$config.getUploadUrl()"
                  :show-file-list="false"
                  :on-success="(res, file)=>handleAvatarSuccess(res, file, 'F')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="cardURLs.F" :src="cardURLs.F" class="avatar"/>
                  <i v-else class="el-icon-upload avatar-uploader-icon"> 上传身份证正面</i>
                </el-upload>

                <el-upload
                  class="avatar-uploader ml-lg"
                  :action="$config.getUploadUrl()"
                  :show-file-list="false"
                  :on-success="(res, file)=>handleAvatarSuccess(res, file, 'B')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="cardURLs.B" :src="cardURLs.B" class="avatar"/>
                  <i v-else class="el-icon-upload avatar-uploader-icon"> 上传身份证反面</i>
                </el-upload>

              </el-form-item>
              <el-form-item label="手持身份证正面">
                <el-upload
                  class="avatar-uploader"
                  :action="$config.getUploadUrl()"
                  :show-file-list="false"
                  :on-success="(res, file)=>handleAvatarSuccess(res, file, 'H')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="cardURLs.H" :src="cardURLs.H" class="avatar"/>
                  <i v-else class="el-icon-upload avatar-uploader-icon"> 上传手持身份证正面</i>
                </el-upload>
              </el-form-item>
              <el-form-item label="资质证书">
                <el-upload
                  class="avatar-uploader"
                  :action="$config.getUploadUrl()"
                  :show-file-list="false"
                  :on-success="(res, file)=>handleAvatarSuccess(res, file, 'C')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="cardURLs.C" :src="cardURLs.C" class="avatar"/>
                  <i v-else class="el-icon-upload avatar-uploader-icon"> 上传资质证书</i>
                </el-upload>
              </el-form-item>
              <el-form-item label="头像证件照">
                <el-upload
                  class="avatar-uploader"
                  :action="$config.getUploadUrl()"
                  :show-file-list="false"
                  :on-success="(res, file)=>handleAvatarSuccess(res, file, 'T')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="cardURLs.T" :src="cardURLs.T" class="avatar"/>
                  <i v-else class="el-icon-upload avatar-uploader-icon"> 上传头像证件照</i>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :md="12">
          <el-card class="el-card-mini no-border-radius no-box-shadow ">
            <div slot="header" class="clearfix">
              个人信息
              <!--<el-button style="float: right; padding: 3px 0" type="text">保存信息</el-button>-->
            </div>
            <el-form ref="form" @submit.native.stop.prevent="onSubmitUserInfo" :model="userInfo" label-width="100px" size="mini">
              <el-form-item label="姓名：" prop="userName" :rules="{required: true, message: '姓名为必填项'}">
                <el-input v-model="userInfo.userName" placeholder="身份证上的姓名" style="width: 120px"/>
              </el-form-item>
              <el-form-item label="身份证号：" prop="iDcard" :rules="{required: true, message: '身份证号为必填项'}">
                <el-input v-model="userInfo.iDcard" placeholder="正式的身份证号码" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="性别：">
                <el-radio-group v-model="userInfo.sex">
                  <el-radio label="M">男</el-radio>
                  <el-radio label="F">女</el-radio>
                  <el-radio label="U">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工作年限：" prop="workYear" :rules="{required: true, message: '工作年限为必填项'}">
                <el-input v-model="userInfo.workYear" placeholder="运营填写" style="width: 200px"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
              </el-form-item>
              <el-form-item label="手机号码：">
                {{userInfo.mobile}}
              </el-form-item>
              <el-form-item label="注册时间：">
                {{userInfo.formatRegisterTime}}
              </el-form-item>
              <el-form-item label="好评率：">
                <el-progress style="margin-top:5px;width:200px;" :percentage="userInfo.score || 100"/>
              </el-form-item>
              <el-form-item label="审核状态：">
                <span class="mr-xl" :class="{
                'text-success':userInfo.status === 'PA',
                'text-danger':userInfo.status === 'UP'
                }">{{statusText[userInfo.status] || '待提交'}}</span>
                <template v-if="['PA', 'UP'].indexOf(userInfo.status) !== -1">
                  <el-button type="primary" v-if="userInfo.status === 'PA' || userInfo.status === 'UP'" @click="onUpdateUserStatus('CT')">重新审核</el-button>
                </template>
                <template v-else-if="userInfo.status">
                  <el-button type="success" v-if="userInfo.status !== 'PA'" @click="onUpdateUserStatus('PA')">审核通过</el-button>
                  <el-button type="danger" v-if="userInfo.status !== 'UP'" @click="onUpdateUserStatus('UP')">审核驳回</el-button>
                </template>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </x-page>
</template>

<script>
const defaultInfo = {
  userInfo: {
    userName: '',
    iDcard: '',
    workYear: '',
    sex: ''
  },
  cardURLs: {F: '', B: '', H: '', C: '', T: ''}
}
export default {
  name: 'user-detail',
  data(){
    return {
      uid: 0,
      userInfo: {...defaultInfo.userInfo},
      cardURLs: {...defaultInfo.cardURLs},
      statusText: {'': '全部', CT: '审核中', PA: '审核已通过', UP: '审核未通过'}
    }
  },
  watch: {
    uid(){
      // 用户ID改变时获取新数据
      this.loadUserDetail()
    }
  },
  methods: {
    async loadUserDetail(){
      this.userInfo = {...defaultInfo.userInfo}
      this.cardURLs = {...defaultInfo.cardURLs}
      const loader = this.$loading({
        background: 'rgba(0,0,0,0)',
        text: '正在加载用户数据'
      })
      try {
        const userInfo = await this.$$main.aUserCUserInfo({
          userId: this.uid
        })
        this.userInfo = userInfo
        if (userInfo.cardURLs) {
          this.cardURLs.F = userInfo.cardURLs[0]
          this.cardURLs.B = userInfo.cardURLs[1]
          this.cardURLs.H = userInfo.cardURLs[2]
        }
        this.cardURLs.C = userInfo['certificateURL']
        this.cardURLs.T = userInfo['headerPhotoURL']
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        setTimeout(() => {
          loader.close()
        }, 450)
      }
    },
    async handleAvatarSuccess(res, file, type){
      try {
        if (!res || !res.isSuccess) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error((res && res.message) || '')
        }
        this.cardURLs[type] = res.body.fileUrl
        await this.$$main.aUserSaveCertificates({
          // 证件照
          'certificatesURL': res.body.fileUrl,
          // 证件类型(F:身份证正面,B:身份证背面,H:身份证手持,C:资质证书,T:头像证件)
          'type': type,
          // 用户编号
          'userId': this.uid
        })
        this.$message.success('上传成功！')
      } catch (e) {
        this.$message.error((e && e.message) || '上传失败')
      }
      this.loader && this.loader.close()
    },
    beforeAvatarUpload(){
      this.loader = this.$loading({text: '正在上传'})
    },
    onPageShow(){
      this.uid = this.$route.query.uid || 0
    },
    /**
     * 保存用户信息
     * @returns {Promise<void>}
     */
    async onSubmitUserInfo(){
      let loader
      try {
        await this.$refs.form.validate()
        loader = this.$loading({text: '正在保存', target: this.$refs.form.$el})
        await this.$$main.aUserUpdateCUserInfo({
          userId: this.uid,
          'userName': this.userInfo.userName,
          'iDcard': this.userInfo.iDcard,
          'sex': this.userInfo.sex,
          'workYear': this.userInfo.workYear
        })
        this.$message.success('保存成功！')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader && loader.close()
      }
    },
    // 更新审核状态
    async onUpdateUserStatus(status){
      const loader = this.$loading({text: '正在保存', target: this.$refs.form.$el})
      try {
        await this.$$main.aUserUpdateCAuditStatus({
          userId: this.uid,
          status
        })
        this.userInfo.status = status
        this.$message.success('操作成功')
      } catch (e) {
        this.$message.error(e.message || '操作失败')
      } finally {
        loader.close()
      }
    }
  }
}
</script>

<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 16px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    /*width: 178px;*/
    /*height: 178px;*/
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .id-card-upload .el-form-item__content{
    display: flex;
  }
</style>
