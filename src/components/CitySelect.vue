<template>
  <div style="display: -webkit-box;">
    <div class="functional-select-wrapper province-wrapper" :class="customBoxClass">
      <label
        class="display-container multiple-select-container clearfix"
        v-bind:class="[(showProvince)?'single-selected-focus':'', customClass]"
        v-on:click.stop="multipleFocus()"
        style="width: 95%;"
      >
        <span v-show="!selectedProvinceItem">全国</span>
        <span>{{ selectedProvinceItem.provinceName }}</span>
        <i
          class="drop"
          v-bind:class="showProvince ? 'drop-up': ''"
        >
          <el-icon
            class="el-icon-arrow-down"
            style="color: #80848f;"
          ></el-icon>
        </i>
      </label>
      <div
        class="options-container"
        v-show="showProvince"
        style="width: 95%"
      >
        <div class="search-container">
          <input
            style="width: 100%;"
            ref="searchInput"
            placeholder="搜索"
            class="search-input"
            v-model="searchProvince"
            v-on:keyup="multipleSearch($event)"
          />
        </div>
        <ul class="options-ul-list">
          <li v-show="displayProvinceList.length === 0">无数据</li>
          <li
            v-for="item in displayProvinceList"
            :key="item.distictId"
            v-on:click.stop.prevent="multipleSelect(item)"
            v-bind:class="item.distictId === selectedProvinceItem.distictId ? 'selected' : ''"
          >{{ item.provinceName }}</li>
        </ul>
      </div>
    </div>
    <div class="functional-select-wrapper city-wrapper" :class="customBoxClass">
      <label
        class="display-container multiple-select-container clearfix"
        v-bind:class="[(showCity)?'single-selected-focus':'', customClass]"
        v-on:click.stop="cityMultipleFocus()"
      >
        <span v-show="!selectedCityItem">全部城市</span>
        <span>{{ selectedCityItem.districtName }}</span>
        <i
          class="drop"
          v-bind:class="showCity ? 'drop-up': ''"
        >
          <el-icon
            class="el-icon-arrow-down"
            style="color: #80848f;"
          ></el-icon>
        </i>
      </label>
      <div
        class="options-container"
        v-show="showCity"
      >
        <div class="search-container">
          <input
            style="width: 100%;"
            ref="citySearchInput"
            placeholder="搜索"
            class="search-input"
            v-model="searchCity"
            v-on:keyup="cityMultipleSearch($event)"
          />
        </div>
        <ul class="options-ul-list">
          <li v-show="displayCityList.length === 0">无数据</li>
          <li
            v-for="item in displayCityList"
            :key="item.distictId"
            v-on:click.stop.prevent="cityMultipleSelect(item)"
            v-bind:class="{'selected' : item.distictId === selectedCityItem.distictId, 'disable' : showOpen && item.isOpen === 'N'}"
          >{{ item.districtName }}{{ item.isOpen === 'N' && showOpen ? '(未开通)' : '' }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'city-select',
  props: {
    showOpen: {
      type: Boolean,
      'default': false
    },
    customClass: {
      type: String,
      default: ''
    },
    customBoxClass: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      provinceList: [],
      displayProvinceList: [],
      showProvince: false,
      searchProvince: '',
      selectedProvinceItem: '',
      allProvince: [{
        distictId: '',
        provinceName: '全国'
      }],
      cityList: [],
      displayCityList: [],
      showCity: false,
      searchCity: '',
      selectedCityItem: '',
      allCity: [{
        'distictId': '',
        'districtName': '全部城市',
        'label': '全部城市'
      }]
    }
  },
  watch: {
    selectedProvinceItem(val) {
      if (!val.distictId || val.distictId === '') {
        this.cityList = this.allCity
        this.selectedCityItem = this.allCity[0]
        this.$emit('onCitySelected', this.selectedCityItem)
      } else {
        this.selectedCityItem = ''
        this.regionInfo.forEach((i) => {
          if (i.distictId === val.distictId) {
            this.cityList = i.children
          }
        })
      }
    }
  },
  computed: {
    regionInfo() {
      return this.$store.getters.getRegion || []
    }
  },
  methods: {
    multipleFocus() {
      this.cityBlur()
      if (!this.showProvince) {
        this.showProvince = true
        this.multipleSearch()
        this.searchInputFocus()
      } else {
        this.blur()
      }
    },
    multipleSelect(name) {
      let tmpName = name
      let displayProvinceList = this.regionInfo
      this.selectedProvinceItem = name
      for (let i = 0; i < displayProvinceList.length; i++) {
        let item = displayProvinceList[i]
        if (tmpName.distictId === item.distictId) {
          this.multipleInitSearch()
          this.multipleSearch()
          this.searchInputFocus()
          this.displayCityList = item.children
        }
      }
      this.$emit('onProvinceSelected', this.selectedProvinceItem)
      this.blur()
    },
    searchInputFocus() {
      this.$nextTick(() => {
        this.$refs['searchInput'].focus()
      })
    },
    multipleSearch(event) {
      let search = this.searchProvince
      let REG_RULE = new RegExp(search, 'i')

      // 通过回车键 添加
      if (event && event.keyCode === 13 && search !== '') {
        for (let i = 0; i < this.regionInfo.length; i++) {
          let item = this.regionInfo[i]
          if (item.provinceName === search) {
            this.multipleSelect(item)
            return
          }
        }
      }

      this.displayProvinceList = []
      this.regionInfo && this.regionInfo.forEach((item) => {
        if (REG_RULE.test(item.provinceName)) {
          this.displayProvinceList = [...this.displayProvinceList, item]
        }
      })
    },
    multipleInitSearch() {
      this.searchProvince = ''
    },
    blur() {
      this.showProvince = false
      this.searchProvince = ''
    },
    cityMultipleFocus() {
      this.blur()
      if (!this.showCity) {
        this.showCity = true
        this.cityMultipleSearch()
        this.citySearchInputFocus()
      } else {
        this.cityBlur()
      }
    },
    cityMultipleSelect(name) {
      if (this.showOpen && name.isOpen === 'N') {
        return
      }
      let tmpName = name
      let displayCityList = this.cityList
      this.selectedCityItem = name
      for (let i = 0; i < displayCityList.length; i++) {
        let item = displayCityList[i]
        if (tmpName.distictId === item.distictId) {
          this.cityMultipleInitSearch()
          this.cityMultipleSearch()
          this.citySearchInputFocus()
        }
      }
      this.$emit('onCitySelected', this.selectedCityItem)
      this.cityBlur()
    },
    citySearchInputFocus() {
      this.$nextTick(() => {
        this.$refs['citySearchInput'].focus()
      })
    },
    cityMultipleSearch(event) {
      let search = this.searchCity
      let REG_RULE = new RegExp(search, 'i')

      // 通过回车键 添加
      if (event && event.keyCode === 13 && search !== '') {
        for (let i = 0; i < this.cityList.length; i++) {
          let item = this.cityList[i]
          if (item.districtName === search) {
            this.cityMultipleSelect(item)
            return
          }
        }
      }

      this.displayCityList = []
      this.cityList && this.cityList.forEach((item) => {
        if (REG_RULE.test(item.provinceName)) {
          this.displayCityList = [...this.displayCityList, item]
        }
      })
    },
    cityMultipleInitSearch() {
      this.searchCity = ''
    },
    cityBlur() {
      this.showCity = false
      this.searchCity = ''
    },
    clear() {
      this.selectedProvinceItem = ''
      this.selectedCityItem = ''
    }
  },
  mounted() {
    if (!this.regionInfo || this.regionInfo.length < 1) {
      this.$store.dispatch('setRegion')
    }
    this.multipleSelect({
      distictId: 1049,
      provinceName: '上海市',
      label: '上海市',
      parentId: 1,
      children: [{
        distictId: 1050,
        districtName: '上海城区',
        label: '上海城区'
      }]
    })
    setTimeout(() => {
      this.cityMultipleSelect({
        distictId: 1050,
        districtName: '上海城区',
        label: '上海城区'
      })
    }, 600)
  }
}
</script>
<style scoped>
input {
  border: 1px solid #ccc;
  outline: 0;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: 0 0 8px rgba(82, 168, 236, 0.6);
}

