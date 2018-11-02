<template>
  <x-page title="开户基本信息统计" breadcrumb="auto">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <div slot="header" style="display: flex;align-items: center;justify-content: space-between;">
        <div style="font-size: 16px;">周期统计</div>
        <div>
          <span>统计周期：</span>
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            size="mini"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <el-row class="card-rows">
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="完成开户总数" :count="cycle.orderCount"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="开户中总数" :count="cycle.orderWaitingCount"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="已收押金总额" :count="cycle.depositAmount | currency"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="待收押金总额" :count="cycle.depositWaitingAmount | currency"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius mt-lg">
      <div slot="header" style="height: 28px;line-height: 28px;">
        <div style="font-size: 16px;">平台统计</div>
      </div>
      <el-row class="card-rows">
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="站点总数" :count="companyCount"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="正常站点数" :count="companyNormalCount"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="禁用总数" :count="companyDisableCount"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="开户中总数" :count="companyWaitingCount"/>
        </el-col>
      </el-row>
    </el-card>
    <el-row class="mt-lg">
      <el-col :span="12">
        <el-card v-if="goodsCharts" shadow="never" class="el-card-mini no-box-shadow no-border-radius mr-sm">
          <e-charts :options="goodsCharts"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if="sourceTaxCharts" shadow="never" class="el-card-mini no-box-shadow no-border-radius ml-sm">
          <e-charts :options="sourceTaxCharts"/>
        </el-card>
      </el-col>
    </el-row>
  </x-page>
</template>

<script>
import ECharts from 'vue-echarts'
import IndexWorkerCard from '../../components/IndexWorkerCard'
export default {
  name: 'account-base-statistics',
  components: {IndexWorkerCard, ECharts},
  data(){
    let date = new Date()
    return {
      dateRange: [`${date.getFullYear()}-${date.getMonth() + 1}-01`, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`],
      companyCount: 412,
      companyDisableCount: 129,
      companyNormalCount: 283,
      companyWaitingCount: 4,
      goodsDatas: [],
      sourceTaxDatas: [],
      goodsCharts: null,
      sourceTaxCharts: null,
      cycle: {}
    }
  },
  watch: {
    dateRange(val){
      if (val) {
        this.loadCycle()
      }
    }
  },
  methods: {
    async loadData(){
      try {
        const res = await this.$$main.statisticsAOIndex({})
        this.companyCount = res.companyCount
        this.companyDisableCount = res.companyDisableCount
        this.companyNormalCount = res.companyNormalCount
        this.companyWaitingCount = res.companyWaitingCount
        if (res && res.goodsDatas) {
          let goods = []
          res.goodsDatas.forEach(item => {
            goods.push({name: item.key, value: item.value})
          })
          this.goodsCharts = {
            title: {
              text: '税管家产品占比',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: goods.map(item => item.name)
            },
            series: [
              {
                name: '产品',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: goods,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        }
        if (res && res.sourceTaxDatas) {
          let sourceTaxs = []
          res.sourceTaxDatas.forEach(item => {
            sourceTaxs.push({name: item.key, value: item.value})
          })
          this.sourceTaxCharts = {
            title: {
              text: '税源地占比',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: sourceTaxs.map(item => item.name)
            },
            series: [
              {
                name: '税源地',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: sourceTaxs,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async loadCycle(){
      if (!this.dateRange || !this.dateRange.length) {
        this.$message.error('请选择时间')
        return
      }
      try {
        this.cycle = await this.$$main.statisticsAOCycle({
          'beginTime': this.dateRange[0],
          'endTime': this.dateRange[1]
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onPageShow(){
      this.loadCycle()
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
  #x-page-account-base-statistics-body {
    .echarts {
      width: 100%;
    }
    .card-wrap{
      padding-right: 12px;
      padding-left: 12px;
    }
    .card-wrap:first-child{
      padding-left:0;
    }
    .card-rows:last-child .el-col{
      padding-right: 0;
    }
    .el-card-mini .el-card__header {
      padding: 6px;
    }
  }
</style>
