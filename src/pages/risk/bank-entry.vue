<template>
  <x-page breadcrumb="auto" title="银行流水录入">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="客户名称：">
            <el-input v-model="form.customerName" placeholder="请输入客户名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="站点名称：">
            <el-input v-model="form.companyName" placeholder="请输入站点名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="交易时间">
            <el-date-picker
              popper-class="orders-date-picker"
              style="width: 220px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              v-model="form.tradeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryBankFlowList">搜索</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onClickImportFlowButton">导入流水</el-button>
            <el-button type="primary" @click="onClickRecordFlowButton">录入流水</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="orderList"
                v-loading="loading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                :border="true"
                :highlight-current-row="true"
                size="mini">
        <el-table-column label="交易日期" prop="tradeTime" fixed width="130"/>
        <el-table-column label="客户" prop="customerName" width="70">
          <CustomerDetailsDialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </CustomerDetailsDialog>
        </el-table-column>
        <el-table-column label="站点名称" prop="companyName" min-width="150">
          <CompanyDetailsDialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </CompanyDetailsDialog>
        </el-table-column>
        <el-table-column label="交易方名称" prop="traderName" min-width="80"/>
        <el-table-column label="摘要" prop="remark" min-width="120"/>
        <el-table-column label="借方发生额" prop="outAmount" width="100" align="right" :formatter="(row) => `${$options.filters['currency'](row.outAmount, '', 2)}`"/>
        <el-table-column label="贷方发生额" prop="inAmount" width="100" align="right"  :formatter="(row) => `${$options.filters['currency'](row.inAmount, '', 2)}`"/>
        <el-table-column label="余额" prop="lastAmount" width="100" align="right"  :formatter="(row) => `${$options.filters['currency'](row.lastAmount, '', 2)}`"/>
        <el-table-column label="银行" prop="bankName" width="120"/>
        <el-table-column label="录入日期" prop="createTime" width="130"/>
        <el-table-column label="操作" align="center" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onDeleteClick(scope.row)">删除</el-button>
            <el-button type="text" size="mini" class="no-padding" @click="onEditClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="form.pageSize"
          :current-page="form.pageIndex"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
      <el-dialog  :title="recordTitle" v-drag-dialog="{reset: true}"
                  :close-on-click-modal="clickModal"
                  :visible.sync="dialogRecordVisible"
                  :before-close="recordBeforeClose"
                  width="540px">
        <el-form :model="recordFlowForm" :rules="rulesRecord" size="mini" status-icon ref="recordFlowForm" label-width="150px">
          <el-form-item prop="companyId" label="站点名称：">
            <el-select
              style="width: 250px"
              reserve-keyword
              v-model="recordFlowForm.companyId"
              filterable
              placeholder="请输入站点名称"
              no-match-text="未搜索到该站点">
              <el-option
                style="max-width: 400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                v-for="item in companyList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行名称：" prop="bankName">
            <el-select
              style="width: 250px"
              reserve-keyword
              filterable
              no-match-text="未搜索该银行名称"
              v-model="recordFlowForm.bankName" placeholder="请选择银行名称">
              <el-option
                v-for="item in bankList"
                :key=item.bankId
                :label="item.bankName"
                :value="item.bankName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易日期：" prop="tradeTime">
            <el-date-picker placeholder="日期格式：1997-07-01"
                            style="width: 250px"
            v-model="recordFlowForm.tradeTime" type="date" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易方名称：">
            <el-input  v-model="recordFlowForm.traderName" placeholder="请输入交易方名称" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="借方发生额：">
            <el-input type="number" v-model.number="recordFlowForm.outAmount" placeholder="请输入借方发生额" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="贷方发生额：">
            <el-input  type="number" v-model.number="recordFlowForm.inAmount" placeholder="请输入贷方发生额" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="余额：" prop="lastAmount">
            <el-input type="number" v-model.number="recordFlowForm.lastAmount" auto-complete="off" placeholder="请输入金额" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="摘要：">
            <el-input type="textarea" v-model="recordFlowForm.remark" placeholder="请填写摘要" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item align="right">
            <el-button size="small" type="primary"   @click="submitForm('recordFlowForm')">保存</el-button>
            <el-button size="small"  @click="recordBeforeClose">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="导入银行流水" v-drag-dialog="{reset: true}" :visible.sync="dialogImportVisible"
                 :before-close="importBeforeClose"
                 width="450px">
        <el-form :model="importFlowForm" :rules="rulesImport" status-icon ref="importFlowForm" label-width="120px">
          <el-form-item prop="companyId" label="站点名称：">
            <el-select
              reserve-keyword
              v-model="importFlowForm.companyId"
              filterable
              placeholder="请输入站点名称"
              no-match-text="未搜索到该站点">
              <el-option
                style="max-width: 300px;  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                v-for="item in companyList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行名称：" :label-width="formLabelWidth" prop="bankName">
            <el-select
              reserve-keyword
              filterable
              no-match-text="未搜索该银行名称"
              v-model="importFlowForm.bankName" placeholder="请选择银行名称">
              <el-option
                v-for="item in bankList"
                :key=item.bankId
                :label="item.bankName"
                :value="item.bankName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流水文件：" prop="filePath">
            <el-upload
              class="avatar-uploader serviceAgreement"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              accept=".pdf,.xls,.PDF"
              :before-upload="() => {openLoading('.excel')}"
              :on-error="closeLoading"
              :on-success="handleSuccess">
              <div style="color: deepskyblue;" v-html="importFlowForm.filePath ? '点击更换已上传流水文件' : '点击选择需要上传的Excel文件'"></div>
            </el-upload>
          </el-form-item>
          <el-form-item align="right" style="margin-bottom: 10px;">
            <el-button size="small" type="primary" @click="onImportClick('importFlowForm')" :disabled="loading">确认导入</el-button>
            <el-button size="small"  @click="importBeforeClose">取 消</el-button>
          </el-form-item>
          <div align="left">
            <!--产线-->
            <!--http://statics.i-caiwu.com/file/bank_template.xls-->
            <!--测试-->
            <!--http://static.caiwu.com/file/bank_template.xls-->
            <a href="http://statics.i-caiwu.com/file/bank_template.xls">
              <el-button size="mini" type="text" style="padding-left: 10px;">点击下载Excel模板</el-button>
            </a>
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </x-page>
</template>

