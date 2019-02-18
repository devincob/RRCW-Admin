<template>
  <table class="detail-table" v-if="companyInfo">
    <tr>
      <td>站点名称</td>
      <td>{{companyInfo.companyName || '-'}}</td>
      <td>所属客户</td>
      <td>{{companyInfo.customerName || '-'}}</td>
    </tr>
    <tr>
      <td>法人</td>
      <td>{{companyInfo.investorName || '-'}}</td>
      <td>所属商务</td>
      <td>{{companyInfo.bussinessName || '-'}}</td>
    </tr>
    <tr>
      <td>商品</td>
      <td>{{companyInfo.goodsName || '-'}}</td>
      <td>税源地</td>
      <td>{{companyInfo.sourceTaxName || '-'}}</td>
    </tr>
    <tr>
      <td>站点类型</td>
      <td>{{companyInfo.companyTypeName || '-'}}</td>
      <td>注册日期</td>
      <td>{{companyInfo.showCreateTime || '-'}}</td>
    </tr>
    <tr>
      <td>状态</td>
      <td>{{statusText[companyInfo.status]}}</td>
      <td></td>
      <td></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'CompanyBaseInfo',
  props: {
    companyId: Number
  },
  data(){
    return {
      statusText: {A: '全部', N: '正常', D: '禁用'},
      companyInfo: null
    }
  },
  watch: {
    companyId(val){
      val && this.loadBaseInfo()
    }
  },
  methods: {
    async loadBaseInfo(){
      try {
        this.companyInfo = await this.$$main.companyDetail({
          companyId: this.companyId
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted(){
    this.companyId && this.loadBaseInfo()
  }
}
</script>

<style scoped>

</style>
