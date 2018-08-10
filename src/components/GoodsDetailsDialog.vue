<template>
  <div>
    <CPicker title="商品详情" :visible.sync="visibleDialog">
      <div v-if="goods && goods.goodsId">
        <div v-if="loading">
          loading...
        </div>
        <table v-else class="details-table">
          <tr>
            <td class="td-label">商品编号</td>
            <td>{{goods.goodsId}}</td>
            <td class="td-label">商品名称</td>
            <td>{{goods.goodsName}}</td>
          </tr>
          <tr>
            <td class="td-label">纳税性质</td>
            <td>{{userTypeText[goods.taxType]}}</td>
            <td class="td-label">发票类型</td>
            <td>{{goods.invoiceTypeName}}</td>
          </tr>
          <tr>
            <td class="td-label">开票服务费费率</td>
            <td>{{goods.invoiceServiceRatio}}</td>
            <td class="td-label">开户服务费</td>
            <td>{{goods.serviceCharge}}</td>
          </tr>
          <tr>
            <td class="td-label">开户押金</td>
            <td>{{goods.deposit}}</td>
            <td class="td-label">状态</td>
            <td>{{statusText[goods.status]}}</td>
          </tr>
        </table>
      </div>
    </CPicker>
    <el-button type="text" size="mini" class="no-padding" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'
export default {
  name: 'GoodsDetailsDialog',
  components: {CPicker},
  props: ['goodsId'],
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
      goods: null,
      loading: false,
      userTypeText: {A: '全部', N: '一般纳税人', S: '小规模纳税人'},
      statusText: {A: '全部', N: '正常', D: '禁用'}
    }
  },
  methods: {
    loadDetail(){
      this.loading = true
      this.$$main.goodsDetail({
        goodsId: this.goodsId
      }).then(res => {
        this.goods = res
        this.loading = false
      }).catch(e => {
        this.goods = null
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
