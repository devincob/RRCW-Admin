<template>
  <div class="invoice-dialog-component">
    <CPicker title="发票信息" :visible.sync="visibleDialog">
      <div>
        <el-form :inline="true" size="mini" class="invoice-form">
          <el-form-item label="公司名称" label-width="70px">
            <el-input placeholder="请输入公司名称" v-model="form.invoiceCompanyName" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="发票类型" label-width="70px">
            <el-select v-model="form.invoiceInfoType" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="增值税普通发票" value="P" />
              <el-option label="增值税专用发票" value="Z" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadDetail">搜索</el-button>
            <el-button type="danger" @click="clearQueryParams">清空</el-button>
          </el-form-item>
        </el-form>
        <table class="invoice-table" :class="['details-table', `info-item${index}`]" v-for="(item, index) in invoiceInfo" :key="index">
          <col style="width: 100px;"><col><col style="width: 100px;"><col>
          <tr v-if="item.editMode">
            <td class="td-label">发票类型</td>
            <td colspan="3">
              <el-select v-model="item.invoiceInfoType" style="width: 100%">
                <el-option
                  v-for="item in invoiceTypes"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="td-label">公司名称</td>
            <td>
              <div v-if="item.editMode">
                <div style="display: flex">
                  <el-input @focus="onInputFocus(item)" @blur="onInputBlur(item)" :ref="`input${index}`" v-model="item.invoiceCompanyName" size="mini" v-if="item.editMode"/>
                  <el-button type="text" size="mini" @click="queryCompany(item, index)">查询</el-button>
                </div>
                <div v-if="item.showCompany && item.isSearched && item.haveCompany" class="el-select-dropdown el-popper" x-placement="bottom-start">
                  <div class="el-scrollbar">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -15px; margin-right: -15px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li @click.stop="onCompanySelect(item, company)" class="el-select-dropdown__item" v-for="(company, $index) in item.companyList" :key="$index">
                          <span>{{company.companyName}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="popper__arrow" style="left: 35px;"></div>
                </div>
                <div v-if="item.showCompany && item.isSearched && !item.haveCompany" class="el-select-dropdown el-popper" x-placement="bottom-start">
                  <div class="el-scrollbar">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -15px; margin-right: -15px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li class="el-select-dropdown__item">
                          <span>未查询到公司</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="popper__arrow" style="left: 35px;"></div>
                </div>
              </div>
              <span v-else>{{item.invoiceCompanyName}}</span>
            </td>
            <td class="td-label">公司税号</td>
            <td>
              <el-input v-model="item.invoiceCompanyTaxNo" size="mini" v-if="item.editMode"/>
              <span v-else>{{item.invoiceCompanyTaxNo}}</span>
            </td>
          </tr>
          <tr v-if="item.invoiceInfoType === 'Z'">
            <td class="td-label">公司地址</td>
            <td>
              <el-input v-model="item.invoiceCompanyAddress" size="mini" v-if="item.editMode"/>
              <span v-else>{{item.invoiceCompanyAddress}}</span>
            </td>
            <td class="td-label">公司电话</td>
            <td>
              <el-input v-model="item.invoiceCompanyPhone" size="mini" v-if="item.editMode"/>
              <span v-else>{{item.invoiceCompanyPhone}}</span>
            </td>
          </tr>
          <tr v-if="item.invoiceInfoType === 'Z'">
            <td class="td-label">开户银行</td>
            <td>
              <el-input v-model="item.invoiceCompanyBankName" size="mini" v-if="item.editMode"/>
              <span v-else>{{item.invoiceCompanyBankName}}</span>
            </td>
            <td class="td-label">银行账号</td>
            <td>
              <el-input v-model="item.invoiceCompanyBankNo" size="mini" v-if="item.editMode"/>
              <span v-else>{{item.invoiceCompanyBankNo}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <el-button type="text" size="mini" @click="onChoose(item, index)">选择</el-button>
              <el-popover
                placement="top"
                width="160"
                v-model="item.showPop">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="item.showPop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="onDelect(item, index)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" size="mini" style="float: right">删除</el-button>
              </el-popover>
              <el-button type="text" size="mini" class="mr-sm" style="float: right" v-if="item.editMode" @click="onSave(item, index)">保存</el-button>
              <el-button type="text" size="mini" class="mr-sm" style="float: right" v-else @click="item.editMode = true">修改</el-button>
            </td>
          </tr>
        </table>
        <el-row style="margin-top: 15px;">
          <el-col :span="24" style="text-align: center">
            <el-button size="mini" type="text" @click="addInvoice"><i class="el-icon-circle-plus-outline"></i>添加发票信息</el-button>
          </el-col>
        </el-row>
      </div>
    </CPicker>
    <el-button type="text" size="mini" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'
export default {
  name: 'CompanyDetailsDialog',
  components: {CPicker},
  props: ['customerId', 'invoiceInfoType'],
  watch: {
    visibleDialog(val){
      if (val) {
        if (!this.customerId) {
          this.visibleDialog = false
          this.$message.error('请先选择客户')
          return
        }
        this.loadDetail()
      }
    }
  },
  data(){
    return {
      visibleDialog: false,
      editMode: false,
      invoiceTypes: [{
        key: 'P',
        value: '增值税普通发票'
      }, {
        key: 'Z',
        value: '增值税专用发票'
      }],
      form: {
        invoiceCompanyName: '',
        invoiceInfoType: ''
      },
      invoiceInfo: [],
      invoiceForm: {
        customerId: '',
        invoiceInfoId: '', // 发票信息编号
        invoiceInfoType: '', // 发票类型
        invoiceCompanyName: '', // 开票公司名称
        invoiceCompanyTaxNo: '', // 开票公司税号
        invoiceCompanyAddress: '', // 开票公司地址
        invoiceCompanyPhone: '', // 开票公司电话
        invoiceCompanyBankName: '', // 开票公司银行名称
        invoiceCompanyBankNo: '', // 开票公司银行账号
        editMode: true,
        showPop: false,
        showCompany: false,
        isSearched: false,
        haveCompany: false,
        companyList: []
      },
      focus: false,
      loading: false,
      saveLoading: null
    }
  },
  methods: {
    clearQueryParams(){
      this.form = {
        invoiceCompanyName: '',
        invoiceInfoType: ''
      }
      this.loadDetail()
    },
    async loadDetail(){
      this.openLoading(null, '正在查询...')
      try {
        let list = await this.$$main.customerListInvoiceInfo({
          ...this.form,
          customerId: this.customerId
        })
        list.forEach((i) => {
          i.customerId = this.customerId
          i.editMode = false
          i.showPop = false
          i.showCompany = false
          i.isSearched = false
          i.haveCompany = false
          i.companyList = []
        })
        this.invoiceInfo = list
      } catch (e){
        this.invoiceInfo = []
      } finally {
        this.closeLoading()
      }
    },
    onPreviewImageClick(img){
      window.open(this.getUploadImageUrl(img, null))
    },
    async onDelect(item, index){
      item.showPop = false
      if (!item.invoiceInfoId || item.invoiceInfoId === '') {
        this.invoiceInfo.splice(index, 1)
        return
      }
      try {
        this.openLoading(`.info-item${index}`, '正在删除...')
        await this.$$main.customerDeleteInvoiceInfo({
          invoiceInfoId: item.invoiceInfoId
        })
        this.invoiceInfo.splice(index, 1)
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        this.closeLoading()
      }
    },
    addInvoice(){
      this.invoiceForm.customerId = this.customerId
      this.invoiceInfo.push(JSON.parse(JSON.stringify(this.invoiceForm)))
    },
    async onSave(item, index, callback){
      if (!item.invoiceCompanyName || item.invoiceCompanyName === '') {
        this.$message.error('公司名称是必填的')
        return
      }
      if (!item.invoiceCompanyTaxNo || item.invoiceCompanyTaxNo === '') {
        this.$message.error('公司税号是必填的')
        return
      }
      if (item.invoiceInfoType === 'Z' && (!item.invoiceCompanyPhone || item.invoiceCompanyPhone === '')) {
        this.$message.error('公司电话是必填的')
        return
      }
      if (item.invoiceInfoType === 'Z' && (!item.invoiceCompanyAddress || item.invoiceCompanyAddress === '')) {
        this.$message.error('公司地址是必填的')
        return
      }
      if (item.invoiceInfoType === 'Z' && (!item.invoiceCompanyBankName || item.invoiceCompanyBankName === '')) {
        this.$message.error('公司开户银行是必填的')
        return
      }
      if (item.invoiceInfoType === 'Z' && (!item.invoiceCompanyBankNo || item.invoiceCompanyBankNo === '')) {
        this.$message.error('公司开户银行账号是必填的')
        return
      }
      try {
        this.openLoading(`.info-item${index}`)
        await this.$$main.customerModifyInvoiceInfo(item)
        this.closeLoading()
        item.editMode = false
        this.loadDetail()
        callback && callback()
      } catch (e){
        this.closeLoading()
        e.message && this.$message.error(e.message)
      }
    },
    onChoose(item, index){
      if (!item.invoiceInfoId || item.editMode) {
        this.onSave(item, index, () => {
          this.$emit('onChoose', item)
          this.visibleDialog = false
        })
      } else {
        this.$emit('onChoose', item)
        this.visibleDialog = false
      }
    },
    openLoading(target, text = '正在保存...') {
      this.saveLoading = this.$loading({
        lock: true,
        text: text,
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(){
      this.saveLoading.close()
    },
    onInputFocus(item){
      item.showCompany = true
    },
    onInputBlur(item){
      this.setTimeout(() => {
        item.showCompany = false
      }, 200)
    },
    async queryCompany(item, index){
      try {
        if (!item.invoiceCompanyName){
          return
        }
        this.openLoading(null, '正在查询...')
        let list = await this.$$main.commonInvoiceQuery({
          companyName: item.invoiceCompanyName
        })
        item.isSearched = true
        if (list && list.length > 0){
          item.companyList = list
          item.haveCompany = true
        } else {
          item.companyList = []
          item.haveCompany = false
        }
        this.$refs['input' + index][0].focus()
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        this.closeLoading()
      }
    },
    onCompanySelect(item, company){
      item.invoiceCompanyName = company.companyName
      this.queryCompanyInvoice(item, company)
    },
    async queryCompanyInvoice(item, company){
      try {
        this.openLoading(null, '正在查询公司信息...')
        const info = await this.$$main.commonCompanyInvoce({
          companyId: company.companyId
        })
        item.invoiceCompanyTaxNo = info.companyTaxNo
        item.invoiceCompanyAddress = info.companyAddress
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        this.closeLoading()
      }
    }
  }
}
</script>

<style lang="scss">
  .invoice-dialog-component{
    .invoice-form .el-form-item__content{
      display: inline-block;
    }
    .details-table,.details-table tr th, .details-table tr td {
      border:1px solid #e5e5e5;
    }
    .details-table {
      width: 100%;
      border-collapse:collapse;
      border-spacing:1px 1px;
      table-layout: fixed;
      word-break:break-all;
      margin-bottom: 10px;
    }
    .details-table td {
      border: 0;
      padding: 4px 6px;
      word-wrap: break-word;
      white-space: normal;
      vertical-align: baseline;
    }
    .el-input{
      width: 100%;
    }
    .td-label {
      text-align: right;
      width: 100px;
      font-size: 13px;
    }
  }

</style>
