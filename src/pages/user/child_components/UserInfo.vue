<template>
  <div style="max-width:1200px" v-if="formInfo">
    <el-card class="no-box-shadow" style="border-bottom-width: 1px">
      <div slot="header" style="display:flex;align-items: center;justify-content:space-between">
        <div style="width:200px">基本信息</div>
        <div style="width:400px;text-align:right">
          <template v-if="formInfo.userStatus !== 'C'">
            <el-button @click="changeUserStatus(formInfo.userStatus)" type="primary" size="mini" plain>{{formInfo.userStatus === 'N' ? '封号' : '解封'}}</el-button>
            <el-button
              @click="changeOrderStatus(formInfo.orderStatus)"
              type="primary"
              size="mini"
              plain>{{formInfo.orderStatus === 'N' ? '禁止抢单' : '允许抢单'}}</el-button>
            <el-button type="primary" size="mini" plain @click="logoutUserAccount">注销账号</el-button>
          </template>
          <el-button type="primary" size="mini" @click="submitForm('formUserInfo')">保存</el-button>
        </div>
      </div>
      <el-row>
        <el-form
          ref="formUserInfo"
          :model="formInfo"
          label-width="120px"
          size="mini">
          <el-col :span="12">
              <el-form-item label="用户编号：">
                {{workerUserId}}
              </el-form-item>
              <el-form-item label="绑定手机：">
                {{formInfo.mobilePhone}} <el-button type="text" size="mini" @click="changeUserMobile">更换手机</el-button>
              </el-form-item>
              <el-form-item label="姓名：">
                {{formInfo.realName}}
              </el-form-item>
              <el-form-item label="注册时间：">
                {{formInfo.formatRegisterTime}}
              </el-form-item>
              <el-form-item label="抢单资格：">
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
                <el-tag
                  size="mini"
                  :type="formInfo.userStatus === 'N' ? 'success':'danger'"
                >{{userStatusText[formInfo.userStatus]}}</el-tag>
                <el-button
                  @click="showStatusHistory('user')"
                  type="text"
                  size="mini"
                  style="margin-left: 100px;">状态操作记录</el-button>
              </el-form-item>
              <el-form-item label="账户余额：">
                {{formInfo.amount|currency}}
              </el-form-item>
              <el-form-item label="契约精神：">
                {{formInfo.contractPoint}}分
              </el-form-item>
              <el-form-item label="订单统计：">
                执行中{{statistics.doingCount}}单，完成{{statistics.overCount}}单，取消{{statistics.cancelCount}}单
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后台备注：">
              <el-input
                type="textarea"
                v-model="formInfo.remark"
                placeholder="该备注C端用户不可见"
                style="width: 100%"
                rows="8"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
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

    <el-card class="no-box-shadow mt-lg" style="border-bottom-width: 1px">
      <div slot="header" style="display:flex;align-items: center;justify-content:space-between">
        <div style="width:200px">实名信息</div>
        <div style="width:400px;text-align:right">
          <el-button type="primary" size="mini" @click="submitForm('formRealInfo')">保存</el-button>
        </div>
      </div>
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
            <el-form-item label="性别：" prop="resource">
              <el-radio-group v-model="formInfo.sex">
                <el-radio label="M">男</el-radio>
                <el-radio label="F">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型：" prop="realNameType">
              <el-select :value="formInfo.realNameType" v-model="formInfo.realNameType">
                <el-option v-for="(title, cert) in realNameTypes" :key="cert" :label="title" :value="cert"/>
              </el-select>
            </el-form-item>
            <el-form-item label="证件编号：" prop="idCardNo">
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
      </el-form>
    </el-card>

    <el-card class="no-box-shadow mt-lg" style="border-bottom-width: 1px">
      <div slot="header" style="display:flex;align-items: center;justify-content:space-between">
        <div style="width:200px">线下认证</div>
        <div style="width:400px;text-align:right">
          <el-button type="primary" size="mini" @click="submitForm('formOfflineInfo')">保存</el-button>
        </div>
      </div>
      <el-form
        :model="formInfo"
        :rules="infoRules"
        ref="formOfflineInfo"
        size="mini"
        label-width="120px">
        <el-col :md="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="formInfo.userName" style="width: 200px"/>
          </el-form-item>
          <el-form-item prop="height" label="身高(厘米)：">
            <el-input v-model="formInfo.height" style="width: 200px"/>
          </el-form-item>
          <el-form-item prop="weight" label="体重(公斤)：">
            <el-input v-model="formInfo.weight" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="是否在校生：" prop="resource">
            <el-radio-group v-model="formInfo.isStudent">
              <el-radio label="D">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="常住城市：">
            <el-cascader :options="regions" v-model="userRegion" filterable style="width: 240px"></el-cascader>
          </el-form-item>
          <el-form-item label="常住地址：">
            <el-input v-model="formInfo.liveAddress" @click.native="$refs['searchMapModal'].open()" style="width: 240px"/>
            <search-map-modal
              :cityName="cityName"
              :default-address="formInfo.liveAddress"
              @searchDone="onSearchDone"
              ref="searchMapModal"
            />
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
          <el-form-item label="状态：">
            <el-radio-group v-model="formInfo.offlineQuality">
              <el-radio label="Y">通过</el-radio>
              <el-radio label="N">未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :md="12" style="border-left: 1px #ddd solid;">
          <h3 style="margin-left: 40px;">英语等级：</h3>
          <el-form-item label="级数：" align="left">
            <el-select v-model="formInfo.englishLevel" placeholder="请选择">
              <el-option label="无" :value="0"/>
              <el-option label="二级" :value="2"/>
              <el-option label="三级" :value="3"/>
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
          <h3 style="margin-left: 40px;">学历证书：</h3>
          <el-form-item label="学历：">
            <el-select v-model="formInfo.educationLevel">
              <el-option label="无" :value="0"/>
              <el-option label="小学" :value="1"/>
              <el-option label="初中" :value="2"/>
              <el-option label="高中" :value="3"/>
              <el-option label="大专" :value="4"/>
              <el-option label="本科" :value="5"/>
              <el-option label="硕士" :value="6"/>
              <el-option label="博士" :value="7"/>
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
          <h3 style="margin-left: 40px;">计算机能力：</h3>
          <el-form-item label="等级：">
            <el-select v-model="formInfo.computerLevel">
              <el-option label="无" :value="0"/>
              <el-option label="一级" :value="1"/>
              <el-option label="二级" :value="2"/>
              <el-option label="三级" :value="3"/>
              <el-option label="四级" :value="4"/>
            </el-select>
          </el-form-item>
          <!--computerImg-->
          <el-form-item label="证书图片：">
            <el-upload
              class="avatar-uploader"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :on-success="(res, file) => handleAvatarSuccess(res, file, 'computer')"
              :before-upload="beforeAvatarUpload">
              <x-image v-if="formInfo.computerImg" :src="formInfo.computerImg" class="avatar certificate"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <h3 style="margin-left: 40px;">普通话：</h3>
          <el-form-item label="等级：">
            <el-select v-model="formInfo.putonghuaLevel">
              <el-option label="无" :value="0"/>
              <el-option label="标准" :value="1"/>
              <el-option label="不标准" :value="2"/>
            </el-select>
          </el-form-item>
          <!--mandarinImg-->
          <el-form-item label="证书图片：">
            <el-upload
              class="avatar-uploader"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :on-success="(res, file) => handleAvatarSuccess(res, file, 'putonghua')"
              :before-upload="beforeAvatarUpload">
              <x-image v-if="formInfo.putonghuaImg" :src="formInfo.putonghuaImg" class="avatar certificate"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import SearchMapModal from '../../../components/SearchMapModal'
