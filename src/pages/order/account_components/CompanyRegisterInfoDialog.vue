<template>
  <el-dialog
    title="站点信息"
    :visible.sync="companyRegisterInfoDialogDisplay"
    :close-on-click-modal="false"
    width="600px"
    custom-class="company-register-info-dialog"
    center
  >
    <el-form
      ref="companyRegisterInfoForm"
      :model="companyRegisterInfoForm"
      label-width="130px"
      size="small"
    >
      <el-form-item
        label="供应商"
        prop="companyTypeName"
      >
        <el-select
          style="width: 100%"
          v-model="companyRegisterInfoForm.supplierId"
          placeholder="请选择供应商"
        >
          <el-option
            v-for="item in sourceTaxSupplierList"
            :key="item.supplierId"
            :label="item.supplierName"
            :value="item.supplierId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="companyName"
        v-for="(name, index) in companyRegisterInfoForm.companyNames"
        :key="index"
      >
        <label
          slot="label"
          v-show="index === 0"
        >站点名称<span
          style="color: red"
          v-if="info && info.orderInfo && info.orderInfo.isAdjustment !== 'Y'"
        >(不可调剂)</span></label>
        <el-row>
          <el-col :span="20">
            <el-input
              v-model="name.value"
              placeholder="站点名称"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              type="text"
              size="mini"
              style="margin-left: 5px"
              @click.prevent="removeCompanyName(name)"
              v-if="companyRegisterInfoForm.companyNames && companyRegisterInfoForm.companyNames.length > 1"
            >删除</el-button>
            <el-button
              type="text"
              size="mini"
              style="margin-left: 5px"
              @click.prevent="addCompanyName()"
              v-if="companyRegisterInfoForm.companyNames && companyRegisterInfoForm.companyNames.length < 10 &&companyRegisterInfoForm.companyNames.length === index + 1"
            >增加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        label="站点类型"
        prop="companyTypeName"
      >
        <el-select
          style="width: 100%"
          v-model="companyRegisterInfoForm.companyTypeId"
          @change="onCompanyTypeChange"
          placeholder="请选择站点类型"
        >
          <el-option
            v-for="item in companyTypeList"
            :key="item.companyTypeId"
            :label="item.companyTypeName"
            :value="item.companyTypeId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="经营范围"
        prop="businessScope"
      >
        <el-input
          v-model="companyRegisterInfoForm.businessScope"
          placeholder="经营范围"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 2}"
          readonly
        />
      </el-form-item>
      <el-form-item
        label="注册资本"
        prop="registeredCapital"
        class="flex-content"
      >
        <el-input
          v-model="companyRegisterInfoForm.registeredCapital"
          placeholder="注册资本"
          readonly
        /><span>万元</span>
      </el-form-item>
      <el-form-item
        label="纳税性质"
        prop="showTaxTypeName"
      >
        <el-input
          v-model="companyRegisterInfoForm.showTaxTypeName"
          placeholder="纳税性质"
          readonly
        />
      </el-form-item>
      <el-form-item
        label="投资人姓名"
        prop="investorName"
      >
        <el-input
          v-model="companyRegisterInfoForm.investorName"
          placeholder="投资人姓名"
        />
      </el-form-item>
      <el-form-item
        label="投资人手机"
        prop="investorMobile"
      >
        <el-input
          v-model="companyRegisterInfoForm.investorMobile"
          placeholder="投资人手机"
        />
      </el-form-item>
      <el-form-item
        label="投资人身份证号码"
        prop="investorIdCardNo"
      >
        <el-input
          v-model="companyRegisterInfoForm.investorIdCardNo"
          placeholder="投资人身份证号码"
        />
      </el-form-item>
      <el-form-item
        label="上传投资人身份证"
        class="account-upload"
      >
        <div>
          <upload-files
            @success="url => companyRegisterInfoForm.investorIdCardFrontUrl = url">
            <x-image
              v-if="companyRegisterInfoForm.investorIdCardFrontUrl"
              :src="companyRegisterInfoForm.investorIdCardFrontUrl"
              class="avatar"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="display: block"
            >正面</i>
          </upload-files>
          <preview-button
            type="text"
            size="mini"
            always-show
            new-window-open
            :src="companyRegisterInfoForm.investorIdCardFrontUrl"
            v-if="companyRegisterInfoForm.investorIdCardFrontUrl"
          >查看原文件</preview-button>
          <preview-button
            type="text"
            size="mini"
            :src="companyRegisterInfoForm.investorIdCardFrontUrl"
            v-if="companyRegisterInfoForm.investorIdCardFrontUrl"
          >预览原文件</preview-button>
        </div>
        <div class="ml-10">
          <upload-files
            class="ml-10"
            @success="url => companyRegisterInfoForm.investorIdCardBackUrl = url">
            <x-image
              v-if="companyRegisterInfoForm.investorIdCardBackUrl"
              :src="companyRegisterInfoForm.investorIdCardBackUrl"
              class="avatar"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            >反面</i>
          </upload-files>
          <preview-button
            type="text"
            size="mini"
            always-show
            new-window-open
            :src="companyRegisterInfoForm.investorIdCardBackUrl"
            v-if="companyRegisterInfoForm.investorIdCardBackUrl"
          >查看原文件</preview-button>
          <preview-button
            type="text"
            size="mini"
            :src="companyRegisterInfoForm.investorIdCardBackUrl"
            v-if="companyRegisterInfoForm.investorIdCardBackUrl"
          >预览原文件</preview-button>
        </div>
      </el-form-item>
      <el-form-item
        label="投资人邮箱"
        prop="investorEmail"
      >
        <el-input
          v-model="companyRegisterInfoForm.investorEmail"
          placeholder="投资人邮箱"
        />
      </el-form-item>
      <el-form-item
        label="财务人员姓名"
        prop="financePersonName"
      >
        <el-input
          v-model="companyRegisterInfoForm.financePersonName"
          placeholder="财务人员姓名"
        />
      </el-form-item>
      <el-form-item
        label="财务人员手机"
        prop="financePersonMobile"
      >
        <el-input
          v-model="companyRegisterInfoForm.financePersonMobile"
          placeholder="财务人员手机"
        />
      </el-form-item>
      <el-form-item
        label="上传财务人员身份证"
        prop="investorEmail"
        class="account-upload"
        v-show="companyRegisterInfoForm.isNeedFinanceID === 'Y'"
      >
        <div>
          <upload-files
            @success="url => companyRegisterInfoForm.financePersonIdCardFrontUrl = url">
            <x-image
              v-if="companyRegisterInfoForm.financePersonIdCardFrontUrl"
              :src="companyRegisterInfoForm.financePersonIdCardFrontUrl"
              class="avatar"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="display: block"
            >正面</i>
          </upload-files>
          <preview-button
            type="text"
            size="mini"
            always-show
            new-window-open
            :src="companyRegisterInfoForm.financePersonIdCardFrontUrl"
            v-if="companyRegisterInfoForm.financePersonIdCardFrontUrl"
          >查看原文件</preview-button>
          <preview-button
            type="text"
            size="mini"
            :src="companyRegisterInfoForm.financePersonIdCardFrontUrl"
            v-if="companyRegisterInfoForm.financePersonIdCardFrontUrl"
          >预览原文件</preview-button>
        </div>
        <div class="ml-10">
          <upload-files
            class="ml-10"
            @success="url => companyRegisterInfoForm.financePersonIdCardBackUrl = url">
            <x-image
              v-if="companyRegisterInfoForm.financePersonIdCardBackUrl"
              :src="companyRegisterInfoForm.financePersonIdCardBackUrl"
              class="avatar"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            >反面</i>
          </upload-files>
          <preview-button
            type="text"
            size="mini"
            always-show
            new-window-open
            :src="companyRegisterInfoForm.financePersonIdCardBackUrl"
            v-if="companyRegisterInfoForm.financePersonIdCardBackUrl"
          >查看原文件</preview-button>
          <preview-button
            type="text"
            size="mini"
            :src="companyRegisterInfoForm.financePersonIdCardBackUrl"
            v-if="companyRegisterInfoForm.financePersonIdCardBackUrl"
          >预览原文件</preview-button>
        </div>
      </el-form-item>
      <el-form-item
        label="财务人员身份证号"
        prop="financePersonIdCardNo"
      >
        <el-input
          v-model="companyRegisterInfoForm.financePersonIdCardNo"
          placeholder="财务人员身份证号"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="companyRegisterInfoForm.remark"
          placeholder="备注"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 2}"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
        <el-button @click="companyRegisterInfoDialogDisplay = false">取消</el-button>
        <el-button
          type="primary"
          @click="editCompanyRegisterInfo"
        >确认</el-button>
      </span>
  </el-dialog>
