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
      :title="typeText[type].title"
      modal-append-to-body
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      :visible.sync="dialogDismissDisplay"
      :close-on-click-modal="false"
      width="550px"
      custom-class="dialogDismissDisplay"
      center>
      <el-form ref="dismissForm" :model="dismissForm" :rules="dismissRules" size="small" label-width="70px">
        <el-form-item :label="typeText[type].label" prop="reason">
          <el-input ref="reasonInput" type="textarea" :rows="4" :placeholder="`请输入${typeText[type].placeholder}原因及对应需要调整的工资，输入完成后系统将自动生成订单事件，但不做工资调整。`" v-model.trim="dismissForm.reason"/>
        </el-form-item>
        <el-form-item style="margin-top: 25px;text-align: center" label-width="0px">
          <el-button size="medium" style="margin-right: 10px" @click="dialogDismissDisplay = false">取消</el-button>
          <el-button size="medium" type="primary" style="margin-left: 10px" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: 'sub-order-dismiss-dialog',
  data() {
    return {
      dialogDismissDisplay: false,
      dismissForm: {
        orderSubId: '',
        reason: ''
      },
      typeText: {
        A: {
          title: '企业退工',
          placeholder: '企业退工',
          label: '退工原因'
        },
        C: {
          title: '兼职取消(旷工)',
          placeholder: '兼职取消',
          label: '旷工原因'
        }
      },
      dismissRules: {
        reason: [
          { required: true, message: '请填写原因及对应需要调整的工资', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    type: {default: 'A'},
    btnType: {default: 'danger'},
    btnSize: {default: 'small'},
    orderSubId: {default: ''},
    showBtn: {default: true}
  },
  methods: {
    show(){
      this.dismissForm = {
        orderSubId: this.orderSubId,
        reason: ''
      }
      this.dialogDismissDisplay = true
      this.$nextTick(() => {
        this.$refs['dismissForm'].clearValidate()
        this.$refs['reasonInput'].focus()
      })
    },
    onSubmit(){
      this.$refs['dismissForm'].validate((valid) => {
        if (valid) {
          this.type === 'A' && this.doDismiss()
          this.type === 'C' && this.onAbsenteeism()
        }
      })
    },
    async doDismiss(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: this.dialogDismissDisplay ? '.dialogDismissDisplay' : 'body'
      })
      try {
        await this.$$main.orderDoNoNeed(this.dismissForm)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('success')
        this.dialogDismissDisplay = false
      } catch (e) {
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onAbsenteeism(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: this.dialogDismissDisplay ? '.dialogDismissDisplay' : 'body'
      })
      try {
        await this.$$main.orderDoNoWork(this.dismissForm)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('success')
        this.dialogDismissDisplay = false
      } catch (e) {
        this.$emit('error', e)
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
<style lang="scss">
  .dialogDismissDisplay{
    .el-dialog__body{
      padding: 25px 25px 15px;
    }
  }
</style>
