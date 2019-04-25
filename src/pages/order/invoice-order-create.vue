<template>
    <x-page breadcrumb="auto" title="新增开票订单">
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="formRules" label-width="150px" size="small">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="系统自动生成" readonly/>
            <order-log-dialog
              v-if="orderId && orderId !== ''"
              :order-id="orderId"
              order-type="I"
              style="margin-left: 10px;"
            >查看操作记录</order-log-dialog>
          </el-form-item>
          <el-form-item prop="companyId">
            <label slot="label"><span class="red-text">* </span>站点</label>
            <el-select
              v-model="form.companyId"
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
          <el-form-item prop="customerId">
            <label slot="label"><span class="red-text">* </span>客户</label>
            <el-input v-model="form.customerName" placeholder="选择站点后自动获取" readonly/>
          </el-form-item>
          <el-form-item prop="sourceTaxId">
            <label slot="label"><span class="red-text">* </span>税源地</label>
            <el-input v-model="form.sourceTaxName" placeholder="选择站点后自动获取" readonly/>
          </el-form-item>
          <el-form-item prop="goodsId">
            <label slot="label"><span class="red-text">* </span>商品</label>
            <el-input v-model="form.goodsName" placeholder="选择站点后自动获取" readonly/>
          </el-form-item>
          <el-form-item prop="invoiceServiceRatio">
            <label slot="label"><span class="red-text">* </span>服务费费率</label>
            <el-input v-model="form.invoiceServiceRatio" placeholder="选择站点后自动获取" :readonly="form.isInvoiceServiceRatioChangeable !== 'Y'"/>
          </el-form-item>
          <el-form-item label="发票类型" prop="invoiceTypeName">
            <label slot="label"><span class="red-text">* </span>发票类型</label>
            <el-select v-model="form.invoiceTypeName" placeholder="请先选择开票站点后再选择发票">
              <el-option
                v-for="item in invoiceTypeList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="invoiceContent">
            <label slot="label"><span class="red-text">* </span>开票项目</label>
            <!--<el-input v-model="form.invoiceContent" placeholder="项目"/>-->
            <el-select v-model="form.invoiceContent" placeholder="请先选择开票站点后再选择开票项目">
              <el-option n v-for="item in invoices" :label="item" :value="item" :key="item"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="invoiceAmount">
            <label slot="label"><span class="red-text">* </span>开票金额</label>
            <el-input v-model="form.invoiceAmount" placeholder="请输入开票总金额"/>
          </el-form-item>
          <el-form-item prop="invoiceCompanyName" class="account-upload">
            <label slot="label"><span class="red-text">* </span>开票信息-公司名称</label>
            <el-input v-model="form.invoiceCompanyName" placeholder="选择站点后可选择开票信息" readonly/>
            <invoice-info-dialog :customer-id="form.customerId" :invoice-info-type="invoiceInfoType" class="ml-5" @onChoose="onInvoiceChoose">选择开票信息</invoice-info-dialog>
          </el-form-item>
          <el-form-item prop="invoiceCompanyTaxNo">
            <label slot="label"><span class="red-text">* </span>开票信息-公司税号</label>
            <el-input v-model="form.invoiceCompanyTaxNo" placeholder="选择开票信息后自动获取" readonly/>
          </el-form-item>
          <el-form-item v-if="invoiceHidden" prop="invoiceCompanyAddress">
            <label slot="label"><span class="red-text">* </span>开票信息-公司地址</label>
            <el-input v-model="form.invoiceCompanyAddress" placeholder="选择开票信息后自动获取" readonly/>
          </el-form-item>
          <el-form-item v-if="invoiceHidden" prop="invoiceCompanyPhone">
            <label slot="label"><span class="red-text">* </span>开票信息-公司电话</label>
            <el-input v-model="form.invoiceCompanyPhone" placeholder="选择开票信息后自动获取" readonly/>
          </el-form-item>
          <el-form-item v-if="invoiceHidden" prop="invoiceCompanyBankName">
            <label slot="label"><span class="red-text">* </span>开票信息-开户银行</label>
            <el-input v-model="form.invoiceCompanyBankName" placeholder="选择开票信息后自动获取" readonly/>
          </el-form-item>
          <el-form-item v-if="invoiceHidden" prop="invoiceCompanyBankNo">
            <label slot="label"><span class="red-text">* </span>开票信息-银行账户</label>
            <el-input v-model="form.invoiceCompanyBankNo" placeholder="选择开票信息后自动获取" readonly/>
          </el-form-item>
          <el-form-item prop="invoiceExpressAddress" class="account-upload">
            <label slot="label"><span class="red-text">* </span>发票快递信息</label>
            <el-input v-model="form.invoiceExpressAddress" placeholder="选择站点后可选择发票快递信息" readonly/>
            <express-info-dialog :customer-id="form.customerId" class="ml-5" @onChoose="(res) => {onExpressChoose(res, 'invoiceExpressAddress')}">选择快递信息</express-info-dialog>
          </el-form-item>
          <el-form-item prop="invoiceCompanyBankNo">
            <label slot="label">期望开票日期</label>
            <el-date-picker
              v-model="form.hopeInvoiceDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="(选填)请选择日期，指定客户要求的开票日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="invoiceCompanyBankNo">
            <label slot="label">发票备注信息</label>
            <el-input v-model="form.invoiceRemark" placeholder="(选填)请输入客户指定的发票备注信息"/>
          </el-form-item>
          <!--<el-form-item label="是否需要特殊审批" prop="isNeedApproval">-->
            <!--<el-checkbox v-model="form.isNeedApproval" true-label="Y" false-label="N">是否需要特殊审批</el-checkbox>-->
          <!--</el-form-item>-->
          <el-form-item prop="invoiceContractUrl" class="account-upload">
            <label slot="label"><span class="red-text">* </span>上传开票合同</label>
            <div>
              <upload-files
                @success="url => form.invoiceContractUrl = url">
                <x-image v-if="form.invoiceContractUrl" :src="form.invoiceContractUrl" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
              </upload-files>
              <preview-button type="text" alwaysShow newWindowOpen :src="form.invoiceContractUrl" size="mini" v-if="form.invoiceContractUrl">查看原文件</preview-button>
              <preview-button type="text" :src="form.invoiceContractUrl" size="mini" v-if="form.invoiceContractUrl">预览原文件</preview-button>
            </div>
          </el-form-item>
          <el-form-item label="是否加急处理" prop="isPriority">
            <el-checkbox v-model="form.isPriority" true-label="Y" false-label="N">是否加急处理</el-checkbox>
          </el-form-item>
          <transition name="slide-fade">
            <el-form-item v-if="form.isPriority === 'Y'" label="加急原因">
              <el-input v-model="form.priorityReason" placeholder="请输入加急原因"/>
            </el-form-item>
          </transition>
          <el-form-item label="服务费折扣" prop="serviceFeeDiscount">
            <el-input v-if="form.serviceFeeDiscount === 0 || form.serviceFeeDiscount === 1" v-model="noServiceFee" disabled placeholder="请输入0~1之间的小数"/>
            <el-input v-else v-model="form.serviceFeeDiscount" disabled placeholder="选择站点后自动获取"/>
          </el-form-item>
          <el-form-item label="订单备注：">
            <el-input type="textarea" v-model="form.invoiceOrderRemark" placeholder="请输入订单备注，该备注仅限系统人员可见"/>
          </el-form-item>
          <div class="mini-item">
            <p>服务费：<span>+{{transFee | currency}}</span></p>
            <p>服务费减免：<span>-{{serviceFee | currency}}</span></p>
            <p>合计：<span>{{(transFee - serviceFee) | currency}}</span></p>
          </div>
          <el-form-item>
            <el-button type="primary" v-if="orderId && isShowButton" @click="displayNextDialog">直接提交</el-button>
            <el-button @click="onSubmit" v-if="!orderId || isShowButton">保存为草稿</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </x-page>
