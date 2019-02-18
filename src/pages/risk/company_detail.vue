<template>
  <x-page title="站点信息" breadcrumb="auto">
    <el-card class="no-box-shadow" style="min-width:600px;min-height:1000px">
      <el-tabs type="border-card" class="no-box-shadow" v-model="actionName">
        <el-tab-pane name="base-info" label="站点基本信息">
          <company-base-info :companyId="companyId"/>
        </el-tab-pane>
        <el-tab-pane label="站点开票记录" name="billing-record">
          <company-billing-record :companyId="companyId"/>
        </el-tab-pane>
        <el-tab-pane label="站点流水记录" name="flow-record">
          <company-detail-water :companyId="companyId"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </x-page>
</template>

<script>
import CompanyDetailWater from './child_components/CompanyDetailWater'
import CompanyBillingRecord from './child_components/CompanyBillingRecord'
import CompanyBaseInfo from './child_components/CompanyBaseInfo'
export default {
  name: 'company-detail',
  components: {CompanyBaseInfo, CompanyBillingRecord, CompanyDetailWater},
  data(){
    return {
      actionName: 'base-info',
      companyId: 0,
      loading: false
    }
  },
  watch: {
    actionName(val) {
      location.hash = val
    }
  },
  methods: {
  },
  mounted(){
    const tabsName = ['base-info', 'billing-record', 'flow-record']
    let actionName = this.$route.hash
    if (actionName && actionName.indexOf('#') === 0) {
      actionName = actionName.substr(1)
      if (tabsName.indexOf(actionName) >= 0) {
        this.actionName = actionName
      }
    }
    if (this.$route.query) {
      let companyId = Number(this.$route.query.companyId)
      if (!isNaN(companyId)) this.companyId = companyId
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
