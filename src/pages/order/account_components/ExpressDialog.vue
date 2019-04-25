<template>
  <el-dialog
    title="交付物流信息"
    :visible.sync="expressDialogDisplay"
    :close-on-click-modal="false"
    width="500px"
    center
  >
    <el-form
      ref="expressForm"
      :model="expressForm"
      label-width="120px"
      size="small"
    >
      <el-form-item
        label="快递单号"
        prop="bankNo"
      >
        <el-input
          v-model="expressForm.expressNo"
          placeholder="快递单号"
        />
      </el-form-item>
      <el-form-item
        label="快递公司"
        prop="trainAmount"
      >
        <el-input
          v-model="expressForm.expressName"
          placeholder="快递公司"
        />
      </el-form-item>
      <el-form-item
        label="快递单回单截图"
        class="account-upload"
      >
        <div>
          <paste-upload-image
            @success="url => { expressForm.expressImgUrl = url }">
            <x-image v-if="expressForm.expressImgUrl" :src="expressForm.expressImgUrl" class="avatar" style="border-radius: 6px"/>
            <div v-else class="avatar-uploader">
              <div class="el-upload">
                <i class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
              </div>
            </div>
          </paste-upload-image>
          <preview-button
            type="text"
            size="mini"
            always-show
            new-window-open
            :src="expressForm.expressImgUrl"
            v-if="expressForm.expressImgUrl"
          >查看原文件</preview-button>
          <preview-button
            type="text"
            size="mini"
            :src="expressForm.expressImgUrl"
            v-if="expressForm.expressImgUrl"
          >预览原文件</preview-button>
        </div>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
        <el-button @click="expressDialogDisplay = false">取消</el-button>
        <el-button
          type="primary"
          @click="editExpress"
        >确认</el-button>
      </span>
  </el-dialog>
</template>

<script>
import PasteUploadImage from '../../../components/PasteUploadImage'
import PreviewButton from '../../../components/PreviewButton'
export default {
  name: 'express-dialog',
  components: {PasteUploadImage, PreviewButton},
  props: ['info'],
  data(){
    return {
      expressDialogDisplay: false,
      expressForm: {
        orderId: '', // 订单Id
        expressNo: '', // 快递单号
        expressImgUrl: '', // 快递单回单截图URL
        expressName: '顺丰快递' // 快递公司
      }
    }
  },
  methods: {
    show(){
      this.info.accountOrderExpress && (this.expressForm = JSON.parse(JSON.stringify(this.info.accountOrderExpress)))
      this.expressDialogDisplay = true
    },
    async editExpress() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.expressForm.orderId = this.info.orderInfo.orderId
        await this.$$main.orderAOEditExpress(this.expressForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('saved')
        this.expressDialogDisplay = false
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
