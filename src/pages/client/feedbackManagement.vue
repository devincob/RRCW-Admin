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
        header-align="center"
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          align="center"
          prop="feedbackId"
          label="反馈编号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="loginName"
          label="反馈账号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userType"
          label="反馈角色"
          min-width="80"
          :formatter="formatStyle">
        </el-table-column>
        <el-table-column
          align="center"
          prop="content"
          label="反馈内容"
          min-width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="feedbackTime"
          label="反馈时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="审核状态"
          min-width="80"
          :formatter="formatStatus">
        </el-table-column>
        <el-table-column align="center" class="text-center" minWidth="60" label="操作" fixed="right">
          <!--默认显示详细，后面审核后显示审核者名称-->
          <template slot-scope="scope">
            <!--$router.push(`/caiwu/feedbackDeital/${scope.row.feedbackId}`)-->
            <el-button
              size="mini"
              type="primary"
              @click.native="showDialog(scope.row)">详情
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
          <el-col :span="8">用户类型：{{feedBackDetails.userType}}端</el-col>
        </el-form-item>
        <el-form-item label="反馈内容：">
          <el-col>
            {{feedBackDetails.content}}
          </el-col>
        </el-form-item>
        <el-form-item label="处理结果及备注：" prop="actionResult" align="center">
            <el-input
              type="textarea"
              :rows="3"
              v-model="feedBackDetails.actionResult" placeholder="请完善处理结果">
            </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
        <el-button :loading="insertLoading" type="primary" size="small"  @click="feedBackCompleted(feedBackDetails)">处理完成</el-button>
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
    async feedBackCompleted(feedBackDetails){
      console.log(this.feedBackDetails)
      try {
        const isValid = await this.$refs.feedBackDetails.validate()
        console.log(isValid)
        if (!isValid) return
        this.insertLoading = true
        await this.$$main.tagOperation({
          feedbackId: feedBackDetails.feedbackId,
          remark: feedBackDetails.actionResult
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
      this.centerDialogVisible = true
    },
    formatStyle(row, column) {
      let arr = {
        'B': 'B端',
        'C': 'C端'
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
        this.orderList = [
          {
            feedbackId: '1',
            formatFeedbackTime: '2018-12-11 11:10:22',
            feedbackTime: '2018-12-11 11:10:22',
            userType: 'B',
            status: 'W',
            content: '@ctitle(10)',
            loginName: '11'
          },
          {
            feedbackId: '2',
            formatFeedbackTime: '2018-12-11 11:10:22',
            feedbackTime: '2018-12-11 12:10:22',
            userType: 'C',
            status: 'O',
            content: '@ctitle(10)',
            loginName: '12'
          },
          {
            feedbackId: '3',
            formatFeedbackTime: '2018-12-11 11:10:22',
            feedbackTime: '2018-12-11 11:10:22',
            userType: 'B',
            status: 'O',
            content: '@ctitle(10)',
            loginName: '13'
          },
          {
            feedbackId: '4',
            formatFeedbackTime: '2018-12-11 11:10:22',
            feedbackTime: '2018-12-11 11:10:22',
            userType: 'C',
            status: 'W',
            content: '@ctitle(10)',
            loginName: '44'
          }
        ]
        this.loading = true
        const data = await this.$$main.userFeedBackList(this.form)
        this.loading = false
        this.totalCount = data.totalCount
        this.orderList = data.datas
        console.log(this.orderList, 1231)
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
