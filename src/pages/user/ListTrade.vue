<template>
  <el-card class="el-card-mini no-border-radius no-box-shadow list-trade">
    <div slot="header">账户资金明细 (资金账号: {{accountInfo.AccountCashId}}, 账户余额: {{accountInfo.Amount|currency}})</div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      ref="table"
      highlight-current-row
      :border="true"
      size="mini">
      <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

      <el-table-column label="编号" prop="tradeId" width="60"/>
      <el-table-column label="流水编号" prop="tradeNo" width="160"/>
      <el-table-column label="交易金额" prop="amount" width="80">
        <span slot-scope="scope" :class="{'text-success':scope.row.amount < 0, 'text-danger':scope.row.amount > 0}">{{scope.row.amount}}</span>
      </el-table-column>
      <el-table-column label="余额" prop="lastAmount"  width="80"/>
      <el-table-column label="交易内容" prop="tradeTitle" min-width="100"/>
      <el-table-column label="交易对象" prop="tradeUserName" min-width="80"/>
      <el-table-column label="交易时间" prop="showTradeTime" width="130"/>
    </el-table>
    <div class="text-right clearfix" style="padding: 0 5px 5px">
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
</template>

<script>
export default {
  name: 'list-trade',
  props: {
    userId: {
      type: [Number, String],
      default: 0
    },
    accountType: {
      type: String,
      default: 'W'
    }
  },
  data(){
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      accountInfo: {}
    }
  },
  watch: {
    pageIndex(){
      this.loadListTrade()
    },
    pageSize(){
      this.loadListTrade()
    },
    userId(){
      this.loadListTrade()
    }
  },
  methods: {
    async loadListTrade(){
      if (!this.userId) return
      try {
        this.loading = true
        const res = await this.$$main.userQueryListTrade({
          // 用户编号
          'accountUserId': this.userId,
          // 用户类型(C企业,W工人)
          'accountType': this.accountType,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        this.totalCount = res.totalCount
        this.tableData = res.datas
        if (res.funcResult && res.funcResult.length) {
          const info = {}
          res.funcResult.forEach(item => {
            info[item.key] = item.value
          })
          this.accountInfo = info
        }
        console.log(this.accountInfo)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  mounted(){
    this.loadListTrade()
  }
}
</script>

<style>
  .list-trade .el-card__body {
    padding: 0;
  }
  .list-trade .el-card__header {
    border-bottom: 0;
  }
</style>
