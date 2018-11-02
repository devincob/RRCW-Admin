<template>
  <x-page breadcrumb="auto" title="公司列表">
    <el-card body-style="padding: 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-form :inline="true" size="mini" label-width="100px" label-position="left" class="demo-form-inline">
        <el-form-item label="客户名称：">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="站点名称：">
          <el-input v-model="searchForm.companyName" placeholder="请输入站点名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="税源地：">
          <el-select v-model="searchForm.sourceTaxId" filterable placeholder="请选择税源地" style="width: 200px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in sourceTaxList" :key="item.sourceTaxId" :label="item.sourceTaxName" :value="item.sourceTaxId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品：" prop="goodsId">
          <el-select v-model="searchForm.goodsId" filterable placeholder="请选择商品" style="width: 200px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="goodsId">
          <el-select v-model="searchForm.status" filterable placeholder="请选择状态" style="width: 200px">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="N"></el-option>
            <el-option label="禁用" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAccountOrders">搜索</el-button>
          <el-button type="danger" @click="clearQueryParams">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        ref="table"
        stripe
        @sort-change="onSortChange"
        size="mini"
        style="width: 100%;border-top:1px #eee solid">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="站点编号" prop="companyId" width="80"/>
        <el-table-column label="站点名称" prop="companyName">
          <CompanyDetailsDialog slot-scope="scope" :company-id="scope.row.companyId">
            <span>{{scope.row.companyName}}</span>
          </CompanyDetailsDialog>
        </el-table-column>
        <el-table-column label="开票折扣率" prop="serviceFeeDiscount"/>
        <el-table-column label="站点类型" prop="companyTypeName"/>
        <el-table-column label="所属客户" prop="customerName">
          <CustomerDetailsDialog slot-scope="scope" :customer-id="scope.row.customerId">
            <span>{{scope.row.customerName}}</span>
          </CustomerDetailsDialog>
        </el-table-column>
        <el-table-column label="税源地" prop="sourceTaxName">
          <TaxSourceDetailsDialog slot-scope="scope" :source-tax-id="scope.row.sourceTaxId">
          <span>{{scope.row.sourceTaxName}}</span>
          </TaxSourceDetailsDialog>
        </el-table-column>
        <el-table-column label="商品" prop="goodsName">
          <GoodsDetailsDialog slot-scope="scope" :goods-id="scope.row.goodsId">
            <span>{{scope.row.goodsName}}</span>
          </GoodsDetailsDialog>
        </el-table-column>
        <el-table-column label="开户日期" prop="showCreateTime" width="150"/>
        <el-table-column label="状态" prop="status">
          <span slot-scope="scope" :class="{'text-danger': scope.row.status === 'D', 'text-success': scope.row.status === 'N'}">{{statusText[scope.row.status]}}</span>
        </el-table-column>
        <!--<el-table-column label="操作" width="100" align="center" header-align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<router-link :to="`/company/create?companyId=${scope.row.companyId}`" target="_blank">编辑</router-link>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
    </el-card>
  </x-page>
</template>

<script>
import CompanyDetailsDialog from '../../components/CompanyDetailsDialog'
import GoodsDetailsDialog from '../../components/GoodsDetailsDialog'
import CustomerDetailsDialog from '../../components/CustomerDetailsDialog'
import TaxSourceDetailsDialog from '../../components/TaxSourceDetailsDialog'
export default {
  name: 'company_list',
  components: {GoodsDetailsDialog, CompanyDetailsDialog, CustomerDetailsDialog, TaxSourceDetailsDialog},
  data(){
    return {
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
    pageIndex(){
      this.loadCompanyList()
    },
    pageSize(){
      this.loadCompanyList()
    }
  },
  methods: {
    onSearchClick(){
      this.loadLogs()
    },
    async loadCompanyList(){
      this.loading = true
      try {
        const result = await this.$$main.companyList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchForm
        })
        console.log(result)
        this.totalCount = result.totalCount
        this.tableData = result.datas
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async loadSourceTaxList(){
      try {
        this.sourceTaxList = await this.$$main.commonListSourceTax()
      } catch (e) {
        console.log(e)
      }
    },
    async loadGoodsList(){
      try {
        this.goodsList = await this.$$main.commonListGoods()
      } catch (e) {
        console.log(e)
      }
    },
    onSortChange(){},
    clearQueryParams(){
      this.searchForm = {
        customerName: '',
        companyName: '',
        sourceTaxId: '',
        goodsId: ''
      }
      this.loadCompanyList()
    },
    queryAccountOrders(){
      this.loadCompanyList()
    },
    onPageShow(){
      this.loadCompanyList()
      this.loadSourceTaxList()
      this.loadGoodsList()
    }
  },
  mounted(){
  }
}
</script>

<style scoped>

</style>
