<template>
  <x-page title="我的业绩" breadcrumb="auto">
    <el-card class="no-box-shadow">
      <el-form size="mini" inline>
        <el-form-item label="日期">
          <el-date-picker v-model="dateValue"
                          value-format="yyyy-MM-dd"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          range-separator="至" style="width: 230px;"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="font-size: 14px;line-height: 30px;">
        <div>订单总数 <span class="num">{{abData.orderCount}}单</span> / 进行中 <span class="num">{{abData.orderDoingCount}}单</span> / 已完成 <span class="num">{{abData.orderCompletedCount}}单</span></div>
        <div>订单金额 <span class="num">{{abData.orderAmount}}万</span> / 待确认 <span class="num">{{abData.orderDoingAmount}}万</span> / 已确认 <span class="num">{{abData.orderCompletedAmount}}万</span>
        </div>
      </div>
    </el-card>

    <el-tabs type="border-card" v-model="tabActive" class="no-box-shadow mt-sm el-tabs-performance">
      <el-tab-pane name="1" :label="'待我处理' + (info ? '（'+info.WaitMyHandleCount+'）' : '')">
        <achievement-tab-orders v-if="tabActive === '1'" @data-loaded="onDataLoaded" :begin-time="beginTime" :end-time="endTime" query-type="1"/>
      </el-tab-pane>
      <el-tab-pane name="2" :label="'财务收款' + (info ? '（'+info.WaitRecieveCount+'）' : '')">
        <achievement-tab-orders v-if="tabActive === '2'" @data-loaded="onDataLoaded" :begin-time="beginTime" :end-time="endTime" query-type="2"/>
      </el-tab-pane>
      <el-tab-pane name="3" :label="'交易员处理' + (info ? '（'+info.WaitHandleCount+'）' : '')">
        <achievement-tab-orders v-if="tabActive === '3'" @data-loaded="onDataLoaded" :begin-time="beginTime" :end-time="endTime" query-type="3"/>
      </el-tab-pane>
      <el-tab-pane name="4" :label="'已完成' + (info ? '（'+info.CompletedCount+'）' : '')">
        <achievement-tab-orders v-if="tabActive === '4'" @data-loaded="onDataLoaded" :begin-time="beginTime" :end-time="endTime" query-type="4"/>
      </el-tab-pane>
    </el-tabs>
  </x-page>
</template>

<script>
import AchievementTabOrders from './AchievementTabOrders'
function getCurrentMonthFirst() {
  let date = new Date()
  date.setDate(1)
  return date
}

function getCurrentMonthLast() {
  let date = new Date()
  let currentMonth = date.getMonth()
  let nextMonth = ++currentMonth
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  let oneDay = 1000 * 60 * 60 * 24
  return new Date(nextMonthFirstDay - oneDay)
}

export default {
  name: 'my-performance',
  components: {AchievementTabOrders},
  data() {
    let beginTime = this.$utils.dateFormat(getCurrentMonthFirst(), 'yyyy-MM-dd')
    let endTime = this.$utils.dateFormat(getCurrentMonthLast(), 'yyyy-MM-dd')
    return {
      dateValue: [beginTime, endTime],
      beginTime: beginTime,
      endTime: endTime,
      tabActive: '1',
      abData: {
        'orderCount': 0,
        'orderDoingCount': 0,
        'orderCompletedCount': 0,
        'orderAmount': 0,
        'orderDoingAmount': 0,
        'orderCompletedAmount': 0
      },
      info: {}
    }
  },
  // watch: {
  //   dateValue(val) {
  //     if (val && val.length) {
  //       this.beginTime = val[0]
  //       this.endTime = val[1]
  //       this.loadAchievementBussiness()
  //     }
  //   }
  // },
  methods: {
    async loadAchievementBussiness(){
      try {
        this.abData = await this.$$main.achievementBussinessData({
          'beginTime': this.beginTime,
          'endTime': this.endTime
        })
        // Object.keys(res).forEach(key => {
        //   this.abData[key] = key.endsWith('Amount') ? res[key] / 10000 : res[key]
        // })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onDataLoaded(data){
      if (data && data.funcResult) {
        let info = {}
        data.funcResult.forEach(item => {
          info[item.key] = item.value
        })
        this.info = info
      }
    },
    onSearchClick(){
      this.beginTime = this.dateValue[0]
      this.endTime = this.dateValue[1]
      this.loadAchievementBussiness()
    }
  },
  async mounted(){
    this.loadAchievementBussiness()
    // this.loadAchievementBussinessOrders()
  }
}
</script>

<style lang="scss">
  #x-page-my-performance-body {
    .el-tabs__content {
      min-height: 400px;
    }
    .num {
      font-family: BTC-NUM, serif;
      font-size: 20px;
    }
  }
</style>
