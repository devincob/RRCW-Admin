<template>
  <el-container>
    <el-header height="60px">
      <router-link to="/" class="app-info">
        <i class="el-icon-info"></i>
        斜杠兼职管理系统
      </router-link>
      <!--<el-button @click="isCollapse = !isCollapse" style="background-color: transparent;border: 0;">
        <el-icon class="text-white" :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
      </el-button>-->
      <div class="el-header-right">
        <el-popover
          placement="top-start"
          title=""
          @show="onNoticeShow"
          v-model="noticeShow"
          trigger="click">
          <div class="notice-wrap">
            <div class="notice-header">
              <div class="notice-title">通知</div>
              <div class="notice-toolbar">
                <el-button size="mini" type="text" @click="onNoticeRead">全部标记为已读</el-button>
              </div>
            </div>
            <div class="notice-content" v-if="notices && notices.datas && notices.datas.length">
              <div v-for="notice in notices.datas" :key="notice.noticeId" class="notice-item">
                <div class="notice-message" @click="onNoticeClick(notice)">
                  {{notice.content}}
                </div>
                <div class="notice-other">
                  <span>{{notice.noticeTime}}</span>
                  <el-button type="text" size="mini" v-if="notice.isRead !== 'Y'" @click="onNoticeRead(notice)">设为已读</el-button>
                </div>
              </div>
            </div>
            <div v-else class="notice-content">
              暂无通知
            </div>
            <div v-if="notices && notices.totalCount" class="notice-footer">
              <el-pagination
                layout="prev, pager, next"
                :page-size="5"
                @current-change="(p) => pageIndex = p"
                :total="notices.totalCount">
              </el-pagination>
            </div>
          </div>
          <el-button slot="reference" size="mini" type="text" style="color: #fff;font-size: 14px;">
            通知
            <el-badge :value="noReadCount" :class="{'notice-count-empty': noReadCount === 0}"></el-badge>
          </el-button>
        </el-popover>
        <el-menu
          @select="onTopMenuSelect"
          menu-trigger="click"
          mode="horizontal"
          background-color="#3C7ED2"
          text-color="#fff"
          active-text-color="#fff">
          <el-submenu index="/">
            <template slot="title">
              <i class="el-icon-setting" style="font-size: 30px;width: auto;color: white;"></i> {{$user.userInfo.adminName||'我的工作台'}}
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
      menus: [],
      notices: [],
      pageIndex: 1,
      noReadCount: 0,
      noticeShow: false
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
  watch: {
    pageIndex(){
      this.loadNoticeList()
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
    },
    async NoticeQueryNoReadCount(){
      try {
        const res = await this.$$main.noticeQueryNoReadCount()
        this.noReadCount = res.noReadCount
        setTimeout(this.NoticeQueryNoReadCount, 15000)
      } catch (e) {
        console.log(e)
      }
    },
    async loadNoticeList(){
      try {
        const res = await this.$$main.noticeQueryList({
          pageSize: 5,
          pageIndex: this.pageIndex
        })
        this.notices = res
      } catch (e) {
        console.log(e)
      }
    },
    onNoticeClick(notice){
      this.noticeShow = false
      if (notice) {
        if (notice.bizType === 'M') {
          this.$router.push({path: '/order/detail?orderid=' + notice.bizId})
        }
        if (notice.bizType === 'S') {
          this.$router.push({path: '/order/suborder-detail?ordersubid=' + notice.bizId})
        }
      }
    },
    onNoticeShow(){
      this.loadNoticeList()
    },
    async onNoticeRead(notice){
      try {
        await this.$$main.noticeDoRead({noticeId: notice.noticeId})
        this.loadNoticeList()
        this.NoticeQueryNoReadCount()
        this.$message.success('已标记为已读')
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted(){
    window.addEventListener('resize', this.onWindowResize)
    this.pullMenus()
    this.NoticeQueryNoReadCount()
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.onWindowResize)
  }
}
</script>

<style lang="scss">
  .notice-wrap {
    width: 500px;
  }
  .notice-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 1px #ddd solid;
    .notice-title {
      font-size: 16px;
      font-weight: bold;
    }
    .notice-toolbar {}
  }
  .notice-content {
    .notice-item {
      border-bottom: 1px #ddd solid;
      padding: 10px 5px 0px;
      cursor: pointer;
      .notice-message {
        color: #666;
      }
      .notice-other {
        color: #999;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
      }
    }
  }
  .notice-count-empty .el-badge__content{
    background-color: #ddd;
  }
  .notice-footer {
    text-align: right;
  }
</style>
