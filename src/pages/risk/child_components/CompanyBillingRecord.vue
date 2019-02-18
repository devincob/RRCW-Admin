<template>
  <div>
    <el-card class="el-card-mini no-box-shadow" style="border-width: 1px;border-radius: 0;">
      <div slot="header">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          开票合计
          <div>
            周期
            <el-date-picker
              v-model="total_billing_date"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <table class="detail-table" v-if="sumInvoice">
        <tr>
          <td>累计开票金额</td>
          <td>{{sumInvoice.sumInvoiceAmount | currency}}</td>
          <td>累计开票次数</td>
          <td>{{sumInvoice.invoiceCount}}</td>
        </tr>
        <tr>
          <td>最后开票日期</td>
          <td>{{sumInvoice.lastInvoiceTime || '-'}}</td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </el-card>
    <el-card class="el-card-mini no-box-shadow" style="border-width: 1px;margin-top: 10px;border-radius: 0;">
      <div slot="header">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          开票记录
          <div>
            周期
            <el-date-picker
              v-model="billing_record_date"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <el-table v-if="invoices"
                :border="true"
                :highlight-current-row="true"
                size="mini"
                :data="invoices">
        <el-table-column label="公司名称" prop="companyName" min-width="200"></el-table-column>
        <el-table-column label="金额" prop="invoiceAmount" align="right">
          <span slot-scope="scope">{{scope.row.invoiceAmount | currency('')}}</span>
        </el-table-column>
        <el-table-column label="发票类型" prop="invoiceTypeName"></el-table-column>
        <el-table-column label="创建时间" prop="submitTime"></el-table-column>
        <el-table-column label="完成时间" prop="orderCompletedTime"></el-table-column>
        <el-table-column label="状态" prop="workflowName"></el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="pz => pageSize = pz"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CompanyBillingRecord',
  props: {
    companyId: Number
  },
  data(){
    return {
      total_billing_date: '',
      billing_record_date: '',
      billTotalBeginTime: '',
      billTotalEndTime: '',
      billRecordBeginTime: '',
      billRecordEndTime: '',
      sumInvoice: null,
      invoices: null,
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0
    }
  },
  watch: {
    companyId(){
      if (this.companyId) {
        this.loadBillTotal()
        this.loadBillHistory()
      }
    },
    total_billing_date(val) {
      if (val && val.length > 0) {
        this.billTotalBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.billTotalEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
      } else {
        this.billTotalBeginTime = ''
        this.billTotalEndTime = ''
      }
      if (this.companyId) {
        this.loadBillTotal()
      }
    },
    billing_record_date(val){
      if (val && val.length > 0) {
        this.billRecordBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.billRecordEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
      } else {
        this.billRecordBeginTime = ''
        this.billRecordEndTime = ''
      }
      if (this.pageIndex !== 1) {
        this.pageIndex = 1
      } else {
        this.loadBillHistory()
      }
      // this.pageIndex = 1
      // this.companyId && this.loadBillHistory()
    },
    pageSize(){
      this.loadBillHistory()
    },
    pageIndex(){
      this.loadBillHistory()
    }
  },
  methods: {
    async loadBillTotal(){
      try {
        this.sumInvoice = await this.$$main.companySumInvoice({
          beginTime: this.billTotalBeginTime,
          endTime: this.billTotalEndTime,
          companyId: this.companyId
        })
      } catch (e) {
        this.sumInvoice = null
        e.message && this.$message.error(e.message)
      }
    },
    async loadBillHistory(){
      try {
        const res = await this.$$main.companyStatisticsInvoice({
          'beginTime': this.billRecordBeginTime,
          'endTime': this.billRecordEndTime,
          companyId: this.companyId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        this.invoices = res.datas
        this.totalCount = res.totalCount
      } catch (e) {
        this.invoices = []
        this.totalCount = 0
        e.message && this.$message.error(e.message)
      }
    }
  },
  mounted(){
    if (this.companyId) {
      this.loadBillTotal()
      this.loadBillHistory()
    }
  }
}
</script>

<style scoped>

</style>
