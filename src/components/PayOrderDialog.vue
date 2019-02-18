<template>
  <el-dialog
    title="支付确认"
    :visible.sync="dialogPayOrderDisplay"
    width="550px"
    custom-class="dialogPayOrderDisplay"
    v-drag-dialog="{reset: true}"
    close-on-press-escape
    :close-on-click-modal="false"
    center>
    <el-row>
      <el-col :span="4">订单号：</el-col>
      <el-col :span="20">{{info.orderNo}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">标题：</el-col>
      <el-col :span="20">{{info.orderTitle}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">上班时间：</el-col>
      <el-col :span="20">{{workDateFormat}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">兼职：</el-col>
      <el-col :span="8">{{info.workerName || '-'}}</el-col>
      <el-col :span="8">{{info.workerMobile || '-'}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">签到：</el-col>
      <el-col :span="8">{{info.showClockOnTime || '-'}}</el-col>
      <el-col :span="12">{{info.clockOnAddress || '-'}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">签退：</el-col>
      <el-col :span="8">{{info.showClockOffTime || '-'}}</el-col>
      <el-col :span="12">{{info.clockOffAddress || '-'}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">工资：</el-col>
      <el-col :span="8">{{info.singleSalary + (info.singleServiceCharge || 0) | currency('', 2)}}元</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">结算：</el-col>
      <el-col :span="8">{{info.overPay === 'Y'? '完工' : '日结'}}</el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="dialogPayOrderDisplay = false">取 消</el-button>
    <el-button size="medium" type="primary" @click="onHandlePaySub">确认支付</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'pay-order-dialog',
  data() {
    return {
      dialogPayOrderDisplay: false,
      info: {},
      loading: null
    }
  },
  props: {
    orderSubId: String
  },
  computed: {
    workDateFormat(){
      return `${this.$utils.dateFormat(this.info.showBeginTime, 'yyyy-MM-dd hh:mm')} ~ ${this.$utils.dateFormat(this.info.showEndTime, 'hh:mm')} ${this.$utils.dateFormat(this.info.showBeginTime, '周www')} ${this.info.workingHours}小时`
    }
  },
  methods: {
    show(){
      if (!this.orderSubId) {
        this.$message.error('子订单Id不能为空')
        return
      }
      this.dialogPayOrderDisplay = true
      this.querySubOrderDetails()
    },
    showLoading(text = '正在操作'){
      this.loading = this.$loading({
        text: text,
        spinner: 'el-icon-loading',
        target: this.dialogPayOrderDisplay ? '.dialogPayOrderDisplay' : 'body'
      })
    },
    async querySubOrderDetails(){
      try {
        this.showLoading('正在查询订单信息')
        this.info = await this.$$main.orderQueryDetailSub({
          orderSubId: this.orderSubId
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading.close()
      }
    },
    async onHandlePaySub(){
      try {
        this.showLoading()
        await this.$$main.orderDoPay({
          orderSubId: this.orderSubId,
          confirmAmount: (this.info.singleSalary + (this.info.singleServiceCharge || 0))
        })
        this.$message({
          message: '支付成功',
          type: 'success'
        })
        this.$emit('success')
        this.dialogPayOrderDisplay = false
      } catch (e) {
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      } finally {
        this.loading.close()
      }
    }
  },
  mounted() {

  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
  .dialogPayOrderDisplay{
    .el-row{
      padding: 5px 0;
    }
  }
</style>
