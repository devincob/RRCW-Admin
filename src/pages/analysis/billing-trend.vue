<template>
  <x-page title="订单走势分析" breadcrumb="auto">
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
      <div v-if="orderCharts">
        <e-charts :options="orderCharts"/>
      </div>
      <div v-if="depositCharts" class="mt-lg">
        <e-charts :options="depositCharts"/>
      </div>
    </el-card>
  </x-page>
</template>

<script>
import ECharts from 'vue-echarts'
import {currency} from '../../libs/filters'
export default {
  name: 'billing-trend',
  components: {ECharts},
  data(){
    const cYear = new Date().getFullYear()
    return {
      year: cYear,
      type: '2',
      orderCharts: null,
      depositCharts: null,
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
        const res = await this.$$main.statisticsIOAnalysis({
          'year': this.year,
          'type': this.type
        })
        if (res && res.ioAnalysisDatas) {
          let deposits = []
          let orders = []
          let names = []
          res.ioAnalysisDatas.forEach(item => {
            names.push(item.key)
            orders.push(item.sumInvoiceAmount)
            deposits.push(item.sumServiceAmount)
          })
          this.orderCharts = {
            title: {
              text: '交易额',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: function (o) {
                return `交易额 <br/>${o.name} : ${currency(o.value)}`
              }
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
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
              text: '服务费',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: function (o) {
                return `服务费 <br/>${o.name} : ${currency(o.value)}`
              }
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
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
