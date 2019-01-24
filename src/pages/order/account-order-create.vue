<template>
  <x-page breadcrumb="auto" title="新增开户订单">
    <el-card class="box-card">
             <div slot="header"><span
              style="font-size: 14px;"
              class="text-bold"
            >新增开户订单</span></div>
      <el-form ref="form" :model="form" :rules="formRules" label-width="170px" size="small">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="系统自动生成" readonly/>
          <el-button type="text" size="mini" style="margin-left: 10px;" @click="orderLogListDialogDisplay = true" v-if="orderId && orderId !== ''">查看操作记录</el-button>
        </el-form-item>
        <el-form-item prop="customerId">
          <label slot="label"><span class="red-text">* </span>客户</label>
          <el-select
            v-model="form.customerId"
            filterable
            placeholder="请输入客户名"
            no-match-text="未搜索到该用户">
            <el-option
              v-for="item in customerList"
              :key="item.customerId"
              :label="item.customerName"
              :value="item.customerId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sourceTaxId">
          <label slot="label"><span class="red-text">* </span>税源地</label>
          <el-select v-model="form.sourceTaxId" @change="onSourceTaxChange" placeholder="请选择税源地">
            <el-option
              v-for="item in sourceTaxList"
              :key="item.sourceTaxId"
              :label="item.sourceTaxName"
              :value="item.sourceTaxId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsId">
          <label slot="label"><span class="red-text">* </span>商品</label>
          <el-select v-model="form.goodsId" @change="onGoodsChange" placeholder="请选择商品">
            <el-option
              v-for="item in goodsList"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId">
            </el-option>
          </el-select><span v-if="form.goodsId">交易费：{{form.serviceCharge || 0}}元，押金：{{form.deposit || 0}}元</span>
        </el-form-item>
        <el-form-item label="纳税性质">
          <el-input v-model="form.taxTypeName" placeholder="请选择商品" readonly/>
        </el-form-item>
        <el-form-item prop="companyTypeId">
          <label slot="label"><span class="red-text">* </span>站点类型</label>
          <el-select v-model="form.companyTypeId" @change="onCompanyTypeChange" placeholder="请选择站点类型">
            <el-option
              v-for="item in companyTypeList"
              :key="item.companyTypeId"
              :label="item.companyTypeName"
              :value="item.companyTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="经营范围"
            readonly
            v-model="form.businessScope">
          </el-input>
        </el-form-item>
        <el-form-item prop="companyName" v-for="(name, index) in form.companyNames" :key="index">
          <label slot="label" v-show="index === 0"><span class="red-text">* </span>站点名称</label>
          <el-input v-model="name.value" placeholder="站点名称"/>
          <el-button @click.prevent="removeCompanyName(name)" v-if="form.companyNames && form.companyNames.length > 1">删除</el-button>
          <el-button style="margin-left: 0" @click.prevent="addCompanyName()" v-if="form.companyNames && form.companyNames.length < 10 &&form.companyNames.length === index + 1">增加</el-button>
          <el-checkbox v-model="form.isAdjustment" true-label="Y" false-label="N" v-if="index === 0">是否接受调剂</el-checkbox>
        </el-form-item>
        <el-form-item prop="registeredCapital">
          <label slot="label"><span class="red-text">* </span>注册资本</label>
          <el-input v-model="form.registeredCapital" placeholder="注册资本" readonly/> 万元
        </el-form-item>
        <el-form-item prop="serviceFeeDiscount">
          <label slot="label"><span class="red-text">* </span>开票服务费费率折扣</label>
          <el-input v-model="form.serviceFeeDiscount" placeholder="请输入0~1之间的小数"/>
        </el-form-item>
        <el-form-item prop="investorName">
          <label slot="label"><span class="red-text">* </span>投资人姓名</label>
          <el-input v-model="form.investorName" placeholder="投资人姓名"/>
        </el-form-item>
        <el-form-item prop="investorMobile">
          <label slot="label"><span class="red-text">* </span>投资人手机</label>
          <el-input v-model="form.investorMobile" placeholder="投资人手机"/>
        </el-form-item>
        <el-form-item prop="investorIdCardFrontUrl" class="account-upload">
          <label slot="label"><span class="red-text">* </span>上传投资人身份证</label>
          <div>
            <el-upload
              class="avatar-uploader investorIdCardFront"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.investorIdCardFront')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (form.investorIdCardFrontUrl = res.body.imageUrl) }">
              <x-image v-if="form.investorIdCardFrontUrl" :src="form.investorIdCardFrontUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block">正面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(form.investorIdCardFrontUrl)" size="mini" v-if="form.investorIdCardFrontUrl">查看原文件</el-button>
            <preview-button type="text" size="mini" :src="form.investorIdCardFrontUrl" v-if="form.investorIdCardFrontUrl">预览原文件</preview-button>
          </div>
          <div class="ml-10">
            <el-upload
              class="avatar-uploader investorIdCardBack"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.investorIdCardBack')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (form.investorIdCardBackUrl = res.body.imageUrl) }">
              <x-image v-if="form.investorIdCardBackUrl" :src="form.investorIdCardBackUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon">反面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(form.investorIdCardBackUrl)" size="mini" v-if="form.investorIdCardBackUrl">查看原文件</el-button>
            <preview-button type="text" size="mini" :src="form.investorIdCardBackUrl" v-if="form.investorIdCardBackUrl">预览原文件</preview-button>
          </div>
          </el-form-item>
        <el-form-item prop="investorIdCardNo">
          <label slot="label"><span class="red-text">* </span>投资人身份证号码</label>
          <el-input v-model="form.investorIdCardNo" placeholder="投资人身份证号码"/>
        </el-form-item>
        <el-form-item prop="investorEmail">
          <label slot="label"><span class="red-text">* </span>邮箱</label>
          <el-input v-model="form.investorEmail" placeholder="邮箱"/>
        </el-form-item>
        <el-form-item prop="financePersonName">
          <label slot="label"><span class="red-text">* </span>财务人员姓名</label>
          <el-input v-model="form.financePersonName" placeholder="财务人员姓名"/>
        </el-form-item>
        <el-form-item prop="financePersonMobile">
          <label slot="label"><span class="red-text">* </span>财务人员手机</label>
          <el-input v-model="form.financePersonMobile" placeholder="财务人员手机"/>
        </el-form-item>
        <el-form-item prop="financePersonIdCardFrontUrl" class="account-upload" v-show="form.isNeedFinanceID === 'Y'">
          <label slot="label"><span class="red-text">* </span>上传财务人员身份证</label>
          <div>
            <el-upload
              class="avatar-uploader financePersonIdCardFront"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.financePersonIdCardFront')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (form.financePersonIdCardFrontUrl = res.body.imageUrl) }">
              <x-image v-if="form.financePersonIdCardFrontUrl" :src="form.financePersonIdCardFrontUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block">正面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(form.financePersonIdCardFrontUrl)" size="mini" v-if="form.financePersonIdCardFrontUrl">查看原文件</el-button>
            <preview-button type="text" size="mini" :src="form.financePersonIdCardFrontUrl" v-if="form.financePersonIdCardFrontUrl">预览原文件</preview-button>
          </div>
          <div class="ml-10">
            <el-upload
              class="avatar-uploader financePersonIdCardBack"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.financePersonIdCardBack')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (form.financePersonIdCardBackUrl = res.body.imageUrl) }">
              <x-image v-if="form.financePersonIdCardBackUrl" :src="form.financePersonIdCardBackUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon">反面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(form.financePersonIdCardBackUrl)" size="mini" v-if="form.financePersonIdCardBackUrl">查看原文件</el-button>
            <preview-button type="text" size="mini" :src="form.financePersonIdCardBackUrl" v-if="form.financePersonIdCardBackUrl">预览原文件</preview-button>
          </div>
        </el-form-item>
        <el-form-item prop="financePersonIdCardNo">
          <label slot="label"><span class="red-text">* </span>财务人员身份证号</label>
          <el-input v-model="form.financePersonIdCardNo" placeholder="财务人员身份证号"/>
        </el-form-item>
        <el-form-item prop="idCardReturnAddress" class="account-upload">
          <label slot="label"><span class="red-text">* </span>身份证寄回地址</label>
          <el-input v-model="form.idCardReturnAddress" placeholder="身份证寄回地址" readonly/>
          <express-info-dialog :customer-id="form.customerId" class="ml-5" @onChoose="(res) => {onExpressChoose(res, 'idCardReturnAddress')}">选择快递信息</express-info-dialog>
        </el-form-item>
        <el-form-item prop="invoiceExpressAddress" class="account-upload">
          <label slot="label"><span class="red-text">* </span>押金单快递地址</label>
          <el-input v-model="form.invoiceExpressAddress" placeholder="押金单快递地址" readonly/>
          <express-info-dialog :customer-id="form.customerId" class="ml-5" @onChoose="(res) => {onExpressChoose(res, 'invoiceExpressAddress')}">选择快递信息</express-info-dialog>
        </el-form-item>
        <el-form-item prop="fileExpressAddress" class="account-upload">
          <label slot="label"><span class="red-text">* </span>材料交付地址</label>
          <el-input v-model="form.fileExpressAddress" placeholder="材料交付地址" readonly/>
          <express-info-dialog :customer-id="form.customerId" class="ml-5" @onChoose="(res) => {onExpressChoose(res, 'fileExpressAddress')}">选择快递信息</express-info-dialog>
        </el-form-item>
        <el-form-item class="account-upload">
          <label slot="label"><span class="red-text">* </span>税管家相关服务协议</label>
          <div>
            <el-upload
              class="avatar-uploader serviceAgreement"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.serviceAgreement')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (form.serviceAgreementUrl = res.body.imageUrl) }">
              <x-image v-if="form.serviceAgreementUrl" :src="form.serviceAgreementUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block;font-size: 18px;">相关服务协议</i>
            </el-upload>
            <a :href="$config.getImageUrlPath()+'/file/RRCW-File.docx'" target="_blank"><el-button type="text" size="mini">下载模板</el-button></a>
            <el-button type="text" @click="onPreviewClick(form.serviceAgreementUrl)" size="mini" v-if="form.serviceAgreementUrl">查看原文件</el-button>
            <preview-button type="text" size="mini" :src="form.serviceAgreementUrl" v-if="form.serviceAgreementUrl">预览原文件</preview-button>
          </div>
        </el-form-item>
        <el-form-item label="是否需要特殊审批" prop="isNeedApproval">
          <el-checkbox v-model="form.isNeedApproval" true-label="Y" false-label="N">是否需要特殊审批</el-checkbox>
        </el-form-item>
        <el-form-item label="是否加急" prop="isPriority" v-if="form.isNeedApproval === 'Y'">
          <el-checkbox v-model="form.isPriority" true-label="Y" false-label="N">是否加急</el-checkbox>
        </el-form-item>
        <el-form-item label="加急原因" prop="priorityReason" v-if="form.isPriority === 'Y'">
          <el-input v-model="form.priorityReason" placeholder="加急原因"/>
        </el-form-item>
        <el-form-item label="押金减免" prop="depositRemissionAmount" v-if="form.isNeedApproval === 'Y'">
          <el-input v-model="form.depositRemissionAmount" placeholder="押金减免"/> 元
        </el-form-item>
        <el-form-item label="交易费折扣" prop="tradeFeeDiscount" v-if="form.isNeedApproval === 'Y'">
          <el-input v-model="form.tradeFeeDiscount" placeholder="请输入0~1之间的小数"/>
        </el-form-item>
        <div class="mini-item">
          <p>交易费：<span>+{{form.serviceCharge || 0 | currency}}</span></p>
          <p>押金：<span>+{{form.deposit || 0 | currency}}</span></p>
          <p>押金减免：<span>-{{form.depositRemissionAmount || 0 | currency}}</span></p>
          <p>交易费折扣：<span>-{{showTradeFee | currency}}</span></p>
          <p>合计：<span>{{showPayAmount | currency}}</span></p>
        </div>
        <el-form-item>
          <el-button type="primary" v-if="orderId && isShowButton" @click="displayNextDialog">直接提交</el-button>
          <el-button @click="onSubmit" v-if="!orderId || isShowButton">保存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="订单日志"
      :visible.sync="orderLogListDialogDisplay"
      width="900px"
      custom-class="order-log-list-dialog"
      center>
      <el-table
        :data="orderLogList"
        size="mini"
        style="width: 100%;">
        <el-table-column prop="actionUserName" label="姓名" min-width="70"/>
        <el-table-column prop="actionUserRoleName" label="角色" min-width="70"/>
        <el-table-column prop="actionContent" label="操作内容" min-width="200"/>
        <el-table-column prop="actionTime" label="操作时间" min-width="100"/>
      </el-table>
    </el-dialog>
  </x-page>
