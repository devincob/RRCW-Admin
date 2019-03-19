<template>
  <x-page breadcrumb="auto" title="C端用户详情">
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane name="info" label="账号信息">
        <user-info :worker-user-id="workerUserId"/>
      </el-tab-pane>
      <el-tab-pane name="account-flow" label="账户流水">
        <list-trade :user-id="workerUserId" style="border-bottom-width: 1px;"/>
      </el-tab-pane>
      <el-tab-pane name="contract" label="契约精神">
        <spirit-of-contract :user-id="workerUserId" style="border-bottom-width: 1px;"/>
      </el-tab-pane>
      <el-tab-pane name="order" label="订单信息">
        <user-orders :user-id="workerUserId"/>
      </el-tab-pane>
      <el-tab-pane name="favorites" label="收藏夹">
        <worker-favorites :user-id="workerUserId"/>
      </el-tab-pane>
      <el-tab-pane name="blacklist" label="黑名单">
        <worker-blacklist :user-id="workerUserId"/>
      </el-tab-pane>
      <!--<el-tab-pane name="capability-analysis" label="能力分析">能力分析</el-tab-pane>-->
      <!--<el-tab-pane name="data-statistics" label="数据统计">数据统计</el-tab-pane>-->
    </el-tabs>
  </x-page>
</template>

<script>
import UserInfo from './child_components/UserInfo'
import ListTrade from './ListTrade'
import SpiritOfContract from './SpiritOfContract'
import UserOrders from './child_components/UserOrders'
import WorkerFavorites from './child_components/WorkerFavorites'
import WorkerBlacklist from './child_components/WorkerBlacklist'
export default {
  name: 'worker-user-detail',
  components: {
    WorkerBlacklist,
    WorkerFavorites,
    UserOrders,
    SpiritOfContract,
    ListTrade,
    UserInfo
  },
  data() {
    return {
      activeTabName: 'info',
      workerUserId: 0,
      spiritOfContract: 0,
      spiritOfContractRemark: '',
      changeSpiritOfContractDialog: false
    }
  },
  watch: {
    activeTabName(tabName) {
      location.hash = tabName
    }
  },
  methods: {
    onPageShow(){
      this.workerUserId = Number(this.$route.query.uid || 0)
      if (!this.workerUserId) {
        this.$message.error('错误的参数！')
      }
    }
  },
  mounted() {
    if (this.$route.hash && this.$route.hash.length > 2) {
      this.activeTabName = this.$route.hash.split('#')[1]
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload-list .el-upload-list__item {
    width: auto;
    min-width: 300px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 16px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .avatar {
    /*width: 178px;*/
    /*height: 178px;*/
    max-width: 100%;
    max-height: 100%;
    display: block;
  }

  .id-card-upload .el-form-item__content {
    display: flex;
  }

  .upload-limit-max .el-upload.el-upload--picture-card {
    display: none;
  }

  .el-form-upload .el-form-item__content {
    margin-left: 0 !important;
  }

  .certificate {
    max-width: 178px;
    max-height: 60px;
  }
</style>
