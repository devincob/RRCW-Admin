<template>
  <x-page :breadcrumb="breadcrumb" title="新增编辑商品">
    <el-card class="el-card-mini no-box-shadow no-border-radius" style="max-width:800px;min-width:600px;min-height:1000px">
         <div slot="header"><span
              style="font-size: 14px;"
              class="text-bold"
            >新增编辑商品</span></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" style="width: 460px;" label-width="160px">
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="ruleForm.goodsId" disabled :placeholder="ruleForm.goodsId ? ruleForm.goodsId : '系统自动生成'" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="ruleForm.goodsName" placeholder="请输入税管家商品名称" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="纳税性质" prop="taxType">
          <el-select v-model="ruleForm.taxType" placeholder="请选择商品的纳税性质" style="width: 340px;">
            <el-option label="一般纳税人" value="N"></el-option>
            <el-option label="小规模纳税人" value="S"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceTypeName">
          <el-select v-model="invoiceTypeNames" multiple placeholder="请选择商品开票订单的发票类型" style="width: 340px;">
            <el-option v-for="item in invoiceTypes" :key="item.invoiceTypeId" :label="item.invoiceTypeName" :value="item.invoiceTypeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票服务费费率" prop="invoiceServiceRatio">
          <el-input type="number" v-model.number="ruleForm.invoiceServiceRatio" placeholder="输入0.0至1.0之间的小数" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="开户服务费" prop="serviceCharge">
          <el-input type="number" v-model.number="ruleForm.serviceCharge" placeholder="输入正整数" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="开户押金" prop="deposit">
          <el-input type="number" v-model.number="ruleForm.deposit" placeholder="输入正整数" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status"  >
          <el-select v-model="ruleForm.status"  style="width: 340px;">
            <el-option label="正常" value="N"/>
            <el-option label="禁用" value="D"/>
          </el-select>
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
  name: 'goods_create',
  data(){
    return {
      fullscreenLoading: false,
      invoiceTypes: [],
      invoiceTypeNames: [],
      ruleForm: {},
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        taxType: [
          { required: true, message: '请选择纳税性质', trigger: 'change' }
        ],
        invoiceTypeName: [
          { required: true, message: '请选择发票类型', trigger: 'blur' }
        ],
        invoiceServiceRatio: [
          { type: 'number', required: true, min: 0.0, max: 1, message: '开票服务费费率为0.00-1.00之间', trigger: 'change' }
        ],
        serviceCharge: [
          { type: 'number', required: true, message: '请输入开户服务费', trigger: 'change' }
        ],
        deposit: [
          { type: 'number', required: true, message: '请输入开户押金', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    invoiceTypeNames(val){
      this.ruleForm.invoiceTypeName = (val || []).join(',')
      if (val && val.length) {
        this.$nextTick(() => {
          this.$refs.ruleForm.validateField('invoiceTypeName')
        })
      }
    }
  },
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '商品管理', id: 0},
        {path: '', title: this.ruleForm.goodsId ? '编辑商品' : '新增商品', id: 1}
      ]
    }
  },
  methods: {
    async loadInvoiceTypes(){
      try {
        const res = await this.$$main.commonListInvoiceType()
        if (res) {
          this.invoiceTypes = res
        }
      } catch (e) {
        console.log(e)
      }
    },
    async submitForm(){
      try {
        const isValid = await this.$refs.ruleForm.validate()
        if (isValid) {
          this.fullscreenLoading = true
          const data = {
            ...this.ruleForm,
            goodsId: this.ruleForm.goodsId === null ? 0 : this.ruleForm.goodsId
          }
          const res = await this.$$main.goodsModify(data)
          this.fullscreenLoading = false
          if (res) {
            this.$message.success('保存成功！')
            // setTimeout(window.close, 2000)
            if (!this.ruleForm.goodsId) this.loadGoodsDetail(res)
          }
        }
      } catch (e) {
        this.fullscreenLoading = false
        this.$message.error(e.message)
        console.log(e)
      }
    },
    loadGoodsDetail(goodsId){
      this.$$main.goodsDetail({goodsId}).then(goods => {
        this.invoiceTypeNames = (!goods.invoiceTypeName || !goods.invoiceTypeName.length) ? [] : goods.invoiceTypeName.split(',')
        this.ruleForm = {
          'goodsName': goods.goodsName,
          'invoiceTypeName': goods.invoiceTypeName,
          'taxType': goods.taxType,
          'invoiceServiceRatio': goods.invoiceServiceRatio,
          'serviceCharge': goods.serviceCharge,
          'deposit': goods.deposit,
          'status': goods.status,
          'goodsId': goods.goodsId
        }
      })
    },
    onPageShow(){
      this.ruleForm = {
        'goodsName': '',
        'invoiceTypeName': null,
        'taxType': '',
        'invoiceServiceRatio': null,
        'serviceCharge': null,
        'deposit': null,
        'status': 'N',
        'goodsId': null
      }
      this.invoiceTypeNames = []
      this.$refs.ruleForm.resetFields()
      if (this.$route.query.goods_id) {
        const goodsId = Number(this.$route.query.goods_id || 0)
        this.loadGoodsDetail(goodsId)
      }
      this.loadInvoiceTypes()
    }
  },
  mounted(){
  }
}
</script>

<style scoped>

</style>