</template>

<script>
import PreviewButton from '../../../components/PreviewButton'
import UploadFiles from '../../../components/UploadFiles'
export default {
  name: 'company-register-info-dialog',
  components: {PreviewButton, UploadFiles},
  data(){
    return {
      companyRegisterInfoDialogDisplay: false,
      companyRegisterInfoForm: {
        orderId: '', // 订单Id
        supplierId: '',
        companyNames: [{
          value: ''
        }],
        companyName: '', // 站点名称
        companyTypeId: '', // 站点类型
        businessScope: '',
        registeredCapital: '', // 注册资本
        showTaxTypeName: '', // 纳税性质
        taxTypeName: '', // 纳税性质
        investorName: '', // 投资人姓名
        investorMobile: '', // 投资人手机
        investorIdCardNo: '', // 投资人身份证号码
        investorIdCardFrontUrl: '', // 投资人身份证正面URL
        investorIdCardBackUrl: '', // 投资人身份证背面URL
        investorEmail: '', // 投资人邮箱
        financePersonName: '', // 财务人员姓名
        financePersonMobile: '', // 财务人员手机
        isNeedFinanceID: 'N',
        financePersonIdCardFrontUrl: '', // 财务人员身份证正面URL
        financePersonIdCardBackUrl: '', // 财务人员身份证背面URL
        financePersonIdCardNo: '', // 财务人员身份证号
        remark: '' // 备注
      },
      companyTypeList: [], // 公司类型列表
      sourceTaxSupplierList: [] // 供应商列表
    }
  },
  props: ['info'],
  methods: {
    async show(){
      this.info.orderInfo && this.info.orderInfo.sourceTaxId && await this.querySourceTaxSupplierList()
      let regInfo = this.info.companyRegInfo
      if (regInfo) {
        if (regInfo.companyName && regInfo.companyName !== '') {
          let arr = regInfo.companyName.split(',')
          regInfo.companyNames = arr.map((i) => {
            return {
              value: i
            }
          })
        } else {
          regInfo.companyNames = [{
            value: ''
          }]
        }
        regInfo.supplierId = regInfo.supplierId || ''
        this.companyRegisterInfoForm = JSON.parse(JSON.stringify(regInfo))
      } else {
        const orderInfo = this.info.orderInfo
        let arr = orderInfo.companyName.split(',')
        let names = arr.map((i) => {
          return {
            value: i
          }
        })
        this.companyRegisterInfoForm = {
          orderId: (orderInfo && orderInfo.orderId) || '', // 订单Id
          supplierId: '',
          companyNames: names,
          companyName: (orderInfo && orderInfo.companyName) || '', // 站点名称
          companyTypeId: (orderInfo && orderInfo.companyTypeId) || '', // 站点类型
          businessScope: (orderInfo && orderInfo.businessScope) || '',
          registeredCapital: (orderInfo && orderInfo.registeredCapital) || '', // 注册资本
          taxTypeName: (orderInfo && orderInfo.taxTypeName) || '', // 纳税性质
          showTaxTypeName: (orderInfo && orderInfo.showTaxTypeName) || '', // 纳税性质
          investorName: (orderInfo && orderInfo.investorName) || '', // 投资人姓名
          investorMobile: (orderInfo && orderInfo.investorMobile) || '', // 投资人手机
          investorIdCardNo: (orderInfo && orderInfo.investorIdCardNo) || '', // 投资人身份证号码
          investorIdCardFrontUrl: (orderInfo && orderInfo.investorIdCardFrontUrl) || '', // 投资人身份证正面URL
          investorIdCardBackUrl: (orderInfo && orderInfo.investorIdCardBackUrl) || '', // 投资人身份证背面URL
          investorEmail: (orderInfo && orderInfo.investorEmail) || '', // 投资人邮箱
          financePersonName: (orderInfo && orderInfo.financePersonName) || '', // 财务人员姓名
          financePersonMobile: (orderInfo && orderInfo.financePersonMobile) || '', // 财务人员手机
          isNeedFinanceID: (orderInfo && orderInfo.isNeedFinanceID) || 'N',
          financePersonIdCardFrontUrl: (orderInfo && orderInfo.financePersonIdCardFrontUrl) || '', // 财务人员身份证正面URL
          financePersonIdCardBackUrl: (orderInfo && orderInfo.financePersonIdCardBackUrl) || '', // 财务人员身份证背面URL
          financePersonIdCardNo: (orderInfo && orderInfo.financePersonIdCardNo) || '', // 财务人员身份证号
          remark: '' // 备注
        }
      }
      this.companyRegisterInfoDialogDisplay = true
    },
    hide(){
      this.companyRegisterInfoDialogDisplay = false
    },
    async querySourceTaxSupplierList() {
      try {
        this.sourceTaxSupplierList = await this.$$main.sourceTaxListSupplier({
          sourceTaxId: this.info.orderInfo.sourceTaxId
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    async queryCompanyTypeList() {
      try {
        this.companyTypeList = await this.$$main.commonListCompanyType()
      } catch (e) {
        this.companyTypeList = []
      }
    },
    onCompanyTypeChange(i) {
      let chooseCompanyType = this.companyTypeList.filter((item) => {
        return item.companyTypeId === i
      })
      if (chooseCompanyType && chooseCompanyType.length > 0) {
        this.companyRegisterInfoForm.businessScope = chooseCompanyType[0].businessScope
      }
    },
    addCompanyName() {
      this.companyRegisterInfoForm.companyNames.push({
        value: ''
      })
    },
    removeCompanyName(item) {
      let index = this.companyRegisterInfoForm.companyNames.indexOf(item)
      if (index !== -1) {
        this.companyRegisterInfoForm.companyNames.splice(index, 1)
      }
    },
    async editCompanyRegisterInfo() {
      let arr = []
      if (this.companyRegisterInfoForm.companyNames && this.companyRegisterInfoForm.companyNames.length > 0) {
        this.companyRegisterInfoForm.companyNames.forEach((item) => {
          item && item.value && arr.push(item.value)
        })
      }
      this.companyRegisterInfoForm.companyName = arr.join(',')
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.companyRegisterInfoForm.orderId = this.info.orderInfo.orderId
        await this.$$main.orderAOEditCompanyRegisterInfo(this.companyRegisterInfoForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('saved')
        this.hide()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted(){
    this.queryCompanyTypeList()
  }
}
</script>

<style scoped>

</style>
