<template>
    <x-page breadcrumb="auto" title="推广商列表">
      <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
        <div>
          <el-form :inline="true" size="mini" class="demo-form-inline">
            <el-form-item label="推广商编号">
              <el-input placeholder="推广商编号" v-model="listForm.promoterUserId" style="width: 140px"/>
            </el-form-item>
            <el-form-item label="推广商名称">
              <el-input placeholder="推广商名称" v-model="listForm.promoterName" style="width: 140px"/>
            </el-form-item>
            <el-form-item label="推广商状态">
              <el-select v-model="listForm.status" placeholder="请选择推广商状态" style="width: 140px">
                <el-option
                  v-for="item in listStatus"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onScreenList">筛选</el-button>
              <el-button type="danger" @click="clearQueryParams">重置</el-button>
              <el-button type="success" @click="createPromoter()">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="promoterList"
          v-loading="loading"
          :highlight-current-row="true"
          :border="true"
          ref="promoterList"
          element-loading-text="拼命加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          size="mini"
          @sort-change="onSortChange"
          style="width: 100%;">
          <el-table-column prop="promoterUserId" label="推广商编号" min-width="100"/>
          <el-table-column prop="promoterName" label="推广商名称" min-width="150"/>
          <el-table-column prop="promoterLevelName" label="等级/当前经验值" min-width="150">
            <template slot-scope="scope">
              {{scope.row.promoterLevelName}} / {{scope.row.exp}}
            </template>
          </el-table-column>
          <el-table-column sortable prop="sumDivideAmount" label="累计获利" min-width="150"/>
          <el-table-column sortable prop="sumWorkerCount" label="累计推广用户" min-width="150"/>
          <el-table-column sortable prop="sumAbleWorkerCount" label="累计推广有效用户" min-width="150"/>
          <el-table-column sortable prop="sumOrderWorkerCount" label="累计接单用户" min-width="150"/>
          <el-table-column prop="registerTime" label="创建时间" min-width="150"/>
          <el-table-column fixed="right" prop="status" label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onDisablePromoter(scope.row, 'N')" v-if="scope.row.status === 'D'">启用</el-button>
              <el-button size="mini" type="danger" @click="onDisablePromoter(scope.row, 'D')" v-else>禁用</el-button>
              <el-button size="mini" type="primary" @click="createPromoter(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-right">
          <el-pagination
            class="mt-sm"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="listForm.pageSize"
            :current-page="listForm.pageIndex"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="(size) => this.listForm.pageSize = size"
            @current-change="(index) => this.listForm.pageIndex = index">
          </el-pagination>
        </div>
      </el-card>
      <el-dialog
        title="推广商"
        :close-on-click-modal="false"
        :visible.sync="createPromoterDialog"
        width="400px"
        customClass="create-promoter-dialog"
        center>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="form.loginName" placeholder="登录账号" :disabled="!!form.promoterUserId"/>
          </el-form-item>
          <el-form-item label="登录密码" :prop="form.promoterUserId ? '' : 'loginPwd'">
            <el-input v-model="form.loginPwd" placeholder="登录密码"/>
          </el-form-item>
          <el-form-item label="推广商名称" prop="promoterName">
            <el-input v-model="form.promoterName" placeholder="推广商名称"/>
          </el-form-item>
          <el-form-item label="推广商电话" prop="phone">
            <el-input v-model="form.phone" placeholder="推广商电话"/>
          </el-form-item>
          <el-form-item label="推广商状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择推广商状态" style="width: 100%">
              <el-option
                v-for="item in status"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
          <el-button size="mini" type="danger" @click="createPromoterDialog = false">取消</el-button>
        </span>
      </el-dialog>
    </x-page>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      createPromoterDialog: false,
      form: {
        promoterName: '', // 姓名
        loginName: '', // 登录名
        loginPwd: '', // 密码
        promoterLevelId: '', // 等级
        status: 'N', // 状态(N/D)
        phone: '', // 电话
        promoterUserId: '' // 编号
      },
      rules: {
        promoterName: [
          { required: true, message: '请输推广商名称', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入推广商电话', trigger: 'change' }
        ],
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'change' }
        ],
        loginPwd: [
          { required: true, message: '请输入登录密码', trigger: 'change' }
        ],
        promoterLevelId: [
          { required: true, message: '请选择推广商等级', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择推广商状态', trigger: 'change' }
        ]
      },
      status: [
        {
          key: 'N',
          value: '正常'
        },
        {
          key: 'D',
          value: '禁用'
        }
      ],
      loading: false,
      listForm: {
        pageIndex: 1,
        pageSize: 20,
        promoterUserId: '', // 推广商编号
        promoterName: '', // 推广商名称
        status: '' // 状态(N/D)
      },
      sorts: {
        sortType: '',
        sortName: ''
      },
      totalCount: 0,
      promoterList: [],
      listStatus: [
        {
          key: '',
          value: '全部'
        },
        {
          key: 'N',
          value: '正常'
        },
        {
          key: 'D',
          value: '禁用'
        }
      ]
    }
  },
  watch: {
    createPromoterDialog(val){
      !val && this.formClear()
    },
    'listForm.pageIndex': {
      handler: function () {
        this.onScreenList()
      },
      deep: true
    },
    'listForm.pageSize': {
      handler: function () {
        this.onScreenList()
      },
      deep: true
    }
  },
  methods: {
    onPageShow(){
      this.clearQueryParams()
      this.onScreenList()
    },
    createPromoter(data){
      this.createPromoterDialog = true
      if (!data) {
        return
      }
      this.form = {
        promoterName: data.promoterName || '',
        loginName: data.loginName || '',
        loginPwd: data.loginPwd || '',
        promoterLevelId: data.promoterLevelId || 0,
        status: data.status,
        phone: data.phone || '',
        promoterUserId: data.promoterUserId || 0
      }
    },
    onDisablePromoter(item, status){
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, `是否要${status === 'D' ? '禁用' : '启用'}推广商`),
          h('span', { style: 'color: red' }, ` ${item.promoterName} `),
          h('span', null, `？`)
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'change-promoter-status-alert',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.savePromoterStatus(item, status, done)
          } else {
            done()
          }
        }
      })
    },
    async savePromoterStatus(item, status, done){
      const loading = this.$loading({
        text: '正在操作',
        target: '.change-promoter-status-alert'
      })
      try {
        await this.$$main.promoterDoChangeStatus({
          promoterUserId: item.promoterUserId || 0,
          status: status
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        done()
        this.onScreenList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.savePromoter()
        }
      })
    },
    async savePromoter(){
      const loading = this.$loading({
        text: '正在保存',
        target: '.create-promoter-dialog'
      })
      try {
        await this.$$main.promoterDoSave(this.form)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.createPromoterDialog = false
        this.formClear()
        this.onScreenList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    formClear(){
      this.form = {
        promoterName: '', // 姓名
        loginName: '', // 登录名
        loginPwd: '', // 密码
        promoterLevelId: '', // 等级
        status: 'N', // 状态(N/D)
        phone: '', // 电话
        promoterUserId: '' // 编号
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    async onScreenList(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        let param = this.sorts.sortName && this.sorts.sortType ? Object.assign(this.listForm, {
          sorts: this.sorts
        }) : this.listForm
        const data = await this.$$main.promoterQueryList(param)
        this.totalCount = data.totalCount
        this.promoterList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
      this.listForm = {
        pageIndex: 1,
        pageSize: 20,
        promoterUserId: '', // 推广商编号
        promoterName: '', // 推广商名称
        status: ''
      }
      this.sorts = {
        sortType: '',
        sortName: ''
      }
      this.$refs['promoterList'].clearSort()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.prop,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      } else {
        this.sorts = {
          sortName: '',
          sortType: ''
        }
      }
      this.onScreenList()
    }
  },
  mounted() {}
}
</script>
