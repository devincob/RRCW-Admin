<template>
  <x-page breadcrumb="auto" title="部门人员管理">
    <el-row>
      <el-col :span="7" style="width:350px; margin-right: 20px;">
        <el-card  v-loading="roleLoading" ref="deptCard" class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 5px;"
          style="width:350px;min-height:715px;">
          <div slot="header">
            <span>部门架构</span>
          </div>
          <x-empty v-if="!deptList || !deptList.length" text="请稍等，正在加载数据" no-title-icon/>
          <el-tree
            :data="deptList"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="getCurrentNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                v-if="data.pid"
                @click.stop="() => editCurrentDept(data, node)">
                 编辑
              </el-button>
              <el-button
                v-if="data.pid"
                type="text"
                size="mini"
                @click.stop="() => deleteCurrentDept(node, data)">
                 删除
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click.stop="() => addNextDept(data, node)">
                添加下级
              </el-button>
            </span>
          </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16" style="min-width:500px;">
        <el-card ref="dealCard" style="min-width:500px" class="el-card-mini no-border-radius no-box-shadow">
        <div slot="header">
        <span style="margin-left: 15px">人员结构
          <span v-if="listHeaderTitle">({{listHeaderTitle}})</span>
        <add-new-comer
          v-show="dataContent.id && listHeaderTitle"
          style="float: right;"
          :data-content="dataContent"
          :node-content="nodeContent"
          @success="addSuccess"
          btn-type="text">添加部门人员</add-new-comer>
        </span>
        </div>
        <el-table :data="belongStaff"
                  v-loading="loading"
                  element-loading-text="拼命加载中..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255, 255, 255, 0.8)"
                  :border="true"
                  :highlight-current-row="true"
                  size="mini"
                  style="width: 100%;border-top:1px #eee solid">
          <el-table-column align="center" label="工号" prop="adminUserId" min-width="50" />
          <el-table-column align="center" label="姓名" prop="userName"  min-width="50"/>
          <el-table-column align="center" label="职位" prop="adminRoleName" min-width="50"/>
          <el-table-column align="center" label="流程角色" prop="flowRoleName" min-width="50"/>
          <!--<el-table-column align="center" label="是否负责人" prop="isLeader" min-width="50">-->
          <!--<span slot-scope="scope" :class="{-->
                <!--'text-success':scope.row.isLeader === 'Y',-->
                <!--'text-danger':scope.row.isLeader === 'N'-->
                <!--}">-->
            <!--{{statusText[scope.row.isLeader]}}-->
          <!--</span>-->
          <!--</el-table-column>-->
          <el-table-column label="操作"  min-width="50" align="center" header-align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" class="no-padding" @click="delDeptUser(scope.row)">
                删除
              </el-button>
              <el-popover
                :ref="`popoveruser${scope.row.adminUserId}`"
                placement="top"
                align="center"
                style="text-align: center;"
                width="160">
                <div v-if="scope.row.isLeader === 'N'">确定设置<span style="color: green;">{{scope.row.userName}}</span>为负责人吗？</div>
                <div v-if="scope.row.isLeader === 'Y'">确定撤销<span style="color: #ff6600;">{{scope.row.userName}}</span>负责人吗？</div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[`popoveruser${scope.row.adminUserId}`].doToggle()">取消</el-button>
                  <el-button :loading="addLoading" type="text" size="mini" @click="setLeader(scope, $refs[`popoveruser${scope.row.adminUserId}`])">确定</el-button>
                </div>
                <el-button
                  slot="reference" type="text" size="mini" class="no-padding"
                  :class="scope.row.isLeader === 'Y'? 'text-warning':''"
                  v-html="scope.row.isLeader === 'Y' ? '撤销负责人' : '设为负责人'"
                  v-popover="`popoveruser${scope.row.adminUserId}`"/>
              </el-popover>
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
      </el-col>
    </el-row>
    <el-dialog  :title="departmentTitle" v-drag-dialog="{reset: true}"
                :close-on-click-modal="false"
                :visible.sync="dialogAddNewcomer"
                :before-close="dialogClose"
                width="500px">
      <el-form :model="addNewcomer" :rules="rulesAddNewcomer" size="mini" status-icon ref="addNewcomer" label-width="115px">
        <el-form-item label="上级部门：">
          <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width: 350px;height: 28px;">{{appendEditTitle}}</div>
        </el-form-item>
        <el-form-item label="部门名称：" prop="deptName">
          <el-input v-model="addNewcomer.deptName" min="1" max="15" placeholder="请输入部门名称" style="width: 250px"/>
        </el-form-item>
        <!--是否销售部门：-->
        <el-form-item label="是否销售部门：">
          <el-switch v-model="addNewcomer.isSell"
                     active-value="Y"
                     inactive-value="N"
                     :width="60"
                     active-text="是"
                     inactive-text="否"/>
        </el-form-item>
        <el-form-item align="right">
          <el-button size="small" type="primary"   @click="submitForm">保存</el-button>
          <el-button size="small"  @click="dialogClose">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </x-page>
