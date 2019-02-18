<template>
  <x-page breadcrumb="auto" title="城市标签管理">
    <div style="display: flex;">
      <div style="width: 300px;min-width: 300px;padding-right: 24px;">
        <el-card ref="roleCard" class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 5px;">
          <div slot="header" class="clearfix">
            <span>城市</span>
          </div>
          <x-empty v-if="!all_list || !all_list.length" text="请稍等，正在加载城市数据" no-title-icon/>
          <el-tree v-else
                   :data="all_list"
                   :props="defaultProps"
                   accordion
                   @node-click="onSelectChange">
          </el-tree>
        </el-card>
      </div>
      <div style="flex: 1">
        <el-card ref="permissionPanel" class="el-card-mini no-border-radius no-box-shadow">
          <div slot="header">
            <span style="margin-left: 20px">编辑标签 <span v-if="cityName">({{cityName}})</span></span>
            <span style="float: right;margin-right: 20px; cursor: pointer"
                  @click="keepIt" v-if="allTags && this.allTags.length" >保存</span>
          </div>
          <x-empty v-if="!allTags||!this.allTags.length" title="未选择城市" text="请在左边角色列表选择一个城市"/>
          <div v-else>
            <el-row>
              <el-col  class="jobListItem">
                工时请填写 <span style="color: red">0.5</span>的倍数（最小为<span style="color: red">0.5</span>）,
                薪水请填写大于<span style="color: red">0</span>的数字
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col align="center">
                <div style="height: 40px; ">
                  <div style="height: 32px; line-height: 32px; width:200px;float: left">标签</div>
                  <div style="height: 32px; line-height: 32px; width:200px;float: left">最低工时(小时)</div>
                  <div style="height: 32px; line-height: 32px; width:200px;float: left">最低时薪(元/小时)</div>
                </div>
              </el-col>
            </el-row>
            <el-row class="jobList">
              <el-col  class="jobListItem" align="center">
                <div v-for="(item, index) in allTags" :key = "index" style="height: 42px; float: left; padding: 5px 0" >
                  <div style="height: 42px; line-height: 42px; width:200px;float: left">
                    <el-checkbox v-model="item.isCheck" style="text-align: center; width: 90px;">
                      {{item.jobTagName}}</el-checkbox>
                  </div>
                  <div style="height: 42px; line-height: 42px; width:200px;float: left">
                    <el-input-number style="width:120px; text-align: center;"
                                     :min="0" :step="0.5" :disabled="item.isCheck === false"
                                     v-model="item.lowWorkHours">
                    </el-input-number>
                  </div>
                  <div style="height: 42px; line-height: 42px; width:200px;float: left">
                    <el-input-number style="width:120px; text-align: center; "
                                     :min="0" :step="1" :disabled="item.isCheck === false"
                                     v-model="item.lowHourSalary">
                    </el-input-number>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
  </x-page>
</template>

<script>
export default {
  name: 'open-City',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cityName: '',
      allTags: [],
      selectArr: [],
      all_list: [], // city列表
      distictId: 0,
      listStyle: { // 所选省市可添加(已有)标签样式
        width: '400px',
        height: '800px'
      }
    }
  },
  computed: {
    regionInfo(){
      return this.$store.getters.getRegion || []
    }
  },
  created(){},
  methods: {
    keepIt(){ // 发给后台的进行交互
      this.selectArr = []
      this.allTags && this.allTags.map((item) => {
        if (item.isCheck) {
          this.selectArr.push(item)
        } else {
          this.selectArr.forEach((it, index) => {
            if (item.jobTagId === it.jobTagId) {
              this.selectArr.splice(index, 1)
            }
          })
        }
      })
      let rgb = /^(0|\+?[1-9][0-9]*)$/
      let rgb2 = /^\d+(\.\d{1,2})?$/
      this.selectArr.length && this.selectArr.map((item) => {
        if (!rgb.test(item.lowWorkHours / 0.5)) return this.$message.error('工时必须为整数或以0.5为数值的小数')
        if (!rgb2.test(item.lowHourSalary)) return this.$message.error('时薪小数点后两位')
      })
      this.$$main.tagSaveCityTag({
        distictId: this.distictId,
        jobTagData: this.selectArr
      }).then((res) => {
        if (res) {
          this.$message.success('保存成功')
        }
      }).catch((e) => {
        this.$message.error(e.message)
      })
    },
    formatLists(list){ // 格式化省份数据
      this.all_list = list.map(x => {
        return {
          label: x.provinceName,
          req: false,
          parentId: x.parentId,
          children: x.children && x.children.map(city => {
            return {
              req: true,
              label: city.label,
              distictId: city.distictId
            }
          })
        }
      })
    },
    onSelectChange(e){
      this.allTags = [] // 选择城市之前之前数据清空||重置&&搜索词清空
      this.cityName = e.label
      if (e && e.req) {
        this.distictId = e.distictId
        this.queryAllTags(this.distictId)
      }
    },
    async queryAllTags(distictId){ // 获得城市接口 SAUserProvinceCityList
      this.allTags = []
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        const tagList = await this.$$main.tagCityTagList({distictId: distictId})
        tagList && tagList.map((item) => {
          if (item.isCheck === 'N'){
            item.isCheck = false
          }
          if (item.isCheck === 'Y'){
            item.isCheck = true
          }
        })
        this.allTags = tagList
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted(){
    if (!this.regionInfo || this.regionInfo.length < 1){
      this.$store.dispatch('setRegion')
    }
    this.formatLists(this.regionInfo || [])
  }
}
</script>

<style scoped>
</style>
