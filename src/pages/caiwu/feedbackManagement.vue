<template>
  <x-page breadcrumb="auto" title="反馈管理">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="手机号">
            <el-input placeholder="手机号" v-model="form.mobilePhone" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select placeholder="审核状态" v-model="form.status" style="width: 120px">
              <el-option label="全部" value="A"/>
              <el-option label="未处理" value="W"/>
              <el-option label="已处理" value="O"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        :highlight-current-row="true"
        :border="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          prop="feedbackId"
          label="反馈编号"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="反馈账号"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="userType"
          label="反馈角色"
          min-width="80"
          :formatter="formatStyle">
        </el-table-column>
        <el-table-column
          prop="content"
          label="反馈内容"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="formatFeedbackTime"
          label="反馈时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          min-width="80"
          :formatter="formatStatus">
        </el-table-column>
        <el-table-column  class="text-center" minWidth="60" label="操作" fixed="right">
          <!--默认显示详细，后面审核后显示审核者名称-->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-html="scope.row.status === 'W' ? '处理' : '详情'"
              @click.native="showDialog(scope.row)">
            </el-button>
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
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="反馈详情"
      :visible.sync="centerDialogVisible"
      width="600px"
      center>
      <el-form  ref="feedBackDetails" :model="feedBackDetails" :rules="rulesFixOrder" size="small">
        <el-form-item prop="jobTagName">
          <el-col :span="8">用户手机：{{feedBackDetails.mobile}}</el-col>
          <el-col :span="8">用户：{{feedBackDetails.userName}}</el-col>
          <el-col :span="8">用户类型：
            <span v-if="feedBackDetails.userType === 'W'">C</span>
            <span v-if="feedBackDetails.userType === 'C'">B</span>端</el-col>
        </el-form-item>
        <el-form-item label="反馈内容：">
          <el-col>
            {{feedBackDetails.content}}
          </el-col>
        </el-form-item>
        <el-form-item label="处理结果及备注：" prop="actionResult" align="center">
            <el-input
              :readonly="feedBackDetails.status === 'O'"
              type="textarea"
              :rows="3"
              v-model="feedBackDetails.actionResult" placeholder="请完善处理结果">
            </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="insertLoading" :disabled="feedBackDetails.status === 'O'" type="primary" size="small" @click="keepIt(feedBackDetails)">保 存</el-button>
        <el-button :loading="insertLoading" :disabled="feedBackDetails.status === 'O'" type="primary" size="small"  @click="feedBackCompleted(feedBackDetails)">处理完成</el-button>
      </span>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'feedback-Management',
  data() {
    return {
      orderList: [],
      totalCount: 0,
      loading: false,
      insertLoading1: false,
      insertLoading: false,
      centerDialogVisible: false,
      rulesFixOrder: {
        actionResult: [
          { required: true, message: '处理结果不能为空', trigger: 'change' }
        ]
      },
      feedBackDetails: {
        mobile: '',
        userName: '',
        content: '',
        actionResult: '',
        userType: '',
        feedbackId: ''
      },
      form: {
        pageIndex: 1,
        pageSize: 20,
        mobilePhone: '',
        status: ''
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
    async keepIt(feedBackDetails){
      try {
        const isValid = await this.$refs.feedBackDetails.validate()
        if (!isValid) return
        this.insertLoading1 = true
        await this.$$main.userSaveFeedBackRemark({
          feedbackId: feedBackDetails.feedbackId,
          remark: feedBackDetails.actionResult
        })
        this.insertLoading1 = false
        this.centerDialogVisible = false
        this.queryOrderList()
      } catch (e){
        this.insertLoading1 = false
        e.message && this.$message.error(e.message)
      }
    },
    async feedBackCompleted(feedBackDetails){
      try {
        const isValid = await this.$refs.feedBackDetails.validate()
        if (!isValid) return
        this.insertLoading = true
        await this.$$main.userUpdateFeedBackStatus({
          feedbackId: feedBackDetails.feedbackId,
          status: feedBackDetails.status === 'W' ? 'O' : 'W' // 状态(O:已处理, W:未处理)
        })
        this.insertLoading = false
        this.centerDialogVisible = false
        this.queryOrderList()
      } catch (e){
        this.insertLoading = false
        e.message && this.$message.error(e.message)
      }
    },
    async showDialog(item){
      try {
        const feedBackDetails = await this.$$main.userFeedBackDetails({feedbackId: item.feedbackId})
        this.feedBackDetails = feedBackDetails
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
      this.$nextTick(() => {
        this.$refs['feedBackDetails'].clearValidate()
      })
      this.centerDialogVisible = true
    },
    formatStyle(row, column) {
      let arr = {
        'W': 'C端',
        'C': 'B端'
      }
      return arr[row.userType]
    },
    formatStatus(row, column) {
      let arr = {
        'W': '未处理',
        'O': '已处理'
      }
      return arr[row.status]
    },
    async queryOrderList() {
      try {
        this.loading = true
        const data = await this.$$main.userFeedBackList(this.form)
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
    }
  },
  mounted() {
  }
}
</script>
