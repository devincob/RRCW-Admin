<template>
  <x-page breadcrumb="auto" title="待确认订单">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="支付单号">
            <el-input placeholder="支付单号" v-model="form.payNoCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input placeholder="订单号" v-model="form.orderNoCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="订单金额">
            <el-input placeholder="订单金额" v-model="form.payAmountCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-input placeholder="付款方式" v-model="form.payTypeCondition" style="width: 100px"/>
          </el-form-item>
          <el-form-item label="付款对象">
            <el-input placeholder="付款对象" v-model="form.payUserCondition" style="width: 100px"/>
          </el-form-item>
          <el-form-item label="服务完成时间">
            <el-date-picker
              style="width: 200px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="form.overTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作">
            <el-select placeholder="支付状态" v-model="form.isConfirmCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="未收款确认" value="S1"/>
              <el-option label="已收款确认" value="S2"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          align="center"
          prop="showOverTime"
          label="服务完成时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="payNo"
          label="支付单号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderNo"
          label="订单号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="payUser"
          label="付款对象"
          min-width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="payAmount"
          label="订单金额(元)"
          min-width="80">
          <span slot-scope="scope">{{ scope.row.payAmount / 100 | currency }}</span>
        </el-table-column>
        <el-table-column
          align="center"
          prop="payType"
          label="付款方式"
          min-width="80"
          :formatter="formatPayType">
        </el-table-column>
        <el-table-column
          align="center"
          prop="showFinanceConfirmTime"
          label="支付时间"
          min-width="120">
        </el-table-column>
        <el-table-column prop="isConfirm" align="center" class="text-center" minWidth="120" label="操作" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.isConfirm ==='Y'">{{scope.row.showFinanceConfirmTime}}</div>
            <el-button v-else
              size="mini"
              type="primary"
              @click.native="showDialog(scope.row)">收款确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
      <el-form :label-position="labelPosition">
        <el-form-item label="付款对象:" :label-width="formLabelWidth">
          <el-input  v-model="payUser" auto-complete="off"  placeholder="请输入付款对象"></el-input>
        </el-form-item>
        <el-form-item label="付款时间:" :label-width="formLabelWidth" >
          <el-input  v-model="payTime" auto-complete="off"  placeholder="格式2018/12/23 12:20:12"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="payTypes === 'T2'">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="keepEdit" :disabled = "payUser === '' || payTime === ''">保 存</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click.native="dialogFormVisible = false">确 定</el-button>
        </div>
       </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'no-confirmed',
  data () {
    return {
      payTypes: '',
      payUser: '',
      payTime: '2018/3/22 12:20:20',
      dialogTitle: '',
      labelPosition: 'left',
      formLabelWidth: '100px',
      dialogFormVisible: false,
      orderList: [],
      totalCount: 0,
      loading: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        payAmountCondition: '', // 订单金额
        payTypeCondition: '', // 支付方式
        payUserCondition: '', // 付款对象
        OrderNoCondition: '', // 订单号
        payNoCondition: '', // 支付单号
        overTime: [], // 订单金额
        overTimeBeginCondition: '', // 服务完成时间
        overTimeEndCondition: '', // 服务完成时间
        isConfirmCondition: ''
      },
      visible2: false,
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
    'form.overTime': {
      handler: function(val){
        if (val && val.length > 0){
          let beginDate = new Date(val[0])
          let endDate = new Date(val[1])
          this.form.OverTimeBeginCondition = `${beginDate.getFullYear()}-${beginDate.getMonth() + 1}-${beginDate.getDate()}`
          this.form.overTimeEndCondition = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
        } else {
          this.form.OverTimeBeginCondition = ''
          this.form.overTimeEndCondition = ''
        }
      },
      deep: true
    },
    'form.pageIndex': {
      handler: function(){
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function(){
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    keepEdit (){
      this.dialogFormVisible = false
      this.$$main.aFinanceDoOrderConfirm({
        waitId: this.waitId,
        payUser: this.payUser,
        payTime: this.payTime
      }).then(res => {
        if (res) {
          this.queryOrderList()
          this.$showToast({
            autoClose: 1000,
            message: '操作成功',
            type: 'success'
          })
        }
      }).catch(({message}) => {
        this.$showToast({message})
      })
    },
    showDialog (item) {
      // 'T1': '线上','T2': '线下'
      this.dialogFormVisible = true
      if (item.payType === 'T1'){
        this.dialogTitle = '线上付款(财税师服务)'
        this.payUser = item.payUser
        this.payTime = item.showPayTime
        this.payTypes = item.payType
      } else {
        if (item.orderType === 'F') {
          this.dialogTitle = '线下付款(一口价)'
          this.payUser = item.payUser
          this.payTypes = item.payType
        } else {
          this.payTypes = item.payType
          this.dialogTitle = '线下付款财(财税师服务)'
          this.payUser = ''
        }
      }
      this.waitId = item.waitId
      this.orderType = item.orderType
    },
    formatPayType (row, column) {
      let arr = {
        'T1': '线上',
        'T2': '线下'
      }
      return arr[row.payType]
    },
    async queryOrderList() {
      this.loading = true
      const data = await this.$$main.aFinanceQueryWaitConfirmOrderList(this.form)
      this.loading = false
      this.totalCount = data.datas.totalCount
      this.orderList = data.datas
    },
    onPageShow(){
      this.queryOrderList()
    }
  },
  mounted(){
  }
}
</script>
