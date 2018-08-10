<template>
  <div class="c-picker">
    <el-dialog :title="title"
               :width="width"
               :custom-class="customClass"
               :show-close="showClose"
               @before-close="beforeClose || function(done) {
                 done()
               }"
               @close="$emit('update:visible', false)"
               @open="$emit('update:visible', true)"
               :visible="isShow">
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CPicker',
  props: ['visible', 'width', 'title', 'customClass', 'show-close', 'before-close'],
  watch: {
    visible(val){
      this.isShow = val
    }
  },
  data(){
    return {
      isShow: this.visible
    }
  }
}
</script>

<style>
  .c-picker .el-dialog__body {
    padding-top: 10px;
    background: #fff;
  }
  .c-picker .el-dialog__wrapper {
    /*overflow: hidden;*/
  }
  .c-picker .el-dialog{
    position: absolute;
    right: 0;
    top: 0;
    margin: 0 !important;
    height: 100%;
    border-radius: 0;
  }
</style>
