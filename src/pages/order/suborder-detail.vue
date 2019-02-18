<template>
  <x-page
    breadcrumb="auto"
    title="子订单详情"
  >
    <div style="max-width:1024px;min-width: 800px;">
      <el-card v-if="!info.overType" style="display:flex;justify-content:flex-end;">
        <div>
          <sub-order-dismiss-dialog
            v-if="info.subStatus === 3"
            :order-sub-id="info.orderSubId"
            btn-type="danger"
            btn-size="small"
            type="A"
            @success="refreshPage"
          >
            企业退工
          </sub-order-dismiss-dialog>
          <sub-order-dismiss-dialog
            v-if="info.subStatus === 3"
            :order-sub-id="info.orderSubId"
            btn-type="danger"
            btn-size="small"
            type="B"
            @success="refreshPage"
          >
            企业取消
          </sub-order-dismiss-dialog>
          <sub-order-dismiss-dialog
            v-if="info.subStatus === 3"
            :order-sub-id="info.orderSubId"
            btn-type="danger"
            btn-size="small"
            type="C"
            @success="refreshPage"
          >
            旷工（兼职取消）
          </sub-order-dismiss-dialog>
          <el-button
            v-if="info.subStatus === 1 || info.subStatus === 2"
            type="danger"
            size="small"
            @click="onCancelClick"
          >{{info.workerUserId ? '取消兼职工作' : '取消名额'}}</el-button>
          <order-assign-dialog
            v-if="!info.workerUserId && (info.subStatus === 1 || info.subStatus === 2)"
            :order-sub-id="info.orderSubId"
            :order-id="info.orderId"
            btn-type="primary"
            btn-size="small"
            @success="querySubOrderDetails"
          >指派</order-assign-dialog>
          <order-assign-dialog
            v-if="info.workerUserId && (info.subStatus === 1 || info.subStatus === 2)"
            :order-sub-id="info.orderSubId"
            :order-id="info.orderId"
            btn-type="primary"
            btn-size="small"
            type="C"
            @success="onAssignSuccess"
          >换人</order-assign-dialog>
          <el-button
            v-if="info.subStatus === 3 || info.subStatus === 4"
            type="primary"
            size="small"
            @click="onPayClick"
          >确认支付</el-button>
        </div>
      </el-card>
      <sub-order-detail v-if="orderSubId" ref="detailInfo" :order-sub-id="orderSubId" @getInfo="oInfo => {info = oInfo}"/>
      <el-card>
        <div
          slot="header"
          style="display:flex;justify-content:space-between"
        >
          <div style="width:100px">事件信息</div>
        </div>
        <div>
          <el-form :model="eventForm" :rules="eventFormRules" ref="eventForm">
            <el-form-item label="" prop="eventContent">
              <el-input v-model.trim="eventForm.eventContent" type="textarea" rows="5" placeholder="请填写事件内容"/>
            </el-form-item>
          </el-form>
          <div style="text-align: right;margin-top: 10px;">
            <el-button size="small" type="primary" @click="onHandleEventClick">保存</el-button>
          </div>
          <el-table
            v-if="eventInfo"
            :data="eventInfo.logs || []"
            highlight-current-row
            border
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            size="mini"
            style="width: 100%;margin-top: 20px"
          >
            <el-table-column
              fixed
              prop="logId"
              label="记录编号"
              min-width="100"
            />
            <el-table-column
              prop="eventStatus"
              label="事件状态"
              min-width="150"
            />
            <el-table-column
              prop="createUserName"
              label="记录人"
              min-width="120"
            />
            <el-table-column
              prop="createTime"
              label="记录时间"
              min-width="150"
            />
            <el-table-column
              prop="orderStatus"
              label="订单状态"
              min-width="150"
            />
            <el-table-column
              prop="changeAmount"
              label="金额（含服务费）"
              min-width="150"
              :formatter="formatChangeAmount"
            />
            <el-table-column prop="createTime" label="操作" min-width="80">
              <template slot-scope="scope">
                <event-sub-order-detail-dialog :info="scope.row"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <CancelGrabOrderDialog
      ref="cancelGrabOrderDialog"
      :params="cancelForm"
      @success="onCancelSuccess"
      @error="onCancelError"
    />
    <PayOrderDialog
      ref="payOrderDialog"
      :order-sub-id="orderSubId + ''"
      @success="onPaySuccess"
    />
  </x-page>
