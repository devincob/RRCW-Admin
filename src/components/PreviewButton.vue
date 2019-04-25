<template>
  <el-button
    :type="type"
    :size="size"
    v-show="alwaysShow || isOffice"
    @click="onBtnClick"
  >
    <slot>{{text}}</slot>
    <el-dialog
      append-to-body
      :close-on-click-modal="true"
      :show-close="false"
      :visible="dialogDisplay"
      :before-close="handleClose"
      custom-class="preview_button_dialog"
      width="600px"
      top="10vh">
      <div class="preview-background">
        <img :src="displayImg" alt="" :style="{maxWidth: '580px',maxHeight: '580px', transform: `rotate(${current}deg)`}">
      </div>
      <div slot="footer" style="text-align: center">
        <el-button size="mini" type="text" @click="onPreviewClick">
          <img :src="require('../assets/images/preview.png')" style="width: 28px"/>
        </el-button>
        <el-button size="mini" type="text" @click="onClickRotate">
          <img :src="require('../assets/images/rotate.png')" style="width: 28px"/>
        </el-button>
      </div>
    </el-dialog>
  </el-button>
</template>
<script>
export default {
  name: 'preview-button',
  data() {
    return {
      dialogDisplay: false,
      displayImg: '',
      current: 0
    }
  },
  props: {
    text: {default: '预览原文件'},
    type: {default: ''},
    size: {default: ''},
    src: {default: ''},
    imgSize: {default: null},
    newWindowOpen: Boolean,
    showPreviewDialog: Boolean,
    alwaysShow: Boolean
  },
  computed: {
    isOffice(){
      let urlFormat = this.src.split('.')
      return ['doc', 'docx', 'xls', 'xlsx'].indexOf(urlFormat[urlFormat.length - 1]) !== -1
    }
  },
  methods: {
    onBtnClick(){
      this.showPreviewDialog ? this.showDialog() : this.onPreviewClick()
    },
    onPreviewClick(dialogPreview){
      let displaySrc = this.src
      if (this.newWindowOpen || dialogPreview) {
        if (displaySrc && displaySrc.substr(0, 4) !== 'http' && displaySrc[0] === '/') {
          window.open(this.getUploadImageUrl(displaySrc, null))
        } else {
          window.open(displaySrc)
        }
        return
      }
      if (displaySrc && displaySrc.substr(0, 4) !== 'http' && displaySrc[0] === '/') {
        if (this.isOffice){
          window.open(`http://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(this.getUploadImageUrl(displaySrc, null))}`)
          return
        }
        window.open(this.getUploadImageUrl(displaySrc, this.imgSize))
      } else {
        if (this.isOffice){
          window.open(`http://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(displaySrc)}`)
          return
        }
        window.open(displaySrc)
      }
    },
    showDialog(){
      let urlFormat = this.src.split('.')
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'].indexOf(urlFormat[urlFormat.length - 1]) !== -1){
        this.onPreviewClick(true)
        return
      }
      this.current = 0
      this.displayImg = this.getUploadImageUrl(this.src, 'large')
      this.dialogDisplay = true
    },
    handleClose(){
      this.dialogDisplay = false
    },
    onClickRotate(){
      this.current = (this.current + 90) % 360
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss">
  .preview_button_dialog{
    .el-dialog__header{
      display: none;
    }
    .el-dialog__footer{
      padding: 10px;
    }
    .preview-background{
      width: 580px;
      height: 580px;
      display: -webkit-box;
      -webkit-box-pack: center;
      -webkit-box-align: center;
      background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),
      linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
      background-color: #eee;
      background-size: 30px 30px;
      background-position: 0 0,15px 15px;
    }
  }
</style>
