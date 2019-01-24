<template>
  <x-page breadcrumb="auto" title="银行流水预警">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow" style="min-width:800px;min-height:1000px">
      <!--<el-form :inline="true" size="mini" label-width="100px" label-position="left" class="demo-form-inline">-->
        <!--<el-form-item label="客户名称：">-->
          <!--<el-input v-model="searchForm.customerName" placeholder="请输入客户名称" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="站点名称：">-->
          <!--<el-input v-model="searchForm.companyName" placeholder="请输入站点名称" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="税源地：">-->
          <!--<el-select v-model="searchForm.sourceTaxId" filterable placeholder="请选择税源地" style="width: 200px">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option v-for="item in sourceTaxList" :key="item.sourceTaxId" :label="item.sourceTaxName"-->
                       <!--:value="item.sourceTaxId"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="商品：" prop="goodsId">-->
          <!--<el-select v-model="searchForm.goodsId" filterable placeholder="请选择商品" style="width: 200px">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName"-->
                       <!--:value="item.goodsId"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态：" prop="goodsId">-->
          <!--<el-select v-model="searchForm.status" filterable placeholder="请选择状态" style="width: 200px">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="正常" value="N"></el-option>-->
            <!--<el-option label="禁用" value="D"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="queryAccountOrders">搜索</el-button>-->
          <!--<el-button type="danger" @click="clearQueryParams">清空</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        :border="true"
        :highlight-current-row="true"
        size="mini">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="编号" prop="companyId" width="50" align="center" fixed/>
        <el-table-column label="站点名称" prop="companyName" min-width="120">
          <CompanyDetailsDialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </CompanyDetailsDialog>
        </el-table-column>
        <el-table-column label="客户名称" prop="customerName" width="150">
          <CustomerDetailsDialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </CustomerDetailsDialog>
        </el-table-column>
        <el-table-column label="交易日期" prop="tradeTime" width="150"/>
        <el-table-column label="预警类型" prop="warningType" min-width="120"/>
        <el-table-column label="预警项目" prop="warningContent" min-width="120"/>
        <el-table-column label="处置结果" prop="handleContent" min-width="120"/>
        <el-table-column label="处置时间" prop="handleTime" min-width="120"/>
        <el-table-column label="操作" width="100" align="center" header-align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onClickHandleWarning(scope.row)"
                       :disabled="scope.row.handleStatus === 'A'"
                       v-html="scope.row.handleStatus === 'W' ? '待处理' : '已处理'">
            </el-button>
            <!--W待处理A已处理-->
            <!--<router-link :to="`/company/create?companyId=${scope.row.companyId}`" target="_blank">处理</router-link>-->
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
      <el-dialog title="处理银行预警" v-drag-dialog="{reset: true}"  width="500px" center
                 :visible.sync="dialogFormVisible">
        <el-form :model="handleForm" :rules="rulesForm" status-icon ref="handleForm" label-width="80px">
            <el-form-item label="处理内容" prop="handleContent">
            <el-input type="textarea" v-model="handleForm.handleContent"
                      :autosize="{ minRows: 4, maxRows: 8}"
                      placeholder="请输入处理内容"
                      max="10"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleWarning">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </x-page>
</template>

<script>
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'

export default {
  name: 'bank-flow-warning',
  components: {GoodsDetailsDialog, CompanyDetailsDialog, CustomerDetailsDialog, TaxSourceDetailsDialog},
  data() {
    return {
      handleForm: {
        warningId: '',
        handleContent: ''
      },
      dialogFormVisible: false,
      rulesForm: {
        handleContent: [
          {required: true, message: '预警处理内容不能为空', trigger: ['blur', 'change']},
          {required: true, message: '预警处理内容不能能超过100字', min: 0, max: 100, trigger: ['blur', 'change']}
        ]
      },
      searchForm: {
        customerName: '',
        companyName: '',
        sourceTaxId: '',
        goodsId: '',
        status: ''
      },
      sourceTaxList: [],
      goodsList: [],
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {
        sortType: 'D',
        sortName: 'registerTime'
      },
      statusText: {A: '全部', N: '正常', D: '禁用'}
    }
  },
  watch: {
    pageIndex() {
      this.loadWaitHandleList()
    },
    pageSize() {
      this.loadWaitHandleList()
    }
  },
  methods: {
    onSearchClick() {
      this.loadLogs()
    },
    onClickHandleWarning(row){
      let Row = JSON.parse(JSON.stringify(row))
      this.handleForm.handleContent = Row.handleForm
      this.handleForm.warningId = Row.warningId
      this.dialogFormVisible = true
      this.clearQueryParams()
      this.$nextTick(() => {
        this.$refs.handleForm.clearValidate()
      })
    },
    handleWarning(){
      this.$refs['handleForm'].validate((valid) => {
        if (valid) {
          this.handleWarningConfirm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleWarningConfirm(){
      try {
        await this.$$main.riskHandleCompanyWaterWarning(this.handleForm)
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async loadWaitHandleList() {
      this.loading = true
      try {
        // const result = await this.$$main.riskQueryCompanyWaterWarning({ // RiskHandleCompanyWaterWarning
        //   pageIndex: this.pageIndex,
        //   pageSize: this.pageSize
        // })
        const result = await this.$$main.orderAccountOrderQuery({
          customerName: '',
          goodsId: '',
          orderCompletedBeginTime: '',
          orderCompletedEndTime: '',
          orderCompletedTime: '',
          orderNo: '',
          pageIndex: 1,
          pageSize: 15,
          sourceTaxId: '',
          submitBeginTime: '',
          submitEndTime: '',
          submitTime: ''
        })
        console.log(result)
        this.totalCount = result.totalCount
        this.tableData = result.datas
        this.tableData = [{
          'companyName': '南通第一软件咨询有限公司',
          'companyId': 22,
          'warningId': 122,
          'customerName': '王小二',
          'traderName': '瑷石财务咨询（上海）有限公司',
          'bankName': '中国建设银行',
          'handleContent': '已出警告函，2018-12-12',
          'warningType': 20,
          'warningContent': '当如入账200000元，转出180000元',
          'remark': '摘要摘要摘要',
          'handleStatus': 'W',
          'tradeTime': '2018-09-19 11:28:38',
          'handleTime': '2018-09-19 11:28:38'
        },
        {
          'companyName': '南通第二软件咨询有限公司',
          'companyId': 23,
          'warningId': 123,
          'customerName': '王小二',
          'traderName': '瑷石财务咨询（上海）有限公司',
          'bankName': '中国建设银行',
          'handleContent': '已出警告函，2018-12-12',
          'warningType': 30,
          'warningContent': '当如入账200000元，转出180000元',
          'remark': '摘要摘要摘要',
          'handleStatus': 'A',
          'tradeTime': '2018-09-19 11:28:38',
          'handleTime': '2018-09-19 11:28:38'
        }]
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams() {
      this.handleForm = {
        warningId: '',
        handleContent: ''
      }
    },
    onPageShow() {
      this.loadWaitHandleList()
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>
