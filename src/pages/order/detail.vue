<template>
  <x-page breadcrumb="auto" title="主订单详情">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>主订单详情</span>
        <div class="text-right" style="margin-top: -10px;float: right;">
          <el-tooltip v-if="info.isCrossFirstTime === 'Y' || (!info.continuityOrderIds && info.orderStatus > 1)" class="item" effect="dark" content="订单已开始执行无法减少名额" placement="top">
            <el-button type="text" style="color: #c0c4cc">减少名额</el-button>
          </el-tooltip>
          <el-button v-else :disabled="info.orderStatus === 4" type="text" @click="dialogDelNumDisplay = true">减少名额</el-button>
          <el-tooltip v-if="info.isCrossFirstTime === 'Y' || (!info.continuityOrderIds && info.orderStatus > 1)" class="item" effect="dark" content="订单已开始执行无法增加名额" placement="top">
            <el-button type="text" style="color: #c0c4cc">增加名额</el-button>
          </el-tooltip>
          <el-button v-else :disabled="info.orderStatus === 4" type="text" @click="dialogAddNumDisplay = true">增加名额</el-button>
          <el-button type="text" @click="showCancelAllDialog(orderId, 0)">取消全部订单</el-button>
          <el-button v-if="info.continuityDates && info.continuityDates.length > 0" type="text" @click="onCancelContinuityClick">取消连续</el-button>
          <el-button type="text" @click="showExportDialog(orderId)">导出兼职清单</el-button>
          <!--<a :href="'/working-status-h5?orderId=' + info.orderId" class="el-button el-button&#45;&#45;text" style="float: right; padding: 3px 5px;text-decoration: none;" target="_blank">-->
          <!--<span>查看兼职上班状态</span>-->
          <!--</a>-->
        </div>
      </div>
      <div>
        <table class="detail-table">
          <tr>
            <td>订单标题：</td>
            <td>
              {{info.orderTitle}}
              <o-tag v-if="info.continuityOrderId" background="#ff6600">连</o-tag>
              <o-tag v-if="info.overPay && info.overPay === 'Y'" background="#f56c6c">完</o-tag>
              <o-tag v-else background="#ffd034">日</o-tag>
              <o-tag v-if="info.hasEating && info.hasEating === 'Y'" background="#409eff">饭</o-tag>
              <o-tag v-if="info.isTrain === 'Y'" background="#00a8ff">训</o-tag>
            </td>
            <td>发布时间：</td>
            <td>{{info.showCreateTime}}</td>
          </tr>
          <tr>
            <td>上班日期：</td>
            <td class="showDates" v-html="showWorkDates"/>
            <td>上班时间：</td>
            <td>{{$utils.dateFormat(info.showBeginTime, 'hh:mm')}} ~ {{$utils.dateFormat(info.showEndTime, 'hh:mm')}}</td>
          </tr>
          <tr>
            <td>上班地址：</td>
            <td>{{info.address}}</td>
            <td>岗位：</td>
            <td>{{info.jobTagName}}</td>
          </tr>
          <tr>
            <!--<td>工资：</td>-->
            <!--<td>{{info.singleSalary|currency('', 2)}}元 / 天</td>-->
            <td>城市：</td>
            <td>{{info.cityName}}</td>
            <td>性别：</td>
            <td>{{showSex(info.sex)}}</td>
          </tr>
          <tr>
            <td>年龄：</td>
            <td>{{showAge}}</td>
            <td>身高：</td>
            <td>{{showHeight}}</td>
          </tr>
          <tr>
            <td>体重：</td>
            <td>{{showWeight}}</td>
            <td>人数：</td>
            <td>{{info.originalWorkerNum}}/{{info.workerNum}}/{{info.applyWorkerNum}}</td>
          </tr>
          <tr>
            <td>联系人：</td>
            <td>{{info.orderContact}}</td>
            <td>联系电话：</td>
            <td>{{info.orderPhone}}</td>
          </tr>
          <tr>
            <td>发布人：</td>
            <td>{{info.createUserName}}（{{info.createType === 'C' ? '企业' : '平台'}}）</td>
            <td>所属：</td>
            <td>{{info.companyName}}</td>
          </tr>
          <!--<tr>-->
            <!--<td>支付金额：</td>-->
            <!--<td>{{info.prepayAmount|currency('', 2)}}元</td>-->
          <!--</tr>-->
          <tr>
            <td>详情：<br><el-button size="mini" @click="onDescriptionSave">修改</el-button></td>
            <td>
              <el-input v-model="info.description" type="textarea" rows="4"/>
            </td>
            <td>备注：<br><el-button size="mini" @click="onRemarkSave">保存</el-button></td>
            <td>
              <el-input v-model="info.orderRemark" type="textarea" rows="4"/>
            </td>
          </tr>
        </table>
      </div>
    </el-card>
    <el-card class="box-card" v-for="(item, $index) in daysSubOrderList" :key="item.orderSubId">
      <el-row style="margin: 5px 0">
        <el-col :span="12" class="sub-order-list-title">
          <div>日期：{{daysSubOrderTitleInfoList[$index].showTime}} <o-tag background="#00a8ff" v-if="daysSubOrderTitleInfoList[$index].isTrain === 'Y'">训</o-tag></div>
          <div>单号：{{daysSubOrderTitleInfoList[$index].orderNo}} 工资：{{daysSubOrderTitleInfoList[$index].salary || 0 | currency('', 2)}}元/人 ，合计支付：{{daysSubOrderTitleInfoList[$index].sumSalary || 0 | currency('', 2)}}元</div>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-checkbox v-model="daysSubOrderForm[$index].showAll" :false-label="0" :true-label="1" style="margin-right: 10px" @change="(i) => { onListCheckedChange(i, $index) }">显示所有子订单</el-checkbox>
          <el-button type="text" @click="showEventDialog(daysSubOrderForm[$index].orderId, $index)">批量添加事件</el-button>
          <el-button type="text" @click="showCancelAllDialog(daysSubOrderForm[$index].orderId, 1)">取消该日全部订单</el-button>
          <el-button type="text" @click="showExportDialog(daysSubOrderForm[$index].orderId)">导出兼职清单</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="item"
        :border="true"
        :highlight-current-row="true"
        v-loading="daysSubOrderForm[$index].loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;margin-top: 10px;">
        <el-table-column prop="orderSubNo" label="子订单编号" width="180">
          <template slot-scope="scope">
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
            <o-tag v-if="scope.row.applyType && (scope.row.applyType === 'C' || scope.row.applyType === 'P')" background="#e6a23c">派</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 2" background="#4cbb15">事</o-tag>
            <o-tag v-if="scope.row.hasEvent && scope.row.hasEvent === 1" background="#909399">事</o-tag>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="抢单人" width="120">
          <template slot-scope="scope">
            <div>
              <a :href="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">
                {{scope.row.workerName}}
              </a></div>
            <div v-if="scope.row.workerName">{{showSex(scope.row.workerSex || 'D')}},{{scope.row.workerMobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="showApplyTime" label="抢单时间" width="140" :formatter="(res) => {return res.showApplyTime && res.showApplyTime.indexOf('0001') === -1 ? res.showApplyTime : ''}"/>
        <el-table-column prop="reportTypeText" label="上班状态" width="100"/>
        <el-table-column prop="showClockOnTime" label="上班时间地点" min-width="200">
          <template slot-scope="scope">
            <div>{{scope.row.showClockOnTime && scope.row.showClockOnTime.indexOf('0001') === -1 ? scope.row.showClockOnTime : ''}}</div>
            <div>{{scope.row.clockOnAddress || ''}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="showClockOffTime" label="下班时间地点" min-width="200">
          <template slot-scope="scope">
            <div>{{scope.row.showClockOffTime && scope.row.showClockOnTime.indexOf('0001') === -1 ? scope.row.showClockOnTime : ''}}</div>
            <div>{{scope.row.clockOffAddress}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="subStatusText" label="状态" width="100"/>
        <el-table-column prop="cityName" label="操作" width="120">
          <template slot-scope="scope">
            <order-assign-dialog
              :order-sub-id="scope.row.orderSubId"
              :order-id="orderId"
              btn-type="primary"
              btn-size="mini"
              @success="queryAllDaySubOrderList"
              v-if="info.orderStatus === 1 && (!scope.row.workerUserId || scope.row.workerUserId === '') && scope.row.overType !== 'S5' && scope.row.overType !== 'S6' && scope.row.overType !== 'S7'">
              指派</order-assign-dialog>
            <el-button
              size="mini"
              type="danger"
              v-show="scope.row.workerUserId && scope.row.overType !== 'S5' && scope.row.overType !== 'S6' && scope.row.overType !== 'S7'"
              @click="showCancelDialog(scope, $index)">取消兼职工作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="daysSubOrderForm[$index].pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="daysSubOrderTitleInfoList[$index].totalCount"
          @size-change="(size) => onPageSizeChange(size, $index)"
          @current-change="(index) => onPageIndexChange(index, $index)">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="增加名额"
      :visible.sync="dialogAddNumDisplay"
      :close-on-click-modal="false"
      width="400px"
      custom-class="dialogAddNumDisplay"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center>
      <el-form ref="addNumForm" :model="addNumForm" size="small" label-width="70px">
        <el-form-item label="人数">
          <el-input v-model="addNumForm.plusNum" placeholder="新增人数" style="width: 270px;"/>
        </el-form-item>
        <el-form-item label="金额">
          <span class="dialogAddNumDisplay_salary">{{addNumSalary|currency('', 2)}} 元</span>
        </el-form-item>
        <el-form-item style="margin-top: 25px;text-align: center" label-width="0px">
          <el-button size="medium" style="margin-right: 10px" @click="dialogAddNumDisplay = false">取消</el-button>
          <el-button size="medium" type="primary" style="margin-left: 10px" @click="onAddNumSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="减少名额"
      :visible.sync="dialogDelNumDisplay"
      :close-on-click-modal="false"
      width="400px"
      custom-class="dialogDelNumDisplay"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center>
      <el-form ref="delNumForm" :model="delNumForm" size="small" label-width="70px">
        <el-form-item label="人数">
          <el-input v-model="delNumForm.minusNum" placeholder="减少人数" style="width: 270px;"/>
        </el-form-item>
        <el-form-item style="margin-top: 25px;text-align: center" label-width="0px">
          <el-button size="medium" style="margin-right: 10px" @click="dialogDelNumDisplay = false">取消</el-button>
          <el-button size="medium" type="primary" style="margin-left: 10px" @click="onDelNumSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="请选择导出兼职人员清单选项"
      :visible.sync="dialogExportDisplay"
      :close-on-click-modal="false"
      width="600px"
      custom-class="dialogExportDisplay"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center>
      <el-row>
        <el-col :span="8" style="text-align: center">
          <el-checkbox v-model="exportForm.hasId" true-label="Y" false-label="N" style="width: 150px">包含身份证号</el-checkbox>
        </el-col>
        <el-col :span="8" style="text-align: center">
          <el-checkbox v-model="exportForm.hasPhoto" true-label="Y" false-label="N" style="width: 150px">包含照片</el-checkbox>
        </el-col>
        <el-col :span="8" style="text-align: center">
          <el-checkbox v-model="exportForm.hasMobile" true-label="Y" false-label="N" style="width: 150px">包含手机号码</el-checkbox>
        </el-col>
      </el-row>
      <div style="padding: 35px 0 0 0;text-align: center;">
        <el-button size="medium" style="margin-right: 10px" @click="dialogExportDisplay = false">取消</el-button>
        <el-button size="medium" type="primary" style="margin-left: 10px" @click="onExport">导出</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      title="批量添加事件"
      modal-append-to-body
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="dialogBatchEventsDisplay"
      width="550px"
      custom-class="order-event-dialog"
      center>
      <el-form ref="batchEventsForm" :model="batchEventsForm" :rules="batchEventRules" size="small" label-width="100px">
        <el-form-item label="事件内容：" prop="eventContent">
          <el-input v-model.trim="batchEventsForm.eventContent" placeholder="请填写事件内容" type="textarea" :rows="4"/>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="margin-top: 25px;text-align: center">
        <el-button size="small" @click="dialogBatchEventsDisplay = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onHandleEvent">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="cancelOrderForm.isToday ? '取消该日全部订单' : '取消全部订单'"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      :visible.sync="dialogCancelOrderDisplay"
      :close-on-click-modal="false"
      width="550px"
      custom-class="dialogCancelOrderDisplay"
      center>
      <div style="margin: -15px 0 10px 0;color: red;font-size: 15px;">提示：该操作会导致取消所有的已接单兼职的工作，并关闭该订单。{{cancelOrderForm.isToday ? '若订单是连续订单，将从连续订单中移除该日。' : ''}}</div>
      <el-form ref="cancelOrderForm" :model="cancelOrderForm" :rules="cancelOrderRules" size="small" label-width="80px">
        <el-form-item label="取消类型" prop="cancelType">
          <el-radio v-model="cancelOrderForm.cancelType" label="P">平台取消</el-radio>
          <el-radio v-model="cancelOrderForm.cancelType" label="C">B端取消</el-radio>
        </el-form-item>
        <el-form-item label="取消理由" prop="cancelReason">
          <el-input type="textarea" :rows="3" placeholder="取消理由" v-model="cancelOrderForm.cancelReason">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top: 25px;text-align: center" label-width="0px">
          <el-button size="medium" style="margin-right: 10px" @click="dialogCancelOrderDisplay = false">取消</el-button>
          <el-button size="medium" type="primary" style="margin-left: 10px" @click="onHandleCancel">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <CancelGrabOrderDialog :is-continue="!!info.continuityOrderId" :params="cancelForm" ref="cancelGrabOrderDialog" @success="onCancelSuccess(cancelIndex)" @error="onCancelError"/>
  </x-page>
</template>

<script>
import CancelGrabOrderDialog from '../../components/CancelGrabOrderDialog'
import OrderAssignDialog from '../../components/OrderAssignDialog'
import OTag from '../../components/OTag'
export default {
  name: 'detail',
  components: {CancelGrabOrderDialog, OrderAssignDialog, OTag},
  data(){
    return {
      orderId: 0,
      info: {},
      totalCount: 0,
      subOrderList: [],
      subOrderForm: {
        orderId: 0,
        pageIndex: 1,
        pageSize: 20
      },
      daysSubOrderList: [],
      daysSubOrderTitleInfoList: [],
      daysSubOrderForm: [],
      loading: false,
      dialogAddNumDisplay: false,
      addNumSalary: '0',
      addNumForm: {
        orderId: '',
        plusNum: ''
      },
      dialogDelNumDisplay: false,
      delNumForm: {
        orderId: '',
        minusNum: ''
      },
      addNumTimer: null,
      dialogExportDisplay: false,
      exportForm: {
        hasId: 'Y', // 有无身份证
        hasPhoto: 'Y', // 有无照片
        hasMobile: 'Y' // 有无手机号
      },
      cancelIndex: 0,
      cancelForm: {
        workerUserId: '',
        workerName: '',
        orderSubId: '',
        orderSubNo: '',
        overType: '',
        cancelReason: ''
      },
      dialogBatchEventsDisplay: false,
      batchEventsForm: {
        orderId: '',
        eventContent: ''
      },
      batchEventRules: {
        eventContent: [
          { required: true, message: '请填写事件内容', trigger: 'change' }
        ]
      },
      dialogCancelOrderDisplay: false,
      cancelOrderForm: {
        orderId: 0,
        cancelReason: '',
        // 取消类型(P平台,C企业)
        cancelType: '',
        // 是否该日(0不是,1是)
        isToday: 0
      },
      cancelOrderRules: {
        cancelType: [
          { required: true, message: '请选择取消类型', trigger: 'change' }
        ],
        cancelReason: [
          { required: true, message: '请填写取消原因', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'addNumForm.plusNum': {
      handler: function (val) {
        if (!val || val === '') {
          return
        }
        if (this.addNumTimer){
          clearTimeout(this.addNumTimer)
          this.addNumTimer = null
        }
        this.addNumTimer = setTimeout(() => {
          this.queryAddNumSalary()
        }, 500)
      },
      deep: true
    },
    dialogAddNumDisplay(val){
      if (val) {
        this.addNumSalary = '0'
        this.addNumForm.plusNum = ''
      }
    },
    dialogDelNumDisplay(val){
      if (val) {
        this.delNumForm.minusNum = ''
      }
    }
  },
  computed: {
    showWorkDates(){
      let dates = []
      const beginDate = this.$utils.dateFormat(this.info.showBeginTime, 'yyyy-MM-dd')
      if (this.info.continuityOrderId && this.info.continuityDates && this.info.continuityDates.length > 0){
        this.info.continuityDates.forEach((item) => {
          let date = this.$utils.dateFormat(item, 'yyyy-MM-dd')
          if (beginDate === date){
            dates.push(`<span style="color: red">${date}</span>`)
          } else {
            dates.push(date)
          }
        })
      } else {
        dates = [beginDate]
      }
      return dates.join(',')
    },
    showAge(){
      if (this.info.beginAge === 0 && this.info.endAge === 0){
        return '不限'
      } else {
        return `${this.info.beginAge || 16}-${this.info.endAge || 70}岁`
      }
    },
    showHeight(){
      let height = ''
      if (this.info && (this.info.beginHeight || this.info.endHeight)) {
        if (!this.info.beginHeight || this.info.beginHeight === 0) {
          height = `${this.info.endHeight}cm以下`
        } else if (!this.info.endHeight || this.info.endHeight === 0){
          height = `${this.info.beginHeight}cm以上`
        } else {
          height = `${this.info.beginHeight}-${this.info.endHeight}cm`
        }
      } else {
        height = '不限'
      }
      return height
    },
    showWeight(){
      let weight = ''
      if (this.info && (this.info.beginWeight || this.info.endWeight)) {
        if (!this.info.beginWeight || this.info.beginWeight === 0) {
          weight = `${this.info.endWeight}kg以下`
        } else if (!this.info.endWeight || this.info.endWeight === 0){
          weight = `${this.info.beginWeight}kg以上`
        } else {
          weight = `${this.info.beginWeight}-${this.info.endWeight}kg`
        }
      } else {
        weight = '不限'
      }
      return weight
    }
  },
  methods: {
    showSex(sex){
      const sexs = {
        'N': '不限',
        'M': '男',
        'F': '女',
        'D': ''
      }
      return sexs[sex || 'N']
    },
    async queryOrderDetails(){
      const loading = this.$loading({
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      try {
        this.daysSubOrderList = []
        this.info = await this.$$main.orderQueryDetailMain({
          orderId: this.orderId
        })
        this.daysSubOrderForm = []
        const params = {
          pageIndex: 1,
          pageSize: 10,
          showAll: 0,
          loading: false
        }
        if (this.info.continuityOrderIds) {
          this.info.continuityOrderIds.forEach((item) => {
            this.daysSubOrderForm.push({
              orderId: item,
              ...params
            })
          })
        } else {
          this.daysSubOrderForm.push({
            orderId: this.info.orderId,
            ...params
          })
        }
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onPageIndexChange(index, i){
      this.daysSubOrderForm[i].pageIndex = index
      this.querySingleDaySubOrderList(this.daysSubOrderForm[i], i)
    },
    onPageSizeChange(size, i){
      this.daysSubOrderForm[i].pageSize = size
      this.querySingleDaySubOrderList(this.daysSubOrderForm[i], i)
    },
    onListCheckedChange(val, i){
      this.querySingleDaySubOrderList(this.daysSubOrderForm[i], i)
    },
    async querySingleDaySubOrderList(form, i){
      try {
        form.loading = true
        const data = await this.$$main.orderQueryDetailMainListSub(form)
        let info = (data.funcResult && data.funcResult.length > 0 && data.funcResult[0].value) || {}
        info.totalCount = data.totalCount || 0
        info.showTime = `${this.$utils.dateFormat(info.beginTime, 'yyyy-MM-dd hh:mm')}~${this.$utils.dateFormat(info.endTime, 'hh:mm')} 星期${this.$utils.dateFormat(info.beginTime, 'www')}`
        if (typeof i === 'number') {
          this.daysSubOrderList[i] = data.datas
          this.daysSubOrderTitleInfoList[i] = info || {}
        } else {
          this.daysSubOrderList.push(data.datas)
          this.daysSubOrderTitleInfoList.push(info || {})
        }
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        form.loading = false
      }
    },
    async queryAllDaySubOrderList() {
      this.daysSubOrderList = []
      this.daysSubOrderTitleInfoList = []
      for (let i = 0; i < this.daysSubOrderForm.length; i++) {
        await this.querySingleDaySubOrderList(this.daysSubOrderForm[i])
      }
    },
    showCancelAllDialog(orderId, isToday){
      this.cancelOrderForm = {
        orderId: orderId,
        cancelReason: '',
        cancelType: '',
        isToday: isToday
      }
      this.dialogCancelOrderDisplay = true
      this.$nextTick(() => {
        this.$refs['cancelOrderForm'].clearValidate()
      })
    },
    onHandleCancel(){
      this.$refs['cancelOrderForm'].validate((valid) => {
        if (valid) {
          this.doCancelOrder()
        }
      })
    },
    async doCancelOrder(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoCancelMain(this.cancelOrderForm)
        this.dialogCancelOrderDisplay = false
        this.$message({
          message: '订单已取消',
          type: 'success'
        })
        await this.queryOrderDetails()
        await this.queryAllDaySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onHandleCancelContinuity(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoCancelContinuity({
          orderId: this.orderId
        })
        this.$message({
          message: '订单连续已取消',
          type: 'success'
        })
        this.queryOrderDetails()
        this.queryAllDaySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    showCancelDialog(scope, i){
      this.cancelForm = {
        workerUserId: scope.row.workerUserId || '',
        workerName: scope.row.workerName || '',
        orderSubId: scope.row.orderSubId || '',
        orderSubNo: scope.row.orderSubNo || '',
        overType: '',
        cancelReason: ''
      }
      this.cancelIndex = i
      this.$nextTick(() => {
        this.$refs['cancelGrabOrderDialog'].show()
      })
    },
    onCancelSuccess(i){
      this.querySingleDaySubOrderList(this.daysSubOrderForm[i], i)
    },
    onCancelError(e){
      e.message && this.$message.error(e.message)
    },
    onCancelContinuityClick(){
      this.$confirm(`确定取消连续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onHandleCancelContinuity()
      })
    },
    async onRemarkSave(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoRemark({
          orderId: this.orderId,
          remark: this.info.orderRemark
        })
        await this.queryOrderDetails()
        await this.queryAllDaySubOrderList()
        this.$message.success('保存成功')
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onDescriptionSave(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoModify({
          orderId: this.orderId,
          newDescription: this.info.description
        })
        await this.queryOrderDetails()
        await this.queryAllDaySubOrderList()
        this.$message.success('保存成功')
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async queryAddNumSalary(){
      const loading = this.$loading({
        text: '',
        spinner: 'el-icon-loading',
        target: '.dialogAddNumDisplay_salary'
      })
      try {
        let data = await this.$$main.orderQueryPlusSalary({
          orderId: this.orderId,
          plusNum: this.addNumForm.plusNum
        })
        this.addNumSalary = data.needAmount || 0
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onAddNumSubmit(){
      this.addNumForm.orderId = this.orderId
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: '.dialogAddNumDisplay'
      })
      try {
        await this.$$main.orderDoPlus(this.addNumForm)
        this.$message.success('名额添加成功')
        this.dialogAddNumDisplay = false
        await this.queryOrderDetails()
        await this.queryAllDaySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async onDelNumSubmit(){
      this.delNumForm.orderId = this.orderId
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: '.dialogDelNumDisplay'
      })
      try {
        await this.$$main.orderDoMinus(this.delNumForm)
        this.$message.success('减少名额成功')
        this.dialogDelNumDisplay = false
        await this.queryOrderDetails()
        await this.queryAllDaySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    showExportDialog(orderId){
      this.exportForm = {
        orderId: orderId,
        hasId: 'Y', // 有无身份证
        hasPhoto: 'Y', // 有无照片
        hasMobile: 'Y' // 有无手机号
      }
      this.dialogExportDisplay = true
    },
    async onExport(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading',
        target: '.dialogExportDisplay'
      })
      try {
        let data = await this.$$main.orderDoSubPdf(this.exportForm)
        window.open(data.dlUrl)
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    showEventDialog(orderId, index){
      this.batchEventsForm = {
        orderId: orderId,
        eventContent: ''
      }
      this.cancelIndex = index
      this.dialogBatchEventsDisplay = true
      this.$nextTick(() => {
        this.$refs['batchEventsForm'].clearValidate()
      })
    },
    onHandleEvent(){
      this.$refs['batchEventsForm'].validate((valid) => {
        if (valid) {
          this.doSaveEvent()
        }
      })
    },
    async doSaveEvent(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoEventCreateMain(this.batchEventsForm)
        this.$message({
          message: '事件添加成功',
          type: 'success'
        })
        // this.queryOrderDetails()
        // this.queryAllDaySubOrderList()
        this.onCancelSuccess(this.cancelIndex)
        this.dialogBatchEventsDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    }
  },
  async mounted(){
    this.orderId = (this.$route.query && this.$route.query.orderid) || 0
    this.subOrderForm.orderId = (this.$route.query && this.$route.query.orderid) || 0
    await this.queryOrderDetails()
    await this.queryAllDaySubOrderList()
  }
}
</script>
