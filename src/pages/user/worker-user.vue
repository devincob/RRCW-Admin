<template>
  <x-page breadcrumb="auto" title="用户列表">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.userName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
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
        <el-form-item label="实名状态">
          <el-select v-model="searchForm.realNameStatus" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in {A: '全部', R: '已实名', N: '未实名'}"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="searchForm.status" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in statusText"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抢单状态">
          <el-select v-model="searchForm.orderStatus" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in orderStatusText"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
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
        @sort-change="onSortChange"
        size="mini"
        :border="true"
        :highlight-current-row="true">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>
        <el-table-column label="用户编号" prop="workerUserId" width="70"/>
        <el-table-column label="姓名" prop="userName" width="100"/>
        <el-table-column label="性别" prop="sex" width="60">
          <span slot-scope="scope">{{sexText[scope.row.sex]}}</span>
        </el-table-column>
        <el-table-column label="手机号" prop="mobilePhone" width="120"/>
        <el-table-column label="城市" prop="cityName"/>
        <el-table-column label="实名状态" prop="realNameStatus">
          <span slot-scope="scope">{{realNameStatusText[scope.row.realNameStatus]}}</span>
        </el-table-column>
        <el-table-column label="抢单资格" prop="orderStatus">
          <span slot-scope="scope">{{orderStatusText[scope.row.orderStatus]}}</span>
        </el-table-column>
        <el-table-column label="账号状态" prop="status">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.status === 'PA',
                'text-danger':scope.row.status === 'UP'
                }">{{statusText[scope.row.status] || ''}}</span>
        </el-table-column>
        <el-table-column label="实名认证时间" prop="realNameTime"/>
        <el-table-column sortable="custom" sort-by="registerTime" label="注册时间" width="140" prop="formatRegisterTime"/>
        <el-table-column label="来源">
          <span slot-scope="scope">{{scope.row.promoterName ? scope.row.promoterName : '-'}}</span>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <router-link :to="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">详情</router-link>
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
// 现在输入只能输入纯数字
export default {
  name: 'worker-user',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        userName: '',
        mobile: '',
        beginTime: '',
        endTime: '',
        realNameStatus: '',
        status: '',
        orderStatus: ''
      },
      searchFormRegisterTime: null,
      realNameStatusText: {PA: '通过', UP: '未通过', CT: '审核中'},
      orderStatusText: {A: '全部', N: '正常', D: '异常'},
      statusText: {A: '全部', N: '正常', D: '封号'},
      sexText: {M: '男', F: '女', U: '未知'},
      tableData: [],
      userType: '',
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
        const data = await this.$$main.userCList({
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
    },
    onPageParamsChange(params, {from}){
      if (from.name !== 'user-detail') {
        this.userType = params.type
        this.pageIndex = 1
        console.log('onPageParamsChange')
        this.loadUsers()
      }
    }
  },
  mounted(){
    this.loadUsers()
  }
}
</script>

<style scoped>

</style>
