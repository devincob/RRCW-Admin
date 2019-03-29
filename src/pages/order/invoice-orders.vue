<template>
  <x-page breadcrumb="auto" title="开票订单列表">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input placeholder="请输入订单号" v-model="form.orderNo" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="税源地">
            <el-select placeholder="税源地" v-model="form.sourceTaxId" style="width: 120px">
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
            <el-select placeholder="商品" v-model="form.goodsId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option
                v-for="item in goodsList"
                :key="item.goodsId"
                :label="item.goodsName"
                :value="item.goodsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属商务">
            <el-select placeholder="所属商务" v-model="form.createAdminUserId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option
                v-for="item in businessList"
                :key="item.adminUserId"
                :label="item.userName"
                :value="item.adminUserId">
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
              value-format="yyyy-MM-dd"
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
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              v-model="form.orderCompletedTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input placeholder="请输入客户名称" v-model="form.customerName" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="站点名称">
            <el-input placeholder="请输入站点名称" v-model="form.companyName" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select placeholder="订单状态" multiple collapse-tags v-model="form.workflowIds" style="width: 200px">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryInvoiceOrders">搜索</el-button>
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
        :border="true"
        :highlight-current-row="true"
        style="width: 100%;">
        <el-table-column  prop="orderNo" label="订单号" min-width="210">
          <template slot-scope="scope">
            <router-link v-if="scope.row.workflowId === 0" :to="`/order/invoice-order-create?orderid=${scope.row.orderId}`" target="_blank">
              {{scope.row.orderNo}}
            </router-link>
            <router-link v-else :to="`/order/invoice-order-details?orderid=${scope.row.orderId}`" target="_blank">
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
        <el-table-column prop="companyName" label="站点名称" min-width="200">
          <company-details-dialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </company-details-dialog>
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
        <el-table-column prop="invoiceAmount" align="right" label="开票金额" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.invoiceAmount, '', 2)}`"/>
        <el-table-column prop="invoiceTypeName" align="center" label="发票类型" min-width="150"/>
        <el-table-column prop="handleAdminUserName" align="center" label="待处理人" min-width="120"/>
        <el-table-column prop="workflowName" label="状态" :render-header="renderStatusHeader" min-width="120"/>
        <el-table-column prop="submitTime" label="商务提交时间" min-width="150"/>
        <el-table-column prop="orderCompletedTime" label="订单完成时间" min-width="150"/>
        <el-table-column prop="bussinessName" label="创建人" min-width="120"/>
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
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'invoice-orders',
  components: {TaxSourceDetailsDialog, CustomerDetailsDialog, GoodsDetailsDialog, CompanyDetailsDialog},
  data() {
    return {
      statusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '-1',
        label: '草稿'
      }, {
        label: '待直属领导审批',
        value: '2000'
      }, {
        label: '待CEO审批',
        value: '2010'
      }, {
        label: '待财务收款',
        value: '2090'
      }, {
        label: '待交易员处理',
        value: '2110'
      }, {
        label: '待交易员更新处理',
        value: '2120'
      }, {
        label: '已完成',
        value: '5000'
      }],
      form: {
        pageIndex: 1,
        pageSize: 20,
        // 税源地编号
        sourceTaxId: '',
        // 商品编号
        goodsId: '',
        workflowIds: [],
        createAdminUserId: '',
        // 订单好
        orderNo: '',
        // 客户姓名
        customerName: '',
        // 站点名称
        companyName: '',
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
      businessList: [],
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
        this.queryInvoiceOrders()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryInvoiceOrders()
      },
      deep: true
    },
    'form.submitTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.submitBeginTime = val[0]
          this.form.submitEndTime = val[1]
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
          this.form.orderCompletedBeginTime = val[0]
          this.form.orderCompletedEndTime = val[1]
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
      this.queryBusinessList()
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
    async queryBusinessList(){
      try {
        this.businessList = await this.$$main.commonListBelongAdminUser()
      } catch (e) {
        this.businessList = []
      }
    },
    async queryInvoiceOrders(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.orderInvoiceOrderQuery(this.form)
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
        createAdminUserId: '',
        workflowIds: [],
        orderNo: '',
        customerName: '',
        companyName: '',
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
->待交易员更新处理：交易员更新发票信息
->待跟单确认处理：跟单确认客户是否收到发票
->待客服回访：客服电话回访客户
O订单完成`.replace(/\n/g, '<br>')}</span>
            <i class="el-icon-question" style="font-size: 16px;cursor: pointer;color: #303133" slot="reference"></i>
          </el-popover></span>`
      })
    }
  },
  mounted() {
  }
}
</script>
