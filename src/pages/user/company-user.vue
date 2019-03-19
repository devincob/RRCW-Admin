<template>
  <x-page breadcrumb="auto" title="B端用户列表">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.companyUserName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-number-input v-model="searchForm.contactPhone" placeholder="手机号" style="width: 120px"/>
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
        <el-form-item label="用户类型">
          <el-select v-model="searchForm.userType" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in userTypeText"
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
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        :border="true"
        :highlight-current-row="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        @sort-change="onSortChange"
        size="mini"
        >
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="用户编号" prop="companyUserId" width="80"/>
        <el-table-column label="名称" prop="companyUserName" width="150"/>
        <el-table-column label="用户类型" prop="userType" width="80">
          <span slot-scope="scope">{{userTypeText[scope.row.userType]}}</span>
        </el-table-column>
        <el-table-column label="手机号码" prop="contactPhone" min-width="80"/>
        <el-table-column label="确认支付时间" prop="autoPayHour"/>
        <!--<el-table-column label="服务费" prop="serviceChargeRate" width="80"/>-->
        <el-table-column label="授信额度" prop="creditLine">
          <span slot-scope="scope">{{scope.row.residualCreditLine}}/{{scope.row.creditLine}}</span>
        </el-table-column>
        <el-table-column label="发单状态" prop="orderStatus">
          <span slot-scope="scope">{{orderStatusText[scope.row.orderStatus]}}</span>
        </el-table-column>
        <el-table-column label="账号状态" prop="status">
          <template slot-scope="scope">{{statusText[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column sortable="custom" sort-by="registerTime" label="注册时间" width="140" prop="formatRegisterTime"/>
        <el-table-column label="操作" fixed="right" width="200" align="center" header-align="center">
          <template slot-scope="scope">
            <router-link :to="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">详情</router-link>
            <router-link :to="`/user/company-salary-deploy?cid=${scope.row.companyUserId}&cname=${scope.row.companyUserName}`" target="_blank">薪资配置</router-link>
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
  name: 'user-business',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        companyUserName: '',
        contactPhone: '',
        beginTime: '',
        endTime: '',
        userType: '',
        status: ''
      },
      searchFormRegisterTime: null,
      statusText: {A: '全部', N: '正常', D: '封号'},
      userTypeText: {A: '全部', C: '企业', P: '个人'},
      orderStatusText: {A: '全部', N: '正常', D: '异常'},
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
        console.log(e)
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
    }
  },
  mounted(){
    this.loadUsers()
  }
}
</script>

<style scoped>

</style>
