<template>
  <div style="width: 100%">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <div>订单信息</div>
      </div>
      <div>
        <table class="detail-table">
          <tr>
            <td>订单ID：</td>
            <td>{{info.orderSubId}}</td>
            <td>订单编号：</td>
            <td>{{info.orderSubNo}}</td>
          </tr>
          <tr>
            <td>订单标题：</td>
            <td>
              {{info.orderTitle}}
              <o-tag
                v-if="info.continuityOrderId"
                background="#ff6600">连</o-tag>
              <o-tag
                v-if="info.overPay && info.overPay === 'Y'"
                background="#f56c6c"
              >完</o-tag>
              <o-tag
                v-else
                background="#ffd034"
              >日</o-tag>
              <o-tag
                v-if="info.applyType && info.applyType === 'W'"
                background="#14d0bc"
              >抢</o-tag>
              <o-tag
                v-if="info.applyType && (info.applyType === 'C' || info.applyType === 'P')"
                background="#e6a23c"
              >派</o-tag>
              <o-tag
                v-if="info.hasEating && info.hasEating === 'Y'"
                background="#409eff"
              >饭</o-tag>
              <o-tag
                v-if="info.eventStatus && info.eventStatus === 'P'"
                background="#4cbb15"
              >事</o-tag>
              <o-tag
                v-if="info.eventStatus && info.eventStatus === 'C'"
                background="#909399"
              >事</o-tag>
            </td>
            <td>城市：</td>
            <td>{{info.cityName}}</td>
          </tr>
          <tr>
            <td>所属企业：</td>
            <td>{{info.companyName}}</td>
            <td>发布时间：</td>
            <td>{{info.showCreateTime}}</td>
          </tr>
          <tr>
            <td>上班日期：</td>
            <td>{{workDateFormat}}</td>
            <td>上班地址：</td>
            <td>{{info.address}}</td>
          </tr>
          <tr>
            <td>联系人：</td>
            <td>{{info.orderContact}} {{info.orderPhone}}</td>
            <td>岗位：</td>
            <td>{{info.jobTagName}}</td>
          </tr>
          <tr>
            <td>性别：</td>
            <td>{{showSex(info.sex)}}</td>
            <td>年龄：</td>
            <td>{{showAge}}</td>
          </tr>
          <tr>
            <td>身高：</td>
            <td>{{showHeight}}</td>
            <td>体重：</td>
            <td>{{showWeight}}</td>
          </tr>
          <tr>
            <td>金额：</td>
            <td>工资{{info.singleSalary || 0|currency('', 2)}}元 + 服务费{{info.singleServiceCharge || 0|currency('', 2)}}元</td>
            <td>订单状态：</td>
            <td>{{statesFormat}}</td>
          </tr>
          <tr v-if="type !== 'E'">
            <td>最终支付金额：</td>
            <td>工资{{info.adjustSalary || 0|currency('', 2)}}元 + 服务费{{showSumService || 0|currency('', 2)}}元</td>
            <td>{{type === 'O' && info.overType === 'S7' ? '取消原因：' : ''}}</td>
            <td
              style="word-break: break-all"
            >
              {{type === 'O' && info.overType === 'S7' ? info.overReason || '-' : ''}}
            </td>
          </tr>
          <tr>
            <td>工作详情：</td>
            <td
              style="word-break: break-all"
              colspan="3"
            >
              {{info.description || '-'}}
            </td>
          </tr>
        </table>
      </div>
    </el-card>
    <el-card v-if="type === 'O'">
      <div
        slot="header"
        class="clearfix"
      >
        <div>接单信息</div>
      </div>
      <table class="detail-table">
        <tr>
          <td>抢单人：</td>
          <td>
            <a
              v-if="info.workerUserId"
              :href="`/user/worker-detail?uid=${info.workerUserId}`"
              target="_blank"
            >
              {{info.workerName || '-'}}
            </a>
            <span v-else>{{info.workerName || '-'}}</span>
            <span style="margin-left: 5px">{{showSex(info.workerSex || 'D')}}</span>
          </td>
          <td>抢单时间：</td>
          <td>{{showApplyTimeInfo}}</td>
        </tr>
        <tr>
          <td>签到：</td>
          <td>{{showClockOnInfo}}</td>
          <td>签退：</td>
          <td>{{showClockOffInfo}}</td>
        </tr>
      </table>
    </el-card>
    <el-card v-if="type === 'E'">
      <div
        slot="header"
        class="clearfix"
      >
        <div>事件处理</div>
      </div>
      <table class="detail-table">
        <tr>
          <td>事件内容：</td>
          <td colspan="3">{{eventInfo.logContent || ''}}</td>
        </tr>
        <tr>
          <td>调整金额：</td>
          <td colspan="3">工资{{eventInfo.salaryAmount || 0|currency('', 2)}}元 + 服务费{{eventInfo.serviceAmount || 0|currency('', 2)}}元 = {{showEventSumAmount || 0|currency('', 2)}}元</td>
        </tr>
        <tr>
          <td>记录人：</td>
          <td colspan="3">{{eventInfo.createUserName || ''}}</td>
        </tr>
        <tr>
          <td>记录时间：</td>
          <td colspan="3">{{eventInfo.createTime || ''}}</td>
        </tr>
      </table>
    </el-card>
  </div>
