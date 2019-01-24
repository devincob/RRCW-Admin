<template>
  <x-page
    breadcrumb="auto"
    class="index-page"
    style="padding:24px 12px;"
    title="人人财务交易管理系统"
  >
    <!--<el-row>-->
    <!--<el-col :span="6" style="padding-right: 12px;padding-left: 12px;">-->
    <!--<IndexStatCard title="今日新增开户订单" popover="今日内新提交的开户订单数量" :valueCount="stat.aoCount"/>-->
    <!--</el-col>-->
    <!--<el-col :span="6" style="padding-right: 12px;padding-left: 12px;">-->
    <!--<IndexStatCard title="本月完成开户订单" popover="当前自然月内完成的开户订单数量" :valueCount="stat.aoCompletedCount"/>-->
    <!--</el-col>-->
    <!--<el-col :span="6" style="padding-right: 12px;padding-left: 12px;">-->
    <!--<IndexStatCard title="今日新增开票订单" popover="今日内新提交的开票订单数量" :valueCount="stat.ioCount"/>-->
    <!--</el-col>-->
    <!--<el-col :span="6" style="padding-right: 12px;padding-left: 12px;">-->
    <!--<IndexStatCard title="本月完成开票订单" popover="当前自然月内完成的开票订单数量" :valueCount="stat.ioCompletedCount"/>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-row>
      <el-col
        :span="24"
        style="padding: 0 12px;"
      >
        <el-card class="my-card-table el-card-mini">
          <div slot="header"><span
              style="font-size: 14px;"
              class="text-bold"
            >待处理开户订单</span></div>
          <el-table
            size="mini"
            :data="tableData"
            :border="true"
            :highlight-current-row="true"
          >
            <el-table-column
              prop="orderNo"
              label="订单号"
              width="200"
            >
              <div slot-scope="scope">
                <router-link
                  :to="(scope.row.workflowId === 0 ? '/order/account-order-create?orderid=' : '/order/account-order-details?orderid=') + scope.row.orderId"
                  target="_blank"
                >{{scope.row.orderNo}}</router-link>
                <el-tag
                  size="mini"
                  v-if="scope.row.isPriority === 'Y'"
                  type="danger"
                >急</el-tag>
              </div>
            </el-table-column>
            <el-table-column
              prop="createAdminUserName"
              label="创建人"
            />
            <el-table-column
              prop="customerName"
              label="客户姓名"
            />
            <el-table-column
              prop="sourceTaxName"
              label="税源地"
            />
            <el-table-column
              prop="goodsName"
              label="商品"
            />
            <el-table-column
              prop="totalAmount"
              label="交易费"
            >
              <span slot-scope="scope">{{scope.row.totalAmount | currency}}</span>
            </el-table-column>
            <el-table-column
              prop="realDepositFee"
              label="押金"
            >
              <span slot-scope="scope">{{scope.row.realDepositFee | currency}}</span>
            </el-table-column>
            <el-table-column
              prop="workflowName"
              label="状态"
              :render-header="renderAccountStatusHeader"
            >
              <template slot-scope="scope">
                {{scope.row.workflowName}}
                <el-button
                  type="text"
                  @click="onRemoveOrder(scope.row, 'AO')"
                  v-if="scope.row.workflowId === 0"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
            <!--<el-table-column prop="createTime" label="下单日期"/>-->
          </el-table>
        </el-card>
      </el-col>
      <el-col
        :span="24"
        style="padding: 0 12px;"
      >
        <el-card class="my-card-table el-card-mini ">
          <div slot="header"><span
              style="font-size: 14px;"
              class="text-bold"
            >待处理开票订单</span></div>
          <el-table
            size="mini"
            :data="tableData2"
            :border="true"
            :highlight-current-row="true"
            style="width: 100%"
          >
            <el-table-column
              prop="orderNo"
              label="订单号"
              width="200"
            >
              <div slot-scope="scope">
                <router-link
                  :to="(scope.row.workflowId === 0 ? '/order/invoice-order-create?orderid=' : '/order/invoice-order-details?orderid=') + scope.row.orderId"
                  target="_blank"
                >{{scope.row.orderNo}}</router-link>
                <el-tag
                  size="mini"
                  v-if="scope.row.isPriority === 'Y'"
                  type="danger"
                >急</el-tag>
              </div>
            </el-table-column>
            <el-table-column
              prop="createAdminUserName"
              label="创建人"
            />
            <el-table-column
              prop="customerName"
              label="客户姓名"
            />
            <el-table-column
              prop="companyName"
              label="站点名称"
            >
              <span
                slot-scope="scope"
                :title="scope.row.companyName"
              >{{scope.row.companyName}}</span>
            </el-table-column>
            <!--<el-table-column prop="companyName" label="站点名称" min-width="200">-->
            <!--<company-details-dialog slot-scope="scope" :company-id="scope.row.companyId">-->
            <!--<span>{{scope.row.companyName}}</span>-->
            <!--</company-details-dialog>-->
            <!--</el-table-column>-->
            <el-table-column
              prop="sourceTaxName"
              label="税源地"
            />
            <el-table-column
              prop="goodsName"
              label="商品"
            />
            <el-table-column
              prop="totalAmount"
              label="发票类型"
            >
              <span slot-scope="scope">{{scope.row.invoiceTypeName}}</span>
            </el-table-column>
            <el-table-column
              prop="realDepositFee"
              label="开票金额"
            >
              <span slot-scope="scope">{{scope.row.invoiceAmount | currency}}</span>
            </el-table-column>
            <el-table-column
              prop="workflowName"
              label="状态"
              :render-header="renderInvoiceStatusHeader"
            >
              <template slot-scope="scope">
                {{scope.row.workflowName}}
                <el-button
                  type="text"
                  @click="onRemoveOrder(scope.row, 'IO')"
                  v-if="scope.row.workflowId === 0"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
            <!--<el-table-column prop="createTime" label="下单日期"/>-->
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </x-page>
</template>
<script>
import IndexStatCard from '../components/IndexStatCard'
import CompanyDetailsDialog from '../components/ExpressInfoDialog'

