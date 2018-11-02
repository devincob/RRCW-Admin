<template>
  <x-page breadcrumb="auto" title="开票订单详情">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="13">
        <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;" @click="orderLogListDialogDisplay = true">查看操作记录</el-button>
        <a v-if="info.orderInfo && info.orderInfo.workflowId >= 2000" :href="`${$config.getImageUrlPath()}/file/Payment_bill_${info.orderInfo.orderNo}.pdf`" target="_blank">
          <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;">下载付款单</el-button>
        </a>
        <!--<a v-if="info.orderInfo && info.orderInfo.workflowId > 2110" :href="`${$config.getImageUrlPath()}/file/Supplier_Order_${info.orderInfo.orderNo}.pdf`" target="_blank">-->
          <!--<el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;">下载供应商下单表</el-button>-->
        <!--</a>-->
        <a v-if="info.orderInfo && info.orderInfo.workflowId > 2110" :href="`${$config.getImageUrlPath()}/file/Supplier_Order_${info.orderInfo.orderNo}.xls`" target="_blank">
          <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;">下载供应商下单表</el-button>
        </a>
        <span style="color: red;margin-left: 10px;" v-if="info && info.status">订单状态 ：{{info.status || '-'}}， 待处理人 ：{{info.handleAdminRoleName || '-'}} {{info.handleAdminUserName || '-'}}。</span>
      </el-col>
      <el-col :span="11" v-if="info.isShowButton" class="header-buttons">
        <div v-if="[2000, 2010, 2020, 2030].indexOf(info.orderInfo.workflowId) !== -1">
          <el-button type="primary" size="mini" @click="displayNextDialog('审批通过')">审批通过</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="[2040, 2050].indexOf(info.orderInfo.workflowId) !== -1">
          <el-button type="primary" size="mini" @click="displayNextDialog('审核通过')">审核通过</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2060">
          <el-button type="primary" size="mini" @click="displayNextDialog('通知客服向客户确认信息')">确认无误，通知客服向客户确认信息</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2080">
          <el-button type="primary" size="mini" @click="displayNextDialog()">已确认，提交订单</el-button>
          <el-button size="mini" @click="displayRejectDialog('暂未确认', 'wait')">暂未确认</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2090">
          <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
          <el-button size="mini" @click="bankReceiptDialogDisplay = true">录入收款信息</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2100">
          <el-button type="primary" size="mini" @click="displayNextDialog()">所有材料已审核完毕，提交订单</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2110">
          <el-button type="primary" size="mini" @click="displayNextDialog('交付供应商')">交付供应商</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2120">
          <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
          <el-button size="mini" @click="invoiceDialogDisplay = true">录入发票信息</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2130">
          <el-button type="primary" size="mini" @click="displayNextDialog()">已确认客户收到发票，通知客服回访</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
        <div v-if="info.orderInfo.workflowId === 2140">
          <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
          <el-button size="mini" @click="customerServiceRecordDialogDisplay = true">录入回访结果</el-button>
          <el-button size="mini" @click="displayRejectDialog('暂无结果', 'wait')">暂无结果</el-button>
          <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
          <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 2130">
      <div slot="header" class="clearfix">
        <span>回访结果</span>
      </div>
      <table>
        <tr>
          <td>客户满意度</td>
          <td>
            <div v-if="info.customerServiceRecord && info.customerServiceRecord.evalValue" style="display: flex">
              <el-rate
                style="margin-top: 5px;"
                v-model="customerServiceRecordForm.displayEval"
                disabled
                text-color="#ff9900">
              </el-rate>
              {{info.customerServiceRecord.evalValue}}分
            </div>
            <span v-else>-</span>
          </td>
          <td>客户反馈</td>
          <td>{{info.customerServiceRecord && info.customerServiceRecord.feedback || '-'}}</td>
        </tr>
      </table>
    </el-card>
    <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 2110">
      <div slot="header" class="clearfix">
        <span>发票信息</span>
      </div>
      <table>
        <tr>
          <td>快递回单截图</td>
          <td>
            <el-button size="mini" type="text" v-if="info.invoiceInfo && info.invoiceInfo.expressImgUrl" @click="displayImage(info.invoiceInfo.expressImgUrl)">预览</el-button>
            <span v-else>-</span>
          </td>
          <td>发票照片</td>
          <td>
            <el-button size="mini" type="text" v-if="info.invoiceInfo && info.invoiceInfo.invoiceImgUrl" @click="displayImage(info.invoiceInfo.invoiceImgUrl)">预览</el-button>
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td>快递单号</td>
          <td>{{info.invoiceInfo && info.invoiceInfo.expressNo || '-'}}</td>
          <td>快递公司</td>
          <td>{{info.invoiceInfo && info.invoiceInfo.expressName || '-'}}</td>
        </tr>
        <template v-if="info.invoiceInfo && info.invoiceInfo.invoiceDetails">
          <tr v-for="(item, $index) in info.invoiceInfo.invoiceDetails" :key="$index">
            <td>发票号</td>
            <td>{{item.invoiceNo}}</td>
            <td>开票金额</td>
            <td>{{item.invoiceAmount}}元</td>
          </tr>
        </template>
      </table>
    </el-card>
    <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 2080">
      <div slot="header" class="clearfix">
        <span>财务收款信息</span>
      </div>
      <div v-for="(item, index) in (info.bankReceipts || 1)" :key="index">
        <br v-if="index > 0">
        <table>
          <tr>
            <td>收款方式</td>
            <td>{{bankTypes[item.bankType || 'N']}}</td>
            <td>流水号</td>
            <td>{{item.bankBillNo || '-'}}</td>
          </tr>
          <tr>
            <td>收款时间</td>
            <td>{{item.showInDate || '-'}}</td>
            <td>收款金额</td>
            <td>{{item.inAmount | currency('', 2) || '-'}}元</td>
          </tr>
          <tr>
            <td>回单截图</td>
            <td>
              <el-button size="mini" type="text" v-if="item.billImgUrl" @click="displayImage(item.billImgUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </el-card>
    <el-card class="box-card" style="padding-bottom: 20px;" v-if="info.orderInfo">
      <div slot="header" class="clearfix">
        <span>开票订单详情</span>
      </div>
      <table>
        <tr>
          <td>订单号</td>
          <td>{{info.orderInfo.orderNo || '-'}}</td>
          <td>客户</td>
          <td>{{info.orderInfo.customerName || '-'}}</td>
        </tr>
        <tr>
          <td>税源地</td>
          <td>{{info.orderInfo.sourceTaxName || '-'}}</td>
          <td>商品</td>
          <td>{{info.orderInfo.goodsName || '-'}}</td>
        </tr>
        <tr>
          <td>站点</td>
          <td>{{info.orderInfo.companyName || '-'}}</td>
          <td>项目</td>
          <td>{{info.orderInfo.invoiceContent || '-'}}</td>
        </tr>
        <tr>
          <td>开票金额</td>
          <td>{{info.orderInfo.invoiceAmount | currency('', 2) || '-'}}元</td>
          <td>发票类型</td>
          <td>{{info.orderInfo.invoiceTypeName || '-'}}</td>
        </tr>
        <tr>
          <td>开票信息-公司名称</td>
          <td>{{info.orderInfo.invoiceCompanyName || '-'}}</td>
          <td>开票信息-公司税号</td>
          <td>{{info.orderInfo.invoiceCompanyTaxNo || '-'}}</td>
        </tr>
        <tr>
          <td>开票信息-公司地址</td>
          <td>{{info.orderInfo.invoiceCompanyAddress || '-'}}</td>
          <td>开票信息-公司电话</td>
          <td>{{info.orderInfo.invoiceCompanyPhone || '-'}}</td>
        </tr>
        <tr>
          <td>开票信息-开户银行</td>
          <td>{{info.orderInfo.invoiceCompanyBankName || '-'}}</td>
          <td>开票信息-银行账号</td>
          <td>{{info.orderInfo.invoiceCompanyBankNo || '-'}}</td>
        </tr>
        <tr>
          <td>发票快递地址</td>
          <td>{{info.orderInfo.invoiceExpressAddress || '-'}}</td>
          <td>开票合同</td>
          <td>
            <el-button size="mini" type="text" v-if="info.orderInfo && info.orderInfo.invoiceContractUrl" @click="displayImage(info.orderInfo.invoiceContractUrl)">预览</el-button>
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td>是否加急</td>
          <td>{{info.orderInfo.isPriority === 'Y' ? '是' : '否'}}</td>
          <td>加急原因</td>
          <td>{{info.orderInfo.priorityReason || '-'}}</td>
        </tr>
        <tr>
          <td>服务费</td>
          <td>{{info.orderInfo.serviceFee | currency('', 2) || '-'}}元</td>
          <td>服务费折扣</td>
          <td>{{info.orderInfo.serviceFeeDiscount || '-'}}</td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td>{{info.orderInfo.showCreateTime || '-'}}</td>
          <td>创建人</td>
          <td>{{info.orderInfo.createAdminUserName || '-'}}</td>
        </tr>
        <tr>
          <td>商务提交时间</td>
          <td>{{info.orderInfo.showSubmitTime || '-'}}</td>
          <td>订单状态</td>
          <td style="color: red">{{info.orderInfo.workflowName || '-'}}</td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="mini-item">
              <p>服务费：<span>+{{info.orderInfo.serviceFee || 0 | currency}}</span></p>
              <p>服务费减免：<span>-{{serviceFeeDisplay | currency}}</span></p>
              <p>合计：<span>{{info.orderInfo.totalAmount || 0 | currency}}</span></p>
            </div>
          </td>
        </tr>
      </table>
    </el-card>
    <!--<el-card class="box-card finish-info">-->
      <!--订单已完成，共耗时30天4小时（2018-05-02~2018-05-20）。-->
    <!--</el-card>-->
    <el-dialog
      title="收款信息"
      :visible.sync="bankReceiptDialogDisplay"
      :close-on-click-modal="false"
      width="800px"
      center>
      <el-form ref="bankReceiptForm" :model="bankReceiptForm" label-width="100px" size="small">
        <div style="border: 1px solid #cecece;padding: 15px 0;margin-bottom: 5px;" v-for="(item, index) in bankReceiptList" :key="index">
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="收款方式" prop="bankNo">
                <el-select v-model="item.bankType" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in bankTypeList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流水号" prop="bankBillNo">
                <el-input v-model="item.bankBillNo" placeholder="流水号"/>
              </el-form-item>
              <el-form-item label="到账时间" prop="inDate">
                <el-date-picker
                  style="width: 100%;"
                  v-model="item.inDate"
                  type="datetime"
                  value-format="yyyy/MM/dd HH:mm:ss"
                  placeholder="到账时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="收款金额" prop="inAmount">
                <el-input v-model="item.inAmount" placeholder="到账金额" style="width: 92%"/> 元
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="上传回单截图" prop="billImgUrl" class="account-upload">
                <div>
                  <el-upload
                    :class="['avatar-uploader', `billImgUrl${item.bankReceiptId}`]"
                    :action="$$main.getUrl('/Common/ImageUpload')"
                    :show-file-list="false"
                    :before-upload="() => {openLoading(`.billImgUrl${item.bankReceiptId}`)}"
                    :on-error="closeLoading"
                    :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (item.billImgUrl = res.body.imageUrl) }">
                    <x-image v-if="item.billImgUrl" :src="item.billImgUrl" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                  </el-upload>
                  <el-button type="text" @click="onPreviewClick(item.billImgUrl)" size="mini" v-if="item.billImgUrl">查看原文件</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" style="text-align: right">
              <el-button size="mini" type="primary" @click="editBankReceipt(item, index)">保存</el-button>
              <el-button size="mini" type="danger" @click="delectBankReceipt(item, index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-top: 15px;">
          <el-col :span="24" style="text-align: center">
            <el-button size="mini" type="text" @click="addBankReceipt"><i class="el-icon-circle-plus-outline"></i>添加收款信息</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      title="发票信息"
      :visible.sync="invoiceDialogDisplay"
      :close-on-click-modal="false"
      width="700px"
      center>
      <el-form ref="invoiceForm" :model="invoiceForm" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上传发票图片" prop="billImgUrl" class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader invoiceImg"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.invoiceImg')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (invoiceForm.invoiceImgUrl = res.body.imageUrl) }">
                  <x-image v-if="invoiceForm.invoiceImgUrl" :src="invoiceForm.invoiceImgUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(invoiceForm.invoiceImgUrl)" size="mini" v-if="invoiceForm.invoiceImgUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递回单截图" prop="billImgUrl" class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader expressImg"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.expressImg')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (invoiceForm.expressImgUrl = res.body.imageUrl) }">
                  <x-image v-if="invoiceForm.expressImgUrl" :src="invoiceForm.expressImgUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(invoiceForm.expressImgUrl)" size="mini" v-if="invoiceForm.expressImgUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="快递单号" prop="expressNo">
              <el-input v-model="invoiceForm.expressNo" placeholder="快递单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递公司" prop="expressName">
              <el-input v-model="invoiceForm.expressName" placeholder="快递公司"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="border-bottom: 1px solid #aaa;margin-bottom: 15px;"></div>
        <el-row v-for="(invoice, $index) in invoiceList" :key="$index">
          <el-col :span="13">
            <el-form-item label="发票号" prop="invoiceNo">
              <el-input v-model.number="invoice.invoiceNo" placeholder="发票号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票金额" prop="expressName">
              <el-input v-model.number="invoice.invoiceAmount" placeholder="开票金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div class="ml">
              <el-button type="text" v-if="$index !== 0" size="small" @click="removeRowInvoice($index)">
                <i class="el-icon-delete" style="font-size: 16px;"></i>
              </el-button>
              <el-button type="text" v-if="$index + 1 === invoiceList.length" size="small" @click="addRowInvoice">
                <i class="el-icon-plus" style="font-size: 16px;"></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="invoiceDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editInvoice">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="客服回访信息"
      :visible.sync="customerServiceRecordDialogDisplay"
      :close-on-click-modal="false"
      width="600px"
      center>
      <el-form ref="customerServiceRecordForm" :model="customerServiceRecordForm" label-width="120px" size="small">
        <el-form-item label="评价等级" prop="bankNo" class="account-upload">
          <el-rate
            style="margin-top: 5px;"
            v-model="customerServiceRecordForm.eval"
            allow-half>
          </el-rate>
          {{customerServiceRecordForm.evalValue}}分
        </el-form-item>
        <el-form-item label="客户反馈" prop="feedback">
          <el-input v-model="customerServiceRecordForm.feedback" placeholder="客户反馈" type="textarea" :autosize="{ minRows: 2, maxRows: 2}"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customerServiceRecordDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editCustomerServiceRecord">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="订单日志"
      :visible.sync="orderLogListDialogDisplay"
      width="900px"
      custom-class="order-log-list-dialog"
      center>
      <el-table
        :data="orderLogList"
        size="mini"
        style="width: 100%;">
        <el-table-column prop="actionUserName" label="姓名" min-width="70"/>
        <el-table-column prop="actionUserRoleName" label="角色" min-width="70"/>
        <el-table-column prop="actionContent" label="操作内容" min-width="200"/>
        <el-table-column prop="actionTime" label="操作时间" min-width="100"/>
      </el-table>
    </el-dialog>
  </x-page>
