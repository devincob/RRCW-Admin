<template>
  <div>
    <img :src="require('../assets/images/logo.png')" alt="">
    <p>{{msg}}<br/>{{msg}}</p>
    <div>{{count}}</div>
    <el-button @click="onSetCount" size="mini">SET COUNT</el-button>
    <el-button @click="onStartCount" size="mini">{{start ? 'STOP' : 'START'}} COUNT</el-button>
    <el-progress type="circle" :percentage="percentage"/>
    <el-progress type="circle" :percentage="percentage"/>
    <el-progress type="circle" :percentage="percentage" status="success"/>
    <el-progress type="circle" :percentage="percentage" status="exception"/>

    <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>
    <x-empty/>
    <span>{{new Date()|formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
    <el-dialog
      v-drag-dialog="{reset: true, range: 'body'}"
      title="提示2"
      :visible.sync="centerDialogVisible"
      width="500px"
      center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称1">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"/>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"
                            style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="form.delivery"/>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"/>
            <el-checkbox label="地推活动" name="type"/>
            <el-checkbox label="线下主题活动" name="type"/>
            <el-checkbox label="单纯品牌曝光" name="type"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"/>
            <el-radio label="线下场地免费"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="form.desc"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button @click="centerDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import jQuery from 'jquery'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      percentage: 0,
      start: null,
      centerDialogVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  computed: {...mapState(['count'])},
  methods: {
    ...mapActions(['setCount']),
    onSetCount () {
      // this.$store.dispatch('setCount', {count: 100})
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.setCount({
        count: Number((Math.random() * 100).toFixed(2))
      }).then((val) => {
        loading.close()
        this.percentage = val
      })
    },
    onStartCount () {
      if (!this.start) {
        this.start = setInterval(() => {
          this.onSetCount()
        }, 3000)
      } else {
        clearInterval(this.start)
        this.start = null
      }
    }
  },
  mounted () {
    jQuery.ajax({
      url: '/api/users/2',
      dataType: 'json',
      success: res => {
        console.log(res)
      }
    })
  }
}
</script>
