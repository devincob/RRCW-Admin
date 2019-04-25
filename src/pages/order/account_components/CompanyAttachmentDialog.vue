<template>
  <el-dialog
    title="站点实际注册信息"
    :visible.sync="companyAttachmentDialogDisplay"
    :close-on-click-modal="false"
    custom-class="company-attachment-dialog"
    width="500px"
    center
  >
    <el-form
      ref="companyAttachmentForm"
      :model="companyAttachmentForm"
      label-width="0"
      size="small"
    >
      <el-form-item class="input-item">
        <span>站点名称</span>
        <el-input
          v-model="companyAttachmentForm.companyName"
          placeholder="请输入站点营业执照名称"
        />
      </el-form-item>
      <el-form-item class="input-item">
        <span>站点地址</span>
        <el-input
          v-model="companyAttachmentForm.companyAddress"
          placeholder="请输入站点营业执照注册地址"
        />
      </el-form-item>
      <el-form-item class="input-item">
        <span>公司电话</span>
        <el-input
          v-model="companyAttachmentForm.companyPhone"
          placeholder="请输入站点注册电话"
        />
      </el-form-item>
      <el-form-item class="input-item">
        <span>开户银行</span>
        <el-input
          v-model="companyAttachmentForm.accountBank"
          placeholder="请输入站点开户银行"
        />
      </el-form-item>
      <el-form-item class="input-item">
        <span>开户银行账号</span>
        <el-input
          v-model="companyAttachmentForm.accountBankAccount"
          placeholder="请输入站点开户银行账号"
        />
      </el-form-item>
      <el-form-item class="input-item">
        <span>税号</span>
        <el-input
          v-model="companyAttachmentForm.taxNo"
          placeholder="请输入站点税号"
        />
      </el-form-item>
      <el-row>
        <el-col
          :span="11"
          :offset="1"
        >上传网银U盾（序列号）</el-col>
        <el-col
          :span="11"
          :offset="1"
        >上传公章照片</el-col>
      </el-row>
      <el-row>
        <el-col
          :span="11"
          :offset="1"
        >
          <el-form-item class="account-upload">
            <div>
              <upload-files
                @success="url => companyAttachmentForm.ukeyImgUrl = url">
                <x-image
                  v-if="companyAttachmentForm.ukeyImgUrl"
                  :src="companyAttachmentForm.ukeyImgUrl"
                  class="avatar"
                />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="display: block"
                ></i>
              </upload-files>
              <preview-button
                type="text"
                size="mini"
                always-show
                new-window-open
                :src="companyAttachmentForm.ukeyImgUrl"
                v-if="companyAttachmentForm.ukeyImgUrl"
              >查看原文件</preview-button>
              <preview-button
                type="text"
                size="mini"
                :src="companyAttachmentForm.ukeyImgUrl"
                v-if="companyAttachmentForm.ukeyImgUrl"
              >预览原文件</preview-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col
          :span="11"
          :offset="1"
        >
          <el-form-item class="account-upload">
            <div>
              <upload-files
                @success="url => companyAttachmentForm.stampImgUrl = url">
                <x-image
                  v-if="companyAttachmentForm.stampImgUrl"
                  :src="companyAttachmentForm.stampImgUrl"
                  class="avatar"
                />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="display: block"
                ></i>
              </upload-files>
              <preview-button
                type="text"
                size="mini"
                always-show
                new-window-open
                :src="companyAttachmentForm.stampImgUrl"
                v-if="companyAttachmentForm.stampImgUrl"
              >查看原文件</preview-button>
              <preview-button
                type="text"
                size="mini"
                :src="companyAttachmentForm.stampImgUrl"
                v-if="companyAttachmentForm.stampImgUrl"
              >预览原文件</preview-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="11"
          :offset="1"
        >上传营业执照</el-col>
        <el-col
          :span="11"
          :offset="1"
        >上传国地税三方协议PDF</el-col>
      </el-row>
      <el-row>
        <el-col
          :span="11"
          :offset="1"
        >
          <el-form-item class="account-upload">
            <div>
              <upload-files
                @success="url => companyAttachmentForm.licenseImgUrl = url">
                <x-image
                  v-if="companyAttachmentForm.licenseImgUrl"
                  :src="companyAttachmentForm.licenseImgUrl"
                  class="avatar"
                />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="display: block"
                ></i>
              </upload-files>
              <preview-button
                type="text"
                size="mini"
                always-show
                new-window-open
                :src="companyAttachmentForm.licenseImgUrl"
                v-if="companyAttachmentForm.licenseImgUrl"
              >查看原文件</preview-button>
              <preview-button
                type="text"
                size="mini"
                :src="companyAttachmentForm.licenseImgUrl"
                v-if="companyAttachmentForm.licenseImgUrl"
              >预览原文件</preview-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col
          :span="11"
          :offset="1"
        >
          <el-form-item class="account-upload">
            <div>
              <upload-files
                @success="url => companyAttachmentForm.taxAgreementPDFUrl = url">
                <x-image
                  v-if="companyAttachmentForm.taxAgreementPDFUrl"
                  :src="companyAttachmentForm.taxAgreementPDFUrl"
                  class="avatar"
                />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="display: block"
                ></i>
              </upload-files>
              <preview-button
                type="text"
                size="mini"
                always-show
                new-window-open
                :src="companyAttachmentForm.taxAgreementPDFUrl"
                v-if="companyAttachmentForm.taxAgreementPDFUrl"
              >查看原文件</preview-button>
              <preview-button
                type="text"
                size="mini"
                :src="companyAttachmentForm.taxAgreementPDFUrl"
                v-if="companyAttachmentForm.taxAgreementPDFUrl"
              >预览原文件</preview-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
        <el-button @click="companyAttachmentDialogDisplay = false">取消</el-button>
        <el-button
          type="primary"
          @click="editCompanyAttachment"
        >确认</el-button>
      </span>
  </el-dialog>
</template>

<script>
import PreviewButton from '../../../components/PreviewButton'
import UploadFiles from '../../../components/UploadFiles'
export default {
  name: 'company-attachment-dialog',
  components: {PreviewButton, UploadFiles},
  props: ['info'],
  data(){
    return {
      companyAttachmentDialogDisplay: false,
      companyAttachmentForm: {
        orderId: '', // 订单Id
        ukeyImgUrl: '', // U盾图片路径
        stampImgUrl: '', // 公章图片路径
        licenseImgUrl: '', // 营业执照图片路径
        taxAgreementPDFUrl: '', // 国地税协议三方PDF
        companyAddress: '', // 站点地址
        taxNo: '', // 税号
        companyPhone: '', // 公司电话
        accountBank: '', // 开户银行
        accountBankAccount: '', // 开户银行账号
        companyName: '' // 站点名称
      }
    }
  },
  methods: {
    show(){
      this.info.companyAttachment && (this.companyAttachmentForm = JSON.parse(JSON.stringify(this.info.companyAttachment)))
      this.companyAttachmentDialogDisplay = true
    },
    async editCompanyAttachment() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.companyAttachmentForm.orderId = this.info.orderInfo.orderId
        await this.$$main.orderEditCompanyAttachment(this.companyAttachmentForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('saved')
        this.companyAttachmentDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
