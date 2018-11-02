<template>
  <x-page breadcrumb="auto" title="开票订单业绩">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="订单完成时间">
          <el-date-picker
            popper-class="orders-date-picker"
            style="width: 220px"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            v-model="form.time">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        v-loading="loading"
        @sort-change="onSortChange"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;">
        <el-table-column fixed prop="deptName" label="部门名称" min-width="120"/>
        <el-table-column prop="deptUserName" label="部门负责人" min-width="120"/>
        <el-table-column sortable="custom" prop="sumInvoiceAmount" label="开票金额" min-width="140" :formatter="(row) => `${$options.filters['currency'](row.sumInvoiceAmount, '', 2)}`"/>
        <el-table-column sortable="custom" prop="sumServiceAmount" label="服务费金额" min-width="140" :formatter="(row) => `${$options.filters['currency'](row.sumServiceAmount, '', 2)}`"/>
        <el-table-column sortable="custom" prop="companyCount" label="开票站点数" min-width="120"/>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          :current-page="form.pageIndex"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
  </x-page>
</template>

<script>
const now = new Date()
const pre3month = new Date()
pre3month.setMonth(pre3month.getMonth() - 3)
export default {
  name: 'd-invoice',
  data() {
    return {
      loading: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        time: [],
        beginTime: '',
        endTime: ''
      },
      sorts: {
        sortType: '',
        sortName: ''
      },
      totalCount: 0,
      list: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            picker.$emit('pick', [pre3month, now])
          }
        }]
      }
    }
  },
  watch: {
    'form.pageIndex': {
      handler: function () {
        this.queryList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryList()
      },
      deep: true
    },
    'form.time': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.beginTime = this.$utils.dateFormat(val[0], 'yyyy-MM-dd')
          this.form.endTime = this.$utils.dateFormat(val[1], 'yyyy-MM-dd')
          this.$nextTick(() => {
            this.queryList()
          })
        } else {
          this.form.time = [pre3month, now]
        }
      },
      deep: true
    }
  },
  methods: {
    onPageShow(){
      this.form.time = [pre3month, now]
      this.$nextTick(() => {
        this.queryList()
      })
    },
    onSortChange(sort){
      if (sort && sort.column) {
        this.sorts = {
          sortName: sort.prop,
          sortType: sort.order === 'descending' ? 'D' : 'A'
        }
      }
      this.queryList()
    },
    async queryList(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        let form = this.sorts.sortName ? {
          ...this.form,
          sorts: this.sorts
        } : this.form
        const data = await this.$$main.statisticsDeptIO(form)
        this.totalCount = data.totalCount
        this.list = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
      this.sorts = {
        sortType: '',
        sortName: ''
      }
      this.form = {
        pageIndex: 1,
        pageSize: 20,
        time: [],
        beginTime: '',
        endTime: ''
      }
    }
  },
  mounted() {}
}
</script>