</template>

<script>
import ExpressInfoDialog from '../../components/ExpressInfoDialog'
import PreviewButton from '../../components/PreviewButton'
export default {
  name: 'account-order-create',
  components: {ExpressInfoDialog, PreviewButton},
  data() {
    const validateDepositRemissionAmount = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('押金减免必须大于0'))
      } else {
        callback()
      }
    }
    const validateTradeFee = (rule, value, callback) => {
      if (value < 0 || value > 1) {
        callback(new Error('请输入0~1之间的小数'))
      } else {
        callback()
      }
    }
    const sameName = (rule, value, callback) => {
      if (!value){
        callback()
      } else if (value === this.form.investorName) {
        callback(new Error('财务人员姓名和投资人姓名不能相同'))
      } else {
        callback()
      }
    }
    const sameIdcard = (rule, value, callback) => {
      if (!value){
        callback()
      } else if (value === this.form.investorIdCardNo) {
        callback(new Error('财务人员身份证号和投资人身份证号不能相同'))
      } else {
        callback()
      }
    }
    const validateIsPriority = (rule, value, callback) => {
      if (this.form.isPriority === 'Y' && (!this.form.priorityReason || this.form.priorityReason === '')) {
        callback(new Error('请输入加急原因'))
      } else {
        callback()
      }
    }
    return {
      orderId: '',
      orderLogListDialogDisplay: false,
      orderLogList: [],
      uploadLoading: null,
      form: {
        orderId: '',
        orderNo: '',
        customerId: '', // 客户编号
        sourceTaxId: '', // 税源地编号
        goodsId: '', // 商品编号
        taxType: '', // 纳税性质
        taxTypeName: '',
        serviceCharge: '', // 开户服务费
        deposit: '', // 开户押金
        companyTypeId: '', // 站点类型编号
        isAdjustment: 'N',
        businessScope: '', // 经营范围
        companyNames: [{
          value: ''
        }],
        companyName: '', // 站点名称
        registeredCapital: '10', // 注册资本
        investorName: '', // 投资人姓名
        investorMobile: '', // 投资人手机
        investorIdCardFrontUrl: '', // 投资人身份证正面URL
        investorIdCardBackUrl: '', // 投资人身份证背面URL
        investorIdCardNo: '', // 投资人身份证号码
        investorEmail: '', // 投资人邮箱
        financePersonName: '', // 财务人员姓名
        financePersonMobile: '', // 财务人员手机
        isNeedFinanceID: 'Y',
        financePersonIdCardFrontUrl: '', // 财务人员身份证正面URL
        financePersonIdCardBackUrl: '', // 财务人员身份证背面URL
        financePersonIdCardNo: '', // 财务人员身份证号
        idCardReturnAddress: '', // 身份证寄回地址
        invoiceExpressAddress: '', // 发票快递地址
        fileExpressAddress: '', // 材料交付地址
        isNeedApproval: 'N', // 是否需要审批
        isPriority: 'N', // 是否加急
        depositRemissionAmount: '', // 押金减免
        tradeFeeDiscount: '', // 交易费折扣
        serviceFeeDiscount: '', // 开票费率折扣
        priorityReason: '', // 加急原因
        serviceAgreementUrl: '', // 服务协议url
        productOrderUrl: '', // 产品订单url
        authorisedUrl: '', // 授权委托url
        promiseUrl: '' // 承诺书url
      },
      formRules: {
        serviceFeeDiscount: [{
          validator: validateTradeFee, trigger: 'change'
        }],
        tradeFeeDiscount: [{
          validator: validateTradeFee, trigger: 'change'
        }],
        financePersonName: [{
          validator: sameName, trigger: 'change'
        }],
        financePersonIdCardNo: [{
          validator: sameIdcard, trigger: 'change'
        }],
        priorityReason: [{
          validator: validateIsPriority, trigger: 'change'
        }],
        depositRemissionAmount: [{
          validator: validateDepositRemissionAmount, trigger: 'change'
        }]
      },
      isShowButton: false,
      customerTimeout: null,
      customerList: [], // 客户列表
      sourceTaxList: [], // 税源地列表
      goodsList: [], // 商品列表
      companyTypeList: [] // 站点类型列表
    }
  },
  watch: {
    orderLogListDialogDisplay(val){
      val && this.queryOrderLogList()
    },
    'form.isNeedApproval': {
      handler: function(val){
        if (val === 'N'){
          this.form.isPriority = 'N'
          this.form.depositRemissionAmount = ''
          this.form.tradeFeeDiscount = ''
        }
      },
      deep: true
    },
    'form.isPriority': {
      handler: function(val){
        if (val === 'N'){
          this.form.priorityReason = ''
        }
      },
      deep: true
    }
  },
  computed: {
    showTradeFee(){
      let serviceCharge = this.form.serviceCharge || 0
      let tradeFeeDiscount = this.form.tradeFeeDiscount || 0
      let tradeFee = tradeFeeDiscount ? 1 - tradeFeeDiscount : 0
      return (serviceCharge * tradeFee).toFixed(2)
    },
    showPayAmount(){
      let serviceCharge = this.form.serviceCharge || 0
      let deposit = this.form.deposit || 0
      let depositRemissionAmount = this.form.depositRemissionAmount || 0
      return serviceCharge + deposit - depositRemissionAmount - Number(this.showTradeFee)
    }
  },
  methods: {
    async onPageShow(){
      this.clearForm()
      this.orderId = (this.$route.query && this.$route.query.orderid) || ''
      this.querySourceTaxList()
      await this.queryGoodsList()
      this.queryCompanyTypeList()
      this.queryCustomerList()
      this.orderId && this.orderId !== '' && this.queryOrderInfo()
    },
    async queryOrderLogList(){
      try {
        this.orderLogList = await this.$$main.orderLogList({
          orderId: this.orderId,
          orderType: 'A'
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    async queryOrderInfo(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        const info = await this.$$main.orderAccountOrderDetail({
          orderId: this.orderId
        })
        let taxTypes = {
          N: '一般纳税人',
          S: '小规模纳税人',
          D: ''
        }
        let orderInfo = info.orderInfo
        orderInfo.taxType = orderInfo.taxTypeName
        orderInfo.taxTypeName = taxTypes[orderInfo.taxTypeName || 'D']
        if (orderInfo.companyName && orderInfo.companyName !== '') {
          let arr = orderInfo.companyName.split(',')
          orderInfo.companyNames = arr.map((i) => {
            return {
              value: i
            }
          })
        } else {
          orderInfo.companyNames = [{
            value: ''
          }]
        }
        this.form = orderInfo
        this.form.customerId = this.form.customerId || ''
        this.form.sourceTaxId = this.form.sourceTaxId || ''
        this.form.goodsId = this.form.goodsId || ''
        this.form.companyTypeId = this.form.companyTypeId || ''
        this.form.serviceFeeDiscount = this.form.serviceFeeDiscount || ''
        this.form.depositRemissionAmount = this.form.depositRemissionAmount || ''
        this.form.tradeFeeDiscount = this.form.tradeFeeDiscount || ''

        this.onGoodsChange(orderInfo.goodsId)
        this.isShowButton = info.isShowButton || false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onPreviewClick(src){
      window.open(this.getUploadImageUrl(src, null))
    },
    async queryCustomerList(){
      try {
        this.customerList = await this.$$main.commonListCustomer()
      } catch (e) {
        this.customerList = []
      }
    },
    async querySourceTaxList(){
      try {
        this.sourceTaxList = await this.$$main.commonListSourceTax()
      } catch (e) {
        this.sourceTaxList = []
      }
    },
    onSourceTaxChange(i){
      let chooseSourceTax = this.sourceTaxList.filter((item) => {
        return item.sourceTaxId === i
      })
      if (chooseSourceTax && chooseSourceTax.length > 0) {
        this.form.isNeedFinanceID = chooseSourceTax[0].isNeedFinanceID
      }
    },
    async queryGoodsList(){
      try {
        this.goodsList = await this.$$main.commonListGoods()
      } catch (e) {
        this.goodsList = []
      }
    },
    onGoodsChange(i){
      let chooseGood = this.goodsList.filter((item) => {
        return item.goodsId === i
      })
      if (chooseGood && chooseGood.length > 0) {
        let taxTypes = {
          N: '一般纳税人',
          S: '小规模纳税人',
          D: ''
        }
        this.form.serviceCharge = chooseGood[0].serviceCharge
        this.form.deposit = chooseGood[0].deposit
        this.form.taxType = chooseGood[0].taxType
        this.form.taxTypeName = taxTypes[chooseGood[0].taxType || 'D']
      }
    },
    async queryCompanyTypeList(){
      try {
        this.companyTypeList = await this.$$main.commonListCompanyType()
      } catch (e) {
        this.companyTypeList = []
      }
    },
    onCompanyTypeChange(i){
      let chooseCompanyType = this.companyTypeList.filter((item) => {
        return item.companyTypeId === i
      })
      if (chooseCompanyType && chooseCompanyType.length > 0) {
        this.form.businessScope = chooseCompanyType[0].businessScope
      }
    },
    addCompanyName(){
      this.form.companyNames.push({
        value: ''
      })
    },
    removeCompanyName(item){
      let index = this.form.companyNames.indexOf(item)
      if (index !== -1) {
        this.form.companyNames.splice(index, 1)
      }
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
      let arr = []
      if (this.form.companyNames && this.form.companyNames.length > 0){
        this.form.companyNames.forEach((item) => {
          item && item.value && arr.push(item.value)
        })
      }
      this.form.companyName = arr.join(',')
      this.form.tradeFeeDiscount = this.form.tradeFeeDiscount || 1
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.orderId = await this.$$main.orderEditAccountOrder(this.form)
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
          orderType: 'A'
        })
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.queryOrderInfo()
        this.$router.push(`/order/account-order-details?orderid=${this.orderId}`)
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onExpressChoose(res, name){
      this.form[name] = `${res.receiver || ' '}，${res.phone || ' '}，${res.address || ' '}。`
    },
    openLoading(target) {
      this.uploadLoading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(){
      this.uploadLoading.close()
    },
    clearForm(){
      this.orderId = ''
      this.isShowButton = false
      this.form = {
        orderId: '',
        orderNo: '',
        customerId: '', // 客户编号
        sourceTaxId: '', // 税源地编号
        goodsId: '', // 商品编号
        taxType: '', // 纳税性质
        taxTypeName: '',
        serviceCharge: '', // 开户服务费
        deposit: '', // 开户押金
        companyTypeId: '', // 站点类型编号
        isAdjustment: 'N',
        businessScope: '', // 经营范围
        companyNames: [{
          value: ''
        }],
        companyName: '', // 站点名称
        registeredCapital: '10', // 注册资本
        investorName: '', // 投资人姓名
        investorMobile: '', // 投资人手机
        investorIdCardFrontUrl: '', // 投资人身份证正面URL
        investorIdCardBackUrl: '', // 投资人身份证背面URL
        investorIdCardNo: '', // 投资人身份证号码
        investorEmail: '', // 投资人邮箱
        financePersonName: '', // 财务人员姓名
        financePersonMobile: '', // 财务人员手机
        isNeedFinanceID: 'Y',
        financePersonIdCardFrontUrl: '', // 财务人员身份证正面URL
        financePersonIdCardBackUrl: '', // 财务人员身份证背面URL
        financePersonIdCardNo: '', // 财务人员身份证号
        idCardReturnAddress: '', // 身份证寄回地址
        invoiceExpressAddress: '', // 发票快递地址
        fileExpressAddress: '', // 材料交付地址
        isNeedApproval: 'N', // 是否需要审批
        isPriority: 'N', // 是否加急
        depositRemissionAmount: '', // 押金减免
        tradeFeeDiscount: '', // 交易费折扣
        serviceFeeDiscount: '', // 开票费率折扣
        priorityReason: '', // 加急原因
        serviceAgreementUrl: '', // 服务协议url
        productOrderUrl: '', // 产品订单url
        authorisedUrl: '', // 授权委托url
        promiseUrl: '' // 承诺书url
      }
    }
  },
  mounted() {
  }
}
</script>
