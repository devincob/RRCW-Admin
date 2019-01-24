<template>
  <img :src="imgSrc"
       :data-src="displayDataSrc"
       @error="onError"
       @click="(e)=>$emit('click', e)"
       @load="(e)=>$emit('load', e)"/>
</template>
<script>
export default {
  name: 'x-image',
  props: {
    src: String,
    dataSrc: String,
    placeholder: String,
    size: {
      type: [String],
      'default': 'small'
    }
  },
  data() {
    return {
      img: this.src || this.dataSrc,
      formats: {
        'pdf': require('../../assets/images/pdf-placeholder.png'),
        'doc': require('../../assets/images/word-placeholder.png'),
        'docx': require('../../assets/images/word-placeholder.png'),
        'zip': require('../../assets/images/zip-placeholder.png'),
        'rar': require('../../assets/images/zip-placeholder.png')
      }
    }
  },
  computed: {
    imgSrc() {
      return (this.src || this.dataSrc) ? this.realSrc((this.src || this.dataSrc)) : this.placeholder || this.$config.errorImage
    },
    displayDataSrc() {
      let src = (this.src || this.dataSrc)
      let displaySrc = this.getUploadImageUrl(src, '')
      if (src && src.substr(0, 4) !== 'http' && src[0] === '/') {
        let urlFormat = src.split('.')
        if (['pdf', 'doc', 'docx', 'zip', 'rar'].indexOf(urlFormat[urlFormat.length - 1]) !== -1){
          displaySrc = this.formats[urlFormat[urlFormat.length - 1]]
        }
      }
      return displaySrc || this.$config.errorImage
    }
  },
  methods: {
    onError(e) {
      e.target.src = this.placeholder || this.$config.errorImage
    },
    realSrc(src) {
      if (src && src.substr(0, 4) !== 'http' && src[0] === '/') {
        let urlFormat = src.split('.')
        return ['pdf', 'doc', 'docx', 'zip', 'rar'].indexOf(urlFormat[urlFormat.length - 1]) !== -1 ? this.formats[urlFormat[urlFormat.length - 1]] : this.getUploadImageUrl(src, this.size)
      }
      return src || this.$config.errorImage
    }
  },
  mounted() {
    // if(!this.img && this.dataSrc){
    //     this.$el.src = this.placeholder || this.$config.errorImage;
    //     let img = new Image();
    //     img.onload = ()=>{
    //         this.img = this.$el.src = img.src;
    //         img = null;
    //     };
    //     img.onerror = ()=>{
    //         this.$el.src = this.placeholder || this.$config.errorImage;
    //         img = null;
    //     };
    //     img.src = this.realSrc(this.dataSrc);
    // }
  }
}
</script>
