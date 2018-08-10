<template>
  <x-page breadcrumb="auto" title="角色权限管理">
    <div style="display: flex;">
      <div style="width: 300px;min-width: 300px;padding-right: 24px;">
        <el-card ref="roleCard" class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 5px;">
          <div slot="header" class="clearfix">
            <span>角色管理</span>
            <el-button type="text" @click="onAddRoleClick" class="pull-right"><i class="el-icon-plus"></i> 添加角色</el-button>
          </div>
          <x-empty v-if="!roles || !roles.length" text="请稍等，正在加载角色数据" no-title-icon/>
          <el-form v-for="role in roles" @submit.native.stop.prevent @click.native="currentRole=role"
                   :key="role.roleId"
                   class="role-item clearfix"
                   :class="{'disable':!role.edit, 'active': currentRole.roleId === role.roleId}">
            <el-input type="text" @click.stop.prevent :readonly="!role.edit" placeholder="请输入角色名字" v-model="role.roleName" size="mini"/>
            <el-button type="text" @click.stop="onEditRoleClick(role)">
              <i :class="{'el-icon-edit':!role.edit,'el-icon-circle-check-outline':role.edit}"></i>
              {{role.edit?'保存':'修改'}}
            </el-button>
            <el-button type="text" @click.stop="onRemoveRoleClick(role)"><i class="el-icon-delete"></i>删除</el-button>
          </el-form>
        </el-card>
      </div>
      <div style="flex: 1">
        <el-card ref="permissionPanel" class="el-card-mini no-border-radius no-box-shadow">
          <span slot="header">角色权限设置 - {{currentRole.roleName}}</span>
          <transition name="fade">
            <x-empty v-if="!currentRole || !currentRole.roleId" title="未选择角色" text="请在左边角色列表选择一个角色"/>
            <div v-else>
              <el-tree
                :data="menus"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                check-strictly
                @node-click="onNodeClick"
                @check="onNodeCheck"
                :default-checked-keys="checkeds"
                :expand-on-click-node="false"
                :props="{children: 'children',label:'title'}">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <div @click="node.disabled ? 1 : node.checked = !node.checked">{{ node.label }}</div>
                </div>
              </el-tree>
              <el-button @click="savePermissions" size="mini" class="mt" type="primary">保存权限</el-button>
              <el-button @click="$refs.tree.setCheckedKeys([])" size="mini" class="mt" type="danger">清空选择</el-button>
            </div>
          </transition>
        </el-card>
      </div>
    </div>
  </x-page>
</template>

