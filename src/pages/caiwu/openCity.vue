<template>
  <x-page  breadcrumb="auto" title="开通城市">
    <el-row>
      <el-col :span="3" style="min-width: 270px;padding-right: 20px;">
        <el-card ref="cityCard" class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 5px;">
          <div slot="header">
            <span>城市</span>
          </div>
          <x-empty v-if="!all_list || !all_list.length" text="请稍等，正在加载城市数据" no-title-icon/>
          <el-tree v-else
                   node-key="distictId"
                   :default-expanded-keys="[1050]"
                   :data="all_list"
                   :props="defaultProps"
                   accordion
                   @node-click="onSelectChange">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="5" style="min-width: 300px;padding-right: 20px;">
        <el-card ref="labelCard" class="el-card-mini no-border-radius no-box-shadow" style="min-height: 300px;">
          <div slot="header">
        <span>编辑标签
          <span v-if="cityName">({{cityName}})</span>
        </span>
            <el-button v-if="cityName" style="float: right; font-size: 14px;" type="text" @click="keepOpenLabel">保存</el-button>
          </div>
          <x-empty v-if="!allTags||!this.allTags.length" title="未选择城市" text="请在城市列表选择需要编辑标签的城市"/>
          <div v-else>
            <el-row>
              <el-col>
                <div v-for="(item, index) in allTags" :key="index" class="allTags_tagList">
                  <el-checkbox v-model="item.isCheck" style=" float: left;width: 150px;">
                    {{item.jobTagName}}
                  </el-checkbox>
                  <el-button type="text" v-if="item.isCheck" @click="setSalary(item)">薪资配置</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" style="min-width: 600px;">
        <el-card ref="dealCard" class="el-card-mini no-border-radius no-box-shadow" style="min-height: 300px;">
          <div slot="header">
        <span style="margin-left: 15px">标签薪资配置
          <span v-if="cityName">({{cityName}} <span v-if="jobTagName">>{{jobTagName}}</span>)
         </span>
        </span>
            <el-button v-if="form.districtId&&jobTagName" style="float: right; font-size: 14px;" type="text" @click="submitForm('form')">保存
            </el-button>
          </div>
          <div v-if="form.districtId&& jobTagName">
            <div style="padding: 0 15px;">
              <div class="el-step">
                <div class="el-step__title">订单价格配置
                </div>
                <div class="el-step_content">
                  <div class="el-step_middle-line-line">
                    <span class="el-step_line-text"></span>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 15px; padding: 0 15px;">
              <el-form ref="form" :model="form"  :rules="rules" label-width="120px" size="small "
                       v-loading="loading">
                <el-form-item label="计费模式：" prop="salaryMode">
                  <el-radio-group v-model="form.salaryMode">
                    <el-radio label="H">工时模式</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="最低工时：" prop="lowHour">
                  <el-input v-model.number="form.lowHour" class="iptWidth"  placeholder="请输入最低工时"/><span class="iptWidth_after">小时</span>
                </el-form-item>
                <el-form-item label="最低工时价格：" prop="lowSalary">
                  <el-input v-model.number="form.lowSalary" class="iptWidth"
                            placeholder="请输入最低工时价格"/><span class="iptWidth_after">元</span>
                </el-form-item>
                <el-form-item label="跳价分钟："  prop="overMinute">
                  <el-input v-model.number="form.overMinute" class="iptWidth"
                            placeholder="请输入跳价分钟"/><span class="iptWidth_after">分钟</span>
                </el-form-item>
                <el-form-item label="跳价金额：" prop="overSalary">
                  <el-input v-model.number="form.overSalary" class="iptWidth"
                            placeholder="请输入跳价金额"/><span class="iptWidth_after">元</span>
                </el-form-item>
                <el-form-item label="夜班时段：" prop="eveBeginTime">
                  <el-time-picker
                    style="width: 148px;"
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    v-model="eveBeginTime"
                    placeholder="请输入开始时间"/>
                  <span><el-checkbox class="open-city_time-checked" v-model="nextDay"  style="padding: 0 13px;">至次日</el-checkbox></span>
                  <el-time-picker
                    style="width: 148px;"
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    v-model="eveEndTime"
                    placeholder="请输入结束时间"/>
                </el-form-item>
                <el-form-item label="夜班附加费：" prop="evePlusSalary">
                  <el-input v-model.number="form.evePlusSalary" class="iptWidth"
                            placeholder="请输入夜班附加费"/><span class="iptWidth_after">元</span>
                </el-form-item>
                <el-form-item label="包水饭：" prop="eatingSalary">
                  <el-input v-model.number="form.eatingSalary" class="iptWidth"
                            placeholder="该字段请填写负数,表示包水饭订单将扣除该金额。"/><span class="iptWidth_after">元</span>
                </el-form-item>
                <el-row>
                  <el-col>
                    <div class="el-step">
                      <div class="el-step__title" >服务费配置
                      </div>
                      <div class="el-step_content">
                        <div class="el-step_middle-line-line">
                          <span class="el-step_line-text"></span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-form-item label="计费模式：" style="margin-top: 15px;" prop="serviceMode">
                  <el-radio-group v-model="form.serviceMode">
                    <el-radio label="H">工时模式</el-radio>
                    <el-radio label="T">总价模式</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="form.serviceMode === 'H' ? '工时服务费' : '服务费'" prop="serviceAmount">
                  <el-input v-model.number="form.serviceAmount" class="iptWidth" :placeholder="form.serviceMode === 'H' ? '请输入工时服务费' : '请输入服务费'" />
                  <span class="iptWidth_after">元</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <x-empty v-else  title="未选择标签" text="请在标签列表选择一个已开通的标签"/>
        </el-card>
      </el-col>
    </el-row>
  </x-page>
