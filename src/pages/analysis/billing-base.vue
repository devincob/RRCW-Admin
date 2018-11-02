<template>
  <x-page title="基本信息统计" breadcrumb="auto">
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
          <index-worker-card title="订单总数" :count="cycle.orderCount"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="已完成订单数" :count="cycle.orderOverCount"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="开票站点" :count="cycle.companyCount"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="首单客户数" :count="cycle.newCustomerCount"/>
        </el-col>
      </el-row>
      <el-row class="card-rows mt-lg">
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="开票总金额" :count="cycle.sumInvoiceAmount | currency"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="服务费总金额" :count="cycle.sumServiceAmoune | currency"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="待收服务费金额" :count="cycle.sumWaitingServiceAmount | currency"/>
        </el-col>
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="税额" :count="cycle.sumTaxAmount | currency"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius mt-lg">
      <div slot="header" style="height: 28px;line-height: 28px;">
        <div style="font-size: 16px;">平台统计</div>
      </div>
      <el-row class="card-rows">
        <el-col :span="6" class="card-wrap">
          <index-worker-card title="订单总数" :count="orderCount"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="开票总金额" :count="sumInvoiceAmount | currency"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="服务费总金额" :count="sumServiceAmount | currency"/>
        </el-col>

        <el-col :span="6" class="card-wrap">
          <index-worker-card title="总税额" :count="sumTaxAmount | currency"/>
        </el-col>
      </el-row>
      <el-row class="mt-lg">
        <el-col :span="12">
          <el-card shadow="never" class="el-card-mini no-box-shadow no-border-radius mr-sm">
            <e-charts v-if="goodsCharts" :options="goodsCharts"/>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never" class="el-card-mini no-box-shadow no-border-radius ml-sm">
            <e-charts v-if="sourceTaxCharts" :options="sourceTaxCharts"/>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </x-page>
</template>

<script>
import IndexWorkerCard from '../../components/IndexWorkerCard'
import ECharts from 'vue-echarts'
export default {
  name: 'billing-base',
  components: {ECharts, IndexWorkerCard},
  data(){
    let date = new Date()
    return {
      dateRange: [`${date.getFullYear()}-${date.getMonth() + 1}-01`, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`],
      sumInvoiceAmount: 0,
      sumServiceAmount: 0,
      sumTaxAmount: 0,
      orderCount: 0,
      cycle: {},
      goodsCharts: null,
      sourceTaxCharts: null
    }
  },
  watch: {
    dateRange(val){
      val && this.loadCycle()
    }
  },
  methods: {
    async loadData(){
      try {
        const res = await this.$$main.statisticsIOIndex()
        if (res && res.orderCount) {
          this.orderCount = res.orderCount
          this.sumInvoiceAmount = res.sumInvoiceAmount
          this.sumServiceAmount = res.sumServiceAmount
          this.sumTaxAmount = res.sumTaxAmount
        }
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
        this.cycle = await this.$$main.statisticsIOCycle({
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
  #x-page-billing-base-body {
    .echarts {
      width: 100%;
    }
    .card-wrap{
      padding-right: 6px;
      padding-left: 6px;
    }
    .card-wrap:first-child{
      padding-left:0;
    }
    .el-col:last-child{
      padding-right: 0;
    }
    .el-card-mini .el-card__header {
      padding: 6px;
    }
  }
</style>
