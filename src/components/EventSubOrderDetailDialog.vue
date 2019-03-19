<template>
  <span>
    <el-button
      :type="btnType"
      :size="btnSize"
      v-show="showBtn"
      @click="show">
      <slot>{{btnText}}</slot>
    </el-button>
    <el-dialog
      v-drag-dialog="{reset: true}"
      custom-class="order-event-suborder-detail-dialog"
      :close-on-click-modal="false"
      close-on-press-escape
      modal-append-to-body
      append-to-body
      :visible.sync="detailDialogVisible">
      <sub-order-detail ref="detailInfoDialog" :type="type" :order-sub-id="dialogOrderSubId" :event-info="info"/>
    </el-dialog>
  </span>
</template>
<script>
import SubOrderDetail from './SubOrderDetail'
export default {
  name: 'event-sub-order-detail-dialog',
  components: {SubOrderDetail},
  data() {
    return {
      dialogOrderSubId: '',
      detailDialogVisible: false
    }
  },
  props: {
    btnType: {default: 'text'},
    btnSize: {default: 'mini'},
    info: {default: () => { return {} }},
    showBtn: {default: true},
    btnText: {default: '详情'},
    type: {default: 'E'}
  },
  methods: {
    show(){
      this.dialogOrderSubId = this.info.orderSubId || 0
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs['detailInfoDialog'].querySubOrderDetails()
      })
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
  .order-event-suborder-detail-dialog{
    width: 800px;
    .el-dialog__header{
      position: fixed;
      height: 46px;
      width: 800px;
      padding: 0;
      .el-dialog__headerbtn{
        top: 15px;
      }
    }
    .el-dialog__body{
      padding: 0;
    }
  }
</style>
