<template>
  <x-page breadcrumb="auto" title="未开票站点统计">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="站点名称">
          <el-input placeholder="请输入站点名称" v-model="form.companyName" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">搜索</el-button>
          <el-button type="danger" @click="clearQueryParams">清空</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :border="true"
        :highlight-current-row="true"
        size="mini"
        style="width: 100%;">
        <el-table-column fixed prop="companyName" label="站点名称" min-width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.companyName" placement="top">
              <div>{{scope.row.companyName}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="站点开通时间" min-width="120"/>
        <el-table-column prop="deptName" label="所属部门" min-width="120"/>
        <el-table-column prop="belongAdminUserName" label="所属商务" min-width="120"/>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          :current-page="form.pageIndex"
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
  name: 'no-invoice',
  data() {
    return {
      loading: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        companyName: ''
      },
      totalCount: 0,
      list: []
    }
  },
  watch: {
    'form.pageIndex': {
      handler: function () {
        this.queryList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryList()
      },
      deep: true
    }
  },
  methods: {
    onPageShow(){
      this.clearQueryParams()
      // this.queryList()
    },
    async queryList(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.statisticsCompanyNoData(this.form)
        this.totalCount = data.totalCount
        this.list = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        companyName: ''
      }
    }
  },
  mounted() {}
}
</script>
