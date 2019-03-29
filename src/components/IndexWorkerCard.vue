<template>
  <el-card class="el-card-mini" shadow="hover">
    <div class="chartCard___UIZrG">
      <div class="chartTop___12THo">
        <div class="avatar___3-D5e"></div>
        <div class="metaWrap___2qUnZ">
          <div class="meta___39rjj"><span>{{showTitle}}</span><span class="action___1zsmB"><i
            class="anticon anticon-info-circle-o"></i></span></div>
          <div class="total___2GhVz text-right">{{showCount}}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'index-worker-card',
  props: {
    title: String,
    count: [Number, String]
  },
  computed: {
    showTitle(){
      return this.title
    },
    showCount(){
      return this.count
    }
  }
}
</script>

<style scoped>

  .chartCard___UIZrG {
    position: relative
  }

  .chartCard___UIZrG .chartTop___12THo {
    position: relative;
    overflow: hidden;
    width: 100%
  }

  .chartCard___UIZrG .chartTopMargin___1CrSt {
    margin-bottom: 12px
  }

  .chartCard___UIZrG .chartTopHasMargin___11yq_ {
    margin-bottom: 20px
  }

  .chartCard___UIZrG .metaWrap___2qUnZ {
    float: left;
    width: 100%;
  }

  .chartCard___UIZrG .avatar___3-D5e {
    position: relative;
    top: 4px;
    float: left;
    margin-right: 20px
  }

  .chartCard___UIZrG .avatar___3-D5e img {
    border-radius: 100%
  }

  .chartCard___UIZrG .meta___39rjj {
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    line-height: 22px;
    height: 22px
  }

  .chartCard___UIZrG .action___1zsmB {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0
  }

  .chartCard___UIZrG .total___2GhVz {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: rgba(0, 0, 0, .85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
    font-family: 'BTC-NUM';
  }

  .chartCard___UIZrG .content___2bOfA {
    margin-bottom: 12px;
    position: relative;
    width: 100%
  }

  .chartCard___UIZrG .contentFixed___nL801 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%
  }

  .chartCard___UIZrG .footer___2qHVO {
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px
  }

  .chartCard___UIZrG .footer___2qHVO > * {
    position: relative
  }

  .chartCard___UIZrG .footerMargin___2-daU {
    margin-top: 20px
  }
</style>
