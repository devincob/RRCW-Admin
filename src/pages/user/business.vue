<template>
  <x-page breadcrumb="auto" title="用户列表">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-number-input v-model="searchForm.mobile" placeholder="手机号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchFormRegisterTime"
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
        @sort-change="onSortChange"
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>
        <el-table-column sortable="custom" sort-by="registerTime" label="注册时间" prop="formatRegisterTime"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="用户名" prop="companyName" width="100"/>
        <el-table-column label="性别" prop="sex">
          <span slot-scope="scope">{{sexText[scope.row.sex]}}</span>
        </el-table-column>
        <el-table-column label="MID" prop="userId"/>
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
// 现在输入只能输入纯数字
export default {
  name: 'user-business',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        mobile: '',
        beginTime: '',
        endTime: ''
      },
      searchFormRegisterTime: null,
      sexText: {M: '男', F: '女', U: '未知'},
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {
        sortType: 'D',
        sortName: 'registerTime'
      }
    }
  },
  watch: {
    searchFormRegisterTime(date){
      this.searchForm.beginTime = date ? this.$utils.dateFormat(date[0]) : ''
      this.searchForm.endTime = date ? this.$utils.dateFormat(date[1]) : ''
    },
    pageIndex(){
      this.loadUsers()
    },
    pageSize(){
      this.loadUsers()
    }
  },
  methods: {
    async loadUsers(){
      try {
        this.loading = true
        const data = await this.$$main.userBList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchForm,
          sorts: this.sorts
        })
        this.totalCount = data.totalCount
        this.tableData = data.datas
        this.loading = false
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    onSearchClick(){
      this.loadUsers()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      } else {
        this.sorts = {
          sortType: 'D',
          sortName: 'registerTime'
        }
      }
      this.loadUsers()
    },
    onPageShow(){
      this.loadUsers()
    }
  }
}
</script>

<style scoped>

</style>
