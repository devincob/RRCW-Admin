<template>
  <x-page breadcrumb="auto" title="税源地列表">
    <el-card class="el-card-mini no-border-radius no-box-shadow" body-style="padding: 10px">
      <el-table :data="users"
                v-loading="loading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                stripe
                @sort-change="onSortChange"
                size="mini"
                style="width: 100%;border-top:1px #eee solid">
        <el-table-column align="center" label="税源地编号" prop="sourceTaxId" width="100" fixed>
          <template slot-scope="scope">
            <router-link target="_blank"
                         :to="`/taxSourceManagement/addTaxSource?sourceTax_id=${scope.row.sourceTaxId}`"
                         type="success" size="mini"
                         style="text-decoration: underline; color: deepskyblue;cursor: pointer;"
                         v-html="scope.row.sourceTaxId">
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="sourceTaxName"/>
        <el-table-column align="center" label="城市">
          <span slot-scope="scope">
            {{scope.row.provinceName}}{{scope.row.cityName}}
          </span>
        </el-table-column>
        <el-table-column align="center" label="法人年龄上限" prop="legalAge"  width="100"/>
        <el-table-column align="center" label="联系人" prop="contact"  width="100"/>
        <el-table-column align="center" label="联系人手机" prop="phone" width="100"/>
        <el-table-column align="center" label="是否需要财务身份证复印件" prop="isNeedFinanceID" width="200">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.isNeedFinanceID === 'N',
                'text-danger':scope.row.isNeedFinanceID === 'Y'
                }">
            {{isNeedText[scope.row.isNeedFinanceID]}}
          </span>
        </el-table-column>
        <el-table-column align="center" label="增值税返税比率" prop="zzsRatio" width="100"/>
        <el-table-column align="center" label="个税返税比率" prop="grsdsRatio" width="100"/>
        <el-table-column align="center" label="附加税返税比率" prop="fjsRatio" width="100"/>
        <el-table-column align="center" label="印花税返税比率" prop="yhsRatio" width="100"/>
        <el-table-column align="center" label="状态" prop="status" width="100">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.status === 'N',
                'text-danger':scope.row.status === 'D'
                }">
            {{statusText[scope.row.status]}}
          </span>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="showCreateTime"/>
        <el-table-column label="操作" fixed="right" width="150" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onDisabledClick(scope.row)"
                       v-html="scope.row.status === 'D' ? '正常' : '禁用'">
              <!--:class="{'text-success':scope.row.status === 'D','text-danger':scope.row.status === 'N'}"-->
            </el-button>
            <router-link :to="`/taxSourceManagement/addTaxSource?sourceTax_id=${scope.row.sourceTaxId}`" target="_blank">编辑</router-link>
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
const formDefaultData = {
  adminUserId: 0,
  sourceTaxId: 0,
  sourceTaxName: '',
  provinceIdId: '',
  cityId: '',
  ZZSRatio: '',
  GRSDSRatio: '',
  FJSRatio: '',
  YHSRatio: '',
  legalAge: '',
  isNeedFinanceID: 'N',
  contact: '',
  phone: '',
  status: 'N'
}
export default {
  name: 'taxSource_list',
  data(){
    return {
      centerDialogVisible: false,
      dialogForm: {...formDefaultData},
      loading: false,
      users: [],
      roles: [],
      totalCount: 0,
      searchForm: {
        sourceTaxName: '',
        invoiceNo: '',
        cityId: ''
      },
      pageSize: 15,
      pageIndex: 1,
      sorts: {
        sortType: 'D',
        sortName: 'createTime'
      },
      statusText: {N: '正常', D: '禁用'},
      isNeedText: {N: '否', Y: '是'}
    }
  },
  watch: {
    pageIndex(){
      this.loadList()
    },
    pageSize(){
      this.loadList()
    },
    centerDialogVisible(val){
      if (!val) {
        // 重置表单数据
        this.dialogForm = {...formDefaultData}
        // 重置表单验证状态
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    onSearchClick(){
      this.loadList()
    },
    onEditClick(row){
      let adminInfo = {}
      Object.keys(row).forEach(key => {
        if (['createTime', 'formatCreateTime', 'loginPwd', 'adminRoleName', 'adminRoleNames'].indexOf(key) === -1) adminInfo[key] = row[key]
      })
      adminInfo.loginPwd = ''
      this.dialogForm = adminInfo
      this.centerDialogVisible = true
    },
    async onDisabledClick(row){
      try {
        const sourceStatus = await this.$$main.sourceTaxUpdate({
          sourceTaxId: row.sourceTaxId,
          status: row.status === 'N' ? 'D' : 'N'
        })
        sourceStatus && this.loadList()
      } catch (e) {
        console.log(e)
      }
    },
    onAddAccountClick(){
      this.centerDialogVisible = true
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
          sortName: 'createTime'
        }
      }
      this.loadList()
    },
    async onDialogFormSubmit(){
      let loader
      try {
        const isValid = await this.$refs.form.validate()
        if (isValid) {
          console.log(this.dialogForm)
        }
        loader = this.$loading({
          target: this.$refs.form.$el,
          text: '正在保存信息'
        })
        const result = await this.$$main.userOperationAdmin({
          ...this.dialogForm
        })
        if (result) {
          this.$message.success('保存成功')
          this.centerDialogVisible = false
        }
        this.loadList()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
        console.log(e)
      } finally {
        if (loader) loader.close()
      }
    },
    async loadList(){
      this.loading = true
      try {
        const data = await this.$$main.sourceTaxList({ // SourceTaxList
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          sourceTaxName: this.searchForm.sourceTaxName,
          sorts: this.sorts
        })
        this.totalCount = data.totalCount
        this.users = data.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageShow(){
      this.loadList()
    }
  },
  mounted(){
    console.log(this.$refs)
  }
}
</script>
