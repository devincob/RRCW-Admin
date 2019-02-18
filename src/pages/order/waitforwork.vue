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
          <el-form-item label="上班时间">
            <el-date-picker
              popper-class="orders-date-picker"
              style="width: 220px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="form.createTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="培训订单">
            <el-select placeholder="培训订单" v-model="form.trainCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="不培训" value="N"/>
              <el-option label="需要培训" value="Y"/>
            </el-select>
          </el-form-item>
          <el-form-item label="城市" class="citySelectBox">
            <city-select :customClass="'citySelectClass'" ref="citySelect" @onCitySelected="onCitySelected"/>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select placeholder="岗位" v-model="form.jobTagId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option :label="item.jobTagName" :value="item.jobTagId" v-for="item in tagList" :key="item.jobTagId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="接单模式">
            <el-select placeholder="接单模式" v-model="form.applyType" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="抢单" value="W"/>
              <el-option label="指派" value="P"/>
            </el-select>
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
        <el-table-column fixed prop="showBeginTime" label="上班日期" min-width="100">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'MM-dd 周www')}}</div>
            <o-tag v-if="scope.row.overPay && scope.row.overPay === 'Y'" background="#f56c6c">完</o-tag>
            <o-tag v-else background="#ffd034">日</o-tag>
            <o-tag v-if="scope.row.applyType && scope.row.applyType === 'W'" background="#14d0bc">抢</o-tag>
            <o-tag v-if="scope.row.applyType && (scope.row.applyType === 'C' || scope.row.applyType === 'P')" background="#e6a23c">派</o-tag>
            <o-tag v-if="scope.row.hasEating && scope.row.hasEating === 'Y'" background="#409eff">饭</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 2" background="#4cbb15">事</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 1" background="#909399">事</o-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="标题/订单号" min-width="200">
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
        <el-table-column prop="jobTagName" label="联系人" min-width="150">
          <template slot-scope="scope">
            <div>{{scope.row.orderContact}}</div>
            <div>{{scope.row.orderPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="singleSalary" label="接单人" min-width="150">
          <template slot-scope="scope">
            <a :href="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">
              {{scope.row.workerName}}
            </a>
            <span style="margin-left: 5px">{{formatSex(scope.row.workerSex || 'D')}}</span>
            <div>{{scope.row.workerMobile}}</div>
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
        <el-table-column prop="workerNum" label="工资" min-width="120"
                         :formatter="(row) => `${$options.filters['currency'](row.singleSalary, '', 2)}元`"/>
        <el-table-column fixed="right" prop="orderStatus" label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="onCancelClick(scope)" type="danger" size="mini">取消兼职工作</el-button>
            <order-assign-dialog
              :order-sub-id="scope.row.orderSubId"
              :order-id="scope.row.orderId"
              btn-type="primary"
              btn-size="mini"
              type="C"
              @success="queryOrderList">换人</order-assign-dialog>
            <order-event-dialog
              btn-type="warning"
              btn-size="mini"
              :order-sub-id="scope.row.orderSubId"
              :order-sub-no="scope.row.orderSubNo"
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
    <CancelGrabOrderDialog
      ref="cancelGrabOrderDialog"
      :params="cancelForm"
      @success="onCancelSuccess"
      @error="onCancelError"/>
  </x-page>
</template>

<script>
import CitySelect from '../../components/CitySelect'
import CancelGrabOrderDialog from '../../components/CancelGrabOrderDialog'
import OrderEventDialog from '../../components/OrderEventDialog'
import OTag from '../../components/OTag'
import OrderAssignDialog from '../../components/OrderAssignDialog'
export default {
  name: 'waitforwork',
  components: {CitySelect, CancelGrabOrderDialog, OrderEventDialog, OTag, OrderAssignDialog},
  data() {
    return {
      orderList: [],
      tagList: [],
      totalCount: 0,
      loading: false,
      centerDialogVisible: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderNoOrTitleCondition: '',
        companyNameOrMobileCondition: '',
        orderContactOrPhoneCondition: '',
        workerNameOrMobileCondition: '',
        createTime: [],
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        trainCondition: '',
        isEvent: false,
        eventCondition: '0',
        cityNameCondition: '',
        orderTitle: '',
        applyType: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
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
  watch: {
    'form.createTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.workTimeBeginCondition = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.workTimeEndCondition = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.workTimeBeginCondition = ''
          this.form.workTimeEndCondition = ''
        }
      },
      deep: true
    },
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
        const data = await this.$$main.orderQueryListWaitClock(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async queryTagList() {
      try {
        const data = await this.$$main.tagList({
          status: 'N'
        })
        this.tagList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    onPageShow() {
      this.clearQueryParams()
      // this.queryOrderList()
      this.queryTagList()
    },
    clearQueryParams() {
      this.$refs['citySelect'].clear()
      this.form = {
        orderNoOrTitleCondition: '',
        companyNameOrMobileCondition: '',
        orderContactOrPhoneCondition: '',
        workerNameOrMobileCondition: '',
        createTime: [],
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        trainCondition: '',
        isEvent: false,
        eventCondition: '0',
        cityNameCondition: '',
        orderTitle: '',
        jobTagId: '',
        applyType: '',
        pageIndex: 1,
        pageSize: 20
      }
    },
    timeDiff(startTime, endTime) {
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    },
    onCancelClick(scope){
      this.cancelForm = {
        workerUserId: scope.row.workerUserId || '',
        workerName: scope.row.workerName || '',
        orderSubId: scope.row.orderSubId || '',
        orderSubNo: scope.row.orderSubNo || '',
        overType: '',
        cancelReason: ''
      }
      this.$nextTick(() => {
        this.$refs['cancelGrabOrderDialog'].show()
      })
    },
    onCancelSuccess(){
      this.queryOrderList()
    },
    onCancelError(e){
      e.message && this.$message.error(e.message)
    }
  },
  mounted() {
  }
}
</script>
