<template>
  <x-page breadcrumb="auto" title="反馈详情">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>开票申请</el-breadcrumb-item>
      <el-breadcrumb-item>开票申请详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card mt-lg">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <el-form ref="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票抬头：">
              <span>{{orderInfo.invoiceTitle}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票税号：">
              <span>{{orderInfo.companyTaxNo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="orderInfo.invoiceType === 'IE'">
          <el-col :span="6">
            <el-form-item label="公司地址：">
              <span>{{orderInfo.companyAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司电话：">
              <span style="margin-right: 20px">{{orderInfo.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户银行：">
              <span>{{orderInfo.bankName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户账号：">
              <span>{{orderInfo.bankAccount}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card >
      <el-table
        center
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column align="center"
                         prop="orderNo"
                         label="订单号"
                         min-width="100">
        </el-table-column>
        <el-table-column align="center"
                         prop="payUser"
                         label="付款对象"
                         min-width="100">
        </el-table-column>
        <el-table-column align="center"
                         prop="payType"
                         label="付款方式"
                         min-width="100"
                         :formatter="formatPayType">
        </el-table-column>
        <el-table-column align="center"
                         prop="payAmount"
                         label="订单金额(元)"
                         min-width="100">
          <span slot-scope="scope">{{scope.row.payAmount / 100 | currency }}</span>
        </el-table-column>
      </el-table>
      <div class="bottom clearfix" style="text-align: center; margin-top: 20px;" v-if="orderInfo.status==='W'">
        <el-button type="success" class="button" @click.native = "agreePass">同意</el-button>
        <el-button type="danger" class="button" @click = "dialogFormVisible = true">驳回</el-button>
      </div>
      <div class="bottom clearfix" style="text-align: center; margin-top: 20px;" v-else>
        <el-button type="danger" class="button" v-if="orderInfo.status==='R'">已驳回</el-button>
        <el-button type="success" class="button" v-else>已同意</el-button>
      </div>
    </el-card>
    <el-dialog title="输入驳回原因" :visible.sync="dialogFormVisible" width="30%"
               center>
      <el-form center>
        <el-form-item label="" >
          <el-input  type="textarea"
                     :rows="3"
                     placeholder="请输入驳回原因"
                     v-model="backReasons" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="disAgreePass" :disabled = "backReasons === ''">保 存</el-button>
      </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'feedback-deital',
  data() {
    return {
      parameter: '',
      backReasons: '',
      dialogFormVisible: false,
      orderList: [],
      totalCount: 0,
      loading: false,
      feedbackId: 0,
      orderInfo: {}
    }
  },
  methods: {
    disAgreePass (){
      this.dialogFormVisible = false
      this.$$main.aFinanceUpdateInvoiceStatus({
        isUpdateExpress: 'N', // 是否修改快递(Y/N)
        status: 'R', // 状态(M:开票中,D:寄出,R:驳回)
        feedbackId: this.feedbackId, // 申请发票编号
        expressName: this.expressName,
        backReasons: this.backReasons
      }).then(res => {
        if (res) {
          this.parameter = res
          this.$showToast({
            autoClose: 1000,
            message: '已驳回',
            type: 'success'
          })
        }
      }).catch(({message}) => {
        this.$showToast({message})
      })
    },
    showDialog (item){
      this.dialogFormVisible = true
    },
    agreePass () {
      this.$$main.aFinanceUpdateInvoiceStatus({
        isUpdateExpress: 'N', // 是否修改快递(Y/N)
        status: 'M', // 状态(M:开票中,D:寄出,R:驳回)
        feedbackId: this.feedbackId, // 申请发票编号
        expressName: this.expressName,
        expressNo: this.expressNo
      }).then(res => {
        if (res) {
          this.$showToast({
            autoClose: 1000,
            message: '已经进行开票',
            type: 'success'
          })
        }
      }).catch(({message}) => {
        this.$showToast({message})
      })
    },
    formatPayType (row, column) {
      let arr = {
        'T1': '微信',
        'T2': '线下'
      }
      return arr[row.payType]
    },
    async queryOrderInfo(){
      const loading = this.$loading({
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      const res = await this.$$main.aFinanceDetails({
        feedbackId: this.feedbackId
      })
      const res2 = await this.$$main.aFinanceOrderList({
        feedbackId: this.feedbackId
      })
      this.orderList = res2.datas
      loading.close()
      this.orderInfo = res
    }
  },
  mounted() {
    this.feedbackId = (this.$route.params && this.$route.params.feedbackId) || 0
    this.queryOrderInfo()
  }
}
</script>
