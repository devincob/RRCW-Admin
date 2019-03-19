<template>
  <x-page breadcrumb="auto" style="padding:24px 12px;" title="斜杠兼职管理系统">
    <el-row>
      <el-col v-for="item in 4" :key="item" :span="6" style="padding-right: 12px;padding-left: 12px;">
        <el-card class="el-card-mini no-border-radius no-box-shadow">
          <div class="chartCard___UIZrG">
            <div class="chartTop___12THo">
              <div class="avatar___3-D5e"></div>
              <div class="metaWrap___2qUnZ">
                <div class="meta___39rjj"><span>今日新增B端用户</span><span class="action___1zsmB"><i
                  class="anticon anticon-info-circle-o"></i></span></div>
                <div class="total___2GhVz">{{Math.ceil(12561 * item * Math.random())}}人</div>
              </div>
            </div>
            <div class="content___2bOfA" style="height: 46px;">
              <div class="contentFixed___nL801">
                <div class="trendItem___2r2dT" title="" style="margin-right: 16px;"><span>周同比<span
                  class="trendText___HsrVC">{{(12 * item * Math.random() * 10).toFixed(2)}}%</span></span><span class="up___2EwY8"><i
                  class="anticon anticon-caret-up"></i></span></div>
                <div class="trendItem___2r2dT" title=""><span>日环比<span class="trendText___HsrVC">{{(11 * item * Math.random() * 10).toFixed(2)}}%</span></span><span
                  class="down___35xDq"><i class="anticon anticon-caret-down"></i></span></div>
              </div>
            </div>
            <div class="footer___2qHVO">
              <div class="field___9S4u4"><span>日均销售额</span><span>￥12,423</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="padding: 12px;">
        <el-card class="el-card-mini no-box-shadow no-border-radius mt-lg">
          <div style="position: absolute;right: 24px;z-index: 1;">
            <el-select v-model="year" size="mini" placeholder="请选择年份">
              <el-option
                label="2018"
                value="2018">
              </el-option>
              <el-option
                label="2017"
                value="2017">
              </el-option>
            </el-select>
          </div>
          <e-chart ref="charts" :options="chartData" style="width: 100%;height: 400px;"/>
        </el-card>
      </el-col>
    </el-row>
  </x-page>
</template>
<script>
import HelloWorld from '../components/HelloWorld'
import TableDemo from '../components/TableDemo'

const colors = ['#d06324', '#3C7ED2']
export default {
  components: {
    TableDemo,
    HelloWorld
  },
  name: 'index',
  data () {
    return {
      chartData: {
        title: {
          text: '订单量统计图'
        },
        color: colors,
        legend: {
          data: ['金额/元', '订单量']
        },
        grid: [{left: 65, right: 45}],
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额',
            min: 0,
            max: 326 * 100,
            axisLabel: {
              formatter: '￥{value}'
            },
            position: 'left'
          },
          {
            type: 'value',
            name: '订单量',
            min: 0,
            max: 1000,
            axisLabel: {
              formatter: '{value}'
            },
            position: 'right'
          }
        ],
        series: [
          {
            name: '金额/元',
            type: 'line',
            yAxisIndex: 0,
            data: [12.0, 4.9, 117.0, 23.2, 325.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3].map(i => i * 99)
          },
          {
            name: '订单量',
            type: 'bar',
            barMaxWidth: 30,
            yAxisIndex: 1,
            data: [12.0, 4.9, 117.0, 23.2, 325.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          }
        ]
      },
      year: '2018'
    }
  },
  watch: {
    year() {
      this.$refs.charts.mergeOptions({
        series: [
          {
            name: '金额/元',
            type: 'line',
            yAxisIndex: 0,
            data: [12.0, 4.9, 117.0, 23.2, 325.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3].map(i => i * 99 * Math.random())
          },
          {
            name: '订单量',
            type: 'bar',
            barMaxWidth: 30,
            yAxisIndex: 1,
            data: [12.0, 4.9, 117.0, 23.2, 325.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3].map(i => i * Math.random())
          }
        ]
      })
    }
  },
  methods: {
    onPageShow () {
    },
    onPageResize(){
      this.$refs.charts.resize()
    }
  }
}
</script>
<style>
  .chartCard___UIZrG {
    position: relative
  }

  .chartCard___UIZrG .chartTop___12THo {
    position: relative;
    overflow: hidden;
    width: 100%
  }

  .chartCard___UIZrG .chartTopMargin___1CrSt {
    margin-bottom: 12px
  }

  .chartCard___UIZrG .chartTopHasMargin___11yq_ {
    margin-bottom: 20px
  }

  .chartCard___UIZrG .metaWrap___2qUnZ {
    float: left
  }

  .chartCard___UIZrG .avatar___3-D5e {
    position: relative;
    top: 4px;
    float: left;
    margin-right: 20px
  }

  .chartCard___UIZrG .avatar___3-D5e img {
    border-radius: 100%
  }

  .chartCard___UIZrG .meta___39rjj {
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    line-height: 22px;
    height: 22px
  }

  .chartCard___UIZrG .action___1zsmB {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0
  }

  .chartCard___UIZrG .total___2GhVz {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: rgba(0, 0, 0, .85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px
  }

  .chartCard___UIZrG .content___2bOfA {
    margin-bottom: 12px;
    position: relative;
    width: 100%
  }

  .chartCard___UIZrG .contentFixed___nL801 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%
  }

  .chartCard___UIZrG .footer___2qHVO {
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px
  }

  .chartCard___UIZrG .footer___2qHVO > * {
    position: relative
  }

  .chartCard___UIZrG .footerMargin___2-daU {
    margin-top: 20px
  }
</style>
