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
      <div style="flex: 1; min-width: 700px;">
        <el-card ref="permissionPanel" class="el-card-mini no-border-radius no-box-shadow">
          <div slot="header">
            <span style="margin-left: 20px">编辑标签
              <span v-if="cityName">({{cityName}})
                <span v-if="allTags && this.allTags.length" style="margin-left: 50px">
                工时请填写 <span style="color: red"> 0.5 </span>的倍数,
                薪水请填精确到小数点<span style="color: red"> 2 </span>位
                </span>
             </span>
            </span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="keepIt" v-if="allTags && this.allTags.length">保存</el-button>
          </div>
            <x-empty v-if="!allTags||!this.allTags.length" title="未选择城市" text="请在左侧城市列表选择一个省份下的城市"/>
            <div v-else>
              <el-row type="flex">
                <el-col align="center">
                  <div style="height: 40px;">
                    <div class="tagListTitle">标签</div>
                    <div class="tagListTitle">最低工时(小时)</div>
                    <div class="tagListTitle">最低时薪(元/小时)</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="jobList">
                <el-col  class="jobListItem" align="center">
                  <div v-for="(item, index) in allTags" :key = "index" style="height: 42px; float: left; padding: 5px 0" >
                      <div class="tagList">
                        <el-checkbox v-model="item.isCheck" style="text-align: left; width: 90px;">
                              {{item.jobTagName}}
                        </el-checkbox>
                      </div>
                      <div class="tagList">
                        <el-input-number style="width:120px; text-align: center;"
                                         :min="0" :step="0.5" :disabled="item.isCheck === false"
                                         v-model="item.lowWorkHours">
                        </el-input-number>
                      </div>
                      <div class="tagList">
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
      let breaks = false
      // if (!this.selectArr || !this.selectArr.length) return this.$message.error('请选择待编辑标签')
      this.selectArr.length && this.selectArr.map((item) => {
        if (!rgb.test(item.lowWorkHours / 0.5) || !rgb2.test(item.lowHourSalary)){
          breaks = true
        }
        if (!rgb.test(item.lowWorkHours / 0.5)) return this.$message.error('工时必须以0.5为倍数的数值')
        if (!rgb2.test(item.lowHourSalary)) return this.$message.error('时薪小数点后两位')
      })
      if (breaks) return false
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
  .tagListTitle {
    height: 32px; line-height: 32px; width:200px;float: left
  }
  .tagList {
    height: 42px;
    line-height: 42px;
    width:200px;
    float: left
  }
</style>
