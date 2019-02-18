<template>
  <x-page breadcrumb="auto" title="财税师服务">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.userName" placeholder="请输入姓名" class="w130" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formInline.mobile" placeholder="请输入联系电话" class="w130" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="formInline.cityName" placeholder="请输入城市" class="w130" />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="submitTime" align="right" unlink-panels type="daterange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户来源">
          <el-select v-model="formInline.soure" placeholder="全部" class="w130">
            <el-option v-for="(item, index) in sources" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formInline.type === 'H'">
          <el-button type="primary" @click="dialogVisible = true">新建</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryTaxList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="dataList" style="width: 100%" size="mini" stripe>
        <el-table-column prop="formatCreateTime" label="提交时间" />
        <el-table-column prop="userName" label="姓名" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="otherMobile" label="其他电话" />
        <el-table-column prop="soure" label="客户来源" />
        <el-table-column prop="cityName" label="所在城市" />
      </el-table>
      <div class="text-right">
        <el-pagination class="mt-sm" layout="total, sizes, prev, pager, next, jumper"
                       :page-size="pageSize" :total="totalCount"
                       :current-page.sync="pageIndex"
                       :page-sizes="[5, 10, 20, 50]" @size-change="(size) => {pageSize = size}" >
        </el-pagination>
      </div>

      <el-dialog
        title="新增税管家客源"
        v-loading="ajaxLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :visible.sync="dialogVisible"
        width="45%">
        <el-form :inline="true" size="small" class="demo-form-inline" label-width="80px"
                 ref="ruleForm" :model="ruleForm" :rules="rules" status-icon>
          <el-row class="mb-lg">
            <el-col :span="12">
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="ruleForm.userName" placeholder="请输入姓名" class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="mobile">
                <el-input type="tel" v-model="ruleForm.mobile" placeholder="请输入联系电话" class="w160" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb-lg">
            <el-col :span="12">
              <el-form-item label="所在城市" prop="cityName">
                <el-input v-model="ruleForm.cityName" placeholder="请输入城市" class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他电话" prop="otherMobile">
                <el-input v-model="ruleForm.otherMobile" placeholder="请输入城市" class="w160" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="validForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </x-page>
</template>

<script>
import Utils from '../../libs/utils'

export default {
  name: 'tax',
  data(){
    return {
      formInline: {
        userName: '',
        mobile: '',
        cityName: '',
        soure: '',
        type: ''
      },
      options: {},
      submitTime: [],
      sources: ['人人财务官网', '微信服务号', '朋友', '微信朋友圈', '微博', '今日头条'],
      loading: false,
      beginTime: '',
      endTime: '',
      pageIndex: 1,
      pageSize: 20,
      dataList: [],
      currentPage4: 4,
      dialogVisible: false,
      ajaxLoading: false,
      ruleForm: {
        userName: '',
        mobile: '',
        cityName: '',
        otherMobile: ''
      },
      totalCount: 0,
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^(\+?0?86-?)?1[3456789]\d{9}$/, message: '请输入正确的联系方式', trigger: 'blur' }
        ],
        cityName: [
          { required: true, message: '请输入所在城市', trigger: 'blur' }
        ],
        otherMobile: [
          { pattern: /^(\+?0?86-?)?1[3456789]\d{9}$/, message: '请输入正确的联系方式', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    submitTime(val){
      if (val){
        this.beginTime = val ? Utils.dateFormat(val[0], 'yyyy-MM-dd') : ''
        this.endTime = val ? Utils.dateFormat(val[1], 'yyyy-MM-dd') : ''
      }
    },
    pageIndex(){
      this.queryTaxList()
    },
    pageSize(){
      this.queryTaxList()
    },
    dialogVisible(val){
      if (!val) this.$refs['ruleForm'].resetFields()
    }
  },
  methods: {
    async queryTaxList(){
      this.loading = true
      this.options = {
        ...this.formInline,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        beginTime: this.beginTime,
        endTime: this.endTime
      }
      try {
        const result = await this.$$main.aUserTaxList(this.options)
        this.loading = false
        this.totalCount = result.totalCount
        this.dataList = result.datas
      } catch (e) {
        this.loading = false
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'warning'
        })
      }
    },
    exportData(){
      this.loading = true
      this.$$main.execute('/A/User/TaxList', {
        header: {
          method: 'Export'
        },
        body: this.options,
        onSuccess: (data) => {
          this.loading = false
          if (data.attachments && data.attachments.url && data.attachments.url !== ''){
            window.open(data.attachments.url)
          }
        },
        onError: (e) => {
          this.loading = false
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'warning'
          })
        }
      })
    },
    validForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid){
          this.addServiceInfo()
        }
      })
    },
    async addServiceInfo() {
      try {
        this.ajaxLoading = true
        await this.$$main.aUserAddTax(this.ruleForm)
        this.ajaxLoading = false
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.queryTaxList()
      } catch (e) {
        this.ajaxLoading = false
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'warning'
        })
      }
    },
    onPageParamsChange(params, {from}){
      if (from.name === 'tax') {
        this.formInline = {
          userName: '',
          mobile: '',
          cityName: '',
          soure: '',
          type: params.type.toUpperCase()
        }
        this.submitTime = []
        this.queryTaxList()
      }
    }
  },
  mounted(){
    this.formInline.type = this.$route.params.type && this.$route.params.type.toUpperCase()
    this.queryTaxList()
  }
}
</script>

<style scoped>
  .w130{
    width: 130px;
    padding: 0 5px 0 0;
  }
</style>
