<template>
  <x-page breadcrumb="auto" title="收入统计">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-number-input v-model="searchForm.mobile" placeholder="手机号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="服务者">
          <el-input v-model="searchForm.userName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="订单月份">
          <el-date-picker
            v-model="orderMonth"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        stripe
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>
        <el-table-column label="订单月份" prop="orderMonth"/>
        <el-table-column label="服务者" prop="userName"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="订单数" prop="orderCount"/>
        <el-table-column label="收入金额" prop="receiveAmount">
          <span slot-scope="scope">{{scope.row.receiveAmount | currency}}</span>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button @click="onViewDetailClick(scope.row)" type="text" size="mini" class="no-padding">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          :current-page.sync="pageIndex"
          @size-change="(size) => this.pageSize = size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog v-drag-dialog
               width="900px"
               title="收入明细"
               :visible.sync="centerDialogVisible">
      <div ref="dialogContent" style="min-height: 300px">
        <el-table v-if="statDetailsList && statDetailsList.totalCount"
                  :data="statDetailsList.datas">
          <el-table-column label="下单时间" prop="formatCreateTime" width="160"/>
          <el-table-column label="支付时间" prop="formatPayTime" width="160"/>
          <el-table-column label="订单号" prop="orderNo" width="180"/>
          <el-table-column label="订单金额" prop="payAmount">
            <span slot-scope="scope">{{scope.row.payAmount | currency}}</span>
          </el-table-column>
          <el-table-column label="公司名称" prop="companyName"/>
          <el-table-column label="财务确认人" prop="logUserName"/>
        </el-table>
      </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'user-stat',
  data(){
    return {
      searchForm: {
        'mobile': '',
        'userName': '',
        'beginMonth': '',
        'endMonth': ''
      },
      orderMonth: [],
      loading: false,
      totalCount: 0,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      centerDialogVisible: false,
      statDetailsList: undefined
    }
  },
  watch: {
    pageIndex(){
      this.loadStats()
    },
    pageSize(){
      this.loadStats()
    },
    orderMonth(months){
      this.searchForm.beginMonth = months ? this.$utils.dateFormat(months[0], 'yyyy-MM-dd') : ''
      this.searchForm.endMonth = months ? this.$utils.dateFormat(months[1], 'yyyy-MM-dd') : ''
    }
  },
  methods: {
    onSearchClick(){
      this.loadStats()
    },
    async onViewDetailClick(row){
      this.centerDialogVisible = true
      const loader = this.$loading({text: '加载中', target: this.$refs.dialogContent})
      this.statDetailsList = undefined
      try {
        this.statDetailsList = await this.$$main.aFinanceCIncomeList({
          'userId': row.userId,
          'time': (row.orderMonth || '2000-01') + '-01',
          pageSize: 1000
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    async loadStats(){
      this.loading = true
      try {
        const result = await this.$$main.aFinanceCStatisList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchForm
        })
        this.totalCount = result.totalCount
        this.tableData = result.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  },
  mounted(){
    this.loadStats()
  }
}
</script>

<style scoped>

</style>
