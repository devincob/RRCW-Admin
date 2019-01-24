<template>
  <x-page breadcrumb="auto" title="差额订单列表">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input placeholder="请输入订单号" v-model="form.orderNo" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="客户">
            <el-input placeholder="请输入客户姓名" v-model="form.customerName" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="站点">
            <el-input v-model="form.companyName" placeholder="请输入站点名称" style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item label="税源地">-->
            <!--<el-select placeholder="岗位" v-model="form.sourceTaxId" style="width: 120px">-->
              <!--<el-option label="全部" value=""/>-->
              <!--<el-option-->
                <!--v-for="item in sourceTaxList"-->
                <!--:key="item.sourceTaxId"-->
                <!--:label="item.sourceTaxName"-->
                <!--:value="item.sourceTaxId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="商品">
            <el-select placeholder="请选择商品商品" v-model="form.goodsId" style="width: 130px">
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
          <!--<el-form-item label="订单完成时间">-->
            <!--<el-date-picker-->
              <!--popper-class="orders-date-picker"-->
              <!--style="width: 220px"-->
              <!--type="daterange"-->
              <!--align="right"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期"-->
              <!--:picker-options="pickerOptions"-->
              <!--v-model="form.orderCompletedTime">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
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
        <el-table-column fixed prop="orderNo" label="订单号" min-width="210">
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
        <!--订单编号OrderId,int订单号,OrderNo,string客户编号,CustomerId,int站点编号,ComapnyId,int商务编号,CreateAdminUserId-->
        <!--订单号、客户、站点、开票金额、实际开票金额、发票差额、发票类型、商务、商务提交时间、订单完成时间、操作（补录发票）-->
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
        <el-table-column prop="goodsName" label="商品" min-width="120">
          <goods-details-dialog slot-scope="scope" :goods-id="scope.row.goodsId">
            {{scope.row.goodsName}}
          </goods-details-dialog>
        </el-table-column>
        <el-table-column prop="invoiceAmount" label="开票金额" min-width="120" :formatter="formatterMoney"/>
        <el-table-column prop="actualAmount" label="实际开票金额" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.actualAmount, '', 2)} 元`"/>
        <el-table-column prop="differeceAmount" label="发票差额" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.differeceAmount, '', 2)} 元`"/>
        <el-table-column prop="invoiceTypeName" label="发票类型" min-width="150"/>
        <el-table-column prop="bussinessName" label="商务" min-width="120"/>
        <el-table-column prop="submitTime" label="商务提交时间" min-width="150"/>
        <el-table-column prop="orderCompletedTime" label="订单完成时间" min-width="150"/>
        <!--<el-table-column label="税源地" prop="sourceTaxName" min-width="120">-->
          <!--<tax-source-details-dialog slot-scope="scope" :source-tax-id="scope.row.sourceTaxId">-->
            <!--{{scope.row.sourceTaxName}}-->
          <!--</tax-source-details-dialog>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <router-link style="color: #409EFF;" :to="`/order/invoice-order-details?orderid=${scope.row.orderId}&type=d`" target="_blank">补录发票</router-link>
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
  </x-page>
</template>

<script>
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'difference-order-list',
  components: {TaxSourceDetailsDialog, CustomerDetailsDialog, GoodsDetailsDialog, CompanyDetailsDialog},
  data() {
    return {
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderNo: '', // 订单号
        customerName: '', // 客户姓名
        goodsId: '', // 商品（商品id:goodsId,商品名称:goodsName）商品编号
        companyName: '', // 站点名称
        submitTime: '', // 商务提交时间（起始）
        beginSubmitTime: '', // 提交订单开始时间
        endSubmitTime: '' // 提交订单结束时间
      },
      totalCount: 0,
      // sourceTaxList: [], // 税源地列表
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
          this.form.beginSubmitTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.endSubmitTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.beginSubmitTime = ''
          this.form.endSubmitTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    formatterMoney(row, column, cellValue){
      const h = this.$createElement
      let amount = this.$options.filters['currency'](cellValue, '', 2)
      return h({
        template: `<span>${amount} 元</span>`
      })
    },
    onPageShow(){
      // this.querySourceTaxList()
      this.queryGoodsList()
      this.clearQueryParams()
    },
    // async querySourceTaxList(){
    //   try {
    //     this.sourceTaxList = await this.$$main.commonListSourceTax()// 税源地列表
    //   } catch (e) {
    //     this.sourceTaxList = []
    //   }
    // },
    async queryGoodsList(){
      try {
        this.goodsList = await this.$$main.commonListGoods()// 商品列表
      } catch (e) {
        this.goodsList = []
      }
    },
    async queryInvoiceOrders(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.orderDiffList(this.form)
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
        orderNo: '', // 订单号
        customerName: '', // 客户姓名
        goodsId: '', // 商品（商品id:goodsId,商品名称:goodsName）商品编号
        companyName: '', // 站点名称
        submitTime: '', // 商务提交时间（起始）
        beginSubmitTime: '', // 提交订单开始时间
        endSubmitTime: '' // 提交订单结束时间
      }
    }
  },
  mounted() {
  }
}
</script>
