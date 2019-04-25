<template>
  <x-page breadcrumb="auto" title="后付费订单列表">
    <el-card class="no-box-shadow el-card-mini">
      <el-form :inline="true" :model="form" size="mini">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNo" placeholder="订单号"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.postPayStatus" placeholder="状态">
            <el-option v-for="(label, value) in statusText" :label="label" :value="value" :key="value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
          <el-button type="danger" @click="clear">清除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="singleTable"
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        :border="true"
        highlight-current-row
        style="width: 100%">
        <el-table-column prop="orderNo" label="编号" min-width="150">
          <a slot-scope="scope" :href="'/order/invoice-order-details?orderid=' + scope.row.orderId" target="_blank">{{scope.row.orderNo}}</a>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" min-width="100">
          <customer-details-dialog slot-scope="scope" :customer-id="scope.row.customerId">
            {{scope.row.customerName}}
          </customer-details-dialog>
        </el-table-column>
        <el-table-column prop="sourceTaxName" label="税源地" min-width="100">
          <tax-source-details-dialog slot-scope="scope" :source-tax-id="scope.row.sourceTaxId">
            {{scope.row.sourceTaxName}}
          </tax-source-details-dialog>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品" min-width="100">
          <goods-details-dialog slot-scope="scope" :goods-id="scope.row.goodsId">
            {{scope.row.goodsName}}
          </goods-details-dialog>
        </el-table-column>
        <el-table-column prop="invoiceAmount" label="开票金额" min-width="100" align="right"/>
        <el-table-column prop="invoiceTypeName" label="发票类型" min-width="100"/>
        <el-table-column prop="bussinessName" label="商务" min-width="100"/>
        <el-table-column prop="financeName" label="待处理人" min-width="100"/>
        <el-table-column prop="totalAmount" label="已收金额/总金额" min-width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.actualAmount}}/{{scope.row.totalAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="postStatus" label="状态" min-width="100">
          <span slot-scope="scope">{{statusText[scope.row.postStatus]}}</span>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" min-width="130"/>
        <el-table-column prop="cutOffTime" label="收款截止时间" min-width="130"/>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <bank-receipt-dialog v-if="scope.row.postStatus !== 'A'"
                                 :order-id="scope.row.orderId" type="I" size="mini">
              收款
            </bank-receipt-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right mt">
        <el-pagination
          @size-change="size => form.pageSize = size"
          @current-change="index => form.pageIndex = index"
          :current-page="form.pageIndex"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
  </x-page>
</template>

<script>
import BankReceiptDialog from '../../components/BankReceiptDialog'
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'postpaid-orders',
  components: { BankReceiptDialog, TaxSourceDetailsDialog, CustomerDetailsDialog, GoodsDetailsDialog, CompanyDetailsDialog },
  data() {
    return {
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderNo: '',
        postPayStatus: 'W' // 状态(已支付A,支付中H,未支付W)
      },
      loading: false,
      totalCount: 0,
      orderList: [],
      statusText: {A: '已支付', W: '未支付'}
    }
  },
  watch: {
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
    onPageShow(){
      this.clear()
      this.queryOrderList()
    },
    async queryOrderList(){
      try {
        if (this.loading) {
          return
        }
        this.loading = true
        const data = await this.$$main.orderIOPostPayList(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clear(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        orderNo: '', // 订单号
        postPayStatus: 'W'
      }
    }
  },
  mounted() {
  }
}
</script>
