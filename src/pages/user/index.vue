<template>
  <x-page breadcrumb="auto" title="用户列表">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-number-input v-model="searchForm.mobile" placeholder="手机号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.peopleName" placeholder="姓名" style="width: 100px"/>
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
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" style="width: 120px" placeholder="请选择">
            <el-option
              v-for="(item, key) in statusText"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能职称">
          <el-select v-model="searchForm.skillName" style="width: 120px" placeholder="请选择">
            <el-option
              v-for="item in ['全部', '无', '财税师', 'ACCA', '初级会计师', '中级会计师', '高级会计师', '注册会计师']"
              :key="item"
              :label="item"
              :value="item">
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
        stripe
        @sort-change="onSortChange"
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>
        <el-table-column label="姓名" prop="peopleName" width="100"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="性别" prop="sex">
          <span slot-scope="scope">{{sexText[scope.row.sex]}}</span>
        </el-table-column>
        <el-table-column label="工作年限" prop="workYear"/>
        <el-table-column label="技能职称" prop="skillName"/>
        <el-table-column label="审批状态" prop="status">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.status === 'PA',
                'text-danger':scope.row.status === 'UP'
                }">{{statusText[scope.row.status] || '待提交'}}</span>
        </el-table-column>
        <el-table-column sortable="custom" sort-by="registerTime" label="注册时间" prop="formatRegisterTime"/>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <router-link :to="`/user/detail?uid=${scope.row.userId}`">操作</router-link>
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
  name: 'user-index',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        peopleName: '',
        mobile: '',
        skillName: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
      searchFormRegisterTime: null,
      statusText: {'': '全部', CT: '审核中', PA: '审核已通过', UP: '审核未通过'},
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
          skillName: this.searchForm.skillName.indexOf('无') === 0 ? '' : this.searchForm.skillName,
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
    this.userType = this.$route.params.type
  }
}
</script>

<style scoped>

</style>
