<template>
  <div>
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
          <el-date-picker placeholder="交易日期：1999-07-01"
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
          <el-button size="small"  @click="recordBeforeClose">取 消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'RecordAndEditCompanyDialog',
  props: {
    recordFlowFormDetail: {
      type: Object,
      'default': {}
    }
  },
  data(){
    return {
      title: '录入银行流水',
      formLabelWidth: '120px',
      companyList: [],
      bankList: [],
      dialogRecordVisible: false,
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
      }
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
    recordBeforeClose(){ // 当且仅当 dialog中前三个参数都不为空的情况下，关闭录入流水dialog才刷新页面
      this.dialogRecordVisible = false
      if (this.recordFlowForm.companyId && this.recordFlowForm.bankName && this.recordFlowForm.tradeTime){
        this.queryBankFlowList()
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
      try {
        await this.$$main.riskSaveCompanyWater(this.recordFlowForm)
        if (this.recordTitle === '录入银行流水'){
          this.recordFlowForm.traderName = ''
          this.recordFlowForm.lastAmount = ''
          this.recordFlowForm.inAmount = ''
          this.recordFlowForm.outAmount = ''
          this.recordFlowForm.remark = ''
        } else {
          this.queryBankFlowList()
          this.dialogRecordVisible = false
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
      this.$nextTick(() => {
        this.$refs.recordFlowForm.clearValidate()
      })
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
    }
  },
  mounted(){
    this.recordFlowForm = JSON.parse(JSON.stringify(this.recordFlowFormDetail))
    if (this.recordTitle === '录入银行流水'){
      this.clearDialogParams()
    }
    this.loadCompanyList()
    this.getBankList()
  }
}
</script>

<style scoped>

</style>
