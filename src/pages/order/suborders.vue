<template>
  <x-page breadcrumb="auto" title="子订单列表">
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
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              v-model="form.createTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select placeholder="状态" v-model="form.subStatusCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="预约中" value="1"/>
              <el-option label="待上班" value="2"/>
              <el-option label="上班中" value="3"/>
              <el-option label="待支付（已下班）" value="4"/>
              <el-option label="已支付" value="5"/>
              <el-option label="取消" value="6"/>
              <el-option label="超时无人抢" value="7"/>
              <el-option label="已确认未支付" value="8"/>
              <el-option label="企业退工" value="9"/>
              <el-option label="兼职取消(旷工)" value="10"/>
            </el-select>
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
          <el-form-item label="取消类型">
            <el-select placeholder="取消类型" v-model="form.overType" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="平台取消" value="S5"/>
              <el-option label="B端取消" value="S6"/>
              <el-option label="C端取消" value="S7"/>
            </el-select>
          </el-form-item>
          <el-form-item label="调整工资">
            <el-select placeholder="取消类型" v-model="form.isSalaryChange" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="有调整" value="1"/>
              <el-option label="无调整" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="事件订单">
            <el-checkbox v-model="form.isEvent">事件订单</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onScreenList">筛选</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
            <el-button type="primary" @click="onExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
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
        <el-table-column prop="orderNo" label="标题/订单号" min-width="165">
          <template slot-scope="scope">
            <div>{{scope.row.orderTitle}}</div>
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="orderContact" label="订单所属" min-width="110">
          <template slot-scope="scope">
            <div>{{scope.row.companyName}}</div>
            <a :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">
              {{scope.row.orderPhone}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="jobTagName" label="岗位" min-width="100"/>
        <el-table-column prop="jobTagName" label="联系人" min-width="100">
          <template slot-scope="scope">
            <div>{{scope.row.orderContact}}</div>
            <div>{{scope.row.orderPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="showBeginTime" label="上班时间" min-width="150">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'MM-dd 周www')}} {{timeDiff(scope.row.showBeginTime, scope.row.showEndTime)}}</div>
            <div>{{$utils.dateFormat(scope.row.showBeginTime, 'hh:mm')}}~{{$utils.dateFormat(scope.row.showEndTime, 'hh:mm')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="上班地址" min-width="150"/>
        <el-table-column :render-header="workerNumHeader" prop="workerNum" label="工资" min-width="190" :formatter="formatSalary"/>
        <el-table-column prop="subStatus" label="状态" width="150">
          <template slot-scope="scope">
            <div>{{scope.row.subStatusText || ''}}</div>
            <div>{{formatPayTime(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="singleSalary" label="接单人" min-width="90">
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
        <el-table-column fixed="right" prop="orderStatus" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="onPayClick(scope)" type="primary" size="mini" v-if="!scope.row.overType && (scope.row.subStatus === 3 || scope.row.subStatus === 4)">确认支付</el-button>
            <el-button @click="onCancelClick(scope)" type="danger" size="mini" v-if="!scope.row.overType && (scope.row.subStatus === 1 || scope.row.subStatus === 2)">{{scope.row.workerUserId ? '取消兼职工作' : '取消名额'}}</el-button>
            <order-assign-dialog
              v-if="!scope.row.overType && !scope.row.workerUserId && (scope.row.subStatus === 1 || scope.row.subStatus === 2)"
              style="margin: 2px 0 0 0"
              :order-sub-id="scope.row.orderSubId"
              :order-id="scope.row.orderId"
              btn-type="primary"
              btn-size="mini"
              @success="queryOrderList">指派</order-assign-dialog>
            <order-event-dialog
              style="margin: 2px 0 0 0"
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
      :is-continue="subIsContinue"
      :params="cancelForm"
      @success="onCancelSuccess"
      @error="onCancelError"/>
    <PayOrderDialog
      ref="payOrderDialog"
      :order-sub-id="selectOrderSubId + ''"
      @success="onPaySuccess"/>
  </x-page>
</template>

<script>
import CitySelect from '../../components/CitySelect'
import CancelGrabOrderDialog from '../../components/CancelGrabOrderDialog'
import PayOrderDialog from '../../components/PayOrderDialog'
import OrderAssignDialog from '../../components/OrderAssignDialog'
import OrderEventDialog from '../../components/OrderEventDialog'
import OTag from '../../components/OTag'
import OrderAdjustDialog from '../../components/OrderAdjustDialog'
export default {
  name: 'suborders',
  components: {CitySelect, CancelGrabOrderDialog, PayOrderDialog, OrderAssignDialog, OrderEventDialog, OTag, OrderAdjustDialog},
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
        subStatusCondition: '',
        trainCondition: '',
        isEvent: false,
        eventCondition: '0',
        cityNameCondition: '',
        orderTitle: '',
        jobTagId: '',
        applyType: '',
        overType: '',
        isSalaryChange: ''
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
      subIsContinue: false,
      cancelForm: {
        workerUserId: '',
        workerName: '',
        orderSubId: '',
        orderSubNo: '',
        overType: '',
        cancelReason: ''
      },
      selectOrderSubId: ''
    }
  },
  watch: {
    'form.createTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.workTimeBeginCondition = val[0]
          this.form.workTimeEndCondition = val[1]
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
    formatPayTime(row){
      let text = []
      if (row.subStatus === 4) {
        text.push(`${this.hourFormat(row.autoPayMinutes)}自动确认`)
      } else if (['S1', 'S2', 'S3', 'S3'].indexOf(row.overType) !== -1){
        row.overUserName && text.push(row.overUserName || '')
        row.overTime && text.push(row.overTime || '')
      } else if (['S5', 'S6', 'S7'].indexOf(row.overType) !== -1){
        row.overUserName && text.push(row.overUserName || '')
        row.overTime && text.push(row.overTime || '')
        row.overReason && text.push(row.overReason || '')
      }
      return text.join('，')
    },
    formatSalary(row){
      let salary = `${this.$options.filters['currency']((row.singleSalary + (row.singleServiceCharge || 0)), '', 2)}元 / ${this.$options.filters['currency'](row.singleSalary, '', 2)}元 / ${this.$options.filters['currency'](row.adjustSalary, '', 2)}元`
      const h = this.$createElement
      return h({
        template: `<div>${salary}</div>`
      })
    },
    workerNumHeader(h, { column, $index }){
      return h('span', [
        h('span', '工资 '),
        h('el-tooltip', {
          props: {
            content: 'B端日薪 / C端日薪 / 实付工资',
            placement: 'top'
          }
        }, [
          h('i', {
            class: {
              'el-icon-question': true
            }
          })
        ])
      ])
    },
    onCitySelected(item){
      this.form.cityNameCondition = item.districtName
    },
    onScreenList(){
      if (this.form.pageIndex === 1){
        this.queryOrderList()
      } else {
        this.form.pageIndex = 1
      }
    },
    async queryOrderList() {
      try {
        if (this.loading){
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
    onExport(){
      this.queryOrderList()
      this.$$main.execute('/Order/Query/ListSub', {
        header: {
          method: 'Export'
        },
        body: this.form,
        onSuccess: (data, res) => {
          if (res && res.attachments && res.attachments.url) {
            window.open(res.attachments.url)
          } else {
            this.$message.error('文件导出失败')
          }
        },
        onError: (e) => {
          e.message && this.$message.error(e.message)
        }
      })
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
      this.form.workerNameOrMobileCondition = (this.$route.query && this.$route.query.phone) || ''
      this.queryOrderList()
    },
    clearQueryParams(){
      this.$refs['citySelect'].clear()
      this.form = {
        orderNoOrTitleCondition: '',
        companyNameOrMobileCondition: '',
        orderContactOrPhoneCondition: '',
        workerNameOrMobileCondition: '',
        createTime: [],
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        subStatusCondition: '',
        trainCondition: '',
        isEvent: false,
        eventCondition: '0',
        cityNameCondition: '',
        orderTitle: '',
        jobTagId: '',
        applyType: '',
        overType: '',
        isSalaryChange: '',
        pageIndex: 1,
        pageSize: 20
      }
    },
    timeDiff(startTime, endTime){
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    },
    hourFormat(time){
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
    },
    async subOrderDoPay(scope){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoPay({
          orderSubId: scope.row.orderSubId,
          confirmAmount: (scope.row.singleSalary + (scope.row.singleServiceCharge || 0))
        })
        this.$message({
          message: `子订单 ${scope.row.orderSubNo} 支付成功`,
          type: 'success'
        })
        this.queryOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onCancelClick({row}){
      this.subIsContinue = !!row.continuityOrderId
      this.cancelForm = {
        workerUserId: row.workerUserId || '',
        workerName: row.workerName || '',
        orderSubId: row.orderSubId || '',
        orderSubNo: row.orderSubNo || '',
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
