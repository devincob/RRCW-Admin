<template>
  <x-page breadcrumb="auto" title="C端用户详情">
    <div style="max-width:1200px">
      <el-card>
        <div slot="header" style="display:flex;justify-content:space-between">
          <div style="width:200px">账号信息(用户编号：{{$route.query.uid}})</div>
          <div style="width:400px;text-align:right">
            <el-button @click="changeUserStatus(formInfo.userStatus)" type="primary" size="mini" plain>{{formInfo.userStatus === 'N' ? '封号' : '解封'}}</el-button>
            <el-button
              @click="changeOrderStatus(formInfo.orderStatus)"
              type="primary"
              size="mini"
              plain>{{formInfo.orderStatus === 'N' ? '禁止抢单' : '允许抢单'}}</el-button>
          </div>
        </div>
        <el-form
          :model="formInfo"
          :rules="infoRules"
          ref="formUserInfo"
          size="mini"
          label-width="120px">
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="绑定手机：">
                <router-link :to="'/order/suborders?phone=' + formInfo.mobilePhone" target="_blank">{{formInfo.mobilePhone}}</router-link>
              </el-form-item>
              <el-form-item label="姓名：" prop="userName">
                <el-input v-model="formInfo.userName" style="width: 200px"/>
              </el-form-item>
              <el-form-item prop="height" label="身高(厘米)：">
                <el-input v-model="formInfo.height" style="width: 200px"/>
              </el-form-item>
              <el-form-item prop="weight" label="体重(公斤)：">
                <el-input v-model="formInfo.weight" style="width: 200px"/>
              </el-form-item>

              <el-form-item label="性别：" prop="resource">
                <el-radio-group v-model="formInfo.sex">
                  <el-radio label="M">男</el-radio>
                  <el-radio label="F">女</el-radio>
                  <el-radio label="U">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否在校生：" prop="resource">
                <el-radio-group v-model="formInfo.isStudent">
                  <el-radio label="D">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="lifePhoto" class="el-form-upload" label="生活照：">
                <el-upload
                  ref="uploadPhoto"
                  :class="{'upload-limit-max': lifePhotos && lifePhotos.length >= 5}"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :limit="5"
                  list-type="picture-card"
                  :file-list="lifePhotos"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="(...args)=>handleRemove(...args, 'photo')"
                  :on-error="handleError"
                  :on-success="(res, file)=>handleLifePhotoSuccess(res, file, 'photo')"
                  :before-upload="beforeAvatarUpload"
                  class="upload-mini"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item prop="backgroundPics" class="el-form-upload" label="后台照片：">
                <el-upload
                  ref="backgroundPics"
                  :class="{'upload-limit-max': backgroundPics && backgroundPics.length >= 5}"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :limit="5"
                  list-type="picture-card"
                  :file-list="backgroundPics"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="(...args) => handleRemove(...args, 'back')"
                  :on-error="handleError"
                  :on-success="(res, file) => handleLifePhotoSuccess(res, file, 'back')"
                  :before-upload="beforeAvatarUpload"
                  class="upload-mini"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="注册时间：">
                {{formInfo.formatRegisterTime}}
              </el-form-item>
              <el-form-item label="账户余额：">
                {{formInfo.amount|currency}}
              </el-form-item>
              <el-form-item label="抢单资格：">
                <!--<el-radio-group v-model="formInfo.orderStatus">-->
                <!--<el-radio label="N">正常</el-radio>-->
                <!--<el-radio label="D">取消</el-radio>-->
                <!--</el-radio-group>-->
                <el-tag
                  size="mini"
                  :type="formInfo.orderStatus === 'N' ? 'success':'danger'"
                >{{formInfo.orderStatus === 'N' ? '允许' : '禁止'}}</el-tag>
                <el-button
                  @click="showStatusHistory('order')"
                  type="text"
                  size="mini"
                  style="margin-left: 100px;"
                >资格操作记录</el-button>
              </el-form-item>
              <el-form-item label="账号状态：">
                <!--<el-radio-group v-model="formInfo.userStatus">-->
                <!--<el-radio label="N">正常</el-radio>-->
                <!--<el-radio label="D">封号</el-radio>-->
                <!--</el-radio-group>-->
                <el-tag
                  size="mini"
                  :type="formInfo.userStatus === 'N' ? 'success':'danger'"
                >{{formInfo.userStatus === 'N' ? '正常' : '封号'}}</el-tag>
                <el-button
                  @click="showStatusHistory('user')"
                  type="text"
                  size="mini"
                  style="margin-left: 100px;">状态操作记录</el-button>
              </el-form-item>
              <el-form-item label="订单统计：">
                <el-tag
                  size="mini"
                  type="success">已完成：{{statistics.overCount}}</el-tag>
                <el-tag
                  size="mini"
                  type="danger">已取消：{{statistics.cancelCount}}</el-tag>
                <el-tag
                  size="mini"
                  type="warning">未完成：{{statistics.doingCount}}</el-tag>
              </el-form-item>
              <el-form-item
                label="备注：">
                <el-input
                  type="textarea"
                  v-model="formInfo.remark"
                  style="width: 100%"
                  rows="5"/>
              </el-form-item>
            </el-col>
            <el-col :md="12" style="border-left: 1px #ddd solid;">
              <h3 style="margin-left: 40px;">英语等级：</h3>
              <el-form-item label="级数：" align="left">
                <el-select v-model="formInfo.englishLevel" placeholder="请选择">
                  <el-option label="四级" :value="4"/>
                  <el-option label="六级" :value="6"/>
                  <el-option label="八级及以上" :value="8"/>
                </el-select>
              </el-form-item>
              <el-form-item label="证书：">
                <el-upload
                  class="avatar-uploader"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :on-success="(res, file) => handleAvatarSuccess(res, file, 'english')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="formInfo.englishImg" :src="formInfo.englishImg" class="avatar certificate"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <h3 style="margin-left: 52px;">健康证：</h3>
              <el-form-item label="有效期至：">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="formInfo.healthExpireTime"
                  type="date"
                  placeholder="选择日期：" style="width: 200px">
                </el-date-picker>
              </el-form-item>
              <!--healthImg-->
              <el-form-item label="证书图片：">
                <el-upload
                  class="avatar-uploader"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :on-success="(res, file) => handleAvatarSuccess(res, file, 'health')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="formInfo.healthImg" :src="formInfo.healthImg" class="avatar certificate"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <h3 style="margin-left: 40px;">学历证书：</h3>
              <el-form-item label="学历：">
                <el-select v-model="formInfo.educationLevel">
                  <el-option label="大专高职" :value="1"/>
                  <el-option label="本科" :value="2"/>
                  <el-option label="博士研究生" :value="3"/>
                  <el-option label="博士研究生及以上" :value="4"/>
                </el-select>
              </el-form-item>
              <!--educationImg-->
              <el-form-item label="证书图片：">
                <el-upload
                  class="avatar-uploader"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :on-success="(res, file) => handleAvatarSuccess(res, file, 'education')"
                  :before-upload="beforeAvatarUpload">
                  <x-image v-if="formInfo.educationImg" :src="formInfo.educationImg" class="avatar certificate"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="no-margin">
            <el-button
              @click="submitForm('formUserInfo')"
              type="primary"
              size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="el-card-mini no-border-radius no-box-shadow">
        <div slot="header">实名信息</div>
        <el-form
          :model="formInfo"
          :rules="realInfoRules"
          ref="formRealInfo"
          size="mini"
          label-width="100px">
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="姓名：" prop="realName">
                <el-input v-model="formInfo.realName" style="width: 220px;"/>
              </el-form-item>
              <el-form-item label="身份证号：" prop="idCardNo">
                <el-input v-model="formInfo.idCardNo" style="width: 220px;"/>
              </el-form-item>
              <el-form-item label="民族：" prop="nation">
                <el-input v-model="formInfo.nation" style="width: 220px;"/>
              </el-form-item>
              <el-form-item label="生日：" prop="birthday">
                <el-date-picker value-format="yyyy-MM-dd" v-model="formInfo.birthday" type="date" placeholder="选择日期：">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="状态：">
                <el-radio-group v-model="formInfo.realNameStatus">
                  <el-radio label="PA">通过</el-radio>
                  <el-radio label="UP">未通过</el-radio>
                  <!--<el-radio label="CT">审核中</el-radio>-->
                </el-radio-group>
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
                :on-error="handleError"
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
            <el-button @click="submitForm('formRealInfo')" type="primary" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <list-trade :user-id="workerUserId" />
      <spirit-of-contract :user-id="workerUserId" ref="contract" @btn-click="onSpiritOfContractDialog"/>
    </div>
    <el-dialog
      title="查看操作记录"
      :visible.sync="dialogTableVisible"
      width="800px"
      v-drag-dialog="{reset: true}"
      close-on-press-escape>
      <el-table
        :data="statusHistory"
        :highlight-current-row="true"
        :border="true">
        <el-table-column property="id" label="#"></el-table-column>
        <el-table-column property="newVal" label="新状态"></el-table-column>
        <el-table-column property="oldVal" label="旧状态"></el-table-column>
        <el-table-column property="remark" label="原因"></el-table-column>
        <el-table-column property="actionUserName" label="操作人"></el-table-column>
        <el-table-column property="actionTime" width="180" label="操作时间"></el-table-column>
      </el-table>
      <div style="width: 100%;clear: both;height: 40px">
        <el-pagination
          class="pull-right"
          layout="prev, pager, next"
          :page-size="5"
          :current-page.sync="statusHistoryPageIndex"
          :total="statusHistoryCount">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      title="添加备注"
      :visible.sync="eventDialogVisible"
      width="500px">
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
    <el-dialog v-drag-dialog="{reset: true}"
               close-on-press-escape
               title="调整契约精神分数"
               :visible.sync="changeSpiritOfContractDialog"
               width="500px">
      <el-form size="small" label-width="100px">
        <el-form-item label="调整分数：">
          <el-input-number :min="0" :max="100" v-model="spiritOfContract" :step="0.1"/>
        </el-form-item>
        <el-form-item label="调整原因：">
          <el-input type="textarea" :rows="4" v-model="spiritOfContractRemark" placeholder="请输入调整原因" style="width: 97%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="changeContractPoint">调整分数</el-button>
      </span>
    </el-dialog>
  </x-page>
