<template>
  <x-page breadcrumb="auto" title="系统通知">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :model="searchForm" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="通知类型">
          <el-select v-model="searchForm.messageTypeCondition" style="width: 80px" placeholder="请选择">
            <el-option
              v-for="(item, key) in messageTypes"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知状态">
          <el-select v-model="searchForm.messageStatusCondition" style="width: 80px" placeholder="请选择">
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
        <el-form-item class="pull-right">
          <el-button @click="dialogFormVisible=true" type="primary">发布通知</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        :border="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        :highlight-current-row="true"
        @sort-change="onSortChange"
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="通知编号" prop="messageId" width="80"/>
        <el-table-column label="通知内容" prop="messageContent">
          <a href="javascript:;" slot-scope="scope" @click="$alert(scope.row.messageContent, '通知内容')">{{scope.row.messageContent}}</a>
        </el-table-column>
        <el-table-column label="通知类型" prop="messageType" width="80">
          <template slot-scope="scope">{{messageTypes[scope.row.messageType]}}</template>
        </el-table-column>
        <el-table-column label="发布人" prop="createUserName" />
        <el-table-column label="发布时间" sortable="custom" sort-by="showCreateTime" prop="showCreateTime" width="200"/>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">{{refundStatusText[scope.row.messageStatus]}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.messageStatus === 'D'"  type="text" size="mini" @click="onChangeStatusAction(scope.row, 'N')">正常</el-button>
            <el-button v-else type="text" size="mini" @click="onChangeStatusAction(scope.row, 'D')">停用</el-button>
            <el-button type="text" size="mini" @click="onChangeStatusAction(scope.row, 'X')">删除</el-button>
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
    <el-dialog v-drag-dialog title="发布通知" width="400px" :visible.sync="dialogFormVisible">
      <el-form :model="messageForm" :rules="messageFormRules" ref="messageForm" style="margin: 0px 10px;" size="mini">
        <el-form-item label="消息类型：" prop="messageType">
          <el-select v-model="messageForm.messageType" style="width: 80px" placeholder="请选择">
            <el-option label="企业" value="C"/>
            <el-option label="工人" value="W"/>
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容：" prop="messageContent">
          <el-input v-model="messageForm.messageContent" type="textarea" rows="5" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onPublishMessage">确 定</el-button>
      </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'sys-message',
  data(){
    return {
      searchForm: {
        'messageTypeCondition': '',
        'messageStatusCondition': ''
      },
      refundStatusText: {'': '全部', N: '正常', D: '停用', X: '删除'},
      messageTypes: {'': '全部', C: '企业', W: '工人'},
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {},
      dialogFormVisible: false,
      messageForm: {
        messageContent: '',
        messageType: ''
      },
      messageFormRules: {
        messageType: [{required: true, message: '请选择消息类型', trigger: 'change'}],
        messageContent: [{required: true, message: '请填写消息类型', trigger: 'change'}]
      }
    }
  },
  methods: {
    async loadSystemMessage(){
      try {
        this.loading = true
        const res = await this.$$main.messageQueryList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchForm,
          sorts: this.sorts
        })
        this.tableData = res.datas
        this.totalCount = res.totalCount
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async onChangeStatusAction(message, status){
      try {
        await this.$$main.messageDoChangeStatus({
          messageId: message.messageId,
          messageStatus: status
        })
        if (status === 'X') {
          this.tableData = this.tableData.filter(item => item.messageId !== message.messageId)
        } else {
          message.messageStatus = status
        }
        this.$message.success('操作成功')
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    onSearchClick(){
      this.loadSystemMessage()
    },
    onPublishMessage(){
      this.$refs.messageForm.validate(async (isValid) => {
        if (!isValid) return
        const loader = this.$loading()
        try {
          const res = await this.$$main.messageDoCreate({
            ...this.messageForm
          })
          this.dialogFormVisible = false
          if (res){
            this.loadSystemMessage()
          }
        } catch (e) {
          e && e.message && this.$message.error(e.message)
        } finally {
          loader.close()
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
      this.loadSystemMessage()
    }
  },
  mounted(){
    this.loadSystemMessage()
  }
}
</script>

<style scoped>

</style>