</template>
<script>
import CancelGrabOrderDialog from '../../components/CancelGrabOrderDialog'
import PayOrderDialog from '../../components/PayOrderDialog'
import OrderAssignDialog from '../../components/OrderAssignDialog'
import OrderAdjustDialog from '../../components/OrderAdjustDialog'
import SubOrderDetail from '../../components/SubOrderDetail'
import EventSubOrderDetailDialog from '../../components/EventSubOrderDetailDialog'
import SubOrderDismissDialog from '../../components/SubOrderDismissDialog'
export default {
  name: 'suborder-detail',
  components: {
    CancelGrabOrderDialog,
    PayOrderDialog,
    OrderAssignDialog,
    OrderAdjustDialog,
    SubOrderDetail,
    EventSubOrderDetailDialog,
    SubOrderDismissDialog
  },
  data() {
    return {
      orderSubId: 0,
      info: {},
      eventInfo: {},
      eventForm: {
        eventContent: ''
      },
      eventFormRules: {
        eventContent: [
          { required: true, message: '请填写事件内容', trigger: 'change' }
        ]
      },
      loading: false,
      cancelForm: {
        workerUserId: '',
        workerName: '',
        orderSubId: '',
        orderSubNo: '',
        overType: '',
        cancelReason: ''
      }
    }
  },
  methods: {
    formatChangeAmount(row, column, cellValue){
      return `${this.$options.filters['currency'](row.changeAmount || 0, '', 2)}元`
    },
    refreshPage(){
      this.querySubOrderDetails()
      this.queryEventDetails()
    },
    async querySubOrderDetails() {
      this.$refs['detailInfo'].querySubOrderDetails()
    },
    async queryEventDetails() {
      try {
        this.loading = true
        let data = await this.$$main.orderQueryEventDetail({
          orderSubId: this.orderSubId
        })
        this.eventForm.eventContent = data.eventContent || ''
        this.eventInfo = data
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async onHandleEventClick(){
      let valid = await this.$refs['eventForm'].validate()
      if (!valid){
        return
      }
      this.$confirm('是否要保存当前事件?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveEventHandleResult()
      })
    },
    async saveEventHandleResult(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventCreate({
          orderSubId: this.orderSubId,
          changeAmount: this.info.singleSalary || 0,
          ...this.eventForm
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
    onPayClick() {
      this.$refs['payOrderDialog'].show()
    },
    onPaySuccess() {
      this.querySubOrderDetails()
    },
    async subOrderDoPay() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoPay({
          orderSubId: this.orderSubId,
          confirmAmount: (this.info.singleSalary + (this.info.singleServiceCharge || 0))
        })
        this.$message({
          message: `子订单 ${this.info.orderSubNo} 支付成功`,
          type: 'success'
        })
        this.querySubOrderDetails()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onCancelClick() {
      this.cancelForm = {
        workerUserId: this.info.workerUserId || '',
        workerName: this.info.workerName || '',
        orderSubId: this.info.orderSubId || '',
        orderSubNo: this.info.orderSubNo || '',
        overType: '',
        cancelReason: ''
      }
      this.$nextTick(() => {
        this.$refs['cancelGrabOrderDialog'].show()
      })
    },
    onCancelSuccess() {
      this.querySubOrderDetails()
    },
    onCancelError(e) {
      e.message && this.$message.error(e.message)
    },
    onAssignSuccess(id) {
      window.location = `/order/suborder-detail?ordersubid=${id}`
    }
  },
  mounted() {
    this.orderSubId = (this.$route.query && this.$route.query.ordersubid) || 0
    this.$nextTick(() => {
      this.refreshPage()
    })
  }
}
</script>
