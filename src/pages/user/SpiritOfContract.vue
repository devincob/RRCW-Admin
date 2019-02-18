<template>
  <el-card class="no-border-radius no-box-shadow">
    <div slot="header">
      <div class="table-header-title">
        <div>契约精神分数明细 (当前契约分数：{{accountInfo ? accountInfo.Point : 0}}分)</div>
        <el-button type="primary" size="mini" @click="$emit('btn-click', accountInfo.Point)">调整契约分数</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      ref="table"
      highlight-current-row
      :border="true"
      size="mini">
      <x-empty v-if="loading" no-icon no-title text="正在获取数据" slot="empty"/>

      <el-table-column label="编号" prop="historyId" width="60"/>
      <el-table-column label="获取积分" prop="changePoint" width="80">
        <span slot-scope="scope" :class="{'text-success':scope.row.changePoint < 0, 'text-danger':scope.row.changePoint > 0}">{{scope.row.changePoint}}</span>
      </el-table-column>
      <el-table-column label="当前积分" prop="point" width="160"/>
      <el-table-column label="获取原因" prop="changeReason"/>
      <el-table-column label="类型" prop="changeTypeText" />
      <el-table-column label="操作人" prop="changeAminUser"/>
      <el-table-column label="获取时间" prop="changeTime" width="130"/>
    </el-table>
    <div class="text-right clearfix" style="padding: 0 5px 5px">
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
</template>

<script>
export default {
  name: 'SpiritOfContract',
  props: {
    userId: {
      type: [Number, String],
      default: 0
    }
  },
  data(){
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      accountInfo: {}
    }
  },
  watch: {
    pageIndex(){
      this.loadListContract()
    },
    pageSize(){
      this.loadListContract()
    },
    userId(){
      this.loadListContract()
    }
  },
  methods: {
    async loadListContract(){
      if (!this.userId) return
      try {
        this.loading = true
        const res = await this.$$main.userQueryListContract({
          // 用户编号
          workerUserId: this.userId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        this.totalCount = res.totalCount
        this.tableData = res.datas
        if (res.funcResult && res.funcResult.length) {
          const info = {}
          res.funcResult.forEach(item => {
            info[item.key] = item.value
          })
          this.accountInfo = info
        }
        console.log(this.accountInfo)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  mounted(){
    console.log(this.userId)
    this.loadListContract()
  }
}
</script>

<style scoped>
  .table-header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
