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
    </el-card>
  </x-page>
</template>

<script>
import Utils from '../../libs/utils'

export default {
  name: 'taxAdvisor',
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
      beginTime: '',
      endTime: '',
      pageIndex: 1,
      pageSize: 20,
      dataList: [],
      currentPage4: 4,
      totalCount: 0
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
</style>
