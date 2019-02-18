<template>
  <x-page breadcrumb="auto" title="调整工资审批">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <!--查询条件：子订单号（模糊）、兼职姓名（模糊）-->
          <el-form-item label="子订单号">
            <el-input placeholder="请输入子订单号" v-model="form.orderSubNo" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="兼职姓名">
            <el-input placeholder="请输入兼职姓名" v-model="form.workerName" style="width: 140px"/>
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
        :highlight-current-row="true"
        :border="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <!--子订单（单号和标题）上班时间、累计调整、本次调整、调整原因、兼职（姓名和手机）、状态、创建人、创建时间、操作（审批）-->
        <el-table-column prop="orderSubNo" label="订单标题/子订单号" min-width="220">
          <template slot-scope="scope">
            <div>{{scope.row.orderTitle}}</div>
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="上班时间" min-width="150">
          <template slot-scope="scope">
            <div>{{$utils.dateFormat(scope.row.beginTime, 'MM-dd 周www')}} {{timeDiff(scope.row.beginTime, scope.row.endTime)}}</div>
            <div>{{$utils.dateFormat(scope.row.beginTime, 'hh:mm')}}~{{$utils.dateFormat(scope.row.endTime, 'hh:mm')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="singleSalary" label="原工资（含服务费）" min-width="150" :formatter="formatOrderSalary"/>
        <el-table-column prop="changeAmount" label="本次调整" min-width="120"  :formatter="formatRowAmount"/>
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
        <el-table-column prop="changeStatus" label="状态" width="150">
          <template slot-scope="scope">
            <div>{{formatStatus(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="changeUserName" label="创建人" min-width="120"/>
        <el-table-column prop="changeTime" label="创建时间" min-width="150"/>
        <el-table-column prop="changeStatus" label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button @click="onShowAdjustDialog(scope)" type="warning" size="mini" v-if="scope.row.changeStatus === 'W'">审批</el-button>
            <el-button type="text" size="mini" class="no-padding" v-if="scope.row.changeStatus === 'P'">审批通过</el-button>
            <el-button type="text" size="mini" class="no-padding" v-if="scope.row.changeStatus === 'R'">审批驳回</el-button>
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
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="调整工资审批"
      :visible.sync="passOrNotDialogVisible"
      width="500px"
      center>
      <el-form ref="passOrNotForm" :model="passOrNotForm" :rules="passOrNotRules" size="small" label-width="100px">
        <el-form-item label="订单标题：">
          <el-row>
            <el-col><div class="grid-content">{{adjustInfo.orderTitle}}</div></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-row>
            <el-col ><div class="grid-content">{{adjustInfo.orderSubNo}}</div></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上班时间：">
          <el-row>
            <el-col ><div class="grid-content"></div>{{adjustInfo.beginTime}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="调整兼职：">
          <el-row>
            <el-col :span="4"><div class="grid-content">{{adjustInfo.workerName}}</div></el-col>
            <el-col :span="8"><div class="grid-content">{{adjustInfo.workerMobile}}</div></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="原工资：">
          {{(adjustInfo.singleSalary || 0) + (adjustInfo.singleServiceCharge || 0) | currency('', 2)}} 元（含服务费）
        </el-form-item>
        <el-form-item label="本次调整：">
          <el-row>
            <el-col :span="8">
              {{formatAdjust(adjustInfo.changeAmount)}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="调整原因：">
          <el-row>
            <el-col><div class="grid-content"> {{adjustInfo.changeReason}}</div></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="驳回原因：" prop="auditReason">
          <el-input v-model="passOrNotForm.auditReason" placeholder="请填写驳回原因" type="textarea" :rows="4"/>
        </el-form-item>
        <el-form-item align="right" style="margin-top: 10px;">
          <el-button  size="small"  type="primary" @click="approvaled">审批通过</el-button>
          <el-button  size="small"  @click="approvalRejection">审批驳回</el-button>
          <el-button  size="small"  @click="passOrNotDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'adjust-salary-approval',
  components: {},
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      adjustInfo: {},
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderSubNo: '', // 子订单号
        workerName: '', // 兼职姓名
        // createTime: [], // 创建时间
        // beginChangeTime: '',
        // endChangeTime: '',
        changeStatus: 'W' // 调整状态
      },
      passOrNotDialogVisible: false,
      passOrNotForm: {
        changeId: '',
        changeStatus: '',
        auditReason: ''
      },
      passOrNotRules: {
        auditReason: [
          { required: true, message: '请填写驳回原因', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 'form.createTime': {
    //   handler: function (val) {
    //     if (val && val.length > 0) {
    //       this.form.beginChangeTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
    //       this.form.endChangeTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
    //     } else {
    //       this.form.beginChangeTime = ''
    //       this.form.endChangeTime = ''
    //     }
    //   },
    //   deep: true
    // },
    // 'form.isEvent': {
    //   handler: function (val) {
    //     this.form.eventCondition = val ? '1' : '0'
    //   },
    //   deep: true
    // },
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
    formatOrderSalary(row, column, cellValue){
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
    formatAdjust(row = 0){
      return this.$options.filters['currency'](row, '', 2) + ' 元'
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
      this.form.workerName = (this.$route.query && this.$route.query.phone) || ''
      this.queryOrderList()
    },
    clearQueryParams(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        orderSubNo: '', // 子订单号
        workerName: '', // 兼职姓名
        // createTime: [], // 创建时间
        // beginChangeTime: '',
        // endChangeTime: '',
        changeStatus: 'W' // 调整状态
      }
    },
    timeDiff(startTime, endTime){
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    },
    onShowAdjustDialog(scope){
      this.passOrNotForm.changeId = scope.row.changeId
      this.passOrNotForm.auditReason = ''
      this.adjustInfo = scope.row
      this.passOrNotDialogVisible = true
      this.$nextTick(() => {
        this.$refs['passOrNotForm'].clearValidate()
      })
    },
    async approvaled(){ // 审批通过
      this.passOrNotForm.changeStatus = 'P'
      this.passOrNotForm.auditReason = ' '
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoChangeAudit(this.passOrNotForm)
        this.passOrNotDialogVisible = false
        this.$message({
          message: `子订单 ${this.adjustInfo.orderSubNo} 已审批通过`,
          type: 'success'
        })
        this.queryOrderList()
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async approvalRejection(){ // 审批驳回
      this.passOrNotForm.changeStatus = 'R'
      let valid = await this.$refs['passOrNotForm'].validate()
      if (!valid){
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoChangeAudit(this.passOrNotForm)
        this.passOrNotDialogVisible = false
        this.$message({
          message: `子订单 ${this.adjustInfo.orderSubNo} 已驳回`,
          type: 'success'
        })
        this.queryOrderList()
      } catch (e){
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
