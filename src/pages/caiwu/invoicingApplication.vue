<template>
  <x-page breadcrumb="auto" title="开票申请">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="开票单号">
            <el-input placeholder="开票单号" v-model="form.invoiceNo" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="发票金额">
            <el-input placeholder="发票金额" v-model="form.invoiceAmount" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="发票类型">
            <el-select placeholder="发票类型" v-model="form.invoiceType" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="专票" value="Z"/>
              <el-option label="普票" value="P"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select placeholder="审核状态" v-model="form.status" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="未审核" value="W"/>
              <el-option label="同意" value="M"/>
              <el-option label="驳回" value="R"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        header-align="center"
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          align="center"
          fixed="left"
          prop="formatApplyTime"
          label="创建时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="invoiceNo"
          label="开票单号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderAmount"
          label="开票金额(元)"
          min-width="80">
            <span slot-scope="scope">{{ scope.row.orderAmount / 100 | currency }}</span>
        </el-table-column>
        <el-table-column
          align="center"
          prop="invoiceType"
          label="发票类型"
          min-width="80"
          :formatter="formatStyle">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="审核状态"
          min-width="80"
          :formatter="formatStatus">
        </el-table-column>
        <el-table-column
          align="center"
          prop="rejectReason"
          label="客户备注"
          min-width="120">
        </el-table-column>
        <el-table-column align="center" class="text-center" minWidth="60" label="操作" fixed="right">
          <!--默认显示详细，后面审核后显示审核者名称-->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click.native="$router.push(`/caiwu/applicationDeital/${scope.row.applyId}`)">详情
            </el-button>
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
  </x-page>
</template>

<script>
export default {
  name: 'invoicing-application',
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      centerDialogVisible: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        invoiceAmount: '',
        invoiceNo: '',
        invoiceType: '',
        status: ''
      },
      visible2: false
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
    formatAmount(row, column) {
      let arr = {
        'S1': '预约中',
        'S2': '待服务',
        'S3': '服务中',
        'S4': '服务完成',
        'S5': '已取消'
      }
      return arr[row.serviceStatus]
    },
    formatStyle(row, column){
      let arr = {
        'IO': '普票',
        'IE': '专票'
      }
      return arr[row.invoiceType]
    },
    formatStatus(row, column) {
      let arr = {
        'W': '待审核',
        'M': '开票中',
        'D': '已寄出',
        'R': '驳回'
      }
      return arr[row.status]
    },
    async queryOrderList() {
      this.loading = true
      const data = await this.$$main.aFinanceApplyInvoiceList(this.form)
      this.loading = false
      this.totalCount = data.totalCount
      this.orderList = data.datas
    },
    onPageShow() {
      this.queryOrderList()
    }
  },
  mounted() {
  }
}
</script>
