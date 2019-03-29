<template>
  <span>
    <el-button
      style="font-size: 14px"
      type="text"
      size="mini"
      @click="show">
      <slot></slot>
    </el-button>
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="添加部门人员"
      modal-append-to-body
      append-to-body
      :visible.sync="peopleListShow"
      custom-class="assign-dialog"
      width="800px"
      close-on-press-escape
      :close-on-click-modal="false"
      center>
      <el-row :gutter="20">
      <el-col><div class="grid-content" style="margin-top: -30px;">当前部门：{{departmentTitle}}</div></el-col>
      <!--<el-col>-->
        <!--<el-form :model="searchForm" :inline="true" size="mini" label-position="left" class="demo-form-inline">-->
          <!--<el-form-item label="用户名称：">-->
            <!--<el-input v-model="searchForm.userName" placeholder="请输入用户名称" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="员工工号：">-->
            <!--<el-input v-model="searchForm.adminUserId" placeholder="请输入员工工号" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button @click="onSearchClick" type="primary">查询</el-button>-->
            <!--<el-button type="danger" @click="clearQueryParams">清空</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-col>-->
    </el-row>
      <el-table
        :data="peoplelist"
        v-loading="tableLoading"
        :border="true"
        :highlight-current-row="true"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column fixed prop="adminUserId" label="工号" min-width="100"/>
        <el-table-column prop="userName" label="姓名" min-width="100"/>
        <el-table-column prop="adminRoleName" label="职位" min-width="100"/>
        <el-table-column prop="flowRoleName" label="流程角色" min-width="100"/>
        <el-table-column class="text-center" width="80" label="操作" fixed="right" align="right">
          <template slot-scope="scope">
            <el-popover
              :ref="`popoveruser${scope.row.adminUserId}`"
              placement="top"
              width="160">
              <p>确定添加<span style="color: green;">{{scope.row.userName}}</span>吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[`popoveruser${scope.row.adminUserId}`].doToggle()">取消</el-button>
                <el-button :loading="addBtnLoading" type="text" size="mini" @click="addNewComer(scope, $refs[`popoveruser${scope.row.adminUserId}`])">确定</el-button>
              </div>
            </el-popover>
            <el-button
              size="mini"
              type="primary"
              v-popover="`popoveruser${scope.row.adminUserId}`">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-size="searchForm.pageSize"
          :current-page="searchForm.pageIndex"
          layout="prev, pager, next"
          :total="totalAssignCount"
          @size-change="(size) => this.searchForm.pageSize = size"
          @current-change="(index) => this.searchForm.pageIndex = index">
        </el-pagination>
      </div>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: 'add-new-dialog',
  data() {
    return {
      deptId: '',
      departmentName: '',
      isSales: '',
      tableLoading: false,
      addBtnLoading: false,
      peopleListShow: false,
      totalAssignCount: 0,
      departmentTitle: '',
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        userName: '',
        adminUserId: ''
      },
      peoplelist: []
    }
  },
  props: {
    dataContent: {
      type: Object,
      default: () => { return {} }
    },
    nodeContent: {
      type: Object,
      default: () => { return {} }}
  },
  watch: {
    'searchForm.pageIndex': {
      handler: function(){
        this.queryNoBelong()
      },
      deep: true
    }
  },
  methods: {
    onSearchClick(){
    },
    clearQueryParams(){
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = 15
      this.searchForm.userName = ''
      this.searchForm.adminUserId = ''
    },
    getParentNode(node, arr){
      let r = node.data.label ? [...arr, node.data.label] : arr
      if (node.parent){
        return this.getParentNode(node.parent, r)
      }
      return r
    },
    show(){
      let arr = this.getParentNode(this.nodeContent, [])
      arr = arr.reverse().join('>')
      this.departmentTitle = arr
      this.departmentName = this.dataContent.label
      this.isSales = this.dataContent.isSales
      this.deptId = this.dataContent.id
      this.tableLoading = false
      this.totalAssignCount = 0
      this.searchForm = {
        pageIndex: 1,
        pageSize: 10
      }
      this.peoplelist = []
      this.peopleListShow = true
    },
    async queryNoBelong() {
      console.log('deptId', this.deptId)
      try {
        this.tableLoading = true
        const data = await this.$$main.deptListNoBelong({ // deptListNoBelong 所属非部门人员
          ...this.searchForm,
          deptId: this.deptId
        })
        this.tableLoading = false
        this.totalAssignCount = data.totalCount
        this.peoplelist = data.datas
      } catch (e){
        this.tableLoading = false
        e.message && this.$message.error(e.message)
      }
    },
    async addNewComer({row}, pop){
      try {
        this.addBtnLoading = true
        let id = await this.$$main.deptModifyUser({ // deptModifyUser 部门添加人员
          deptId: row.deptId,
          adminUserId: row.adminUserId,
          isLeader: 'N'
        })
        pop.doClose()
        this.addBtnLoading = false
        this.peopleListShow = false
        id && this.$message.success('添加成功')
        this.$emit('success', id)
      } catch (e){
        pop.doClose()
        this.addBtnLoading = false
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
