<template>
  <div class="user-suborders-tab">
    <el-form :inline="true" size="mini" class="demo-form-inline">
      <el-form-item label="岗位">
        <el-select placeholder="岗位" v-model="searchFormInfo.jobTagId" style="width: 120px">
          <el-option label="全部" value=""/>
          <el-option :label="item.jobTagName" :value="item.jobTagId" v-for="item in tagList" :key="item.jobTagId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="接单模式">
        <el-select placeholder="接单模式" v-model="searchFormInfo.applyType" style="width: 120px">
          <el-option label="全部" value=""/>
          <el-option label="抢单" value="W"/>
          <el-option label="指派" value="P"/>
        </el-select>
      </el-form-item>
      <el-form-item label="取消类型">
        <el-select placeholder="取消类型" v-model="searchFormInfo.cancelType" style="width: 120px">
          <el-option label="全部" value=""/>
          <el-option label="平台取消" value="S5"/>
          <el-option label="B端取消" value="S6"/>
          <el-option label="C端取消" value="S7"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select placeholder="状态" v-model="searchFormInfo.subStatus" style="width: 120px">
          <el-option label="全部" value=""/>
          <el-option label="预约中" value="1"/>
          <el-option label="待上班" value="2"/>
          <el-option label="上班中" value="3"/>
          <el-option label="待支付（已下班）" value="4"/>
          <el-option label="已支付" value="5"/>
          <el-option label="取消" value="6"/>
          <el-option label="超时无人抢" value="7"/>
          <el-option label="已确认未支付" value="8"/>
          <el-option label="企业退工" value="9"/>
          <el-option label="兼职取消(旷工)" value="10"/>
        </el-select>
      </el-form-item>
      <el-form-item label="事件订单">
        <el-checkbox v-model="searchFormInfo.hasEvent">事件订单</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadOrders">筛选</el-button>
        <el-button type="danger" @click="clearQueryParams">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="orderList"
      :border="true"
      :highlight-current-row="true"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      size="mini"
      style="width: 100%;">
      <el-table-column fixed prop="beginTime" label="上班日期" min-width="100">
        <template slot-scope="scope">
          <div>{{$utils.dateFormat(scope.row.beginTime, 'MM-dd 周www')}}</div>
          <o-tag v-if="scope.row.overPay && scope.row.overPay === 'Y'" background="#f56c6c">完</o-tag>
          <o-tag v-else background="#ffd034">日</o-tag>
          <o-tag v-if="scope.row.applyType && scope.row.applyType === 'W'" background="#14d0bc">抢</o-tag>
          <o-tag v-if="scope.row.applyType && (scope.row.applyType === 'C' || scope.row.applyType === 'P')" background="#e6a23c">派</o-tag>
          <o-tag v-if="scope.row.hasEating && scope.row.hasEating === 'Y'" background="#409eff">饭</o-tag>
          <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 2" background="#4cbb15">事</o-tag>
          <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 1" background="#909399">事</o-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="标题/订单号" min-width="165">
        <template slot-scope="scope">
          <div>{{scope.row.orderTitle}}</div>
          <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
            {{scope.row.orderSubNo}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="orderContact" label="订单所属" min-width="110">
        <template slot-scope="scope">
          <div>{{scope.row.companyName}}</div>
          <a :href="`/user/company-detail?cid=${scope.row.companyUserId}`" target="_blank">
            {{scope.row.orderPhone}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="jobTagName" label="岗位" min-width="100"/>
      <el-table-column prop="jobTagName" label="联系人" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.orderContact}}</div>
          <div>{{scope.row.orderPhone}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime" label="上班时间" min-width="150">
        <template slot-scope="scope">
          <div>{{$utils.dateFormat(scope.row.beginTime, 'MM-dd 周www')}} {{timeDiff(scope.row.beginTime, scope.row.endTime)}}</div>
          <div>{{$utils.dateFormat(scope.row.beginTime, 'hh:mm')}}~{{$utils.dateFormat(scope.row.endTime, 'hh:mm')}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="上班地址" min-width="150"/>
      <el-table-column :render-header="workerNumHeader" prop="workerNum" label="工资" min-width="190" :formatter="formatSalary"/>
      <el-table-column prop="subStatus" label="状态" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.subStatusText || ''}}</div>
          <div>{{formatPayTime(scope.row)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="clockOnTime" label="签到信息" min-width="150">
        <template slot-scope="scope">
          <div>{{scope.row.clockOnTime}}</div>
          <div>{{scope.row.clockOnAddress}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="clockOffTime" label="签退信息" min-width="150">
        <template slot-scope="scope">
          <div>{{scope.row.clockOffTime}}</div>
          <div>{{scope.row.clockOffAddress}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right">
      <el-pagination
        class="mt-sm"
        :page-sizes="[10, 20, 40, 60, 80]"
        :page-size="searchFormInfo.pageSize"
        :current-page="searchFormInfo.pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="(size) => this.searchFormInfo.pageSize = size"
        @current-change="(index) => this.searchFormInfo.pageIndex = index">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import OTag from '../../../components/OTag'
import OrderAssignDialog from '../../../components/OrderAssignDialog'
import OrderEventDialog from '../../../components/OrderEventDialog'
export default {
  name: 'UserOrders',
  components: {OrderEventDialog, OrderAssignDialog, OTag},
  props: {
    userId: [Number, String]
  },
  data(){
    return {
      orderList: [],
      tagList: [],
      totalCount: 0,
      loading: false,
      searchFormInfo: {
        pageIndex: 1,
        pageSize: 20,
        'jobTagId': '',
        'applyType': '',
        'cancelType': '',
        'subStatus': '',
        'hasEvent': ''
      }
    }
  },
  watch: {
    userId(){
      this.loadOrders()
    },
    'searchFormInfo.pageIndex'(){
      this.loadOrders()
    },
    'searchFormInfo.pageSize'(){
      if (this.searchFormInfo.pageIndex !== 1) {
        this.searchFormInfo.pageIndex = 1
      } else {
        this.loadOrders()
      }
    }
  },
  methods: {
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
    async loadOrders(){
      if (this.loading || !this.userId) return
      this.loading = true
      try {
        const data = await this.$$main.userQueryListOrder({
          workerUserId: this.userId,
          ...this.searchFormInfo,
          hasEvent: this.searchFormInfo.hasEvent ? 1 : 0
        })
        this.totalCount = data.totalCount
        this.orderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    clearQueryParams(){
      this.searchFormInfo = {
        ...this.searchFormInfo,
        'jobTagId': '',
        'applyType': '',
        'cancelType': '',
        'subStatus': '',
        'hasEvent': ''
      }
      this.loadOrders()
    },
    timeDiff(startTime, endTime){
      let s = this.$utils.dateCreate(startTime || '')
      let e = this.$utils.dateCreate(endTime || '')
      return `${(parseInt(e - s) / 1000 / 60 / 60).toFixed(2)}小时`
    },
    hourFormat(time){
      let d = parseInt(time / 60 / 24)
      let dh = parseInt(time / 60 % 24)
      let h = parseInt(time / 60)
      let m = time % 60
      return d > 0 ? `${d}天${dh}小时` : `${h > 0 ? h + '小时' : ''}${m}分`
    },
    formatSex(sex){
      const sexs = {
        'N': '不限',
        'M': '男',
        'F': '女',
        'D': ''
      }
      return sexs[sex || 'N']
    },
    formatPayTime(row){
      let text = []
      if (row.subStatus === 4) {
        text.push(`${this.hourFormat(row.autoPayMinutes)}自动确认`)
      } else if (['S1', 'S2', 'S3', 'S3'].indexOf(row.overType) !== -1){
        row.overUserName && text.push(row.overUserName || '')
        row.overTime && text.push(row.overTime || '')
      } else if (['S5', 'S6', 'S7'].indexOf(row.overType) !== -1){
        row.overUserName && text.push(row.overUserName || '')
        row.overTime && text.push(row.overTime || '')
        row.overReason && text.push(row.overReason || '')
      }
      return text.join('，')
    },
    formatSalary(row){
      let salary = `${this.$options.filters['currency']((row.singleSalary + (row.singleServiceCharge || 0)), '', 2)}元 / ${this.$options.filters['currency'](row.singleSalary, '', 2)}元 / ${this.$options.filters['currency'](row.adjustSalary, '', 2)}元`
      const h = this.$createElement
      return h({
        template: `<div>${salary}</div>`
      })
    },
    workerNumHeader(h, { column, $index }){
      return h('span', [
        h('span', '工资 '),
        h('el-tooltip', {
          props: {
            content: 'B端日薪 / C端日薪 / 实付工资',
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
    }
  },
  mounted() {
    this.queryTagList()
  }
}
</script>

<style lang="scss">
  .user-suborders-tab {
    .el-table--mini td {
      vertical-align: top;
    }
    .el-table--mini td .cell {
      height: auto;
      overflow: unset;
      white-space: unset;
      text-overflow: unset;
    }
  }
</style>
