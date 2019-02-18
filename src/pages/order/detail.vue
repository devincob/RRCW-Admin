<template>
  <x-page breadcrumb="auto" title="主订单详情">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>主订单详情</span>
        <el-button v-if="info.continuityDates && info.continuityDates.length > 0" type="text" style="float: right; padding: 3px 5px;" @click="onCancelContinuityClick">取消连续</el-button>
        <el-button v-if="info.orderStatus === 1" style="float: right; padding: 3px 5px" type="text" @click="onCancelClick">取消整张订单</el-button>
        <el-button style="float: right; padding: 3px 5px" type="text" @click="dialogExportDisplay = true">导出兼职清单</el-button>
        <el-button style="float: right; padding: 3px 5px" type="text" @click="dialogAddNumDisplay = true">增加名额</el-button>
        <a :href="'/working-status-h5?orderId=' + info.orderId" class="el-button el-button--text" style="float: right; padding: 3px 5px;text-decoration: none;" target="_blank">
          <span>查看兼职上班状态</span>
        </a>
      </div>
      <div>
        <table class="detail-table">
          <tr>
            <td>订单ID：</td>
            <td>{{info.orderId}}</td>
            <td>订单编号：</td>
            <td>{{info.orderNo}}
               <o-tag v-if="info.continuityOrderId" background="#ff6600">连</o-tag>
              <o-tag v-if="info.isTrain === 'Y'" background="#00a8ff">训</o-tag>
              <o-tag v-if="info.overPay && info.overPay === 'Y'" background="#f56c6c">完</o-tag>
              <o-tag v-else background="#ffd034">日</o-tag>
              <o-tag v-if="info.hasEating && info.hasEating === 'Y'" background="#409eff">饭</o-tag>
            </td>
          </tr>
          <tr>
            <td>发布时间：</td>
            <td>{{info.showCreateTime}}</td>
            <td>订单标题：</td>
            <td>
              {{info.orderTitle}}
            </td>
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
            <td>工资：</td>
            <td>{{info.singleSalary|currency('', 2)}}元 / 天</td>
            <td>城市：</td>
            <td>{{info.cityName}}</td>
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
            <td>人数：</td>
            <td>{{info.originalWorkerNum}}/{{info.workerNum}}/{{info.applyWorkerNum}}</td>
            <td>联系人：</td>
            <td>{{info.orderContact}}</td>
          </tr>
          <tr>
            <td>联系电话：</td>
            <td>{{info.orderPhone}}</td>
            <td>发布人：</td>
            <td>{{info.createUserName}}（{{info.createType === 'C' ? '企业' : '平台'}}）</td>
          </tr>
          <tr>
            <td>支付金额：</td>
            <td>{{info.prepayAmount|currency('', 2)}}元</td>
            <td>所属：</td>
            <td>{{info.companyName}}</td>
          </tr>
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
      <el-table
        :data="subOrderList"
        :border="true"
        :highlight-current-row="true"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        size="mini"
        style="width: 100%;margin-top: 25px;">
        <el-table-column prop="orderSubNo" label="子订单编号" min-width="180">
          <template slot-scope="scope">
            <a :href="`/order/suborder-detail?ordersubid=${scope.row.orderSubId}`" target="_blank">
              {{scope.row.orderSubNo}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="抢单人" min-width="120">
          <template slot-scope="scope">
            <div>
              <a :href="`/user/worker-detail?uid=${scope.row.workerUserId}`" target="_blank">
              {{scope.row.workerName}}
            </a></div>
            <div v-if="scope.row.workerName">{{showSex(scope.row.workerSex || 'D')}},{{scope.row.workerMobile}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="workerSex" label="性别" min-width="80" :formatter="(res) => {return showSex(res.workerSex || 'D')}"/> -->
        <!-- <el-table-column prop="workerMobile" label="联系方式" min-width="150"/> -->
        <el-table-column prop="showApplyTime" label="抢单时间" min-width="140" :formatter="(res) => {return res.showApplyTime && res.showApplyTime.indexOf('0001') === -1 ? res.showApplyTime : ''}"/>
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
        <el-table-column prop="timeStatus" label="状态" min-width="60" :formatter="statesFormat"/>
        <el-table-column prop="cityName" label="操作" min-width="150">
          <template slot-scope="scope">
            <order-assign-dialog
              :order-sub-id="scope.row.orderSubId"
              :order-id="orderId"
              btn-type="primary"
              btn-size="mini"
              @success="querySubOrderList"
              v-if="info.orderStatus === 1 && (!scope.row.workerUserId || scope.row.workerUserId === '') && scope.row.overType !== 'S5' && scope.row.overType !== 'S6' && scope.row.overType !== 'S7'">
              指派</order-assign-dialog>
            <el-button
              size="mini"
              type="danger"
              v-show="scope.row.overType !== 'S5' && scope.row.overType !== 'S6' && scope.row.overType !== 'S7'"
              @click="showCancelDialog(scope)">{{scope.row.workerUserId ? '取消兼职工作' : '取消名额'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination
          class="mt-sm"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="subOrderForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="(size) => subOrderForm.pageSize = size"
          @current-change="(index) => subOrderForm.pageIndex = index">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="增加名额"
      :visible.sync="dialogAddNumDisplay"
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
      title="请选择导出兼职人员清单选项"
      :visible.sync="dialogExportDisplay"
      width="600px"
      custom-class="dialogExportDisplay"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center>
      <div style="width: 100%">
        <el-checkbox v-model="exportForm.hasId" true-label="Y" false-label="N" style="width: 150px">包含身份证号</el-checkbox>
        <el-checkbox v-model="exportForm.hasPhoto" true-label="Y" false-label="N" style="width: 150px">包含照片</el-checkbox>
        <el-checkbox v-model="exportForm.hasMobile" true-label="Y" false-label="N" style="width: 150px">包含手机号码</el-checkbox>
      </div>
      <div style="padding: 35px 0 0 0;text-align: center;">
        <el-button size="medium" style="margin-right: 10px" @click="dialogExportDisplay = false">取消</el-button>
        <el-button size="medium" type="primary" style="margin-left: 10px" @click="onExport">导出</el-button>
      </div>
    </el-dialog>
    <CancelGrabOrderDialog :params="cancelForm" ref="cancelGrabOrderDialog" @success="onCancelSuccess" @error="onCancelError"/>
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
      loading: false,
      dialogAddNumDisplay: false,
      addNumSalary: '0',
      addNumForm: {
        orderId: '',
        plusNum: ''
      },
      addNumTimer: null,
      dialogExportDisplay: false,
      exportForm: {
        orderId: '',
        hasId: 'Y', // 有无身份证
        hasPhoto: 'Y', // 有无照片
        hasMobile: 'Y' // 有无手机号
      },
      cancelForm: {
        workerUserId: '',
        workerName: '',
        orderSubId: '',
        orderSubNo: '',
        overType: '',
        cancelReason: ''
      }
    }
  },
  watch: {
    'subOrderForm.pageIndex': {
      handler: function(){
        this.querySubOrderList()
      },
      deep: true
    },
    'subOrderForm.pageSize': {
      handler: function () {
        this.querySubOrderList()
      },
      deep: true
    },
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
    dialogExportDisplay(val){
      if (val) {
        this.exportForm = {
          orderId: this.orderId,
          hasId: 'Y', // 有无身份证
          hasPhoto: 'Y', // 有无照片
          hasMobile: 'Y' // 有无手机号
        }
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
    statesFormat(row){
      let arr = {
        'S1': '正常',
        'S2': '正常',
        'S3': '正常',
        'S4': '正常',
        'S5': '平台取消',
        'S6': 'B端取消',
        'S7': 'C端取消'
      }
      return arr[row.overType || 'S1']
    },
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
        this.info = await this.$$main.orderQueryDetailMain({
          orderId: this.orderId
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async querySubOrderList() {
      try {
        this.loading = true
        const data = await this.$$main.orderQueryDetailMainListSub(this.subOrderForm)
        this.totalCount = data.totalCount
        this.subOrderList = data.datas
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async onHandleCancel(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderDoCancelMain({
          orderId: this.orderId
        })
        this.$message({
          message: '订单已取消',
          type: 'success'
        })
        this.queryOrderDetails()
        this.querySubOrderList()
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
        this.querySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onCancelClick(){
      this.$confirm(`确定取消当前订单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onHandleCancel()
      })
    },
    showCancelDialog(scope){
      this.cancelForm = {
        workerUserId: scope.row.workerUserId || '',
        workerName: scope.row.workerName || '',
        orderSubId: scope.row.orderSubId || '',
        orderSubNo: scope.row.orderSubNo || '',
        overType: '',
        cancelReason: ''
      }
      this.$nextTick(() => {
        this.$refs['cancelGrabOrderDialog'].show()
      })
    },
    onCancelSuccess(){
      this.querySubOrderList()
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
        this.queryOrderDetails()
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
        this.queryOrderDetails()
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
        this.queryOrderDetails()
        this.querySubOrderList()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
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
    }
  },
  mounted(){
    this.orderId = (this.$route.query && this.$route.query.orderid) || 0
    this.subOrderForm.orderId = (this.$route.query && this.$route.query.orderid) || 0
    this.queryOrderDetails()
    this.querySubOrderList()
  }
}
</script>
