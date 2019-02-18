<template>
  <x-page breadcrumb="auto" title="C端提现">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="searchForm.userName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="提现时间">
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
        <el-form-item label="是否标记">
          <el-select v-model="searchForm.status" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in statusText"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现银行">
          <el-select v-model="searchForm.bankType" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="item in banks"
              :key="item.bankType"
              :label="item.bankName"
              :value="item.bankType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
          <el-button @click="onExportClick" type="primary" plain>导出</el-button>
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
        @sort-change="onSortChange"
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="提现编号" prop="cashApplyId" width="100"/>
        <el-table-column label="提现用户" prop="userName" width="100">
          <router-link :to="'/user/worker-detail?uid=' + scope.row.workerUserId" target="_blank" slot-scope="scope">{{scope.row.userName}}</router-link>
        </el-table-column>
        <el-table-column label="提现金额" prop="amount" width="100">
          <span slot-scope="scope">{{scope.row.amount|currency}}</span>
        </el-table-column>
        <el-table-column label="提现账户" prop="companyUserName">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.bankName + '/' + scope.row.bankNo + '/' + scope.row.bankUserName + '/' + scope.row.withdrawalsAccount" placement="top">
              <span v-if="scope.row.bankType !== 'WXWALLET'">
                {{scope.row.bankName}}/
                {{scope.row.bankNo}}/
                {{scope.row.bankUserName}}/
                {{scope.row.withdrawalsAccount}}
              </span>
              <span v-else>
                {{scope.row.bankName}}/{{scope.row.bankUserName}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="提现时间" sortable="custom" sort-by="applyTime" prop="formatApplyTime" width="200"/>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">{{statusText[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column label="备注" prop="rejectReason">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.rejectReason" placement="top">
              <span>{{scope.row.rejectReason}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template v-if="scope.row.status !== 'R' && scope.row.status !== 'P'" slot-scope="scope">
            <el-button v-if="scope.row.status !== 'S' && scope.row.bankType !== 'WXWALLET'" type="text" size="mini" @click="onChangeStatus(scope.row, 'S')">标记</el-button>
            <el-button v-if="scope.row.status === 'S' || scope.row.bankType === 'WXWALLET'" type="text" size="mini" @click="onChangeStatus(scope.row, 'P')">支付</el-button>
            <el-button type="text" size="mini" @click="onReject(scope.row)">驳回</el-button>
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
  name: 'cash',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        // 用户名
        'userName': '',
        // 开始申请提现时间
        'beginTime': '',
        // 结束申请提现时间
        'endTime': '',
        // 状态(S:已标记,A:审核中,R:驳回)
        'status': '',
        // 提现银行(CCB:建设,CMB：招商,ICBC:工商,BOC:中国银行,ABC:中国农业银行,BOCOM交通,CMBC:民生)
        'bankType': ''
      },
      searchFormRegisterTime: null,
      statusText: {'': '全部', A: '审核中', S: '已标记', P: '已通过', R: '已驳回'},
      userTypeText: {A: '全部', C: '企业', P: '个人'},
      banks: [],
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {
        sortType: 'D',
        sortName: 'applyTime'
      }
    }
  },
  watch: {
    searchFormRegisterTime(date){
      this.searchForm.beginTime = date ? this.$utils.dateFormat(date[0]) : ''
      this.searchForm.endTime = date ? this.$utils.dateFormat(date[1]) : ''
    },
    pageIndex(){
      this.loadCashs()
    },
    pageSize(){
      this.loadCashs()
    }
  },
  methods: {
    async loadCashs(){
      try {
        this.loading = true
        const data = await this.$$main.salaryCWithdrawalsList({
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
    async loadBankList(){
      let banks = [{bankType: '', bankName: '全部'}]
      try {
        const res = await this.$$main.commonBankList()
        this.banks = [...banks, ...res]
      } catch (e) {
        this.banks = banks
        this.$message.error(e.message)
      }
    },
    async changeWithdrawalsStatus(options){
      const loader = this.$loading({
        text: '请稍等...',
        target: this.$refs.table.$el
      })
      try {
        return await this.$$main.salaryUpdateWithdrawalsStatus({
          ...options
        })
      } catch (e) {
        console.log(e)
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    onSearchClick(){
      this.loadCashs()
    },
    onExportClick(){
      const loader = this.$loading({
        text: '请稍等...',
        target: this.$refs.table.$el
      })
      this.$$main.execute('/Salary/CWithdrawalsList', {
        header: {
          method: 'Export'
        },
        body: {...this.searchForm},
        onSuccess: (data, res) => {
          loader.close()
          if (res.attachments && res.attachments.url && res.attachments.url !== ''){
            this.$alert(`<strong>已导出，请点击</strong> <a href="${res.attachments.url}" target="_blank">下载</a> 获取`, '导出成功', {
              dangerouslyUseHTMLString: true,
              showConfirmButton: false,
              callback(){}
            })
          }
        },
        onError: (e) => {
          loader.close()
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'warning'
          })
        }
      })
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      }
      this.loadCashs()
    },
    onReject(row){
      this.$prompt('请输入驳回原因', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '驳回原因，回车直接提交。',
        inputPattern: /^[\s\S\w]{1,255}$/,
        inputErrorMessage: '驳回原因为1-255字符之间'
      }).then(async ({value}) => {
        await this.changeWithdrawalsStatus({
          cashApplyId: row.cashApplyId,
          status: 'R',
          rejectReason: value
        })
        row.status = 'R'
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {})
    },
    async onChangeStatus(row, status){
      this.$confirm(status === 'P' ? '确认支付吗？' : '确定要执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res
        if (row.bankType === 'WXWALLET' && status === 'P') {
          // 微信
          res = await this.$$main.salaryDoWxWithdrawals({
            cashApplyId: row.cashApplyId
          })
        } else {
          res = await this.changeWithdrawalsStatus({
            cashApplyId: row.cashApplyId,
            status: status
          })
        }
        if (res) {
          row.status = status
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      }).catch((e) => {
        e && e.message && this.$message.error(e.message)
      })
    }
  },
  mounted(){
    this.loadBankList()
    this.loadCashs()
  }
}
</script>

<style scoped>

</style>
