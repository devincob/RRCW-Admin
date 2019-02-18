<template>
  <x-page breadcrumb="auto" title="账户管理">
    <el-card class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 10px">
      <!--<span slot="header">管理员账号列表</span>-->
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline clearfix">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.userName" placeholder="请输入姓名查找"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button @click="onAddAccountClick" type="primary">添加账号</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="users"
                v-loading="loading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                stripe
                @sort-change="onSortChange"
                size="mini"
                style="width: 100%;border-top:1px #eee solid">
        <el-table-column label="ID" prop="adminUserId" width="100"/>
        <el-table-column label="登录名" prop="loginName" width="100"/>
        <el-table-column label="姓名" prop="userName" width="100"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="邮箱" prop="userMail"/>
        <el-table-column label="角色" prop="roleName"/>
        <el-table-column label="状态" prop="status">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.status === 'N',
                'text-danger':scope.row.status === 'D'
                }">
            {{statusText[scope.row.status]}}
          </span>
        </el-table-column>
        <el-table-column sortable="custom" sort-by="createTime" label="创建时间" prop="showCreateTime"/>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onEditClick(scope.row)">编辑</el-button>
            <!--<el-button type="text" size="mini" class="no-padding" @click="onRemoveClick(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          :current-page.sync="pageIndex"
          @size-change="(size) => this.pageSize = size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <!-- 管理员 编辑/创建 表单 -->
    <el-dialog v-drag-dialog
               width="500px"
               :title="(dialogForm.adminUserId ? '编辑管理员['+dialogForm.userName+']': '创建管理员账号')"
               :visible.sync="centerDialogVisible">
      <el-form ref="form" @submit.native.prevent="onDialogFormSubmit" :model="dialogForm" size="small" label-width="80px">
        <el-form-item label="登录名" prop="loginName" :rules="{required: true, message: '登录名为必填项'}">
          <el-input v-model="dialogForm.loginName" placeholder="登录名"/>
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd" :rules="{required: !dialogForm.adminUserId, message: '登录名为必填项'}">
          <el-input v-model="dialogForm.loginPwd" :placeholder="'登录密码' + (dialogForm.adminUserId ? '，留空不修改':'')"/>
        </el-form-item>
        <el-form-item label="姓名" prop="userName" :rules="{required: true, message: '姓名为必填项'}">
          <el-input v-model="dialogForm.userName" placeholder="真实姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" :rules="{required: true, message: '手机号码为必填项'}">
          <el-input v-model="dialogForm.mobile" placeholder="联系电话"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="userMail" :rules="{required: true, message: '电子邮箱为必填项'}">
          <el-input v-model="dialogForm.userMail" placeholder="联系邮箱"/>
        </el-form-item>
        <el-form-item label="部门" prop="deptId" :rules="{required: true, message: '部门为必选项'}">
          <el-cascader
            v-model="selectedOptions"
            :show-all-levels="false"
            :options="depts">
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="adminRoleId" :rules="{required: true, message: '角色为必选项'}">
          <el-select placeholder="请选择一个角色" v-model="dialogForm.adminRoleId">
            <el-option v-for="(item, index) in roles" :key="index" :value="item.adminRoleId" :label="item.adminRoleName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dialogForm.status">
            <el-option v-for="(status, key) in statusText" :key="key" :label="status" :value="key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">立即{{dialogForm.adminUserId ? '保存' : '创建'}}</el-button>
          <el-button @click="centerDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </x-page>
</template>

<script>
const formDefaultData = {
  adminUserId: 0,
  loginName: '',
  userName: '',
  loginPwd: '',
  userMail: '',
  mobile: '',
  status: 'N',
  adminRoleId: null,
  deptId: null
}

