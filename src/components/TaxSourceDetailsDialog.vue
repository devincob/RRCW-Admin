<template>
  <div>
    <CPicker title="税源地详情" :visible.sync="visibleDialog">
      <div v-if="loading">
        loading...
      </div>
      <div v-else-if="sourceTaxInfo && sourceTaxInfo.sourceTaxId">
        <table  class="details-table">
          <tr>
            <td class="td-label">税源地编号</td>
            <td>{{sourceTaxInfo.sourceTaxId}}</td>
            <td class="td-label">税源地名称</td>
            <td>{{sourceTaxInfo.sourceTaxName}}</td>
          </tr>
          <tr>
            <td class="td-label">省份城市</td>
            <td>{{sourceTaxInfo.provinceName}} {{sourceTaxInfo.cityName}}</td>
            <td class="td-label">增值税返税比率</td>
            <td>{{sourceTaxInfo.zzsRatio}}</td>
          </tr>
          <tr>
            <td class="td-label">个税返税比率</td>
            <td>{{sourceTaxInfo.grsdsRatio}}</td>
            <td class="td-label">附加税返税比率</td>
            <td>{{sourceTaxInfo.fjsRatio}}</td>
          </tr>
          <tr>
            <td class="td-label">印花税返税比率</td>
            <td>{{$utils.dateFormat(sourceTaxInfo.yhsRatio, 'yyyy-MM-dd')}}</td>
            <td class="td-label">法人年龄上限</td>
            <td>{{sourceTaxInfo.legalAge}}</td>
          </tr>
          <tr>
            <td class="td-label">财务身份证</td>
            <td>{{needText[sourceTaxInfo.isNeedFinanceID]}}</td>
            <td class="td-label">园区联系人</td>
            <td>{{sourceTaxInfo.contact}}</td>
          </tr>
          <tr>
            <td class="td-label">联系电话</td>
            <td>{{sourceTaxInfo.phone}}</td>
            <td class="td-label">状态</td>
            <td>{{statusText[sourceTaxInfo.status]}}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        税源地不存在...
      </div>
    </CPicker>
    <el-button type="text" size="mini" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'
export default {
  name: 'TaxSourceDetailsDialog',
  components: {CPicker},
  props: ['sourceTaxId'],
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
      sourceTaxInfo: null,
      loading: false,
      statusText: {A: '全部', N: '正常', D: '禁用'},
      needText: {Y: '需要', N: '不需要'}
    }
  },
  methods: {
    loadDetail(){
      this.loading = true
      this.$$main.sourceTaxDetail({
        sourceTaxId: this.sourceTaxId
      }).then(res => {
        this.sourceTaxInfo = res
        this.loading = false
      }).catch(e => {
        this.sourceTaxInfo = null
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
