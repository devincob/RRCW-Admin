<template>
  <x-page breadcrumb="auto" title="客户列表">
    <el-card class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 10px">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline clearfix">
        <el-form-item label="">
        <el-select v-model="searchForm.conditionKey" placeholder="按客户姓名查找">
          <el-option label="按客户姓名查找" value="customerName"></el-option>
          <el-option label="按客手机号查找" value="phone"></el-option>
        </el-select>
        <el-form-item label="">
          <el-input v-model="searchForm.conditionValue"  :placeholder="searchForm.conditionKey === 'phone' ? '请输入手机号码' : '请输入客户的名称' "/>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
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
        <el-table-column label="客户编号" align="center" prop="customerId"  width="80" fixed />
        <el-table-column label="客户来源" prop="channelName" align="center"  width="100" />
        <el-table-column label="姓名" prop="customerName" align="center"  width="100"/>
        <el-table-column label="手机号" prop="phone" align="center"  width="150"/>
        <el-table-column label="邮箱" prop="email" align="center"  width="150"/>
        <el-table-column label="家庭地址" prop="liveAddress" align="center" />
        <el-table-column label="生日" prop="showBirthday" align="center"  width="150">
          <span slot-scope="scope" v-if="scope.row.showBirthday">
              {{$utils.dateFormat(scope.row.showBirthday, 'yyyy-MM-dd')}}
          </span>
        </el-table-column>>
        <el-table-column label="办公地址" prop="workAddress" align="center"/>
        <el-table-column label="状态" prop="status" align="center">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.status === 'N',
                'text-danger':scope.row.status === 'D'
                }">
            {{statusText[scope.row.status]}}
          </span>
        </el-table-column>
        <el-table-column label="创建时间" prop="showCreateTime" width="150" align="center"/>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onDisabledClick(scope.row)"
                       v-html="scope.row.status === 'D' ? '正常' : '禁用'">
            </el-button>
            <router-link :to="`/customerManagement/addCustomer?customer_id=${scope.row.customerId}`" target="_blank">编辑</router-link>
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
  </x-page>
</template>

<script>
const formDefaultData = {
  adminUserId: 0,
  customerId: 0,
  customerName: '',
  loginPwd: '',
  email: '',
  showBirthday: '',
  liveAddress: '',
  workAddress: '',
  phone: '',
  status: 'N',
  belongAdminUserId: null,
  remark: ''
}
export default {
  name: 'customer_list',
  data(){
    return {
      centerDialogVisible: false,
      dialogForm: {...formDefaultData},
      loading: false,
      users: [],
      roles: [],
      totalCount: 0,
      searchForm: {
        conditionKey: 'customerName',
        conditionValue: ''
      },
      pageSize: 15,
      pageIndex: 1,
      sorts: {
        sortType: 'D',
        sortName: 'createTime'
      },
      statusText: {N: '正常', D: '禁用'}
    }
  },
  watch: {
    pageIndex(){
      this.loadList()
    },
    pageSize(){
      this.loadList()
    },
    centerDialogVisible(val){
      if (!val) {
        // 重置表单数据
        this.dialogForm = {...formDefaultData}
        // 重置表单验证状态
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    async loadRegions(){ // 获取区域列表
      try {
        const roles = await this.$$main.userRoleList()
        this.roles = roles.map(item => {
          return {
            edit: false,
            belongAdminUserId: item.belongAdminUserId,
            adminRoleName: item.adminRoleName
          }
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onSearchClick(){
      this.loadList()
    },
    onEditClick(row){
      let adminInfo = {}
      Object.keys(row).forEach(key => {
        if (['createTime', 'formatCreateTime', 'loginPwd', 'adminRoleName', 'adminRoleNames', 'belongAdminUserIds'].indexOf(key) === -1) adminInfo[key] = row[key]
      })
      adminInfo.loginPwd = ''
      this.dialogForm = adminInfo
      this.centerDialogVisible = true
    },
    async onDisabledClick(row){
      try {
        const sourceStatus = await this.$$main.customerUpdate({
          customerId: row.customerId,
          status: row.status === 'N' ? 'D' : 'N'
        })
        sourceStatus && this.loadList()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
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
      this.loadList()
    },
    async loadList(){
      this.loading = true
      try {
        const data = await this.$$main.customerList({ // customerList
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          conditionKey: this.searchForm.conditionKey,
          conditionValue: this.searchForm.conditionValue,
          sorts: this.sorts
        })
        this.totalCount = data.totalCount
        this.users = data.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageShow(){
      this.loadList()
    }
  },
  mounted(){
    // console.log(this.$refs)
  }
}
</script>

<style scoped>

</style>
