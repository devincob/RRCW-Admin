<template>
  <x-page breadcrumb="auto" title="开票预警阈值">
    <el-row>
      <el-col :span="9">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>税管家商品</span>
          </div>
          <el-table
            :data="goodsList"
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            :border="true"
            :highlight-current-row="true"
            size="mini"
            style="width: 100%;">
            <el-table-column prop="goodsId" label="编号" width="80"/>
            <el-table-column prop="goodsName" label="名称" min-width="100"/>
            <el-table-column prop="goodsName" label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="queryThresholdInfo(scope.row)">阈值设置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <transition name="slide-fade">
        <el-col style="width: 650px" v-if="form && form.goodsId">
          <el-card class="box-card setting">
            <div slot="header" class="clearfix">
              <span>阈值设置</span>
            </div>
            <div style="margin-top: -10px">
              <el-form ref="form" :model="form" :rules="formRules" size="mini" label-width="140px">
                <div class="title">新开户站点阈值</div>
                <el-form-item label="新开户站点定义：" prop="newCompanyMonth">
                  <el-input v-model.number="form.newCompanyMonth" placeholder="0为不限制"/> 个月
                </el-form-item>
                <el-form-item label="单月开票限制：" prop="newMonthLimit">
                  <el-input v-model.number="form.newMonthLimit" placeholder="0为不限制"/> 元
                </el-form-item>
                <el-form-item label="自然季度开票限制：" prop="newQuarterLimit">
                  <el-input v-model.number="form.newQuarterLimit" placeholder="0为不限制"/> 元
                </el-form-item>
                <el-form-item label="累计开票限制1：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="newTotalMonth1">
                      <el-input style="width: 58.5%" v-model.number="form.newTotalMonth1" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="newTotalMonthLimit1">
                      <el-input style="width: 75%" v-model.number="form.newTotalMonthLimit1" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="累计开票限制2：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="newTotalMonth2">
                      <el-input style="width: 58.5%" v-model.number="form.newTotalMonth2" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="newTotalMonthLimit2">
                      <el-input style="width: 75%" v-model.number="form.newTotalMonthLimit2" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="累计开票限制3：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="newTotalMonth3">
                      <el-input style="width: 58.5%" v-model.number="form.newTotalMonth3" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="newTotalMonthLimit3">
                      <el-input style="width: 75%" v-model.number="form.newTotalMonthLimit3" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="预警阈值：" prop="newThreshold">
                  <el-input v-model.number="form.newThreshold" placeholder="默认90%进入预警阶段"/> %
                </el-form-item>
                <el-form-item v-if="goodsItem.goodsName.indexOf('B') === -1" label="代开是否受限：">
                  <el-checkbox v-model="form.newIsRestrict" true-label="Y" false-label="N">限制</el-checkbox>
                </el-form-item>
                <hr/>
                <div class="title">非新开户站点阈值</div>
                <el-form-item label="单月开票限制：" prop="oldMonthLimit">
                  <el-input v-model.number="form.oldMonthLimit" placeholder="0为不限制"/> 元
                </el-form-item>
                <el-form-item label="自然季度开票限制：" prop="oldQuarterLimit">
                  <el-input v-model.number="form.oldQuarterLimit" placeholder="0为不限制"/> 元
                </el-form-item>
                <el-form-item label="自然年度开票限制：" prop="oldYearLimit">
                  <el-input v-model.number="form.oldYearLimit" placeholder="0为不限制"/> 元
                </el-form-item>
                <el-form-item label="累计开票限制1：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="oldTotalMonth1">
                      <el-input style="width: 58.5%" v-model.number="form.oldTotalMonth1" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="oldTotalMonthLimit1">
                      <el-input style="width: 75%" v-model.number="form.oldTotalMonthLimit1" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="累计开票限制2：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="oldTotalMonth2">
                      <el-input style="width: 58.5%" v-model.number="form.oldTotalMonth2" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="oldTotalMonthLimit2">
                      <el-input style="width: 75%" v-model.number="form.oldTotalMonthLimit2" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="累计开票限制3：" style="margin-bottom: 0">
                  <el-col style="width: 55%;padding: 0;">
                    <el-form-item prop="oldTotalMonth3">
                      <el-input style="width: 58.5%" v-model.number="form.oldTotalMonth3" placeholder="0为不限制"/> 个月 ，开票限制
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 45%;padding: 0 3px;">
                    <el-form-item prop="oldTotalMonthLimit3">
                      <el-input style="width: 75%" v-model.number="form.oldTotalMonthLimit3" placeholder="0为不限制"/> 元
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="预警阈值：" prop="oldThreshold">
                  <el-input v-model.number="form.oldThreshold" placeholder="默认90%进入预警阶段"/> %
                </el-form-item>
                <el-form-item v-if="goodsItem.goodsName.indexOf('B') === -1" label="代开是否受限：">
                  <el-checkbox v-model="form.oldIsRestrict" true-label="Y" false-label="N">限制</el-checkbox>
                </el-form-item>
              </el-form>
              <el-button size="small" type="primary" @click="onSaveClick">保存</el-button>
            </div>
          </el-card>
        </el-col>
      </transition>
    </el-row>
  </x-page>
