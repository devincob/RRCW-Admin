<template>
  <x-page breadcrumb="auto" title="调整工资记录">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <!--子订单号（模糊）、兼职姓名（模糊）、调整时间范围、调整状态（待审批、审批通过、审批驳回）-->
          <el-form-item label="子订单号">
            <el-input placeholder="请输入子订单号" v-model="form.orderSubNo" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="兼职姓名">
            <el-input placeholder="请输入兼职姓名" v-model="form.workerName" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="调整时间">
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
          <el-form-item label="调整状态">
            <el-select placeholder="状态" v-model="form.changeStatus" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="待审批" value="W"/>
              <el-option label="审批通过" value="P"/>
              <el-option label="审批驳回" value="R"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onScreenList">筛选</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
            <!--<el-button type="primary" @click="onExport">导出<i class="el-icon-download el-icon&#45;&#45;right"></i></el-button>-->
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
        <!--3.列表字段：子订单号和订单标题（点击跳转至子订单详情）、
        上班时间、累计调整、本次调整、调整原因、兼职（姓名和手机）、
        状态、驳回原因、创建人、创建时间、审核人、审核时间-->
        <el-table-column prop="orderSubNo" label="订单标题/子订单号" fixed min-width="220">
          <template slot-scope="scope">
            <div>{{scope.row.orderTitle}}</div>
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="showBeginTime" label="上班时间" min-width="150">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.beginTime, 'MM-dd 周www')}} {{timeDiff(scope.row.beginTime, scope.row.endTime)}}</div>
            <div>{{$utils.dateFormat(scope.row.beginTime, 'hh:mm')}}~{{$utils.dateFormat(scope.row.endTime, 'hh:mm')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="singleSalary" label="原工资（含服务费）" min-width="150" :formatter="formatOrderSalary"/>
        <el-table-column prop="changeAmount" label="本次调整" min-width="100"  :formatter="formatRowAmount"/>
        <el-table-column prop="changeReason" label="调整原因" min-width="200"/>
        <el-table-column prop="workerName" label="兼职（姓名和手机）" min-width="150">
          <template slot-scope="scope">
            <a :href="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">
              {{scope.row.workerName}}
            </a>
            <!--<span style="margin-left: 5px">{{formatSex(scope.row.workerSex || 'D')}}</span>-->
            <div>{{scope.row.workerMobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="changeStatus" label="状态" width="100">
          <template slot-scope="scope">
            <div>{{formatStatus(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="auditReason" label="驳回原因" min-width="200"/>
        <el-table-column prop="changeUserName" label="创建人" min-width="100"/>
        <el-table-column prop="changeTime" label="创建时间" min-width="150"/>
        <el-table-column prop="auditUserName" label="审核人" min-width="100"/>
        <el-table-column prop="auditTime" label="审核时间" min-width="150"/>
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
  </x-page>
</template>

<script>
export default {
  name: 'adjust-salary-record',
  components: {},
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderSubNo: '', // 子订单号
        workerName: '', // 兼职姓名
        createTime: [], // 创建时间
        beginChangeTime: '',
        endChangeTime: '',
        changeStatus: 'W' // 调整状态
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
      }
    }
  },
  watch: {
    'form.createTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.beginChangeTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.endChangeTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.beginChangeTime = ''
          this.form.endChangeTime = ''
        }
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
    formatOrderSalary(row){
      return `${this.$options.filters['currency']((Number(row.singleSalary) || 0) + (Number(row.singleServiceCharge) || 0), '', 2)}元`
    },
    formatRowAmount(row, column, cellValue){
      return `${this.$options.filters['currency'](cellValue || 0, '', 2)}元`
    },
    formatSex(sex){
      const sexs = {
        'N': '不限',
        'M': '男',
        'F': '女',
        'D': ''
      }
      return sexs[sex || 'N']
    },
    formatStatus(row) {
      let overArr = {
        'W': '待审批',
        'P': '审批通过',
        'R': '审批驳回',
        'N': ''
      }
      return overArr[row.changeStatus || 'N']
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
        const data = await this.$$main.orderQueryListSalaryChange(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    // onExport(){
    //   this.queryOrderList()
    //   this.$$main.execute('/Order/Query/ListSub', {
    //     header: {
    //       method: 'Export'
    //     },
    //     body: this.form,
    //     onSuccess: (data, res) => {
    //       if (res && res.attachments && res.attachments.url) {
    //         window.open(res.attachments.url)
    //       } else {
    //         this.$message.error('文件导出失败')
    //       }
    //     },
    //     onError: (e) => {
    //       e.message && this.$message.error(e.message)
    //     }
    //   })
    // },
    onPageShow() {
      this.clearQueryParams()
      // this.form.workerName = (this.$route.query && this.$route.query.workerName) || ''
      this.queryOrderList()
    },
    clearQueryParams(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        orderSubNo: '', // 子订单号
        workerName: '', // 兼职姓名
        createTime: [], // 创建时间
        beginChangeTime: '',
        endChangeTime: '',
        changeStatus: 'W' // 调整状态
      }
    },
    timeDiff(startTime, endTime){
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    }
  },
  mounted() {
  }
}
</script>
