<template>
  <x-page :breadcrumb="breadcrumb" title="渠道列表">
    <el-card class="el-card-mini no-box-shadow" style="min-width:800px;min-height:1000px">
      <el-form :model="searchForm" :inline="true" size="mini" label-width="100px" label-position="left" class="demo-form-inline">
        <el-form-item label="渠道商名称：">
          <el-input v-model="searchForm.channelName" placeholder="请输入渠道商名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="渠道联系人：">
          <el-input v-model="searchForm.channelContact" placeholder="请输入渠道联系人" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearchClick" type="primary">查询</el-button>
          <el-button type="danger" @click="clearQueryParams">清空</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="channelList"
                v-loading="loading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                :border="true"
                :highlight-current-row="true"
                @sort-change="onSortChange"
                size="mini">
        <el-table-column label="渠道商编号" align="center" prop="channelId" width="100" fixed />
        <el-table-column label="渠道商名称" prop="channelName" align="center"/>
        <el-table-column label="渠道联系人" prop="channelContact" align="center"/>
        <el-table-column label="渠道联系电话" prop="channelPhone" align="center"/>
        <el-table-column label="渠道分成比例" prop="channelRatio" align="center"/>
        <!--<el-table-column label="商务姓名" prop="othersName" align="center" />-->
        <el-table-column label="渠道状态" prop="channelStatus" align="center">
          <span slot-scope="scope" :class="{
                'text-success':scope.row.channelStatus === 'N',
                'text-danger':scope.row.channelStatus === 'D'
                }">
            {{statusText[scope.row.channelStatus]}}
          </span>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="no-padding" @click="onDisabledClick(scope.row)"
                       v-html="scope.row.channelStatus === 'D' ? '正常' : '禁用'">
            </el-button>
            <router-link :to="`/channelManagement/addChannel?channel_id=${scope.row.channelId}`" target="_blank">编辑</router-link>
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
  name: 'channel_list',
  data(){
    return {
      loading: false,
      channelList: [],
      roles: [],
      totalCount: 0,
      searchForm: {
        channelName: '',
        channelContact: ''
      },
      pageSize: 15,
      pageIndex: 1,
      sorts: {
        sortType: 'D',
        sortName: 'createTime'
      },
      statusText: {N: '正常', D: '禁用'},
      sourceText: {C: '渠道', D: '直属'}
    }
  },
  watch: {
    pageIndex(){
      this.loadList()
    },
    pageSize(){
      this.loadList()
    }
  },
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '渠道管理', id: 0},
        {path: '', title: '渠道列表', id: 1}
      ]
    }
  },
  methods: {
    onSearchClick(){ // 点击查询
      this.loadList()
    },
    clearQueryParams(){ // 清空查询
      this.searchForm = {
        channelName: '',
        channelContact: ''
      }
      this.loadList()
    },
    async onDisabledClick(row){ // 操作禁用启用
      try {
        const sourceStatus = await this.$$main.channelUpdate({
          channelId: row.channelId,
          channelStatus: row.channelStatus === 'N' ? 'D' : 'N'
        })
        sourceStatus && this.loadList()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
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
          sortName: 'createTime'
        }
      }
      this.loadList()
    },
    async loadList(){ // 初始列表
      this.loading = true
      try {
        const channelList = await this.$$main.channelList({ // customerList
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          channelName: this.searchForm.channelName, //  渠道名称
          channelContact: this.searchForm.channelContact, //  渠道联系人
          sorts: this.sorts
        })
        this.totalCount = channelList.totalCount
        this.channelList = channelList.datas
        // console.log('list', this.channelList)
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageShow(){
      this.loadList()
    }
  },
  mounted(){
    // console.log(this.$refs)
  }
}
</script>

<style scoped>

</style>
