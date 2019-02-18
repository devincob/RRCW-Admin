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
      close-on-press-escape
      title="添加事件"
      modal-append-to-body
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="eventDialogVisible"
      width="800px"
      custom-class="order-event-dialog"
      center>
      <el-form ref="eventForm" :model="eventForm" :rules="eventRules" size="small" label-width="100px">
        <el-form-item label="事件内容：" prop="eventContent">
          <el-input v-model="eventForm.eventContent" placeholder="请填写事件内容" type="textarea" :rows="4"/>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button size="small" @click="eventDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onHandleEvent">保 存</el-button>
      </div>
      <div class="dialog-table">
        <span>事件记录</span>
      </div>
      <el-table
        :border="true"
        :highlight-current-row="true"
        max-height="300"
        :data="eventList"
        v-loading="eventLoading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column prop="logId" label="记录编号" min-width="100"/>
        <el-table-column prop="eventStatus" label="事件状态" min-width="100">
           <template slot-scope="scope">
               {{scope.row.eventStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="记录人" min-width="100"/>
        <el-table-column prop="createTime" label="记录时间" min-width="150"/>
        <el-table-column prop="orderStatus" label="订单状态" min-width="120">
           <template slot-scope="scope">
               <div>{{scope.row.orderStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="changeAmount" label="金额（含服务费）" min-width="120" :formatter="formatRowAmount"/>
        <el-table-column prop="createTime" label="操作" min-width="80" fixed="right">
          <template slot-scope="scope">
            <event-sub-order-detail-dialog :info="scope.row"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </span>
</template>
<script>
import EventSubOrderDetailDialog from './EventSubOrderDetailDialog'
export default {
  name: 'order-event-dialog',
  components: {EventSubOrderDetailDialog},
  data() {
    return {
      eventLoading: false,
      eventDialogVisible: false,
      orderSubNumber: '',
      eventForm: {
        orderSubId: '',
        changeAmount: '',
        eventContent: ''
      },
      eventRules: {
        eventContent: [
          { required: true, message: '请填写事件内容', trigger: 'change' }
        ]
      },
      eventList: []
    }
  },
  props: {
    btnType: {default: ''},
    btnSize: {default: ''},
    orderSubId: {default: ''},
    orderSubNo: {default: ''},
    showBtn: {default: true}
  },
  watch: {
    eventDialogVisible(val){
      if (val){
        this.queryEventDetails()
      }
    }
  },
  methods: {
    formatRowAmount(row, column, cellValue){
      return `${this.$options.filters['currency'](cellValue || 0, '', 2)}元`
    },
    show(){
      this.eventLoading = false
      this.eventList = []
      this.eventForm.orderSubId = this.orderSubId
      this.orderSubNumber = this.orderSubNo
      // this.eventForm.eventContent = ''
      this.eventDialogVisible = true
      this.$nextTick(() => {
        this.$refs['eventForm'].clearValidate()
      })
    },
    async queryEventDetails() {
      try {
        this.eventLoading = true
        const eventInfo = await this.$$main.orderQueryEventDetail({
          orderSubId: this.orderSubId
        })
        this.eventForm.eventContent = eventInfo.eventContent || ''
        this.eventList = eventInfo.logs || []
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.eventLoading = false
      }
    },
    async onHandleEvent(){
      let valid = await this.$refs['eventForm'].validate()
      if (!valid){
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventCreate(this.eventForm)
        this.eventDialogVisible = false
        this.$message({
          message: `子订单 ${this.orderSubNumber} 事件添加成功`,
          type: 'success'
        })
        this.$emit('success', true)
      } catch (e){
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
  .order-event-dialog{
    .dialog-footer{
      text-align: right;
      margin-top: 10px;
    }
    .dialog-table{
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      line-height: 24px;
      font-size: 18px;
      color: #303133;
      margin: 10px 0;
    }
  }
  .order-event-suborder-detail-dialog{
    width: 800px;
    .el-dialog__header{
      position: fixed;
      height: 46px;
      width: 800px;
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
    }
  }

</style>
