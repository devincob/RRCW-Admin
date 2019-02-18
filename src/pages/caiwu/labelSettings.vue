<template>
  <x-page breadcrumb="auto" title="标签设置">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input placeholder="标签名" v-model="form.tagName" style="width: 140px"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="标签状态" v-model="form.status" style="width: 120px">
            <el-option label="全部" value="A"/>
            <el-option label="启用" value="N"/>
            <el-option label="停用" value="D"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button @click.native="showAddDialog"  type="primary">新增<i class="el-icon-plus el-icon--right"></i></el-button>
        </el-form-item>
      </el-form>
      <el-table
        :highlight-current-row="true"
        :data="orderList"
        :border="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          prop="jobTagId"
          label="标签编号"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="iconClass"
          label="标签类名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="jobTagName"
          label="标签名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="salaryClass"
          label="薪水计算类名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="jobDescription"
          label="职能定义"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="标签状态"
          min-width="100"
          :formatter="formatStatus">
        </el-table-column>
        <el-table-column align="center" class="text-center" minWidth="100" label="操作" fixed="right">
          <!--默认显示详细，后面审核后显示审核者名称-->
          <template slot-scope="scope">
            <el-button size="mini" type="primary"  @click="goEdit(scope.row)">编辑</el-button>
            <el-button size="mini" :type="scope.row.status === 'N' ? 'warning' : 'success'" v-html="scope.row.status === 'N' ? '停用' : '启用'" @click="switchUse(scope.row)">编辑</el-button>
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
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="450px"
      center>
      <el-form :model="dialogForm" status-icon :rules="rulesFixOrder" ref="dialogForm" label-width="120px">
        <el-form-item label="标签类名称" prop="iconClass">
          <el-input  v-model="dialogForm.iconClass" placeholder="请输入标签名称" ></el-input>
        </el-form-item>
        <el-form-item label="标签名称" prop="jobTagName">
          <el-input  v-model="dialogForm.jobTagName" placeholder="请输入标签名称" ></el-input>
        </el-form-item>
        <el-form-item label="薪水计算类名称" prop="salaryClass">
          <el-input  v-model="dialogForm.salaryClass" placeholder="请输入标签名称" ></el-input>
        </el-form-item>
        <el-form-item label="职能定义"  prop="jobDescription">
          <el-input type="textarea" :rows="3"
                    v-model="dialogForm.jobDescription" placeholder="请填写职能定义" ></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="cancalForm('dialogForm')" size="small">取 消</el-button>
          <el-button :loading="insertLoading" type="primary" size="small"  @click="addLabel('dialogForm')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'label-Setting',
  data() {
    return {
      dialogTitle: '添加标签',
      rulesFixOrder: {
        jobTagName: [
          { required: true, message: ' 标签名称不能为空', trigger: 'blur' }
        ],
        iconClass: [
          { required: true, message: ' 标签类名称不能为空', trigger: 'blur' }
        ],
        salaryClass: [
          { required: true, message: ' 薪水计算类名称不能为空', trigger: 'blur' }
        ],
        jobDescription: [
          { required: true, message: ' 职能定义不能为空', trigger: 'blur' }
        ]
      },
      orderList: [],
      totalCount: 0,
      loading: false,
      insertLoading: false,
      centerDialogVisible: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        tagName: '',
        status: ''
      },
      dialogForm: {
        iconClass: '',
        jobTagName: '',
        salaryClass: '',
        jobTagId: '',
        jobDescription: ''
      }
    }
  },
  watch: {
    'form.pageIndex': {
      handler: function(){
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function(){
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    cancalForm(formName) {
      this.centerDialogVisible = false
    },
    showAddDialog(){
      this.dialogForm = {}
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
      this.centerDialogVisible = true
    },
    formatStatus(row, column) {
      let arr = {
        'N': '启用',
        'D': '停用'
      }
      return arr[row.status]
    },
    async switchUse (item){
      try {
        this.loading = true
        const data = await this.$$main.tagUpdateStatus({
          jobTagId: item.jobTagId,
          status: item.status === 'D' ? 'N' : 'D'
        })
        this.loading = false
        data && this.queryOrderList()
      } catch (e){
        this.loading = false
        e.message && this.$message.error(e.message)
      }
    },
    goEdit (item){
      this.dialogTitle = '编辑标签'
      this.dialogForm = JSON.parse(JSON.stringify(item))
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
      this.centerDialogVisible = true
    },
    async queryOrderList() {
      try {
        this.loading = true
        const data = await this.$$main.tagList(this.form)
        this.loading = false
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e){
        this.loading = false
        e.message && this.$message.error(e.message)
      }
    },
    async addLabel(){
      try {
        const isValid = await this.$refs.dialogForm.validate()
        if (!isValid) return
        this.insertLoading = true
        await this.$$main.tagOperation(this.dialogForm)
        this.insertLoading = false
        this.centerDialogVisible = false
        this.queryOrderList()
      } catch (e){
        this.insertLoading = false
        e.message && this.$message.error(e.message)
      }
    }
  },
  mounted() {
    this.queryOrderList()
  }
}
</script>
