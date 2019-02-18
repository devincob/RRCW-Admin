<template>
  <div class="el-main x-page" :class="'x-page-'+pageName">
    <el-breadcrumb v-if="breadcrumbs && breadcrumbs.length" class="mb-lg" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in breadcrumbs"
                          :to="item.path ? item.path : ''"
                          :key="item.path + item.id">{{item.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <slot name="content">
      <slot></slot>
    </slot>
  </div>
</template>

<script>
const findParentByPath = (menus, id) => {
  let cur = menus.filter(item => id === item.id)
  let x = []
  if (cur.length) {
    x.push({...cur[0]})
    if (cur[0].pid){
      x = x.concat(findParentByPath(menus, menus.filter(item => item.id === cur[0].pid)[0].id))
    }
  }
  return x
}
export default {
  props: {
    'title': String,
    'name': String,
    'debug': Boolean,
    'breadcrumb': [String, Array]
  },
  name: 'x-page',
  data() {
    return {
      pageName: this.name,
      x_breadcrumbs: []
    }
  },
  watch: {
    title(val) {
      document.title = val
    },
    name(val) {
      this.pageName = val
    },
    $route(to, from) {
      if (to.path === from.path) {
        this.$emit('query-change', {to, from})
        if ('onPageQueryChange' in this['$parent']) this['$parent'].onPageQueryChange(to.query, {to, from})
      } else if (to.name === from.name){
        this.$emit('params-change', {to, from})
        if ('onPageParamsChange' in this['$parent']) this['$parent'].onPageParamsChange(to.params, {to, from})
      }
      this.updateBreadcrumb()
    }
  },
  computed: {
    breadcrumbs(){
      return this.breadcrumb === 'auto' ? this.x_breadcrumbs : this.breadcrumb
    }
  },
  methods: {
    setPageName() {
      this.pageName = this.name
      if (!this.pageName) {
        this.pageName = this.$route.name
      }
      try {
        document.body.parentElement.setAttribute('id', 'x-page-' + this.pageName)
        document.body.setAttribute('id', `x-page-${this.pageName}-body`)
      } catch (e) {
      }
    },
    setTitle(title){
      console.log(this.breadcrumbs)
      if (title) {
        document.title = title
        return
      }
      try {
        if (this.title) document.title = this.title || this.pageName || title
      } catch (e) {
        console.log(e)
      }
    },
    updateBreadcrumb() {
      if (this.breadcrumb && this.breadcrumb === 'auto') {
        let menus = this.$store.state.user.menus
        let menu = menus.filter(item => item.path === this.$route.path)
        let currentId = menu.length ? menu[0].id : 0
        let b = findParentByPath(menus, currentId).reverse()
        let breadcrumb = []
        b && b.length && b.forEach(item => {
          breadcrumb.push(item)
        })
        this.x_breadcrumbs = breadcrumb
      }
    }
  },
  mounted() {
    this.setPageName()
    this.$emit('page-create')
    if ('onPageCreate' in this.$parent) this.$parent.onPageCreate()

    this.updateBreadcrumb()
    this.$$(window).on('resize', this._handleResize = () => {
      const size = {width: this.$el.offsetWidth, height: this.$el.offsetHeight}
      this.$emit('resize', size)
      if ('onPageResize' in this.$parent) this.$parent.onPageResize(size)
    })
  },
  beforeDestroy() {
    this.$emit('page-destroy')
    if ('onPageDestroy' in this.$parent) this.$parent.onPageDestroy()
    if (this._handleResize){
      this.$$(window).off('resize', this._handleResize)
      this._handleResize = undefined
    }
  },
  activated() {
    this.setPageName()
    this.setTitle()
    this.$emit('page-show')
    if ('onPageShow' in this.$parent) this.$parent.onPageShow()
  },
  deactivated() {
    this.$emit('page-hide')
    if ('onPageHide' in this.$parent) this.$parent.onPageHide()
  }
}
</script>