</template>

<script>
export default {
  name: 'invoice-order-details',
  data() {
    return {
      orderId: '',
      uploadLoading: null,
      info: {},
      orderLogListDialogDisplay: false,
      orderLogList: [],
      bankTypeList: [{
        key: 'B',
        value: '银行'
      }, {
        key: 'A',
        value: '支付宝'
      }, {
        key: 'W',
        value: '微信'
      }],
      bankTypes: {
        B: '银行',
        A: '支付宝',
        W: '微信',
        N: '-'
      },
      bankReceiptDialogDisplay: false,
      bankReceiptList: [],
      bankReceiptForm: {
        bankReceiptId: '', // 银行收款Id
        orderId: '', // 订单Id
        bankName: '', // 收款银行名称
        bankNo: '', // 收款银行账户
        bankType: '',
        bankBillNo: '', // 银行回单号
        inDate: '', // 到账日期
        inAmount: '', // 到账金额
        billImgUrl: '', // 回单图片URL
        orderType: 'I' // 订单类型(A/I)
      },
      bankReceiptRules: [],
      invoiceDialogDisplay: false,
      invoiceForm: {
        orderId: '', // 订单Id
        // invoiceNo: '', // 发票号
        invoiceImgUrl: '', // 发票图片URL
        expressNo: '', // 快递单号
        expressImgUrl: '', // 快递单回单截图URL
        expressName: '' // 快递公司
      },
      invoiceRules: [],
      customerServiceRecordDialogDisplay: false,
      customerServiceRecordForm: {
        orderId: '', // 订单Id
        orderType: 'I',
        displayEval: 0,
        eval: 0,
        evalValue: '', // 评价等级（1-10）
        feedback: '' // 客户反馈
      },
      customerServiceRecordRules: [],
      invoiceList: [{invoiceNo: '', invoiceAmount: 0}]
    }
  },
  watch: {
    orderLogListDialogDisplay(val){
      val && this.queryOrderLogList()
    },
    'customerServiceRecordForm.eval': {
      handler: function(val){
        this.customerServiceRecordForm.evalValue = Number(val || 0) * 2
      },
      deep: true
    }
  },
  computed: {
    serviceFeeDisplay(){
      let serviceFee = this.info.orderInfo.serviceFee || 0
      let serviceFeeDiscount = this.info.orderInfo.serviceFeeDiscount || 0
      return (1 - serviceFeeDiscount) * serviceFee
    }
  },
  methods: {
    async queryOrderLogList(){
      try {
        this.orderLogList = await this.$$main.orderLogList({
          orderId: this.orderId,
          orderType: 'I'
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    async queryOrderInfo(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.info = await this.$$main.orderInvoiceOrderDetail({
          orderId: this.orderId
        })
        this.bankReceiptList = []
        if (this.info.bankReceipts && this.info.bankReceipts.length > 0) {
          this.info.bankReceipts.forEach((item) => {
            this.bankReceiptList.push({
              bankType: item.bankType,
              bankReceiptId: item.bankReceiptId, // 银行收款Id
              orderId: this.orderId, // 订单Id
              bankName: item.bankName, // 收款银行名称
              bankNo: item.bankNo, // 收款银行账户
              bankBillNo: item.bankBillNo, // 银行回单号
              inDate: item.showInDate, // 到账日期
              inAmount: item.inAmount, // 到账金额
              billImgUrl: item.billImgUrl, // 回单图片URL
              orderType: 'I' // 订单类型(A/I)
            })
          })
        } else {
          this.addBankReceipt()
        }
        this.info.invoiceInfo && (this.invoiceForm = JSON.parse(JSON.stringify(this.info.invoiceInfo)))
        if (this.info.invoiceInfo && this.info.invoiceInfo.invoiceDetails) {
          this.invoiceList = this.info.invoiceInfo.invoiceDetails
        }
        this.info.customerServiceRecord && (this.customerServiceRecordForm = {
          orderId: this.orderId, // 订单Id
          orderType: 'I',
          displayEval: (this.info.customerServiceRecord.evalValue && (this.info.customerServiceRecord.evalValue / 2)) || 0,
          eval: (this.info.customerServiceRecord.evalValue && (this.info.customerServiceRecord.evalValue / 2)) || 0,
          evalValue: this.info.customerServiceRecord.evalValue || '', // 评价等级（1-10）
          feedback: this.info.customerServiceRecord.feedback || '' // 客户反馈
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    displayImage(src){
      if (!src || src === '') {
        return
      }
      let urlFormat = src.split('.')
      if (['pdf', 'doc', 'docx'].indexOf(urlFormat[1]) !== -1){
        this.onPreviewClick(src)
        return
      }
      let displaySrc = this.getUploadImageUrl(src, 'middle')
      const h = this.$createElement
      this.$msgbox({
        showConfirmButton: false,
        message: h('div', null, [
          h('el-button', {
            attrs: {
              type: 'text'
            },
            on: {
              click: () => {
                this.onPreviewClick(src)
              }
            }
          }, '查看原文件'),
          h('img', {
            attrs: {
              src: displaySrc
            },
            style: {
              width: '100%'
            }
          })
        ])
      })
    },
    onPreviewClick(src){
      window.open(this.getUploadImageUrl(src, null))
    },
    displayNextDialog(actionName){
      this.$alert(`是否${actionName || '提交订单'}？`, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        callback: action => {
          action === 'confirm' && this.doOrderNext()
        }
      })
    },
    async doOrderNext(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderWorkflowNext({
          orderId: this.orderId,
          orderType: 'I'
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    displayRejectDialog(text = '驳回', type){
      this.$prompt(`请输入${text}原因`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /\S+/,
        inputErrorMessage: `请输入${text}原因`
      }).then(({ value }) => {
        if (type === 'wait'){
          this.doOrderWait(value)
        } else if (type === 'restart'){
          this.doOrderRejectRestart(value)
        } else {
          this.doOrderReject(value)
        }
      })
    },
    async doOrderReject(reason){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderWorkflowReject({
          orderId: this.orderId,
          orderType: 'I',
          rejectReason: reason
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async doOrderWait(reason){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderWorkflowWait({
          orderId: this.orderId,
          orderType: 'I',
          waitReason: reason
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async doOrderRejectRestart(reason){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderWorkflowRejectRestart({
          orderId: this.orderId,
          orderType: 'I',
          rejectReason: reason
        })
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    addBankReceipt(){
      this.bankReceiptList.push({
        bankReceiptId: '', // 银行收款Id
        orderId: this.orderId, // 订单Id
        bankName: '', // 收款银行名称
        bankNo: '', // 收款银行账户
        bankBillNo: '', // 银行回单号
        inDate: '', // 到账日期
        inAmount: '', // 到账金额
        billImgUrl: '', // 回单图片URL
        orderType: 'I' // 订单类型(A/I)
      })
    },
    async editBankReceipt(form, index){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.bankReceiptList[index].bankReceiptId = await this.$$main.orderAOEditBankReceipt(form)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async delectBankReceipt(form, index){
      if (!form.bankReceiptId || form.bankReceiptId === '') {
        this.bankReceiptList.splice(index, 1)
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderAODeleteBankReceipt(form)
        this.bankReceiptList.splice(index, 1)
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.queryOrderInfo()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async editInvoice(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.invoiceForm.orderId = this.orderId
        await this.$$main.orderIOEditInvoice({
          ...this.invoiceForm,
          invoiceDetails: this.invoiceList
        })
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.invoiceDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async editCustomerServiceRecord(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.customerServiceRecordForm.orderId = this.orderId
        await this.$$main.orderEditCustomerServiceRecord(this.customerServiceRecordForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.customerServiceRecordDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    openLoading(target) {
      this.uploadLoading = this.$loading({
        lock: true,
        text: '图片上传中',
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(){
      this.uploadLoading.close()
    },
    addRowInvoice(){
      const last = this.invoiceList[this.invoiceList.length - 1]
      this.invoiceList.push({
        ...last,
        invoiceNo: last.invoiceNo ? Number(last.invoiceNo) + 1 : ''
      })
    },
    removeRowInvoice(index){
      this.invoiceList = this.invoiceList.filter((item, i) => {
        return index !== i
      })
    }
  },
  mounted() {
    this.orderId = (this.$route.query && this.$route.query.orderid) || ''
    this.queryOrderInfo()
  }
}
</script>
