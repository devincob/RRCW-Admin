<template>
  <x-page breadcrumb="auto" title="站点流水查询">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow" style="min-width:800px;min-height:1000px">
      <el-form :inline="true" size="mini" label-width="100px" label-position="left" class="demo-form-inline">
        <el-form-item label="交易日期：">
          <el-date-picker
            v-model="transDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAccountOrders">查询</el-button>
          <el-button type="danger" @click="clearQueryParams">重置</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button type="primary" @click="dialogVisible = true">录入流水</el-button>
          <!--<el-button type="primary" @click="dialogImportVisible = true">导入流水</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="loading"
        @sort-change="onSortChange"
        :border="true"
        :highlight-current-row="true"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="客户" prop="customerName" width="100">
          <customer-details-dialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </customer-details-dialog>
        </el-table-column>
        <el-table-column label="站点名称" prop="companyName">
          <company-details-dialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </company-details-dialog>
        </el-table-column>
        <el-table-column label="贷方发生额总计" sortable="sumInAmount" prop="sumInAmount" align="right">
          <span slot-scope="scope">{{scope.row.sumInAmount|currency('')}}</span>
        </el-table-column>
        <el-table-column label="借方发生额合计" sortable="sumOutAmount" prop="sumOutAmount" align="right">
          <span slot-scope="scope">{{scope.row.sumOutAmount|currency('')}}</span>
        </el-table-column>
        <el-table-column label="交易次数" sortable="tradeCount" prop="tradeCount" align="center"/>
        <el-table-column label="操作" align="center" width="120">
          <a slot-scope="scope" :href="'/risk/company-info?companyId=' + scope.row.companyId + '#flow-record'" target="_blank">流水统计</a>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          class="mt-sm"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="pz => pageSize = pz"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog v-drag-dialog
               title="录入流水"
               width="540px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible">
      <el-form size="mini"
               :model="inFlowForm"
               ref="inForm"
               :rules="inFlowFormRules" label-width="150px">
        <!-- in -->
        <el-form-item label="站点" prop="companyId">
          <el-select style="width: 250px"
                     v-model="inFlowForm.companyId"
                     placeholder="请选择站点"
                     @change="onCompanyChange"
                     filterable
                     remote
                     reserve-keyword
                     :remote-method="queryCompanyList"
                     :loading="loadingCompanyList">
            <el-option
              v-for="item in companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行" prop="bankName">
          <el-select
            v-model="inFlowForm.bankName"
            placeholder="请选择银行">
            <el-option
              v-for="item in bankList"
              :key=item.bankId
              :label="item.bankName"
              :value="item.bankName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期" prop="tradeTime">
          <el-date-picker
            style="width: 250px"
            v-model="inFlowForm.tradeTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易方" prop="traderName" >
          <el-input v-model="inFlowForm.traderName" placeholder="请输入交易方" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="贷方发生额" prop="inAmount">
          <el-input v-model="inFlowForm.inAmount" placeholder="请输入金额" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="借方发生额" prop="outAmount">
          <el-input v-model="inFlowForm.outAmount" placeholder="请输入金额" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="余额" prop="lastAmount">
          <el-input v-model="inFlowForm.lastAmount" placeholder="请输入余额" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="摘要" prop="remark">
          <el-input v-model="inFlowForm.remark" placeholder="请输入摘要" type="textarea" style="width: 250px"/>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="handleSaveInFlow">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="导入站点流水"
               width="540px"
               v-drag-dialog
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogImportVisible">
      <el-form ref="importFlowForm" :model="importFlowForm" size="mini" label-width="150px">
        <el-form-item label="选择站点">
          <el-select style="width: 250px"
                     v-model="inFlowForm.companyId"
                     placeholder="请选择站点"
                     @change="onCompanyChange"
                     filterable
                     remote
                     reserve-keyword
                     :remote-method="queryCompanyList"
                     :loading="loadingCompanyList">
            <el-option
              v-for="item in companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择银行">
          <el-select
            v-model="importFlowForm.bankName"
            placeholder="请选择银行">
            <el-option
              v-for="item in bankList"
              :key=item.bankId
              :label="item.bankName"
              :value="item.bankName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择流水文件">
          <span v-if="currentSelectFile">{{currentSelectFile}}</span>
          <el-upload ref="uploadFile" :action="$$main.getUrl('/Common/ImageUpload')"
                     :show-file-list="false"
                     :limit="1"
                     :before-upload="beforeUpload"
                     :on-error="onUploadError"
                     :on-success="handleUploadSuccess">
            <el-button type="text">{{currentSelectFile ? '重新选择' : '选择文件'}}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="handleImportInFlow">导入</el-button>
          <el-button @click="dialogImportVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </x-page>
