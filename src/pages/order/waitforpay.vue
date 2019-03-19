<template>
  <x-page breadcrumb="auto" title="待上班">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input placeholder="标题" v-model="form.orderTitle" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="订单">
            <el-input placeholder="订单" v-model="form.orderNoOrTitleCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="订单所属">
            <el-input placeholder="订单所属" v-model="form.companyNameOrMobileCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input placeholder="联系人" v-model="form.orderContactOrPhoneCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="接单人">
            <el-input placeholder="接单人" v-model="form.workerNameOrMobileCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="城市" class="citySelectBox">
            <city-select :customClass="'citySelectClass'" ref="citySelect" @onCitySelected="onCitySelected"/>
          </el-form-item>
          <el-form-item label="事件订单">
          <el-checkbox v-model="form.isEvent">事件订单</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onScreenList">筛选</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        :border="true"
        :highlight-current-row="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column fixed prop="showBeginTime" label="上班日期" min-width="140">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'MM-dd 周www')}}</div>
            <o-tag v-if="scope.row.continuityOrderId" background="#ff6600">连</o-tag>
            <o-tag v-if="scope.row.overPay && scope.row.overPay === 'Y'" background="#f56c6c">完</o-tag>
            <o-tag v-else background="#ffd034">日</o-tag>
            <o-tag v-if="scope.row.applyType && scope.row.applyType === 'W'" background="#14d0bc">抢</o-tag>
            <o-tag v-if="scope.row.applyType && (scope.row.applyType === 'C' || scope.row.applyType === 'P')" background="#e6a23c">派</o-tag>
            <o-tag v-if="scope.row.hasEating && scope.row.hasEating === 'Y'" background="#409eff">饭</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 2" background="#4cbb15">事</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 1" background="#909399">事</o-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="标题/订单号" min-width="180">
          <template slot-scope="scope">
            <div>{{scope.row.orderTitle}}</div>
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="orderContact" label="订单所属" min-width="140">
          <template slot-scope="scope">
            <div>{{scope.row.companyName}}</div>
            <a :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">
              {{scope.row.orderPhone}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="jobTagName" label="岗位" min-width="120"/>
        <el-table-column prop="singleSalary" label="接单人" min-width="150">
          <template slot-scope="scope">
            <a :href="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">
              {{scope.row.workerName}}
            </a>
            <span style="margin-left: 5px">{{formatSex(scope.row.workerSex || 'D')}}</span>
            <div>{{scope.row.workerMobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cityName" label="签到信息" min-width="150">
          <template slot-scope="scope">
            <div>{{scope.row.showClockOnTime}}</div>
            <div>{{scope.row.clockOnAddress}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cityName" label="签退信息" min-width="150">
          <template slot-scope="scope">
            <div>{{scope.row.showClockOffTime}}</div>
            <div>{{scope.row.clockOffAddress}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="showBeginTime" label="上班时间" min-width="150">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'MM-dd 周www')}} {{timeDiff(scope.row.showBeginTime,
              scope.row.showEndTime)}}
            </div>
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'hh:mm')}}~{{$utils.dateFormat(scope.row.showEndTime,
              'hh:mm')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="上班地址" min-width="180"/>
        <el-table-column prop="subStatus" label="自动确认时间" width="150">
          <template slot-scope="scope">
            <div>{{formatPayTime(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="orderStatus" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="onPayClick(scope)" type="primary" size="mini">确认支付</el-button>
            <order-event-dialog
              btn-type="warning"
              btn-size="mini"
              :order-sub-id="scope.row.orderSubId"
              :order-sub-no="scope.row.orderSubNo"
              v-drag-dialog="{reset: true}"
              close-on-press-escape
              @success="queryOrderList">添加事件</order-event-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          :current-page="form.pageIndex"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
    <PayOrderDialog
      ref="payOrderDialog"
      :order-sub-id="selectOrderSubId + ''"
      @success="onPaySuccess"/>
  </x-page>
</template>

<script>
import CitySelect from '../../components/CitySelect'
import PayOrderDialog from '../../components/PayOrderDialog'
import OTag from '../../components/OTag'
import OrderEventDialog from '../../components/OrderEventDialog'
export default {
  name: 'waitforpay',
  components: {CitySelect, PayOrderDialog, OTag, OrderEventDialog},
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      centerDialogVisible: false,
      form: {
        isEvent: false,
        pageIndex: 1,
        pageSize: 20,
        orderNoOrTitleCondition: '',
        companyNameOrMobileCondition: '',
        orderContactOrPhoneCondition: '',
        workerNameOrMobileCondition: '',
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        cityNameCondition: '',
        orderTitle: '',
        subStatusCondition: '4'
      },
      selectOrderSubId: ''
    }
  },
  watch: {
    'form.isEvent': {
      handler: function (val) {
        this.form.eventCondition = val ? '1' : '0'
      },
      deep: true
    },
    'form.pageIndex': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    formatSex(sex){
      const sexs = {
        'N': '不限',
        'M': '男',
        'F': '女',
        'D': ''
      }
      return sexs[sex || 'N']
    },
    formatPayTime(row){
      return row.autoPayMinutes ? `${this.hourFormat(row.autoPayMinutes)}自动确认` : '-'
    },
    onCitySelected(item) {
      this.form.cityNameCondition = item.districtName
    },
    onScreenList() {
      if (this.form.pageIndex === 1) {
        this.queryOrderList()
      } else {
        this.form.pageIndex = 1
      }
    },
    async queryOrderList() {
      try {
        if (this.loading) {
          return
        }
        this.loading = true
        const data = await this.$$main.orderQueryListSub(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageShow() {
      this.clearQueryParams()
      // this.queryOrderList()
    },
    clearQueryParams() {
      this.$refs['citySelect'].clear()
      this.form = {
        isEvent: false,
        orderNoOrTitleCondition: '',
        companyNameOrMobileCondition: '',
        orderContactOrPhoneCondition: '',
        workerNameOrMobileCondition: '',
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        cityNameCondition: '',
        orderTitle: '',
        subStatusCondition: '4',
        pageIndex: 1,
        pageSize: 20
      }
    },
    timeDiff(startTime, endTime) {
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    },
    hourFormat(time) {
      let d = parseInt(time / 60 / 24)
      let dh = parseInt(time / 60 % 24)
      let h = parseInt(time / 60)
      let m = time % 60
      return d > 0 ? `${d}天${dh}小时` : `${h > 0 ? h + '小时' : ''}${m}分`
    },
    onPayClick(scope){
      this.selectOrderSubId = scope.row.orderSubId
      this.$nextTick(() => {
        this.$refs['payOrderDialog'].show()
      })
    },
    onPaySuccess(){
      this.queryOrderList()
    }
  },
  mounted() {
  }
}
</script>