</template>

<script>
import AddNewComer from '../../components/AddNewComer'

export default {
  name: 'department-staff-management',
  data() {
    let iptNamelen = (rule, value, callback) => {
      if (value && value.length > 15){
        callback(new Error('字段名称过长，请输入15字节以内的名称'))
      } else {
        callback()
      }
    }
    return {
      dataContent: {},
      nodeContent: {},
      roleLoading: false,
      newComerDialog: false,
      addLoading: false,
      deptList: [],
      deptId: '',
      departmentTitle: '添加下级部门',
      appendEditTitle: '',
      listHeaderTitle: '',
      dialogAddNewcomer: false,
      belongStaff: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      statusText: {N: '否', Y: '是'},
      addNewcomer: {
        deptId: '',
        deptName: '',
        isSell: 'N'
      },
      rulesAddNewcomer: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { validator: iptNamelen, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  components: {AddNewComer},
  created() {
  },
  watch: {
    pageIndex(){
      this.loadList()
    },
    pageSize(){
      this.loadList()
    }
  },
  methods: {
    addSuccess(){ // 子组件通过emit向父组件传值，父组件在定义中的函数中获取
      this.loadList()
    },
    async setLeader({row}, pop){ // 部门所属人员 设置/撤销 为负责人
      try {
        this.addLoading = true
        let id = await this.$$main.deptModifyUser({
          deptId: row.deptId,
          adminUserId: row.adminUserId,
          isLeader: row.isLeader === 'N' ? 'Y' : 'N'
        })
        pop.doClose()
        this.addLoading = false
        id && row.isLeader === 'Y' && this.$message.warning('撤销成功')
        id && row.isLeader === 'N' && this.$message.success('设置成功')
        this.loadList()
      } catch (e){
        pop.doClose()
        this.addLoading = false
        this.$emit('error', e)
        e.message && this.$message.error(e.message)
      }
    },
    async delDeptUser(data) { // 部门所属人员 删除
      let ok = await this.$confirm(`确认删除${data.userName}？`, '删除确认').catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
      })
      if (ok){
        this.loading = true
        try {
          let datas = await this.$$main.deptDeleteUser({
            deptId: data.deptId, // 部门编号
            adminUserId: data.adminUserId // 人员编号
          })
          if (datas){
            await this.loadList()
            await this.$message({
              type: 'info',
              message: `已删除${data.userName}`
            })
          }
          this.loading = false
        } catch (e){
          e && e.message && this.$message.error(e.message)
          this.loading = false
        }
      }
    },
    clearParams(){ // dialog参数 清除验证清空
      this.$nextTick(() => {
        this.$refs.addNewcomer.clearValidate()
      })
      this.addNewcomer = {
        parentDeptId: '',
        deptId: '',
        deptName: '',
        isSell: 'N'
      }
    },
    getParentNode(node, arr){ // 获取 当前title的function
      let r = node.data.label ? [...arr, node.data.label] : arr
      if (node.parent){
        return this.getParentNode(node.parent, r)
      }
      return r
    },
    getCurrentNode(data, node, components){ // 点击当前部门节点时获取当前title，渲染所属部门人员
      let arr = this.getParentNode(node, [])
      arr = arr.reverse().join('>')
      this.listHeaderTitle = arr
      this.addNewcomer.deptId = node.data.id
      this.addNewcomer.deptName = data.label
      this.addNewcomer.isSell = node.data.isSell
      this.deptId = data.id || 16777216
      // 记录保存 添加部门人员 所需传递的值
      this.dataContent = data
      this.nodeContent = node
      this.loadList()
    },
    addNextDept: function (data, parentNode) { // 添加下级部门的时候，清空dialog 然后 只需记录节点所在的 父id进行赋值
      let arr = this.getParentNode(parentNode, [])
      arr = arr.reverse().join('>')
      this.appendEditTitle = arr
      this.departmentTitle = '添加下级部门'
      this.dialogAddNewcomer = true
      this.clearParams()
      this.addNewcomer.parentDeptId = data.id
      this.addNewcomer.deptId = null
      this.addNewcomer.deptName = ''
      this.addNewcomer.isSell = 'N'
    },
    editCurrentDept(data, parentNode) { // 在编辑部门的时候 先清空，然后将点击节点所在的数值进行赋值
      let arr = this.getParentNode(parentNode.parent, [])
      arr = arr.reverse().join('>')
      this.appendEditTitle = arr
      this.departmentTitle = '编辑部门'
      this.dialogAddNewcomer = true
      this.clearParams()
      this.addNewcomer.parentDeptId = data.pid
      this.addNewcomer.deptId = data.id
      this.addNewcomer.deptName = data.label
      this.addNewcomer.isSell = data.isSell
    },
    dialogClose(){ // 当且仅当 dialog中前三个参数都不为空的情况下，关闭录入流水dialog才刷新页面
      this.dialogAddNewcomer = false
    },
    submitForm() { // 点击确认
      this.$refs['addNewcomer'].validate((valid) => {
        if (valid) {
          this.submitModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitModify(){ // 部门新增编辑提交按钮
      this.roleLoading = true
      try { // 是编辑当前部门还是添加下级部门
        await this.$$main.deptModify(this.addNewcomer)
        this.$nextTick(() => {
          this.$refs.addNewcomer.clearValidate()
        })
        this.dialogAddNewcomer = false
        this.loadListDept()
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.roleLoading = false
      } catch (e) {
        this.dialogAddNewcomer = false
        this.roleLoading = false
        e && e.message && this.$message.error(e.message)
      }
    },
    async deleteCurrentDept(node, data){ // 删除部门 删除完部门后 我本地并未重新请求 架构数据，而是做了本地删除
      let ok = await this.$confirm(`确认删除${data.label}？`, '删除确认').catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
      })
      if (ok){
        this.roleLoading = true
        try {
          let isDeleted
          if (data.id !== 0) {
            isDeleted = await this.$$main.deptDelete({
              deptId: data.id
            })
          } else {
            isDeleted = true
          }
          if (isDeleted){
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.listHeaderTitle = ''
            this.$message.success(`已删除 ${data.label} !`)
          }
          this.roleLoading = false
        } catch (e){
          e && e.message && this.$message.error(e.message)
          this.roleLoading = false
        } finally {
          this.roleLoading = false
        }
      }
    },
    async loadList(){
      this.loading = true
      try {
        const data = await this.$$main.deptListUser({ // deptListUser部门所属人员 17826304
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          deptId: this.deptId
        })
        this.totalCount = data.totalCount
        this.belongStaff = data.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async loadListDept(){
      let res = await this.$$main.deptList() // 加载部门架构 deptList
      let list = res.deptInfos && res.deptInfos.map((item) => {
        return {
          id: item.deptId,
          label: item.deptName,
          isSell: item.isSell,
          pid: item.parentDeptId,
          value: item.deptId
        }
      })
      // 格式化加载部门架构
      this.deptList = this.$utils.listToTree(list, 'id', 'pid', 'children', 0)
    },
    onPageShow(){ // 进入界面 默认加载部门架构 不加载任何部门所属人员
      this.loadListDept()
    }
  },
  mounted(){
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 5px;
  }
</style>
