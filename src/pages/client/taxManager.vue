<template>
  <x-page breadcrumb="auto" title="税管家">
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
          <el-date-picker unlink-panels align="right" type="daterange" v-model="submitTime"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户来源">
          <el-select v-model="formInline.soure" placeholder="全部" class="w130">
            <el-option v-for="(item, index) in sources" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
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
                <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" class="w160" />
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
  name: 'taxManager',
  data(){
    return {
      formInline: {
        userName: '',
        mobile: '',
        cityName: '',
        soure: '',
        type: 'T'
      },
      options: {},
      submitTime: '',
      sources: ['人人财务官网', '微信服务号', '朋友', '微信朋友圈', '微博', '今日头条'],
      loading: false,
      ajaxLoading: false,
      beginTime: '',
      endTime: '',
      pageIndex: 1,
      pageSize: 20,
      dataList: [],
      currentPage4: 4,
      totalCount: 0,
      dialogVisible: false,
      ruleForm: {
        userName: '',
        mobile: '',
        cityName: '',
        otherMobile: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        cityName: [
          { required: true, message: '请输入所在城市', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    submitTime(val){
      if (val){
        this.beginTime = Utils.dateFormat(val[0], 'yyyy-MM-dd')
        this.endTime = Utils.dateFormat(val[1], 'yyyy-MM-dd')
      }
    },
    pageIndex(){
      this.queryTaxList()
    },
    pageSize(){
      this.queryTaxList()
    },
    dialogVisible(val){
      if (!val){
        this.$refs['ruleForm'].resetFields()
      }
    }
  },
  methods: {
    queryTaxList(){
      this.loading = true
      this.options = {
        ...this.formInline,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        beginTime: this.beginTime,
        endTime: this.endTime
      }
      this.$$main.aUserTaxList(this.options).then(res => {
        this.loading = false
        if (res && res.datas && res.datas.length && res.totalCount){
          this.totalCount = res.totalCount
          this.dataList = res.datas
        }
      }).catch(e => {
        this.loading = false
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'warning'
        })
      })
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
    addServiceInfo() {
      this.ajaxLoading = true
      // TODO 接口不在 CaiWuModel.js 里
      this.$$main.execute('/M/User/AddServiceInfo', {
        body: this.ruleForm,
        onSuccess: (data) => {
          this.ajaxLoading = false
          if (data) {
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            })
          }
        },
        onError: (e) => {
          this.ajaxLoading = false
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'warning'
          })
        }
      })
    }
  },
  created(){
    this.queryTaxList()
  }
}
</script>

<style scoped>
  .w130{
    width: 130px;
    padding: 0 5px 0 0;
  }
  .w160{
    width: 160px;
  }
</style>
