<template>
  <el-upload
    :class="['avatar-uploader', 'upload-target' + hash]"
    :action="$$main.getUrl('/Common/ImageUpload')"
    :show-file-list="false"
    :before-upload="() => {openLoading()}"
    :on-error="closeLoading"
    :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && $emit('success', res.body.imageUrl) }"
  >
    <slot></slot>
  </el-upload>
</template>

<script>
export default {
  name: 'upload-files',
  data(){
    return {
      uploadLoading: null,
      hash: parseInt(Math.random() * 9999999)
    }
  },
  methods: {
    openLoading() {
      this.uploadLoading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        target: '.upload-target' + this.hash
      })
    },
    closeLoading() {
      this.uploadLoading.close()
    }
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    i {
      font-size: 23px;
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