</template>

<script>
import ListTrade from './ListTrade'
import SpiritOfContract from './SpiritOfContract'
export default {
  name: 'worker-user-detail',
  components: {
    SpiritOfContract, ListTrade
  },
  data() {
    return {
      changeSpiritOfContractDialog: false,
      spiritOfContract: 0,
      spiritOfContractRemark: '',
      eventDialogVisible: false,
      eventForm: {
        userId: '',
        remark: ''
      },
      eventRules: {
        remark: [
          { required: true, message: '请填写备注', trigger: 'change' }
        ]
      },
      workerUserId: 0,
      dialogTableVisible: false,
      statusHistory: [],
      statusHistoryCount: 0,
      statusHistoryPageIndex: 1,
      formInfo: {
        'remark': '',
        'mobilePhone': '',
        'userName': '',
        'headImage': '',
        'sex': '',
        'height': 0,
        'weight': 0,
        'isStudent': '',
        'registerTime': '',
        'formatRegisterTime': '',
        'orderStatus': '',
        'userStatus': '',
        'lifePhoto': '',
        'realName': '',
        'idCardNo': '',
        'nation|1': '',
        'birthday': '',
        'photoUrl': '',
        'realNameStatus': '',
        'amount': 0,
        'realNameId': 0,

        'backgroundPics': '',

        'englishLevel': null,
        'englishImg': null,
        'educationLevel': null,
        'educationImg': null,
        'healthExpireTime': '',
        'healthImg': null
      },
      lifePhotos: [],
      idCards: [],
      backgroundPics: [],
      infoRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        height: [
          { required: true, message: '请输入身高', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入体重', trigger: 'blur' }
        ]
        // lifePhoto: [
        //   { required: true, message: '请上传生活照', trigger: 'blur' }
        // ]
      },
      realInfoRules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCardNo: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
        nation: [{ required: true, message: '请填写民族', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择出生年月', trigger: 'blur' }]
      },
      statistics: {
        cancelCount: 0,
        doingCount: 0,
        overCount: 0
      }
    }
  },
  watch: {
    lifePhotos(photos) {
      this.formInfo.lifePhoto = photos.map(item => {
        return item.fileUrl
      })
    },
    backgroundPics(pics) {
      this.formInfo.backgroundPics = pics.map(item => item.fileUrl)
    },
    workerUserId(uid, oldUid) {
      if (uid !== oldUid && uid) {
        this.loadUserCInfoDetails()
      }
    },
    statusHistoryPageIndex() {
      this.loadStatusHistory()
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
        await this.$$main.userDoRemarkW(this.eventForm)
        this.eventDialogVisible = false
        this.$message({
          message: `用户备注成功`,
          type: 'success'
        })
        this.loadUserCInfoDetails()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'formUserInfo') this.saveCUserInfo()
          else if (formName === 'formRealInfo') this.saveRealNameInfo()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存用户基本信息
    async saveCUserInfo() {
      const info = {
        workerUserId: this.workerUserId,
        status: this.formInfo.userStatus
      };
      ['mobilePhone', 'userName', 'sex', 'height', 'weight', 'lifePhoto', 'isStudent', 'orderStatus', 'remark',
        'englishLevel', 'englishImg', 'educationLevel', 'educationImg', 'healthExpireTime', 'healthImg', 'backgroundPics'].forEach(key => {
        info[key] = this.formInfo[key]
      })
      const loader = this.$loading({
        lock: true,
        text: '保存用户信息中...'
      })
      // try {
      //   console.log(this.eventForm)
      //   await this.$$main.userDoRemarkW({ userId: this.workerUserId, remark: info.remark })
      //   this.eventDialogVisible = false
      //   this.$message({
      //     message: `用户备注成功`,
      //     type: 'success'
      //   })
      // } catch (e) {
      //   e.message && this.$message.error(e.message)
      // } finally {
      // }

      try {
        await this.$$main.userCSaveInfo(info)
        this.$message.success('信息已保存')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    // 保存实名认证信息
    async saveRealNameInfo() {
      const info = {
        workerUserId: this.workerUserId,
        status: this.formInfo.realNameStatus
      };
      ['realNameId', 'realName', 'idCardNo', 'nation', 'birthday', 'photoUrl'].forEach(key => {
        info[key === 'photoUrl' ? 'idCardUrl' : key] = this.formInfo[key]
      })
      const loader = this.$loading({
        lock: true,
        text: '保存用户认证信息中...'
      })
      try {
        await this.$$main.userSaveRealNameInfo(info)
        this.$message.success('信息已保存')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    async changeUserStatus(currentStatus) {
      try {
        const { value, action } = await this.$prompt('请输入封号/解封原因:', '操作提示', {
          inputValidator: (val) => {
            return val && val.length ? true : '请输入操作原因'
          }
        })
        if (action === 'confirm') {
          const nextStatus = currentStatus === 'N' ? 'D' : 'N'
          const loader = this.$loading({ text: '请稍等' })
          await this.$$main.userDoCChangeStatus({
            'userId': this.workerUserId,
            'status': nextStatus,
            'remark': value
          })
          loader.close()
          this.formInfo.userStatus = nextStatus
        }
      } catch (e) {
        console.error(e)
      }
    },
    async changeOrderStatus(currentStatus) {
      try {
        const { value, action } = await this.$prompt('请输入设置取消/正常抢单原因:', '操作提示', {
          inputValidator: (val) => {
            return val && val.length ? true : '请输入操作原因'
          }
        })
        if (action === 'confirm') {
          const nextStatus = currentStatus === 'N' ? 'D' : 'N'
          const loader = this.$loading({ text: '请稍等' })
          await this.$$main.userDoCChangeOrderStatus({
            'userId': this.workerUserId,
            'orderStatus': nextStatus,
            'remark': value
          })
          loader.close()
          this.formInfo.orderStatus = nextStatus
        }
      } catch (e) {
        console.error(e)
      }
    },
    async showStatusHistory(type) {
      this.dialogTableVisible = true
      this.showStatusHistoryType = type
      this.statusHistoryPageIndex = 1
      this.loadStatusHistory()
    },
    async loadStatusHistory() {
      // const loader = this.$loading({ text: '请稍等' })
      try {
        this.statusHistory = []
        const res = await this.$$main.userQueryChange({
          userType: 'W',
          'userId': this.workerUserId,
          // 抢单资格OrderStatus，账号状态Status
          'column': this.showStatusHistoryType === 'user' ? 'Status' : 'OrderStatus',
          pageSize: 5,
          pageIndex: this.statusHistoryPageIndex
        })
        this.statusHistoryCount = res.totalCount
        this.statusHistory = res.datas
        // loader.close()
      } catch (e) {
        // loader.close()
        console.error(e)
      }
    },
    async loadUserCInfoDetails() {
      const loader = this.$loading({
        lock: true,
        text: '加载用户信息中...'
      })
      try {
        const info = await this.$$main.userCInfoDetails({
          workerUserId: this.workerUserId
        })
        if (info.educationLevel === 0) {
          info.educationLevel = null
        }
        if (info.englishLevel === 0) {
          info.englishLevel = null
        }
        this.formInfo = info
        if (info.lifePhoto) {
          this.lifePhotos = info.lifePhoto.map(pic => {
            return {
              name: pic.substr(0 - pic.length - pic.lastIndexOf('.')),
              url: this.getUploadImageUrl(pic),
              fileUrl: pic
            }
          })
        } else {
          this.lifePhotos = []
        }
        if (info.backgroundPics) {
          this.backgroundPics = info.backgroundPics.map(pic => {
            return {
              name: pic.substr(0 - pic.length - pic.lastIndexOf('.')),
              url: this.getUploadImageUrl(pic),
              fileUrl: pic
            }
          })
        } else {
          this.backgroundPics = []
        }
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
    async handleLifePhotoSuccess(res, file, t) {
      try {
        if (!res || !res.isSuccess) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error((res && res.message) || '')
        }
        console.log(t)
        let obj = {
          uid: file.uid,
          name: file.name,
          size: file.size,
          status: file.status,
          url: this.getUploadImageUrl(res.body.imageUrl),
          fileUrl: res.body.imageUrl
        }
        if (t === 'back') {
          this.backgroundPics = [...this.backgroundPics, obj]
        } else {
          this.lifePhotos = [...this.lifePhotos, obj]
        }
        this.$message.success('上传成功！')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
        this.$refs.uploadPhoto.handleRemove(file)
      } finally {
        this.loader && this.loader.close()
      }
    },
    async handleAvatarSuccess(res, file, type){
      try {
        if (!res || !res.isSuccess) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error((res && res.message) || '')
        }
        switch (type) {
          case 'english':
            this.formInfo = {...this.formInfo, englishImg: res.body.imageUrl}
            break
          case 'health':
            this.formInfo = {...this.formInfo, healthImg: res.body.imageUrl}
            break
          case 'education':
            this.formInfo = {...this.formInfo, educationImg: res.body.imageUrl}
            break
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loader && this.loader.close()
      }
    },
    beforeAvatarUpload() {
      this.loader = this.$loading({ text: '正在上传' })
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
    handleError(e) {
      console.log(e)
    },
    onSpiritOfContractDialog(point){
      this.changeSpiritOfContractDialog = true
      this.spiritOfContract = point
    },
    async changeContractPoint(){
      const loader = this.$loading({
        lock: true,
        text: '请稍等...'
      })
      try {
        const res = await this.$$main.userDoChangeContract({
          'workerUserId': this.workerUserId,
          'changePoint': this.spiritOfContract,
          'changeReason': this.spiritOfContractRemark
        })
        res && this.$message.success('已调整！')
        this.$refs.contract.loadListContract()
        this.changeSpiritOfContractDialog = false
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    onPageShow() {
      this.workerUserId = this.$route.query.uid || 0
      this.eventForm.userId = this.$route.query.uid || 0
      if (!this.workerUserId) {
        this.$message.error('错误的参数！')
      }
      this.$$main.userQueryListOrderStatistics({
        workerUserId: this.workerUserId
      }).then(res => {
        this.statistics = res
        console.log(res)
      }).catch(() => {
        this.statistics = {
          cancelCount: 0,
          doingCount: 0,
          overCount: 0
        }
      })
    }
  },
  mounted() {
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload-list .el-upload-list__item {
  width: auto;
  min-width: 300px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
.id-card-upload .el-form-item__content {
  display: flex;
}

.upload-limit-max .el-upload.el-upload--picture-card {
  display: none;
}
.el-form-upload .el-form-item__content {
  margin-left: 0 !important;
}
  .certificate {
    max-width: 178px;
    max-height: 178px;
  }
</style>
