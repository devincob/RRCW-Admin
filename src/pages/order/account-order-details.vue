<template>
  <x-page breadcrumb="auto" title="开户订单详情">
    <div style="width: 100%">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="13">
          <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;" @click="orderLogListDialogDisplay = true">查看操作记录</el-button>
          <a v-if="info.orderInfo && info.orderInfo.workflowId >= 1000" :href="`${$config.getImageUrlPath()}/file/Payment_bill_${info.orderInfo.orderNo}.pdf`" target="_blank">
            <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;">下载付款单</el-button>
          </a>
          <a v-if="info.orderInfo && info.orderInfo.workflowId > 1100" :href="`${$config.getImageUrlPath()}/file/Supplier_Order_${info.orderInfo.orderNo}.pdf`" target="_blank">
            <el-button type="text" size="mini" style="margin-left: 5px;padding-top: 2px;">下载供应商下单表</el-button>
          </a>
          <span style="color: red;margin-left: 10px;" v-if="info && info.status">订单状态 ：{{info.status || '-'}}， 待处理人 ：{{info.handleAdminRoleName || '-'}} {{info.handleAdminUserName || '-'}}。</span>
        </el-col>
        <el-col :span="11" v-if="info.isShowButton" class="header-buttons">
          <div v-if="[1000, 1010, 1020, 1030].indexOf(info.orderInfo.workflowId) !== -1">
            <el-button type="primary" size="mini" @click="displayNextDialog('审批通过')">审批通过</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="[1040, 1050].indexOf(info.orderInfo.workflowId) !== -1">
            <el-button type="primary" size="mini" @click="displayNextDialog('审核通过')">审核通过</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1060">
            <el-button type="primary" size="mini" @click="displayNextDialog('通知客服确认信息')">材料已留档，通知客服确认信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1070">
            <el-button type="primary" size="mini" @click="displayNextDialog()">已确认，提交订单</el-button>
            <el-button size="mini" @click="displayRejectDialog('暂未确认', 'wait')">暂未确认</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1080">
            <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
            <el-button size="mini" @click="bankReceiptDialogDisplay = true">录入收款信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1090">
            <el-button type="primary" size="mini" @click="displayNextDialog()">所有材料已审核完毕，提交订单</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1100">
            <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
            <el-button size="mini" @click="companyRegisterInfoDialogDisplay = true">填写站点注册信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1110">
            <el-button type="primary" size="mini" @click="displayNextDialog()">确认无误，提交订单</el-button>
            <el-button size="mini" @click="companyRegisterInfoDialogDisplay = true">修改站点注册信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1120">
            <el-button type="primary" size="mini" @click="displayNextDialog('交付供应商')">交付供应商</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1130">
            <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
            <el-button size="mini" @click="registrationProcessDialogDisplay = true">更新站点注册进度</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1140">
            <el-button type="primary" size="mini" @click="displayNextDialog()">验货完成，提交订单</el-button>
            <el-button size="mini" @click="companyAttachmentDialogDisplay = true">录入货物信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1150">
            <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
            <el-button size="mini" @click="expressDialogDisplay = true">录入物流信息</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1160">
            <el-button type="primary" size="mini" @click="displayNextDialog()">已存档，提交订单</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1170">
            <el-button type="primary" size="mini" @click="displayNextDialog()">提交订单</el-button>
            <el-button size="mini" @click="customerServiceRecordDialogDisplay = true">录入回访结果</el-button>
            <el-button size="mini" @click="displayRejectDialog('暂无结果', 'wait')">暂无结果</el-button>
            <el-button size="mini" @click="displayRejectDialog()">驳回</el-button>
            <el-button size="mini" @click="displayRejectDialog('驳回至创建人的', 'restart')">驳回至创建人</el-button>
          </div>
        </el-col>
      </el-row>
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1160">
        <div slot="header">
          <div>客服回访信息</div>
        </div>
        <table>
          <tr>
            <td>服务结果是否满意</td>
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
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1140">
        <div slot="header">
          <span>交付物流信息</span>
        </div>
        <table>
          <tr>
            <td>快递单号</td>
            <td>{{info.accountOrderExpress && info.accountOrderExpress.expressNo || '-'}}</td>
            <td>快递公司</td>
            <td>{{info.accountOrderExpress && info.accountOrderExpress.expressName || '-'}}</td>
          </tr>
          <tr>
            <td>上传快递回单</td>
            <td>
              <el-button size="mini" type="text" v-if="info.accountOrderExpress && info.accountOrderExpress.expressImgUrl" @click="displayImage(info.accountOrderExpress.expressImgUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1130">
        <div slot="header">
          <span>货物信息</span>
        </div>
        <table>
          <tr>
            <td>站点名称</td>
            <td>{{info.companyAttachment && info.companyAttachment.companyName || '-'}}</td>
            <td>站点地址</td>
            <td>{{info.companyAttachment && info.companyAttachment.companyAddress || '-'}}</td>
          </tr>
          <tr>
            <td>公司电话</td>
            <td>{{info.companyAttachment && info.companyAttachment.companyPhone || '-'}}</td>
            <td>开户银行</td>
            <td>{{info.companyAttachment && info.companyAttachment.accountBank || '-'}}</td>
          </tr>
          <tr>
            <td>开户银行账号</td>
            <td>{{info.companyAttachment && info.companyAttachment.accountBankAccount || '-'}}</td>
            <td>税号</td>
            <td>{{info.companyAttachment && info.companyAttachment.taxNo || '-'}}</td>
          </tr>
          <tr>
            <td>上传网银U盾（序列号）</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyAttachment && info.companyAttachment.ukeyImgUrl" @click="displayImage(info.companyAttachment.ukeyImgUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
            <td>上传公章照片</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyAttachment && info.companyAttachment.stampImgUrl" @click="displayImage(info.companyAttachment.stampImgUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td>上传营业执照</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyAttachment && info.companyAttachment.licenseImgUrl" @click="displayImage(info.companyAttachment.licenseImgUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
            <td>上传国地税三方协议PDF</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyAttachment && info.companyAttachment.taxAgreementPDFUrl" @click="displayImage(info.companyAttachment.taxAgreementPDFUrl)">预览</el-button>
              <span v-else>-</span>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1120">
        <div slot="header">
          <span>进度信息</span>
        </div>
        <table>
          <tr>
            <td>下单时间</td>
            <td>{{info.processInfo && info.processInfo.showConfirmOrderTime || '-'}}</td>
            <td>材料提交时间</td>
            <td>{{info.processInfo && info.processInfo.showSubmitSupplierTime || '-'}}</td>
          </tr>
          <tr>
            <td>核名完成时间</td>
            <td>
              {{info.processInfo && info.processInfo.showCheckNameCompletedTime || '-'}}
              <el-button type="text" size="mini" @click="displayImage(info.processInfo.checkNameCompletedUrl)" v-if="info.processInfo && info.processInfo.checkNameCompletedUrl">查看材料</el-button>
            </td>
            <td>营业执照发放时间</td>
            <td>
              {{info.processInfo && info.processInfo.showLicenseTime || '-'}}
              <el-button type="text" size="mini" @click="displayImage(info.processInfo.licenseUrl)" v-if="info.processInfo && info.processInfo.licenseUrl">查看材料</el-button>
            </td>
          </tr>
          <tr>
            <td>银行开户时间</td>
            <td>
              {{info.processInfo && info.processInfo.showBankOpenAccountTime || '-'}}
              <el-button type="text" size="mini" @click="displayImage(info.processInfo.bankOpenAccountUrl)" v-if="info.processInfo && info.processInfo.bankOpenAccountUrl">查看材料</el-button>
            </td>
            <td>银行开户完成时间</td>
            <td>
              {{info.processInfo && info.processInfo.showBankOpenAccountCompletedTime || '-'}}
              <el-button type="text" size="mini" @click="displayImage(info.processInfo.bankOpenAccountCompletedUrl)" v-if="info.processInfo && info.processInfo.bankOpenAccountCompletedUrl">查看材料</el-button>
            </td>
          </tr>
          <tr>
            <td>核税完成时间</td>
            <td>
              {{info.processInfo && info.processInfo.showCheckTaxCompletedTime || '-'}}
              <el-button type="text" size="mini" @click="displayImage(info.processInfo.checkTaxCompletedUrl)" v-if="info.processInfo && info.processInfo.checkTaxCompletedUrl">查看材料</el-button>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1090">
        <div slot="header">
          <span>注册信息</span>
        </div>
        <table>
          <tr>
            <td>供应商</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.supplierName || '-'}}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>站点类型</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.companyTypeName || '-'}}</td>
            <td>站点名称</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.companyName || '-'}}</td>
          </tr>
          <tr>
            <td>注册资本</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.registeredCapital | currency('', 2) || '-'}}万元</td>
            <td>纳税性质</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.showTaxTypeName || '-'}}</td>
          </tr>
          <tr class="scope-operation" style="margin-top: 2px">
            <td>经营范围</td>
            <td colspan="3">{{info.companyRegInfo && info.companyRegInfo.businessScope || '-'}}</td>
          </tr>
          <tr>
            <td>投资人姓名</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.investorName || '-'}}</td>
            <td>投资人手机</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.investorMobile || '-'}}</td>
          </tr>
          <tr>
            <td>投资人身份证</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyRegInfo && info.companyRegInfo.investorIdCardFrontUrl" @click="displayImage(info.companyRegInfo.investorIdCardFrontUrl)">正面预览</el-button>
              <el-button size="mini" type="text" v-if="info.companyRegInfo && info.companyRegInfo.investorIdCardBackUrl" @click="displayImage(info.companyRegInfo.investorIdCardBackUrl)">反面预览</el-button>
              <span v-if="!info.companyRegInfo || (!info.companyRegInfo.investorIdCardFrontUrl && !info.companyRegInfo.investorIdCardBackUrl)">-</span>
            </td>
            <td>投资人身份证号码</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.investorIdCardNo || '-'}}</td>
          </tr>
          <tr>
            <td>邮箱</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.investorEmail || '-'}}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>财务人员姓名</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.financePersonName || '-'}}</td>
            <td>财务人员手机</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.financePersonMobile || '-'}}</td>
          </tr>
          <tr>
            <td>财务人员身份证</td>
            <td>
              <el-button size="mini" type="text" v-if="info.companyRegInfo && info.companyRegInfo.financePersonIdCardFrontUrl" @click="displayImage(info.companyRegInfo.financePersonIdCardFrontUrl)">正面预览</el-button>
              <el-button size="mini" type="text" v-if="info.companyRegInfo && info.companyRegInfo.financePersonIdCardBackUrl" @click="displayImage(info.companyRegInfo.financePersonIdCardBackUrl)">反面预览</el-button>
              <span v-if="!info.companyRegInfo || (!info.companyRegInfo.financePersonIdCardFrontUrl && !info.companyRegInfo.financePersonIdCardBackUrl)">-</span>
            </td>
            <td>财务人员身份证号</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.financePersonIdCardNo || '-'}}</td>
          </tr>
          <tr class="scope-operation" style="margin-top: 5px;">
            <td>备注</td>
            <td colspan="3">{{info.companyRegInfo && info.companyRegInfo.remark || '-'}}</td>
          </tr>
        </table>
      </el-card>
      <el-card class="box-card" v-if="info.orderInfo && info.orderInfo.workflowId > 1070">
        <div slot="header">
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
      <el-card class="box-card" style="padding-bottom: 20px;" v-if="info.orderInfo && info.orderInfo.orderId">
        <div slot="header">
          <span>开户订单详情</span>
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
            <td>站点类型</td>
            <td>{{info.orderInfo.companyTypeName || '-'}}</td>
            <td>站点名称</td>
            <td>{{info.orderInfo.companyName || '-'}}{{info.orderInfo.isAdjustment === 'Y' ? '（接受调剂）' : ''}}</td>
          </tr>
          <tr>
            <td>注册资本</td>
            <td>{{info.orderInfo.registeredCapital | currency('', 2) || '-'}}万元</td>
            <td>纳税性质</td>
            <td>{{info.orderInfo.showTaxTypeName || '-'}}</td>
          </tr>
          <tr>
            <td>开票费率折扣</td>
            <td>{{info.orderInfo.serviceFeeDiscount || '-'}}</td>
            <td></td>
            <td></td>
          </tr>
          <tr class="scope-operation">
            <td>经营范围</td>
            <td colspan="3">{{info.orderInfo.businessScope || '-'}}</td>
          </tr>
          <tr>
            <td>投资人姓名</td>
            <td>{{info.orderInfo.investorName || '-'}}</td>
            <td>投资人手机</td>
            <td>{{info.orderInfo.investorMobile || '-'}}</td>
          </tr>
          <tr>
            <td>投资人身份证</td>
            <td>
              <el-button size="mini" type="text" v-if="info.orderInfo.investorIdCardFrontUrl" @click="displayImage(info.orderInfo.investorIdCardFrontUrl)">正面预览</el-button>
              <el-button size="mini" type="text" v-if="info.orderInfo.investorIdCardBackUrl" @click="displayImage(info.orderInfo.investorIdCardBackUrl)">反面预览</el-button>
              <span v-if="!info.orderInfo.investorIdCardFrontUrl && !info.orderInfo.investorIdCardBackUrl">-</span>
            </td>
            <td>投资人身份证号码</td>
            <td>{{info.orderInfo.investorIdCardNo || '-'}}</td>
          </tr>
          <tr>
            <td>邮箱</td>
            <td>{{info.orderInfo.investorEmail || '-'}}</td>
            <td>财务人员姓名</td>
            <td>{{info.orderInfo.financePersonName || '-'}}</td>
          </tr>
          <tr>
            <td>财务人员手机</td>
            <td>{{info.orderInfo.financePersonMobile || '-'}}</td>
            <td>财务人员身份证</td>
            <td>
              <el-button size="mini" type="text" v-if="info.orderInfo.financePersonIdCardFrontUrl" @click="displayImage(info.orderInfo.financePersonIdCardFrontUrl)">正面预览</el-button>
              <el-button size="mini" type="text" v-if="info.orderInfo.financePersonIdCardBackUrl" @click="displayImage(info.orderInfo.financePersonIdCardBackUrl)">反面预览</el-button>
              <span v-if="!info.orderInfo.financePersonIdCardFrontUrl && !info.orderInfo.financePersonIdCardBackUrl">-</span>
            </td>
          </tr>
          <tr>
            <td>财务人员身份证号</td>
            <td>{{info.orderInfo.financePersonIdCardNo || '-'}}</td>
            <td>身份证寄回快递地址</td>
            <td>{{info.orderInfo.idCardReturnAddress || '-'}}</td>
          </tr>
          <tr>
            <td>押金单快递地址</td>
            <td>{{info.orderInfo.invoiceExpressAddress || '-'}}</td>
            <td>材料交付快递地址</td>
            <td>{{info.orderInfo.fileExpressAddress || '-'}}</td>
          </tr>
          <tr>
            <td>税管家相关服务协议</td>
            <td>
              <el-button size="mini" type="text" v-if="info.orderInfo && info.orderInfo.serviceAgreementUrl" @click="onPreviewClick(info.orderInfo.serviceAgreementUrl)">查看</el-button>
              <span v-else>-</span>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>是否加急</td>
            <td>{{info.orderInfo.isPriority === 'Y' ? '是' : '否'}}</td>
            <td>加急原因</td>
            <td>{{info.orderInfo.priorityReason || '-'}}</td>
          </tr>
          <tr>
            <td>商务提交时间</td>
            <td>{{info.orderInfo.showSubmitTime || '-'}}</td>
            <td>押金减免</td>
            <td>{{info.orderInfo.depositRemissionAmount | currency('', 2) || '-'}}元</td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{{info.orderInfo.showCreateTime || '-'}}</td>
            <td>创建人</td>
            <td>{{info.orderInfo.createAdminUserName || '-'}}</td>
          </tr>
          <tr>
            <td>交易费折扣</td>
            <td>{{info.orderInfo.tradeFeeDiscount || '-'}}</td>
            <td>订单状态</td>
            <td style="color: red">{{info.orderInfo.workflowName || '-'}}</td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="mini-item">
                <p v-if="info.orderInfo.tradeFee">交易费：<span>+{{info.orderInfo.tradeFee | currency}}</span></p>
                <p v-if="info.orderInfo.depositFee">押金：<span>+{{info.orderInfo.depositFee | currency}}</span></p>
                <p v-if="info.orderInfo.depositRemissionAmount">押金减免：<span>-{{info.orderInfo.depositRemissionAmount | currency}}</span></p>
                <p v-if="info.orderInfo.tradeFeeDiscountAmount">交易费折扣：<span>-{{info.orderInfo.tradeFeeDiscountAmount | currency}}</span></p>
                <p v-if="info.orderInfo.totalAmount">合计：<span>{{info.orderInfo.totalAmount | currency}}</span></p>
              </div>
            </td>
          </tr>
        </table>
      </el-card>
      <!--<el-card class="box-card finish-info">-->
        <!--订单已完成，共耗时30天4小时（2018-05-02~2018-05-20）。-->
      <!--</el-card>-->
    </div>
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
            <el-col :span="10" :offset="1">
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
      title="站点信息"
      :visible.sync="companyRegisterInfoDialogDisplay"
      :close-on-click-modal="false"
      width="600px"
      custom-class="company-register-info-dialog"
      center>
      <el-form ref="companyRegisterInfoForm" :model="companyRegisterInfoForm" label-width="130px" size="small">
        <el-form-item label="供应商" prop="companyTypeName">
          <el-select style="width: 100%" v-model="companyRegisterInfoForm.supplierId" placeholder="请选择供应商">
            <el-option
              v-for="item in sourceTaxSupplierList"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="companyName" v-for="(name, index) in companyRegisterInfoForm.companyNames" :key="index">
          <label slot="label" v-show="index === 0">站点名称<span style="color: red" v-if="info && info.orderInfo && info.orderInfo.isAdjustment !== 'Y'">(不可调剂)</span></label>
          <el-row>
            <el-col :span="20">
              <el-input v-model="name.value" placeholder="站点名称"/>
            </el-col>
            <el-col :span="4">
              <el-button type="text" size="mini" style="margin-left: 5px" @click.prevent="removeCompanyName(name)" v-if="companyRegisterInfoForm.companyNames && companyRegisterInfoForm.companyNames.length > 1">删除</el-button>
              <el-button type="text" size="mini" style="margin-left: 5px" @click.prevent="addCompanyName()" v-if="companyRegisterInfoForm.companyNames && companyRegisterInfoForm.companyNames.length < 10 &&companyRegisterInfoForm.companyNames.length === index + 1">增加</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="站点类型" prop="companyTypeName">
          <el-select style="width: 100%" v-model="companyRegisterInfoForm.companyTypeId" @change="onCompanyTypeChange" placeholder="请选择站点类型">
            <el-option
              v-for="item in companyTypeList"
              :key="item.companyTypeId"
              :label="item.companyTypeName"
              :value="item.companyTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="companyRegisterInfoForm.businessScope" placeholder="经营范围" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" readonly/>
        </el-form-item>
        <el-form-item label="注册资本" prop="registeredCapital" class="flex-content">
          <el-input v-model="companyRegisterInfoForm.registeredCapital" placeholder="注册资本" readonly/><span>万元</span>
        </el-form-item>
        <el-form-item label="纳税性质" prop="showTaxTypeName">
          <el-input v-model="companyRegisterInfoForm.showTaxTypeName" placeholder="纳税性质" readonly/>
        </el-form-item>
        <el-form-item label="投资人姓名" prop="investorName">
          <el-input v-model="companyRegisterInfoForm.investorName" placeholder="投资人姓名"/>
        </el-form-item>
        <el-form-item label="投资人手机" prop="investorMobile">
          <el-input v-model="companyRegisterInfoForm.investorMobile" placeholder="投资人手机"/>
        </el-form-item>
        <el-form-item label="投资人身份证号码" prop="investorIdCardNo">
          <el-input v-model="companyRegisterInfoForm.investorIdCardNo" placeholder="投资人身份证号码"/>
        </el-form-item>
        <el-form-item label="上传投资人身份证" class="account-upload">
          <div>
            <el-upload
              class="avatar-uploader investorIdCardFront"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.investorIdCardFront')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyRegisterInfoForm.investorIdCardFrontUrl = res.body.imageUrl) }">
              <x-image v-if="companyRegisterInfoForm.investorIdCardFrontUrl" :src="companyRegisterInfoForm.investorIdCardFrontUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block">正面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(companyRegisterInfoForm.investorIdCardFrontUrl)" size="mini" v-if="companyRegisterInfoForm.investorIdCardFrontUrl">查看原文件</el-button>
          </div>
          <div class="ml-10">
            <el-upload
              class="avatar-uploader ml-10 financePersonIdCard"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.financePersonIdCard')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyRegisterInfoForm.investorIdCardBackUrl = res.body.imageUrl) }">
              <x-image v-if="companyRegisterInfoForm.investorIdCardBackUrl" :src="companyRegisterInfoForm.investorIdCardBackUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon">反面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(companyRegisterInfoForm.investorIdCardBackUrl)" size="mini" v-if="companyRegisterInfoForm.investorIdCardBackUrl">查看原文件</el-button>
          </div>
        </el-form-item>
        <el-form-item label="投资人邮箱" prop="investorEmail">
          <el-input v-model="companyRegisterInfoForm.investorEmail" placeholder="投资人邮箱"/>
        </el-form-item>
        <el-form-item label="财务人员姓名" prop="financePersonName">
          <el-input v-model="companyRegisterInfoForm.financePersonName" placeholder="财务人员姓名"/>
        </el-form-item>
        <el-form-item label="财务人员手机" prop="financePersonMobile">
          <el-input v-model="companyRegisterInfoForm.financePersonMobile" placeholder="财务人员手机"/>
        </el-form-item>
        <el-form-item label="上传财务人员身份证" prop="investorEmail" class="account-upload" v-show="companyRegisterInfoForm.isNeedFinanceID === 'Y'">
          <div>
            <el-upload
              class="avatar-uploader financePersonIdCardFront"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.financePersonIdCardFront')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyRegisterInfoForm.financePersonIdCardFrontUrl = res.body.imageUrl) }">
              <x-image v-if="companyRegisterInfoForm.financePersonIdCardFrontUrl" :src="companyRegisterInfoForm.financePersonIdCardFrontUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block">正面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(companyRegisterInfoForm.financePersonIdCardFrontUrl)" size="mini" v-if="companyRegisterInfoForm.financePersonIdCardFrontUrl">查看原文件</el-button>
          </div>
          <div class="ml-10">
            <el-upload
              class="avatar-uploader ml-10 financePersonIdCardBack"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.financePersonIdCardBack')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyRegisterInfoForm.financePersonIdCardBackUrl = res.body.imageUrl) }">
              <x-image v-if="companyRegisterInfoForm.financePersonIdCardBackUrl" :src="companyRegisterInfoForm.financePersonIdCardBackUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon">反面</i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(companyRegisterInfoForm.financePersonIdCardBackUrl)" size="mini" v-if="companyRegisterInfoForm.financePersonIdCardBackUrl">查看原文件</el-button>
          </div>
        </el-form-item>
        <el-form-item label="财务人员身份证号" prop="financePersonIdCardNo">
          <el-input v-model="companyRegisterInfoForm.financePersonIdCardNo" placeholder="财务人员身份证号"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="companyRegisterInfoForm.remark" placeholder="备注" type="textarea" :autosize="{ minRows: 2, maxRows: 2}"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="companyRegisterInfoDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editCompanyRegisterInfo">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="站点注册进度"
      :visible.sync="registrationProcessDialogDisplay"
      :close-on-click-modal="false"
      custom-class="registration-process-dialog"
      width="500px"
      center>
      <el-form ref="registrationProcessForm" :model="registrationProcessForm" label-width="130px" size="small">
        <el-form-item label="核名完成时间" prop="checkNameCompletedTime">
          <el-date-picker
            style="width: 100%;"
            v-model="registrationProcessForm.checkNameCompletedTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            placeholder="核名完成时间">
          </el-date-picker>
          <el-upload
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="() => {openLoading()}"
            :on-error="closeLoading"
            :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (registrationProcessForm.checkNameCompletedUrl = res.body.imageUrl) }">
            <el-button type="text" size="mini">上传材料</el-button>
          </el-upload>
          <el-button type="text" size="mini" @click="displayImage(registrationProcessForm.checkNameCompletedUrl)" v-if="registrationProcessForm.checkNameCompletedUrl">查看原文件</el-button>
        </el-form-item>
        <el-form-item label="营业执照发放时间" prop="licenseTime">
          <el-date-picker
            style="width: 100%;"
            v-model="registrationProcessForm.licenseTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            placeholder="营业执照发放时间">
          </el-date-picker>
          <el-upload
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="() => {openLoading()}"
            :on-error="closeLoading"
            :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (registrationProcessForm.licenseUrl = res.body.imageUrl) }">
            <el-button type="text" size="mini">上传材料</el-button>
          </el-upload>
          <el-button type="text" size="mini" @click="displayImage(registrationProcessForm.licenseUrl)" v-if="registrationProcessForm.licenseUrl">查看原文件</el-button>
        </el-form-item>
        <el-form-item label="银行开户时间" prop="bankOpenAccountTime">
          <el-date-picker
            style="width: 100%;"
            v-model="registrationProcessForm.bankOpenAccountTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            placeholder="银行开户时间">
          </el-date-picker>
          <el-upload
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="() => {openLoading()}"
            :on-error="closeLoading"
            :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (registrationProcessForm.bankOpenAccountUrl = res.body.imageUrl) }">
            <el-button type="text" size="mini">上传材料</el-button>
          </el-upload>
          <el-button type="text" size="mini" @click="displayImage(registrationProcessForm.bankOpenAccountUrl)" v-if="registrationProcessForm.bankOpenAccountUrl">查看原文件</el-button>
        </el-form-item>
        <el-form-item label="银行开户完成时间" prop="bankOpenAccountCompletedTime">
          <el-date-picker
            style="width: 100%;"
            v-model="registrationProcessForm.bankOpenAccountCompletedTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            placeholder="银行开户完成时间">
          </el-date-picker>
          <el-upload
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="() => {openLoading()}"
            :on-error="closeLoading"
            :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (registrationProcessForm.bankOpenAccountCompletedUrl = res.body.imageUrl) }">
            <el-button type="text" size="mini">上传材料</el-button>
          </el-upload>
          <el-button type="text" size="mini" @click="displayImage(registrationProcessForm.bankOpenAccountCompletedUrl)" v-if="registrationProcessForm.bankOpenAccountCompletedUrl">查看原文件</el-button>
        </el-form-item>
        <el-form-item label="核税完成时间" prop="checkTaxCompletedTime">
          <el-date-picker
            style="width: 100%;"
            v-model="registrationProcessForm.checkTaxCompletedTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            placeholder="核税完成时间">
          </el-date-picker>
          <el-upload
            :action="$$main.getUrl('/Common/ImageUpload')"
            :show-file-list="false"
            :before-upload="() => {openLoading()}"
            :on-error="closeLoading"
            :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (registrationProcessForm.checkTaxCompletedUrl = res.body.imageUrl) }">
            <el-button type="text" size="mini">上传材料</el-button>
          </el-upload>
          <el-button type="text" size="mini" @click="displayImage(registrationProcessForm.checkTaxCompletedUrl)" v-if="registrationProcessForm.checkTaxCompletedUrl">查看原文件</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="registrationProcessDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editRegistrationProcess">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="货物信息"
      :visible.sync="companyAttachmentDialogDisplay"
      :close-on-click-modal="false"
      custom-class="company-attachment-dialog"
      width="500px"
      center>
      <el-form ref="companyAttachmentForm" :model="companyAttachmentForm" label-width="0" size="small">
        <el-form-item class="input-item">
          <span>站点名称</span>
          <el-input v-model="companyAttachmentForm.companyName" placeholder="站点名称"/>
        </el-form-item>
        <el-form-item class="input-item">
          <span>站点地址</span>
          <el-input v-model="companyAttachmentForm.companyAddress" placeholder="站点地址"/>
        </el-form-item>
        <el-form-item class="input-item">
          <span>公司电话</span>
          <el-input v-model="companyAttachmentForm.companyPhone" placeholder="公司电话"/>
        </el-form-item>
        <el-form-item class="input-item">
          <span>开户银行</span>
          <el-input v-model="companyAttachmentForm.accountBank" placeholder="开户银行"/>
        </el-form-item>
        <el-form-item class="input-item">
          <span>开户银行账号</span>
          <el-input v-model="companyAttachmentForm.accountBankAccount" placeholder="开户银行账号"/>
        </el-form-item>
        <el-form-item class="input-item">
          <span>税号</span>
          <el-input v-model="companyAttachmentForm.taxNo" placeholder="税号"/>
        </el-form-item>
        <el-row>
          <el-col :span="11" :offset="1">上传网银U盾（序列号）</el-col>
          <el-col :span="11" :offset="1">上传公章照片</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader ukeyImg"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.ukeyImg')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyAttachmentForm.ukeyImgUrl = res.body.imageUrl) }">
                  <x-image v-if="companyAttachmentForm.ukeyImgUrl" :src="companyAttachmentForm.ukeyImgUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(companyAttachmentForm.ukeyImgUrl)" size="mini" v-if="companyAttachmentForm.ukeyImgUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader stampImg"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.stampImg')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyAttachmentForm.stampImgUrl = res.body.imageUrl) }">
                  <x-image v-if="companyAttachmentForm.stampImgUrl" :src="companyAttachmentForm.stampImgUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(companyAttachmentForm.stampImgUrl)" size="mini" v-if="companyAttachmentForm.stampImgUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">上传营业执照</el-col>
          <el-col :span="11" :offset="1">上传国地税三方协议PDF</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader licenseImg"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.licenseImg')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyAttachmentForm.licenseImgUrl = res.body.imageUrl) }">
                  <x-image v-if="companyAttachmentForm.licenseImgUrl" :src="companyAttachmentForm.licenseImgUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(companyAttachmentForm.licenseImgUrl)" size="mini" v-if="companyAttachmentForm.licenseImgUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item class="account-upload">
              <div>
                <el-upload
                  class="avatar-uploader taxAgreementPDF"
                  :action="$$main.getUrl('/Common/ImageUpload')"
                  :show-file-list="false"
                  :before-upload="() => {openLoading('.taxAgreementPDF')}"
                  :on-error="closeLoading"
                  :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (companyAttachmentForm.taxAgreementPDFUrl = res.body.imageUrl) }">
                  <x-image v-if="companyAttachmentForm.taxAgreementPDFUrl" :src="companyAttachmentForm.taxAgreementPDFUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                </el-upload>
                <el-button type="text" @click="onPreviewClick(companyAttachmentForm.taxAgreementPDFUrl)" size="mini" v-if="companyAttachmentForm.taxAgreementPDFUrl">查看原文件</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="companyAttachmentDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editCompanyAttachment">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="交付物流信息"
      :visible.sync="expressDialogDisplay"
      :close-on-click-modal="false"
      width="500px"
      center>
      <el-form ref="expressForm" :model="expressForm" label-width="120px" size="small">
        <el-form-item label="快递单号" prop="bankNo">
          <el-input v-model="expressForm.expressNo" placeholder="快递单号"/>
        </el-form-item>
        <el-form-item label="快递公司" prop="trainAmount">
          <el-input v-model="expressForm.expressName" placeholder="快递公司"/>
        </el-form-item>
        <el-form-item label="快递单回单截图" class="account-upload">
          <div>
            <el-upload
              class="avatar-uploader expressImg"
              :action="$$main.getUrl('/Common/ImageUpload')"
              :show-file-list="false"
              :before-upload="() => {openLoading('.expressImg')}"
              :on-error="closeLoading"
              :on-success="(res, file, fileList) => { closeLoading(); res && res.isSuccess && (expressForm.expressImgUrl = res.body.imageUrl) }">
              <x-image v-if="expressForm.expressImgUrl" :src="expressForm.expressImgUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
            </el-upload>
            <el-button type="text" @click="onPreviewClick(expressForm.expressImgUrl)" size="mini" v-if="expressForm.expressImgUrl">查看原文件</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expressDialogDisplay = false">取消</el-button>
        <el-button type="primary" @click="editExpress">确认</el-button>
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
  name: 'account-order-details',
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
        orderType: 'A' // 订单类型(A/I)
      },
      bankReceiptRules: [],
      companyRegisterInfoDialogDisplay: false,
      companyRegisterInfoForm: {
        orderId: '', // 订单Id
        supplierId: '',
        companyNames: [{
          value: ''
        }],
        companyName: '', // 站点名称
        companyTypeId: '', // 站点类型
        businessScope: '',
        registeredCapital: '', // 注册资本
        showTaxTypeName: '', // 纳税性质
        taxTypeName: '', // 纳税性质
        investorName: '', // 投资人姓名
        investorMobile: '', // 投资人手机
        investorIdCardNo: '', // 投资人身份证号码
        investorIdCardFrontUrl: '', // 投资人身份证正面URL
        investorIdCardBackUrl: '', // 投资人身份证背面URL
        investorEmail: '', // 投资人邮箱
        financePersonName: '', // 财务人员姓名
        financePersonMobile: '', // 财务人员手机
        isNeedFinanceID: 'N',
        financePersonIdCardFrontUrl: '', // 财务人员身份证正面URL
        financePersonIdCardBackUrl: '', // 财务人员身份证背面URL
        financePersonIdCardNo: '', // 财务人员身份证号
        remark: '' // 备注
      },
      companyTypeList: [], // 公司类型列表
      companyRegisterInfoRules: [],
      registrationProcessDialogDisplay: false,
      registrationProcessForm: {
        orderId: '', // 订单Id
        checkNameCompletedTime: '', // 核名完成时间
        licenseTime: '', // 营业执照发放时间
        bankOpenAccountTime: '', // 银行开户时间
        bankOpenAccountCompletedTime: '', // 银行开户完成时间
        checkTaxCompletedTime: '', // 核税完成时间
        checkNameCompletedUrl: '', // 核名书Url
        licenseUrl: '', // 营业执照Url
        bankOpenAccountUrl: '', // 银行开户申请书Url
        bankOpenAccountCompletedUrl: '', // 银行开户完成通知书Url
        checkTaxCompletedUrl: '' // 核税完成单Url
      },
      registrationProcessRules: [],
      companyAttachmentDialogDisplay: false,
      companyAttachmentForm: {
        orderId: '', // 订单Id
        ukeyImgUrl: '', // U盾图片路径
        stampImgUrl: '', // 公章图片路径
        licenseImgUrl: '', // 营业执照图片路径
        taxAgreementPDFUrl: '', // 国地税协议三方PDF
        companyAddress: '', // 站点地址
        taxNo: '', // 税号
        companyPhone: '', // 公司电话
        accountBank: '', // 开户银行
        accountBankAccount: '', // 开户银行账号
        companyName: '' // 站点名称
      },
      companyAttachmentRules: [],
      expressDialogDisplay: false,
      expressForm: {
        orderId: '', // 订单Id
        expressNo: '', // 快递单号
        expressImgUrl: '', // 快递单回单截图URL
        expressName: '' // 快递公司
      },
      expressRules: [],
      customerServiceRecordDialogDisplay: false,
      customerServiceRecordForm: {
        orderId: '', // 订单Id
        orderType: 'A',
        eval: 0,
        displayEval: 0,
        evalValue: '', // 评价等级（1-10）
        feedback: '' // 客户反馈
      },
      customerServiceRecordRules: [],
      sourceTaxSupplierList: [] // 供应商列表
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
  methods: {
    async queryOrderLogList(){
      try {
        this.orderLogList = await this.$$main.orderLogList({
          orderId: this.orderId,
          orderType: 'A'
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
        this.info = await this.$$main.orderAccountOrderDetail({
          orderId: this.orderId
        })
        this.info.orderInfo && this.info.orderInfo.sourceTaxId && this.querySourceTaxSupplierList()
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
              orderType: 'A' // 订单类型(A/I)
            })
          })
        } else {
          this.addBankReceipt()
        }
        let regInfo = this.info.companyRegInfo
        if (regInfo) {
          if (regInfo.companyName && regInfo.companyName !== ''){
            let arr = regInfo.companyName.split(',')
            regInfo.companyNames = arr.map((i) => {
              return {
                value: i
              }
            })
          } else {
            regInfo.companyNames = [{
              value: ''
            }]
          }
          regInfo.supplierId = regInfo.supplierId || ''
          this.companyRegisterInfoForm = JSON.parse(JSON.stringify(regInfo))
        } else {
          const orderInfo = this.info.orderInfo
          let arr = orderInfo.companyName.split(',')
          let names = arr.map((i) => {
            return {
              value: i
            }
          })
          this.companyRegisterInfoForm = {
            orderId: (orderInfo && orderInfo.orderId) || '', // 订单Id
            supplierId: '',
            companyNames: names,
            companyName: (orderInfo && orderInfo.companyName) || '', // 站点名称
            companyTypeId: (orderInfo && orderInfo.companyTypeId) || '', // 站点类型
            businessScope: (orderInfo && orderInfo.businessScope) || '',
            registeredCapital: (orderInfo && orderInfo.registeredCapital) || '', // 注册资本
            taxTypeName: (orderInfo && orderInfo.taxTypeName) || '', // 纳税性质
            showTaxTypeName: (orderInfo && orderInfo.showTaxTypeName) || '', // 纳税性质
            investorName: (orderInfo && orderInfo.investorName) || '', // 投资人姓名
            investorMobile: (orderInfo && orderInfo.investorMobile) || '', // 投资人手机
            investorIdCardNo: (orderInfo && orderInfo.investorIdCardNo) || '', // 投资人身份证号码
            investorIdCardFrontUrl: (orderInfo && orderInfo.investorIdCardFrontUrl) || '', // 投资人身份证正面URL
            investorIdCardBackUrl: (orderInfo && orderInfo.investorIdCardBackUrl) || '', // 投资人身份证背面URL
            investorEmail: (orderInfo && orderInfo.investorEmail) || '', // 投资人邮箱
            financePersonName: (orderInfo && orderInfo.financePersonName) || '', // 财务人员姓名
            financePersonMobile: (orderInfo && orderInfo.financePersonMobile) || '', // 财务人员手机
            isNeedFinanceID: (orderInfo && orderInfo.financePersonMobile) || 'N',
            financePersonIdCardFrontUrl: (orderInfo && orderInfo.financePersonIdCardFrontUrl) || '', // 财务人员身份证正面URL
            financePersonIdCardBackUrl: (orderInfo && orderInfo.financePersonIdCardBackUrl) || '', // 财务人员身份证背面URL
            financePersonIdCardNo: (orderInfo && orderInfo.financePersonIdCardNo) || '', // 财务人员身份证号
            remark: '' // 备注
          }
        }
        this.info.processInfo && (this.registrationProcessForm = {
          orderId: this.orderId, // 订单Id
          checkNameCompletedTime: this.info.processInfo.showCheckNameCompletedTime || '', // 核名完成时间
          licenseTime: this.info.processInfo.showLicenseTime || '', // 营业执照发放时间
          bankOpenAccountTime: this.info.processInfo.showBankOpenAccountTime || '', // 银行开户时间
          bankOpenAccountCompletedTime: this.info.processInfo.showBankOpenAccountCompletedTime || '', // 银行开户完成时间
          checkTaxCompletedTime: this.info.processInfo.showCheckTaxCompletedTime || '', // 核税完成时间
          checkNameCompletedUrl: this.info.processInfo.checkNameCompletedUrl || '', // 核名书Url
          licenseUrl: this.info.processInfo.licenseUrl || '', // 营业执照Url
          bankOpenAccountUrl: this.info.processInfo.bankOpenAccountUrl || '', // 银行开户申请书Url
          bankOpenAccountCompletedUrl: this.info.processInfo.bankOpenAccountCompletedUrl || '', // 银行开户完成通知书Url
          checkTaxCompletedUrl: this.info.processInfo.checkTaxCompletedUrl || '' // 核税完成单Url
        })
        this.info.companyAttachment && (this.companyAttachmentForm = JSON.parse(JSON.stringify(this.info.companyAttachment)))
        this.info.accountOrderExpress && (this.expressForm = JSON.parse(JSON.stringify(this.info.accountOrderExpress)))
        this.info.customerServiceRecord && (this.customerServiceRecordForm = {
          orderId: this.orderId, // 订单Id
          orderType: 'A',
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
    async querySourceTaxSupplierList(){
      try {
        this.sourceTaxSupplierList = await this.$$main.sourceTaxListSupplier({
          sourceTaxId: this.info.orderInfo.sourceTaxId
        })
      } catch (e) {
        e.message && this.$message.error(e.message)
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
          orderType: 'A'
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
          orderType: 'A',
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
          orderType: 'A',
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
          orderType: 'A',
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
        orderType: 'A' // 订单类型(A/I)
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
    async queryCompanyTypeList(){
      try {
        this.companyTypeList = await this.$$main.commonListCompanyType()
      } catch (e) {
        this.companyTypeList = []
      }
    },
    onCompanyTypeChange(i){
      let chooseCompanyType = this.companyTypeList.filter((item) => {
        return item.companyTypeId === i
      })
      if (chooseCompanyType && chooseCompanyType.length > 0) {
        this.companyRegisterInfoForm.businessScope = chooseCompanyType[0].businessScope
      }
    },
    addCompanyName(){
      this.companyRegisterInfoForm.companyNames.push({
        value: ''
      })
    },
    removeCompanyName(item){
      let index = this.companyRegisterInfoForm.companyNames.indexOf(item)
      if (index !== -1) {
        this.companyRegisterInfoForm.companyNames.splice(index, 1)
      }
    },
    async editCompanyRegisterInfo(){
      let arr = []
      if (this.companyRegisterInfoForm.companyNames && this.companyRegisterInfoForm.companyNames.length > 0){
        this.companyRegisterInfoForm.companyNames.forEach((item) => {
          item && item.value && arr.push(item.value)
        })
      }
      this.companyRegisterInfoForm.companyName = arr.join(',')
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.companyRegisterInfoForm.orderId = this.orderId
        await this.$$main.orderAOEditCompanyRegisterInfo(this.companyRegisterInfoForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.companyRegisterInfoDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async editRegistrationProcess(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.registrationProcessForm.orderId = this.orderId
        await this.$$main.orderAORegistrationProcess(this.registrationProcessForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.registrationProcessDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async editCompanyAttachment(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.companyAttachmentForm.orderId = this.orderId
        await this.$$main.orderEditCompanyAttachment(this.companyAttachmentForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.companyAttachmentDialogDisplay = false
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async editExpress(){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.expressForm.orderId = this.orderId
        await this.$$main.orderAOEditExpress(this.expressForm)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.queryOrderInfo()
        this.expressDialogDisplay = false
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
    }
  },
  mounted() {
    this.orderId = (this.$route.query && this.$route.query.orderid) || ''
    this.queryCompanyTypeList()
    this.queryOrderInfo()
  }
}
</script>