<script>
import {listToTree} from '../../libs/utils'
export default {
  name: 'roles',
  data(){
    return {
      roles: [],
      currentRole: {},
      menus: [],
      checkeds: [],
      visible2: false
    }
  },
  watch: {
    currentRole(role){
      if (!role || !role.roleId) {
        this.checkeds = []
        this.menus = []
        return
      }
      const loader = this.$loading({text: '正在加载权限信息', target: this.$refs.permissionPanel.$el})
      this.$$main.rolePermissionList({
        adminRoleId: role.roleId
      }).then(({permissions}) => {
        let checkedIds = []
        let menus = permissions.map(item => {
          item.checked && checkedIds.push(item.menuId)
          return {
            'id': item.menuId,
            'pid': item.parentMenuId,
            'title': item.menuName,
            'icon': item.icon || 'el-icon-menu',
            'path': item.menuLink,
            'disabled': item.isShow !== 'Y',
            'checked': item.checked
          }
        })
        this.checkeds = checkedIds
        this.menus = listToTree(menus)
        loader.close()
      }).catch(e => {
        loader.close()
        console.error(e)
      })
    }
  },
  methods: {
    async loadRoles(){
      try {
        const roles = await this.$$main.roleList()
        this.roles = roles.map(item => {
          return {
            edit: false,
            roleId: item.adminRoleId,
            roleName: item.adminRoleName
          }
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async onRemoveRoleClick(role){
      const ok = await this.$confirm(`你确定要删除角色 ${role.roleName} 吗？`, '删除确认')
      if (ok){
        const $loader = this.$loading({background: 'transparent', text: '正在删除', target: this.$refs.roleCard.$el})
        try {
          let isDeleted
          if (role.roleId !== 0) {
            isDeleted = await this.$$main.roleUpdate({
              adminRoleId: role.roleId,
              status: 'D'
            })
          } else {
            isDeleted = true
          }
          if (isDeleted){
            this.roles = this.roles.filter(item => item.roleId !== role.roleId)
            this.$message.success(`已删除角色 ${role.roleName} !`)
            this.currentRole = {}
          }
        } catch (e){
          e && e.message && this.$message.error(e.message)
          console.log(e)
        } finally {
          $loader.close()
        }
      }
    },
    async onEditRoleClick(role){
      if (role.edit) {
        const $loader = this.$loading({text: '正在保存权限名称', target: this.$refs.roleCard.$el})
        try {
          const isOk = await this.$$main.roleModify({
            adminRoleId: role.roleId,
            adminRoleName: role.roleName,
            status: 'N'
          })
          role.edit = !isOk
          isOk ? this.$message.success('已保存') : this.$message.error('保存失败，请稍后再试。')
          this.loadRoles()
        } catch (e) {
          e && e.message && this.$message.error(e.message)
        } finally {
          $loader && $loader.close()
        }
      } else {
        this.roles.forEach(item => {
          item.edit = item.roleId === role.roleId ? !item.edit : false
        })
      }
    },
    onAddRoleClick(){
      const last = this.roles[this.roles.length - 1]
      if (last.roleId === 0) {
        this.$message.error('一次只能添加一个角色')
        return
      }
      this.roles.push({
        edit: true,
        roleName: '',
        roleId: 0
      })
    },
    onNodeClick(data, node){
      const tree = this.$refs.tree
      if (data.children) {
        data.children.forEach(d => {
          tree.setChecked(d.id, node.checked)
        })
      }
      if (data.pid) {
        if (node.checked){
          tree.setChecked(data.pid, node.checked)
        } else {
          const parent = tree.getNode(data.pid)
          const childNodes = parent.childNodes
          let i = childNodes.length
          childNodes.forEach(item => {
            if (!item.checked) i--
          })
          if (!i) tree.setChecked(data.pid, node.checked)
        }
      }
    },
    onNodeCheck(data) {
      this.onNodeClick(data, this.$refs.tree.getNode(data))
    },
    async savePermissions(){
      const loader = this.$loading({text: '正在保存权限'})
      try {
        const isSaveSuccess = await this.$$main.rolePermissionModify({
          adminRoleId: this.currentRole.roleId,
          menuIds: this.$refs.tree.getCheckedKeys()
        })
        if (isSaveSuccess) {
          this.$message.success('权限已更新')
        }
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        loader.close()
      }
    }
  },
  mounted(){
    this.loadRoles()
  }
}
</script>

<style lang="scss" scoped>
  .role-item {
    font-size: 14px;
    cursor: pointer;
    .el-input--mini {
      width: 55%;
      padding: 0 5px;
    }
    .el-input__inner{
      cursor: pointer;
      padding: 0 5px;
    }
  }

  .role-item.disable .el-input__inner {
    border-color: transparent;
  }
  .role-item:hover,
  .role-item.disable:hover .el-input__inner,
  .role-item.active,
  .role-item.disable.active .el-input__inner {
    background-color: #eeeeee;
  }

  .el-tree-node.is-expanded>.el-tree-node__children {
    display: flex;
    .el-tree-node:not(:first-child) .el-tree-node__content{
      .el-tree-node__expand-icon {
        display: none;
      }
      padding-left: 0!important;
    }
    .el-tree-node:not(:last-child) {
      padding-right: 15px;
      .el-tree-node__content {
        padding: 0 5px;
      }
    }
  }
</style>
