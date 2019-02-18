<template>
    <x-page breadcrumb="auto" title="推广商等级管理">
      <el-card class="box-card">
        <el-table
          :data="list"
          v-loading="loading"
          element-loading-text="拼命加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          size="small"
          style="width: 100%;">
          <el-table-column fixed prop="orderNo" label="等级名称" min-width="150">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.promoterLevelName" />
            </template>
          </el-table-column>
          <el-table-column prop="jobTagName" label="等级经验值" min-width="150">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.promoterLevelExp" />
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="每单分成" min-width="150">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.promoterDivideRatio" />
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button size="mini">-</el-button>
              <el-button size="mini" @click="saveLevelItem(scope.row)">+</el-button>
              <el-button size="mini" @click="saveLevelItem(scope.row)">保存</el-button>
            </template>
          </el-table-column>
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
export default {
  name: 'level',
  data() {
    return {
      loading: false,
      totalCount: 0,
      form: {
        pageIndex: 1,
        pageSize: 20
      },
      list: [],
      item: {
        promoterLevelId: '', // 编号
        promoterLevelName: '', // 名称
        promoterDivideRatio: '', // 分成
        promoterLevelExp: '' // 所需经验
      }
    }
  },
  methods: {
    async queryLevelList(){
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.promoterQueryListLevel(this.form)
        // this.totalCount = data.totalCount
        this.list = [...data, Object.assign({}, this.item)]
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async saveLevelItem(item){
      const loading = this.$loading({
        text: '正在保存',
        target: '.create-promoter-dialog'
      })
      try {
        await this.$$main.promoterDoSave(item)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryLevelList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted() {
    this.queryLevelList()
  }
}
</script>
