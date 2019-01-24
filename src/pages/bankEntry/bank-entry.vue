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
            <el-button type="primary" @click="queryBankFlow">搜索</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="recordFlow">录入流水</el-button>
            <el-button type="primary" @click="importFlow">导入流水</el-button>
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
        <el-table-column label="交易日期" prop="tradeTime" fixed />
        <el-table-column label="客户" prop="customerName" min-width="120">
          <CustomerDetailsDialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </CustomerDetailsDialog>
        </el-table-column>
        <el-table-column label="站点名称" prop="companyName" min-width="120">
          <CompanyDetailsDialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </CompanyDetailsDialog>
        </el-table-column>
        <el-table-column label="交易方名称" prop="traderName" />
        <el-table-column label="摘要" prop="remark"  min-width="120"/>
        <el-table-column label="贷方发生额" prop="inAmount" align="right"  :formatter="(row) => `${$options.filters['currency'](row.inAmount, '', 2)}`"/>
        <el-table-column label="贷方发生额" prop="outAmount" align="right" :formatter="(row) => `${$options.filters['currency'](row.outAmount, '', 2)}`"/>
        <el-table-column label="余额" prop="lastAmount" align="right"  :formatter="(row) => `${$options.filters['currency'](row.lastAmount, '', 2)}`"/>
        <el-table-column label="银行" prop="bankName"/>
        <el-table-column label="录入日期" prop="createTime"/>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onDeleteClick(scope.row)">删除</el-button>
            <el-button type="text" size="mini" class="no-padding" @click="onEditClick(scope.row)">编辑</el-button>
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
      <el-dialog  :title="recordTitle" v-drag-dialog="{reset: true}" :visible.sync="dialogRecordVisible" width="600px" center>
        <el-form :model="recordFlowForm" :rules="rulesRecord" status-icon ref="recordFlowForm" label-width="120px">
          <el-form-item prop="companyId" label="站点名称：">
            <el-select
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
          <el-form-item label="银行名称：" :label-width="formLabelWidth" prop="bankName">
            <el-select
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
            <el-date-picker placeholder="交易日期：1999-01-01"
            v-model="recordFlowForm.tradeTime" type="date" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易方名称：" prop="traderName">
            <el-input  v-model="recordFlowForm.traderName" placeholder="请输入交易方名称" ></el-input>
          </el-form-item>
          <el-form-item label="贷方发生额：" prop="inAmount">
            <el-input  type="number" v-model.number="recordFlowForm.inAmount" placeholder="请输入贷方发生额" ></el-input>
          </el-form-item>
          <el-form-item label="借方发生额：" prop="outAmount">
            <el-input type="number" v-model.number="recordFlowForm.outAmount" placeholder="请输入借方发生额" ></el-input>
          </el-form-item>
          <el-form-item label="金额：" prop="lastAmount">
            <el-input type="number" v-model.number="recordFlowForm.lastAmount" auto-complete="off" placeholder="请输入金额"></el-input>
          </el-form-item>
          <el-form-item label="摘要：">
            <el-input  v-model="recordFlowForm.remark" placeholder="请填写摘要" ></el-input>
          </el-form-item>
          <el-form-item align="right">
            <el-button size="small" type="primary"   @click="submitForm('recordFlowForm')">保存</el-button>
            <el-button size="small"  @click="dialogRecordVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="导入银行流水" v-drag-dialog="{reset: true}" :visible.sync="dialogImportVisible" width="450px" center>
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
          <el-form-item label="流水文件：" prop="importUrl">
            <el-upload
              class="avatar-uploader serviceAgreement"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.serviceAgreement')}"
              :on-error="closeLoading"
              :on-success="handleSuccess">
              <div style="color: deepskyblue;">点击上传流水文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item align="right">
            <el-button size="small" type="primary" @click="onImportClick('importFlowForm')">导入</el-button>
            <el-button size="small"  @click="dialogImportVisible = false">取 消</el-button>
          </el-form-item>
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
        tradeTime: '2019-01-01',
        traderName: '交易方名称',
        lastAmount: 1,
        inAmount: 2,
        outAmount: 3,
        remark: 4
      },
      importFlowForm: {
        companyId: '',
        companyName: '',
        bankName: '',
        importUrl: ''
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
        traderName: [{ required: true, message: '交易方名称不能为空', trigger: 'blur' }],
        inAmount: [
          {type: 'number', required: true, min: 0.0, max: 100000000, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ],
        lastAmount: [
          {type: 'number', required: true, min: 0.0, max: 100000000, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ],
        outAmount: [
          {type: 'number', required: true, min: 0.0, max: 100000000, message: '金额不能为空且必须为不小于0的数字', trigger: ['blur', 'change']}
        ]
      },
      rulesImport: {
        companyId: [
          {required: true, message: '选择站点不能为空', trigger: ['blur', 'change']}
        ],
        bankName: [
          {required: true, message: '银行名称不能为空', trigger: ['blur', 'change']}
        ],
        importUrl: [
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
        this.queryBankFlow()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryBankFlow()
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
        this.companyList = await this.$$main.commonListBelongCompany()
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
      console.log(res)
      this.uploadLoading.close()
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
      this.uploadLoading.close()
      res && res.isSuccess && (this.importFlowForm.importUrl = res.body.imageUrl)
      this.$refs['importFlowForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: '流水文件上传成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onImportClick(importFlowForm) {
      this.$refs[importFlowForm].validate((valid) => {
        if (valid) {
          this.importFile()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async importFile(){
      console.log('进行导入', this.importFlowForm)
      try {
        this.loading = true
        const data = await this.$$main.riskImportCompanyWater(this.importFlowForm)
        this.loading = false
        if (data) {
          this.$message.success('导入成功！')
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    recordFlow (){
      this.recordTitle = '录入银行流水'
      this.dialogRecordVisible = true
    },
    submitForm(recordFlowForm) {
      this.$refs[recordFlowForm].validate((valid) => {
        if (valid) {
          this.submitModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitModify(){
      console.log(this.recordFlowForm)
      try {
        await this.$$main.riskSaveCompanyWater(this.recordFlowForm)
        this.recordFlowForm.traderName = ''
        this.recordFlowForm.lastAmount = ''
        this.recordFlowForm.inAmount = ''
        this.recordFlowForm.outAmount = ''
        this.recordFlowForm.remark = ''
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
      this.$nextTick(() => {
        this.$refs.recordFlowForm.clearValidate()
      })
    },
    importFlow (){
      this.dialogImportVisible = true
    },
    onPageShow(){
      this.clearQueryParams()
      this.loadCompanyList()
      this.getBankList()
    },
    async onEditClick(row){
      console.log('编辑操作')
      this.recordTitle = '编辑银行流水'
      this.dialogRecordVisible = true
      let Row = JSON.parse(JSON.stringify(row))
      this.recordFlowForm.waterId = Row.waterId
      // this.recordFlowForm.companyName = Row.companyName
      this.recordFlowForm.companyId = Row.companyId
      this.recordFlowForm.bankName = Row.bankName
      this.recordFlowForm.tradeTime = Row.tradeTime
      this.recordFlowForm.traderName = Row.traderName
      this.recordFlowForm.lastAmount = Row.lastAmount
      this.recordFlowForm.inAmount = Row.inAmount
      this.recordFlowForm.outAmount = Row.outAmount
      this.recordFlowForm.remark = Row.remark
    },
    onDeleteClick(row){ // 点击删除按钮
      this.recordFlowForm.waterId = row.waterId
      this.$confirm('确认删除？').then(() => {
        this.deleteClick()
      }).catch()
    },
    async deleteClick(){ // 确认删除操作
      try {
        this.loading = true
        const data = await this.$$main.riskDeleteCompanyWater({
          waterId: this.recordFlowForm.waterId
        })
        data && this.queryBankFlow()
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async queryBankFlow(){ // 获取站点流水列表
      // console.log(this.form)
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.riskQueryCompanyWater(this.form)
        // const data = await this.$$main.sourceTaxList({
        //   pageSize: 1,
        //   pageIndex: 15,
        //   sourceTaxName: ''
        // })
        console.log(data)
        this.totalCount = data.totalCount
        this.orderList = data.datas
        this.orderList = [{
          'companyName': '南通第一软件咨询有限公司',
          'companyId': 23,
          'waterId': 123,
          'customerName': '王小二',
          'traderName': '瑷石财务咨询（上海）有限公司',
          'bankName': '中国建设银行',
          'lastAmount': 2552222,
          'inAmount': 20,
          'outAmount': 30,
          'remark': '摘要摘要摘要',
          'tradeTime': '2018-09-19 11:28:38',
          'createTime': '2018-09-19 11:28:38'
        }]
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
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
