<template>
  <x-page
    breadcrumb="auto"
    title="开户订单详情"
  >
    <div style="min-width:800px;max-width:1024px">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="24">
          <order-log-dialog
            v-if="orderId && orderId !== ''"
            :order-id="orderId"
            order-type="A"
          >查看操作记录</order-log-dialog>
          <preview-button
            v-if="info.orderInfo && info.orderInfo.workflowId >= 1000"
            type="text"
            size="mini"
            always-show
            :src="`/file/Payment_bill_${info.orderInfo.orderNo}.pdf`"
          >下载付款单</preview-button>
          <preview-button
            v-if="info.orderInfo && info.orderInfo.workflowId > 1100"
            type="text"
            size="mini"
            always-show
            :src="`/file/Supplier_Order_${info.orderInfo.orderNo}.pdf`"
          >下载供应商下单表</preview-button>
          <span
            style="color: red;margin-left: 10px;"
            v-if="info && info.status"
          >订单状态 ：{{info.status || '-'}}， 待处理人 ：{{info.handleAdminRoleName || '-'}} {{info.handleAdminUserName || '-'}}。</span>
        </el-col>
      </el-row>
      <el-row v-if="info.isShowButton">
        <el-col
          :span="24"
          class="header-buttons"
          style="margin-bottom: 10px;"
        >
          <div v-if="[1000, 1010, 1020, 1030].indexOf(info.orderInfo.workflowId) !== -1">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog('审批通过')"
            >审批通过</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="[1040, 1050].indexOf(info.orderInfo.workflowId) !== -1">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog('审核通过')"
            >审核通过</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1060">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog('通知客服确认信息')"
            >材料已留档，通知客服确认信息</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1070">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >已确认，提交订单</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('暂未确认', 'wait')"
            >暂未确认</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1080">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >提交订单</el-button>
            <bank-receipt-dialog
              :order-id="orderId"
              :bank-receipts="info.bankReceipts"
              btnType=""
              type="A"
              @editSuccess="queryOrderInfo"
              @deleteSuccess="queryOrderInfo">
              录入收款信息
            </bank-receipt-dialog>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1090">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >所有材料已审核完毕，提交订单</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1100">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >提交订单</el-button>
            <el-button
              size="mini"
              @click="$refs['companyRegisterInfoDialog'].show()"
            >填写站点注册信息</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1110">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >确认无误，提交订单</el-button>
            <el-button
              size="mini"
              @click="$refs['companyRegisterInfoDialog'].show()"
            >修改站点注册信息</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1120">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog('交付供应商')"
            >交付供应商</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1130">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >提交订单</el-button>
            <el-button
              size="mini"
              @click="$refs['registrationProcessDialog'].show()"
            >更新站点注册进度</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1140">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >录入完成，提交订单</el-button>
            <el-button
              size="mini"
              @click="$refs['companyAttachmentDialog'].show()"
            >录入站点注册信息</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1150">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >提交订单</el-button>
            <el-button
              size="mini"
              @click="$refs['expressDialog'].show()"
            >录入物流信息</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1160">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >已存档，提交订单</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
          <div v-if="info.orderInfo.workflowId === 1170">
            <el-button
              type="primary"
              size="mini"
              @click="displayNextDialog()"
            >提交订单</el-button>
            <el-button
              size="mini"
              @click="customerServiceRecordDialogDisplay = true"
            >录入回访结果</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('暂无结果', 'wait')"
            >暂无结果</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog()"
            >驳回</el-button>
            <el-button
              size="mini"
              @click="displayRejectDialog('驳回至创建人的', 'restart')"
            >驳回至创建人</el-button>
          </div>
        </el-col>
      </el-row>
      <!--<el-card-->
        <!--class="box-card"-->
        <!--v-if="info.orderInfo && info.orderInfo.workflowId > 1160"-->
      <!--&gt;-->
        <!--<div slot="header">-->
          <!--<div>客服回访信息</div>-->
        <!--</div>-->
        <!--<table class="detail-table">-->
          <!--<tr>-->
            <!--<td>服务结果是否满意</td>-->
            <!--<td>-->
              <!--<div-->
                <!--v-if="info.customerServiceRecord && info.customerServiceRecord.evalValue"-->
                <!--style="display: flex"-->
              <!--&gt;-->
                <!--<el-rate-->
                  <!--style="margin-top: 5px;"-->
                  <!--v-model="customerServiceRecordForm.displayEval"-->
                  <!--disabled-->
                  <!--text-color="#ff9900"-->
                <!--&gt;-->
                <!--</el-rate>-->
                <!--{{info.customerServiceRecord.evalValue}}分-->
              <!--</div>-->
              <!--<span v-else>-</span>-->
            <!--</td>-->
            <!--<td>客户反馈</td>-->
            <!--<td>{{info.customerServiceRecord && info.customerServiceRecord.feedback || '-'}}</td>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</el-card>-->
      <el-card
        class="box-card"
        v-if="info.orderInfo && info.orderInfo.workflowId > 1140"
      >
        <div slot="header">
          <span>交付物流信息</span>
        </div>
        <table class="detail-table">
          <tr>
            <td>快递单号</td>
            <td>{{info.accountOrderExpress && info.accountOrderExpress.expressNo || '-'}}</td>
            <td>快递公司</td>
            <td>{{info.accountOrderExpress && info.accountOrderExpress.expressName || '-'}}</td>
          </tr>
          <tr>
            <td>上传快递回单</td>
            <td>
              <preview-button
                v-if="info.accountOrderExpress && info.accountOrderExpress.expressImgUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.accountOrderExpress.expressImgUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.accountOrderExpress && info.accountOrderExpress.expressImgUrl"
                size="mini"
                type="text"
                :src="info.accountOrderExpress.expressImgUrl"
              >预览</preview-button>
              <span v-else>-</span>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card
        class="box-card"
        v-if="info.orderInfo && info.orderInfo.workflowId > 1130"
      >
        <div slot="header">
          <span>站点实际注册信息</span>
        </div>
        <table class="detail-table">
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
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.ukeyImgUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyAttachment.ukeyImgUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.ukeyImgUrl"
                size="mini"
                type="text"
                :src="info.companyAttachment.ukeyImgUrl"
              >预览</preview-button>
              <span v-else>-</span>
            </td>
            <td>上传公章照片</td>
            <td>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.stampImgUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyAttachment.stampImgUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.stampImgUrl"
                size="mini"
                type="text"
                :src="info.companyAttachment.stampImgUrl"
              >预览</preview-button>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td>上传营业执照</td>
            <td>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.licenseImgUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyAttachment.licenseImgUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.licenseImgUrl"
                size="mini"
                type="text"
                :src="info.companyAttachment.licenseImgUrl"
              >预览</preview-button>
              <span v-else>-</span>
            </td>
            <td>上传国地税三方协议PDF</td>
            <td>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.taxAgreementPDFUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyAttachment.taxAgreementPDFUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.companyAttachment && info.companyAttachment.taxAgreementPDFUrl"
                size="mini"
                type="text"
                :src="info.companyAttachment.taxAgreementPDFUrl"
              >预览</preview-button>
              <span v-else>-</span>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card
        class="box-card"
        v-if="info.orderInfo && info.orderInfo.workflowId > 1120"
      >
        <div slot="header">
          <span>进度信息</span>
        </div>
        <table class="detail-table">
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
              <preview-button
                v-if="info.processInfo && info.processInfo.checkNameCompletedUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.processInfo.checkNameCompletedUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.processInfo && info.processInfo.checkNameCompletedUrl"
                size="mini"
                type="text"
                :src="info.processInfo.checkNameCompletedUrl"
              >预览</preview-button>
            </td>
            <td>营业执照发放时间</td>
            <td>
              {{info.processInfo && info.processInfo.showLicenseTime || '-'}}
              <preview-button
                v-if="info.processInfo && info.processInfo.licenseUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.processInfo.licenseUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.processInfo && info.processInfo.licenseUrl"
                size="mini"
                type="text"
                :src="info.processInfo.licenseUrl"
              >预览</preview-button>
            </td>
          </tr>
          <tr>
            <td>银行开户时间</td>
            <td>
              {{info.processInfo && info.processInfo.showBankOpenAccountTime || '-'}}
              <preview-button
                v-if="info.processInfo && info.processInfo.bankOpenAccountUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.processInfo.bankOpenAccountUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.processInfo && info.processInfo.bankOpenAccountUrl"
                size="mini"
                type="text"
                :src="info.processInfo.bankOpenAccountUrl"
              >预览</preview-button>
            </td>
            <td>银行开户完成时间</td>
            <td>
              {{info.processInfo && info.processInfo.showBankOpenAccountCompletedTime || '-'}}
              <preview-button
                v-if="info.processInfo && info.processInfo.bankOpenAccountCompletedUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.processInfo.bankOpenAccountCompletedUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.processInfo && info.processInfo.bankOpenAccountCompletedUrl"
                size="mini"
                type="text"
                :src="info.processInfo.bankOpenAccountCompletedUrl"
              >预览</preview-button>
            </td>
          </tr>
          <tr>
            <td>核税完成时间</td>
            <td>
              {{info.processInfo && info.processInfo.showCheckTaxCompletedTime || '-'}}
              <preview-button
                v-if="info.processInfo && info.processInfo.checkTaxCompletedUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.processInfo.checkTaxCompletedUrl"
              >查看</preview-button>
              <preview-button
                v-if="info.processInfo && info.processInfo.checkTaxCompletedUrl"
                size="mini"
                type="text"
                :src="info.processInfo.checkTaxCompletedUrl"
              >预览</preview-button>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card
        class="box-card"
        v-if="info.orderInfo && info.orderInfo.workflowId > 1090"
      >
        <div slot="header">
          <span>注册信息</span>
        </div>
        <table class="detail-table">
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
          <tr
            class="scope-operation"
            style="margin-top: 2px"
          >
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
              <preview-button
                v-if="info.companyRegInfo && info.companyRegInfo.investorIdCardFrontUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyRegInfo.investorIdCardFrontUrl"
              >正面预览</preview-button>
              <preview-button
                v-if="info.companyRegInfo && info.companyRegInfo.investorIdCardBackUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyRegInfo.investorIdCardBackUrl"
              >反面预览</preview-button>
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
              <preview-button
                v-if="info.companyRegInfo && info.companyRegInfo.financePersonIdCardFrontUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyRegInfo.financePersonIdCardFrontUrl"
              >正面预览</preview-button>
              <preview-button
                v-if="info.companyRegInfo && info.companyRegInfo.financePersonIdCardBackUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.companyRegInfo.financePersonIdCardBackUrl"
              >反面预览</preview-button>
              <span v-if="!info.companyRegInfo || (!info.companyRegInfo.financePersonIdCardFrontUrl && !info.companyRegInfo.financePersonIdCardBackUrl)">-</span>
            </td>
            <td>财务人员身份证号</td>
            <td>{{info.companyRegInfo && info.companyRegInfo.financePersonIdCardNo || '-'}}</td>
          </tr>
          <tr
            class="scope-operation"
            style="margin-top: 5px;"
          >
            <td>备注</td>
            <td colspan="3">{{info.companyRegInfo && info.companyRegInfo.remark || '-'}}</td>
          </tr>
        </table>
      </el-card>
      <el-card
        class="box-card"
        v-if="info.orderInfo && info.orderInfo.workflowId > 1070"
      >
        <div slot="header">
          <span>财务收款信息</span>
        </div>
        <div
          v-for="(item, index) in (info.bankReceipts || 1)"
          :key="index"
        >
          <br v-if="index > 0">
          <table class="detail-table">
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
                <preview-button
                  v-if="item.billImgUrl"
                  always-show
                  show-preview-dialog
                  size="mini"
                  type="text"
                  :src="item.billImgUrl"
                >查看</preview-button>
                <preview-button
                  v-if="item.billImgUrl"
                  size="mini"
                  type="text"
                  :src="item.billImgUrl"
                >预览</preview-button>
                <span v-else>-</span>
              </td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card
        class="box-card"
        style="padding-bottom: 20px;"
        v-if="info.orderInfo && info.orderInfo.orderId"
      >
        <div slot="header">
          <span>开户订单详情</span>
        </div>
        <table class="detail-table">
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
              <preview-button
                v-if="info.orderInfo.investorIdCardFrontUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.orderInfo.investorIdCardFrontUrl"
              >正面预览</preview-button>
              <preview-button
                v-if="info.orderInfo.investorIdCardBackUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.orderInfo.investorIdCardBackUrl"
              >反面预览</preview-button>
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
              <preview-button
                v-if="info.orderInfo.financePersonIdCardFrontUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.orderInfo.financePersonIdCardFrontUrl"
              >正面预览</preview-button>
              <preview-button
                v-if="info.orderInfo.financePersonIdCardBackUrl"
                always-show
                show-preview-dialog
                size="mini"
                type="text"
                :src="info.orderInfo.financePersonIdCardBackUrl"
              >反面预览</preview-button>
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
              <preview-button
                type="text"
                size="mini"
                always-show
                show-preview-dialog
                :src="info.orderInfo.serviceAgreementUrl"
                v-if="info.orderInfo && info.orderInfo.serviceAgreementUrl"
              >查看</preview-button>
              <preview-button
                type="text"
                size="mini"
                :src="info.orderInfo.serviceAgreementUrl"
                v-if="info.orderInfo && info.orderInfo.serviceAgreementUrl"
              >预览</preview-button>
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
            <td>开票费率折扣</td>
            <td>{{showServiceFee}}</td>
            <td>订单状态</td>
            <td style="color: red">{{info.orderInfo.workflowName || '-'}}</td>
          </tr>
          <tr>
            <td colspan="4" class="amountComputed">
              <div class="title">
                <div v-if="info.orderInfo.tradeFee">交易费：</div>
                <div v-if="info.orderInfo.depositFee">押金：</div>
                <div v-if="info.orderInfo.depositRemissionAmount">押金减免：</div>
                <div v-if="info.orderInfo.tradeFeeDiscountAmount">交易费折扣：</div>
                <div>合计：</div>
              </div>
              <div class="amount">
                <div v-if="info.orderInfo.tradeFee">+{{info.orderInfo.tradeFee | currency}}</div>
                <div v-if="info.orderInfo.depositFee">+{{info.orderInfo.depositFee | currency}}</div>
                <div v-if="info.orderInfo.depositRemissionAmount">-{{info.orderInfo.depositRemissionAmount | currency}}</div>
                <div v-if="info.orderInfo.tradeFeeDiscountAmount">-{{info.orderInfo.tradeFeeDiscountAmount | currency}}</div>
                <div>{{info.orderInfo.totalAmount || 0 | currency}}</div>
              </div>
            </td>
          </tr>
        </table>
      </el-card>
      <!--<el-card class="box-card finish-info">-->
      <!--订单已完成，共耗时30天4小时（2018-05-02~2018-05-20）。-->
      <!--</el-card>-->
    </div>
    <!-- 站点信息 -->
    <company-register-info-dialog ref="companyRegisterInfoDialog" :info="info" @saved="queryOrderInfo"/>
    <!-- 站点注册进度 -->
    <registration-process-dialog ref="registrationProcessDialog" :info="info" @saved="queryOrderInfo"/>
    <!-- 站点实际注册信息 -->
    <company-attachment-dialog ref="companyAttachmentDialog" :info="info" @saved="queryOrderInfo"/>
    <!-- 交付物流信息 -->
    <express-dialog ref="expressDialog" :info="info" @saved="queryOrderInfo"/>
    <!-- 客服回访信息 -->
    <el-dialog
      title="客服回访信息"
      :visible.sync="customerServiceRecordDialogDisplay"
      :close-on-click-modal="false"
      width="600px"
      center
    >
      <el-form
        ref="customerServiceRecordForm"
        :model="customerServiceRecordForm"
        label-width="120px"
        size="small"
      >
        <el-form-item
          label="评价等级"
          prop="bankNo"
          class="account-upload"
        >
          <el-rate
            style="margin-top: 5px;"
            v-model="customerServiceRecordForm.eval"
            allow-half
          >
          </el-rate>
          {{customerServiceRecordForm.evalValue}}分
        </el-form-item>
        <el-form-item
          label="客户反馈"
          prop="feedback"
        >
          <el-input
            v-model="customerServiceRecordForm.feedback"
            placeholder="客户反馈"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 2}"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="customerServiceRecordDialogDisplay = false">取消</el-button>
        <el-button
          type="primary"
          @click="editCustomerServiceRecord"
        >确认</el-button>
      </span>
    </el-dialog>
  </x-page>
