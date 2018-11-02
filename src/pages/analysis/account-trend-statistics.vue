<template>
  <x-page title="开户走势分析" breadcrumb="auto">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form size="mini" inline>
        <el-form-item label="年度">
          <el-select :value="year" v-model="year">
            <el-option v-for="item in years" :value="item" :label="item" :key="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="维度">
          <el-select :value="type" v-model="type">
            <el-option value="1" label="周"/>
            <el-option value="2" label="月"/>
            <el-option value="3" label="季"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <e-charts :options="orderCharts"/>
        <e-charts :options="depositCharts"/>
      </div>
    </el-card>
  </x-page>
</template>

<script>
import ECharts from 'vue-echarts'
import {currency} from '../../libs/filters'
export default {
  name: 'account-trend-statistics',
  components: {ECharts},
  data(){
    const cYear = new Date().getFullYear()
    return {
      year: cYear,
      type: '2',
      orderCharts: {},
      depositCharts: {},
      years: (function () {
        let years = []
        for (let i = 2018; i < 2018 + (cYear + 1 - 2018); i++) {
          years.push(i)
        }
        return years
      })()
    }
  },
  watch: {
    year(){
      this.loadData()
    },
    type(){
      this.loadData()
    }
  },
  methods: {
    async loadData(){
      try {
        const res = await this.$$main.statisticsAOAnalysis({
          'year': this.year,
          'type': this.type
        })
        if (res && res.aoAnalysisDatas) {
          let deposits = []
          let orders = []
          let names = []
          res.aoAnalysisDatas.forEach(item => {
            names.push(item.key)
            orders.push(item.orderCount)
            deposits.push(item.depositAmount)
          })
          this.orderCharts = {
            title: {
              text: '开户数量',
              x: 'center'
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: '数量 <br/>{b} : {c}'
            },
            dataZoom: this.type === '1' ? [{
              type: 'inside'
            }, {
              type: 'slider'
            }] : null,
            xAxis: {
              type: 'category',
              data: names
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: orders,
              type: 'line'
            }]
          }
          this.depositCharts = {
            title: {
              text: '押金收入',
              x: 'center'
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: function (o) {
                return `收入 <br/>${o.name} : ${currency(o.value)}`
              }
            },
            dataZoom: this.type === '1' ? [{
              type: 'inside'
            }, {
              type: 'slider'
            }] : null,
            xAxis: {
              type: 'category',
              data: names
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: function (value) {
                  return currency(value)
                }
              }
            },
            series: [{
              data: deposits,
              type: 'line'
            }]
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onPageShow(){
      this.loadData()
    }
  }
}
</script>

<style scoped>
  .echarts {
    width: 100%;
    height: 300px;
  }
</style>
