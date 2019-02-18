<template>
  <x-page breadcrumb="auto" title="事件详情">
    <div style="max-width:1024px;min-width: 800px;">
      <sub-order-detail v-if="orderSubId" ref="detailInfo" :order-sub-id="orderSubId" @getInfo="getOrderInfo"/>
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <div>事件处理</div>
        </div>
        <el-form ref="eventForm" :model="eventForm" :rules="eventFormRules" label-width="100px">
          <el-form-item label="事件内容：" prop="remark">
            <el-input :disabled="info && (info.status === 'C' || info.status === 'N')" v-model.trim="eventForm.remark" type="textarea" rows="5" placeholder="请填写事件内容"/>
          </el-form-item>
          <el-form-item label="调整金额：" prop="changeAmount">
            工资 <el-input :disabled="info && (info.status === 'C' || info.status === 'N')" v-model.number="eventForm.changeAmount" type="text" size="small" placeholder="请填写金额" style="width: 150px"/>
            + 服务费 {{info.serviceAmount || 0|currency('', 2)}}元 = {{showEventSumAmount|currency('', 2)}}元
          </el-form-item>
        </el-form>
        <div v-if="info && info.status !== 'C' && info.status !== 'N'" style="text-align: right;margin-top: 10px;">
          <el-button size="small" type="primary" @click="onHandleEventClick(0)">保存</el-button>
          <el-button size="small" @click="onHandleEventClick(2)">不处理</el-button>
          <el-button size="small" @click="onHandleEventClick(1)">处理完成</el-button>
          <el-button size="small" @click="onHandleEventClick(3)">提交审核</el-button>
        </div>
        <el-table
          v-if="info"
          :data="info.logs || []"
          highlight-current-row
          border
          size="mini"
          style="width: 100%;margin-top: 20px">
          <el-table-column fixed prop="logId" label="记录编号" min-width="100"/>
          <el-table-column prop="eventStatus" label="事件状态" min-width="150"/>
          <el-table-column prop="createUserName" label="记录人" min-width="120"/>
          <el-table-column prop="createTime" label="记录时间" min-width="150"/>
          <el-table-column prop="orderStatus" label="订单状态" min-width="150"/>
          <el-table-column prop="changeAmount" label="金额（含服务费）" min-width="150" :formatter="formatChangeAmount"/>
          <el-table-column prop="createTime" label="操作" min-width="80">
            <template slot-scope="scope">
              <event-sub-order-detail-dialog :info="scope.row"/>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </x-page>
</template>

<script>
import OrderEventDialog from '../../components/OrderEventDialog'
import OrderEventHandleDialog from '../../components/OrderEventHandleDialog'
import SubOrderDetail from '../../components/SubOrderDetail'
import EventSubOrderDetailDialog from '../../components/EventSubOrderDetailDialog'
export default {
  name: 'event-detail',
  components: {
    OrderEventDialog,
    OrderEventHandleDialog,
    SubOrderDetail,
    EventSubOrderDetailDialog
  },
  data(){
    const salary = (rule, value, callback) => {
      if (value && !/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
        callback(new Error('必须为正数（最多两位小数）'))
      } else {
        callback()
      }
    }
    return {
      orderSubId: 0,
      orderInfo: {},
      info: {},
      eventForm: {
        eventId: '',
        remark: '',
        confirmType: '',
        changeAmount: ''
      },
      eventFormRules: {
        remark: [
          { required: true, message: '请填写事件内容', trigger: 'change' }
        ],
        changeAmount: [
          { validator: salary, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    showEventSumAmount(){
      return (Number(this.eventForm.changeAmount) || 0) + (Number(this.info.serviceAmount) || 0)
    }
  },
  methods: {
    formatChangeAmount(row, column, cellValue){
      return `${this.$options.filters['currency'](row.changeAmount || 0, '', 2)}元`
    },
    getOrderInfo(res){
      this.orderInfo = res
    },
    async querySubOrderDetails() {
      await this.$refs['detailInfo'].querySubOrderDetails()
    },
    async refreshPage(){
      await this.querySubOrderDetails()
      await this.queryEventDetails()
    },
    async queryEventDetails(){
      const loading = this.$loading({
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      try {
        let data = await this.$$main.orderQueryEventDetail({
          orderSubId: this.orderSubId
        })
        this.eventForm.eventId = data.eventId || ''
        this.eventForm.remark = data.eventContent || ''
        this.eventForm.changeAmount = data.salaryAmount || 0
        this.info = data
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onHandleEventClick(type){
      let valid = await this.$refs['eventForm'].validate()
      if (!valid){
        return
      }
      const types = ['是否要保存当前事件?', '是否要完成当前事件?', '是否不处理当前事件?', '是否要提交审核？']
      this.$confirm(types[type], '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 0) {
          this.saveEventHandleCreate()
        } else {
          this.eventForm.confirmType = type
          this.saveEventHandleResult()
        }
      })
    },
    async saveEventHandleResult(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventHandel({
          eventId: this.eventForm.eventId || '',
          remark: this.eventForm.remark || '',
          confirmType: this.eventForm.confirmType || '',
          changeAmount: this.showEventSumAmount || 0
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.refreshPage()
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async saveEventHandleCreate(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventCreate({
          orderSubId: this.orderSubId,
          changeAmount: this.showEventSumAmount || 0,
          eventContent: this.eventForm.remark || ''
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.refreshPage()
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted(){
    this.orderSubId = (this.$route.query && this.$route.query.ordersubid) || 0
    this.$nextTick(this.refreshPage)
  }
}
</script>
