<template>
  <el-dialog
    :title="title"
    v-drag-dialog="{reset: true}"
    close-on-press-escape
    :visible.sync="dialogCancelOrderDisplay"
    :close-on-click-modal="false"
    width="550px"
    custom-class="dialogCancelOrderDisplay"
    center>
    <div v-if="isContinue" style="margin: -15px 0 10px 0;color: red;font-size: 15px;">提示：该子订单为连续订单，取消兼职{{ isToday === '0' ? '所有订单' : '工作'}}后将不释放订单名额。</div>
    <el-form ref="cancelOrderForm" :model="cancelOrderForm" size="small" label-width="70px">
      <el-form-item label="取消类型">
        <el-radio v-model="cancelOrderForm.overType" label="S5">平台取消</el-radio>
        <el-radio v-model="cancelOrderForm.overType" label="S6">B端取消</el-radio>
        <el-radio v-model="cancelOrderForm.overType" label="S7">C端取消（{{params.workerName}}）</el-radio>
      </el-form-item>
      <el-form-item label="取消理由">
        <el-input type="textarea" :rows="3" placeholder="取消理由" v-model="cancelOrderForm.cancelReason">
        </el-input>
      </el-form-item>
      <el-form-item style="margin-top: 25px;text-align: center" label-width="0px">
        <el-button size="medium" style="margin-right: 10px" @click="dialogCancelOrderDisplay = false">取消</el-button>
        <el-button size="medium" type="primary" style="margin-left: 10px" @click="onHandleCancelSub">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: 'cancel-grab-order-dialog',
  data() {
    return {
      dialogCancelOrderDisplay: false,
      cancelOrderForm: {
        orderSubId: '',
        orderSubNo: '',
        overType: 'S5',
        cancelReason: '',
        isToday: ''
      }
    }
  },
  props: {
    params: Object,
    isToday: {default: 1},
    title: {default: '取消兼职工作'},
    isContinue: Boolean
  },
  methods: {
    show(){
      this.cancelOrderForm = {
        orderSubId: this.params.orderSubId,
        orderSubNo: this.params.orderSubNo,
        overType: 'S5',
        cancelReason: '',
        isToday: this.isToday || 1
      }
      if (this.params.workerUserId) {
        this.dialogCancelOrderDisplay = true
        return
      }
      this.$confirm(`确定取消子订单 ${this.params.orderSubNo} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onHandleCancelSub()
      })
    },
    async onHandleCancelSub(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: this.dialogCancelOrderDisplay ? '.dialogCancelOrderDisplay' : 'body'
      })
      try {
        await this.$$main.orderDoCancelSub({
          orderSubId: this.cancelOrderForm.orderSubId,
          overType: this.cancelOrderForm.overType || 'S5',
          cancelReason: this.cancelOrderForm.cancelReason || '',
          isToday: this.cancelOrderForm.isToday || 1
        })
        this.$message({
          message: `子订单 ${this.cancelOrderForm.orderSubNo} 已取消`,
          type: 'success'
        })
        this.$emit('success')
      } catch (e) {
        this.$emit('error', e)
      } finally {
        loading.close()
        this.dialogCancelOrderDisplay = false
      }
    }
  },
  mounted() {

  },
  watch: {

  }
}
</script>
<style>

</style>