</template>
<script>
import OTag from './OTag'
export default {
  name: 'sub-order-detail',
  components: {
    OTag
  },
  data() {
    return {
      info: {}
    }
  },
  props: {
    orderSubId: {default: ''},
    type: {default: 'O'},
    eventInfo: {default: () => { return {} }}
  },
  computed: {
    statesFormat() {
      if (this.type === 'E') {
        return this.eventInfo.orderStatus || '-'
      }
      return this.info.subStatusText || '-'
    },
    workDateFormat() {
      return `${this.$utils.dateFormat(this.info.showBeginTime, 'yyyy-MM-dd hh:mm')} ~ ${this.$utils.dateFormat(this.info.showEndTime, 'hh:mm')} ${this.$utils.dateFormat(this.info.showBeginTime, '周www')} ${this.info.workingHours}小时`
    },
    showApplyTimeInfo() {
      return this.info.showApplyTime && this.info.showApplyTime.indexOf('0001') === -1 ? this.info.showApplyTime : '-'
    },
    showClockOnInfo() {
      return this.info.showClockOnTime && this.info.showClockOnTime.indexOf('0001') === -1 ? `${this.info.showClockOnTime} , ${this.info.clockOnAddress || ''}` : '-'
    },
    showClockOffInfo() {
      return this.info.showClockOffTime && this.info.showClockOffTime.indexOf('0001') === -1 ? `${this.info.showClockOffTime} , ${this.info.clockOffAddress || ''}` : '-'
    },
    showAge() {
      if (this.info.beginAge === 0 && this.info.endAge === 0) {
        return '不限'
      } else {
        return `${this.info.beginAge || 18}-${this.info.endAge || 70}岁`
      }
    },
    showHeight() {
      let height = ''
      if (this.info && (this.info.beginHeight || this.info.endHeight)) {
        if (!this.info.beginHeight || this.info.beginHeight === 0) {
          height = `${this.info.endHeight}cm以下`
        } else if (!this.info.endHeight || this.info.endHeight === 0) {
          height = `${this.info.beginHeight}cm以上`
        } else {
          height = `${this.info.beginHeight}-${this.info.endHeight}cm`
        }
      } else {
        height = '不限'
      }
      return height
    },
    showWeight() {
      let weight = ''
      if (this.info && (this.info.beginWeight || this.info.endWeight)) {
        if (!this.info.beginWeight || this.info.beginWeight === 0) {
          weight = `${this.info.endWeight}kg以下`
        } else if (!this.info.endWeight || this.info.endWeight === 0) {
          weight = `${this.info.beginWeight}kg以上`
        } else {
          weight = `${this.info.beginWeight}-${this.info.endWeight}kg`
        }
      } else {
        weight = '不限'
      }
      return weight
    },
    showEventSumAmount(){
      return (Number(this.eventInfo.salaryAmount) || 0) + (Number(this.eventInfo.serviceAmount) || 0)
    },
    showSumService(){
      return (Number(this.info.serviceAmount) || 0) + (Number(this.info.divideAmount) || 0)
    }
  },
  methods: {
    showSex(sex) {
      const sexs = {
        'N': '不限',
        'M': '男',
        'F': '女',
        'D': ''
      }
      return sexs[sex || 'N']
    },
    async querySubOrderDetails() {
      const loading = this.$loading({
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      try {
        this.info = await this.$$main.orderQueryDetailSub({
          orderSubId: this.orderSubId
        })
        this.$emit('getInfo', this.info)
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
  .detail-table{
    tr{
      td:nth-child(2), td:nth-child(4){
        width: auto;
      }
    }
  }
</style>