.clearfix:after {
  content: ".";
  height: 0px;
  display: block;
  clear: both;
  visibility: hidden;
}

h3 {
  margin: 20px;
}

.wrapper {
  width: 800px;
  margin: 20px 0px 50px 20px;
}

label span {
  display: block;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.province-wrapper {
  width: 45%;
}

.city-wrapper {
  width: 55%;
}

/*功能下拉框 整体壁纸*/
.functional-select-wrapper {
  /*width: 50%;*/
  position: relative;
  font-size: 14px;
}

/*展示容器*/
.functional-select-wrapper .display-container {
  width: 100%;
  min-height: 30px;
  box-sizing: border-box;
  position: relative;
  display: block;
  padding: 0 12px 6px 12px;
  color: #555;
  background-color: #fff;
  word-break: break-all;
  cursor: pointer;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
}

.functional-select-wrapper .display-container .single-selected {
  float: left;
}

/*单选 搜索框获取焦点后 display-container下边框圆弧去掉radius*/
.functional-select-wrapper .single-selected-focus {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  transition: all 0.5s ease;
}

.functional-select-wrapper .display-container .drop {
  position: absolute;
  top: 0;
  right: 6px;
  float: right;
  font-style: normal;
  transition: all 0.3s ease;
}

.functional-select-wrapper .display-container .drop-up {
  transform: rotate(180deg);
}

/*选项容器*/
.functional-select-wrapper .options-container {
  width: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
  position: absolute;
  top: 100%;
  margin-top: -1px;
  box-sizing: border-box;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  z-index: 2000;
}

.functional-select-wrapper .options-container .search-container {
  display: block;
  padding: 5px;
}

.functional-select-wrapper .options-container .search-container input {
  width: 90%;
  height: 30px;
  box-sizing: border-box;
  padding-left: 6px;
  display: block;
  border-radius: 4px;
}

.functional-select-wrapper .options-container .options-ul-list {
  max-height: 160px;
  list-style-type: none;
  overflow-x: visible;
  overflow-y: auto;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.functional-select-wrapper .options-container .options-ul-list li {
  height: 32px;
  line-height: 20px;
  box-sizing: border-box;
  text-indent: 5px;
  padding: 6px;
  font-size: 12px;
}

.functional-select-wrapper .options-container .options-ul-list .selected {
  background-color: rgba(45, 140, 240, 0.9);
  color: #fff;
}

/*多选框 展示容器*/
.functional-select-wrapper .multiple-select-container {
  overflow: hidden;
  /*padding: 6px 6px 0px 12px;*/
  /*cursor: text;*/
}

/*单个选中的item*/
.functional-select-wrapper .multiple-selected-item {
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

.functional-select-wrapper .multiple-selected-item i {
  font-style: normal;
  position: absolute;
  right: 3px;
  top: 0px;
  cursor: pointer;
  color: #aaa;
}

.functional-select-wrapper .multiple-selected-item i:hover {
  font-weight: bolder;
  color: #000;
}

.disable {
  background: #c7c7c7;
}
</style>
