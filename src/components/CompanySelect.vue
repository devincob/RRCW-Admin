<template>
  <div style="display: -webkit-box;">
    <div class="functional-select-wrapper">
      <label class="display-container multiple-select-container clearfix no-padding" v-bind:class="(showCompany)?'single-selected-focus':''" v-on:click.stop="multipleFocus()">
        <!--<span v-show="loading">数据加载中</span>
        <span v-show="!selectedCompanyItem && !loading">选择公司</span>
        <span>{{ selectedCompanyItem.companyName }}</span>
        <i class="drop" v-bind:class="showCompany ? 'drop-up': ''"><Icon type="arrow-down-b" style="color: #80848f;"></Icon></i>-->
        <slot name="search">
          <el-input type="text" @input="onSearchInput" v-model="selCompanyName" @blur="onInputBlur" placeholder="请输入登录名搜索"/>
        </slot>
      </label>
      <div class="options-container" v-if="showCompany && companyList && companyList.length > 0">
        <!--<div class="search-container">
            <input ref="searchInput" placeholder="搜索" class="search-input" v-model="searchCompany" v-on:keyup="multipleSearch($event)"/>
        </div>-->
        <ul class="options-ul-list">
          <li v-for="(item,index) in companyList" :key="index" v-on:click.stop.prevent="multipleSelect(item)" v-bind:class="item.companyUserId === selectedCompanyItem.companyUserId ? 'selected' : ''">{{ item.companyUserName }}</li>
        </ul>
      </div>
      <div v-if="showCompany && (!companyList || companyList.length < 1)" class="options-container">
        <ul class="options-ul-list">
          <li v-if="selCompanyName">未搜索到公司</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  name: 'company-select',
  data: function () {
    return {
      companyList: [],
      displayCompanyList: [],
      selectedCompanyItem: '',
      searchCompany: '',
      showCompany: false,
      loading: false,
      selCompanyName: '',
      timeoutId: null
    }
  },
  methods: {
    onInputBlur(){
      this.setTimeout(() => {
        this.blur()
      }, 200)
    },
    onSearchInput(text){
      if (text) {
        this.selCompanyName = text
      }
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        if (this.selCompanyName && this.selCompanyName !== ''){
          this.queryCompanyList()
        } else {
          this.companyList = []
        }
      }, 500)
    },
    queryCompanyList(){
      this.loading = true
      this.$$main.userBList({
        companyUserName: this.selCompanyName
      }).then((res) => {
        if (res && res.datas.length > 0) {
          this.showCompany = true
        }
        this.companyList = res.datas
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    multipleFocus () {
      if (!this.showCompany) {
        this.showCompany = true
      } else {
        this.blur()
      }
    },
    multipleSelect (name) {
      let tmpName = name
      let companyList = this.companyList
      this.selectedCompanyItem = name
      for (let i = 0; i < companyList.length; i++) {
        let item = companyList[i]
        if (tmpName === item) {
          this.multipleInitSearch()
        }
      }
      this.selCompanyName = this.selectedCompanyItem.companyUserName
      this.$emit('input', this.selectedCompanyItem.companyUserName)
      this.$emit('onCompanySelected', this.selectedCompanyItem)
      this.blur()
    },
    multipleInitSearch () {
      this.searchCompany = ''
    },
    blur () {
      this.showCompany = false
      this.searchCompany = ''
    },
    clear(){
      this.companyList = []
      this.displayCompanyList = []
      this.selectedCompanyItem = ''
    }
  },
  mounted(){

  }
}
</script>
<style scoped>
  .no-padding{
    padding: 0 !important;
  }
  input{
    border: none;
    width: 100%;
    padding: 0 10px;
  }
  input::-webkit-input-placeholder{
    color: #bfc2c5;
  }

  input:focus,select:focus,textarea:focus{
    border-color: rgba(82,168,236,.8);
    box-shadow: 0 0 8px rgba(82,168,236,.6);
  }

  .clearfix:after {content: "."; height: 0px; display: block; clear: both; visibility: hidden;}

  h3{
    margin: 20px;
  }

  .wrapper{
    width: 800px;
    margin: 20px 0px 50px 20px;
  }

  label span{
    display: block;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*功能下拉框 整体壁纸*/
  .functional-select-wrapper{
    width: 100%;
    position: relative;
    font-size: 14px;
  }

  /*展示容器*/
  .functional-select-wrapper .display-container{
    width: 100%;
    min-height: 30px;
    box-sizing: border-box;
    position: relative;
    display: block;
    padding: 6px 12px 6px 12px;
    color: #555;
    background-color: #FFF;
    border-radius: 3px;
    word-break: break-all;
    cursor: pointer;
  }

  .functional-select-wrapper .display-container .single-selected{
    float: left;
  }

  /*单选 搜索框获取焦点后 display-container下边框圆弧去掉radius*/
  .functional-select-wrapper .single-selected-focus{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    transition: all 0.5s ease;
  }

  .functional-select-wrapper .display-container .drop{
    position: absolute;
    top: 4px;
    right: 6px;
    float: right;
    font-style: normal;
    transition: all 0.3s ease;
  }

  .functional-select-wrapper .display-container .drop-up{
    transform: rotate(180deg);
  }

  /*选项容器*/
  .functional-select-wrapper .options-container{
    width: 100%;
    border: 1px solid #CCC;
    background-color: #FFF;
    position: absolute;
    top: 100%;
    margin-top: -1px;
    box-sizing: border-box;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
    z-index: 99;
  }

  .functional-select-wrapper .options-container ul{
    padding: 0;
    margin: 0;
  }

  .functional-select-wrapper .options-container .search-container{
    display: block;
    padding: 5px;
  }

  .functional-select-wrapper .options-container .search-container input{
    width: 90%;
    height: 30px;
    box-sizing: border-box;
    padding-left: 6px;
    display: block;
    border-radius: 4px;
  }

  .functional-select-wrapper .options-container .options-ul-list{
    max-height: 160px;
    list-style-type: none;
    overflow-x: visible;
    overflow-y: auto;
    cursor: pointer;
  }

  .functional-select-wrapper .options-container .options-ul-list li{
    height: 32px;
    line-height: 20px;
    box-sizing: border-box;
    text-indent: 5px;
    padding: 6px;
    font-size: 12px;
    border-bottom: 1px solid #eee;
  }

  .functional-select-wrapper .options-container .options-ul-list .selected{
    background-color: rgba(45,140,240,.9);
    color: #fff;
  }

  /*多选框 展示容器*/
  .functional-select-wrapper .multiple-select-container{
    overflow: hidden;
    padding: 6px 6px 0px 12px;
    /*cursor: text;*/
  }

  /*单个选中的item*/
  .functional-select-wrapper .multiple-selected-item{
    width: auto;
    height: 20px;
    line-height: 15px;
    box-sizing: border-box;
    margin: 0px 5px 5px 0px;
    padding: 2px 15px 2px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    float: left;
    background: #eee;
  }

  .functional-select-wrapper .multiple-selected-item i{
    font-style: normal;
    position: absolute;
    right: 3px;
    top: 0px;
    cursor: pointer;
    color: #aaa;
  }

  .functional-select-wrapper .multiple-selected-item i:hover{
    font-weight: bolder;
    color: #000;
  }

</style>
