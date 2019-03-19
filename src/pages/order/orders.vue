<template>
  <x-page breadcrumb="auto" title="主订单">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
      <div>
        <el-form :inline="true" size="mini" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input placeholder="标题" v-model="form.orderTitle" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input placeholder="订单号" v-model="form.orderNoCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input placeholder="企业名称" v-model="form.companyNameCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input placeholder="联系人" v-model="form.orderContactCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input placeholder="联系电话" v-model="form.orderPhoneCondition" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select placeholder="岗位" v-model="form.jobTagId" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option :label="item.jobTagName" :value="item.jobTagId" v-for="item in tagList" :key="item.jobTagId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工作时间">
            <el-date-picker
              popper-class="orders-date-picker"
              style="width: 220px"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              v-model="form.workTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select placeholder="订单状态" v-model="form.orderStatusCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="待上班" value="1"/>
              <el-option label="上班中" value="2"/>
              <el-option label="已下班" value="3"/>
              <el-option label="取消" value="4"/>
            </el-select>
          </el-form-item>
          <el-form-item label="预约状态">
            <el-select placeholder="预约状态" v-model="form.applyStatusCondition" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="无人预约" value="1"/>
              <el-option label="部分预约" value="2"/>
              <el-option label="预约完成" value="3"/>
            </el-select>
          </el-form-item>
          <el-form-item label="连续订单">
            <el-checkbox v-model="form.isContinuity">连续订单</el-checkbox>
          </el-form-item>
          <el-form-item label="城市" class="citySelectBox">
            <city-select :customClass="'citySelectClass'" ref="citySelect" @onCitySelected="onCitySelected"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onScreenList">筛选</el-button>
            <el-button type="danger" @click="clearQueryParams">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;"
        :border="true"
        :highlight-current-row="true">
        <el-table-column fixed prop="orderNo" label="订单编号" min-width="160">
          <template slot-scope="scope">
            <div>
              <a :href="`/order/detail?orderid=${scope.row.orderId}`" target="_blank">
                {{scope.row.orderNo}}
              </a>
            </div>
            <div>
              <o-tag v-if="scope.row.continuityOrderId" background="#ff6600">连</o-tag>
              <o-tag v-if="scope.row.isTrain === 'Y'" background="#00a8ff">训</o-tag>
              <o-tag v-if="scope.row.overPay && scope.row.overPay === 'Y'" background="#f56c6c">完</o-tag>
              <o-tag v-else background="#ffd034">日</o-tag>
              <o-tag v-if="scope.row.hasEating && scope.row.hasEating === 'Y'" background="#409eff">饭</o-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="企业名称" min-width="120">
          <template slot-scope="scope">
            <a :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">
              {{scope.row.companyName}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="orderContact" label="联系人/电话" min-width="100">
         <template slot-scope="scope">
           <div>{{scope.row.orderContact}}</div>
           <div>{{scope.row.orderPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="jobTagName" label="岗位" min-width="100"/>
        <el-table-column prop="sex" label="条件" min-width="120" >
           <template slot-scope="scope">
            <div>性别：{{formatSex(scope.row)  }}</div>
            <div>年龄：{{formatAge(scope.row)}}</div>
           </template>
        </el-table-column>
        <el-table-column prop="showBeginTime" label="工作时间" min-width="120" :formatter="formatTime">
        </el-table-column>
        <el-table-column :render-header="workerNumHeader" prop="workerNum" label="人数" min-width="80" :formatter="(row) => `${row.originalWorkerNum} / ${row.workerNum} / ${row.applyWorkerNum}`"/>
        <el-table-column prop="singleSalary" label="单价/合计(元)" min-width="120" :formatter="(row) => `${$options.filters['currency'](row.singleSalary, '', 2)} / ${$options.filters['currency'](row.sumSalary, '', 2)}`"/>
        <!-- <el-table-column prop="overPay" label="结算方式" min-width="120" :formatter="(row) => row.overPay === 'Y' ? '完工结算' : '当日结算'"/> -->
        <el-table-column prop="cityName" label="城市" width="80"/>
        <el-table-column prop="orderStatus" label="订单状态" width="80" :formatter="formatStatus"/>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="form.pageSize"
          :current-page="form.pageIndex"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => this.form.pageSize = size"
          @current-change="(index) => this.form.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
  </x-page>
</template>

<script>
import CitySelect from '../../components/CitySelect'
import OTag from '../../components/OTag'
export default {
  name: 'orders',
  components: {CitySelect, OTag},
  data() {
    return {
      orderList: [],
      tagList: [],
      totalCount: 0,
      loading: false,
      centerDialogVisible: false,
      form: {
        pageIndex: 1,
        pageSize: 20,
        orderContactCondition: '',
        orderPhoneCondition: '',
        companyNameCondition: '',
        jobTagId: '',
        workTime: [],
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        orderStatusCondition: '',
        applyStatusCondition: '',
        isContinuity: false,
        continuityCondition: '0',
        cityNameCondition: '',
        orderNoCondition: '',
        orderIdCondition: '',
        orderTitle: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    'form.workTime': {
      handler: function (val) {
        if (val && val.length > 0) {
          this.form.workTimeBeginCondition = val[0]
          this.form.workTimeEndCondition = val[1]
        } else {
          this.form.workTimeBeginCondition = ''
          this.form.workTimeEndCondition = ''
        }
      },
      deep: true
    },
    'form.isContinuity': {
      handler: function (val) {
        this.form.continuityCondition = val ? '1' : '0'
      },
      deep: true
    },
    'form.pageIndex': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    },
    'form.pageSize': {
      handler: function () {
        this.queryOrderList()
      },
      deep: true
    }
  },
  methods: {
    formatTime(row, column){
      return this.$utils.dateFormat(row.showBeginTime, 'MM-dd hh:mm') + '~' + this.$utils.dateFormat(row.showEndTime, 'hh:mm')
    },
    formatStatus(row, column) {
      let arr = {
        '1': '待上班',
        '2': '上班中',
        '3': '已下班',
        '4': '已取消'
      }
      return arr[row.orderStatus || 1]
    },
    formatSex(row){
      const sex = {
        'N': '不限',
        'M': '男',
        'F': '女'
      }
      return sex[row.sex || 'N']
    },
    formatAge(row){
      if (row.beginAge === 0 && row.endAge === 0){
        return '不限'
      } else {
        return `${row.beginAge || 16}-${row.endAge || 70}岁`
      }
    },
    workerNumHeader(h, { column, $index }){
      return h('span', [
        h('span', '人数 '),
        h('el-tooltip', {
          props: {
            content: '第一发布需求人数 / 实际需求人数（可能有取消）/ 预约人数',
            placement: 'top'
          }
        }, [
          h('i', {
            class: {
              'el-icon-question': true
            }
          })
        ])
      ])
    },
    onCitySelected(item){
      this.form.cityNameCondition = item.districtName
    },
    onScreenList(){
      if (this.form.pageIndex === 1){
        this.queryOrderList()
      } else {
        this.form.pageIndex = 1
      }
    },
    async queryOrderList() {
      try {
        if (this.loading){
          return
        }
        this.loading = true
        const data = await this.$$main.orderQueryListMain(this.form)
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async queryTagList() {
      try {
        const data = await this.$$main.tagList({
          status: 'N'
        })
        this.tagList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    onPageShow() {
      this.clearQueryParams()
      // this.queryOrderList()
      this.queryTagList()
    },
    clearQueryParams(){
      this.$refs['citySelect'].clear()
      this.form = {
        orderContactCondition: '',
        orderPhoneCondition: '',
        companyNameCondition: '',
        jobTagId: '',
        workTime: [],
        workTimeBeginCondition: '',
        workTimeEndCondition: '',
        orderStatusCondition: '',
        applyStatusCondition: '',
        isContinuity: false,
        continuityCondition: '0',
        cityNameCondition: '',
        orderNoCondition: '',
        orderIdCondition: '',
        orderTitle: '',
        pageIndex: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
  }
}
</script>