</template>摘要
<script>
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'company_flow',
  components: {CompanyDetailsDialog, CustomerDetailsDialog},
  data() {
    return {
      searchForm: {
        tradeBeginTime: '',
        tradeEndTime: ''
      },
      transDate: [],
      tableData: [],
      sorts: null,
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      dialogVisible: false,
      dialogImportVisible: false,

      customerList: [],
      companyList: [],
      bankList: [
        {bankId: 1, bankName: '中国工商银行'},
        {bankId: 2, bankName: '中国建设银行'},
        {bankId: 3, bankName: '中国银行'},
        {bankId: 5, bankName: '中国招商银行'},
        {bankId: 4, bankName: '中国民生银行'}
      ],
      loadingCompanyList: false,
      inFlowForm: {
        companyId: '',
        bankName: '',
        tradeTime: '',
        traderName: '',
        inAmount: '',
        outAmount: '',
        lastAmount: '',
        remark: ''
      },
      inFlowFormRules: {
        companyId: [{ required: true, message: '请选择企业', trigger: 'change' }],
        bankName: [{ required: true, message: '请选择银行', trigger: 'change' }],
        tradeTime: [{ required: true, message: '请选择交易时间', trigger: 'change' }],
        traderName: [{ required: true, message: '请输入交易对象', trigger: 'change' }],
        inAmount: [{ required: true, message: '请输入贷方发生额', trigger: 'change' }],
        outAmount: [{ required: true, message: '请输入借方发生额', trigger: 'change' }],
        lastAmount: [{ required: true, message: '请输入余额', trigger: 'change' }]
        // remark: [{ required: true, message: '请输入备注', trigger: 'change' }]
      },

      currentSelectFile: null,
      importFlowForm: {
        companyId: '',
        bankName: '',
        fileUrl: ''
      }
    }
  },
  watch: {
    pageIndex(){
      this.loadFlow()
    },
    pageSize(){
      this.loadFlow()
    },
    dialogVisible(show){
      !show && this.$refs.inForm.resetFields()
    },
    dialogImportVisible(show){
      if (!show) {
        this.$refs.importFlowForm.resetFields()
        this.currentSelectFile = null
        this.importFlowForm.fileUrl = ''
      }
    },
    transDate(val){
      if (val && val.length > 0) {
        this.searchForm.tradeBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.searchForm.tradeEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
      } else {
        this.searchForm.tradeBeginTime = ''
        this.searchForm.tradeEndTime = ''
      }
      this.pageIndex = 1
    }
  },
  methods: {
    async onPageShow(){
      this.loadFlow()
      await this.queryCompanyList()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.prop,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      } else {
        this.sorts = null
      }
      this.loadFlow()
    },
    async loadFlow(){
      try {
        this.loading = true
        const res = await this.$$main.riskStatisticsComapnyWater({
          ...this.searchForm,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sorts: this.sorts
        })
        this.totalCount = res.totalCount
        this.tableData = res.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async queryCompanyList(query){
      try {
        this.loadingCompanyList = true
        this.companyList = await this.$$main.commonListCompanyAll({
          companyName: query
        })
      } catch (e) {
        this.companyList = []
        e.message && this.$message.error(e.message)
      } finally {
        this.loadingCompanyList = false
      }
    },
    async loadListCustomer() {
      try {
        this.customerList = await this.$$main.commonListCustomer()
      } catch (e) {
        console.log(e)
      }
    },
    queryAccountOrders(){
      this.loadFlow()
    },
    clearQueryParams(){
      this.transDate = []
    },
    onCompanyChange(companyId){
      console.log(companyId)
    },
    async handleSaveInFlow(){
      try {
        const isValid = await this.$refs.inForm.validate()
        if (isValid) {
          const res = await this.$$main.riskSaveCompanyWater({...this.inFlowForm})
          if (res) {
            // this.dialogVisible = false
            this.inFlowForm = {
              ...this.inFlowForm,
              traderName: '',
              inAmount: '',
              outAmount: '',
              lastAmount: ''
            }
            this.$nextTick(() => {
              this.$refs.inForm.clearValidate()
            })
            this.$message.success('录入成功')
            this.loadFlow()
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    beforeUpload(){
      this.loader = this.$loading({ text: '正在上传' })
    },
    onUploadError(){
      this.loader && this.loader.close()
    },
    handleUploadSuccess(res, file){
      try {
        if (!res || !res.isSuccess) {
          this.$message.error((res && res.message) || '')
          return
        }
        this.importFlowForm = {...this.importFlowForm, fileUrl: res.body.imageUrl}
        this.currentSelectFile = file.name
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loader && this.loader.close()
        this.$refs.uploadFile.clearFiles()
      }
    },
    async handleImportInFlow(){
      console.log({...this.importFlowForm})
    }
  }
}
</script>
