<template>
  <x-page breadcrumb="auto" title="事件管理">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input placeholder="请填写订单号" v-model="form.orderSubNoCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select placeholder="请填写订单状态" v-model="form.statusCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="未处理" value="P"/>
              <el-option label="已处理" value="C"/>
              <el-option label="不处理" value="N"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        :border="true"
        :highlight-current-row="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          prop="eventId"
          label="事件编号"
          min-width="40">
          <template slot-scope="scope">
            <a :href="`/caiwu/event-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.eventId}}
            </a>
          </template>
        </el-table-column>
        <el-table-column fixed prop="orderNo"  label="标题/订单编号" min-width="120">
          <template slot-scope="scope">
            <!--<div>{{scope.row.orderTitle}}123</div>-->
            <div>{{scope.row.orderTitle}}</div>
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusText"
          label="事件状态"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="lastUserName"
          label="最后处理人"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="最后处理时间"
          min-width="100">
        </el-table-column>
        <el-table-column minWidth="40" label="操作">
          <!--默认显示详细，后面审核后显示审核者名称-->
          <template slot-scope="scope">
            <a :href="`/caiwu/event-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              <el-button size="mini" type="primary" >详情</el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
  </x-page>
</template>

<script>
export default {
  name: 'event-management',
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      insertLoading: false,
      insertLoading2: false,
      centerDialogVisible: false,
      rulesFixOrder: {
        remark: [
          { required: true, message: '处理结果不能为空', trigger: 'change' }
        ]
      },
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderSubId: '',
        orderSubNoCondition: '',
        statusCondition: 'P'
      }
    }
  },
  watch: {
    'form.pageIndex': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    async queryOrderList() {
      try {
        this.loading = true
        const data = await this.$$main.orderQueryListEvent(this.form)
        this.loading = false
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        this.loading = false
        e.message && this.$message.error(e.message)
      }
    },
    onPageShow() {
      this.queryOrderList()
    },
    clearQueryParams(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        orderSubId: '',
        orderSubNoCondition: '',
        statusCondition: 'P'
      }
      this.queryOrderList()
    }
  },
  mounted() {
  }
}
</script>
