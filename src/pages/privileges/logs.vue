<template>
  <x-page breadcrumb="auto" title="系统日志">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.userName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="opDateTime"
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
        <el-table-column label="操作时间" prop="createTime"/>
        <el-table-column label="用户名称" prop="userName"/>
        <el-table-column label="备注" prop="remark"/>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding">明细</el-button>
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
  </x-page>
</template>

<script>
export default {
  name: 'privileges-logs',
  data(){
    return {
      loading: false,
      searchForm: {
        userName: '',
        beginTime: '',
        endTime: ''
      },
      opDateTime: [],
      totalCount: 0,
      tableData: [],
      pageIndex: 1,
      pageSize: 10
    }
  },
  watch: {
    pageIndex(){
      this.loadLogs()
    },
    pageSize(){
      this.loadLogs()
    },
    opDateTime(months){
      this.searchForm.beginTime = months ? this.$utils.dateFormat(months[0]) : ''
      this.searchForm.endTime = months ? this.$utils.dateFormat(months[1]) : ''
    }
  },
  methods: {
    onSearchClick(){
      this.loadLogs()
    },
    async loadLogs(){
      this.loading = true
      try {
        const result = await this.$$main.aUserSystemLogList({
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
    this.loadLogs()
  }
}
</script>

<style scoped>

</style>
