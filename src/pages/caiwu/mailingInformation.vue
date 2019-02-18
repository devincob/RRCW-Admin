<template>
  <x-page breadcrumb="auto" title="开票申请">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="开票单号">
            <el-input placeholder="开票单号" v-model="form.invoiceNo" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="收件人">
            <el-input v-model="form.receiveName" placeholder="姓名" style="width: 100px"/>
          </el-form-item>
          <el-form-item label="收件人手机">
            <el-input v-number-input v-model="form.mobile" placeholder="手机号" style="width: 120px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          align="center"
          prop="invoiceNo"
          label="开票单号"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="receiveName"
          label="收件人"
          min-width="80">
        </el-table-column>
        <el-table-column
          align="center"
          label="发票类型"
          min-width="80"
          prop="phone">
        </el-table-column>
        <el-table-column
          align="center"
          label="邮寄地址"
          min-width="80"
          prop="address">
        </el-table-column>
        <el-table-column
          align="center"
          prop="expressName"
          label="快递公司"
          min-width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="expressNo"
          label="快递单号"
          min-width="120">
        </el-table-column>
        <!--状态(M:开票中,D:已寄出) Status string-->
        <el-table-column class="text-center" align="center" width="60" minWidth="60" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.status === 'M' ? 'primary' : 'success' "
              @click="showDialog(scope.row)" v-html="scope.row.status === 'M'?'寄出':'修改'">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="新增邮寄信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :label-position="labelPosition">
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-select v-model="expressName" placeholder="请选择活动区域" max-width="300px">
            <el-option label="顺丰" value="顺丰"></el-option>
            <el-option label="中通" value="中通"></el-option>
            <el-option label="申通" value="申通"></el-option>
            <el-option label="圆通" value="圆通"></el-option>
            <el-option label="韵达" value="韵达"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth" >
          <el-input  v-model="expressNo" auto-complete="off" max-width="300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="keepEdit" :disabled = "expressNo === '' || expressName === ''">保 存</el-button>
      </div>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'mailing-information',
  data() {
    return {
      labelPosition: 'left',
      orderList: [],
      totalCount: 0,
      loading: false,
      dialogFormVisible: false,
      isUpdateExpress: '', // 是否修改快递(Y/N)
      status: '', // 状态(M:开票中,D:寄出,R:驳回)
      applyId: '', // 申请发票编号
      expressName: '',
      expressNo: '',
      formLabelWidth: '120px',
      form: {
        pageIndex: 1,
        pageSize: 20,
        receiveName: '',
        invoiceNo: '',
        mobile: ''
      },
      visible2: false
    }
  },
  watch: {
    'form.pageIndex': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    showDialog (item){
      this.dialogFormVisible = true
      this.status = item.status
      this.applyId = item.applyId
      this.expressName = item.expressName
      this.expressNo = item.expressNo
    },
    keepEdit (){
      this.dialogFormVisible = false
      this.$$main.aFinanceUpdateInvoiceStatus({
        isUpdateExpress: this.status === 'M' ? 'N' : 'Y', // 是否修改快递(Y/N)
        status: this.status === 'M' ? 'D' : '', // 状态(M:开票中,D:寄出,R:驳回)
        applyId: this.applyId, // 申请发票编号
        expressName: this.expressName,
        expressNo: this.expressNo
      }).then(res => {
        if (res) {
          this.queryOrderList()
          this.$showToast({
            autoClose: 1000,
            message: '操作成功',
            type: 'success'
          })
        }
      }).catch(({message}) => {
        this.$showToast({message})
      })
    },
    formatAmount(row, column) {
      let arr = {
        'S1': '预约中',
        'S2': '待服务',
        'S3': '服务中',
        'S4': '服务完成',
        'S5': '已取消'
      }
      return arr[row.serviceStatus]
    },
    formatStyle(row, column) {
      let arr = {
        'IO': '专票',
        'IE': '普票'
      }
      return arr[row.invoiceType]
    },
    formatStatus(row, column) {
      let arr = {
        'W': '初始状态',
        'A': '已受理',
        'D': '已配送',
        'R': '驳回'
      }
      return arr[row.status]
    },
    async queryOrderList() {
      this.loading = true
      const data = await this.$$main.aFinanceMailInfoList(this.form)
      this.loading = false
      this.totalCount = data.totalCount
      this.orderList = data.datas
    },
    onPageShow() {
      this.queryOrderList()
    }
  },
  mounted() {
  }
}
</script>
