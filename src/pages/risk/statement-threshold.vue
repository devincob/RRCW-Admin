<template>
  <x-page breadcrumb="auto" title="流水预警阈值">
    <el-card class="box-card" style="width: 600px">
      <div slot="header" class="clearfix">
        <span>银行流水阈值设置</span>
      </div>
      <div>
        <el-form ref="form" :model="form" :rules="formRules" label-width="160px" size="small">
          <el-form-item label="非法人账户转出：">
            <el-checkbox v-model="form.investorOutSetting" true-label="Y" false-label="N">预警</el-checkbox>
          </el-form-item>
          <el-form-item label="当日入账当日出账：">
            <el-checkbox v-model="form.todaySetting" true-label="Y" false-label="N">预警</el-checkbox>
          </el-form-item>
          <el-form-item label="转入公司开票订单：">
            <el-checkbox v-model="form.noInvestorSetting" true-label="Y" false-label="N">预警</el-checkbox>
          </el-form-item>
          <el-form-item label="账户余额阈值：" prop="amountSetting">
            <el-input style="width: 50%" v-model.number="form.amountSetting" placeholder="0为不预警，默认2000"/> 元
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-top: 20px" @click="onSaveClick">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </x-page>
</template>

<script>
export default {
  name: 'statement-warning-threshold',
  data() {
    const trainAmount = (rule, value, callback) => {
      if (!value || value === '') {
        callback()
      } else if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
        callback(new Error('必须为正数（最多两位小数）'))
      } else {
        callback()
      }
    }
    return {
      form: {
        // 非法人账户转出
        investorOutSetting: 'N',
        // 当日入账当日出账
        todaySetting: 'N',
        // 转入公司开票订单
        noInvestorSetting: 'N',
        // 账户余额阈值
        amountSetting: ''
      },
      formRules: {
        amountSetting: [{validator: trainAmount, trigger: 'change'}]
      }
    }
  },
  methods: {
    onPageShow(){
      this.queryStatementThreshold()
    },
    async queryStatementThreshold(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        let data = await this.$$main.riskQueryCompanyWaterWarningSetting(this.form)
        data.investorOutSetting = data.investorOutSetting || 'N'
        data.todaySetting = data.todaySetting || 'N'
        data.noInvestorSetting = data.noInvestorSetting || 'N'
        this.form = data
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onSaveClick(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.riskSaveCompanyWaterWarningSetting(this.form)
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryStatementThreshold()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted() {
  }
}
</script>
