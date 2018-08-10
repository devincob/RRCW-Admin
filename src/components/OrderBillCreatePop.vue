<template>
  <el-popover
    popperClass="order-bill-create-pop"
    placement="bottom"
    trigger="hover">
    <div v-if="!loading && !url">点击生成{{types[billType || 'N']}}</div>
    <div v-else-if="loading">
      <i class="el-icon-loading"></i>
      <div>正在生成{{types[billType || 'N']}}</div>
    </div>
    <div v-else>
      <a :href="`${$config.getImageUrlPath()}${url.pdfPath}`" target="_blank">
        <el-button size="mini">下载{{types[billType || 'N']}}</el-button>
      </a>
    </div>
    <el-button :type="btnType || ''" :size="btnSize || 'mini'" slot="reference" @click="createOrderBill">生成{{types[billType || 'N']}}</el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'OrderBillCreatePop',
  props: ['billType', 'orderId', 'orderType', 'btnType', 'btnSize'],
  data(){
    return {
      loading: false,
      types: {
        P: '付款单',
        S: '下单表',
        N: ''
      },
      url: ''
    }
  },
  methods: {
    async createOrderBill(){
      try {
        this.loading = true
        this.url = await this.$$main.orderBillCreate({
          billType: this.billType, // 单据类型（P:付款单，S：供应商下单）
          orderId: this.orderId, // 订单号
          orderType: this.orderType // 订单类型（A/I）
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
  .order-bill-create-pop{
    div{
      text-align: center;
    }
  }
</style>
