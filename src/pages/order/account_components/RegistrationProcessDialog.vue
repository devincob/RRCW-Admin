<template>
  <el-dialog
    title="站点注册进度"
    :visible.sync="registrationProcessDialogDisplay"
    :close-on-click-modal="false"
    custom-class="registration-process-dialog"
    width="500px"
    center
  >
    <el-form
      ref="registrationProcessForm"
      :model="registrationProcessForm"
      label-width="130px"
      size="small"
    >
      <el-form-item
        label="核名完成时间"
        prop="checkNameCompletedTime"
      >
        <el-date-picker
          style="width: 300px !important;"
          v-model="registrationProcessForm.checkNameCompletedTime"
          type="datetime"
          value-format="yyyy/MM/dd HH:mm:ss"
          placeholder="核名完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="营业执照发放时间"
        prop="licenseTime"
      >
        <el-date-picker
          style="width: 300px !important;"
          v-model="registrationProcessForm.licenseTime"
          type="datetime"
          value-format="yyyy/MM/dd HH:mm:ss"
          placeholder="营业执照发放时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="银行开户时间"
        prop="bankOpenAccountTime"
      >
        <el-date-picker
          style="width: 300px !important;"
          v-model="registrationProcessForm.bankOpenAccountTime"
          type="datetime"
          value-format="yyyy/MM/dd HH:mm:ss"
          placeholder="银行开户时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="银行开户完成时间"
        prop="bankOpenAccountCompletedTime"
      >
        <el-date-picker
          style="width: 300px !important;"
          v-model="registrationProcessForm.bankOpenAccountCompletedTime"
          type="datetime"
          value-format="yyyy/MM/dd HH:mm:ss"
          placeholder="银行开户完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="核税完成时间"
        prop="checkTaxCompletedTime"
      >
        <el-date-picker
          style="width: 300px !important;"
          v-model="registrationProcessForm.checkTaxCompletedTime"
          type="datetime"
          value-format="yyyy/MM/dd HH:mm:ss"
          placeholder="核税完成时间"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
        <el-button @click="registrationProcessDialogDisplay = false">取消</el-button>
        <el-button
          type="primary"
          @click="editRegistrationProcess"
        >确认</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'registration-process-dialog',
  data(){
    return {
      registrationProcessDialogDisplay: false,
      registrationProcessForm: {
        orderId: '', // 订单Id
        checkNameCompletedTime: '', // 核名完成时间
        licenseTime: '', // 营业执照发放时间
        bankOpenAccountTime: '', // 银行开户时间
        bankOpenAccountCompletedTime: '', // 银行开户完成时间
        checkTaxCompletedTime: '', // 核税完成时间
        licenseUrl: '' // 营业执照Url
      }
    }
  },
  props: ['info'],
  methods: {
    show(){
      this.info.processInfo && (this.registrationProcessForm = {
        orderId: this.info.orderInfo.orderId, // 订单Id
        checkNameCompletedTime: this.info.processInfo.showCheckNameCompletedTime || '', // 核名完成时间
        licenseTime: this.info.processInfo.showLicenseTime || '', // 营业执照发放时间
        bankOpenAccountTime: this.info.processInfo.showBankOpenAccountTime || '', // 银行开户时间
        bankOpenAccountCompletedTime: this.info.processInfo.showBankOpenAccountCompletedTime || '', // 银行开户完成时间
        checkTaxCompletedTime: this.info.processInfo.showCheckTaxCompletedTime || '', // 核税完成时间
        checkNameCompletedUrl: this.info.processInfo.checkNameCompletedUrl || '', // 核名书Url
        licenseUrl: this.info.processInfo.licenseUrl || '', // 营业执照Url
        bankOpenAccountUrl: this.info.processInfo.bankOpenAccountUrl || '', // 银行开户申请书Url
        bankOpenAccountCompletedUrl: this.info.processInfo.bankOpenAccountCompletedUrl || '', // 银行开户完成通知书Url
        checkTaxCompletedUrl: this.info.processInfo.checkTaxCompletedUrl || '' // 核税完成单Url
      })
      this.registrationProcessDialogDisplay = true
    },
    async editRegistrationProcess() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderAORegistrationProcess(this.registrationProcessForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('saved')
        this.registrationProcessDialogDisplay = false
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
