<template>
  <span>
    <el-button
      :type="btnType"
      :size="btnSize"
      @click="show">
      <slot></slot>
    </el-button>
    <el-dialog
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      :close-on-click-modal="false"
      title="事件处理"
      modal-append-to-body
      append-to-body
      :visible.sync="eventHandleDialogVisible"
      width="500px"
      custom-class="order-event-handle-dialog"
      center>
      <el-form ref="eventHandleForm" :model="eventHandleForm" :rules="eventHandleRules" size="small" label-width="100px">
        <el-form-item label="事件内容：" v-if="eventHandleForm.eventType === 'C'" style="word-break: break-all">
          {{eventHandleForm.remark}}
        </el-form-item>
        <el-form-item label="事件内容：" prop="remark" v-if="eventHandleForm.eventType === 'P'">
          <el-input v-model.trim="eventHandleForm.remark" placeholder="请填写事件内容" type="textarea" :rows="4"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="order-event-handle-dialog-footer">
        <div v-if="eventHandleForm.eventType === 'P'" style="float: left; width: 60%; text-align: left">
          <el-button size="small" @click="onEventHandleResultClick('2')">封 号</el-button>
          <el-button size="small" @click="onEventHandleResultClick('3')">禁止抢单</el-button>
          <el-button size="small" @click="onAdjustClick">调整工资</el-button>
        </div>
        <div v-if="eventHandleForm.eventType === 'P'" style="float: left; width: 40%; text-align: right">
          <el-button type="primary" size="small" @click="onEventHandleResultClick('1')">处理完成</el-button>
          <el-button type="primary" size="small" @click="onEventHandleResultClick('0')">保 存</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="调整薪资"
      modal-append-to-body
      append-to-body
      :visible.sync="eventHandleAmountDialogVisible"
      width="500px"
      custom-class="order-event-amount-handle-dialog"
      center>
      <el-form ref="amountForm" :model="amountForm" :rules="amountRules" size="small" label-width="100px">
        <el-form-item label="调整金额：" prop="changeAmount" v-if="eventHandleForm.eventType === 'P'">
          <el-input v-model.number="amountForm.changeAmount" placeholder="请输入最终需要支付的工资"/>
        </el-form-item>
        <el-form-item label="调整工资原因" prop="changeReason">
          <el-input v-model="eventHandleForm.changeReason" type="textarea" :rows="4" placeholder="请输入调整工资原因" />
        </el-form-item>
        <div>
          <el-button @click="onReasonClick(i)" type="success" size="mini" plain v-for="(i, index) in addReason" :key="index">{{i}}</el-button>
        </div>
        <div>
          <el-button @click="onReasonClick(i)" type="danger" size="mini" plain v-for="(i, index) in delReason" :key="index">{{i}}</el-button>
        </div>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="eventHandleAmountDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onEventHandleResultClick('4')">保 存</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: 'order-event-handle-dialog',
  data() {
    const salary = (rule, value, callback) => {
      if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
        callback(new Error('必须为正数（最多两位小数）'))
      } else {
        callback()
      }
    }
    return {
      eventHandleAmountDialogVisible: false,
      eventHandleDialogVisible: false,
      eventHandleForm: {
        eventId: '',
        eventContent: '',
        eventType: '',
        remark: '',
        isConfirm: '',
        changeReason: ''
      },
      eventHandleRules: {
        remark: [
          { required: true, message: '请填写事件内容', trigger: 'change' }
        ]
      },
      amountForm: {
        changeAmount: ''
      },
      amountRules: {
        changeAmount: [
          { required: true, message: '请填写调整金额', trigger: 'change' },
          { validator: salary, trigger: 'change' }
        ]
      },
      addReason: ['加班工资', '企业奖励', '平台奖励', '项目提成', '平台补贴'],
      delReason: ['迟到扣薪', '早退扣薪', '鸽子', '平台调整', '企业调整']
    }
  },
  props: {
    btnType: {default: ''},
    btnSize: {default: ''},
    eventInfo: {default: {}},
    showBtn: {default: true}
  },
  watch: {
    dialogAssignDisplay(val){
      if (val){
        this.queryAssignList()
      }
    },
    'assignForm.pageIndex': {
      handler: function(){
        this.queryAssignList()
      },
      deep: true
    }
  },
  methods: {
    show(){
      this.eventHandleForm.eventId = this.eventInfo.eventId || ''
      this.eventHandleForm.eventContent = this.eventInfo.eventContent || ''
      this.eventHandleForm.remark = this.eventInfo.eventContent || ''
      this.eventHandleForm.eventType = this.eventInfo.status || ''
      this.amountForm.changeAmount = ''
      this.eventHandleDialogVisible = true
      this.$nextTick(() => {
        this.$refs['eventHandleForm'].clearValidate()
      })
    },
    async onAdjustClick(){
      let valid = await this.$refs['eventHandleForm'].validate()
      if (!valid){
        return
      }
      this.eventHandleAmountDialogVisible = true
      this.$nextTick(() => {
        this.$refs['amountForm'].clearValidate()
      })
    },
    async onEventHandleResultClick(type){
      this.eventHandleForm.isConfirm = type
      if (type === '4') {
        let avalid = await this.$refs['amountForm'].validate()
        if (!avalid){
          return
        }
      }
      let valid = await this.$refs['eventHandleForm'].validate()
      if (!valid){
        return
      }
      this.saveEventHandleResult(type)
    },
    async saveEventHandleResult(type){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventHandel({
          changeAmount: this.amountForm.changeAmount || '',
          ...this.eventHandleForm
        })
        if (type !== '2' && type !== '3' && type !== '4') {
          this.eventHandleDialogVisible = false
        }
        this.eventHandleAmountDialogVisible = false
        this.$message({
          message: `操作成功`,
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
    onReasonClick(text){
      if (this.eventHandleForm.changeReason && this.eventHandleForm.changeReason !== '') {
        this.eventHandleForm.changeReason += `，${text}`
      } else {
        this.eventHandleForm.changeReason += text
      }
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
  .order-event-handle-dialog{
    .order-event-handle-dialog-footer{
      height: 35px;
      margin-top: -15px;
      .el-button+.el-button{
        margin-left: 5px;
      }
    }
  }
  .order-event-amount-handle-dialog{
    .el-button{
      margin: 5px 10px 0 0;
    }
  }
</style>