<script>
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
export default {
  name: 'bank-entry',
  components: {TaxSourceDetailsDialog, CustomerDetailsDialog, GoodsDetailsDialog, CompanyDetailsDialog},
  data() {
    return {
      clickModal: false,
      companyList: [], // 站点列表
      bankList: [], // bank列表
      recordTitle: '录入银行流水',
      uploadLoading: null,
      flowUrl: '',
      fileList: [],
      dialogRecordVisible: false,
      dialogImportVisible: false,
      formLabelWidth: '120px',
      form: {
        pageIndex: 1,
        pageSize: 15,
        companyName: '', // 站点名称
        customerName: '', // 客户姓名
        tradeTime: '', // 交易日期
        tradeBeginTime: '', // 开始时间
        tradeEndTime: '' // 结束时间
      },
      recordFlowForm: {
        waterId: '', // 录入时为空编辑时不为空
        companyId: '',
        // companyName: '',
        bankName: '',
        tradeTime: '',
        traderName: '',
        lastAmount: '',
        inAmount: '',
        outAmount: '',
        remark: ''
      },
      importFlowForm: {
        companyId: '',
        bankName: '',
        filePath: ''
      },
      rulesRecord: {
        companyId: [
          {required: true, message: '选择站点不能为空', trigger: ['blur', 'change']}
        ],
        companyName: [{ required: true, message: '选择站点不能为空', trigger: 'blur' }],
        bankName: [
          {required: true, message: '银行名称不能为空', trigger: ['blur', 'change']}
        ],
        tradeTime: [{ required: true, message: '交易日期不能为空', trigger: 'blur' }],
        traderName: [{ required: true, message: '交易方名称不能为空', trigger: ['blur', 'change'] }],
        inAmount: [
          {type: 'number', required: true, min: 0.0, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ],
        lastAmount: [
          {type: 'number', required: true, min: 0.0, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ],
        outAmount: [
          {type: 'number', required: true, min: 0.0, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ]
      },
      rulesImport: {
        companyId: [
          {required: true, message: '选择站点不能为空', trigger: ['blur', 'change']}
        ],
        bankName: [
          {required: true, message: '银行名称不能为空', trigger: ['blur', 'change']}
        ],
        filePath: [
          {required: true, message: '请上传流水文件', trigger: ['blur', 'change']}
        ]
      },
      totalCount: 0,
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
        this.queryBankFlowList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryBankFlowList()
      },
      deep: true
    },
    'form.tradeTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.tradeBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.tradeEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
        } else {
          this.form.tradeBeginTime = ''
          this.form.tradeEndTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    async loadCompanyList(){ // 获取站点列表
      try {
        this.companyList = await this.$$main.commonListCompanyAll({
          companyName: ''
        })
      } catch (e) {
        this.companyList = []
        e && e.message && this.$message.error(e.message)
      } finally {
      }
    },
    // 银行列表
    getBankList(){ // 或者后台返回给我
      this.bankList = [
        {bankId: 1, bankName: '中国建设银行'},
        {bankId: 2, bankName: '中国招商银行'},
        {bankId: 3, bankName: '中国工商银行'},
        {bankId: 4, bankName: '上海浦东发展银行'},
        {bankId: 5, bankName: '中国中信银行'},
        {bankId: 6, bankName: '南京银行'},
        {bankId: 7, bankName: '中国银行'},
        {bankId: 8, bankName: '中国光大银行'},
        {bankId: 9, bankName: '贵安发展村镇银行'},
        {bankId: 10, bankName: '上海农村商业银行'},
        {bankId: 11, bankName: '贵州银行'}]
    },
    openLoading(target) {
      this.uploadLoading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(res, file, fileList){
      this.uploadLoading.close()
    },
    handleSuccess(res, file, fileList) { // 上传成功的回调
      this.uploadLoading.close()
      res && res.isSuccess && (this.importFlowForm.filePath = res.body.imageUrl)
      this.$refs['importFlowForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: '银行流水文件上传成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onImportClick(importFlowForm) { // 点击导入button
      this.$refs[importFlowForm].validate((valid) => {
        if (valid) {
          this.importFile()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async importFile(){ // 点击确认 进行导入
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.riskCompanyWaterImport(this.importFlowForm)
        this.loading = false
        console.log('导入的数据和字段', this.importFlowForm)
        if (data) {
          this.dialogImportVisible = false
          this.$message.success('导入成功！')
        }
      } catch (e) {
        this.dialogImportVisible = true
        this.loading = false
        e && e.message && this.$message.error(e.message)
      }
    },
    onClickRecordFlowButton (){ // 点击录入银行流水button 时 清空参数 改变title 显示dialog
      this.recordTitle = '录入银行流水'
      this.dialogRecordVisible = true
      this.clearDialogParams()
    },
    submitForm(recordFlowForm) { // 点击确认(录入||保存)银行流水
      this.$refs[recordFlowForm].validate((valid) => {
        if (valid) {
          this.submitModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitModify(){ // RiskSaveCompanyWater
      const loading = this.$loading({
        text: '正在保存',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.riskSaveCompanyWater(this.recordFlowForm)
        if (this.recordTitle === '录入银行流水'){
          this.recordFlowForm.traderName = ''
          this.recordFlowForm.lastAmount = ''
          this.recordFlowForm.inAmount = ''
          this.recordFlowForm.outAmount = ''
          this.recordFlowForm.remark = ''
          this.$nextTick(() => {
            this.$refs.recordFlowForm.clearValidate()
          })
        } else {
          this.queryBankFlowList()
          this.dialogRecordVisible = false
        }
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    recordBeforeClose(){ // 当且仅当 dialog中前三个参数都不为空的情况下，关闭录入流水dialog才刷新页面
      this.dialogRecordVisible = false
      if (this.recordFlowForm.companyId && this.recordFlowForm.bankName && this.recordFlowForm.tradeTime){
        this.queryBankFlowList()
      }
    },
    async onEditClick(row){ // 编辑银行流水
      this.recordTitle = '编辑银行流水'
      this.$nextTick(() => {
        this.$refs.recordFlowForm.clearValidate()
      })
      this.dialogRecordVisible = true
      let Row = JSON.parse(JSON.stringify(row))
      this.recordFlowForm.waterId = Row.waterId
      this.recordFlowForm.companyId = Row.companyId
      this.recordFlowForm.bankName = Row.bankName
      this.recordFlowForm.tradeTime = Row.tradeTime
      this.recordFlowForm.traderName = Row.traderName
      this.recordFlowForm.lastAmount = Row.lastAmount
      this.recordFlowForm.inAmount = Row.inAmount
      this.recordFlowForm.outAmount = Row.outAmount
      this.recordFlowForm.remark = Row.remark
    },
    importBeforeClose  (){ // 关闭导入流水dialong 刷新页面
      this.dialogImportVisible = false
      this.queryBankFlowList()
    },
    onClickImportFlowButton (){ // 点击导入按钮
      this.dialogImportVisible = true
    },
    onPageShow(){ // 把站点列表和银行在页面加载的时候就请求过来，dialog复用的时候不用再次请求
      this.clearQueryParams()
      this.form.companyName = (this.$route.query && this.$route.query.companyName) || ''
      // console.log(this.form)
      this.loadCompanyList()
      this.getBankList()
    },
    onDeleteClick(row){ // 点击删除按钮
      this.recordFlowForm.waterId = row.waterId
      this.$alert('确认删除？').then(() => {
        this.deleteClick()
      }).catch()
    },
    async deleteClick(){ // 确认删除操作
      try {
        this.loading = true
        const data = await this.$$main.riskDeleteCompanyWater({
          waterId: this.recordFlowForm.waterId
        })
        this.loading = false
        if (data) {
          this.queryBankFlowList()
        }
      } catch (e) {
        this.loading = false
        this.$message.error(e.message)
      }
    },
    async queryBankFlowList(){ // 获取站点流水列表
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.riskQueryCompanyWater(this.form)
        this.loading = false
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        this.loading = false
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearDialogParams(){ // dialog参数 清除验证清空
      this.$nextTick(() => {
        this.$refs.recordFlowForm.clearValidate()
      })
      this.recordFlowForm = {
        waterId: '',
        companyId: '',
        bankName: '',
        tradeTime: '',
        traderName: '',
        lastAmount: '',
        inAmount: '',
        outAmount: '',
        remark: ''
      }
    },
    clearQueryParams(){ // list 搜索参数清空
      this.form = {
        pageIndex: 1,
        pageSize: 15,
        companyName: '',
        customerName: '',
        tradeTime: '',
        tradeBeginTime: '',
        tradeEndTime: ''
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