</template>

<script>
export default {
  name: 'invoice-threshold',
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
    const zero2hundred = (rule, value, callback) => {
      if (!value || value === '') {
        callback()
      } else if (!/^100$|^(\d|[1-9]\d)$/.test(value)) {
        callback(new Error('必须为0-100之间的整数'))
      } else {
        callback()
      }
    }
    return {
      goodsList: [],
      goodsItem: {},
      loading: false,
      form: {
        goodsId: '',
        newCompanyMonth: '', // 新站点限制
        newMonthLimit: '', // 新站点单月开票限制
        newQuarterLimit: '', // 新站点季度开票限制
        // newSumLimit: '', // 新站点累计开票限制
        newThreshold: '', // 新站点预警阈值
        newTotalMonth1: '', // 新站点累计开票月数1
        newTotalMonthLimit1: '', // 新站点累计开票限制1
        newTotalMonth2: '', // 新站点累计开票月数2
        newTotalMonthLimit2: '', // 新站点累计0开票限制2
        newTotalMonth3: '', // 新站点累计开票月数3
        newTotalMonthLimit3: '', // 新站点累计开票限制3
        newIsRestrict: 'N', // 新站点是否受限
        oldMonthLimit: '', // 单月开票限制
        oldQuarterLimit: '', // 季度开票限制
        oldYearLimit: '', // 年度开票限制
        oldThreshold: '', // 预警阈值
        oldTotalMonth1: '', // 累计开票月数1
        oldTotalMonthLimit1: '', // 累计开票限制1
        oldTotalMonth2: '', // 累计开票月数2
        oldTotalMonthLimit2: '', // 累计开票限制2
        oldTotalMonth3: '', // 累计开票月数3
        oldTotalMonthLimit3: '', // 累计开票限制3
        oldIsRestrict: 'N' // 站点是否受限
      },
      formRules: {
        newCompanyMonth: [{validator: trainAmount, trigger: 'change'}],
        newMonthLimit: [{validator: trainAmount, trigger: 'change'}],
        newQuarterLimit: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonth1: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonthLimit1: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonth2: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonthLimit2: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonth3: [{validator: trainAmount, trigger: 'change'}],
        newTotalMonthLimit3: [{validator: trainAmount, trigger: 'change'}],
        newThreshold: [{validator: zero2hundred, trigger: 'change'}],
        oldMonthLimit: [{validator: trainAmount, trigger: 'change'}],
        oldQuarterLimit: [{validator: trainAmount, trigger: 'change'}],
        oldYearLimit: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonth1: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonthLimit1: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonth2: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonthLimit2: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonth3: [{validator: trainAmount, trigger: 'change'}],
        oldTotalMonthLimit3: [{validator: trainAmount, trigger: 'change'}],
        oldThreshold: [{validator: zero2hundred, trigger: 'change'}]
      }
    }
  },
  methods: {
    onPageShow(){
      this.queryGoodsList()
    },
    onPageHide(){
      this.init()
    },
    async queryGoodsList(){
      try {
        this.loading = true
        this.goodsList = await this.$$main.commonListGoods()
      } catch (e) {
        this.goodsList = []
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async queryThresholdInfo(row){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.goodsItem = row
        let data = await this.$$main.riskQueryGoodsIovoiceWarningSetting({
          goodsId: row.goodsId
        })
        data.goodsId = data.goodsId || row.goodsId
        data.newIsRestrict = data.newIsRestrict || 'N'
        data.oldIsRestrict = data.oldIsRestrict || 'N'
        this.form = data
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate()
        })
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
        await this.$$main.riskSaveGoodsIovoiceWarningSetting(this.form)
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryThresholdInfo(this.goodsItem)
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    init(){
      this.form = {
        goodsId: '',
        newCompanyMonth: '', // 新站点限制
        newMonthLimit: '', // 新站点单月开票限制
        newQuarterLimit: '', // 新站点季度开票限制
        // newSumLimit: '', // 新站点累计开票限制
        newThreshold: '', // 新站点预警阈值
        newTotalMonth1: '', // 新站点累计开票月数1
        newTotalMonthLimit1: '', // 新站点累计开票限制1
        newTotalMonth2: '', // 新站点累计开票月数2
        newTotalMonthLimit2: '', // 新站点累计0开票限制2
        newTotalMonth3: '', // 新站点累计开票月数3
        newTotalMonthLimit3: '', // 新站点累计开票限制3
        newIsRestrict: 'N', // 新站点是否受限
        oldMonthLimit: '', // 单月开票限制
        oldQuarterLimit: '', // 季度开票限制
        oldYearLimit: '', // 年度开票限制
        oldThreshold: '', // 预警阈值
        oldTotalMonth1: '', // 累计开票月数1
        oldTotalMonthLimit1: '', // 累计开票限制1
        oldTotalMonth2: '', // 累计开票月数2
        oldTotalMonthLimit2: '', // 累计开票限制2
        oldTotalMonth3: '', // 累计开票月数3
        oldTotalMonthLimit3: '', // 累计开票限制3
        oldIsRestrict: 'N' // 站点是否受限
      }
    }
  },
  mounted() {
  }
}
</script>
