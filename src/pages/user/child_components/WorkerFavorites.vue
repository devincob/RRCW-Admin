<template>
  <div>
    <el-form size="mini" inline @submit.native.prevent style="display: flex;justify-content: space-between;">
      <div>
        <el-form-item label="企业名称：">
          <el-input v-model="searchFormInfo.companyUserName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadFavorites">筛选</el-button>
          <el-button type="danger" @click="()=>{searchFormInfo.companyUserName = '';loadFavorites()}">重置</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <!--<el-button type="primary" @click="addFavorites" plain>收藏兼职</el-button>-->
      </el-form-item>
    </el-form>
    <div></div>
    <el-table :data="favorites" border
              highlight-current-row
              v-loading="loading"
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.8)"
              size="mini"
              style="width: 100%;">
      <el-table-column label="企业编号" prop="workerUserId" width="100">
        <a slot-scope="scope" :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">{{scope.row.companyUserId}}</a>
      </el-table-column>
      <el-table-column label="企业名称" prop="companyUserName">
        <a slot-scope="scope" :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">{{scope.row.companyUserName}}</a>
      </el-table-column>
      <el-table-column label="简称" prop="shortName" width="50"/>
      <el-table-column label="企业类型" prop="userTypeText" width="80"/>
      <el-table-column label="账号状态" prop="statusText" width="80"/>
      <el-table-column label="收藏时间" prop="likeTime"/>
      <el-table-column label="有效期" prop="likeExpireTime"/>
      <el-table-column label="收藏人" prop="likeUserName"/>
      <!--<el-table-column label="操作" prop="xx" fixed="right" width="140">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button @click="removeFavorites(scope.row)" type="text" size="mini">移除收藏夹</el-button>-->
          <!--<el-button @click="delayFavorites(scope.row)" type="text" size="mini">延期</el-button>-->
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
    <!--<el-dialog-->
      <!--title="收藏兼职"-->
      <!--v-drag-dialog-->
      <!--:visible.sync="dialogVisible"-->
      <!--:close-on-click-modal="false"-->
      <!--:close-on-press-escape="false"-->
      <!--width="600px">-->
      <!--<el-form-->
        <!--label-width="120px"-->
        <!--size="mini">-->
        <!--<el-form-item label="兼职手机：">-->
          <!--<el-input v-model="userMobileInput" @change="queryUserDetail" placeholder="请输入兼职者手机号码" style="width: 200px"/>-->
          <!--<div v-if="userInfoDeitals">-->
            <!--{{userInfoDeitals.userName}},-->
            <!--{{userInfoDeitals.mobilePhone}},-->
            <!--{{sexText[userInfoDeitals.sex]}},-->
            <!--{{userStatusText[userInfoDeitals.userStatus]}},-->
            <!--{{orderStatusText[userInfoDeitals.orderStatus]}}-->
          <!--</div>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="有效期(天)：">-->
          <!--<el-input-number v-model.number="dialogForm.days" placeholder="请输入有效天数" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="text-right">-->
          <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="saveFavorites">保 存</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
export default {
  name: 'WorkerFavorites',
  props: {
    userId: [String, Number]
  },
  data(){
    return {
      configForm: {
        isOpen: false,
        likeCountLimit: 100,
        likeServicesLimit: ''
      },
      searchFormInfo: {
        companyUserName: '',
        pageSize: 10,
        pageIndex: 1
      },
      dialogForm: {
        workerUserId: '',
        days: 90
      },
      userMobileInput: '',
      userInfoDeitals: null,
      dialogVisible: false,
      saveConfigLoading: false,
      favorites: [],
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
        this.loadFavorites()
      } else {
        this.pageIndex = 1
      }
    },
    'searchFormInfo.pageIndex'(){
      this.loadFavorites()
    }
  },
  methods: {
    // addFavorites(){
    //   this.dialogForm = {
    //     workerUserId: '',
    //     days: 0
    //   }
    //   this.userMobileInput = ''
    //   this.userInfoDeitals = null
    //   this.dialogVisible = true
    // },
    // async saveFavorites(){
    //   try {
    //     if (!this.dialogForm.workerUserId) {
    //       this.$message.error('该用户未找到，请输入正确的手机号！')
    //       return
    //     }
    //     if (!this.dialogForm.days) {
    //       this.$message.error('请输入有效天数！')
    //       return
    //     }
    //     await this.$$main.userLikeCreate({
    //       // 企业编号
    //       'companyUserId': this.userId,
    //       ...this.dialogForm
    //     })
    //     this.$message.success('已添加收藏')
    //     this.dialogVisible = false
    //     this.loadFavorites()
    //   } catch (e) {
    //     e && e.message && this.$message.error(e.message)
    //   }
    // },
    async loadFavorites(){
      try {
        this.loading = true
        const res = await this.$$main.userLikeListW({
          workerUserId: this.userId,
          ...this.searchFormInfo,
          companyUserName: String(this.searchFormInfo.companyUserName).trim()
        })
        this.favorites = res.datas
        this.totalCount = res.totalCount
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
    // async queryUserDetail(mobile){
    //   try {
    //     const res = await this.$$main.userCInfoDetails({loginName: mobile})
    //     if (res) {
    //       this.userInfoDeitals = res
    //       this.dialogForm.workerUserId = res.workerUserId
    //     }
    //   } catch (e) {
    //     e && e.message && this.$message.error(e.message)
    //   }
    // },
    // async removeFavorites(favorite){
    //   let loader
    //   try {
    //     const res = await this.$confirm(`确定要从收藏列表中移除 ${favorite.userName} ${favorite.mobilePhone} 吗?`, '移除收藏')
    //     if (res === 'confirm') {
    //       loader = this.$loading()
    //       await this.$$main.userLikeDelete({
    //         likeId: favorite.likeId
    //       })
    //       this.$message.success('已从收藏列表中移除')
    //       this.loadFavorites()
    //     }
    //   } catch (e) {
    //     e && e.message && this.$message.error(e.message)
    //   } finally {
    //     loader && loader.close()
    //   }
    // },
    // async delayFavorites(favorite){
    //   let loader
    //   try {
    //     const res = await this.$confirm(`确定为该用户延期七天吗?`)
    //     if (res === 'confirm') {
    //       loader = this.$loading()
    //       await this.$$main.userLikeDelay({
    //         likeId: favorite.likeId,
    //         days: 7
    //       })
    //       this.$message.success('延期成功！')
    //       this.loadFavorites()
    //     }
    //   } catch (e) {
    //     e && e.message && this.$message.error(e.message)
    //   } finally {
    //     loader && loader.close()
    //   }
    // }
  },
  mounted(){
    setTimeout(() => {
      this.loadFavorites()
    }, 300)
  }
}
</script>

<style scoped>

</style>
