/*
**本代码由生成器自动生成，请勿手动修改
**生成时间：2019-03-07 11:50:41
*/
import Model from '../libs/model'
export default class MSModel extends Model {
  /**
   *名称：银行列表 路由：/Common/BankList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //银行类型
       "bankType":string
       //银行名称
       "bankName":string
   }

   */
  commonBankList(params, callback){
    return this.modelExecute('/Common/BankList', params, callback)
  }
  /**
   *名称：行政区域 路由：/Common/District
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //区域编号
       "districtId":int
       //区域名称
       "districtName":string
   }

   */
  commonDistrict(params, callback){
    return this.modelExecute('/Common/District', params, callback)
  }
  /**
   *名称：Common.反馈 路由：/Common/Feedback
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名
       "name":string
       //邮箱
       "email":string
       //电话
       "phone":string
       //标题
       "title":string
       //内容
       "content":string
   }

   *Response:
   bool
   */
  commonFeedback(params, callback){
    return this.modelExecute('/Common/Feedback', params, callback)
  }
  /**
   *名称：上传图片 路由：/Common/ImageUpload
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //图片相对URL
       "imageUrl":string
   }

   */
  commonImageUpload(params, callback){
    return this.modelExecute('/Common/ImageUpload', params, callback)
  }
  /**
   *名称：Common.获取服务器时间 路由：/GetServerTime
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //时间
       "serverTime":string
   }

   */
  getServerTime(params, callback){
    return this.modelExecute('/GetServerTime', params, callback)
  }
  /**
   *名称：企业.可发单企业列表 路由：/Company/CanUse/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //用户编号
       "companyUserId":int
       //名称
       "companyUserName":string
       //用户类型(C:企业,P:个人)
       "userType":string
       //手机号码
       "contactPhone":string
       //联系人
       "contact":string
       //自动确认支付时间
       "autoPayHour":int
       //注册时间
       "registerTime":DateTime
       //注册时间(string)
       "formatRegisterTime":string
       //发单状态(N/D)
       "orderStatus":string
       //账号状态
       "status":string
       //余额
       "amount":int
       //服务费
       "serviceChargeRate":decimal
       //授信额度
       "creditLine":decimal
       //剩余授信额度
       "residualCreditLine":decimal
       //企业简称
       "shortName":string
   }

   */
  companyCanUseList(params, callback){
    return this.modelExecute('/Company/CanUse/List', params, callback)
  }
  /**
   *名称：Message.Do.修改状态 路由：/Message/Do/ChangeStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //编号
       "messageId":int
       //状态(N正常,D禁用X删除)
       "messageStatus":string
   }

   *Response:
   bool
   */
  messageDoChangeStatus(params, callback){
    return this.modelExecute('/Message/Do/ChangeStatus', params, callback)
  }
  /**
   *名称：Message.Do.发布系统通知 路由：/Message/Do/Create
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //通知内容
       "messageContent":string
       //类型(W工人C企业)
       "messageType":string
   }

   *Response:
   int
   */
  messageDoCreate(params, callback){
    return this.modelExecute('/Message/Do/Create', params, callback)
  }
  /**
   *名称：Message.Query.列表 路由：/Message/Query/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //系统消息类型(C企业,W工人)
       "messageTypeCondition":string
       //状态(N正常D停用)
       "messageStatusCondition":string
   }

   *Response:
   {
       //通知编号
       "messageId":int
       //通知内容
       "messageContent":string
       //通知类型
       "messageType":string
       //通知状态
       "messageStatus":string
       //发布人
       "createUserId":int
       //发布人
       "createUserName":string
       //发布时间
       "showCreateTime":string
   }

   */
  messageQueryList(params, callback){
    return this.modelExecute('/Message/Query/List', params, callback)
  }
  /**
   *名称：Notice.Do.设置已读 路由：/Notice/Do/Read
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //通知编号,不传是全部
       "noticeId":int
   }

   *Response:
   bool
   */
  noticeDoRead(params, callback){
    return this.modelExecute('/Notice/Do/Read', params, callback)
  }
  /**
   *名称：Notice.Query.列表 路由：/Notice/Query/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //通知时间
       "noticeTime":string
       //已读
       "isRead":string
       //通知编号
       "noticeId":int
       //业务类型(M主订单,S子订单)
       "bizType":string
       //业务编号
       "bizId":int
       //内容
       "content":string
   }

   */
  noticeQueryList(params, callback){
    return this.modelExecute('/Notice/Query/List', params, callback)
  }
  /**
   *名称：Notice.Query.条数 路由：/Notice/Query/NoReadCount
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //未读条数
       "noReadCount":int
   }

   */
  noticeQueryNoReadCount(params, callback){
    return this.modelExecute('/Notice/Query/NoReadCount', params, callback)
  }
  /**
   *名称：订单发布-选取企业 路由：/Order/CompanyQuery
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司名称或登录手机号
       "keyword":string
   }

   *Response:
   {
       //账户状态
       "status":string
       //账户余额
       "amount":decimal
       //企业名称
       "companyName":string
   }

   */
  orderCompanyQuery(params, callback){
    return this.modelExecute('/Order/CompanyQuery', params, callback)
  }
  /**
   *名称：Order.Do.指派 路由：/Order/Do/Apply
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderSubId":int
       //工人编号
       "workerUserId":int
   }

   *Response:
   int
   */
  orderDoApply(params, callback){
    return this.modelExecute('/Order/Do/Apply', params, callback)
  }
  /**
   *名称：Order.Do.取消连续 路由：/Order/Do/CancelContinuity
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
   }

   *Response:
   bool
   */
  orderDoCancelContinuity(params, callback){
    return this.modelExecute('/Order/Do/CancelContinuity', params, callback)
  }
  /**
   *名称：Order.Do.取消主订单 路由：/Order/Do/CancelMain
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //取消原因
       "cancelReason":string
       //取消类型(P平台,C企业)
       "cancelType":string
       //是否该日(0不是,1是)
       "isToday":int
   }

   *Response:
   bool
   */
  orderDoCancelMain(params, callback){
    return this.modelExecute('/Order/Do/CancelMain', params, callback)
  }
  /**
   *名称：Order.Do.取消子订单 路由：/Order/Do/CancelSub
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //取消原因
       "cancelReason":string
       //取消类型(S5平台,S6企业,S7工人)
       "overType":string
   }

   *Response:
   bool
   */
  orderDoCancelSub(params, callback){
    return this.modelExecute('/Order/Do/CancelSub', params, callback)
  }
  /**
   *名称：Order.Do.薪资调整审批 路由：/Order/Do/ChangeAudit
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //调整编号
       "changeId":int
       //状态(P通过,R驳回)
       "changeStatus":string
       //驳回原因
       "auditReason":string
   }

   *Response:
   bool
   */
  orderDoChangeAudit(params, callback){
    return this.modelExecute('/Order/Do/ChangeAudit', params, callback)
  }
  /**
   *名称：Order.Do.新增工资调整 路由：/Order/Do/ChangeCreate
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //调整金额
       "changeAmount":decimal
       //调整原因
       "changeReason":string
   }

   *Response:
   int
   */
  orderDoChangeCreate(params, callback){
    return this.modelExecute('/Order/Do/ChangeCreate', params, callback)
  }
  /**
   *名称：Order.Do.换人 路由：/Order/Do/ChangeWorker
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //求职者编号
       "workerUserId":int
   }

   *Response:
   int
   */
  orderDoChangeWorker(params, callback){
    return this.modelExecute('/Order/Do/ChangeWorker', params, callback)
  }
  /**
   *名称：Order.Do.发工作 路由：/Order/Do/Create
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //标题
       "orderTitle":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //地址
       "address":string
       //经度
       "addressLat":decimal
       //纬度
       "addressLng":decimal
       //上班时间
       "beginTime":DateTime
       //下班时间
       "endTime":DateTime
       //工作日期
       "workDays":DateTime[]
       //是否连续(1连续)
       "isContinuity":int
       //需求人数
       "workerNum":int
       //详情
       "description":string
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //薪资
       "salary":decimal
       //包水饭(Y/N)
       "hasEating":string
       //企业编号
       "companyUserId":int
       //性别条件(N不限,M男,F女,Z指定)
       "sex":string
       //开始年龄
       "beginAge":int
       //结束年龄
       "endAge":int
       //有无训练(Y/N)
       "isTrain":string
       //训练开始时间
       "trainBeginTime":DateTime
       //训练结束时间
       "trainEndTime":DateTime
       //培训地址
       "trainAddress":string
       //训练奖励
       "trainAmount":decimal
       //训练经度
       "trainLat":decimal
       //训练纬度
       "trainLng":decimal
       //培训联系人
       "trainContact":string
       //培训电话
       "trainPhone":string
       //培训详情
       "trainDescription":string
       //男性工作人数
       "maleWorkerNum":int
       //女性工作人数
       "femaleWorkerNum":int
       //完工结(Y/N)
       "overPay":string
       //开始身高
       "beginHeight":int
       //结束身高
       "endHeight":int
       //开始体重
       "beginWeight":int
       //结束体重
       "endWeight":int
       //开始身高
       "maleBeginHeight":int
       //结束身高
       "maleEndHeight":int
       //开始体重
       "maleBeginWeight":int
       //结束体重
       "maleEndWeight":int
       //开始身高
       "femaleBeginHeight":int
       //结束身高
       "femaleEndHeight":int
       //开始体重
       "femaleBeginWeight":int
       //结束体重
       "femaleEndWeight":int
   }

   *Response:
   {
       //订单编号
       "orderIds":int[]
       //需求人数
       "workerNum":int
       //每日薪资
       "singleSalary":decimal
       //发单天数
       "createDays":int
       //总计
       "sumSalary":decimal
   }

   */
  orderDoCreate(params, callback){
    return this.modelExecute('/Order/Do/Create', params, callback)
  }
  /**
   *名称：Order.Do.事件新增 路由：/Order/Do/EventCreate
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //内容
       "eventContent":string
       //调整金额
       "changeAmount":decimal
   }

   *Response:
   int
   */
  orderDoEventCreate(params, callback){
    return this.modelExecute('/Order/Do/EventCreate', params, callback)
  }
  /**
   *名称：Order.Do.批量新增事件 路由：/Order/Do/EventCreateMain
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //事件内容
       "eventContent":string
   }

   *Response:
   bool
   */
  orderDoEventCreateMain(params, callback){
    return this.modelExecute('/Order/Do/EventCreateMain', params, callback)
  }
  /**
   *名称：Order.Do.事件处理 路由：/Order/Do/EventHandel
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //时间编号
       "eventId":int
       //内容
       "remark":string
       //1完成,2不处理,3调整
       "confirmType":int
       //调整金额
       "changeAmount":decimal
   }

   *Response:
   bool
   */
  orderDoEventHandel(params, callback){
    return this.modelExecute('/Order/Do/EventHandel', params, callback)
  }
  /**
   *名称：Order.Do.减少名额 路由：/Order/Do/Minus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
       //增加人数
       "minusNum":int
   }

   *Response:
   bool
   */
  orderDoMinus(params, callback){
    return this.modelExecute('/Order/Do/Minus', params, callback)
  }
  /**
   *名称：Order.Do.编辑 路由：/Order/Do/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //新详情
       "newDescription":string
   }

   *Response:
   bool
   */
  orderDoModify(params, callback){
    return this.modelExecute('/Order/Do/Modify', params, callback)
  }
  /**
   *名称：Order.Do.退工 路由：/Order/Do/NoNeed
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单号
       "orderSubId":int
       //原因
       "reason":string
   }

   *Response:
   bool
   */
  orderDoNoNeed(params, callback){
    return this.modelExecute('/Order/Do/NoNeed', params, callback)
  }
  /**
   *名称：Order.Do.旷工 路由：/Order/Do/NoWork
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单号
       "orderSubId":int
       //原因
       "reason":string
   }

   *Response:
   bool
   */
  orderDoNoWork(params, callback){
    return this.modelExecute('/Order/Do/NoWork', params, callback)
  }
  /**
   *名称：Order.Do.发工资 路由：/Order/Do/Pay
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //金额
       "confirmAmount":decimal
   }

   *Response:
   bool
   */
  orderDoPay(params, callback){
    return this.modelExecute('/Order/Do/Pay', params, callback)
  }
  /**
   *名称：Order.Do.增加名额 路由：/Order/Do/Plus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
       //增加人数
       "plusNum":int
   }

   *Response:
   bool
   */
  orderDoPlus(params, callback){
    return this.modelExecute('/Order/Do/Plus', params, callback)
  }
  /**
   *名称：Order.Do.备注 路由：/Order/Do/Remark
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  orderDoRemark(params, callback){
    return this.modelExecute('/Order/Do/Remark', params, callback)
  }
  /**
   *名称：Order.Do.导出子订单PDF 路由：/Order/Do/SubPdf
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
       //有无身份证
       "hasId":string
       //有无照片
       "hasPhoto":string
       //有无手机号
       "hasMobile":string
   }

   *Response:
   {
       //下载地址
       "dLUrl":string
   }

   */
  orderDoSubPdf(params, callback){
    return this.modelExecute('/Order/Do/SubPdf', params, callback)
  }
  /**
   *名称：Order.Query.主订单详情 路由：/Order/Query/DetailMain
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //主订单编号
       "orderId":int
   }

   *Response:
   {
       //包水饭(Y/N)
       "hasEating":string
       //订单编号
       "orderId":int
       //订单号
       "orderNo":string
       //企业编号
       "companyUserId":int
       //企业名称
       "companyName":string
       //发布时间
       "showCreateTime":string
       //标题
       "orderTitle":string
       //连续编号
       "continuityOrderId":int
       //连续日期
       "continuityDates":string[]
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //地址
       "address":string
       //地址
       "addressLng":decimal
       //地址
       "addressLat":decimal
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //每日薪资
       "singleSalary":decimal
       //城市编号
       "cityId":int
       //原人数
       "originalWorkerNum":int
       //现人数
       "workerNum":int
       //预约人数
       "applyWorkerNum":int
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //C企业P平台
       "createType":string
       //预付金额
       "prepayAmount":int
       //详情
       "description":string
       //备注
       "orderRemark":string
       //1待上班,2上班中,3已下班,4已取消
       "orderStatus":int
       //服务费
       "singleServiceCharge":decimal
       //城市名称
       "cityName":string
       //发布人
       "createUserName":string
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //完工结
       "overPay":string
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
       //培训金额
       "trainAmount":decimal
       //连续订单订单号
       "continuityOrderIds":int[]
   }

   */
  orderQueryDetailMain(params, callback){
    return this.modelExecute('/Order/Query/DetailMain', params, callback)
  }
  /**
   *名称：Order.Query.主订单详情.子订单列表 路由：/Order/Query/DetailMainListSub
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //显示全部(0不,1是)
       "showAll":int
   }

   *Response:
   {
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //工人编号
       "workerUserId":int
       //工人姓名
       "workerName":string
       //工人电话
       "workerMobile":string
       //抢单时间
       "showApplyTime":string
       //签到时间
       "showClockOnTime":string
       //签到地址
       "clockOnAddress":string
       //签退时间
       "showClockOffTime":string
       //签退地址
       "clockOffAddress":string
       //完结类型
       "overType":string
       //时间类型(1未到可签到时间,2未到上班时间,3已到上班时间,4已过下班时间)
       "timeStatus":int
       //完结时间
       "overTime":string
       //完结操作人
       "overUserName":string
       //完结原因
       "overReason":string
       //抢单方式
       "applyType":string
       //性别
       "workerSex":string
   }

   */
  orderQueryDetailMainListSub(params, callback){
    return this.modelExecute('/Order/Query/DetailMainListSub', params, callback)
  }
  /**
   *名称：Order.Query.子订单详情 路由：/Order/Query/DetailSub
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
   }

   *Response:
   {
       //完结时间
       "showOverTime":string
       //工时
       "workingHours":decimal
       //自动支付时间
       "showAutoPayTime":string
       //自动支付倒计时
       "autoPayMinutes":int
       //调整薪资
       "adjustSalary":decimal
       //完结原因
       "overReason":string
       //订单编号
       "orderId":int
       //订单号
       "orderNo":string
       //企业编号
       "companyUserId":int
       //企业名称
       "companyName":string
       //发布时间
       "showCreateTime":string
       //标题
       "orderTitle":string
       //连续编号
       "continuityOrderId":int
       //连续日期
       "continuityDates":string[]
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //地址
       "address":string
       //地址
       "addressLng":decimal
       //地址
       "addressLat":decimal
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //每日薪资
       "singleSalary":decimal
       //城市编号
       "cityId":int
       //原人数
       "originalWorkerNum":int
       //现人数
       "workerNum":int
       //预约人数
       "applyWorkerNum":int
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //C企业P平台
       "createType":string
       //预付金额
       "prepayAmount":decimal
       //详情
       "description":string
       //备注
       "orderRemark":string
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //工人编号
       "workerUserId":int
       //工人姓名
       "workerName":string
       //工人电话
       "workerMobile":string
       //抢单时间
       "showApplyTime":string
       //签到时间
       "showClockOnTime":string
       //签到地址
       "clockOnAddress":string
       //签退时间
       "showClockOffTime":string
       //签退地址
       "clockOffAddress":string
       //状态(1,2,3,4,5,6)
       "subStatus":int
       //完结类型
       "overType":string
       //时间类型(1未到可签到时间,2未到上班时间,3已到上班时间,4已过下班时间)
       "timeStatus":int
       //城市
       "cityName":string
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //服务费
       "singleServiceCharge":decimal
       //包水饭(Y/N)
       "hasEating":string
       //完工结
       "overPay":string
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
       //完结时间
       "overTime":string
       //完结操作人
       "overUserName":string
       //抢单方式
       "applyType":string
       //性别
       "workerSex":string
       //累计调整金额
       "totalChangeAmount":decimal
       //有未审核调整
       "hasWaitChange":bool
       //状态
       "subStatusText":string
       //服务费
       "serviceAmount":decimal
       //渠道费
       "divideAmount":decimal
       //是否支付
       "isPay":string
   }

   */
  orderQueryDetailSub(params, callback){
    return this.modelExecute('/Order/Query/DetailSub', params, callback)
  }
  /**
   *名称：Order.Query.子订单详情.子订单列表 路由：/Order/Query/DetailSubListSub
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
   }

   *Response:
   {
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //开始时间
       "beginTime":string
       //结束时间
       "endTime":string
       //抢单时间
       "showApplyTime":string
       //签到时间
       "showClockOnTime":string
       //签到地址
       "clockOnAddress":string
       //签退时间
       "showClockOffTime":string
       //签退地址
       "clockOffAddress":string
       //包水饭(Y/N)
       "hasEating":string
       //抢单方式
       "applyType":string
       //完工结
       "overPay":string
       //有无事件(0没有,1已处理,2未处理)
       "hasEvent":int
       //状态(1预约中,2待上班,3上班中,4待支付,5已支付,6取消)
       "subStatus":int
       //状态
       "subStatusText":string
       //有无调整
       "hasChange":int
       //是否培训(0不是,其他是)
       "isTrain":int
   }

   */
  orderQueryDetailSubListSub(params, callback){
    return this.modelExecute('/Order/Query/DetailSubListSub', params, callback)
  }
  /**
   *名称：Order.Query.事件详情 路由：/Order/Query/EventDetail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
   }

   *Response:
   {
       //事件编号
       "eventId":int
       //内容
       "eventContent":string
       //时间
       "lastTime":string
       //处理人
       "lastUserName":string
       //状态
       "status":string
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //记录
       "logs":LogInfo[]
       //薪资
       "salaryAmount":decimal
       //服务费
       "serviceAmount":decimal
   }

   */
  orderQueryEventDetail(params, callback){
    return this.modelExecute('/Order/Query/EventDetail', params, callback)
  }
  /**
   *名称：Order.Query.事件列表 路由：/Order/Query/ListEvent
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //订单号条件
       "orderSubNoCondition":string
       //P处理中C已完成N不处理
       "statusCondition":string
   }

   *Response:
   {
       //事件编号
       "eventId":int
       //内容
       "eventContent":string
       //时间
       "lastTime":string
       //处理人
       "lastUserName":string
       //状态
       "status":string
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //标题
       "orderTitle":string
       //记录时间
       "createTime":string
   }

   */
  orderQueryListEvent(params, callback){
    return this.modelExecute('/Order/Query/ListEvent', params, callback)
  }
  /**
   *名称：Order.Query.主订单列表 路由：/Order/Query/ListMain
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //联系人
       "orderContactCondition":string
       //联系电话
       "orderPhoneCondition":string
       //企业名称
       "companyNameCondition":string
       //标签
       "jobTagNameCondition":string
       //发布时间
       "createTimeBeginCondition":DateTime
       //发布时间
       "createTimeEndCondition":DateTime
       //工作时间
       "workTimeBeginCondition":DateTime
       //工作时间
       "workTimeEndCondition":DateTime
       //订单状态(1待上班,2上班中,3已下班,4取消)
       "orderStatusCondition":int
       //预约状态(1无人,2部分,3全部预约)
       "applyStatusCondition":int
       //连续(0,1)
       "continuityCondition":int
       //城市
       "cityNameCondition":string
       //订单号
       "orderNoCondition":string
       //订单编号
       "orderIdCondition":int
       //标题
       "orderTitle":string
       //标签
       "jobTagId":int
   }

   *Response:
   {
       //包水饭(Y/N)
       "hasEating":string
       //订单编号
       "orderId":int
       //订单号
       "orderNo":string
       //连续订单编号
       "continuityOrderId":int
       //企业编号
       "companyUserId":int
       //企业名
       "companyName":string
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //原人数
       "originalWorkerNum":int
       //现人数
       "workerNum":int
       //预约人数
       "applyWorkerNum":int
       //每日薪资
       "singleSalary":decimal
       //总薪资
       "sumSalary":decimal
       //城市编号
       "cityId":int
       //地址
       "address":string
       //1待上班,2上班中,3已下班,4已取消
       "orderStatus":int
       //订单标题
       "orderTitle":string
       //服务费
       "singleServiceCharge":decimal
       //城市名称
       "cityName":string
       //C企业P平台
       "createType":string
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //是否培训
       "isTrain":string
       //完工结
       "overPay":string
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
   }

   */
  orderQueryListMain(params, callback){
    return this.modelExecute('/Order/Query/ListMain', params, callback)
  }
  /**
   *名称：Order.Query.调整工资记录 路由：/Order/Query/ListSalaryChange
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //订单号
       "orderSubNo":string
       //工人名
       "workerName":string
       //起
       "beginChangeTime":DateTime
       //止
       "endChangeTime":DateTime
       //状态(W待审核,P通过,R驳回)
       "changeStatus":string
   }

   *Response:
   {
       //调整编号
       "changeId":int
       //订单编号
       "orderSubId":int
       //订单号
       "orderSubNo":string
       //订单标题
       "orderTitle":string
       //上班时间
       "beginTime":string
       //下班时间
       "endTime":string
       //累计调整金额
       "totalChangeAmount":decimal
       //调整金额
       "changeAmount":decimal
       //调整原因
       "changeReason":string
       //工人编号
       "workerUserId":int
       //工人名
       "workerName":string
       //工人电话
       "workerMobile":string
       //状态(W待审核,P通过,R驳回)
       "changeStatus":string
       //驳回原因
       "auditReason":string
       //调整人
       "changeUserName":string
       //调整时间
       "changeTime":string
       //审核人
       "auditUserName":string
       //审核时间
       "auditTime":string
       //工资
       "singleSalary ":decimal
       //服务费
       "singleServiceCharge":decimal
   }

   */
  orderQueryListSalaryChange(params, callback){
    return this.modelExecute('/Order/Query/ListSalaryChange', params, callback)
  }
  /**
   *名称：Order.Query.子订单列表 路由：/Order/Query/ListSub
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号或标题
       "orderNoOrTitleCondition":string
       //企业名称或电话
       "companyNameOrMobileCondition":string
       //订单联系人或电话
       "orderContactOrPhoneCondition":string
       //工作时间
       "workTimeBeginCondition":DateTime
       //工作时间
       "workTimeEndCondition":DateTime
       //工人名或电话
       "workerNameOrMobileCondition":string
       //1预约中,2待上班,3上班中,4待支付,5已支付,6取消,7超时无人抢,8已确认未支付,9退工,10旷工
       "subStatusCondition":int
       //城市
       "cityNameCondition":string
       //事件(0,1)
       "eventCondition":int
       //训练订单(Y/N)
       "trainCondition":string
       //标题
       "orderTitle":string
       //完结类型
       "overType":string
       //抢单类型
       "applyType":string
       //标签
       "jobTagId":int
       //是否调整工资(1有2无)
       "isSalaryChange":int
   }

   *Response:
   {
       //子订单编号
       "orderSubId":int
       //性别
       "workerSex":string
       //自动支付时间
       "showAutoPayTime":string
       //自动支付倒计时
       "autoPayMinutes":int
       //调整薪资
       "adjustSalary":int
       //子订单号
       "orderSubNo":string
       //标题
       "orderTitle":string
       //订单编号
       "orderId":int
       //企业编号
       "companyUserId":int
       //企业名
       "companyName":string
       //企业电话
       "companyMobile":string
       //工人编号
       "workerUserId":int
       //工人姓名
       "workerName":string
       //工人电话
       "workerMobile":string
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //地址
       "address":string
       //每日薪资
       "singleSalary":decimal
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //抢单时间
       "showApplyTime":string
       //签到时间
       "showClockOnTime":string
       //签到地址
       "clockOnAddress":string
       //签退时间
       "showClockOffTime":string
       //签退地址
       "clockOffAddress":string
       //状态(1预约中,2待上班,3上班中,4待支付,5已支付,6取消)
       "subStatus":int
       //时间类型(1未到可签到时间,2未到上班时间,3已到上班时间,4已过下班时间)
       "timeStatus":int
       //完结类型
       "overType":string
       //C企业P平台
       "createType":string
       //服务费
       "singleServiceCharge":decimal
       //包水饭(Y/N)
       "hasEating":string
       //完结时间
       "overTime":string
       //完结操作人
       "overUserName":string
       //完结原因
       "overReason":string
       //抢单方式
       "applyType":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //完工结
       "overPay":string
       //有无调整
       "hasChange":int
       //有无事件(0没有,1已处理,2未处理)
       "hasEvent":int
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
       //状态
       "subStatusText":string
   }

   */
  orderQueryListSub(params, callback){
    return this.modelExecute('/Order/Query/ListSub', params, callback)
  }
  /**
   *名称：Order.Query.预约中 路由：/Order/Query/ListWaitApply
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号或标题
       "orderNoOrTitleCondition":string
       //企业名称或电话
       "companyNameOrMobileCondition":string
       //订单联系人或电话
       "orderContactOrPhoneCondition":string
       //工作时间
       "workTimeBeginCondition":DateTime
       //工作时间
       "workTimeEndCondition":DateTime
       //城市
       "cityNameCondition":string
       //事件(0,1)
       "eventCondition":int
       //训练订单(Y/N)
       "trainCondition":string
       //标题
       "orderTitle":string
       //标签
       "jobTagId":int
   }

   *Response:
   {
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //标题
       "orderTitle":string
       //订单编号
       "orderId":int
       //企业编号
       "companyUserId":int
       //企业名
       "companyName":string
       //企业电话
       "companyMobile":string
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //地址
       "address":string
       //每日薪资
       "singleSalary":decimal
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //时间类型(1未到可签到时间,2未到上班时间,3已到上班时间,4已过下班时间)
       "timeStatus":int
       //C企业P平台
       "createType":string
       //包水饭(Y/N)
       "hasEating":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //完工结
       "overPay":string
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
       //有无调整
       "hasChange":int
       //有无事件(0没有,1已处理,2未处理)
       "hasEvent":int
   }

   */
  orderQueryListWaitApply(params, callback){
    return this.modelExecute('/Order/Query/ListWaitApply', params, callback)
  }
  /**
   *名称：Order.Query.待上班 路由：/Order/Query/ListWaitClock
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号或标题
       "orderNoOrTitleCondition":string
       //企业名称或电话
       "companyNameOrMobileCondition":string
       //订单联系人或电话
       "orderContactOrPhoneCondition":string
       //工作时间
       "workTimeBeginCondition":DateTime
       //工作时间
       "workTimeEndCondition":DateTime
       //工人名或电话
       "workerNameOrMobileCondition":string
       //城市
       "cityNameCondition":string
       //事件(0,1)
       "eventCondition":int
       //训练订单(Y/N)
       "trainCondition":string
       //标题
       "orderTitle":string
       //抢单类型
       "applyType":string
       //标签
       "jobTagId":int
   }

   *Response:
   {
       //性别
       "workerSex":string
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //标题
       "orderTitle":string
       //订单编号
       "orderId":int
       //企业编号
       "companyUserId":int
       //企业名
       "companyName":string
       //企业电话
       "companyMobile":string
       //工人编号
       "workerUserId":int
       //工人姓名
       "workerName":string
       //工人电话
       "workerMobile":string
       //开始时间
       "showBeginTime":string
       //结束时间
       "showEndTime":string
       //地址
       "address":string
       //每日薪资
       "singleSalary":decimal
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //抢单时间
       "showApplyTime":string
       //C企业P平台
       "createType":string
       //包水饭(Y/N)
       "hasEating":string
       //抢单方式
       "applyType":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //完工结
       "overPay":string
       //有无事件(1有,2没有)
       "hasEvent":int
       //有无调整
       "hasChange":int
       //性别
       "sex":string
       //年龄
       "beginAge":int
       //年龄
       "endAge":int
       //身高
       "beginHeight":int
       //身高
       "endHeight":int
       //体重
       "beginWeight":int
       //体重
       "endWeight":int
   }

   */
  orderQueryListWaitClock(params, callback){
    return this.modelExecute('/Order/Query/ListWaitClock', params, callback)
  }
  /**
   *名称：Order.Query.候选人 路由：/Order/Query/ListWorker
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //子订单编号
       "orderSubId":int
       //名字条件
       "userNameCondition":string
       //电话条件
       "mobilePhoneCondition":string
       //是否换人
       "isChange":int
   }

   *Response:
   {
       //工人编号
       "workerUserId":int
       //工人名
       "userName":string
       //性别
       "sex":string
       //电话
       "mobilePhone":string
       //头像
       "headImage":string
   }

   */
  orderQueryListWorker(params, callback){
    return this.modelExecute('/Order/Query/ListWorker', params, callback)
  }
  /**
   *名称：Order.Query.新增名额薪资 路由：/Order/Query/PlusSalary
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
       //增加名额
       "plusNum":int
   }

   *Response:
   {
       //所需金额
       "needAmount":decimal
   }

   */
  orderQueryPlusSalary(params, callback){
    return this.modelExecute('/Order/Query/PlusSalary', params, callback)
  }
  /**
   *名称：Order.Query.报告 路由：/Order/Query/Report
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
   }

   *Response:
   {
       //子订单号
       "orderSubId":int
       //名字
       "workerName":string
       //电话
       "workerMobile":string
       //状态(0无,1正常,2路上,3鸽子,4平台取消,5企业取消,6工人取消)
       "showStatus":int
       //完结时间
       "overTime":string
   }

   */
  orderQueryReport(params, callback){
    return this.modelExecute('/Order/Query/Report', params, callback)
  }
  /**
   *名称：Order.Query.薪资 路由：/Order/Query/Salary
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //经度
       "addressLat":decimal
       //纬度
       "addressLng":decimal
       //标签
       "jobTagId":int
       //上班时间
       "beginTime":DateTime
       //下班时间
       "endTime":DateTime
       //工作日期
       "workDays":DateTime[]
       //性别条件(N不限,M男,F女,Z指定)
       "sex":string
       //需求人数
       "workerNum":int
       //包水饭(Y/N)
       "hasEating":string
       //男性工作人数
       "maleWorkerNum":int
       //女性工作人数
       "femaleWorkerNum":int
       //企业编号
       "companyUserId":int
   }

   *Response:
   {
       //需求人数
       "workerNum":int
       //每日薪资
       "singleSalary":decimal
       //发单天数
       "createDays":int
       //总计
       "sumSalary":decimal
   }

   */
  orderQuerySalary(params, callback){
    return this.modelExecute('/Order/Query/Salary', params, callback)
  }
  /**
   *名称：Promoter.修改状态 路由：/Promoter/Do/ChangeStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //编号
       "promoterUserId":int
       //状态
       "status":string
   }

   *Response:
   bool
   */
  promoterDoChangeStatus(params, callback){
    return this.modelExecute('/Promoter/Do/ChangeStatus', params, callback)
  }
  /**
   *名称：Promoter.更新等级 路由：/Promoter/Do/CreateLevel
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //等级
       "levels":PromoterLevelInfo[]
   }

   *Response:
   bool
   */
  promoterDoCreateLevel(params, callback){
    return this.modelExecute('/Promoter/Do/CreateLevel', params, callback)
  }
  /**
   *名称：Promoter.保存 路由：/Promoter/Do/Save
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名
       "promoterName":string
       //登录名
       "loginName":string
       //密码
       "loginPwd":string
       //电话
       "phone":string
       //编号
       "promoterUserId":int
   }

   *Response:
   int
   */
  promoterDoSave(params, callback){
    return this.modelExecute('/Promoter/Do/Save', params, callback)
  }
  /**
   *名称：Promoter.列表 路由：/Promoter/Query/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //推广商编号
       "promoterUserId":int
       //推广商名称
       "promoterName":string
       //状态(N/D)
       "status":string
   }

   *Response:
   {
       //编号
       "promoterUserId":int
       //名称
       "promoterName":string
       //等级
       "promoterLevelId":int
       //等级
       "promoterLevelName":string
       //经验
       "exp":int
       //累计获利
       "sumDivideAmount":decimal
       //累计推广
       "sumWorkerCount":int
       //累计推广有效
       "sumAbleWorkerCount":int
       //累计推广接单
       "sumOrderWorkerCount":int
       //创建时间
       "registerTime":string
       //状态
       "status":string
       //登录名
       "loginName":string
       //密码
       "loginPwd":string
       //电话
       "phone":string
   }

   */
  promoterQueryList(params, callback){
    return this.modelExecute('/Promoter/Query/List', params, callback)
  }
  /**
   *名称：Promoter.等级列表 路由：/Promoter/Query/ListLevel
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //编号
       "promoterLevelId":int
       //名称
       "promoterLevelName":string
       //分成
       "promoterDivideRatio":decimal
       //所需经验
       "promoterLevelExp":int
   }

   */
  promoterQueryListLevel(params, callback){
    return this.modelExecute('/Promoter/Query/ListLevel', params, callback)
  }
  /**
   *名称：Salary.C端提现列表 路由：/Salary/CWithdrawalsList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户名
       "userName":string
       //开始申请提现时间
       "beginTime":DateTime
       //结束申请提现时间
       "endTime":DateTime
       //状态(S:已标记,A:审核中,R:驳回)
       "status":string
       //提现银行
       "bankType":string
   }

   *Response:
   {
       //提现编号
       "cashApplyId":int
       //提现用户
       "userName":string
       //提现金额
       "amount":int
       //提现银行名称
       "bankName":string
       //账号
       "bankNo":string
       //户主
       "bankUserName":string
       //提现账户
       "withdrawalsAccount":string
       //申请时间
       "applyTime":DateTime
       //申请时间(string)
       "formatApplyTime":string
       //状态(A:审核中,S:已标记,P:已通过,R:已驳回)
       "status":string
       //驳回原因
       "rejectReason":string
       //联系电话
       "mobilePhone":string
       //工人编号
       "workerUserId":int
       //银行类型
       "bankType":string
   }

   */
  salaryCWithdrawalsList(params, callback){
    return this.modelExecute('/Salary/CWithdrawalsList', params, callback)
  }
  /**
   *名称：Salary.Do.B转C 路由：/Salary/Do/BTransToC
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //金额
       "amount":decimal
       //备注
       "remark":string
       //企业编号
       "companyUserId":int
       //兼职编号
       "workerUserId":int
   }

   *Response:
   int
   */
  salaryDoBTransToC(params, callback){
    return this.modelExecute('/Salary/Do/BTransToC', params, callback)
  }
  /**
   *名称：Salary.Do.C转B 路由：/Salary/Do/CTransToB
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //金额
       "amount":decimal
       //备注
       "remark":string
       //企业编号
       "companyUserId":int
       //兼职编号
       "workerUserId":int
   }

   *Response:
   int
   */
  salaryDoCTransToB(params, callback){
    return this.modelExecute('/Salary/Do/CTransToB', params, callback)
  }
  /**
   *名称：Salary.推广商提现处理 路由：/Salary/Do/HandlePWithdraw
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //驳回原因
       "rejectReason":string
       //提现申请编号
       "withdrawId":int
       //状态(S:标记,P:支付,R:驳回)
       "status":string
   }

   *Response:
   bool
   */
  salaryDoHandlePWithdraw(params, callback){
    return this.modelExecute('/Salary/Do/HandlePWithdraw', params, callback)
  }
  /**
   *名称：Salary.Do.处理企业退款 路由：/Salary/Do/RefundAction
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //退款编号
       "refundId":int
       //状态(S2成功,S3失败)
       "refundStatus":string
       //原因
       "actionReason":string
   }

   *Response:
   bool
   */
  salaryDoRefundAction(params, callback){
    return this.modelExecute('/Salary/Do/RefundAction', params, callback)
  }
  /**
   *名称：Salary.Do.处理微信提现 路由：/Salary/Do/WxWithdrawals
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //提现编号
       "cashApplyId":int
   }

   *Response:
   bool
   */
  salaryDoWxWithdrawals(params, callback){
    return this.modelExecute('/Salary/Do/WxWithdrawals', params, callback)
  }
  /**
   *名称：Salary.推广商提现 路由：/Salary/Query/ListPWithdraw
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户名
       "promoterName":string
       //开始申请提现时间
       "beginTime":DateTime
       //结束申请提现时间
       "endTime":DateTime
       //状态(S:已标记,A:审核中,R:驳回)
       "status":string
   }

   *Response:
   {
       //提现编号
       "withdrawId":int
       //提现用户
       "promoterName":string
       //提现金额
       "amount":int
       //提现银行名称
       "bankName":string
       //账号
       "bankNo":string
       //户主
       "bankUserName":string
       //申请时间
       "withdrawTime":string
       //状态(A:审核中,S:已标记,P:已通过,R:已驳回)
       "status":string
       //驳回原因
       "rejectReason":string
       //联系电话
       "phone":string
       //推广商编号
       "promoterUserId":int
       //银行类型
       "bankType":string
   }

   */
  salaryQueryListPWithdraw(params, callback){
    return this.modelExecute('/Salary/Query/ListPWithdraw', params, callback)
  }
  /**
   *名称：Salary.Query.退款列表 路由：/Salary/Query/ListRefund
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //状态
       "refundStatusCondition":string
       //企业名称
       "companyNameCondition":string
       //时间
       "refundTimeBeginCondition":DateTime
       //时间
       "refundTimeEndCondition":DateTime
   }

   *Response:
   {
       //编号
       "refundId":int
       //金额
       "refundAmount":decimal
       //原因
       "refundReason":string
       //时间
       "showRefundTime":string
       //状态(S1申请中,S2成功,S3失败)
       "refundStatus":string
       //处理时间
       "showActionTime":string
       //处理原因
       "actionReason":string
       //企业
       "companyUserId":int
       //企业
       "companyName":string
       //处理人
       "actionUserId":int
       //处理人
       "actionUserName":string
   }

   */
  salaryQueryListRefund(params, callback){
    return this.modelExecute('/Salary/Query/ListRefund', params, callback)
  }
  /**
   *名称：充值扣款 路由：/Salary/RechargeDebit
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //账户
       "loginName":string
       //用户类型(C:企业,W:求职者)
       "userType":string
       //金额
       "amount":decimal
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  salaryRechargeDebit(params, callback){
    return this.modelExecute('/Salary/RechargeDebit', params, callback)
  }
  /**
   *名称：流水列表 路由：/Salary/TradeList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户
       "userName":string
       //开始交易时间
       "beginTime":DateTime
       //结束交易时间
       "endTime":DateTime
       //支付方式(W:微信,C:钱包,O:线下,A:全部)
       "payType":string
       //交易类型(RC:充值,PP:预付工资,PS:工资,AC:提现,AB:提现退回,PB:预付退回,DA:扣款,TA:转账)
       "transType":string
   }

   *Response:
   {
       //流水编号
       "transId":int
       //账号
       "inAccountCashId":int
       //交易金额
       "amount":int
       //交易时间
       "transTime":DateTime
       //交易时间(string)
       "formatTransTime":string
       //交易类型
       "transType":string
       //交易对象
       "outAccountCashId":int
       //支付方式(W:微信,C:钱包,O:线下)
       "payType":string
       //业务单号
       "bizNo":string
   }

   */
  salaryTradeList(params, callback){
    return this.modelExecute('/Salary/TradeList', params, callback)
  }
  /**
   *名称：修改提现状态 路由：/Salary/UpdateWithdrawalsStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //驳回原因
       "rejectReason":string
       //提现申请编号
       "cashApplyId":int
       //状态(S:标记,P:支付,R:驳回)
       "status":string
   }

   *Response:
   bool
   */
  salaryUpdateWithdrawalsStatus(params, callback){
    return this.modelExecute('/Salary/UpdateWithdrawalsStatus', params, callback)
  }
  /**
   *名称：城市标签列表 路由：/Tag/CityTagList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //城市编号
       "distictId":int
   }

   *Response:
   {
       //标签编号
       "jobTagId":int
       //标签名称
       "jobTagName":string
       //最低时薪
       "lowHourSalary":decimal
       //最低工时
       "lowWorkHours":decimal
       //是否选中
       "isCheck":string
       //图标类
       "iconClass":string
       //薪资计算类
       "salaryClass":string
   }

   */
  tagCityTagList(params, callback){
    return this.modelExecute('/Tag/CityTagList', params, callback)
  }
  tagQueryOpened(params, callback){
    return this.modelExecute('/Tag/Query/Opened', params, callback)
  }
  /**
   *名称：标签列表 路由：/Tag/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //标签名称
       "tagName":string
       //状态(N/D)
       "status":string
   }

   *Response:
   {
       //状态(N/D)
       "status":string
       //标签编号
       "jobTagId":int
       //标签名称
       "jobTagName":string
       //职能定义
       "jobDescription":string
       //图标类
       "iconClass":string
       //薪资计算类
       "salaryClass":string
   }

   */
  tagList(params, callback){
    return this.modelExecute('/Tag/List', params, callback)
  }
  /**
   *名称：新增(编辑)标签 路由：/Tag/Operation
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //薪资计算类
       "salaryClass":string
       //标签编号
       "jobTagId":int
       //标签名称
       "jobTagName":string
       //职能定义
       "jobDescription":string
       //标签类
       "iconClass":string
   }

   *Response:
   bool
   */
  tagOperation(params, callback){
    return this.modelExecute('/Tag/Operation', params, callback)
  }
  /**
   *名称：获取城市可用岗位标签列表 路由：/Tag/OrderUse
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //城市编号
       "districtId":int
   }

   *Response:
   {
       //标签名称
       "jobTagId":int
       //标签名称
       "jobTagName":string
       //最低薪水
       "lowHourSalary":decimal
       //最低工时
       "lowWorkHours":decimal
       //图标类
       "iconClass":string
       //薪资计算类
       "salaryClass":string
   }

   */
  tagOrderUse(params, callback){
    return this.modelExecute('/Tag/OrderUse', params, callback)
  }
  /**
   *名称：保存城市列表信息 路由：/Tag/SaveCityTag
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //城市编号
       "distictId":int
       //标签数据
       "jobTagData":CityJobTag[]
   }

   *Response:
   bool
   */
  tagSaveCityTag(params, callback){
    return this.modelExecute('/Tag/SaveCityTag', params, callback)
  }
  tagDoSaveSalarySetting(params, callback){
    return this.modelExecute('/Tag/Do/SaveSalarySetting', params, callback)
  }
  tagQuerySalarySetting(params, callback){
    return this.modelExecute('/Tag/Query/SalarySetting', params, callback)
  }
  /**
   *名称：修改标签状态 路由：/Tag/UpdateStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //标签编号
       "jobTagId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  tagUpdateStatus(params, callback){
    return this.modelExecute('/Tag/UpdateStatus', params, callback)
  }
  /**
   *名称：管理员详情 路由：/User/AdminInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //管理员编号
       "adminUserId":int
   }

   *Response:
   {
       //登录账号
       "loginName":string
       //姓名
       "userName":string
       //联系电话
       "mobile":string
       //邮箱
       "userMail":string
       //角色编号
       "adminRoleId":int[]
   }

   */
  userAdminInfo(params, callback){
    return this.modelExecute('/User/AdminInfo', params, callback)
  }
  /**
   *名称：管理员列表 路由：/User/AdminList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户名
       "userName":string
   }

   *Response:
   {
       //登录账号
       "loginName":string
       //姓名
       "userName":string
       //联系电话
       "mobile":string
       //邮箱
       "userMail":string
       //状态
       "status":string
       //角色编号数组
       "adminRoleIds":int[]
       //角色名称数组
       "adminRoleNames":string[]
       //管理员编号
       "adminUserId":int
       //创建时间
       "createTime":DateTime
       //创建时间(string)
       "formatCreateTime":string
       //角色编号
       "adminRoleId":int
       //角色名称
       "adminRoleName":string
   }

   */
  userAdminList(params, callback){
    return this.modelExecute('/User/AdminList', params, callback)
  }
  /**
   *名称：B端用户详情 路由：/User/BInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户编号
       "companyUserId":int
       //登录名
       "loginName":string
   }

   *Response:
   {
       //手机号码
       "contactPhone":string
       //姓名/公司名称
       "companyUserName":string
       //用户类型(P:个人,C:企业用户)
       "userType":string
       //联系人
       "contact":string
       //公司简称
       "shortName":string
       //注册时间
       "formatRegisterTime":string
       //发单状态(N/D)
       "orderStatus":string
       //用户状态(N/D)
       "status":string
       //订单自动支付时间
       "autoPayHour":int
       //余额
       "amount":decimal
       //用户照片
       "photoUrl":string
       //服务费
       "serviceChargeRate":decimal
       //授信额度
       "creditLine":decimal
       //剩余授信额度
       "residualCreditLine":decimal
       //备注
       "remark":string
       //推广人
       "promoterUserId":int
       //绑定手机
       "loginName":string
   }

   */
  userBInfo(params, callback){
    return this.modelExecute('/User/BInfo', params, callback)
  }
  /**
   *名称：B端用户列表 路由：/User/BList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //名称
       "companyUserName":string
       //手机号码
       "contactPhone":string
       //开始注册时间
       "beginTime":DateTime
       //结束注册时间
       "endTime":DateTime
       //用户类型(C:企业,P:个人)
       "userType":string
       //账号状态(N/D)
       "status":string
   }

   *Response:
   {
       //用户编号
       "companyUserId":int
       //名称
       "companyUserName":string
       //用户类型(C:企业,P:个人)
       "userType":string
       //手机号码
       "contactPhone":string
       //联系人
       "contact":string
       //自动确认支付时间
       "autoPayHour":int
       //注册时间
       "registerTime":DateTime
       //注册时间(string)
       "formatRegisterTime":string
       //发单状态(N/D)
       "orderStatus":string
       //账号状态
       "status":string
       //余额
       "amount":int
       //服务费
       "serviceChargeRate":decimal
       //授信额度
       "creditLine":decimal
       //剩余授信额度
       "residualCreditLine":decimal
   }

   */
  userBList(params, callback){
    return this.modelExecute('/User/BList', params, callback)
  }
  /**
   *名称：保存B端用户信息 路由：/User/BSaveUserInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //发单状态(N/D)
       "orderStatus":string
       //用户编号
       "companyUserId":int
       //手机号
       "contactPhone":string
       //姓名(联系人)
       "contact":string
       //公司全称
       "companyUserName":string
       //公司简称
       "shortName":string
       //账号状态(N/D)
       "status":string
       //订单自动确认时间
       "autoPayHour":int
       //用户类型(P:个人,C:企业)
       "userType":string
       //用户营业执照或身份证图片URL
       "photoUrl":string
       //服务费
       "serviceChargeRate":decimal
       //授信额度
       "creditLine ":decimal
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userBSaveUserInfo(params, callback){
    return this.modelExecute('/User/BSaveUserInfo', params, callback)
  }
  /**
   *名称：C端用户详情 路由：/User/CInfoDetails
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //登录名
       "loginName":string
       //用户编号
       "workerUserId":int
       //手机号
       "mobilePhone":string
   }

   *Response:
   {
       //手机号码
       "mobilePhone":string
       //姓名
       "userName":string
       //头像
       "headImage":string
       //性别(F/M/U)
       "sex":string
       //身高
       "height":int
       //体重
       "weight":int
       //是否在校(Y/N)
       "isStudent":string
       //注册时间
       "registerTime":DateTime
       //注册时间(string)
       "formatRegisterTime":string
       //抢单资格(N/D)
       "orderStatus":string
       //账号状态(N/D)
       "userStatus":string
       //生活照
       "lifePhoto":string[]
       //真实姓名
       "realName":string
       //身份证号
       "idCardNo":string
       //民族
       "nation":string
       //生日
       "birthday":string
       //证件照
       "photoUrl":string
       //状态(PA:通过,UP:未通过,CT:审核中)
       "realNameStatus":string
       //余额
       "amount":decimal
       //实名认证编号
       "realNameId":int
       //推广商编号
       "promoterId":int
       //备注
       "remark":string
       //后台图片
       "backgroundPics":string[]
       //英语级别(0,2,3,4,6,8)
       "englishLevel":int
       //英语图片
       "englishImg":string
       //学历级别(0无,1小学,2初中,3高中,4大专,5本科,6硕士,7博士)
       "educationLevel":int
       //渠道编号
       "promoterUserId":int
       //学历图片
       "educationImg":string
       //健康证过期时间
       "healthExpireTime":string
       //健康证图片
       "healthImg":string
       //契约分
       "contractPoint":decimal
       //普通话级别(0无,1标准,2不标准)
       "putonghuaLevel":int
       //普通话图片
       "putonghuaImg":string
       //电脑级别(0,1,2,3,4)
       "computerLevel":int
       //电脑图片
       "computerImg":string
       //线下认证
       "offlineQuality":string
       //省
       "liveProvinceId":int
       //市
       "liveCityId":int
       //区
       "liveDistrictId":int
       //地址
       "liveAddress":string
       //省
       "liveProvinceName":string
       //市
       "liveCityName":string
       //区
       "liveDistrictName":string
       //用户编号
       "workerUserId":int
   }

   */
  userCInfoDetails(params, callback){
    return this.modelExecute('/User/CInfoDetails', params, callback)
  }
  /**
   *名称：C端用户列表 路由：/User/CList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名
       "userName":string
       //手机号码
       "mobile":string
       //注册开始时间
       "beginTime":DateTime
       //注册结束时间
       "endTime":DateTime
       //实名状态(R:已实名,N:未实名,A:全部)
       "realNameStatus":string
       //账号状态(N:正常,D:封号,A:全部)
       "status":string
       //抢单状态(N:正常,D:异常,A:全部)
       "orderStatus":string
   }

   *Response:
   {
       //用户编号
       "workerUserId":int
       //姓名
       "userName":string
       //性别(F/M/U)
       "sex":string
       //手机号码
       "mobilePhone":string
       //城市
       "cityName":string
       //注册时间
       "registerTime":DateTime
       //注册时间(string)
       "formatRegisterTime":string
       //实名状态(PA:通过)
       "realNameStatus":string
       //抢单资格(N:正常,D:取消)
       "orderStatus":string
       //账号状态(N:正常,D:封号)
       "status":string
       //推广商编号
       "promoterUserId":int
       //推广商名称
       "promoterName":string
       //实名认证时间
       "realNameTime":string
   }

   */
  userCList(params, callback){
    return this.modelExecute('/User/CList', params, callback)
  }
  /**
   *名称：生成验证码 路由：/User/CreateCode
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //验证码序列号
       "codeSn":string
       //BASEB4编码
       "base64Image":string
   }

   */
  userCreateCode(params, callback){
    return this.modelExecute('/User/CreateCode', params, callback)
  }
  /**
   *名称：保存C端用户信息 路由：/User/CSaveInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户编号
       "workerUserId":int
       //普通话级别(0无,1标准,2不标准)
       "putonghuaLevel":int
       //姓名
       "userName":string
       //性别(F/M/U)
       "sex":string
       //身高
       "height":int
       //体重
       "weight":int
       //是否在校(N/D)
       "isStudent":string
       //头像
       "headImage":string
       //生活照
       "lifePhoto":string[]
       //后台照片
       "backgroundPics":string[]
       //英语级别(0,2,3,4,6,8)
       "englishLevel":int
       //英语图片
       "englishImg":string
       //学历级别(0无,1小学,2初中,3高中,4大专,5本科,6硕士,7博士)
       "educationLevel":int
       //学历图片
       "educationImg":string
       //健康证过期时间
       "healthExpireTime":DateTime
       //健康证图片
       "healthImg":string
       //电脑图片
       "computerImg":string
       //线下认证
       "offlineQuality":string
       //省
       "liveProvinceId":int
       //市
       "liveCityId":int
       //区
       "liveDistrictId":int
       //地址
       "liveAddress":string
       //普通话图片
       "putonghuaImg":string
       //电脑级别(0,1,2,3,4)
       "computerLevel":int
   }

   *Response:
   bool
   */
  userCSaveInfo(params, callback){
    return this.modelExecute('/User/CSaveInfo', params, callback)
  }
  /**
   *名称：User.C注销 路由：/User/Do/CCancellation
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户编号
       "workerUserId":int
       //原因
       "cancellationReason":string
   }

   *Response:
   bool
   */
  userDoCCancellation(params, callback){
    return this.modelExecute('/User/Do/CCancellation', params, callback)
  }
  /**
   *名称：User.C修改手机号 路由：/User/Do/CChangeMobile
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户编号
       "workerUserId":int
       //新手机号
       "newMobile":string
   }

   *Response:
   bool
   */
  userDoCChangeMobile(params, callback){
    return this.modelExecute('/User/Do/CChangeMobile', params, callback)
  }
  /**
   *名称：User.取消抢单资格 路由：/User/Do/CChangeOrderStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //编号
       "userId":int
       //状态(N,D)
       "orderStatus":string
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userDoCChangeOrderStatus(params, callback){
    return this.modelExecute('/User/Do/CChangeOrderStatus', params, callback)
  }
  /**
   *名称：User.C端封号 路由：/User/Do/CChangeStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //编号
       "userId":int
       //状态(N,D)
       "status":string
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userDoCChangeStatus(params, callback){
    return this.modelExecute('/User/Do/CChangeStatus', params, callback)
  }
  /**
   *名称：User.调整契约分 路由：/User/Do/ChangeContract
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
       //调整分
       "changePoint":decimal
       //原因
       "changeReason":string
   }

   *Response:
   int
   */
  userDoChangeContract(params, callback){
    return this.modelExecute('/User/Do/ChangeContract', params, callback)
  }
  /**
   *名称：User.企业备注 路由：/User/Do/RemarkC
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //企业编号
       "userId":int
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userDoRemarkC(params, callback){
    return this.modelExecute('/User/Do/RemarkC', params, callback)
  }
  /**
   *名称：User.求职者备注 路由：/User/Do/RemarkW
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //编号
       "userId":int
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userDoRemarkW(params, callback){
    return this.modelExecute('/User/Do/RemarkW', params, callback)
  }
  /**
   *名称：反馈详情 路由：/User/FeedBackDetails
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //反馈编号
       "feedbackId":int
   }

   *Response:
   {
       //用户手机
       "mobile":string
       //用户名
       "userName":string
       //用户类型(W/C)
       "userType":string
       //反馈内容
       "content":string
       //备注
       "actionResult":string
       //反馈编号
       "feedbackId":int
       //状态
       "status":string
   }

   */
  userFeedBackDetails(params, callback){
    return this.modelExecute('/User/FeedBackDetails', params, callback)
  }
  /**
   *名称：反馈列表 路由：/User/FeedBackList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //手机号
       "mobilePhone":string
       //状态(W:待处理,O:已处理,A:全部)
       "status":string
   }

   *Response:
   {
       //反馈编号
       "feedbackId":int
       //反馈账号
       "loginName":string
       //反馈角色(B:B端,C:C端)
       "userType":string
       //反馈内容
       "content":string
       //反馈时间
       "feedbackTime":DateTime
       //反馈时间(string)
       "formatFeedbackTime":string
       //状态(W:未处理,O:已处理)
       "status":string
   }

   */
  userFeedBackList(params, callback){
    return this.modelExecute('/User/FeedBackList', params, callback)
  }
  /**
   *名称：上传身份证 路由：/User/IdCardImageUpload
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //图片路劲
       "url":string
       //姓名
       "realName":string
       //身份证号
       "idCardNo":string
       //民族
       "nation":string
   }

   */
  userIdCardImageUpload(params, callback){
    return this.modelExecute('/User/IdCardImageUpload', params, callback)
  }
  /**
   *名称：User.收藏.新增 路由：/User/Like/Create
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //企业编号
       "companyUserId":int
       //工人编号
       "workerUserId":int
       //保质期
       "days":int
   }

   *Response:
   int
   */
  userLikeCreate(params, callback){
    return this.modelExecute('/User/Like/Create', params, callback)
  }
  /**
   *名称：User.收藏.延期 路由：/User/Like/Delay
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //收藏编号
       "likeId":int
       //延期时间
       "days":int
   }

   *Response:
   bool
   */
  userLikeDelay(params, callback){
    return this.modelExecute('/User/Like/Delay', params, callback)
  }
  /**
   *名称：User.收藏.删除 路由：/User/Like/Delete
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //收藏编号
       "likeId":int
   }

   *Response:
   bool
   */
  userLikeDelete(params, callback){
    return this.modelExecute('/User/Like/Delete', params, callback)
  }
  /**
   *名称：User.收藏.列表 路由：/User/Like/ListC
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名或手机号
       "userNameOrMobile":string
       //企业编号
       "companyUserId":int
       //显示过期(0不,1显示)
       "showExpire":int
   }

   *Response:
   {
       //收藏编号
       "likeId":int
       //工人编号
       "workerUserId":int
       //工人姓名
       "userName":string
       //性别
       "sex":string
       //抢单资格
       "orderStatus":string
       //抢单资格
       "orderStatusText":string
       //状态
       "status":string
       //状态
       "statusText":string
       //完成单数
       "completeOrderCount":int
       //最后接单时间
       "lastOrderTime":string
       //收藏时间
       "likeTime":string
       //收藏过期时间
       "likeExpireTime":string
       //收藏类型
       "likeType":string
       //收藏人
       "likeUserId":int
       //收藏人
       "likeUserName":string
       //电话
       "mobilePhone":string
   }

   */
  userLikeListC(params, callback){
    return this.modelExecute('/User/Like/ListC', params, callback)
  }
  /**
   *名称：User.收藏.被列表 路由：/User/Like/ListW
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
       //企业名称
       "companyUserName":string
   }

   *Response:
   {
       //收藏编号
       "likeId":int
       //企业编号
       "companyUserId":int
       //企业名称
       "companyUserName":string
       //工人编号
       "workerUserId":int
       //企业简称
       "shortName":string
       //企业类型
       "userType":string
       //企业类型
       "userTypeText":string
       //状态
       "status":string
       //状态
       "statusText":string
       //收藏时间
       "likeTime":string
       //收藏过期时间
       "likeExpireTime":string
       //收藏类型
       "likeType":string
       //收藏人
       "likeUserId":int
       //收藏人
       "likeUserName":string
   }

   */
  userLikeListW(params, callback){
    return this.modelExecute('/User/Like/ListW', params, callback)
  }
  /**
   *名称：User.收藏.配置 路由：/User/Like/SettingDetail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //企业编号
       "companyUserId":int
   }

   *Response:
   {
       //企业编号
       "companyUserId":int
       //是否开启
       "isOpen":string
       //个数限制
       "likeCountLimit":int
       //服务有效期
       "likeServicesLimit":string
   }

   */
  userLikeSettingDetail(params, callback){
    return this.modelExecute('/User/Like/SettingDetail', params, callback)
  }
  /**
   *名称：User.收藏.保存配置 路由：/User/Like/SettingSave
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //企业编号
       "companyUserId":int
       //是否开启
       "isOpen":string
       //个数限制
       "likeCountLimit":int
       //服务有效期
       "likeServicesLimit":DateTime
   }

   *Response:
   int
   */
  userLikeSettingSave(params, callback){
    return this.modelExecute('/User/Like/SettingSave', params, callback)
  }
  /**
   *名称：User.黑名单.新增 路由：/User/Loathe/Create
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //企业编号
       "companyUserId":int
       //工人编号
       "workerUserId":int
       //拉黑原因
       "loatheReason":string
   }

   *Response:
   int
   */
  userLoatheCreate(params, callback){
    return this.modelExecute('/User/Loathe/Create', params, callback)
  }
  /**
   *名称：User.黑名单.删除 路由：/User/Loathe/Delete
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //黑名单编号
       "loatheId":int
   }

   *Response:
   bool
   */
  userLoatheDelete(params, callback){
    return this.modelExecute('/User/Loathe/Delete', params, callback)
  }
  /**
   *名称：User.黑名单.列表 路由：/User/Loathe/ListC
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名或手机号
       "userNameOrMobile":string
       //企业编号
       "companyUserId":int
   }

   *Response:
   {
       //拉黑编号
       "loatheId":int
       //工人编号
       "workerUserId":int
       //工人名
       "userName":string
       //性别
       "sex":string
       //抢单资格
       "orderStatus":string
       //抢单资格
       "orderStatusText":string
       //状态
       "status":string
       //状态
       "statusText":string
       //拉黑原因
       "loatheReason":string
       //拉黑类型
       "loatheType":string
       //拉黑时间
       "loatheTime":string
       //拉黑人
       "loatheUserId":int
       //拉黑人
       "loatheUserName":string
       //电话
       "mobilePhone":string
   }

   */
  userLoatheListC(params, callback){
    return this.modelExecute('/User/Loathe/ListC', params, callback)
  }
  /**
   *名称：User.黑名单.被列表 路由：/User/Loathe/ListW
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
       //企业名称
       "companyUserName":string
   }

   *Response:
   {
       //拉黑编号
       "loatheId":int
       //企业编号
       "companyUserId":int
       //企业名称
       "companyName":string
       //工人编号
       "workerUserId":int
       //企业简称
       "shortName":string
       //企业类型
       "userType":string
       //企业类型
       "userTypeText":string
       //状态
       "status":string
       //状态
       "statusText":string
       //拉黑原因
       "loatheReason":string
       //拉黑类型
       "loatheType":string
       //拉黑时间
       "loatheTime":string
       //拉黑人
       "loatheUserId":int
       //拉黑人
       "loatheUserName":string
   }

   */
  userLoatheListW(params, callback){
    return this.modelExecute('/User/Loathe/ListW', params, callback)
  }
  /**
   *名称：登录 路由：/User/Login
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //登录名
       "loginName":string
       //密码
       "loginPwd":string
       //验证码序列号
       "codeSn":string
       //验证码
       "code":string
   }

   *Response:
   {
       //会话编号
       "sessionId":string
       //权限
       "permissionFullModel":PermissionFull[]
       //用户名
       "userName":string
       //用户编号
       "adminUserId":int
       //联系电话
       "mobile":string
       //Email
       "userMail":string
       //角色编号
       "adminRoleIds":int[]
   }

   */
  userLogin(params, callback){
    return this.modelExecute('/User/Login', params, callback)
  }
  /**
   *名称：新增(编辑)管理员 路由：/User/OperationAdmin
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //登录名
       "loginName":string
       //密码
       "loginPwd":string
       //姓名
       "userName":string
       //联系电话
       "mobile":string
       //邮箱
       "userMaile":string
       //角色编号
       "adminRoleIds":int[]
       //管理员编号
       "adminUserId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  userOperationAdmin(params, callback){
    return this.modelExecute('/User/OperationAdmin', params, callback)
  }
  /**
   *名称：User.查询变更记录 路由：/User/Query/Change
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //W为求职者
       "userType":string
       //用户编号
       "userId":int
       //抢单资格OrderStatus，账号状态Status
       "column":string
   }

   *Response:
   {
       //备注
       "remark":string
       //编号
       "id":int
       //旧值
       "oldVal":string
       //新值
       "newVal":string
       //列
       "column":string
       //操作人
       "actionUserId":int
       //操作人
       "actionUserName":string
       //操作时间
       "actionTime":string
   }

   */
  userQueryChange(params, callback){
    return this.modelExecute('/User/Query/Change', params, callback)
  }
  /**
   *名称：User.契约精神记录 路由：/User/Query/ListContract
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
   }

   *Response:
   {
       //历史编号
       "historyId":int
       //分
       "changePoint":decimal
       //变动后分
       "point":decimal
       //原因
       "changeReason":string
       //时间
       "changeTime":string
       //操作人
       "changeAminUser":string
       //类型
       "changeType":string
       //类型
       "changeTypeText":string
   }

   */
  userQueryListContract(params, callback){
    return this.modelExecute('/User/Query/ListContract', params, callback)
  }
  /**
   *名称：User.订单信息 路由：/User/Query/ListOrder
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
       //标签
       "jobTagId":int
       //接单模式
       "applyType":string
       //取消类型
       "cancelType":string
       //状态
       "subStatus":int
       //事件订单
       "hasEvent":int
       //工作时间
       "workBeginTime":DateTime
       //工作时间
       "workEndTime":DateTime
   }

   *Response:
   {
       //子订单编号
       "orderSubId":int
       //子订单号
       "orderSubNo":string
       //标题
       "orderTitle":string
       //企业编号
       "companyUserId":int
       //企业名
       "companyName":string
       //标签
       "jobTagId":int
       //标签
       "jobTagName":string
       //联系人
       "orderContact":string
       //联系电话
       "orderPhone":string
       //上班时间
       "beginTime":string
       //下班时间
       "endTime":string
       //每日薪资
       "singleSalary":decimal
       //服务费
       "singleServiceCharge":decimal
       //包水饭(Y/N)
       "hasEating":string
       //完工结
       "overPay":string
       //有无调整
       "hasChange":int
       //有无事件(0没有,1已处理,2未处理)
       "hasEvent":int
       //状态
       "subStatusText":string
       //抢单时间
       "applyTime":string
       //签到时间
       "clockOnTime":string
       //签到地址
       "clockOnAddress":string
       //签退时间
       "clockOffTime":string
       //签退地址
       "clockOffAddress":string
       //上班日期
       "workDate":string
       //状态(1预约中,2待上班,3上班中,4待支付,5已支付,6取消)
       "subStatus":int
       //抢单类型
       "applyType":string
       //完结类型
       "overType":string
       //自动支付时间
       "showAutoPayTime":string
       //自动支付倒计时
       "autoPayMinutes":int
   }

   */
  userQueryListOrder(params, callback){
    return this.modelExecute('/User/Query/ListOrder', params, callback)
  }
  /**
   *名称：User.Query.订单统计 路由：/User/Query/ListOrderStatistics
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //工人编号
       "workerUserId":int
   }

   *Response:
   {
       //完工数
       "overCount":int
       //取消数
       "cancelCount":int
       //执行数
       "doingCount":int
   }

   */
  userQueryListOrderStatistics(params, callback){
    return this.modelExecute('/User/Query/ListOrderStatistics', params, callback)
  }
  /**
   *名称：User.Query.流水列表 路由：/User/Query/ListTrade
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户编号
       "accountUserId":int
       //用户类型(C企业,W工人)
       "accountType":string
   }

   *Response:
   {
       //流水编号
       "tradeId":int
       //流水编号
       "tradeNo":string
       //交易金额
       "amount":decimal
       //交易内容
       "tradeTitle":string
       //交易时间
       "showTradeTime":string
       //交易对象
       "tradeUserName":string
       //余额
       "lastAmount":decimal
   }

   */
  userQueryListTrade(params, callback){
    return this.modelExecute('/User/Query/ListTrade', params, callback)
  }
  /**
   *名称：省市区列表 路由：/User/RegionList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //编号
       "distictId":int
       //名称
       "districtName":string
       //父级
       "parentId":int
       //CityCode
       "cityCode":string
       //CityCode
       "districtCode":string
   }

   */
  userRegionList(params, callback){
    return this.modelExecute('/User/RegionList', params, callback)
  }
  /**
   *名称：角色详情 路由：/User/RoleDetails
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //角色编号
       "adminRoleId":int
   }

   *Response:
   {
       //权限列表
       "permissions":PermissionFull[]
   }

   */
  userRoleDetails(params, callback){
    return this.modelExecute('/User/RoleDetails', params, callback)
  }
  /**
   *名称：角色列表 路由：/User/RoleList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //角色编号
       "adminRoleId":int
       //角色名称
       "adminRoleName":string
   }

   */
  userRoleList(params, callback){
    return this.modelExecute('/User/RoleList', params, callback)
  }
  /**
   *名称：角色删除(重命名) 路由：/User/RoleOperation
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //角色编号
       "adminRoleId":int
       //角色名称
       "adminRoleName":string
       //是否删除(Y/N)
       "isDelete":string
   }

   *Response:
   bool
   */
  userRoleOperation(params, callback){
    return this.modelExecute('/User/RoleOperation', params, callback)
  }
  /**
   *名称：角色权限修改 路由：/User/RolePut
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //角色编号
       "adminRoleId":int
       //权限数组
       "menuIds":int[]
   }

   *Response:
   bool
   */
  userRolePut(params, callback){
    return this.modelExecute('/User/RolePut', params, callback)
  }
  /**
   *名称：保存反馈备注 路由：/User/SaveFeedBackRemark
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //反馈编号
       "feedbackId":int
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  userSaveFeedBackRemark(params, callback){
    return this.modelExecute('/User/SaveFeedBackRemark', params, callback)
  }
  /**
   *名称：保存C端实名认证信息 路由：/User/SaveRealNameInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名
       "realName":string
       //身份证号
       "idCardNo":string
       //民族
       "nation":string
       //生日
       "birthday":DateTime
       //状态(PA:通过,UP:未通过)
       "status":string
       //图片地址
       "idCardUrl":string
       //用户编号
       "workerUserId":int
       //实名类型(I身份证,P护照,G港澳,T台)
       "realNameType":string
       //性别(F女,M男)
       "sex":string
       //实名编号
       "realNameId":int
   }

   *Response:
   bool
   */
  userSaveRealNameInfo(params, callback){
    return this.modelExecute('/User/SaveRealNameInfo', params, callback)
  }
  /**
   *名称：修改反馈状态 路由：/User/UpdateFeedBackStatus
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //反馈编号
       "feedbackId":int
       //状态(O:已处理)
       "status":string
   }

   *Response:
   bool
   */
  userUpdateFeedBackStatus(params, callback){
    return this.modelExecute('/User/UpdateFeedBackStatus', params, callback)
  }
  /**
   *名称：管理员修改密码 路由：/User/UpdatePwd
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //原密码
       "oldPwd":string
       //新密码
       "newPwd":string
   }

   *Response:
   bool
   */
  userUpdatePwd(params, callback){
    return this.modelExecute('/User/UpdatePwd', params, callback)
  }
}
