<template>
  <div>
    <CPicker title="站点详情" :visible.sync="visibleDialog">
      <div v-if="companyInfo && companyInfo.companyId">
        <div v-if="loading">
          正在加载中...
        </div>
        <table v-else class="detail-table">
          <tr>
            <td class="td-label">站点编号</td>
            <td>{{companyInfo.companyId}}</td>
            <td class="td-label">站点名称</td>
            <td>{{companyInfo.companyName}}</td>
          </tr>
          <tr>
            <td class="td-label">站点税号</td>
            <td>{{companyInfo.taxNo}}</td>
            <td class="td-label">站点注册地址</td>
            <td>{{companyInfo.companyAddress}}</td>
          </tr>
          <tr>
            <td class="td-label">公司电话</td>
            <td>{{companyInfo.companyPhone}}</td>
            <td class="td-label">开户银行</td>
            <td>{{companyInfo.accountBank}}</td>
          </tr>
          <tr>
            <td class="td-label">开户银行账号</td>
            <td>{{companyInfo.accountBankAccount}}</td>
            <td class="td-label">开票费率折扣</td>
            <td>{{companyInfo.serviceFeeDiscount}}</td>
          </tr>
          <tr>
            <td class="td-label">税源地</td>
            <td>{{companyInfo.sourceTaxName}}</td>
            <td class="td-label">站点类型</td>
            <td>{{companyInfo.companyTypeName}}</td>
          </tr>
          <tr>
            <td class="td-label">营业执照</td>
            <td>
              <el-button size="mini" type="text" class="no-padding" @click="onPreviewImageClick(companyInfo.licenseUrl)">预览</el-button>
            </td>
            <td class="td-label">状态</td>
            <td>{{statusText[companyInfo.status]}}</td>
          </tr>
          <tr>
            <td class="td-label">经营范围</td>
            <td colspan="3">{{companyInfo.businessScope}}</td>
          </tr>
          <tr>
            <td class="td-label">备注</td>
            <td colspan="3">{{companyInfo.remark}}</td>
          </tr>
        </table>
      </div>
    </CPicker>
    <el-button type="text" class="no-padding" size="mini" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'
export default {
  name: 'CompanyDetailsDialog',
  components: {CPicker},
  props: ['companyId'],
  watch: {
    visibleDialog(val){
      if (val) {
        this.loadDetail()
      }
    }
  },
  data(){
    return {
      visibleDialog: false,
      companyInfo: null,
      loading: false,
      statusText: {A: '全部', N: '正常', D: '禁用'}
    }
  },
  methods: {
    loadDetail(){
      this.loading = true
      this.$$main.companyDetail({
        companyId: this.companyId
      }).then(res => {
        this.companyInfo = res
        this.loading = false
      }).catch(e => {
        this.companyInfo = null
        this.loading = false
      })
    },
    onPreviewImageClick(img){
      window.open(this.getUploadImageUrl(img, null))
    }
  }
}
</script>

<style scoped>
  .details-table {
    width: 100%;
    background-color: #dddddd;
    border-collapse:separate;
    border-spacing:1px 1px;
    table-layout: fixed;
    word-break:break-all;
  }
  .details-table td {
    border: 0;
    padding: 4px 6px;
    word-wrap: break-word;
    white-space: normal;
    vertical-align: baseline;
  }
  .td-label {
    text-align: right;
    width: 120px;
  }
</style>
