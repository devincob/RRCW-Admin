<template>
  <x-page breadcrumb="auto" title="银行流水预警">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow" style="min-width:800px;min-height:1000px">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="客户名称：">
            <el-input v-model="warningForm.customerName" placeholder="请输入客户名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="站点名称：">
            <el-input v-model="warningForm.companyName" placeholder="请输入站点名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadWaitHandleList">搜索</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        :border="true"
        :highlight-current-row="true"
        size="mini">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="编号" prop="warningId" min-width="50" align="center" fixed/>
        <el-table-column label="站点名称" prop="companyName"  min-width="180">
          <CompanyDetailsDialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </CompanyDetailsDialog>
        </el-table-column>
        <el-table-column label="客户名称" prop="customerName" min-width="70">
          <CustomerDetailsDialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </CustomerDetailsDialog>
        </el-table-column>
        <el-table-column label="交易日期" prop="tradeTime" min-width="150"/>
        <el-table-column label="预警项目" prop="warningContent" min-width="250"/>
        <el-table-column label="处置结果" prop="handleContent" min-width="250"/>
        <el-table-column label="处置时间" prop="handleTime" min-width="150"/>
        <el-table-column label="操作" min-width="150" align="center" header-align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onClickHandleWarning(scope.row)"
                       :disabled="scope.row.handleStatus === 'A'"
                       v-html="scope.row.handleStatus === 'W' ? '待处理' : '已处理'">
            </el-button>
            <!--全部流水-->
            <router-link :to="`/risk-control/bank-entry?companyName=${scope.row.companyName}`" target="_blank">全部流水</router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="warningForm.pageSize"
          :current-page.sync="warningForm.pageIndex"
          @size-change="(size) => this.warningForm.pageSize = size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <el-dialog title="处理银行预警" v-drag-dialog="{reset: true}"  width="500px" center
                 :before-close="handleBeforeClose"
                 :visible.sync="dialogFormVisible">
        <el-form :model="handleForm" :rules="rulesForm" status-icon ref="handleForm" label-width="80px">
            <el-form-item label="处理内容" prop="handleContent">
            <el-input type="textarea" v-model="handleForm.handleContent"
                      :autosize="{ minRows: 4, maxRows: 8}"
                      placeholder="请输入处理内容"
                      max="10"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleWarning">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </x-page>
</template>

<script>
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'

export default {
  name: 'bank-flow-warning',
  components: {GoodsDetailsDialog, CompanyDetailsDialog, CustomerDetailsDialog, TaxSourceDetailsDialog},
  data() {
    return {
      tableData: [],
      totalCount: 0,
      warningForm: {
        pageIndex: 1,
        pageSize: 15,
        companyName: '', // 站点名称
        customerName: '' // 客户姓名
      },
      loading: false,
      handleForm: {
        warningId: '',
        handleContent: ''
      },
      dialogFormVisible: false,
      rulesForm: {
        handleContent: [
          {required: true, message: '预警处理内容不能为空', trigger: ['blur', 'change']},
          {required: true, message: '预警处理内容不能能超过100字', min: 0, max: 100, trigger: ['blur', 'change']}
        ]
      }
    }
  },
  watch: {
    'warningForm.pageIndex': {
      handler: function () {
        this.loadWaitHandleList()
      },
      deep: true
    },
    'warningForm.pageSize': {
      handler: function () {
        this.loadWaitHandleList()
      },
      deep: true
    }
  },
  methods: {
    onClickHandleWarning(row){ // 点击待处理button,显示dialog确认框 清除dialog验证
      let Row = JSON.parse(JSON.stringify(row))
      this.handleForm.handleContent = Row.handleForm || ''
      this.handleForm.warningId = Row.warningId
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.handleForm.clearValidate()
      })
    },
    handleWarning(){ // 输入dialog处理内容 进行验证 然后处理
      this.$refs['handleForm'].validate((valid) => {
        if (valid) {
          this.handleWarningConfirm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleWarningConfirm(){ // 验证通过后的处理函数
      try {
        const result = await this.$$main.riskHandleCompanyWaterWarning(this.handleForm)
        if (result){
          this.dialogFormVisible = false
          this.loadWaitHandleList()
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    handleBeforeClose(){ // 点dialog右上角X||modal||取消时,关闭dialog 刷新页面
      this.dialogFormVisible = false
      this.loadWaitHandleList()
    },
    async loadWaitHandleList() { // 银行流水预警列表
      if (this.loading){
        return
      }
      this.loading = true
      try {
        const result = await this.$$main.riskQueryCompanyWaterWarning(// RiskHandleCompanyWaterWarning
          this.warningForm
        )
        this.totalCount = result.totalCount
        this.tableData = result.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){ // list 搜索参数清空
      this.warningForm = {
        pageIndex: 1,
        pageSize: 15,
        companyName: '',
        customerName: ''
      }
    },
    onPageShow() {
      this.clearQueryParams()
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>
