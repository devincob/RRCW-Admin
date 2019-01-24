<template>
  <el-button
    :type="type"
    :size="size"
    v-show="alwaysShow || isOffice"
    @click="onBtnClick"
  >
    <slot>{{text}}</slot>
  </el-button>
</template>
<script>
export default {
  name: 'preview-button',
  data() {
    return {
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
      let displaySrc = this.getUploadImageUrl(this.src, 'middle')
      const h = this.$createElement
      this.$msgbox({
        showConfirmButton: false,
        message: h('div', null, [
          h('el-button', {
            attrs: {
              type: 'text'
            },
            on: {
              click: () => {
                this.onPreviewClick()
              }
            }
          }, '查看原文件'),
          h('img', {
            attrs: {
              src: displaySrc
            },
            style: {
              width: '100%'
            }
          })
        ])
      })
    }
  },
  mounted() {

  }
}
</script>
