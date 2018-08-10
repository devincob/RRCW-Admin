<template>
  <div>
    <CPicker title="客户信息" :visible.sync="visibleDialog">
      <el-tabs v-model="activeName" @tab-click="loadDetail">
        <el-tab-pane label="客户详情" name="first">
          <div v-if="loading">
            loading...
          </div>
          <div v-else-if="customerInfo && customerInfo.customerId">
            <table class="details-table">
              <tr>
                <td class="td-label">客户编号</td>
                <td>{{customerInfo.customerId}}</td>
                <td class="td-label">客户名称</td>
                <td>{{customerInfo.customerName}}</td>
              </tr>
              <tr>
                <td class="td-label">客户手机</td>
                <td>{{customerInfo.phone}}</td>
                <td class="td-label">客户邮箱</td>
                <td>{{customerInfo.email}}</td>
              </tr>
              <tr>
                <td class="td-label">家庭地址</td>
                <td>{{customerInfo.liveAddress}}</td>
                <td class="td-label">办公地址</td>
                <td>{{customerInfo.workAddress}}</td>
              </tr>
              <tr>
                <td class="td-label">客户生日</td>
                <td>
              <span v-if="customerInfo.showBirthday">
                {{$utils.dateFormat(customerInfo.showBirthday, 'yyyy-MM-dd')}}
              </span>
                  <span v-else></span>
                </td>
                <td class="td-label">客户来源</td>
                <td>{{sourceText[customerInfo.source]}}</td>

              </tr>
              <tr>
                <td class="td-label">客户状态</td>
                <td>{{statusText[customerInfo.status]}}</td>
                <td class="td-label">所属部门</td>
                <td>{{customerInfo.deptName}}</td>
              </tr>
              <tr>
                <td class="td-label">所属商务</td>
                <td>{{customerInfo.belongAdminUserName}}</td>
                <td class="td-label"></td>
                <td></td>
              </tr>
              <tr>
                <td class="td-label">备注</td>
                <td colspan="3">{{customerInfo.remark}}</td>
              </tr>
            </table>
          </div>
          <div v-else>
            客户信息不存在或您无权查看该客户信息
          </div>
        </el-tab-pane>
        <el-tab-pane label="发票详情" name="second">
          <div v-if="loading">
            loading...
          </div>
          <div v-else-if="invoiceInfo && invoiceInfo.length">
            <table  class="details-table" v-for="(item, index) in invoiceInfo" :key="index">
              <tr>
                <td class="td-label">发票类型</td>
                <td colspan="3">{{invoiceText[item.invoiceInfoType]}}</td>
              </tr>
              <tr>
                <td class="td-label">公司名称</td>
                <td>{{item.invoiceCompanyName}}</td>
                <td class="td-label">公司税号</td>
                <td>{{item.invoiceCompanyTaxNo}}</td>
              </tr>
              <tr v-if="item.invoiceInfoType === 'Z'">
                <td class="td-label">公司地址</td>
                <td>{{item.invoiceCompanyAddress}}</td>
                <td class="td-label">公司电话</td>
                <td>{{item.invoiceCompanyPhone}}</td>
              </tr>
              <tr v-if="item.invoiceInfoType === 'Z'">
                <td class="td-label">开户银行</td>
                <td>{{item.invoiceCompanyBankName}}</td>
                <td class="td-label">银行账号</td>
                <td>{{item.invoiceCompanyBankNo}}</td>
              </tr>
            </table>
          </div>
          <div v-else>
            发票不存在...
          </div>
        </el-tab-pane>
        <el-tab-pane label="快递详情" name="third">
          <div v-if="loading">
            loading...
          </div>
          <div v-else-if="deliveryInfo && deliveryInfo.length">
            <table  class="details-table" v-for="(item, index) in deliveryInfo" :key="index">
              <tr>
                <td class="td-label">快递地址</td>
                <td>{{item.address}}</td>
                <td class="td-label">收件人</td>
                <td>{{item.receiver}}</td>
              </tr>
              <tr>
                <td class="td-label">收件人电话</td>
                <td>{{item.phone}}</td>
                <td class="td-label"></td>
                <td></td>
              </tr>
              <tr>
                <td class="td-label">备注</td>
                <td colspan="3">{{item.remark}}</td>
              </tr>
            </table>
          </div>
          <div v-else>
            快递不存在...
          </div>
        </el-tab-pane>
      </el-tabs>
    </CPicker>
    <el-button type="text" size="mini" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'

export default {
  name: 'CustomerDetailsDialog',
  components: {CPicker},
  props: ['customerId'],
  watch: {
    activeName(val) {
      if (val) {
        this.loadDetail(val)
      }
    },
    visibleDialog(val) {
      if (val) {
        this.loadDetail('first')
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      visibleDialog: false,
      customerInfo: null,
      invoiceInfo: null,
      deliveryInfo: null,
      loading: false,
      statusText: {A: '全部', N: '正常', D: '禁用'},
      sourceText: {C: '渠道', D: '直属'},
      invoiceText: {Z: '增值税专用发票', P: '增值税普通发票'},
      expressList: [],
      invoiceList: []
    }
  },
  methods: {
    async loadDetail(tab) {
      this.loading = true
      try {
        if (tab === 'first') {
          this.customerInfo = await this.$$main.customerDetail({
            customerId: this.customerId
          })
        } else if (tab === 'second') {
          this.invoiceInfo = await this.$$main.customerListInvoiceInfo({
            customerId: this.customerId
          })
        } else if (tab === 'third') {
          this.deliveryInfo = await this.$$main.customerListAddress({
            customerId: this.customerId
          })
        }
        this.loading = false
      } catch (e) {
        this.customerInfo = null
        this.invoiceInfo = null
        this.deliveryInfo = null
        this.loading = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  .details-table {
    width: 100%;
    background-color: #dddddd;
    border-collapse: separate;
    border-spacing: 1px 1px;
    table-layout: fixed;
    word-break: break-all;
    margin-bottom: 10px;
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
