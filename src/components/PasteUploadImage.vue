<template>
  <div>
    <span @click="openDialog"><slot></slot></span>
    <el-dialog
      v-drag-dialog
      :close-on-click-modal="false"
      title="上传图片"
      :visible.sync="dialogVisible"
      append-to-body
      width="500px">
      <span style="color: #aaa;font-size: 12px;"><i class="el-icon-info"></i> 可以使用快捷Ctrl+V粘贴图片上传或右键点击下面的文本框，选择粘贴。</span>
      <el-form size="small" ref="dialogForm" style="width: 100%">
        <el-form-item>
          <el-input type="text" @paste.native.prevent="onPaste" placeholder="请点击此处粘贴图片">
            <el-upload
              slot="append"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :http-request="file => uploadFile(file.file)"
              class="upload-demo">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="preview-image" title="点击图片查看大图">
            <x-image @click="previewImage" v-if="imageUrl" :src="imageUrl"/>
            <div v-else>图片预览</div>
          </div>
        </el-form-item>
        <el-form-item class="text-right">
          <el-button type="primary" @click="onDone" :disabled="!imageUrl">完成</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 使用: <paste-upload-image @success="url => alert(url)"><a href="javascript:;">粘贴上传</a></paste-upload-image>
export default {
  name: 'PasteUploadImage',
  data(){
    return {
      dialogVisible: false,
      imageUrl: null
    }
  },
  methods: {
    openDialog(){
      this.imageUrl = null
      this.dialogVisible = true
    },
    onPaste(event){
      if (event.clipboardData || event.originalEvent) {
        const clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
        if (clipboardData.items) {
          let blob
          for (let i = 0; i < clipboardData.items.length; i++) {
            if (clipboardData.items[i].type.indexOf('image') !== -1) {
              blob = clipboardData.items[i].getAsFile()
            }
          }
          if (blob) this.uploadFile(blob)
        }
      }
    },
    uploadFile(blob){
      const render = new FileReader()
      render.onload = (evt) => {
        // 输出base64编码
        // document.getElementById('img').setAttribute('src', evt.target.result)
        this.uploadImgFromPaste(evt.target.result, 'paste')
      }
      render.readAsDataURL(blob)
    },
    uploadImgFromPaste(file, type = 'file') {
      const that = this
      const formData = new FormData()
      formData.append('image', file)
      formData.append('submission-type', type)

      const xhr = new XMLHttpRequest()
      const loader = this.$loading({
        target: this.$refs.dialogForm.$el
      })
      xhr.open('POST', this.$$main.getUrl('/Common/ImageUpload'))
      xhr.onload = function () {
        loader.close()
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const res = JSON.parse(xhr.responseText)
              if (res.isSuccess) {
                that.imageUrl = res.body.imageUrl
              } else {
                res.message && that.$message.error(res.message)
              }
            } catch (e) {
              console.log(e)
            }
          } else {
            console.log(xhr.statusText)
          }
        }
      }
      xhr.onerror = function (e) {
        console.log(xhr.statusText)
      }
      xhr.send(formData)
    },
    previewImage(){
      open(this.getUploadImageUrl(this.imageUrl, null), '_blank')
    },
    onDone(){
      this.dialogVisible = false
      this.$emit('success', this.imageUrl)
    }
  },
  mounted() {
    document.addEventListener('paste', this._paste = e => {
      this.onPaste(e)
    })
  },
  beforeDestroy() {
    if (this._paste) document.removeEventListener('paste', this._paste)
  }
}
</script>

<style scoped>
  .preview-image {
    width: 100%;
    height: 300px;
    background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),
    linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
    background-color: #eee;
    background-size: 30px 30px;
    background-position: 0 0,15px 15px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: 1px #9E9E9E solid;
  }
  .preview-image img {
    max-height: 100%;
    max-width: 100%;
    cursor: zoom-in;
  }
</style>
