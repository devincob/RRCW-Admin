<template>
  <x-page breadcrumb="auto" title="商品列表">
    <el-card  class="el-card-mini no-box-shadow" style="min-width:800px;min-height:1000px">
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
        @sort-change="onSortChange"
        size="mini">
        <x-empty v-if="!loading" slot="empty"/>
        <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

        <el-table-column label="商品编号" prop="goodsId" align="center" width="80"/>
        <el-table-column label="名称" prop="goodsName"  min-width="120"/>
        <el-table-column label="纳税性质" prop="userType" min-width="120">
          <span slot-scope="scope">{{userTypeText[scope.row.taxType]}}</span>
        </el-table-column>
        <el-table-column align="right" label="开票服务费率" prop="invoiceServiceRatio" width="120"/>
        <el-table-column  align="right" label="开户服务费" prop="serviceCharge" width="120">
          <span slot-scope="scope">{{scope.row.serviceCharge | currency}}</span>
        </el-table-column>
        <el-table-column label="开户押金" align="right" prop="deposit" width="120">
          <span slot-scope="scope">{{scope.row.deposit | currency}}</span>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="60">
          <span slot-scope="scope" :class="{'text-danger': scope.row.status === 'D', 'text-success': scope.row.status === 'N'}">{{statusText[scope.row.status]}}</span>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="onChangeStatus(scope.row)">{{scope.row.status === 'N' ? '禁用' : '恢复'}}</el-button>
            <router-link :to="`/goods/create?goods_id=${scope.row.goodsId}`" target="_blank">编辑</router-link>
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
    </el-card>
  </x-page>
</template>

<script>
export default {
  name: 'goods_list',
  data(){
    return {
      value7: '',
      value: null,
      searchForm: {
        companyUserName: '',
        contactPhone: '',
        beginTime: '',
        endTime: '',
        userType: '',
        status: ''
      },
      searchFormRegisterTime: null,
      statusText: {A: '全部', N: '正常', D: '禁用'},
      userTypeText: {A: '全部', N: '一般纳税人', S: '小规模纳税人'},
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      sorts: {
        sortType: 'D',
        sortName: 'registerTime'
      }
    }
  },
  watch: {
    searchFormRegisterTime(date){
      this.searchForm.beginTime = date ? this.$utils.dateFormat(date[0]) : ''
      this.searchForm.endTime = date ? this.$utils.dateFormat(date[1]) : ''
    },
    pageIndex(){
      this.loadGoods()
    },
    pageSize(){
      this.loadGoods()
    }
  },
  methods: {
    async loadGoods(){
      try {
        this.loading = true
        const data = await this.$$main.goodsList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchForm,
          sorts: this.sorts
        })
        this.totalCount = data.totalCount
        this.tableData = data.datas
        this.loading = false
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async onChangeStatus(item){
      const loader = this.$loading({
        lock: true,
        text: '请稍等...'
      })
      try {
        let status
        if (item.status === 'N') {
          status = 'D'
        } else {
          status = 'N'
        }
        const res = await this.$$main.goodsUpdate({
          // 商品编号
          'goodsId': item.goodsId,
          // 状态(N/D)
          'status': status
        })
        console.log(res)
        item.status = status
      } catch (e) {
        console.log(e)
      } finally {
        loader.close()
      }
    },
    onSearchClick(){
      this.loadGoods()
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.column.sortBy,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      } else {
        this.sorts = {
          sortType: 'D',
          sortName: 'registerTime'
        }
      }
      this.loadGoods()
    },
    onPageShow(){
      this.loadGoods()
    }
  },
  mounted(){
  }
}
</script>

<style scoped>

</style>
