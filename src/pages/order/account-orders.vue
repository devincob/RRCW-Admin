<template>
  <x-page breadcrumb="auto" title="开户订单列表">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input placeholder="请输入订单号" v-model="form.orderNo" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="税源地">
            <el-select placeholder="岗位" v-model="form.sourceTaxId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option
                v-for="item in sourceTaxList"
                :key="item.sourceTaxId"
                :label="item.sourceTaxName"
                :value="item.sourceTaxId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品">
            <el-select placeholder="岗位" v-model="form.goodsId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option
                v-for="item in goodsList"
                :key="item.goodsId"
                :label="item.goodsName"
                :value="item.goodsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商务提交时间">
            <el-date-picker
              popper-class="orders-date-picker"
              style="width: 220px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="form.submitTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单完成时间">
            <el-date-picker
              popper-class="orders-date-picker"
              style="width: 220px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="form.orderCompletedTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input placeholder="请输入客户名称" v-model="form.customerName" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryAccountOrders">搜索</el-button>
            <el-button type="danger" @click="clearQueryParams">清空</el-button>
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
        <el-table-column fixed prop="orderNo" label="订单号" min-width="210">
          <template slot-scope="scope">
            <router-link v-if="scope.row.workflowId === 0" :to="`/order/account-order-create?orderid=${scope.row.orderId}`" target="_blank">
              {{scope.row.orderNo}}
            </router-link>
            <router-link v-else :to="`/order/account-order-details?orderid=${scope.row.orderId}`" target="_blank">
              {{scope.row.orderNo}}
            </router-link>
            <el-tag size="mini" v-if="scope.row.isPriority === 'Y'" type="danger">急</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" min-width="120">
          <customer-details-dialog slot-scope="scope" :customer-id="scope.row.customerId">
            {{scope.row.customerName}}
          </customer-details-dialog>
        </el-table-column>
        <el-table-column label="税源地" prop="sourceTaxName" min-width="120">
          <tax-source-details-dialog slot-scope="scope" :source-tax-id="scope.row.sourceTaxId">
            {{scope.row.sourceTaxName}}
          </tax-source-details-dialog>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品" min-width="120">
          <goods-details-dialog slot-scope="scope" :goods-id="scope.row.goodsId">
            {{scope.row.goodsName}}
          </goods-details-dialog>
        </el-table-column>
        <el-table-column prop="totalAmount" label="交易费" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.totalAmount, '', 2)}`"/>
        <el-table-column prop="realDepositFee" label="押金" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.realDepositFee, '', 2)}`"/>
        <el-table-column prop="handleAdminUserName" label="待处理人" min-width="120"/>
        <el-table-column prop="workflowName" label="状态" :render-header="renderStatusHeader" min-width="120"/>
        <el-table-column prop="submitTime" label="商务提交时间" min-width="150"/>
        <el-table-column prop="orderCompletedTime" label="订单完成时间" min-width="150"/>
        <el-table-column prop="createTime" label="创建时间" min-width="150"/>
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
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
export default {
  name: 'account-orders',
  components: {TaxSourceDetailsDialog, CustomerDetailsDialog, GoodsDetailsDialog},
  data() {
    return {
      form: {
        pageIndex: 1,
        pageSize: 20,
        // 税源地编号
        sourceTaxId: '',
        // 商品编号
        goodsId: '',
        // 订单好
        orderNo: '',
        // 客户姓名
        customerName: '',
        submitTime: '',
        // 提交订单开始时间
        submitBeginTime: '',
        // 提交订单结束时间
        submitEndTime: '',
        orderCompletedTime: '',
        orderCompletedBeginTime: '',
        orderCompletedEndTime: ''
      },
      totalCount: 0,
      sourceTaxList: [], // 税源地列表
      goodsList: [], // 商品列表
      orderList: [],
      loading: false,
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
    'form.pageIndex': {
      handler: function () {
        this.queryAccountOrders()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryAccountOrders()
      },
      deep: true
    },
    'form.submitTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.submitBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.submitEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.submitBeginTime = ''
          this.form.submitEndTime = ''
        }
      },
      deep: true
    },
    'form.orderCompletedTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.orderCompletedBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.orderCompletedEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.orderCompletedBeginTime = ''
          this.form.orderCompletedEndTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    onPageShow(){
      this.querySourceTaxList()
      this.queryGoodsList()
      this.clearQueryParams()
    },
    async querySourceTaxList(){
      try {
        this.sourceTaxList = await this.$$main.commonListSourceTax()
      } catch (e) {
        this.sourceTaxList = []
      }
    },
    async queryGoodsList(){
      try {
        this.goodsList = await this.$$main.commonListGoods()
      } catch (e) {
        this.goodsList = []
      }
    },
    async queryAccountOrders(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.orderAccountOrderQuery(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        sourceTaxId: '',
        goodsId: '',
        orderNo: '',
        customerName: '',
        submitTime: '',
        submitBeginTime: '',
        submitEndTime: '',
        orderCompletedTime: '',
        orderCompletedBeginTime: '',
        orderCompletedEndTime: ''
      }
    },
    renderStatusHeader(h, { column }){
      return h({
        template: `<span>${column.label}<el-popover
            trigger="hover">
            <span style="font-size: 12px;">${`订单流程状态说明：
O订单开始
->商务提交订单：商务人员填写下单信息
->待直属领导审批：审批下单信息
->待CEO审批：审批特殊需求
->待跟单处理：跟进订单信息
->待客服确认：客服想客户确认订单信息
->待财务收款：财务根据收款处理订单
->待交易员处理：交易人员根据订单拟定站点注册信息
->待交易员更新进度：交易员更新站点的注册信息至系统
->待交易员验收：站点注册成功后，交易员验收站点材料
->待商务交付：将站点材料交付至客户
->待跟单归档：跟单人员将订单信息纸质化归档
->待客服回访：客服电话回访客户
O订单完成
`.replace(/\n/g, '<br>')}</span>
            <i class="el-icon-question" style="font-size: 16px;cursor: pointer;color: #303133" slot="reference"></i>
          </el-popover></span>`
      })
    }
  },
  mounted() {
  }
}
</script>
