<template>
  <span class="el-button el-button--text" style="padding: 0;border: none">
    <el-button
      :type="btnType"
      :size="btnSize"
      @click="show">
      <slot></slot>
    </el-button>
    <el-dialog
      title="订单日志"
      v-drag-dialog
      :visible.sync="orderLogListDialogDisplay"
      :close-on-click-modal="false"
      width="900px"
      custom-class="order-log-list-dialog"
      center>
        <el-table
          :data="orderLogList"
          size="mini"
          style="width: 100%;">
          <el-table-column prop="actionUserName" label="姓名" min-width="70"/>
          <el-table-column prop="actionUserRoleName" label="角色" min-width="70"/>
          <el-table-column prop="actionContent" label="操作内容" min-width="200"/>
          <el-table-column prop="actionTime" label="操作时间" min-width="100"/>
        </el-table>
      </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'order-log-dialog',
  props: {
    orderType: {default: 'A'},
    btnType: {default: 'text'},
    btnSize: {default: 'mini'},
    orderId: {default: ''}
  },
  watch: {
    orderLogListDialogDisplay(val){
      val && this.queryOrderLogList()
    }
  },
  data(){
    return {
      orderLogListDialogDisplay: false,
      orderLogList: []
    }
  },
  methods: {
    show(){
      this.orderLogListDialogDisplay = true
    },
    async queryOrderLogList(){
      try {
        this.orderLogList = await this.$$main.orderLogList({
          orderId: this.orderId,
          orderType: this.orderType
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    }
  }
}
</script>

<style scoped>
  .details-table {
    width: 100%;
    background-color: #dddddd;
    border-collapse:separate;
    border-spacing:1px 1px;
    table-layout: fixed;
    word-break:break-all;
  }
  .details-table td {
    border: 0;
    padding: 4px 6px;
    word-wrap: break-word;
    white-space: normal;
    vertical-align: baseline;
  }
  .td-label {
    text-align: right;
    width: 120px;
  }
</style>
