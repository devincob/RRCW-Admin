<template>
  <x-page :breadcrumb="breadcrumb"  :title="pageText">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="mini">
        <el-form-item label="渠道商编号">
          <el-col :span="6">
            <el-input disabled :placeholder="ruleForm.channelId > 0 ? ruleForm.channelId : '系统自动生成' "></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="渠道商名称" prop="channelName">
          <el-col :span="6">
            <el-input v-model="ruleForm.channelName" placeholder="请填写渠道商名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系人名称" prop="channelContact">
          <el-col :span="6">
            <el-input v-model="ruleForm.channelContact" placeholder="请填写渠道商联系人名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="渠道商电话" prop="channelPhone">
          <el-col :span="6">
            <el-input v-model="ruleForm.channelPhone" placeholder="请填写渠道商联系电话"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="渠道分成比例" prop="channelRatio">
          <el-col :span="6">
            <el-input type="number" v-model.number="ruleForm.channelRatio" :min='0' :step="1" placeholder="请填写0至100之间的整数"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="渠道状态" prop="channelStatus">
          <el-select v-model="ruleForm.channelStatus" placeholder="请选择渠道状态">
            <el-option label="正常" value="N"></el-option>
            <el-option label="禁用" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading.fullscreen.lock="fullScreenLoading" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </x-page>
</template>
<script>
export default {
  name: 'add_channel',
  data() {
    return {
      deptList: [],
      fullScreenLoading: false,
      pageText: '',
      ruleForm: {
        channelId: 0,
        channelName: '',
        channelContact: '',
        channelPhone: '',
        channelRatio: '',
        channelStatus: ''
      },
      rules: {
        channelName: [
          {required: true, message: '请输入渠道商名称', trigger: 'change'},
          {required: true, message: '渠道商名称请保持在50字之内', min: 0, max: 50, trigger: 'change'}
        ],
        channelContact: [
          {required: true, message: '请输入渠道商联系人名称', trigger: 'change'},
          {required: true, message: '渠道商联系人名称长度请保持在20字之内', min: 0, max: 20, trigger: 'change'}
        ],
        channelPhone: [
          {required: true, message: '请输入渠道商联系电话', trigger: 'change'},
          {required: true, message: '渠道商联系电话请保持在20字之内', min: 0, max: 20, trigger: 'change'}
        ],
        channelRatio: [
          { type: 'integer', required: true, min: 0, max: 100, message: '渠道分成比例为0-100之间的整数', trigger: 'change' }
        ],
        channelStatus: [
          {required: true, message: '请选择渠道状态', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  watch: {},
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '渠道管理', id: 0},
        {path: '', title: this.ruleForm.channelId ? '编辑渠道商' : '新增渠道商', id: 1}
      ]
    }
  },
  methods: {
    async loadDetails(getId) {
      try {
        this.fullScreenLoading = true
        this.ruleForm = await this.$$main.channelDetail({
          channelId: getId
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    async submitModify() {
      try {
        this.fullScreenLoading = true
        const data = await this.$$main.channelModify(this.ruleForm)
        this.fullScreenLoading = false
        if (data) {
          this.$message.success('保存成功！')
          if (!this.ruleForm.channelId){
            this.pageText = '编辑渠道商'
            this.ruleForm.channelId = data
            // this.loadDetails()
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    submitForm(formChannel) {
      this.$refs[formChannel].validate((valid) => {
        if (valid) {
          this.submitModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onPageShow(){
      this.ruleForm = {
        channelId: 0,
        channelName: '',
        channelPhone: '', // contactNumber
        channelRatio: '',
        channelStatus: ''
      }
      this.$refs.ruleForm.resetFields()
      if (this.$route.query.channel_id) {
        let getId = Number(this.$route.query.channel_id || 0)
        this.loadDetails(getId)
      }
    }
  },
  mounted() {
    const getId = Number(this.$route.query.channel_id || 0)
    if (getId === 0) {
      this.pageText = '新增渠道商'
    } else {
      this.pageText = '编辑渠道商'
    }
  }
}
</script>
<style>
</style>