</template>

<script>
export default {
  name: 'open-City',
  data() {
    const workTime = (rule, value, callback) => {
      if (!this.form.eveBeginTime || this.form.eveBeginTime === '') {
        callback(new Error('请选择开始时间'))
      } else if (!this.nextDay && this.form.eveEndTime < this.form.eveBeginTime) {
        this.form.eveBeginTime = this.form.eveBeginTime.length > 8 ? this.$utils.dateFormat(this.form.eveBeginTime, 'hh:mm:ss') : this.form.eveBeginTime
        this.form.eveEndTime = this.form.eveEndTime.length > 8 ? this.$utils.dateFormat(this.form.eveEndTime, 'hh:mm:ss') : this.form.eveEndTime
        callback(new Error('开始时间晚于结束时间'))
      } else if (!this.form.eveEndTime || this.form.eveEndTime === '') {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    let validateLowWorkHours = (rule, value, callback) => {
      let rgb = /^[1-9]\d*$/
      if (value instanceof Number || !rgb.test(value / 0.5)){
        callback(new Error('工时必须是大于0且0.5为倍数的数值'))
      } else {
        callback()
      }
    }
    let validateLowSalary = (rule, value, callback) => {
      let rgb = /^\d+(\.\d{1,2})?$/
      if (!rgb.test(value)) {
        callback(new Error('金额精确到小数点后两位.'))
      } else {
        callback()
      }
    }
    let validateEatingSalary = (rule, value, callback) => {
      let rgb = /^0|(-((\d+(\.\d{0,2})?)|(\d*\.\d{1,2})))$/
      if (!rgb.test(value)) {
        callback(new Error('金额为非正数，且精度不多于小数点后两位.'))
      } else {
        callback()
      }
    }
    let validateOverMinute = (rule, value, callback) => {
      let rgb = /^[1-9]\d*$/
      if (value instanceof Number || !rgb.test(value / 15)){
        callback(new Error('跳价分钟必须是15分钟为倍数的数值'))
      } else {
        callback()
      }
    }
    return {
      eveBeginTime: '18:30:00',
      eveEndTime: '19:30:00',
      loading: false,
      nextDay: false,
      jobTagName: '',
      jobTagId: 0,
      form: {
        eveBeginTime: '18:30:00',
        eveEndTime: '19:30:00',
        lowHour: null,
        lowSalary: null,
        overMinute: null,
        overSalary: null,
        evePlusSalary: null,
        eatingSalary: null,
        jobTagId: 0,
        companyUserId: 0,
        districtId: 0,
        salaryMode: 'H',
        serviceMode: 'H',
        serviceSettingOpen: 'N',
        salarySettingOpen: 'N',
        serviceAmount: null
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cityName: '',
      allTags: [],
      selectArr: [],
      all_list: [], // city列表
      distictId: 0,
      rules: {
        salaryMode: [
          {required: true, message: '请选择计费形式', trigger: 'change'}
        ],
        lowHour: [
          { required: true, message: '请输入最低工时', trigger: ['blur', 'change'] },
          { validator: validateLowWorkHours, trigger: ['blur', 'change'] }
        ],
        lowSalary: [
          {required: true, message: '请输入最低工时价格', trigger: ['blur', 'change']},
          { validator: validateLowSalary, trigger: ['blur', 'change'] }
        ],
        overMinute: [
          {required: true, message: '请输入跳价分钟', trigger: ['blur', 'change']},
          { validator: validateOverMinute, trigger: ['blur', 'change'] }
        ],
        overSalary: [
          {required: true, message: '请输入调价金额', trigger: ['blur', 'change']},
          { validator: validateLowSalary, trigger: ['blur', 'change'] }
        ],
        nightShiftTime: [
          {type: 'array', required: true, message: '请选择时间', trigger: ['blur', 'change']}
        ],
        eveBeginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' },
          { validator: workTime, trigger: 'change' }
        ],
        evePlusSalary: [
          {required: true, message: '请输入夜班附加费', trigger: ['blur', 'change']},
          { validator: validateLowSalary, trigger: ['blur', 'change'] }
        ],
        eatingSalary: [
          { required: true, message: '请输入包水饭费用', trigger: ['blur', 'change'] },
          { validator: validateEatingSalary, trigger: ['blur', 'change'] }
        ],
        serviceMode: [
          {required: true, message: '请选择计费形式', trigger: 'change'}
        ],
        serviceAmount: [
          { required: true, message: '请输入服务费', trigger: ['blur', 'change'] },
          { validator: validateLowSalary, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    regionInfo() {
      return this.$store.getters.getRegion || []
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    async setSalary(item){
      this.nextDay = false
      this.jobTagName = item.jobTagName
      this.jobTagId = item.jobTagId
      try {
        if (this.loading){
          return
        }
        this.loading = true
        let datas = await this.$$main.tagQuerySalarySetting({
          companyUserId: 0, // 企业编号
          districtId: this.distictId, // 城市编号
          jobTagId: this.jobTagId // 标签
        })
        let startTime = ''
        let endTime = ''
        this.nextDay = !!(datas.eveBeginTime && datas.eveEndTime && new Date(datas.eveEndTime).getDate() > new Date(datas.eveBeginTime).getDate())
        if (datas.eveBeginTime){
          startTime = this.$utils.dateFormat(datas.eveBeginTime, 'hh:mm:ss')
        }
        if (datas.eveEndTime){
          endTime = this.$utils.dateFormat(datas.eveEndTime, 'hh:mm:ss')
        }
        this.form.companyUserId = datas.companyUserId || 0
        this.form.districtId = datas.districtId || this.distictId
        this.form.jobTagId = datas.jobTagId || this.jobTagId
        this.form.eatingSalary = datas.eatingSalary || null
        this.eveBeginTime = startTime || '18:30:00'
        this.eveEndTime = endTime || '19:30:00'
        this.form.eveBeginTime = startTime || '18:30:00'
        this.form.eveEndTime = endTime || '19:30:00'
        this.form.jobTagName = datas.jobTagName || ''
        this.form.lowHour = datas.lowHour || null
        this.form.lowSalary = datas.lowSalary || null
        this.form.overMinute = datas.overMinute || null
        this.form.overSalary = datas.overSalary || null
        this.form.evePlusSalary = datas.evePlusSalary || null
        this.form.salaryMode = datas.salaryMode || 'H'
        this.form.serviceMode = datas.serviceMode || 'H'
        this.form.serviceSettingOpen = 'N'
        this.form.salarySettingOpen = 'N'
        this.form.serviceAmount = datas.serviceAmount || null
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
      this.$nextTick(() => {
        this.$refs['form'] && this.$refs['form'].clearValidate()
      })
    },
    async submitForm(formName) { // 提交每个标签对应的配置
      if (this.loading){
        return
      }
      this.form.eveBeginTime = this.eveBeginTime
      this.form.eveEndTime = this.eveEndTime
      if (!this.form.districtId){
        return this.$message.error('请选择城市标签')
      }
      if (this.nextDay){
        this.form.eveBeginTime = this.form.eveBeginTime && this.form.eveBeginTime.length > 8 ? this.form.eveBeginTime : '2019-03-13 ' + this.form.eveBeginTime
        this.form.eveEndTime = this.form.eveEndTime && this.form.eveEndTime.length > 8 ? this.form.eveEndTime : '2019-03-14 ' + this.form.eveEndTime
      } else {
        this.form.eveBeginTime = this.form.eveBeginTime && this.form.eveBeginTime.length > 8 ? this.form.eveBeginTime : '2019-03-13 ' + this.form.eveBeginTime
        this.form.eveEndTime = this.form.eveEndTime && this.form.eveEndTime.length > 8 ? this.form.eveEndTime : '2019-03-13 ' + this.form.eveEndTime
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.keepSetSalary()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async keepSetSalary(){ // 保存每个标签对应的配置
      try {
        if (this.loading){
          return
        }
        this.loading = true
        let datas = await this.$$main.tagDoSaveSalarySetting(this.form)
        if (datas){
          this.$message.success('保存成功')
          this.form.eveBeginTime = this.form.eveBeginTime && this.$utils.dateFormat(this.form.eveBeginTime, 'hh:mm:ss')
          this.form.eveEndTime = this.form.eveEndTime && this.$utils.dateFormat(this.form.eveEndTime, 'hh:mm:ss')
          this.eveBeginTime = this.form.eveBeginTime
          this.eveEndTime = this.form.eveEndTime
        }
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    keepOpenLabel() { //  保存每个城市对应的标签的开通情况
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
    formatLists(list) { // 格式化省份数据
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
    onSelectChange(e) {
      this.jobTagName = ''
      this.allTags = [] // 选择城市之前之前数据清空||重置&&搜索词清空
      this.cityName = e.label
      if (e && e.req) {
        this.distictId = e.distictId
        this.queryAllTags(this.distictId)
      }
    },
    onPageShow() { // 从b端列表传过来的用户id
      // this.$message.success('进入的是开通城市！')
    },
    async queryAllTags(distictId) { // 获得城市接口 SAUserProvinceCityList
      // this.$refs['form'].resetFields()
      this.allTags = []
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        const tagList = await this.$$main.tagCityTagList({distictId: distictId})
        tagList && tagList.map((item) => {
          if (item.isCheck === 'N') {
            item.isCheck = false
          }
          if (item.isCheck === 'Y') {
            item.isCheck = true
          }
        })
        this.allTags = tagList
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted() {
    if (!this.regionInfo || this.regionInfo.length < 1) {
      this.$store.dispatch('setRegion')
    }
    this.formatLists(this.regionInfo || [])
  }
}
</script>
<style>
  .open-city_time-checked .el-checkbox__label{
    display: inline-block;
    padding-left: 5px;
    line-height: 19px;
    font-size: 14px;
  }
</style>
<style scoped>
  .iptWidth {
    min-width: 200px;
    max-width: 390px;
  }
  .iptWidth_after{
    padding-left: 5px;
  }

  .allTags_tagList {
    width: 270px;
    height: 42px;
    line-height: 42px;
    padding: 5px 0 5px 15px;
    float: left
  }
  .allTags_tagList_change_color{
    color: #409EFF;
  }
  .setList {
    height: 42px;
    float: left;
    display: inline-block;
    padding-left: 10px;
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    line-height: 42px;
    width: 100px;
  }
  .el-step_content {
    text-align: center;
    background-color: #fff;
  }
  .el-step__title{
    color: #409EFF;
    font-size: 14px;
    line-height: 30px;
  }
  .el-step_middle-line-line:before {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #999; /*颜色需与主题大背景色一致*/
    position: relative;
    top: 10px; /*调节线高*/
    left: 0;
  }
  .el-step_line-text {
    display: inline-block;
    background: #fff;
    padding: 0 18px 0 18px;
    position: relative;
    font-size: 14px;
    font-weight: 500;
  }
</style>
