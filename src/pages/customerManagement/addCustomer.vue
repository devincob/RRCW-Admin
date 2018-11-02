<template>
  <x-page :breadcrumb="breadcrumb"  :title="pageText">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="mini">
        <el-form-item label="客户编号">
          <el-col :span="6">
            <el-input disabled :placeholder="ruleForm.customerId > 0 ? ruleForm.customerId : '系统自动生成' "></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-col :span="6">
            <el-input v-model="ruleForm.customerName" placeholder="请填写客户姓名"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户手机" prop="phone">
          <el-col :span="6">
            <el-input v-model="ruleForm.phone" placeholder="请填写客户电话"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户邮箱">
          <el-col :span="6">
            <el-input v-model="ruleForm.email" type="email" placeholder="请填写客户邮箱"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="家庭地址">
          <el-col :span="6">
            <el-input v-model="ruleForm.liveAddress" placeholder="请填写您的家庭地址"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="办公地址">
          <el-col :span="6">
            <el-input v-model="ruleForm.workAddress" placeholder="请填写您的办公地址"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户生日">
          <el-col :span="6">
            <el-input v-model="ruleForm.birthday" placeholder="生日格式：1999-01-01"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="渠道商列表"  prop="source">
          <el-select v-model="ruleForm.source" placeholder="请选择客户来源" @change="selectChannel">
            <el-option
              v-for="(item, index) in channelList"
              :key=index
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择客户状态">
            <el-option label="正常" value="N"></el-option>
            <el-option label="禁用" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            placeholder="请选择所属部门"
            v-model="selectedOptions"
            :show-all-levels="false"
            :options="depts">
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属商务人员" prop="belongAdminUserId">
          <el-select v-model="ruleForm.belongAdminUserId" placeholder="请选择所属商务人员" @change="selectBelong">
            <el-option
              v-for="(item, index) in roles"
              :key=index
              :label="item.userName"
              :value="item.adminUserId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-col :span="6">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="ruleForm.remark" placeholder="请备注一下…"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading.fullscreen.lock="fullScreenLoading" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </x-page>
</template>
<script>
const findParentDeptId = (list, deptId) => {
  const s = list.filter(item => item.deptId === deptId)
  let ids = []
  if (s && s.length) {
    ids.push(s[0].deptId)
    if (s[0].parentDeptId) {
      ids = [...findParentDeptId(list, s[0].parentDeptId), ...ids]
    }
  }
  if (ids.length > 3) {
    ids.shift()
  }
  return ids
}
export default {
  name: 'add_customer',
  data() {
    return {
      selectedOptions: null,
      depts: [],
      deptList: [],
      fullScreenLoading: false,
      pageText: '',
      roles: [],
      channelList: [],
      ruleForm: {
        customerId: 0,
        customerName: '',
        phone: '',
        email: '',
        liveAddress: '',
        workAddress: '',
        birthday: '',
        source: 0, // 来源(直属:0;渠道:...)
        status: '',
        deptId: '',
        belongAdminUserId: '', // 所属商务编号
        remark: ''
      },
      rules: {
        customerName: [
          {required: true, message: '请输入客户姓名', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '电话号码不能为空', trigger: 'change'},
          {required: true, message: '请输入正确的电话号码', pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, trigger: 'change'}
        ],
        // email: [
        //   {required: true, message: '电子邮件不能为空', trigger: 'change'},
        //   {type: 'email', required: true, message: '请输入正确的电子邮件', trigger: 'change'}
        // ],
        // liveAddress: [
        //   {required: true, message: '请填写您的家庭地址', trigger: 'change'}
        // ],
        // workAddress: [
        //   {required: true, message: '请填写您的办公地址', trigger: 'change'}
        // ],
        // birthday: [
        //   {required: false, message: '请填写生日', trigger: 'change'}
        // ]
        source: [
          {required: true, message: '请选择客户来源', trigger: ['blur', 'change']}
        ],
        status: [
          {required: true, message: '请选择客户状态', trigger: ['blur', 'change']}
        ],
        deptId: [
          {required: true, message: '请选择部门', trigger: 'change'}
        ],
        belongAdminUserId: [
          {required: true, message: '请选择所属商务人员', trigger: 'change'}
        ],
        remark: [
          {required: false, message: '请填写备注', trigger: 'change'}
        ]
      }
    }
  },
  watch: {
    selectedOptions(val){
      this.ruleForm.deptId = val[val.length - 1]
    }
  },
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '客户管理', id: 0},
        {path: '', title: this.ruleForm.customerId ? '编辑客户' : '新增客户', id: 1}
      ]
    }
  },
  methods: {
    async loadDetails(customerId) {
      try {
        this.fullScreenLoading = true
        const detialInfo = await this.$$main.customerDetail({
          customerId: customerId
        })
        detialInfo.birthday = detialInfo.showBirthday
        this.ruleForm = detialInfo
        this.ruleForm.source = detialInfo.source
        this.ruleForm.birthday = detialInfo.birthday === '' ? '' : this.$utils.dateFormat(detialInfo.birthday, 'yyyy-MM-dd')
        this.selectedOptions = findParentDeptId(this.deptList, detialInfo.deptId)
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    async loadChannel(e) { // 所属商务人员列表
      try {
        this.channelList = [{channelId: 0, channelName: '直客'}, ...await this.$$main.commonListChannel({})]
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async loadRoles(e) { // 所属商务人员列表
      try {
        this.roles = await this.$$main.commonListBelongAdminUser({})
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    selectBelong(e) { // 所属商务人员列表
      this.ruleForm.belongAdminUserId = e
    },
    selectChannel(e) { // 所属渠道商列表列表
      this.ruleForm.source = e
    },
    async submitModify() {
      try {
        this.fullScreenLoading = true
        const data = await this.$$main.customerModify(this.ruleForm)
        this.fullScreenLoading = false
        if (data) {
          this.$message.success('保存成功！')
          if (!this.ruleForm.customerId){
            this.pageText = '编辑客户'
            this.ruleForm.customerId = data
            // this.loadDetails()
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    submitForm(formcustomerName) {
      this.$refs[formcustomerName].validate((valid) => {
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
        customerId: 0,
        customerName: '',
        phone: '',
        email: '',
        liveAddress: '',
        workAddress: '',
        birthday: '',
        source: 0, // 来源(直属:D;渠道:C)
        status: '',
        deptId: '',
        belongAdminUserId: '', // 所属商务编号
        remark: ''
      }
      this.$refs.ruleForm.resetFields()
      if (this.$route.query.customer_id) {
        const customerId = Number(this.$route.query.customer_id || 0)
        this.loadDetails(customerId)
      }
    }
  },
  mounted() {
    this.loadRoles()// 获取所属商务人员列表
    this.loadChannel()// 获取渠道列表
    const customerId = Number(this.$route.query.customer_id || 0)
    if (customerId === 0) {
      this.pageText = '新增客户'
    } else {
      this.pageText = '编辑客户'
    }
    this.$$main.commonListDept().then(res => { //  处理所属部门列表
      this.deptList = res
      const list = res && res.map(item => {
        return {
          id: item.deptId,
          pid: item.parentDeptId,
          label: item.deptName,
          value: item.deptId
        }
      })
      this.depts = this.$utils.listToTree(list, 'id', 'pid', 'children', list[0].id)
      if (customerId !== 0) {
        this.loadDetails(customerId)
      }
    })
  }
}
</script>
<style>
</style>