</template>

<script>
import PreviewButton from '../../components/PreviewButton'
import BankReceiptDialog from '../../components/BankReceiptDialog'
import OrderLogDialog from '../../components/OrderLogDialog'
import PasteUploadImage from '../../components/PasteUploadImage'
import UploadFiles from '../../components/UploadFiles'
import CompanyRegisterInfoDialog from './account_components/CompanyRegisterInfoDialog'
import RegistrationProcessDialog from './account_components/RegistrationProcessDialog'
import CompanyAttachmentDialog from './account_components/CompanyAttachmentDialog'
import ExpressDialog from './account_components/ExpressDialog'
export default {
  name: 'account-order-details',
  components: {
    PreviewButton,
    BankReceiptDialog,
    OrderLogDialog,
    PasteUploadImage,
    UploadFiles,
    CompanyRegisterInfoDialog,
    RegistrationProcessDialog,
    CompanyAttachmentDialog,
    ExpressDialog},
  data() {
    return {
      orderId: '',
      info: {},
      bankTypes: {
        B: '银行',
        A: '支付宝',
        W: '微信',
        N: '-'
      },
      customerServiceRecordDialogDisplay: false,
      customerServiceRecordForm: {
        orderId: '', // 订单Id
        orderType: 'A',
        eval: 0,
        displayEval: 0,
        evalValue: '', // 评价等级（1-10）
        feedback: '' // 客户反馈
      }
    }
  },
  watch: {
    'customerServiceRecordForm.eval': {
      handler: function (val) {
        this.customerServiceRecordForm.evalValue = Number(val || 0) * 2
      },
      deep: true
    }
  },
  computed: {
    showServiceFee(){
      let val = this.info.orderInfo.serviceFeeDiscount
      if (!val || val === 1) {
        return '无折扣'
      } else {
        return val * 100 + '折'
      }
    }
  },
  methods: {
    async queryOrderInfo() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.info = await this.$$main.orderAccountOrderDetail({
          orderId: this.orderId
        })

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
    displayNextDialog(actionName) {
      this.$alert(`是否${actionName || '提交订单'}？`, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        callback: action => {
          action === 'confirm' && this.doOrderNext()
        }
      })
    },
    async doOrderNext() {
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
    displayRejectDialog(text = '驳回', type) {
      this.$prompt(`请输入${text}原因`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /\S+/,
        inputErrorMessage: `请输入${text}原因`,
        closeOnClickModal: false
      }).then(({ value }) => {
        if (type === 'wait') {
          this.doOrderWait(value)
        } else if (type === 'restart') {
          this.doOrderRejectRestart(value)
        } else {
          this.doOrderReject(value)
        }
      })
    },
    async doOrderReject(reason) {
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
    async doOrderWait(reason) {
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
    async doOrderRejectRestart(reason) {
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
    async editCustomerServiceRecord() {
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
    onPageShow(){
      this.orderId = (this.$route.query && this.$route.query.orderid) || ''
      this.queryOrderInfo()
    }
  },
  mounted() {
  }
}
</script>