export default {
  components: {
    CompanyDetailsDialog,
    IndexStatCard
  },
  name: 'index',
  data() {
    return {
      stat: {
        aoCompletedCount: 0,
        aoCount: 0,
        ioCompletedCount: 0,
        ioCount: 0
      },
      tableData: [],
      tableData2: []
    }
  },
  watch: {
  },
  methods: {
    onPageShow() {
      this.loadStat()
      this.loadList()
    },
    loadList() {
      this.$$main.indexAOForHandle().then(res => {
        this.tableData = res
      })
      this.$$main.indexIOForHandle().then(res => {
        this.tableData2 = res
      })
    },
    async loadStat() {
      try {
        this.stat = await this.$$main.indexData()
      } catch (e) {
        console.log(e)
      }
    },
    renderAccountStatusHeader(h, { column }) {
      return h({
        template: `<span>${column.label}<el-popover
            trigger="hover">
            <span style="font-size: 12px;">${`订单流程状态说明：
O订单开始
->商务提交订单：商务人员填写下单信息
->待直属领导审批：审批下单信息
->待CEO审批：审批特殊需求
->待跟单处理：跟进订单信息
->待客服确认：客服想客户确认订单信息
->待财务收款：财务根据收款处理订单
->待交易员处理：交易人员根据订单拟定站点注册信息
->待交易员更新进度：交易员更新站点的注册信息至系统
->待交易员验收：站点注册成功后，交易员验收站点材料
->待商务交付：将站点材料交付至客户
->待跟单归档：跟单人员将订单信息纸质化归档
->待客服回访：客服电话回访客户
O订单完成`.replace(/\n/g, '<br>')}</span>
            <i class="el-icon-question" style="font-size: 16px;cursor: pointer;color: #303133" slot="reference"></i>
          </el-popover></span>`
      })
    },
    renderInvoiceStatusHeader(h, { column }) {
      return h({
        template: `<span>${column.label}<el-popover
            trigger="hover">
            <span style="font-size: 12px;">${`订单流程状态说明：
O订单开始
->商务提交订单：商务人员填写下单信息
->待直属领导审批：审批下单信息
->待CEO审批：审批特殊需求
->待跟单处理：跟进订单信息
->待客服确认：客服想客户确认订单信息
->待财务收款：财务根据收款处理订单
->待交易员更新处理：交易员更新发票信息
->待跟单确认处理：跟单确认客户是否收到发票
->待客服回访：客服电话回访客户
O订单完成`.replace(/\n/g, '<br>')}</span>
            <i class="el-icon-question" style="font-size: 16px;cursor: pointer;color: #303133" slot="reference"></i>
          </el-popover></span>`
      })
    },
    async onRemoveOrder(row, type) {
      const opt = await this.$confirm('确定要删除草稿吗？', '删除提示')
      if (opt === 'confirm') {
        const loader = this.$loading()
        try {
          const res = await (type === 'AO' ? this.$$main.orderAODelete({ orderId: row.orderId }) : this.$$main.orderIODelete({ orderId: row.orderId }))
          loader.close()
          if (res) {
            this.$message.success('已删除草稿')
            this.loadList()
          }
        } catch (e) {
          loader.close()
          this.$message.error(e.message)
        }
      }
    }
  },
  mounted() {
  }
}
</script>
<style>
.my-card-table .el-card__body {
  padding: 10px;
}
.my-card-table .el-table--mini .el-table__empty-block {
  min-height: 100px;
}
.index-page .el-table--mini .el-button--mini {
  padding: 0;
}
</style>
