<template>
  <x-page breadcrumb="auto" title="退款管理">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="企业名称">
          <el-input v-model="searchForm.userName" placeholder="企业名称" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="searchFormRegisterTime"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.refundStatusCondition" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in refundStatusText"
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
        :highlight-current-row="true"
        :border="true"
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

        <el-table-column label="编号" prop="refundId" width="80"/>
        <el-table-column label="申请人" prop="companyName" width="100">
          <el-tooltip slot-scope="scope" class="item" effect="dark" :content="scope.row.companyName" placement="top-start">
            <span>{{scope.row.companyName}}</span>
          </el-tooltip>
        </el-table-column>
        <el-table-column label="退款金额" prop="refundAmount" width="140">
          <span slot-scope="scope">{{scope.row.refundAmount|currency}}</span>
        </el-table-column>
        <el-table-column label="申请原因" prop="refundReason" min-width="160">
          <el-tooltip slot-scope="scope" class="item" effect="dark" :content="scope.row.refundReason" placement="top-start">
            <span>{{scope.row.refundReason}}</span>
          </el-tooltip>
        </el-table-column>
        <el-table-column label="申请时间" sortable="custom" sort-by="showRefundTime" prop="showRefundTime" width="200"/>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">{{refundStatusText[scope.row.refundStatus]}}</template>
        </el-table-column>
        <el-table-column label="处理时间" prop="showActionTime"/>
        <el-table-column label="处理备注" prop="actionReason" max-width="200">
          <el-tooltip slot-scope="scope" class="item" effect="dark" :content="scope.row.actionReason" placement="top-start">
            <span>{{scope.row.actionReason}}</span>
          </el-tooltip>
        </el-table-column>
        <el-table-column label="处理人" prop="actionUserName"/>
        <el-table-column label="操作" align="center" header-align="center">
          <template v-if="scope.row.refundStatus === 'S1'" slot-scope="scope">
            <el-button type="text" size="mini" @click="onRefundAction(scope.row, 'S2')">成功</el-button>
            <el-button type="text" size="mini" @click="onRefundAction(scope.row, 'S3')">失败</el-button>
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
  name: 'refund',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        // 用户名
        'companyNameCondition': '',
        // 开始申请提现时间
        'refundTimeBeginCondition': '',
        // 结束申请提现时间
        'refundTimeEndCondition': '',
        'refundStatusCondition': ''
      },
      refundStatusText: {'': '全部', S1: '审核中', S2: '成功', S3: '失败'},
      searchFormRegisterTime: null,
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {
        sortType: 'D',
        sortName: 'showRefundTime'
      },
      actionReason: ''
    }
  },
  watch: {
    searchFormRegisterTime(date){
      this.searchForm.refundTimeBeginCondition = date ? this.$utils.dateFormat(date[0]) : ''
      this.searchForm.refundTimeEndCondition = date ? this.$utils.dateFormat(date[1]) : ''
    },
    pageIndex(){
      this.queryListRefund()
    },
    pageSize(){
      this.queryListRefund()
    }
  },
  methods: {
    async queryListRefund(){
      try {
        this.loading = true
        const data = await this.$$main.salaryQueryListRefund({
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
    async onRefundAction(row, status){
      try {
        this.actionReason = ''
        const res = await this.$prompt('此操作不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入操作原因',
          inputValidator(val){
            return !!(val && val.trim().length > 0)
          },
          inputErrorMessage: '操作原因不能为空'
        })
        if (res !== 'cancel') {
          this.actionReason = res.value
          await this.salaryDoRefundAction(row, status)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async salaryDoRefundAction(row, status){
      const loader = this.$loading()
      try {
        row.refundStatus = status
        await this.$$main.salaryDoRefundAction({
          // 退款编号
          'refundId': row.refundId,
          // 状态(S2成功,S3失败)
          'refundStatus': status,
          // 原因
          'actionReason': this.actionReason
        })
        this.$message.success('操作成功!')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    onSearchClick(){
      this.queryListRefund()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      }
      this.queryListRefund()
    }
  },
  mounted(){
    this.queryListRefund()
  }
}
</script>

<style scoped>

</style>
