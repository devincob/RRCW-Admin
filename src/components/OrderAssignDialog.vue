<template>
  <span class="el-button" style="padding: 0;border: none">
    <el-button
      :type="btnType"
      :size="btnSize"
      v-show="showBtn"
      @click="show">
      <slot></slot>
    </el-button>
    <el-dialog
      v-drag-dialog="{reset: true}"
      :title="`订单${showText}`"
      modal-append-to-body
      append-to-body
      :visible.sync="dialogAssignDisplay"
      custom-class="assign-dialog"
      width="600px"
      close-on-press-escape
      :close-on-click-modal="false"
      center>
      <el-form ref="assignForm" :model="assignForm" size="small" :inline="true" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="assignForm.userNameCondition" placeholder="姓名" style="width: 120px;"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="assignForm.mobilePhoneCondition" placeholder="手机号码" style="width: 120px;"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAssignScreen">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="assignList"
        v-loading="assignLoading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column fixed prop="userName" label="姓名" min-width="120"/>
        <el-table-column prop="mobilePhone" label="手机号" min-width="120"/>
        <el-table-column class="text-center" width="60" minWidth="60" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-popover
              :ref="`popoveruser${scope.row.workerUserId}`"
              placement="top"
              width="160">
              <p>确定指派给 <span>{{scope.row.userName}}</span> 吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[`popoveruser${scope.row.workerUserId}`].doToggle()">取消</el-button>
                <el-button :loading="onAssignLoading" type="primary" size="mini" @click="onHandleAssign(scope, $refs[`popoveruser${scope.row.workerUserId}`])">确定</el-button>
              </div>
            </el-popover>
            <el-button
              size="mini"
              type="primary"
              v-popover="`popoveruser${scope.row.workerUserId}`">{{showText}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-size="assignForm.pageSize"
          :current-page="assignForm.pageIndex"
          layout="prev, pager, next"
          :total="totalAssignCount"
          @size-change="(size) => this.assignForm.pageSize = size"
          @current-change="(index) => this.assignForm.pageIndex = index">
        </el-pagination>
      </div>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: 'order-assign-dialog',
  data() {
    return {
      assignLoading: false,
      onAssignLoading: false,
      dialogAssignDisplay: false,
      totalAssignCount: 0,
      assignForm: {
        pageIndex: 1,
        pageSize: 10,
        userNameCondition: '',
        mobilePhoneCondition: ''
      },
      assignList: []
    }
  },
  props: {
    type: {default: 'A'},
    btnType: {default: ''},
    btnSize: {default: ''},
    orderSubId: {default: ''},
    orderId: {default: ''},
    showBtn: {default: true}
  },
  watch: {
    dialogAssignDisplay(val){
      if (val){
        this.queryAssignList()
      }
    },
    'assignForm.pageIndex': {
      handler: function(){
        this.queryAssignList()
      },
      deep: true
    }
  },
  computed: {
    showText(){
      return this.type === 'A' ? '指派' : '换人'
    }
  },
  methods: {
    show(){
      this.assignLoading = false
      this.onAssignLoading = false
      this.totalAssignCount = 0
      this.assignForm = {
        pageIndex: 1,
        pageSize: 10,
        userNameCondition: '',
        mobilePhoneCondition: ''
      }
      this.assignList = []
      this.dialogAssignDisplay = true
    },
    onAssignScreen(){
      if (this.assignForm.pageIndex === 1){
        this.queryAssignList()
      } else {
        this.assignForm.pageIndex = 1
      }
    },
    async queryAssignList() {
      try {
        if (this.assignLoading) {
          return
        }
        this.assignLoading = true
        const data = await this.$$main.orderQueryListWorker({
          orderSubId: this.orderSubId,
          isChange: this.type === 'A' ? 0 : 1,
          ...this.assignForm
        })
        this.assignLoading = false
        this.totalAssignCount = data.totalCount
        this.assignList = data.datas
      } catch (e){
        this.assignLoading = false
        e.message && this.$message.error(e.message)
      }
    },
    async onHandleAssign({row}, pop){
      try {
        this.onAssignLoading = true
        let id = ''
        if (this.type === 'A') {
          id = await this.$$main.orderDoApply({
            orderId: this.orderId,
            workerUserId: row.workerUserId
          })
        } else {
          id = await this.$$main.orderDoChangeWorker({
            orderSubId: this.orderSubId,
            workerUserId: row.workerUserId
          })
        }
        pop.doClose()
        this.onAssignLoading = false
        this.dialogAssignDisplay = false
        this.$emit('success', id)
      } catch (e){
        this.onAssignLoading = false
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      }
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
  .assign-dialog{
  }
</style>
