<template>
  <x-page breadcrumb="auto" title="开票站点预警">
    <el-card class="box-card" style="min-width: 600px;max-width: 1024px">
      <el-table
        :data="list"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :border="true"
        :highlight-current-row="true"
        size="mini"
        style="width: 100%;">
        <el-table-column prop="companyName" label="站点名称" min-width="160">
          <company-details-dialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </company-details-dialog>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" min-width="80">
          <customer-details-dialog slot-scope="scope" :customer-id="scope.row.customerId">
            {{scope.row.customerName}}
          </customer-details-dialog>
        </el-table-column>
        <el-table-column prop="bussinessName" label="商务" min-width="80"/>
        <el-table-column prop="warningContent" label="预警项目" min-width="200"/>
      </el-table>
    </el-card>
  </x-page>
</template>

<script>
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'invoice-company-warning',
  components: {
    CustomerDetailsDialog, CompanyDetailsDialog
  },
  data() {
    return {
      list: [],
      loading: false
    }
  },
  methods: {
    async queryWarningList(){
      try {
        this.loading = true
        this.list = await this.$$main.riskQueryGoodsIovoiceWarning()
      } catch (e) {
        this.list = []
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.queryWarningList()
  }
}
</script>