const findParentDeptId = (list, deptId) => {
  const s = list.filter(item => item.deptId === deptId)
  let ids = []
  if (s && s.length) {
    ids.push(deptId)
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
  name: 'accounts',
  data(){
    return {
      centerDialogVisible: false,
      dialogForm: {...formDefaultData},
      loading: false,
      users: [],
      roles: [],
      depts: [],
      deptList: [],
      totalCount: 0,
      searchForm: {
        userName: ''
      },
      pageSize: 15,
      pageIndex: 1,
      sorts: {
        sortType: 'D',
        sortName: 'createTime'
      },
      statusText: {N: '正常', D: '禁用'},
      selectedOptions: null
    }
  },
  watch: {
    pageIndex(){
      this.loadAdmins()
    },
    pageSize(){
      this.loadAdmins()
    },
    centerDialogVisible(val){
      if (!val) {
        // 重置表单数据
        this.dialogForm = {...formDefaultData}
        this.selectedOptions = []
        // 重置表单验证状态
        this.$refs.form.resetFields()
      }
    },
    selectedOptions(val){
      console.log(val, val[val.length - 1])
      this.dialogForm.deptId = val[val.length - 1]
    }
  },
  methods: {
    async loadRoles(){
      try {
        const roles = await this.$$main.roleList()
        this.roles = roles.map(item => {
          return {
            edit: false,
            adminRoleId: item.adminRoleId,
            adminRoleName: item.adminRoleName
          }
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onSearchClick(){
      this.loadAdmins()
    },
    async onEditClick(row){
      // Object.keys(row).forEach(key => {
      //   if (['createTime', 'formatCreateTime', 'loginPwd', 'adminRoleName', 'adminRoleNames', 'adminRoleIds'].indexOf(key) === -1) adminInfo[key] = row[key]
      // })
      //
      // adminInfo.loginPwd = ''
      try {
        const adminInfo = await this.$$main.adminUserDetail({
          adminUserId: row.adminUserId
        })
        this.selectedOptions = findParentDeptId(this.deptList, adminInfo.deptId)
        this.dialogForm = {
          adminUserId: adminInfo.adminUserId,
          loginName: adminInfo.loginName,
          userName: adminInfo.userName,
          loginPwd: adminInfo.loginPwd,
          userMail: adminInfo.userMail,
          mobile: adminInfo.mobile,
          status: adminInfo.status,
          adminRoleId: adminInfo.roleId,
          deptId: adminInfo.deptId
        }
        this.centerDialogVisible = true
      } catch (e) {
        console.log(e)
      }
    },
    // async onRemoveClick(row){
    //   try {
    //     console.log(row)
    //     await this.$confirm(`你确定要删除管理员 ${row.loginName}(${row.userName}) 吗？`, '删除确认')
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    onAddAccountClick(){
      this.centerDialogVisible = true
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      } else {
        this.sorts = {
          sortType: 'D',
          sortName: 'createTime'
        }
      }
      this.loadAdmins()
    },
    async onDialogFormSubmit(){
      let loader
      try {
        const isValid = await this.$refs.form.validate()
        if (isValid) {
          console.log(this.dialogForm)
        }
        loader = this.$loading({
          target: this.$refs.form.$el,
          text: '正在保存信息'
        })
        const result = await this.$$main.adminUserModify({
          ...this.dialogForm,
          roleId: this.dialogForm.adminRoleId,
          deptId: this.dialogForm.deptId
        })
        if (result) {
          this.$message.success('保存成功')
          this.centerDialogVisible = false
        }
        this.loadAdmins()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
        console.log(e)
      } finally {
        if (loader) loader.close()
      }
    },
    async loadAdmins(){
      this.loading = true
      try {
        const data = await this.$$main.adminUserList({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          userName: this.searchForm.userName,
          sorts: this.sorts
        })
        this.totalCount = data.totalCount
        this.users = data.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  },
  mounted(){
    this.loadAdmins()
    this.loadRoles()
    this.$$main.commonListDept().then(res => {
      this.deptList = res
      const list = res.map(item => {
        return {
          id: item.deptId,
          pid: item.parentDeptId,
          label: item.deptName,
          value: item.deptId
        }
      })
      this.depts = this.$utils.listToTree(list, 'id', 'pid', 'children', list[0].id)
    })
  }
}
</script>

<style scoped>

</style>
