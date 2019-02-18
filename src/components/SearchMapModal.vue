<template>
  <el-dialog
    :visible="showMapSelect"
    title="地图搜索"
    width="50%"
    :show-close="false"
    :mask-closable="false"
    :append-to-body="appendToBody">
    <template v-if="mapReady && showMapSelect">
      <div class="amap-page-container">
        <el-amap-search-box ref="searchBox" class="search-box" :search-option="searchParams" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
        <el-amap :vid="vid" :center="mapCenter" :zoom="12">
          <el-amap-marker :title="marker.content" :position="marker.position" :events="marker.events" :draggable="true" :animation="marker.animation" :raiseOnDrag="true"></el-amap-marker>
        </el-amap>
      </div>
    </template>
    <div slot="footer">
      <el-button :native-type="'button'" @click="showMapSelect = false">取消</el-button>
      <el-button :native-type="'button'" @click="onSearchDone()" type="primary">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import mapHelper from '../libs/AMapHelper'
const DEFAULT_MAP_CENTER = [121.4744244672, 31.2266910376]
export default{
  name: 'search-map-modal',
  props: {
    cityName: {
      type: String,
      'default': '上海市'
    },
    cityLimit: {
      type: Boolean,
      'default': true
    },
    appendToBody: {
      type: Boolean,
      'default': false
    }
  },
  data: function () {
    return {
      showMapSelect: false,
      mapReady: false,
      vid: 'search-map',
      zoom: 10,
      mapCenter: DEFAULT_MAP_CENTER,
      marker: {
        position: DEFAULT_MAP_CENTER,
        animation: 'AMAP_ANIMATION_DROP',
        events: {
          dragend: (e) => {
            this.marker.position = [e.lnglat.lng, e.lnglat.lat]
            this.lng = e.lnglat.lng
            this.lat = e.lnglat.lat
            this.setGeoAddress([e.lnglat.lng, e.lnglat.lat])
          }
        }
      },
      events: {
        init(o) {
          // console.log(o);
        }
      },
      address: '',
      lat: 0,
      lng: 0,
      searchParams: {
        city: '',
        citylimit: this.cityLimit
      },
      AMap: null
    }
  },
  watch: {
    cityName() {
      this.address = ''
      this.lat = 0
      this.lng = 0
    }
  },
  methods: {
    open() {
      this.showMapSelect = true

      if (this.address && this.lat && this.lng) {
        this.setTimeout(() => {
          this.$refs.searchBox.keyword = this.address
          this.onSearchResult(true, [{
            lng: this.lng,
            lat: this.lat
          }])
        }, 500)
        return
      }
      let defaultCity = this.cityName || '上海市'
      defaultCity = defaultCity.split('城区')[0]
      this.searchParams.city = defaultCity
      this._getGeolocation(defaultCity, (result) => {
        this.setSearchShow(result, 10)
      })
    },
    onSearchResult(status, pois) {
      if (!status) {
        this.$message.error(pois.message || '未搜索到的地点')
        return
      }
      if (pois.length > 0) {
        let {lng, lat} = pois[0]
        this.marker = {
          position: [lng, lat],
          animation: 'AMAP_ANIMATION_DROP',
          events: {
            dragend: (e) => {
              this.marker.position = [e.lnglat.lng, e.lnglat.lat]
              this.lng = e.lnglat.lng
              this.lat = e.lnglat.lat
              this.setGeoAddress([e.lnglat.lng, e.lnglat.lat])
            }
          }
        }
        this.lng = lng
        this.lat = lat
        this.mapCenter = [lng, lat]
        this.zoom = 16
      }
    },
    _getGeolocation(address, callback) {
      this.AMap.service('AMap.Geocoder', () => { // 回调函数
        // 实例化Geocoder
        let geocoder = new this.AMap.Geocoder()
        this.zoom = 16
        geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.setGeoAddress([result.geocodes[0].location.lng, result.geocodes[0].location.lat])
            if (callback && typeof callback === 'function') {
              callback(result)
            }
          }
        })
      })
    },
    _getGeoAddress(address, callback) { // address: 经纬度数组
      this.AMap.service('AMap.Geocoder', () => { // 回调函数
        // 实例化Geocoder
        let geocoder = new this.AMap.Geocoder()
        this.zoom = 16
        geocoder.getAddress(address, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            if (callback && typeof callback === 'function') {
              callback(result)
            }
          }
        })
      })
    },
    setGeoAddress(address) {
      this._getGeoAddress(address, (res) => {
        let address = res.regeocode.addressComponent
        this.$refs.searchBox.keyword = `${address.street}${address.streetNumber}${address.building}`
      })
    },
    setSearchShow(result, zoom) {
      this.lat = result.geocodes[0].location.lat
      this.lng = result.geocodes[0].location.lng
      this.mapCenter = [this.lng, this.lat]
      this.zoom = zoom || 16
      this.marker = {
        position: [this.lng, this.lat],
        animation: 'AMAP_ANIMATION_DROP',
        events: {
          dragend: (e) => {
            this.marker.position = [e.lnglat.lng, e.lnglat.lat]
            this.lng = e.lnglat.lng
            this.lat = e.lnglat.lat
            this.setGeoAddress([e.lnglat.lng, e.lnglat.lat])
          }
        }
      }
    },
    onSearchDone() {
      let inputText = this.$refs.searchBox.keyword
      if (inputText && inputText !== '') {
        this.address = inputText
      } else {
        this.$message.error('请先填写地址！')
        return
      }
      this.$emit('searchDone', {
        lat: this.lat,
        lng: this.lng,
        address: this.address
      })
      this.showMapSelect = false
    }
  },
  mounted() {
    mapHelper.UIReady(() => {
      this.mapReady = true
      this.AMap = window.AMap
    })
  }
}
</script>
<style scoped>
  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-page-container{
    position: relative;
    width: 100%;
    height: 400px;
    margin: -20px 0;
  }
</style>
