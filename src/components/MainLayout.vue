<template>
  <el-container>
    <el-header height="60px">
      <router-link to="/" class="app-info">
        <img src="../assets/images/logo.png" style="width: 40px;margin-right: 10px;" alt="">
        人人财务交易管理系统
      </router-link>
      <!--<el-button @click="isCollapse = !isCollapse" style="background-color: transparent;border: 0;">
        <el-icon class="text-white" :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
      </el-button>-->
      <div class="el-header-right">
        <el-menu
          @select="onTopMenuSelect"
          menu-trigger="click"
          mode="horizontal"
          background-color="#3C7ED2"
          text-color="#fff"
          active-text-color="#fff">
          <el-submenu index="/">
            <template slot="title">
              <i class="el-icon-setting" style="font-size: 30px;width: auto;color: white;"></i>{{$user.userInfo.roleName}}-{{$user.userInfo.userName||'我的工作台'}}
            </template>
            <el-menu-item index="top-menu-chang-password"><i class="el-icon-message text-white"></i> 修改密码</el-menu-item>
            <el-menu-item index="top-menu-logout">
              <i class="el-icon-sold-out text-white"></i>
              退出登录
            </el-menu-item>
            <!--<el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>-->
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container style="height: auto;">
      <el-aside width="auto">
        <el-menu
          :collapse="menuIsCollapse"
          :default-active="$route.path"
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <template v-for="menu in userMenus">
            <template v-if="menu.children">
              <el-submenu v-show="!menu.disabled" :key="menu.id" :index="`m-${menu.id}`">
                <template slot="title">
                  <i :class="menu.icon"></i>
                  <span>{{menu.title}}</span>
                </template>
                <template v-for="child in menu.children">
                  <el-menu-item
                    v-show="!child.disabled"
                    :key="child.id" :index="child.path">{{child.title}}
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item v-show="!menu.disabled" :key="menu.id" :index="menu.path">
                <i :class="menu.icon"></i>
                <span slot="title">{{menu.title}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
        <div class="el-aside-footer">
          <el-button @click="menuIsCollapse = !menuIsCollapse">
            <el-icon class="text-white" :class="menuIsCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
            {{!menuIsCollapse?'点击缩放菜单':''}}
          </el-button>
        </div>
      </el-aside>
      <transition :name="routerPageDirection"
                  @before-enter="beforeEnter"
                  @after-leave= "afterEnter" mode="out-in">
        <keep-alive :include="routerCachePages">
          <router-view/>
        </keep-alive>
      </transition>
    </el-container>
    <el-dialog
      v-if="centerDialogVisible"
      v-drag-dialog="{reset: true, range: 'body'}"
      title="修改密码"
      :visible.sync="centerDialogVisible"
      width="500px"
      center>
      <change-my-password @change-success="centerDialogVisible=false"/>
    </el-dialog>
  </el-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import ChangeMyPassword from './ChangeMyPassword'

export default {
  components: {ChangeMyPassword},
  name: 'main-layout',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      isCollapse: false,
      centerDialogVisible: false,
      menus: []
    }
  },
  computed: {
    ...mapGetters(['routerPageDirection', 'routerCachePages', 'userMenus']),
    menuIsCollapse: {
      get() {
        return this.$store.getters.menuIsCollapse
      },
      set(val){
        this.setMenuIsCollapse(val)
      }
    }
  },
  methods: {
    ...mapActions(['pullMenus', 'clearUserInfo', 'setMenuIsCollapse']),
    onTopMenuSelect(index){
      switch (index) {
        case 'top-menu-logout':
          this.$confirm('您确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return this.$$main.commonLogout()
          }).then(() => {
            this.$message({
              type: 'success',
              message: '您已退出登录!'
            })
            this.clearUserInfo()
            this.$router.push('/login')
          })
          break
        case 'top-menu-chang-password':
          this.centerDialogVisible = true
          break
      }
    },
    onWindowResize(){
      if (!this.menuIsCollapse && window.innerWidth < 1024) {
        this.menuIsCollapse = true
      }
      if (this.menuIsCollapse && window.innerWidth > 1024) {
        this.menuIsCollapse = false
      }
    },
    beforeEnter(){
      document.body.style.overflow = 'hidden'
    },
    afterEnter(){
      document.body.style.overflow = 'auto'
    }
  },
  mounted(){
    window.addEventListener('resize', this.onWindowResize)
    this.pullMenus()
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.onWindowResize)
  }
}
</script>
