<template>
  <div>
    <el-form size="mini" inline @submit.native.prevent style="display: flex;justify-content: space-between;">
      <div>
        <el-form-item label="企业名称：">
          <el-input v-model="searchFormInfo.companyUserName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadBlackList">筛选</el-button>
          <el-button type="danger" @click="()=>{searchFormInfo.companyUserName = '';loadBlackList()}">重置</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <!--<el-button type="primary" @click="addBlackList" plain>设置黑名单</el-button>-->
      </el-form-item>
    </el-form>
    <div></div>
    <el-table :data="blacklist" border
              highlight-current-row
              v-loading="loading"
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.8)"
              size="mini"
              style="width: 100%;">
      <el-table-column label="企业编号" prop="companyUserId" width="100">
        <a slot-scope="scope" :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">{{scope.row.companyUserId}}</a>
      </el-table-column>
      <el-table-column label="企业名称" prop="companyUserName">
        <a slot-scope="scope" :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">{{scope.row.companyUserName}}</a>
      </el-table-column>
      <el-table-column label="简称" prop="shortName" width="50"/>
      <el-table-column label="企业类型" prop="userTypeText" width="80"/>
      <el-table-column label="账号状态" prop="statusText" width="80"/>
      <el-table-column label="原因" prop="loatheReason">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="拉黑原因"
            width="200"
            trigger="hover"
            :content="scope.row.loatheReason">
            <span slot="reference">{{scope.row.loatheReason}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="黑名单时间" prop="loatheTime"/>
      <el-table-column label="操作人" prop="loatheUserName"/>
      <!--<el-table-column label="操作" prop="xx" fixed="right" width="140">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button @click="removeBlackList(scope.row)" type="text" size="mini">移除黑名单</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <div class="text-right">
      <el-pagination
        class="mt-sm"
        :page-sizes="[10, 20, 40, 60, 80]"
        :page-size="searchFormInfo.pageSize"
        :current-page="searchFormInfo.pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="(size) => this.searchFormInfo.pageSize = size"
        @current-change="(index) => this.searchFormInfo.pageIndex = index">
      </el-pagination>
    </div>
    <el-dialog
      title="设置黑名单"
      v-drag-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px">
      <el-form
        size="mini">
        <el-form-item label="兼职手机：">
          <el-input v-model="userMobileInput" @change="queryUserDetail" placeholder="请输入兼职者手机号码"/>
          <div v-if="userInfoDeitals">
            {{userInfoDeitals.userName}},
            {{userInfoDeitals.mobilePhone}},
            {{sexText[userInfoDeitals.sex]}},
            {{userStatusText[userInfoDeitals.userStatus]}},
            {{orderStatusText[userInfoDeitals.orderStatus]}}
          </div>
        </el-form-item>
        <el-form-item label="原因：">
          <el-input type="textarea" placeholder="请输入拉黑原因" v-model="dialogForm.loatheReason"/>
        </el-form-item>
        <el-form-item class="text-right">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBlacklist">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WorkerBlacklist',
  props: {
    userId: [String, Number]
  },
  data(){
    return {
      searchFormInfo: {
        companyUserName: '',
        pageSize: 10,
        pageIndex: 1
      },
      dialogForm: {
        workerUserId: '',
        loatheReason: ''
      },
      userMobileInput: '',
      userInfoDeitals: null,
      dialogVisible: false,
      saveConfigLoading: false,
      blacklist: [],
      totalCount: 0,
      loading: false,
      sexText: {M: '男', F: '女'},
      userStatusText: {N: '正常接单', D: '封号', C: '注销'},
      orderStatusText: {N: '正常抢单', D: '禁止抢单'}
    }
  },
  watch: {
    'searchFormInfo.pageSize'(){
      if (this.pageIndex === 1) {
        this.loadBlackList()
      } else {
        this.pageIndex = 1
      }
    },
    'searchFormInfo.pageIndex'(){
      this.loadBlackList()
    }
  },
  methods: {
    addBlackList(){
      this.dialogForm = {
        workerUserId: '',
        loatheReason: ''
      }
      this.userMobileInput = ''
      this.userInfoDeitals = null
      this.dialogVisible = true
    },
    async saveBlacklist(){
      try {
        if (!this.dialogForm.workerUserId) {
          this.$message.error('该用户未找到，请输入正确的手机号！')
          return
        }
        if (!this.dialogForm.loatheReason) {
          this.$message.error('请输入拉黑原因！')
          return
        }
        await this.$$main.userLoatheCreate({
          // 企业编号
          'companyUserId': this.userId,
          ...this.dialogForm
        })
        this.$message.success('已添加至黑名单')
        this.dialogVisible = false
        this.loadBlackList()
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async queryUserDetail(mobile){
      try {
        const res = await this.$$main.userCInfoDetails({loginName: mobile})
        if (res) {
          this.userInfoDeitals = res
          this.dialogForm.workerUserId = res.workerUserId
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async loadBlackList(){
      try {
        this.loading = true
        const res = await this.$$main.userLoatheListW({
          workerUserId: this.userId,
          ...this.searchFormInfo,
          companyUserName: String(this.searchFormInfo.companyUserName).trim()
        })
        this.blacklist = res.datas
        this.totalCount = res.totalCount
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async removeBlackList(row){
      let loader
      try {
        const res = await this.$confirm(`确定要从黑名单列表中移除 ${row.userName} ${row.mobilePhone} 吗?`, '移除黑名单')
        if (res === 'confirm') {
          loader = this.$loading()
          await this.$$main.userLoatheDelete({
            loatheId: row.loatheId
          })
          this.$message.success('已从黑名单列表中移除')
          this.loadBlackList()
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        loader && loader.close()
      }
    }
  },
  mounted(){
    setTimeout(() => {
      this.loadBlackList()
    }, 300)
  }
}
</script>

<style scoped>

</style>
