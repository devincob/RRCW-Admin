<template>
  <x-page breadcrumb="auto" title="流水查询">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="searchForm.userName" placeholder="姓名" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="交易时间">
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
        <el-form-item label="支付方式">
          <el-select v-model="searchForm.payType" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in payTypes"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.transType" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in transTypes"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
          <el-button @click="dialogFormVisible=true" type="primary" plain>充值/扣款</el-button>
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

        <el-table-column label="流水编号" prop="transId" width="100"/>
        <el-table-column label="账号" prop="inAccountCashId" width="100"/>
        <el-table-column label="交易金额" prop="amount" width="100">
          <span slot-scope="scope">{{scope.row.amount|currency}}</span>
        </el-table-column>
        <el-table-column label="交易时间" sortable="custom" sort-by="transTime" prop="formatTransTime" width="200"/>
        <el-table-column label="支付方式" prop="status" width="100">
          <template slot-scope="scope">{{scope.row.payType}}</template>
        </el-table-column>
        <el-table-column label="交易类型" prop="status" width="160" >
          <template slot-scope="scope">{{scope.row.transType}}</template>
        </el-table-column>
        <el-table-column label="交易对象" prop="outAccountCashId" width="120"/>
        <el-table-column label="关联业务单号" prop="bizNo" width="160"/>
        <el-table-column label="" prop="" min-width="160"/>
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
    <el-dialog v-drag-dialog title="充值扣款" width="400px" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="formRules" ref="form" style="margin: -30px 0;" size="mini">
        <el-form-item label="手机号：" label-width="100" prop="loginName">
          <el-input v-model.lazy="form.loginName" auto-complete="off" placeholder="请输入对方手机号"></el-input>
        </el-form-item>
        <el-form-item v-if="bUserInfo" label="名称：">{{bUserInfo.companyUserName}}</el-form-item>
        <el-form-item v-if="bUserInfo" label="余额：">{{bUserInfo.amount | currency}}</el-form-item>
        <el-form-item label="金额：" prop="amount">
          <el-input v-model.number="form.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.remark" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onRechargeClick">确 定</el-button>
      </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'cash-flow',
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
        // 支付方式(W:微信,C:钱包,O:线下,A:全部)
        'payType': '',
        // 交易类型(RC:充值,PP:预付工资,PS:工资,AC:提现,AB:提现退回,PB:预付退回,DA:扣款,TA:转账)
        'transType': ''
      },
      form: {
        loginName: '',
        amount: null,
        remark: ''
      },
      bUserInfo: null,
      searchFormRegisterTime: null,
      payTypes: {'': '全部', W: '微信', L: '支付宝', C: '账户余额', O: '线下'},
      transTypes: {
        '': '全部',
        'RC': '充值',
        'CR': '退款',
        'AC': '提现',
        'AB': '提现退回',
        'PP': '预付工资',
        'PB': '预付工资退回',
        'CC': '订单取消赔付',
        'PS': '支付工资',
        'TA': '转账',
        'DP': '直接发工资',
        'DA': '扣款',
        'SC': '服务费',
        'TD': '推广分红'
      },
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: null,
      dialogFormVisible: false,
      formRules: {
        loginName: [{required: true, message: '账户不能为空', trigger: 'blur'}],
        amount: [{type: 'number', required: true, message: '金额不能为且必须为数字', trigger: 'blur'}]
      }
    }
  },
  watch: {
    searchFormRegisterTime(date){
      this.searchForm.beginTime = date ? this.$utils.dateFormat(date[0]) : ''
      this.searchForm.endTime = date ? this.$utils.dateFormat(date[1]) : ''
    },
    pageIndex(){
      this.loadSalaryTradeList()
    },
    pageSize(){
      this.loadSalaryTradeList()
    },
    'form.loginName'(v){
      setTimeout(() => {
        if (this.enterTamp && Date.now() - this.enterTamp >= 800) {
          this.queryBUserInfo(v)
        }
      }, 800)
      this.enterTamp = Date.now()
    }
  },
  methods: {
    async loadSalaryTradeList(){
      try {
        this.loading = true
        const data = await this.$$main.salaryTradeList({
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
    async queryBUserInfo(loginName){
      const loader = this.$loading({text: '查询用户信息中...'})
      try {
        this.bUserInfo = await this.$$main.userBInfo({
          loginName: loginName
        })
      } catch (e) {
        this.bUserInfo = null
        e && e.message && this.$message.error(e.message)
      } finally {
        loader.close()
      }
    },
    onSearchClick(){
      this.loadSalaryTradeList()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      }
      this.loadSalaryTradeList()
    },
    onRechargeClick(){
      this.$refs.form.validate(async isValid => {
        if (isValid) {
          const loader = this.$loading({text: '请稍等...'})
          try {
            const res = await this.$$main.salaryRechargeDebit({
              ...this.form,
              userType: 'C'
            })
            if (res) {
              this.queryBUserInfo(this.form.loginName)
              this.$message.success('充值/扣款成功！')
            }
            this.form.amount = null
            this.form.remark = ''
          } catch (e) {
            e && e.message && this.$message.error(e.message)
          } finally {
            loader.close()
          }
        }
      })
    }
  },
  mounted(){
    this.loadSalaryTradeList()
  }
}
</script>

<style scoped>
</style>