</template>

<script>
import ExpressInfoDialog from '../../components/ExpressInfoDialog'
import InvoiceInfoDialog from '../../components/InvoiceInfoDialog'
import PreviewButton from '../../components/PreviewButton'
import OrderLogDialog from '../../components/OrderLogDialog'
import UploadFiles from '../../components/UploadFiles'
export default {
  name: 'invoice-order-create',
  components: {ExpressInfoDialog, InvoiceInfoDialog, PreviewButton, OrderLogDialog, UploadFiles},
  data() {
    const validateServiceFee = (rule, value, callback) => {
      if (value < 0 || value > 1) {
        callback(new Error('请输入0~1之间的小数'))
      } else {
        callback()
      }
    }
    return {
      orderId: '',
      invoiceTypeList: [],
      noServiceFee: '无折扣',
      form: {
        customerId: '', // 客户Id
        companyId: '', // 站点Id
        sourceTaxId: '', // 税源地Id
        sourceTaxName: '',
        goodsId: '', // 商品Id
        goodsName: '',
        invoiceContent: '', // 开票项目
        invoiceAmount: '', // 开票金额
        invoiceCompanyName: '', // 开票公司名称
        invoiceCompanyTaxNo: '', // 开票公司税号
        invoiceServiceRatio: '',
        invoiceCompanyAddress: '', // 开票公司地址
        invoiceCompanyPhone: '', // 开票公司电话
        invoiceCompanyBankName: '', // 开票公司银行名称
        invoiceCompanyBankNo: '', // 开票公司银行账号
        invoiceExpressAddress: '', // 发票快递地址
        hopeInvoiceDate: '', // 期望开票时间
        invoiceRemark: '', // 备注
        isNeedApproval: 'N', // 是否需要审批
        isPriority: 'N', // 是否加急
        priorityReason: '', // 加急原因
        isInvoiceServiceRatioChangeable: '',
        serviceFeeDiscount: '', // 服务费折扣
        orderId: '', // 订单Id
        invoiceTypeName: '', // 发票类型
        invoiceContractUrl: '', // 开票合同
        invoiceOrderRemark: '' // 备注
      },
      formRules: {
        serviceFeeDiscount: [{
          validator: validateServiceFee, trigger: 'change'
        }]
      },
      isShowButton: false,
      customerTimeout: null,
      customerList: [], // 客户列表
      loadingCompanyList: false,
      companyList: [], // 站点列表
      invoices: [] // 项目列表
    }
  },
  watch: {
    'form.invoiceTypeName': {
      handler(val){
        if (val && val.indexOf('专票') === -1){
          this.form.invoiceCompanyAddress = ''
          this.form.invoiceCompanyPhone = ''
          this.form.invoiceCompanyBankName = ''
          this.form.invoiceCompanyBankNo = ''
        }
      },
      deep: true
    }
    // 'form.isNeedApproval': {
    //   handler: function(val){
    //     if (val === 'N'){
    //       this.form.isPriority = 'N'
    //       this.form.serviceFeeDiscount = ''
    //     }
    //   },
    //   deep: true
    // }
  },
  computed: {
    transFee(){
      let serviceCharge = this.form.invoiceAmount || 0
      let invoiceServiceRatio = this.form.invoiceServiceRatio || 0
      return (serviceCharge * invoiceServiceRatio).toFixed(2)
    },
    serviceFee(){
      let serviceFeeDiscount = this.form.serviceFeeDiscount || 0
      let serviceFee = serviceFeeDiscount ? 1 - serviceFeeDiscount : 0
      return (this.transFee * serviceFee).toFixed(2)
    },
    invoiceHidden(){
      return this.form.invoiceTypeName && this.form.invoiceTypeName.indexOf('专票') !== -1
    },
    invoiceInfoType(){
      let type = ''
      if (this.form.invoiceTypeName && this.form.invoiceTypeName.indexOf('专票') !== -1) {
        type = 'Z'
      } else if (this.form.invoiceTypeName && this.form.invoiceTypeName.indexOf('普票') !== -1){
        type = 'P'
      } else {
        type = ''
      }
      return type
    }
  },
  methods: {
    async onPageShow(){
      this.clearForm()
      this.orderId = (this.$route.query && this.$route.query.orderid) || ''
      await this.queryCompanyList()
      this.orderId && this.orderId !== '' && this.queryOrderInfo()
    },
    async queryOrderInfo(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        const info = await this.$$main.orderInvoiceOrderDetail({
          orderId: this.orderId
        })

        await this.onCompanyChange(info.orderInfo.companyId || '', true)

        info.orderInfo.isInvoiceServiceRatioChangeable = this.form.isInvoiceServiceRatioChangeable
        this.form = info.orderInfo

        this.form.customerId = this.form.customerId || ''
        this.form.companyId = this.form.companyId || ''
        this.form.sourceTaxId = this.form.sourceTaxId || ''
        this.form.goodsId = this.form.goodsId || ''

        this.isShowButton = info.isShowButton || false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async queryCustomerList(){
      try {
        this.customerList = await this.$$main.commonListCustomer()
      } catch (e) {
        this.customerList = []
      }
    },
    async queryCompanyList(query){
      try {
        this.loadingCompanyList = true
        this.companyList = await this.$$main.commonListBelongCompany({
          companyName: query
        })
      } catch (e) {
        this.companyList = []
      } finally {
        this.loadingCompanyList = false
      }
    },
    onInvoiceChoose(res){
      this.form.invoiceCompanyName = res.invoiceCompanyName
      this.form.invoiceCompanyTaxNo = res.invoiceCompanyTaxNo
      if (this.invoiceInfoType !== 'Z'){
        return
      }
      this.form.invoiceCompanyAddress = res.invoiceCompanyAddress
      this.form.invoiceCompanyPhone = res.invoiceCompanyPhone
      this.form.invoiceCompanyBankName = res.invoiceCompanyBankName
      this.form.invoiceCompanyBankNo = res.invoiceCompanyBankNo
    },
    onExpressChoose(res, name){
      this.form[name] = `${res.receiver || ' '}，${res.phone || ' '}，${res.address || ' '}。`
    },
    onSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$alert('点击确定保存草稿可以进行后续操作。', '是否保存为草稿？', {
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            callback: action => {
              action === 'confirm' && this.createOrder()
            }
          })
        }
      })
    },
    async createOrder(type){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.orderId = await this.$$main.orderEditInvoiceOrder(this.form)
        await this.queryOrderInfo()
        if (type === 'next') {
          this.doOrderNext()
        } else {
          this.$message({
            message: `保存成功`,
            type: 'success'
          })
        }
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    displayNextDialog(){
      this.$alert(`是否提交订单？`, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        callback: action => {
          action === 'confirm' && this.createOrder('next')
        }
      })
    },
    async doOrderNext(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderWorkflowNext({
          orderId: this.orderId,
          orderType: 'I'
        })
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.queryOrderInfo()
        this.$router.push(`/order/invoice-order-details?orderid=${this.orderId}`)
      } catch (e) {
        if (e.source && e.source.code === 'WL') {
          let text = (e.message && e.message.split(',').join('<br>')) || ''
          this.$alert(text, '警告', {
            dangerouslyUseHTMLString: true
          })
          return
        }
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    clearForm(){
      this.orderId = ''
      this.isShowButton = false
      this.form = {
        customerId: '', // 客户Id
        companyId: '', // 站点Id
        sourceTaxId: '', // 税源地Id
        sourceTaxName: '',
        goodsId: '', // 商品Id
        goodsName: '',
        invoiceContent: '', // 开票项目
        invoiceAmount: '', // 开票金额
        invoiceCompanyName: '', // 开票公司名称
        invoiceCompanyTaxNo: '', // 开票公司税号
        invoiceCompanyAddress: '', // 开票公司地址
        invoiceCompanyPhone: '', // 开票公司电话
        invoiceCompanyBankName: '', // 开票公司银行名称
        invoiceCompanyBankNo: '', // 开票公司银行账号
        invoiceExpressAddress: '', // 发票快递地址
        hopeInvoiceDate: '', // 期望开票时间
        invoiceRemark: '', // 备注
        isNeedApproval: 'N', // 是否需要审批
        isPriority: 'N', // 是否加急
        invoiceServiceRatio: '',
        isInvoiceServiceRatioChangeable: '',
        serviceFeeDiscount: '', // 服务费折扣
        orderId: '', // 订单Id
        invoiceTypeName: '', // 发票类型
        invoiceContractUrl: '',
        invoiceOrderRemark: '' // 备注
      }
    },
    async onCompanyChange(companyId, isAfterDetails = false){
      this.form.serviceFeeDiscount = null
      this.form.sourceTaxId = null
      this.form.sourceTaxName = null
      this.form.goodsId = null
      this.form.goodsName = null
      this.form.customerId = null
      this.form.customerName = null
      this.form.invoiceTypeName = null
      this.form.invoiceContent = null
      this.form.invoiceCompanyName = ''
      this.form.invoiceCompanyTaxNo = ''
      this.form.invoiceCompanyAddress = ''
      this.form.invoiceCompanyPhone = ''
      this.form.invoiceCompanyBankName = ''
      this.form.invoiceCompanyBankNo = ''
      this.form.invoiceExpressAddress = ''
      !isAfterDetails && (this.form.invoiceServiceRatio = '')
      this.form.isInvoiceServiceRatioChangeable = ''
      this.invoiceTypeList = []

      this.invoices = []
      if (companyId) {
        await this.$$main.companyDetail({companyId}).then(res => {
          this.form.serviceFeeDiscount = res.serviceFeeDiscount
          this.form.sourceTaxId = res.sourceTaxId
          this.form.sourceTaxName = res.sourceTaxName
          this.form.goodsId = res.goodsId
          this.form.goodsName = res.goodsName
          this.form.customerId = res.customerId
          this.form.customerName = res.customerName
          !isAfterDetails && (this.form.invoiceServiceRatio = res.invoiceServiceRatio)
          this.form.isInvoiceServiceRatioChangeable = res.isInvoiceServiceRatioChangeable || 'N'
          this.invoiceTypeList = res.invoiceTypeNames || []
          this.invoiceTypeList && this.invoiceTypeList.length === 1 && (this.form.invoiceTypeName = this.invoiceTypeList[0])
          this.invoices = res.invoiceContents || []
        })
      }
    }
  },
  mounted() {
  }
}
</script>
