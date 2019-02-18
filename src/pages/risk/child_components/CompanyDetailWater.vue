<template>
  <div>
    <el-card class="el-card-mini no-box-shadow" style="border-width: 1px;border-radius: 0;">
      <div slot="header">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          流水合计
          <div>
            周期
            <el-date-picker
              v-model="total_flow_date"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <table class="detail-table" v-if="sumWater">
        <tr>
          <td>合计贷方发生额</td>
          <td>{{sumWater.sumInAmount | currency}}</td>
          <td>合计借方发生额</td>
          <td>{{sumWater.sumOutAmount | currency}}</td>
        </tr>
        <tr>
          <td>合计交易次数</td>
          <td>{{sumWater.tradeCount}}</td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </el-card>
    <el-card class="el-card-mini no-box-shadow" style="border-width: 1px;margin-top: 10px;border-radius: 0;">
      <div slot="header">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          流水统计
          <div>
            周期
            <el-date-picker
              v-model="flow_statistics_date"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <el-table v-if="waterStatistics"
                :border="true"
                :highlight-current-row="true"
                size="mini"
                :data="waterStatistics">
        <el-table-column label="交易方" prop="traderName"></el-table-column>
        <el-table-column label="贷方发生额合计" prop="sumInAmount" align="right">
          <span slot-scope="scope">{{scope.row.sumInAmount|currency('')}}</span>
        </el-table-column>
        <el-table-column label="借方发生额合计" prop="sumOutAmount" align="right">
          <span slot-scope="scope">{{scope.row.sumOutAmount|currency('')}}</span>
        </el-table-column>
        <el-table-column label="交易次数" prop="tradeCount" align="center"></el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="pz => pageSize = pz"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'company-detail-water',
  props: {
    companyId: Number
  },
  data(){
    return {
      flow_statistics_date: '',
      total_flow_date: '',
      waterStatistics: null,
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0,
      flowStatBeginTime: '',
      flowStatEndTime: '',
      sumWater: null,
      flowTotalBeginTime: '',
      flowTotalEndTime: ''
    }
  },
  watch: {
    companyId(){
      if (this.companyId) {
        this.loadSumWater()
        this.loadCompanyStatisticsWater()
      }
    },
    flow_statistics_date(val){
      if (val && val.length > 0) {
        this.flowStatBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.flowStatEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
      } else {
        this.flowStatBeginTime = ''
        this.flowStatEndTime = ''
      }
      if (this.pageIndex !== 1) {
        this.pageIndex = 1
      } else {
        this.loadCompanyStatisticsWater()
      }
    },
    total_flow_date(val){
      if (val && val.length > 0) {
        this.flowTotalBeginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.flowTotalEndTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
      } else {
        this.flowTotalBeginTime = ''
        this.flowTotalEndTime = ''
      }
      this.loadSumWater()
    },
    pageSize(){
      this.loadCompanyStatisticsWater()
    },
    pageIndex(){
      this.loadCompanyStatisticsWater()
    }
  },
  methods: {
    // 站点流水合计
    async loadSumWater(){
      try {
        const res = await this.$$main.companySumWater({
          'beginTime': this.flowTotalBeginTime,
          'endTime': this.flowTotalEndTime,
          'companyId': this.companyId
        })
        this.sumWater = res || null
      } catch (e) {
        console.log(e)
      }
    },
    async loadCompanyStatisticsWater(){
      try {
        const res = await this.$$main.companyStatisticsWater({
          'beginTime': this.flowStatBeginTime,
          'endTime': this.flowStatEndTime,
          companyId: this.companyId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        this.waterStatistics = res.datas
        this.totalCount = res.totalCount
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted(){
    if (this.companyId) {
      this.loadSumWater()
      this.loadCompanyStatisticsWater()
    }
  }
}
</script>

<style scoped>

</style>
