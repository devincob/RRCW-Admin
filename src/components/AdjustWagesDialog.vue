<template>
  <el-dialog
    title="调整工资"
    :visible.sync="dialogAdjustWagesDisplay"
    :close-on-click-modal="false"
    width="500px"
    custom-class="dialogAdjustWagesDisplay"
    center
    v-drag-dialog="{reset: true}"
    close-on-press-escape
    >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="调整工资金额" prop="changeAmount">
        <el-input v-model="form.changeAmount" placeholder="请输入需要调整的额度，增加为正数，减少为负数"/>
      </el-form-item>
      <el-form-item label="调整工资原因" prop="changeReason">
        <el-input v-model="form.changeReason" type="textarea" :rows="4" placeholder="请输入事件记录内容" />
        <div v-if="form.changeAmount > 0">
          <el-button @click="onReasonClick(i)" size="mini" v-for="(i, index) in addReason" :key="index">{{i}}</el-button>
        </div>
        <div v-if="form.changeAmount < 0">
          <el-button @click="onReasonClick(i)" size="mini" v-for="(i, index) in delReason" :key="index">{{i}}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="dialogAdjustWagesDisplay = false">取 消</el-button>
    <el-button size="medium" type="primary" @click="onSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'adjust-wages-dialog',
  data() {
    const number = (rule, value, callback) => {
      if (!/\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?/g.test(value)) {
        callback(new Error('调整金额必须是数字'))
      } else {
        callback()
      }
    }
    return {
      dialogAdjustWagesDisplay: false,
      form: {
        changeAmount: '',
        changeReason: ''
      },
      rules: {
        changeAmount: [
          { required: true, message: '请输入调整工资的金额', trigger: 'change' },
          { validator: number, message: '调整金额必须是数字', trigger: 'change' }
        ],
        changeReason: [
          { required: true, message: '请输入调整工资原因', trigger: 'change' }
        ]
      },
      addReason: ['加班工资', '企业奖励', '平台奖励', '项目提成', '平台补贴'],
      delReason: ['迟到扣薪', '早退扣薪', '鸽子', '平台调整', '企业调整']
    }
  },
  props: {
    orderSubId: String
  },
  methods: {
    show(){
      if (!this.orderSubId) {
        this.$message.error('子订单Id不能为空')
        return
      }
      this.form = {
        changeAmount: '',
        changeReason: ''
      }
      this.dialogAdjustWagesDisplay = true
    },
    onReasonClick(text){
      if (this.form.changeReason && this.form.changeReason !== '') {
        this.form.changeReason += `，${text}`
      } else {
        this.form.changeReason += text
      }
    },
    onSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.onHandleAdjustSub()
        }
      })
    },
    async onHandleAdjustSub(){
      const loading = this.$loading({
        text: '正在提交',
        spinner: 'el-icon-loading',
        target: this.dialogAdjustWagesDisplay ? '.dialogAdjustWagesDisplay' : 'body'
      })
      try {
        await this.$$main.orderDoChangeCreate({
          orderSubId: this.orderSubId,
          ...this.form
        })
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('success')
        this.dialogAdjustWagesDisplay = false
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
<style lang="scss" scoped>
  .dialogAdjustWagesDisplay{
    .el-button{
      margin: 5px 10px 0 0;
    }
  }
</style>
