<template>
  <div class="order-items" v-if="orders && orders.length">
    <div class="order-item" v-for="order in orders" :key="order.orderSubId">
      <div class="info">
        <span>姓名：{{order.workerName}}</span>
        <span>手机：<a :href="'tel:' + order.workerMobile">{{order.workerMobile}}</a></span>
      </div>
      <div class="status">上班提醒状态：{{statusText[order.showStatus]}}</div>
      <div class="overTime" v-if="order.showStatus > 3">{{statusText[order.showStatus]}}时间：{{order.overTime}}</div>
    </div>
  </div>
  <div class="orders-empty" v-else>暂无数据</div>
</template>

<script>
export default {
  name: 'working-status-h5',
  data(){
    return {
      orderId: 0,
      orders: [],
      statusText: ['无', '正常', '路上', '鸽子', '平台取消', '企业取消', '工人取消']
    }
  },
  methods: {
    async loadList(){
      try {
        this.orders = await this.$$main.orderQueryReport({
          orderId: this.$route.query.orderId
        })
      } catch (e) {
        e && e.message && alert(e.message)
      }
    }
  },
  mounted(){
    this.loadList()
  }
}
</script>

<style lang="scss" scoped>
  .order-items {
    .order-item {
      line-height: 26px;
      padding: 10px;
      border-bottom: 1px #dddddd solid;
      font-size: 16px;
      .info {
        display: flex;
        justify-content: space-between;
      }
      .status {}
      .overTime {
        color: #909399;
      }
    }
  }
  .orders-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50%;
    font-size: 18px;
    color: #787878;
  }
</style>
<style>
  #x-page-working-status-h5 #app {
    min-width: initial;
  }
</style>
