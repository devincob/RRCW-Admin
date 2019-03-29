<template>
  <div>
    <el-table
      size="mini"
      :data="orders"
      :border="true"
      :highlight-current-row="true"
      style="width: 100%">
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="200">
        <div slot-scope="scope">
          <router-link
            :to="(scope.row.workflowId === 0 ? '/order/invoice-order-create?orderid=' : '/order/invoice-order-details?orderid=') + scope.row.orderId"
            target="_blank">{{scope.row.orderNo}}</router-link>
          <el-tag
            size="mini"
            v-if="scope.row.isPriority === 'Y'"
            type="danger">急</el-tag>
        </div>
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="客户姓名"/>
      <el-table-column
        prop="companyName"
        label="站点名称">
        <span slot-scope="scope" :title="scope.row.companyName">{{scope.row.companyName}}</span>
      </el-table-column>
      <el-table-column
        prop="sourceTaxName"
        label="税源地"/>
      <el-table-column
        prop="goodsName"
        label="商品"/>
      <el-table-column
        prop="totalAmount"
        label="发票类型">
        <span slot-scope="scope">{{scope.row.invoiceTypeName}}</span>
      </el-table-column>
      <el-table-column
        prop="realDepositFee"
        label="开票金额">
        <span slot-scope="scope">{{scope.row.invoiceAmount | currency}}</span>
      </el-table-column>
      <el-table-column
        prop="workflowName"
        label="状态">
        <template slot-scope="scope">
          {{scope.row.workflowName}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="createTime" label="下单日期"/>-->
    </el-table>
    <div class="text-right" v-if="totalCount">
      <el-pagination
        class="mt-sm"
        :page-sizes="[10, 20, 40, 60, 80]"
        :page-size="pageSize"
        :current-page="pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="(size) => this.pageSize = size"
        @current-change="(index) => this.pageIndex = index">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AchievementTabOrders',
  props: {
    beginTime: String,
    endTime: String,
    queryType: String
  },
  data(){
    return {
      orders: [],
      totalCount: 0,
      pageSize: 20,
      pageIndex: 1
    }
  },
  watch: {
    beginTime(){
      this.loadAchievementBussinessOrders()
    },
    endTime(){
      this.loadAchievementBussinessOrders()
    },
    pageIndex() {
      this.loadAchievementBussinessOrders()
    },
    pageSize() {
      this.loadAchievementBussinessOrders()
    }
  },
  methods: {
    async loadAchievementBussinessOrders(){
      const $loader = this.$loading()
      try {
        const res = await this.$$main.achievementBussinessOrders({
          beginTime: this.beginTime,
          endTime: this.endTime,
          queryType: this.queryType,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        })
        this.orders = res.datas
        this.totalCount = res.totalCount
        this.$emit('data-loaded', res)
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        $loader && $loader.close()
      }
    }
  },
  mounted(){
    this.loadAchievementBussinessOrders()
  }
}
</script>

<style scoped>

</style>
