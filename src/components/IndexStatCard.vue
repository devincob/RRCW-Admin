<template>
  <el-card class="el-card-mini no-border-radius no-box-shadow">
    <div class="chartCard___UIZrG">
      <div class="chartTop___12THo">
        <div class="avatar___3-D5e"></div>
        <div class="metaWrap___2qUnZ">
          <div class="meta___39rjj"><span class="text-bold" style="color: #303133">{{title}}</span> <el-popover
            width="200"
            trigger="hover"
            :content="popover">
            <i class="el-icon-question" style="font-size: 16px;cursor: pointer;color: #303133" slot="reference"></i>
          </el-popover></div>
          <div class="total___2GhVz">{{valueCount}}</div>
        </div>
      </div>
      <div class="content___2bOfA" style="height: 46px;">
        <div class="contentFixed___nL801">
          <div class="trendItem___2r2dT" title="" style="margin-right: 16px;"><span><span
            class="trendText___HsrVC"></span></span><span class="up___2EwY8"><i
            class="anticon anticon-caret-up"></i></span></div>
          <div class="trendItem___2r2dT" title=""><span><span class="trendText___HsrVC"></span></span><span
            class="down___35xDq"><i class="anticon anticon-caret-down"></i></span></div>
        </div>
      </div>
      <!--<div class="footer___2qHVO">-->
      <!--<div class="field___9S4u4"><span></span><span></span></div>-->
      <!--</div>-->
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'IndexStatCard',
  props: {
    title: String,
    popover: String,
    valueCount: {
      type: [Number, String],
      default: 1
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
    float: left
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
    height: 38px
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
