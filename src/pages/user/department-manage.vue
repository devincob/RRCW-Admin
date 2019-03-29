<template>
  <x-page breadcrumb="auto" title="部门人员管理">
    <el-row>
      <el-col :span="8">
        <el-card class="no-box-shadow">
          <div slot="header">部门架构</div>
          <el-tree
            :data="depts"
            default-expand-all
            node-key="id"
            :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span @click="onNodeClick(data, node)">{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => append(node, data)">
                    添加
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => append(node, data)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    删除
                  </el-button>
                </span>
              </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="no-box-shadow ml-lg">
          <div slot="header" class="el-card-header-toolbar">
            <span>人员结构（当前选择：{{childNodeNames.join('/')}}）</span>
            <el-button type="text" size="mini" class="pull-right" @click="addDepartmentUser">添加部门人员</el-button>
          </div>
          ........
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加下级部门/编辑部门"
      :visible.sync="dialogVisible">
      <el-form size="mini" label-width="120px" label-position="right">
        <el-form-item label="上级部门：">
          <span>{{childNodeNames && childNodeNames.length ? childNodeNames.join('/') : '无'}}</span>
        </el-form-item>
        <el-form-item label="部门名称：">
          <el-input v-model="departmentForm.name" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="是否销售部门：">
          <el-switch
            v-model="value2"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>~
        </el-form-item>
        <el-form-item class="text-right">
          <el-button type="primary">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="添加部门人员"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible2"></el-dialog>
  </x-page>
</template>

<script>
/**
 *
 * @param node
 * @returns {[]}
 */
function parentDatas(node) {
  let r = [node.label]
  if (node.parent && node.parent.label) {
    r = parentDatas(node.parent).concat(r)
  }
  return r
}
export default {
  name: 'department-manage',
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      value2: false,
      deptList: [],
      depts: [],
      childNodeNames: ['总部'],
      departmentForm: {
        name: ''
      }
    }
  },
  methods: {
    addDepartmentUser(e) {
      this.dialogVisible2 = true
    },
    append(node, data){
      let childNodeNames = ['总部'].concat(parentDatas(node))
      childNodeNames.pop()
      this.childNodeNames = childNodeNames
      this.dialogVisible = true
      this.departmentForm = {
        name: data.label
      }
    },
    remove(node, data){
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    onNodeClick(data, node){
      console.log(data, node)
      this.childNodeNames = ['总部'].concat(parentDatas(node))
    }
  },
  beforeMount(){
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
  .el-card-header-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: -4px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
