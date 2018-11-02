<template>
  <x-page title="订单占比分析" breadcrumb="auto">
    <el-card body-style="padding: 10px;position: relative;" class="el-card-mini no-box-shadow no-border-radius box-card">
      <div slot="header">
        <el-form inline size="mini">
          <el-form-item label="年度">
            <el-select :value="year" v-model="year">
              <el-option v-for="item in years" :value="item" :label="item" :key="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="维度">
            <el-select :value="dimension" v-model="dimension">
              <el-option label="月度" value="2"></el-option>
              <el-option label="季度" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button style="padding: 3px 0" @click="showTable=!showTable" type="text">{{showTable ? '切换至图表显示' : '切换至表格显示'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-col :span="12">
          <e-charts :options="orderCharts"/>
        </el-col>
        <el-col :span="12">
          <e-charts :options="depositCharts"/>
        </el-col>
      </el-row>
      <div class="show-table" v-show="showTable">
        <el-table
          :data="tableData"
          style="width: 100%;">
          <el-table-column
            prop="key"
            label="#"
            width="180">
          </el-table-column>
          <el-table-column prop="sumInvoiceAmount" label="交易额">
            <span slot-scope="scope">{{scope.row.sumInvoiceAmount | currency}}</span>
          </el-table-column>
          <el-table-column prop="sumServiceAmount" label="服务费金额">
            <span slot-scope="scope">{{scope.row.sumServiceAmount | currency}}</span>
          </el-table-column>
          <el-table-column prop="sumTaxAmount" label="税额">
            <span slot-scope="scope">{{scope.row.sumTaxAmount | currency}}</span>
          </el-table-column>
          <el-table-column
            prop="orderCount"
            label="订单数量">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </x-page>
</template>

<script>
import ECharts from 'vue-echarts'
import {currency} from '../../libs/filters'
export default {
  name: 'billing-order-share',
  components: {ECharts},
  data(){
    const cYear = new Date().getFullYear()
    return {
      showTable: false,
      year: cYear,
      dimension: '2',
      tableData: [],
      orders: [],
      deposits: [],
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
    dimension(){
      this.loadStat()
    },
    year(){
      this.loadStat()
    },
    orders(){
      this.orderCharts = {
        title: {
          text: '订单交易额每月占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.orders.map(item => item.name)
        },
        series: [
          {
            name: '订单数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.orders,
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
    },
    deposits(){
      this.depositCharts = {
        title: {
          text: '订单服务费每月占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (o) {
            return `${o.seriesName} <br/>${o.name} : ${currency(o.value)} (${o.percent}%)`
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.deposits.map(item => item.name)
        },
        series: [
          {
            name: '订单服务费',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.deposits,
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
  },
  methods: {
    async loadStat(){
      try {
        const res = await this.$$main.statisticsIOAnalysis({
          year: this.year,
          type: this.dimension
        })
        let orders = []
        let deposits = []
        if (res && res.ioAnalysisDatas) {
          res.ioAnalysisDatas.forEach(item => {
            orders.push({name: item.key, value: item.sumInvoiceAmount})
            deposits.push({name: item.key, value: item.sumServiceAmount})
          })
        }
        this.orders = orders
        this.deposits = deposits
        this.tableData = res.ioAnalysisDatas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onPageShow(){
      this.loadStat()
    }
  }
}
</script>

<style scoped>
  .echarts {
  }
  .el-card-mini .el-card__header {
    padding: 10px 12px 0 12px !important;
  }
  .show-table {
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    opacity: .94;
    overflow: auto;
  }
  .el-form-item--mini.el-form-item:not(.is-error), .el-form-item--small.el-form-item:not(.is-error) {
    margin-bottom: 0;
  }
</style>