import {listToTree} from '../../../libs/utils'
export default {
  name: 'user-info',
  components: {SearchMapModal},
  props: {
    workerUserId: Number
  },
  data(){
    return {
      formInfo: {
        realNameType: 'I'
      },
      userRegion: [1049, 1050],
      cityName: '',
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
      realNameTypes: {I: '身份证', P: '护照', G: '港澳居民通行证', T: '台湾居民通行证'},
      realInfoRules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCardNo: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
        nation: [{ required: true, message: '请填写民族', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择出生年月', trigger: 'blur' }]
      },
      lifePhotos: [],
      idCards: [],
      backgroundPics: [],
      statistics: {
        cancelCount: 0,
        doingCount: 0,
        overCount: 0
      },
      statusHistory: [],
      statusHistoryCount: 0,
      statusHistoryPageIndex: 1,
      dialogTableVisible: false,
      regions: [],
      userStatusText: {N: '正常', D: '封号', C: '注销'}
    }
  },
  watch: {
    workerUserId(uid, oldUid) {
      if (uid !== oldUid && uid) {
        this.loadUserCInfoDetails()
        this.loadOrderStatistics()
      }
    },
    lifePhotos(photos) {
      this.formInfo.lifePhoto = photos.map(item => {
        return item.fileUrl
      })
    },
    backgroundPics(pics) {
      this.formInfo.backgroundPics = pics.map(item => item.fileUrl)
    },
    'userRegion'(val){
      if (val && val.length) {
        const l = ['liveProvinceId', 'liveCityId', 'liveDistrictId']
        l.forEach(k => {
          this.formInfo[k] = 0
        })
        for (let i = 0; i < val.length; i++) {
          this.formInfo[l[i]] = val[i]
        }
        let region = this.findRegionById(val[val.length - 1])
        if (region && region.length) {
          this.cityName = region.map(item => item.label).join('')
        }
      }
    },
    statusHistoryPageIndex(){
      this.loadStatusHistory()
    }
  },
  methods: {
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
        if (info.liveProvinceId) {
          this.userRegion = [info.liveProvinceId, info.liveCityId, info.liveDistrictId]
        }
        this.formInfo = {...this.formInfo, ...info}
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    changeUserMobile(){
      this.$prompt('请输入手机号码：', '修改绑定手机', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1[\d]{10}$/,
        inputErrorMessage: '手机号码格式不正确',
        inputPlaceholder: '请输入11位手机号'
      }).then(({ value }) => {
        this._mobilePhone = value
        return this.$$main.userDoCChangeMobile({
          'workerUserId': this.workerUserId,
          'newMobile': value
        })
      }).then(() => {
        this.formInfo.mobilePhone = this._mobilePhone
        this.$message.success('已修改该用户手机号码')
      }).catch((e) => {
        e && e.message && this.$message.error(e.message)
      })
    },
    beforeAvatarUpload() {
      this.loader = this.$loading({ text: '正在上传' })
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
          case 'computer':
            this.formInfo = {...this.formInfo, computerImg: res.body.imageUrl}
            break
          case 'putonghua':
            this.formInfo = {...this.formInfo, putonghuaImg: res.body.imageUrl}
            break
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loader && this.loader.close()
      }
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
    async loadOrderStatistics(){
      if (!this.workerUserId) return
      try {
        this.statistics = await this.$$main.userQueryListOrderStatistics({
          workerUserId: this.workerUserId
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
        this.statistics = {
          cancelCount: 0,
          doingCount: 0,
          overCount: 0
        }
      }
    },
    // 注销用户
    logoutUserAccount(){
      let loader
      this.$prompt('此操作将删除用户，并且不可恢复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入注销该用户原因',
        inputPattern: /[\s\S]+?/,
        inputErrorMessage: '请输入原因！'
      }).then((res) => {
        loader = this.$loading({
          lock: true,
          text: '保存中...'
        })
        return this.$$main.userDoCCancellation({
          'workerUserId': this.workerUserId,
          'cancellationReason': res.value
        })
      }).then(() => {
        loader && loader.close()
        this.$message.success('注销成功')
        setTimeout(window.close, 3000)
      }).catch((e) => {
        loader && loader.close()
        e.message && this.$message.error(e.message)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'formUserInfo') {
            this.saveCUserInfo()
          } else if (formName === 'formRealInfo') {
            this.saveRealNameInfo()
          } else if (formName === 'formOfflineInfo') {
            this.saveOfflineInfo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存用户基本信息
    async saveCUserInfo() {
      const info = {
        userId: this.workerUserId,
        remark: this.formInfo.remark
      }
      // ['remark'].forEach(key => {
      //   info[key] = this.formInfo[key]
      // })
      const loader = this.$loading({
        lock: true,
        text: '保存中...'
      })
      try {
        await this.$$main.userDoRemarkW(info)
        this.$message.success('信息已保存')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    // 保存线下认证信息
    async saveOfflineInfo(){
      const info = {
        workerUserId: this.workerUserId
      };
      ['userName', 'height', 'weight', 'isStudent', 'liveProvinceId', 'liveCityId', 'liveDistrictId', 'liveAddress', 'offlineQuality',
        'lifePhoto', 'backgroundPics', 'englishLevel', 'englishImg', 'educationLevel', 'educationImg',
        'healthImg', 'healthExpireTime', 'computerLevel', 'computerImg', 'putonghuaLevel', 'putonghuaImg'].forEach(key => {
        info[key] = this.formInfo[key]
      })
      const loader = this.$loading({
        lock: true,
        text: '保存中...'
      })
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
      ['realNameId', 'realName', 'realNameType', 'idCardNo', 'nation', 'birthday', 'photoUrl', 'sex'].forEach(key => {
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
    onSearchDone(info, regeocode) {
      let region = this.findRegionByCode(regeocode.addressComponent.adcode)
      this.formInfo.liveAddress = info.address
      if (region && region.length) {
        this.userRegion = region.map(item => item.value)
      }
    },
    async loadUserRegion(){
      try {
        let regions = this.$utils.Storage.get('regions')
        if (!regions) {
          let res = await this.$$main.userRegionList()
          regions = res.map(item => {
            return {
              label: item.districtName,
              value: item.distictId,
              pid: item.parentId,
              code: item.districtCode
            }
          })
          this.$utils.Storage.set('regions', regions, 3600)
        }
        this.sourceRegions = regions
        this.regions = listToTree(regions, 'value', 'pid', 'children', 1)
      } catch (e) {
        console.log(e)
      }
    },
    findRegionByCode(code){
      let region = this.sourceRegions && this.sourceRegions.filter(item => item.code === code)
      if (region && region.length) {
        if (region[0].pid > 1) {
          region = [...this.findRegionById(region[0].pid, 1), ...region]
        }
      }
      return region
    },
    findRegionById(pid, root = 0) {
      let arr = []
      let region = this.sourceRegions && this.sourceRegions.filter(item => {
        return item.value === pid
      })
      if (region && region.length) {
        arr.push(region[0])
        if (region[0].pid > root) {
          arr = [...this.findRegionById(region[0].pid), ...arr]
        }
      }
      return arr
    }
  },
  async mounted(){
    await this.loadOrderStatistics()
    await this.loadUserRegion()
    this.loadUserCInfoDetails()
  }
}
</script>

<style scoped>

</style>
