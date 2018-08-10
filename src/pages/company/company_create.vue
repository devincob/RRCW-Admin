<template>
  <x-page :breadcrumb="breadcrumb" title="新增/编辑站点">
    <el-card class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" style="width: 460px;" label-width="180px">
        <el-form-item label="站点编号" prop="companyId">
          <el-input v-model="ruleForm.companyId" disabled :placeholder="ruleForm.companyId ? ruleForm.companyId : '系统自动生成'"></el-input>
        </el-form-item>
        <el-form-item label="站点名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" placeholder="请输入站点全名"></el-input>
        </el-form-item>
        <el-form-item label="站点税号" prop="taxNo">
          <el-input v-model="ruleForm.taxNo" placeholder="请输入站点税号"></el-input>
        </el-form-item>
        <el-form-item label="站点注册地址" prop="companyAddress">
          <el-input v-model="ruleForm.companyAddress" placeholder="请输入站点注册地址"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="companyPhone">
          <el-input v-model="ruleForm.companyPhone" placeholder="请输入公司电话"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="accountBank">
          <el-input v-model="ruleForm.accountBank" placeholder="请输入开户银行"></el-input>
        </el-form-item>
        <el-form-item label="开户银行账号" prop="accountBankAccount">
          <el-input v-model="ruleForm.accountBankAccount" placeholder="请输入开户银行账号"></el-input>
        </el-form-item>
        <el-form-item label="站点开票服务费费率折扣" prop="serviceFeeDiscount">
          <el-input type="number" v-model.number="ruleForm.serviceFeeDiscount" placeholder="请输入站点开票服务费费率折扣"></el-input>
        </el-form-item>
        <el-form-item label="税源地" prop="sourceTaxId">
          <el-select v-model="ruleForm.sourceTaxId" filterable placeholder="请选择税源地">
            <el-option v-for="item in sourceTaxList" :key="item.sourceTaxId" :label="item.sourceTaxName" :value="item.sourceTaxId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="goodsId">
          <el-select v-model="ruleForm.goodsId" filterable placeholder="请选择商品">
            <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="ruleForm.customerId" :disabled="!!ruleForm.companyId" filterable placeholder="请选择客户">
            <el-option v-for="item in customerList" :key="item.customerId" :label="item.customerName" :value="item.customerId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点类型" prop="companyTypeId">
          <el-select v-model="ruleForm.companyTypeId" placeholder="请选择客户">
            <el-option v-for="item in companyTypeList" :key="item.companyTypeId" :label="item.companyTypeName" :value="item.companyTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照" prop="licenseUrl">
          <el-upload
            class="avatar-uploader"
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="()=>{uploading=true}"
            :on-error="()=>{uploading=false}"
            :on-success="handleAvatarSuccess">
            <x-image v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button type="text" @click="onPreviewClick()" size="mini" v-if="imageUrl">查看原图</el-button>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status">
            <el-option label="正常" value="N"/>
            <el-option label="禁用" value="D"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="deposit">
          <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入备注内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </x-page>
</template>

<script>
export default {
  name: 'company_create',
  data(){
    return {
      fullscreenLoading: false,
      imageUrl: '',
      sourceTaxList: [],
      goodsList: [],
      customerList: [],
      companyTypeList: [],
      ruleForm: {},
      uploading: false,
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        sourceTaxId: [
          { required: true, message: '请选择税源地', trigger: 'change' }
        ],
        goodsId: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        companyTypeId: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        licenseUrl: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        'taxNo': { required: true, message: '请输入站点税号', trigger: 'change' },
        'companyAddress': { required: true, message: '请输入站点注册地址', trigger: 'change' },
        'companyPhone': { required: true, message: '请输入公司电话', trigger: 'change' },
        'accountBank': { required: true, message: '请输入开户银行', trigger: 'change' },
        'accountBankAccount': { required: true, message: '请输入开户银行账号', trigger: 'change' },
        'serviceFeeDiscount': [
          { type: 'number', required: true, min: 0.0, max: 1.0, message: '站点开票服务费费率折扣为0.00-1.00之间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '站点管理', id: 0},
        {path: '', title: this.ruleForm.companyId ? '编辑站点' : '新增站点', id: 1}
      ]
    }
  },
  watch: {
    uploading(v){
      if (v){
        this._loader = this.$loading({
          target: '.avatar-uploader .el-upload'
        })
      } else {
        this._loader && this._loader.close()
      }
    }
  },
  methods: {
    async submitForm(){
      try {
        const isValid = await this.$refs.ruleForm.validate()
        if (isValid) {
          const res = await this.$$main.companyModify({
            ...this.ruleForm
          })
          console.log(res)
          if (!this.ruleForm.companyId) this.loadInfo(res)
        }
        this.$message.success('保存成功')
        // setTimeout(window.close, 1500)
      } catch (e) {
        this.$message.error(e.message)
        console.log(e)
      }
    },
    async loadSourceTaxList(){
      try {
        this.sourceTaxList = await this.$$main.commonListSourceTax()
      } catch (e) {
        console.log(e)
      }
    },
    async loadGoodsList(){
      try {
        this.goodsList = await this.$$main.commonListGoods()
      } catch (e) {
        console.log(e)
      }
    },
    async loadListCustomer(){
      try {
        this.customerList = await this.$$main.commonListCustomer()
      } catch (e) {
        console.log(e)
      }
    },
    async loadCompanyTypeList(){
      try {
        this.companyTypeList = await this.$$main.commonListCompanyType()
      } catch (e) {
        console.log(e)
      }
    },
    loadInfo(companyId){
      this.$$main.companyDetail({companyId}).then(company => {
        this.ruleForm = {
          'companyName': company.companyName,
          'sourceTaxId': company.sourceTaxId,
          'goodsId': company.goodsId,
          'customerId': company.customerId,
          'licenseUrl': company.licenseUrl,
          'status': company.status,
          'remark': company.remark,
          'companyId': company.companyId,
          'companyTypeId': company.companyTypeId,
          'taxNo': company.taxNo,
          'companyAddress': company.companyAddress,
          'companyPhone': company.companyPhone,
          'accountBank': company.accountBank,
          'accountBankAccount': company.accountBankAccount,
          'serviceFeeDiscount': company.serviceFeeDiscount
        }
        this.imageUrl = company.licenseUrl
        this.$refs.ruleForm.resetFields()
      })
    },
    handleAvatarSuccess(response, file){
      this.ruleForm.licenseUrl = this.imageUrl = response.body.imageUrl
      this.uploading = false
    },
    onPreviewClick(){
      window.open(this.getUploadImageUrl(this.imageUrl, null))
    },
    onPageShow(){
      this.ruleForm = {
        'companyName': null,
        'sourceTaxId': null,
        'goodsId': null,
        'customerId': null,
        'licenseUrl': null,
        'status': 'N',
        'remark': null,
        'companyId': null,
        'companyTypeId': null,
        'taxNo': null,
        'companyAddress': null,
        'companyPhone': null,
        'accountBank': null,
        'accountBankAccount': null,
        'serviceFeeDiscount': null
      }
      this.imageUrl = ''
      this.$refs.ruleForm.resetFields()
      if (this.$route.query.companyId) {
        const companyId = Number(this.$route.query.companyId || 0)
        this.loadInfo(companyId)
      }
      this.loadSourceTaxList()
      this.loadGoodsList()
      this.loadListCustomer()
      this.loadCompanyTypeList()
    }
  },
  mounted(){
  }
}
</script>

<style scoped>
</style>
