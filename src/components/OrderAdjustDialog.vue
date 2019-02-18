<template>
  <span>
    <el-button
      :type="btnType"
      :size="btnSize"
      v-show="showBtn"
      @click="show">
      <slot></slot>
    </el-button>
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="薪资调整"
      modal-append-to-body
      append-to-body
      :visible.sync="adjustDialogVisible"
      :close-on-click-modal="false"
      width="500px"
      custom-class="order-adjust-dialog"
      close-on-press-escape
      center>
      <el-form ref="adjustForm" :model="adjustForm" :rules="adjustRules" size="small" label-width="120px">
        <el-form-item label="调整工资金额" prop="changeAmount">
          <el-input v-model.number="adjustForm.changeAmount" placeholder="请输入最终需要支付的工资"/>
        </el-form-item>
        <el-form-item label="调整工资原因" prop="changeReason">
          <el-input v-model="adjustForm.changeReason" type="textarea" :rows="4" placeholder="请输入事件记录内容" />
          <div v-if="adjustForm.changeAmount > confirmAmount">
            <el-button @click="onReasonClick(i)" size="mini" v-for="(i, index) in addReason" :key="index">{{i}}</el-button>
          </div>
          <div v-if="adjustForm.changeAmount < confirmAmount">
            <el-button @click="onReasonClick(i)" size="mini" v-for="(i, index) in delReason" :key="index">{{i}}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onHandleAdjust">提 交</el-button>
      </span>
    </el-dialog>
    <pay-order-dialog :order-sub-id="orderSubId + ''" ref="payOrderDialog" @success="onPaySuccess"/>
  </span>
</template>
<script>
import PayOrderDialog from './PayOrderDialog'
export default {
  name: 'order-adjust-dialog',
  components: {PayOrderDialog},
  data() {
    const salary = (rule, value, callback) => {
      if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
        callback(new Error('必须为正数（最多两位小数）'))
      } else {
        callback()
      }
    }
    return {
      adjustDialogVisible: false,
      adjustForm: {
        orderSubId: '',
        changeAmount: ''
      },
      adjustRules: {
        changeAmount: [
          { required: true, message: '请填写薪资', trigger: 'change' },
          { validator: salary, trigger: 'change' }
        ]
      },
      addReason: ['加班工资', '企业奖励', '平台奖励', '项目提成', '平台补贴'],
      delReason: ['迟到扣薪', '早退扣薪', '鸽子', '平台调整', '企业调整']
    }
  },
  props: {
    type: {default: 'A'},
    btnType: {default: ''},
    btnSize: {default: ''},
    orderSubId: {default: ''},
    confirmAmount: {default: 0},
    showBtn: {default: true}
  },
  methods: {
    show(){
      this.adjustForm = {
        orderSubId: this.orderSubId || '',
        changeAmount: this.confirmAmount || '',
        changeReason: ''
      }
      this.adjustDialogVisible = true
    },
    onReasonClick(text){
      if (this.adjustForm.changeReason && this.adjustForm.changeReason !== '') {
        this.adjustForm.changeReason += `，${text}`
      } else {
        this.adjustForm.changeReason += text
      }
    },
    async onHandleAdjust(){
      let valid = await this.$refs['adjustForm'].validate()
      if (!valid){
        return
      }
      if (this.type === 'B' && this.adjustForm.changeAmount === this.confirmAmount){
        this.$message.error('完结订单的调整金额不能和订单金额相同')
        return
      }
      if (this.adjustForm.changeAmount === this.confirmAmount){
        this.$refs['payOrderDialog'].show()
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: '.order-adjust-dialog'
      })
      try {
        await this.$$main.orderDoChangeCreate(this.adjustForm)
        this.adjustDialogVisible = false
        this.$message({
          message: '薪资调整申请提交成功',
          type: 'success'
        })
        this.$emit('success', true)
      } catch (e){
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onPaySuccess(){
      this.$emit('success', true)
      this.adjustDialogVisible = false
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
  .order-adjust-dialog{
    .el-button{
      margin: 5px 10px 0 0;
    }
  }
</style>
