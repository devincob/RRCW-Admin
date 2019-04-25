/*
**本代码由生成器自动生成，请勿手动修改
**生成时间：2019-03-28 10:57:11
*/
import Model from '../libs/model'
export default class MSModel extends Model {
  /**
   *名称：业绩.商务数据 路由：/Achievement/Bussiness/Data
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
   }

   *Response:
   {
       //订单总数
       "orderCount":int
       //进行中
       "orderDoingCount":int
       //完成数
       "orderCompletedCount":int
       //订单金额
       "orderAmount":string
       //待确认
       "orderDoingAmount":string
       //已确认
       "orderCompletedAmount":string
   }

   */
  achievementBussinessData(params, callback){
    return this.modelExecute('/Achievement/Bussiness/Data', params, callback)
  }
  /**
   *名称：业绩.商务订单 路由：/Achievement/Bussiness/Orders
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //1待我处理,2财务收款,3交易员处理,4已完成
       "queryType":int
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户姓名
       "customerName":string
       //税源地名称
       "sourceTaxName":string
       //商品名称
       "goodsName":string
       //开票金额
       "invoiceAmount":decimal
       //发票类型
       "invoiceTypeName":string
       //是否加急
       "isPriority":string
       //流程名称
       "workflowName":string
       //流程Id
       "workflowId":int
       //创建时间
       "createTime":string
       //0轮到我加急,1轮到我,3其他
       "myHandle":int
       //订单完成时间
       "orderCompletedTime":string
       //税源地编号
       "sourceTaxId":int
       //当前处理人
       "handleAdminUserName":string
       //商务提交时间
       "submitTime":string
       //站点名称
       "companyName":string
       //站点Id
       "companyId":int
       //商品编号
       "goodsId":int
       //是否差额订单
       "isDiff":string
       //商务编号
       "createAdminUserId":int
       //商务名
       "bussinessName":string
   }

   */
  achievementBussinessOrders(params, callback){
    return this.modelExecute('/Achievement/Bussiness/Orders', params, callback)
  }
  /**
   *名称：人员.详情 路由：/AdminUser/Detail
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
       //系统角色编号
       "adminRoleId":int
       //创建时间(string)
       "showCreateTime":string
       //状态
       "status":string
       //管理员编号
       "adminUserId":int
       //系统角色
       "adminRoleName":string
       //流程角色编号
       "flowRoleId":int
       //流程角色
       "flowRoleName":string
       //数据隔离(Y/N)
       "dataControl":string
       //职位
       "position":string
   }

   */
  adminUserDetail(params, callback){
    return this.modelExecute('/AdminUser/Detail', params, callback)
  }
  /**
   *名称：人员.列表 路由：/AdminUser/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //用户名
       "userName":string
   }

   *Response:
   {
       //系统角色编号
       "adminRoleId":int
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
       //管理员编号
       "adminUserId":int
       //创建时间(string)
       "showCreateTime":string
       //流程角色编号
       "flowRoleId":int
       //系统角色
       "adminRoleName":string
       //流程角色
       "flowRoleName":string
       //数据隔离(Y/N)
       "dataControl":string
       //职位
       "position":string
   }

   */
  adminUserList(params, callback){
    return this.modelExecute('/AdminUser/List', params, callback)
  }
  /**
   *名称：人员.新增/编辑 路由：/AdminUser/Modify
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
       "userMail":string
       //系统角色
       "adminRoleId":int
       //管理员编号
       "adminUserId":int
       //状态(N/D)
       "status":string
       //流程角色
       "flowRoleId":int
       //职位
       "position":string
       //数据隔离(Y/N)
       "dataControl":string
   }

   *Response:
   int
   */
  adminUserModify(params, callback){
    return this.modelExecute('/AdminUser/Modify', params, callback)
  }
  /**
   *名称：人员.修改状态 路由：/AdminUser/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //管理员编号
       "adminUserId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  adminUserUpdate(params, callback){
    return this.modelExecute('/AdminUser/Update', params, callback)
  }
  /**
   *名称：人员.修改密码 路由：/AdminUser/UpdatePwd
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
  adminUserUpdatePwd(params, callback){
    return this.modelExecute('/AdminUser/UpdatePwd', params, callback)
  }
  /**
   *名称：渠道.详情 路由：/Channel/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //渠道编号
       "channelId":int
   }

   *Response:
   {
       //渠道编号
       "channelId":int
       //渠道名称
       "channelName":string
       //渠道联系人
       "channelContact":string
       //渠道联系电话
       "channelPhone":string
       //渠道分成比例
       "channelRatio":string
       //渠道状态
       "channelStatus":string
   }

   */
  channelDetail(params, callback){
    return this.modelExecute('/Channel/Detail', params, callback)
  }
  /**
   *名称：渠道.列表 路由：/Channel/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //渠道名称
       "channelName":string
       //渠道联系人
       "channelContact":string
   }

   *Response:
   {
       //渠道编号
       "channelId":int
       //渠道名称
       "channelName":string
       //渠道联系人
       "channelContact":string
       //渠道联系电话
       "channelPhone":string
       //渠道分成比例
       "channelRatio":string
       //渠道状态
       "channelStatus":string
   }

   */
  channelList(params, callback){
    return this.modelExecute('/Channel/List', params, callback)
  }
  /**
   *名称：渠道.新增/编辑 路由：/Channel/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //渠道编号
       "channelId":int
       //渠道名称
       "channelName":string
       //渠道联系人
       "channelContact":string
       //渠道联系电话
       "channelPhone":string
       //渠道分成比例
       "channelRatio":int
       //状态(N,D)
       "channelStatus":string
   }

   *Response:
   int
   */
  channelModify(params, callback){
    return this.modelExecute('/Channel/Modify', params, callback)
  }
  /**
   *名称：渠道.修改状态 路由：/Channel/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //渠道编号
       "channelId":int
       //状态(N/D)
       "channelStatus":string
   }

   *Response:
   bool
   */
  channelUpdate(params, callback){
    return this.modelExecute('/Channel/Update', params, callback)
  }
  /**
   *名称：通用.查询公司开票信息 路由：/Common/Company/Invoce
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司编号
       "companyId":string
   }

   *Response:
   {
       //公司名称
       "companyName":string
       //公司税号
       "companyTaxNo":string
       //公司注册地址
       "companyAddress":string
       //公司电话
       "companyPhone":string
       //开户银行
       "companyBankName":string
       //开户银行账号
       "companyBankAccount":string
   }

   */
  commonCompanyInvoce(params, callback){
    return this.modelExecute('/Common/Company/Invoce', params, callback)
  }
  /**
   *名称：通用.生成验证码 路由：/Common/CreateCode
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
  commonCreateCode(params, callback){
    return this.modelExecute('/Common/CreateCode', params, callback)
  }
  /**
   *名称：通用.获取服务器时间 路由：/Common/GetServerTime
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
  commonGetServerTime(params, callback){
    return this.modelExecute('/Common/GetServerTime', params, callback)
  }
  /**
   *名称：通用.上传图片 路由：/Common/ImageUpload
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
   *名称：通用.查询公司信息 路由：/Common/Invoice/Company
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司名称
       "companyName":string
   }

   *Response:
   {
       //公司编号
       "companyId":string
       //公司名称
       "companyName":string
   }

   */
  commonInvoiceQuery(params, callback){
    return this.modelExecute('/Common/Invoice/Company', params, callback)
  }
  /**
   *名称：通用.商务列表 路由：/Common/ListBelongAdminUser
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
   }

   *Response:
   {
       //编号
       "adminUserId":int
       //名字
       "userName":string
   }

   */
  commonListBelongAdminUser(params, callback){
    return this.modelExecute('/Common/ListBelongAdminUser', params, callback)
  }
  /**
   *名称：通用.所属站点 路由：/Common/List/BelongCompany
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //站点名称
       "companyName":string
   }

   *Response:
   {
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
   }

   */
  commonListBelongCompany(params, callback){
    return this.modelExecute('/Common/List/BelongCompany', params, callback)
  }
  /**
   *名称：通用.渠道列表 路由：/Common/List/Channel
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //渠道名称
       "channelName":string
   }

   *Response:
   {
       //渠道编号
       "channelId":int
       //渠道名称
       "channelName":string
   }

   */
  commonListChannel(params, callback){
    return this.modelExecute('/Common/List/Channel', params, callback)
  }
  /**
   *名称：通用.公司列表 路由：/Common/ListCompany
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
   }

   *Response:
   {
       //公司编号
       "companyId":int
       //公司名
       "companyName":string
   }

   */
  commonListCompany(params, callback){
    return this.modelExecute('/Common/ListCompany', params, callback)
  }
  /**
   *名称：通用.查询全部站点 路由：/Common/List/CompanyAll
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司名
       "companyName":string
   }

   *Response:
   {
       //公司编号
       "companyId":int
       //公司名
       "companyName":string
   }

   */
  commonListCompanyAll(params, callback){
    return this.modelExecute('/Common/List/CompanyAll', params, callback)
  }
  /**
   *名称：通用.公司类型列表 路由：/Common/ListCompanyType
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //公司类型编号
       "companyTypeId":int
       //名称
       "companyTypeName":string
       //经营范围
       "businessScope":string
       //项目
       "invoiceContents":string[]
   }

   */
  commonListCompanyType(params, callback){
    return this.modelExecute('/Common/ListCompanyType', params, callback)
  }
  /**
   *名称：通用.客户列表 路由：/Common/ListCustomer
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户名条件
       "costomerName":string
   }

   *Response:
   {
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
   }

   */
  commonListCustomer(params, callback){
    return this.modelExecute('/Common/ListCustomer', params, callback)
  }
  /**
   *名称：通用.部门列表 路由：/Common/ListDept
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //部门编号(人工填入)
       "deptId":int
       //部门名称
       "deptName":string
       //上级部分编号
       "parentDeptId":int
       //部门负责人
       "deptUserId":int
       //部门级别
       "deptLevel":int
   }

   */
  commonListDept(params, callback){
    return this.modelExecute('/Common/ListDept', params, callback)
  }
  /**
   *名称：通用.区域列表 路由：/Common/ListDistict
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
       //级别
       "level":string
   }

   */
  commonListDistict(params, callback){
    return this.modelExecute('/Common/ListDistict', params, callback)
  }
  /**
   *名称：通用.商品列表 路由：/Common/ListGoods
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //商品编号
       "goodsId":int
       //商品名
       "goodsName":string
       //纳税性质(N一般,S小规模)
       "taxType":string
       //发票类型
       "invoiceTypeId":int
       //发票类型名称
       "invoiceTypeName":string
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //开户服务费
       "serviceCharge":decimal
       //开户押金
       "deposit":decimal
   }

   */
  commonListGoods(params, callback){
    return this.modelExecute('/Common/ListGoods', params, callback)
  }
  /**
   *名称：通用.项目列表 路由：/Common/ListInvoiceContent
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //站点类型编号
       "companyTypeId":int
   }

   *Response:
   {
       //项目
       "content":string
   }

   */
  commonListInvoiceContent(params, callback){
    return this.modelExecute('/Common/ListInvoiceContent', params, callback)
  }
  /**
   *名称：通用.发票类型列表 路由：/Common/ListInvoiceType
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //类型编号
       "invoiceTypeId":int
       //发票名称
       "invoiceTypeName":string
       //发票税率
       "invoiceTypeTax":decimal
   }

   */
  commonListInvoiceType(params, callback){
    return this.modelExecute('/Common/ListInvoiceType', params, callback)
  }
  /**
   *名称：通用.税源地列表 路由：/Common/ListSourceTax
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //税源地编号
       "sourceTaxId":int
       //税源地名称
       "sourceTaxName":string
       //增值税返税比率
       "zZSRatio":decimal
       //个税返税比率
       "gRSDSRatio":decimal
       //附加税返税比率
       "fJSRatio":decimal
       //印花税返税比率
       "yHSRatio":decimal
       //是否需要财务身份证复印件(Y/N)
       "isNeedFinanceID":string
   }

   */
  commonListSourceTax(params, callback){
    return this.modelExecute('/Common/ListSourceTax', params, callback)
  }
  /**
   *名称：通用.登录 路由：/Common/Login
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
       //系统角色编号
       "adminRoleId":int
       //系统角色
       "adminRoleName":string
       //流程角色编号
       "flowRoleId":int
       //流程角色
       "flowRoleName":string
       //数据隔离(Y/N)
       "dataControl":string
       //职位
       "position":string
   }

   */
  commonLogin(params, callback){
    return this.modelExecute('/Common/Login', params, callback)
  }
  /**
   *名称：通用.退出 路由：/Common/Logout
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   bool
   */
  commonLogout(params, callback){
    return this.modelExecute('/Common/Logout', params, callback)
  }
  /**
   *名称：公司.详情 路由：/Company/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司编号
       "companyId":int
   }

   *Response:
   {
       //备注
       "remark":string
       //站点地址
       "companyAddress":string
       //税号
       "taxNo":string
       //公司电话
       "companyPhone":string
       //开户银行
       "accountBank":string
       //开户银行账号
       "accountBankAccount":string
       //服务费折扣
       "serviceFeeDiscount":decimal
       //供应商编号
       "supplierId":int
       //供应商名称
       "supplierName":string
       //公司编号
       "companyId":int
       //公司名
       "companyName":string
       //客户编号
       "customerId":int
       //姓名
       "customerName":string
       //税源地编号
       "sourceTaxId":int
       //税源地名称
       "sourceTaxName":string
       //商品编号
       "goodsId":int
       //商品名
       "goodsName":string
       //执照地址
       "licenseUrl":string
       //状态(N/D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //类型
       "companyTypeName":string
       //发票类型
       "invoiceTypeNames":string[]
       //项目
       "invoiceContents":string[]
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //企业类型
       "companyTypeId":int
       //经营范围
       "businessScope":string
       //费率可变(Y/N)
       "isInvoiceServiceRatioChangeable":string
       //法人
       "investorName":string
       //商务
       "bussinessName":string
   }

   */
  companyDetail(params, callback){
    return this.modelExecute('/Company/Detail', params, callback)
  }
  /**
   *名称：公司.列表 路由：/Company/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户名
       "customerName":string
       //公司名
       "companyName":string
       //税源地
       "sourceTaxId":int
       //商品
       "goodsId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   {
       //公司编号
       "companyId":int
       //公司名
       "companyName":string
       //客户编号
       "customerId":int
       //姓名
       "customerName":string
       //税源地编号
       "sourceTaxId":int
       //税源地名称
       "sourceTaxName":string
       //商品编号
       "goodsId":int
       //商品名
       "goodsName":string
       //执照地址
       "licenseUrl":string
       //状态(N/D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //类型
       "companyTypeName":string
       //服务费折扣
       "serviceFeeDiscount":decimal
       //企业类型
       "companyTypeId":int
       //经营范围
       "businessScope":string
   }

   */
  companyList(params, callback){
    return this.modelExecute('/Company/List', params, callback)
  }
  /**
   *名称：公司.新增/编辑 路由：/Company/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司名
       "companyName":string
       //税源地编号
       "sourceTaxId":int
       //商品编号
       "goodsId":int
       //客户编号
       "customerId":int
       //执照地址
       "licenseUrl":string
       //状态(N/D)
       "status":string
       //企业类型编号
       "companyTypeId":int
       //备注
       "remark":string
       //公司编号(0新增,其他编辑)
       "companyId":int
       //站点地址
       "companyAddress":string
       //税号
       "taxNo":string
       //公司电话
       "companyPhone":string
       //开户银行
       "accountBank":string
       //开户银行账号
       "accountBankAccount":string
       //服务费折扣
       "serviceFeeDiscount":decimal
   }

   *Response:
   int
   */
  companyModify(params, callback){
    return this.modelExecute('/Company/Modify', params, callback)
  }
  /**
   *名称：站点.开票统计 路由：/Company/Statistics/Invoice
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //站点编号
       "companyId":int
   }

   *Response:
   {
       //订单号
       "orderId":int
       //站点吗
       "companyName":string
       //开票金额
       "invoiceAmount":decimal
       //发票类型
       "invoiceTypeName":string
       //提交时间
       "submitTime":string
       //完成时间
       "orderCompletedTime":string
       //流程编号
       "workflowId":int
       //流程名称
       "workflowName":string
   }

   */
  companyStatisticsInvoice(params, callback){
    return this.modelExecute('/Company/Statistics/Invoice', params, callback)
  }
  /**
   *名称：站点.流水统计 路由：/Company/Statistics/Water
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //站点编号
       "companyId":int
   }

   *Response:
   {
       //交易方
       "traderName":string
       //贷方发生额
       "sumInAmount":decimal
       //借方发生额
       "sumOutAmount":decimal
       //交易次数
       "tradeCount":int
   }

   */
  companyStatisticsWater(params, callback){
    return this.modelExecute('/Company/Statistics/Water', params, callback)
  }
  /**
   *名称：站点.开票合计 路由：/Company/Sum/Invoice
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //站点编号
       "companyId":int
   }

   *Response:
   {
       //累计金额
       "sumInvoiceAmount":decimal
       //开票次数
       "invoiceCount":int
       //最后开票日期
       "lastInvoiceTime":string
   }

   */
  companySumInvoice(params, callback){
    return this.modelExecute('/Company/Sum/Invoice', params, callback)
  }
  /**
   *名称：站点.流水合计 路由：/Company/Sum/Water
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //站点编号
       "companyId":int
   }

   *Response:
   {
       //交易次数
       "tradeCount":int
       //贷方发生额
       "sumInAmount":decimal
       //借方发生额
       "sumOutAmount":decimal
   }

   */
  companySumWater(params, callback){
    return this.modelExecute('/Company/Sum/Water', params, callback)
  }
  /**
   *名称：公司.修改状态 路由：/Company/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //公司编号
       "companyId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  companyUpdate(params, callback){
    return this.modelExecute('/Company/Update', params, callback)
  }
  /**
   *名称：公司类型.详情 路由：/CompanyType/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //类型编号
       "companyTypeId":int
   }

   *Response:
   {
       //公司类型编号
       "companyTypeId":int
       //名称
       "companyTypeName":string
       //经营范围
       "businessScope":string
       //状态(N,D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
   }

   */
  companyTypeDetail(params, callback){
    return this.modelExecute('/CompanyType/Detail', params, callback)
  }
  /**
   *名称：公司类型.列表 路由：/CompanyType/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //公司类型编号
       "companyTypeId":int
       //名称
       "companyTypeName":string
       //经营范围
       "businessScope":string
       //状态(N,D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //开票项目
       "invoiceContents":string[]
   }

   */
  companyTypeList(params, callback){
    return this.modelExecute('/CompanyType/List', params, callback)
  }
  /**
   *名称：公司类型.新增/编辑 路由：/CompanyType/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //名称
       "companyTypeName":string
       //经营范围
       "businessScope":string
       //状态(N,D)
       "status":string
       //公司类型编号(0新增,其他编辑)
       "companyTypeId":int
       //项目
       "invoiceContent":string
   }

   *Response:
   int
   */
  companyTypeModify(params, callback){
    return this.modelExecute('/CompanyType/Modify', params, callback)
  }
  /**
   *名称：公司类型.修改状态 路由：/CompanyType/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //类型编号
       "companyTypeId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  companyTypeUpdate(params, callback){
    return this.modelExecute('/CompanyType/Update', params, callback)
  }
  /**
   *名称：客户.删除地址 路由：/Customer/DeleteAddress
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //地址编号
       "addressId":int
   }

   *Response:
   bool
   */
  customerDeleteAddress(params, callback){
    return this.modelExecute('/Customer/DeleteAddress', params, callback)
  }
  /**
   *名称：客户.删除发票信息 路由：/Customer/DeleteInvoiceInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //发票信息编号
       "invoiceInfoId":int
   }

   *Response:
   bool
   */
  customerDeleteInvoiceInfo(params, callback){
    return this.modelExecute('/Customer/DeleteInvoiceInfo', params, callback)
  }
  /**
   *名称：客户.详情 路由：/Customer/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
   }

   *Response:
   {
       //所属商务
       "belongAdminUserName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //电话
       "phone":string
       //邮箱
       "email":string
       //生日
       "showBirthday":string
       //居住地址
       "liveAddress":string
       //办公地址
       "workAddress":string
       //状态
       "status":string
       //来源
       "source":int
       //所属部门
       "deptId":int
       //所属部门
       "deptName":string
       //所属商务
       "belongAdminUserId":int
       //备注
       "remark":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //渠道名称
       "channelName":string
   }

   */
  customerDetail(params, callback){
    return this.modelExecute('/Customer/Detail', params, callback)
  }
  /**
   *名称：客户.列表 路由：/Customer/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //条件Key(CustomerName)
       "conditionKey":string
       //条件值
       "conditionValue":string
   }

   *Response:
   {
       //所属商务
       "belongAdminUserName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //电话
       "phone":string
       //邮箱
       "email":string
       //生日
       "showBirthday":string
       //居住地址
       "liveAddress":string
       //办公地址
       "workAddress":string
       //状态(N/D)
       "status":string
       //来源(直属:D;渠道:C)
       "source":int
       //所属部门
       "deptId":int
       //所属部门
       "deptName":string
       //所属商务
       "belongAdminUserId":int
       //备注
       "remark":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //渠道名称
       "channelName":string
   }

   */
  customerList(params, callback){
    return this.modelExecute('/Customer/List', params, callback)
  }
  /**
   *名称：客户.地址列表 路由：/Customer/ListAddress
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //地址
       "address":string
       //收件人
       "receiver":string
       //电话
       "phone":string
   }

   *Response:
   {
       //地址编号
       "addressId":int
       //地址
       "address":string
       //收件人
       "receiver":string
       //电话
       "phone":string
       //备注
       "remark":string
   }

   */
  customerListAddress(params, callback){
    return this.modelExecute('/Customer/ListAddress', params, callback)
  }
  /**
   *名称：客户.发票信息列表 路由：/Customer/ListInvoiceInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //公司名称
       "invoiceCompanyName":string
       //发票信息类型
       "invoiceInfoType":string
   }

   *Response:
   {
       //发票信息编号
       "invoiceInfoId":int
       //发票类型
       "invoiceInfoType":string
       //开票公司名称
       "invoiceCompanyName":string
       //开票公司税号
       "invoiceCompanyTaxNo":string
       //开票公司地址
       "invoiceCompanyAddress":string
       //开票公司电话
       "invoiceCompanyPhone":string
       //开票公司银行名称
       "invoiceCompanyBankName":string
       //开票公司银行账号
       "invoiceCompanyBankNo":string
   }

   */
  customerListInvoiceInfo(params, callback){
    return this.modelExecute('/Customer/ListInvoiceInfo', params, callback)
  }
  /**
   *名称：客户.新增/编辑 路由：/Customer/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //姓名
       "customerName":string
       //电话
       "phone":string
       //邮箱
       "email":string
       //居住地址
       "liveAddress":string
       //工作地址
       "workAddress":string
       //生日
       "birthday":DateTime
       //来源(直属:D;渠道:C)
       "source":int
       //状态(N/D)
       "status":string
       //所属部门
       "deptId":int
       //所属商务编号
       "belongAdminUserId":int
       //备注
       "remark":string
       //客户编号(0新增,其他修改)
       "customerId":int
   }

   *Response:
   int
   */
  customerModify(params, callback){
    return this.modelExecute('/Customer/Modify', params, callback)
  }
  /**
   *名称：客户.编辑地址 路由：/Customer/ModifyAddress
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //地址编号
       "addressId":int
       //地址
       "address":string
       //收件人
       "receiver":string
       //电话
       "phone":string
       //备注
       "remark":string
   }

   *Response:
   int
   */
  customerModifyAddress(params, callback){
    return this.modelExecute('/Customer/ModifyAddress', params, callback)
  }
  /**
   *名称：客户.编辑发票信息 路由：/Customer/ModifyInvoiceInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //发票信息编号
       "invoiceInfoId":int
       //发票类型
       "invoiceInfoType":string
       //开票公司名称
       "invoiceCompanyName":string
       //开票公司税号
       "invoiceCompanyTaxNo":string
       //开票公司地址
       "invoiceCompanyAddress":string
       //开票公司电话
       "invoiceCompanyPhone":string
       //开票公司银行名称
       "invoiceCompanyBankName":string
       //开票公司银行账号
       "invoiceCompanyBankNo":string
   }

   *Response:
   int
   */
  customerModifyInvoiceInfo(params, callback){
    return this.modelExecute('/Customer/ModifyInvoiceInfo', params, callback)
  }
  /**
   *名称：客户.修改状态 路由：/Customer/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  customerUpdate(params, callback){
    return this.modelExecute('/Customer/Update', params, callback)
  }
  /**
   *名称：部门.删除 路由：/Dept/Delete
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
   }

   *Response:
   bool
   */
  deptDelete(params, callback){
    return this.modelExecute('/Dept/Delete', params, callback)
  }
  /**
   *名称：部门.删除人员 路由：/Dept/Delete/User
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
       //人员编号
       "adminUserId":int
   }

   *Response:
   bool
   */
  deptDeleteUser(params, callback){
    return this.modelExecute('/Dept/Delete/User', params, callback)
  }
  /**
   *名称：部门.列表 路由：/Dept/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //部门信息
       "deptInfos":DeptInfo[]
   }

   */
  deptList(params, callback){
    return this.modelExecute('/Dept/List', params, callback)
  }
  /**
   *名称：部门.非所属人员 路由：/Dept/List/NoBelong
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
   }

   *Response:
   {
       //人员编号
       "adminUserId":int
       //名称
       "userName":string
       //系统角色
       "adminRoleId":int
       //系统角色
       "adminRoleName":string
       //流程角色
       "flowRoleId":int
       //流程角色
       "flowRoleName":string
       //部门编号
       "deptId":int
   }

   */
  deptListNoBelong(params, callback){
    return this.modelExecute('/Dept/List/NoBelong', params, callback)
  }
  /**
   *名称：部门.所属人员 路由：/Dept/List/User
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
   }

   *Response:
   {
       //人员编号
       "adminUserId":int
       //名称
       "userName":string
       //系统角色
       "adminRoleId":int
       //系统角色
       "adminRoleName":string
       //流程角色
       "flowRoleId":int
       //流程角色
       "flowRoleName":string
       //是否负责人
       "isLeader":string
       //部门编号
       "deptId":int
   }

   */
  deptListUser(params, callback){
    return this.modelExecute('/Dept/List/User', params, callback)
  }
  /**
   *名称：部门.新增/编辑 路由：/Dept/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //上级部门编号
       "parentDeptId":int
       //部门名称
       "deptName":string
       //是否销售部门(Y/N)
       "isSell":string
       //部门编号
       "deptId":int
   }

   *Response:
   int
   */
  deptModify(params, callback){
    return this.modelExecute('/Dept/Modify', params, callback)
  }
  /**
   *名称：部门.添加人员 路由：/Dept/Modify/User
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //部门编号
       "deptId":int
       //人员编号
       "adminUserId":int
       //是否负责人
       "isLeader":string
   }

   *Response:
   bool
   */
  deptModifyUser(params, callback){
    return this.modelExecute('/Dept/Modify/User', params, callback)
  }
  /**
   *名称：商品.详情 路由：/Goods/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //商品编号
       "goodsId":int
   }

   *Response:
   {
       //商品名
       "goodsName":string
       //纳税性质(N一般,S小规模)
       "taxType":string
       //发票类型名称
       "invoiceTypeName":string
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //开户服务费
       "serviceCharge":decimal
       //开户押金
       "deposit":decimal
       //状态(N,D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //商品编号
       "goodsId":int
   }

   */
  goodsDetail(params, callback){
    return this.modelExecute('/Goods/Detail', params, callback)
  }
  /**
   *名称：商品.列表 路由：/Goods/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //商品名
       "goodsName":string
       //纳税性质(N一般,S小规模)
       "taxType":string
       //发票类型名称
       "invoiceTypeName":string
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //开户服务费
       "serviceCharge":decimal
       //开户押金
       "deposit":decimal
       //状态(N,D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //商品编号
       "goodsId":int
   }

   */
  goodsList(params, callback){
    return this.modelExecute('/Goods/List', params, callback)
  }
  /**
   *名称：商品.新增/编辑 路由：/Goods/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //商品名
       "goodsName":string
       //发票类型
       "invoiceTypeName":string
       //纳税性质(N一般,S小规模)
       "taxType":string
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //开户服务费
       "serviceCharge":decimal
       //开户押金
       "deposit":decimal
       //状态(N,D)
       "status":string
       //商品编号(0新增,其他编辑)
       "goodsId":int
   }

   *Response:
   int
   */
  goodsModify(params, callback){
    return this.modelExecute('/Goods/Modify', params, callback)
  }
  /**
   *名称：商品.修改状态 路由：/Goods/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //商品编号
       "goodsId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  goodsUpdate(params, callback){
    return this.modelExecute('/Goods/Update', params, callback)
  }
  /**
   *名称：首页.待处理开户订单 路由：/Index/AOForHandle
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户姓名
       "customerName":string
       //税源地名称
       "sourceTaxName":string
       //商品名称
       "goodsName":string
       //交易费
       "totalAmount":decimal
       //押金
       "realDepositFee":decimal
       //是否加急(Y/N)
       "isPriority":string
       //流程名称
       "workflowName":string
       //下单时间
       "createTime":string
       //流程Id
       "workflowId":int
       //商务名称
       "createAdminUserName":string
   }

   */
  indexAOForHandle(params, callback){
    return this.modelExecute('/Index/AOForHandle', params, callback)
  }
  /**
   *名称：首页.数据统计 路由：/Index/Data
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //今日新增开户订单数量
       "aOCount":int
       //本月已完成开户订单数量
       "aOCompletedCount":int
       //今天新增开票订单数量
       "iOCount":int
       //本月已完成开票订单数量
       "iOCompletedCount":int
   }

   */
  indexData(params, callback){
    return this.modelExecute('/Index/Data', params, callback)
  }
  /**
   *名称：首页.待处理开票订单 路由：/Index/IOForHandle
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户姓名
       "customerName":string
       //税源地名称
       "sourceTaxName":string
       //商品名称
       "goodsName":string
       //开票金额
       "invoiceAmount":decimal
       //发票税率
       "invoiceTypeName":string
       //是否加急
       "isPriority":string
       //流程名称
       "workflowName":string
       //创建时间
       "createTime":string
       //流程ID
       "workflowId":int
       //站点名称
       "companyName":string
       //商务名称
       "createAdminUserName":string
   }

   */
  indexIOForHandle(params, callback){
    return this.modelExecute('/Index/IOForHandle', params, callback)
  }
  /**
   *名称：订单.开户订单列表.开户详情 路由：/Order/AccountOrderDetail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
   }

   *Response:
   {
       //订单信息
       "orderInfo":AccountOrderInfo
       //收款信息
       "bankReceipts":BankReceiptInfo[]
       //公司注册信息
       "companyRegInfo":CompanyRegInfo
       //进度信息
       "processInfo":ProcessInfo
       //供应商交付物（货物）
       "companyAttachment":CompanyAttachmentInfo
       //交付物流信息
       "accountOrderExpress":AccountOrderExpressInfo
       //客服回访信息
       "customerServiceRecord":CustomerServiceRecordInfo
       //是否显示按钮
       "isShowButton":bool
       //订单状态
       "status":string
       //当前处理人
       "handleAdminUserName":string
       //当前处理人角色
       "handleAdminRoleName":string
   }

   */
  orderAccountOrderDetail(params, callback){
    return this.modelExecute('/Order/AccountOrderDetail', params, callback)
  }
  /**
   *名称：订单.开户订单列表.查询 路由：/Order/AccountOrderQuery
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地编号
       "sourceTaxId":int
       //商品编号
       "goodsId":int
       //订单好
       "orderNo":string
       //客户姓名
       "customerName":string
       //提交订单开始时间
       "submitBeginTime":DateTime
       //提交订单结束时间
       "submitEndTime":DateTime
       //订单完成时间
       "orderCompletedBeginTime":DateTime
       //订单完成时间
       "orderCompletedEndTime":DateTime
       //流程编号
       "workflowId":int
       //创建人
       "createAdminUserId":int
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户姓名
       "customerName":string
       //税源地名称
       "sourceTaxName":string
       //商品名称
       "goodsName":string
       //实际支付交易费
       "totalAmount":decimal
       //实际支付押金
       "realDepositFee":decimal
       //是否加急(Y/N)
       "isPriority":string
       //流程名称
       "workflowName":string
       //流程编号
       "workflowId":int
       //创建时间
       "createTime":string
       //0轮到我加急,1轮到我,3其他
       "myHandle":int
       //订单完成时间
       "orderCompletedTime":string
       //税源地编号
       "sourceTaxId":int
       //商品编号
       "goodsId":int
       //当前处理人
       "handleAdminUserName":string
       //商务提交时间
       "submitTime":string
       //商务编号
       "createAdminUserId":int
       //商务名
       "bussinessName":string
   }

   */
  orderAccountOrderQuery(params, callback){
    return this.modelExecute('/Order/AccountOrderQuery', params, callback)
  }
  /**
   *名称：订单.开户.删除 路由：/Order/AO/Delete
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
   }

   *Response:
   bool
   */
  orderAODelete(params, callback){
    return this.modelExecute('/Order/AO/Delete', params, callback)
  }
  /**
   *名称：订单.通用.删除财务收款 路由：/Order/AODeleteBankReceipt
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //银行收款Id
       "bankReceiptId":int
       //订单Id
       "orderId":int
       //订单类型(A/I)
       "orderType":string
   }

   *Response:
   bool
   */
  orderAODeleteBankReceipt(params, callback){
    return this.modelExecute('/Order/AODeleteBankReceipt', params, callback)
  }
  /**
   *名称：订单.通用.新增（编辑）财务收款 路由：/Order/AOEditBankReceipt
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //1删除
       "isDelete":int
       //收款类型
       "bankType":string
       //银行收款Id
       "bankReceiptId":int
       //订单Id
       "orderId":int
       //收款银行名称
       "bankName":string
       //收款银行账户
       "bankNo":string
       //银行回单号
       "bankBillNo":string
       //到账日期
       "inDate":DateTime
       //到账金额
       "inAmount":decimal
       //回单图片URL
       "billImgUrl":string
       //订单类型
       "orderType":string
   }

   *Response:
   int
   */
  orderAOEditBankReceipt(params, callback){
    return this.modelExecute('/Order/AOEditBankReceipt', params, callback)
  }
  /**
   *名称：订单.开户订单.新增（编辑）站点注册信息 路由：/Order/AOEditCompanyRegisterInfo
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //供应商编号
       "supplierId":int
       //订单Id
       "orderId":int
       //站点名称
       "companyName":string
       //站点类型
       "companyTypeId":int
       //注册资本
       "registeredCapital":decimal
       //纳税性质
       "taxTypeName":string
       //投资人姓名
       "investorName":string
       //投资人手机
       "investorMobile":string
       //投资人身份证号码
       "investorIdCardNo":string
       //投资人身份证正面URL
       "investorIdCardFrontUrl":string
       //投资人身份证背面URL
       "investorIdCardBackUrl":string
       //投资人邮箱
       "investorEmail":string
       //财务人员姓名
       "financePersonName":string
       //财务人员手机
       "financePersonMobile":string
       //财务人员身份证正面URL
       "financePersonIdCardFrontUrl":string
       //财务人员身份证背面URL
       "financePersonIdCardBackUrl":string
       //财务人员身份证号
       "financePersonIdCardNo":string
       //备注
       "remark":string
   }

   *Response:
   bool
   */
  orderAOEditCompanyRegisterInfo(params, callback){
    return this.modelExecute('/Order/AOEditCompanyRegisterInfo', params, callback)
  }
  /**
   *名称：订单.开户订单.新增（编辑）交付物流信息 路由：/Order/AOEditExpress
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //快递单号
       "expressNo":string
       //快递单回单截图URL
       "expressImgUrl":string
       //快递公司
       "expressName":string
   }

   *Response:
   bool
   */
  orderAOEditExpress(params, callback){
    return this.modelExecute('/Order/AOEditExpress', params, callback)
  }
  /**
   *名称：订单.开户订单.更新进度信息 路由：/Order/AORegistrationProcess
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //核名完成时间
       "checkNameCompletedTime":DateTime
       //营业执照发放时间
       "licenseTime":DateTime
       //银行开户时间
       "bankOpenAccountTime":DateTime
       //银行开户完成时间
       "bankOpenAccountCompletedTime":DateTime
       //核税完成时间
       "checkTaxCompletedTime":DateTime
       //核名书Url
       "checkNameCompletedUrl":string
       //营业执照Url
       "licenseUrl":string
       //银行开户申请书Url
       "bankOpenAccountUrl":string
       //银行开户完成通知书Url
       "bankOpenAccountCompletedUrl":string
       //核税完成单Url
       "checkTaxCompletedUrl":string
   }

   *Response:
   bool
   */
  orderAORegistrationProcess(params, callback){
    return this.modelExecute('/Order/AORegistrationProcess', params, callback)
  }
  /**
   *名称：订单.通用.PDF单据生成 路由：/Order/Bill/Create
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //单据类型（P:付款单，S：供应商下单）
       "billType":string
       //订单号
       "orderId":int
       //订单类型（A/I）
       "orderType":string
   }

   *Response:
   {
       //PDF路径
       "pdfPath":string
       //excel路径
       "excelPath":string
   }

   */
  orderBillCreate(params, callback){
    return this.modelExecute('/Order/Bill/Create', params, callback)
  }
  /**
   *名称：订单.开票.差额列表 路由：/Order/Diff/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderNo":string
       //客户名
       "customerName":string
       //站点名
       "companyName":string
       //商品编号
       "goodsId":int
       //开始时间
       "beginSubmitTime":DateTime
       //结束时间
       "endSubmitTime":DateTime
   }

   *Response:
   {
       //订单编号
       "orderId":int
       //订单号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户名
       "customerName":string
       //站点编号
       "companyId":int
       //站点名
       "companyName":string
       //开票金额
       "invoiceAmount":decimal
       //已开金额
       "actualAmount":decimal
       //差额
       "differeceAmount":decimal
       //发票类型
       "invoiceTypeName":string
       //商务编号
       "createAdminUserId":int
       //商务名
       "bussinessName":string
       //提交时间
       "submitTime":string
       //完成时间
       "orderCompletedTime":string
       //商品编号
       "goodsId":int
       //商品名
       "goodsName":string
   }

   */
  orderDiffList(params, callback){
    return this.modelExecute('/Order/Diff/List', params, callback)
  }
  /**
   *名称：订单.新增开户订单.新增（编辑）订单 路由：/Order/EditAccountOrder
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户编号
       "customerId":int
       //税源地编号
       "sourceTaxId":int
       //商品编号
       "goodsId":int
       //公司类型编号
       "companyTypeId":int
       //站点名称
       "companyName":string
       //注册资本
       "registeredCapital":decimal
       //投资人姓名
       "investorName":string
       //投资人手机
       "investorMobile":string
       //投资人身份证正面URL
       "investorIdCardFrontUrl":string
       //投资人身份证背面URL
       "investorIdCardBackUrl":string
       //投资人身份证号码
       "investorIdCardNo":string
       //投资人邮箱
       "investorEmail":string
       //财务人员姓名
       "financePersonName":string
       //财务人员手机
       "financePersonMobile":string
       //财务人员身份证正面URL
       "financePersonIdCardFrontUrl":string
       //财务人员身份证背面URL
       "financePersonIdCardBackUrl":string
       //财务人员身份证号
       "financePersonIdCardNo":string
       //身份证寄回地址
       "idCardReturnAddress":string
       //发票快递地址
       "invoiceExpressAddress":string
       //材料交付地址
       "fileExpressAddress":string
       //是否需要审批
       "isNeedApproval":string
       //是否加急
       "isPriority":string
       //押金减免
       "depositRemissionAmount":decimal
       //交易费折扣
       "tradeFeeDiscount":decimal
       //订单Id
       "orderId":int
       //是否接受调剂
       "isAdjustment":string
       //交易费折扣
       "serviceFeeDiscount":decimal
       //加急原因
       "priorityReason":string
       //服务协议url
       "serviceAgreementUrl":string
       //产品订单url
       "productOrderUrl":string
       //授权委托url
       "authorisedUrl":string
       //承诺书url
       "promiseUrl":string
   }

   *Response:
   int
   */
  orderEditAccountOrder(params, callback){
    return this.modelExecute('/Order/EditAccountOrder', params, callback)
  }
  /**
   *名称：订单.开户订单.新增（编辑）货物信息 路由：/Order/EditCompanyAttachment
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //U盾图片路径
       "ukeyImgUrl":string
       //公章图片路径
       "stampImgUrl":string
       //营业执照图片路径
       "licenseImgUrl":string
       //国地税协议三方PDF
       "taxAgreementPDFUrl":string
       //站点地址
       "companyAddress":string
       //税号
       "taxNo":string
       //公司电话
       "companyPhone":string
       //开户银行
       "accountBank":string
       //开户银行账号
       "accountBankAccount":string
       //站点名称
       "companyName":string
   }

   *Response:
   bool
   */
  orderEditCompanyAttachment(params, callback){
    return this.modelExecute('/Order/EditCompanyAttachment', params, callback)
  }
  /**
   *名称：订单.通用.客服回访信息录入 路由：/Order/EditCustomerServiceRecord
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型(I/A)
       "orderType":string
       //评价等级（1-10）
       "evalValue":int
       //客户反馈
       "feedback":string
   }

   *Response:
   bool
   */
  orderEditCustomerServiceRecord(params, callback){
    return this.modelExecute('/Order/EditCustomerServiceRecord', params, callback)
  }
  /**
   *名称：订单.新增开票订单.新增（编辑）订单 路由：/Order/EditInvoiceOrder
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户Id
       "customerId":int
       //站点Id
       "companyId":int
       //税源地Id
       "sourceTaxId":int
       //商品Id
       "goodsId":int
       //开票项目
       "invoiceContent":string
       //开票金额
       "invoiceAmount":decimal
       //开票公司名称
       "invoiceCompanyName":string
       //开票公司税号
       "invoiceCompanyTaxNo":string
       //开票公司地址
       "invoiceCompanyAddress":string
       //开票公司电话
       "invoiceCompanyPhone":string
       //开票公司银行名称
       "invoiceCompanyBankName":string
       //开票公司银行账号
       "invoiceCompanyBankNo":string
       //发票快递地址
       "invoiceExpressAddress":string
       //是否需要审批
       "isNeedApproval":string
       //是否加急
       "isPriority":string
       //服务费折扣
       "serviceFeeDiscount":decimal
       //订单Id
       "orderId":int
       //发票类型
       "invoiceTypeName":string
       //开票合同
       "invoiceContractUrl":string
       //加急原因
       "priorityReason":string
       //开票服务费费率
       "invoiceServiceRatio":decimal
       //期望开票时间
       "hopeInvoiceDate":DateTime
       //备注
       "invoiceRemark":string
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
   }

   */
  orderEditInvoiceOrder(params, callback){
    return this.modelExecute('/Order/EditInvoiceOrder', params, callback)
  }
  /**
   *名称：订单.开票订单列表.开票详情 路由：/Order/InvoiceOrderDetail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
   }

   *Response:
   {
       //订单信息
       "orderInfo":InvoiceOrderInfo
       //收款信息
       "bankReceipts":BankReceiptInfo[]
       //发票信息
       "invoiceInfos":InvoiceInfo[]
       //客服回访信息
       "customerServiceRecord":CustomerServiceRecordInfo
       //是否显示审批按钮
       "isShowButton":bool
       //处理人
       "handleAdminUserName":string
       //处理人角色
       "handleAdminRoleName":string
       //状态
       "status":string
       //差额订单信息
       "differenceInfo":DifferenceInfo
   }

   */
  orderInvoiceOrderDetail(params, callback){
    return this.modelExecute('/Order/InvoiceOrderDetail', params, callback)
  }
  /**
   *名称：订单.开票订单列表.查询 路由：/Order/InvoiceOrderQuery
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地编号
       "sourceTaxId":int
       //商品编号
       "goodsId":int
       //订单好
       "orderNo":string
       //客户姓名
       "customerName":string
       //提交订单开始时间
       "submitBeginTime":DateTime
       //提交订单结束时间
       "submitEndTime":DateTime
       //订单完成时间
       "orderCompletedBeginTime":DateTime
       //订单完成时间
       "orderCompletedEndTime":DateTime
       //流程编号
       "workflowIds":int[]
       //创建人
       "createAdminUserId":int
       //站点名
       "companyName":string
   }

   *Response:
   {
       //订单Id
       "orderId":int
       //订单编号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户姓名
       "customerName":string
       //税源地名称
       "sourceTaxName":string
       //商品名称
       "goodsName":string
       //开票金额
       "invoiceAmount":decimal
       //发票类型
       "invoiceTypeName":string
       //是否加急
       "isPriority":string
       //流程名称
       "workflowName":string
       //流程Id
       "workflowId":int
       //创建时间
       "createTime":string
       //0轮到我加急,1轮到我,3其他
       "myHandle":int
       //订单完成时间
       "orderCompletedTime":string
       //税源地编号
       "sourceTaxId":int
       //当前处理人
       "handleAdminUserName":string
       //商务提交时间
       "submitTime":string
       //站点名称
       "companyName":string
       //站点Id
       "companyId":int
       //商品编号
       "goodsId":int
       //是否差额订单
       "isDiff":string
       //商务编号
       "createAdminUserId":int
       //商务名
       "bussinessName":string
   }

   */
  orderInvoiceOrderQuery(params, callback){
    return this.modelExecute('/Order/InvoiceOrderQuery', params, callback)
  }
  /**
   *名称：订单.开票.删除 路由：/Order/IO/Delete
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderId":int
   }

   *Response:
   bool
   */
  orderIODelete(params, callback){
    return this.modelExecute('/Order/IO/Delete', params, callback)
  }
  /**
   *名称：订单.开票.删除发票信息 路由：/Order/IO/DeleteInvoice
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //快递号
       "expressId":int
   }

   *Response:
   bool
   */
  orderIODeleteInvoice(params, callback){
    return this.modelExecute('/Order/IO/DeleteInvoice', params, callback)
  }
  /**
   *名称：订单.开票订单.新增（编辑）发票信息 路由：/Order/IOEditInvoice
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //发票数量
       "invoiceCount":int
       //发票图片URL
       "invoiceImgUrl":string
       //快递单号
       "expressNo":string
       //快递单回单截图URL
       "expressImgUrl":string
       //快递公司
       "expressName":string
       //快递信息编号
       "expressId":int
       //开票总额
       "invoiceAmount":decimal
       //税额
       "taxAmount":decimal
   }

   *Response:
   int
   */
  orderIOEditInvoice(params, callback){
    return this.modelExecute('/Order/IOEditInvoice', params, callback)
  }
  /**
   *名称：订单.开票.后付费订单 路由：/Order/IO/PostPayList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单号
       "orderNo":string
       //状态(已支付A,支付中H,未支付W)
       "postPayStatus":string
   }

   *Response:
   {
       //后付费编号
       "postPayOrderId":int
       //订单号
       "orderId":int
       //订单号
       "orderNo":string
       //客户编号
       "customerId":int
       //客户
       "customerName":string
       //站点编号
       "companyId":int
       //站点
       "companyName":string
       //税源地编号
       "sourceTaxId":int
       //税源地
       "sourceTaxName":string
       //商品
       "goodsId":int
       //商品
       "goodsName":string
       //开票金额
       "invoiceAmount":decimal
       //发票类型
       "invoiceTypeName":string
       //商务编号
       "bussinessId":int
       //商务
       "bussinessName":string
       //财务编号
       "financeId":int
       //财务
       "financeName":string
       //应付金额
       "totalAmount":decimal
       //已付金额
       "actualAmount":decimal
       //提交时间
       "submitTime":string
       //截止时间
       "cutOffTime":string
       //状态
       "postStatus":string
       //状态
       "postStatusText":string
   }

   */
  orderIOPostPayList(params, callback){
    return this.modelExecute('/Order/IO/PostPayList', params, callback)
  }
  /**
   *名称：订单.查询收款信息 路由：/Order/QueryBankReceiptList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单编号
       "orderId":int
       //订单类型
       "orderType":string
   }

   *Response:
   {
       //收款信息
       "bankReceipts":BankReceiptInfo[]
   }

   */
  orderQueryBankReceiptList(params, callback){
    return this.modelExecute('/Order/QueryBankReceiptList', params, callback)
  }
  /**
   *名称：订单.通用.日志详情 路由：/Order/LogList
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型（A/I）
       "orderType":string
   }

   *Response:
   {
       //日志Id
       "logId":int
       //操作人姓名
       "actionUserName":string
       //操作人角色名称
       "actionUserRoleName":string
       //操作内容
       "actionContent":string
       //时间
       "actionTime":string
   }

   */
  orderLogList(params, callback){
    return this.modelExecute('/Order/LogList', params, callback)
  }
  /**
   *名称：订单.通用.订单流程提交 路由：/Order/WorkflowNext
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型(A/I)
       "orderType":string
   }

   *Response:
   bool
   */
  orderWorkflowNext(params, callback){
    return this.modelExecute('/Order/WorkflowNext', params, callback)
  }
  /**
   *名称：订单.通用.订单流程驳回 路由：/Order/WorkflowReject
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型(A/I)
       "orderType":string
       //驳回原因
       "rejectReason":string
   }

   *Response:
   bool
   */
  orderWorkflowReject(params, callback){
    return this.modelExecute('/Order/WorkflowReject', params, callback)
  }
  /**
   *名称：订单.通用.订单流程驳回至创建人 路由：/Order/WorkflowRejectRestart
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型(A/I)
       "orderType":string
       //驳回原因
       "rejectReason":string
   }

   *Response:
   bool
   */
  orderWorkflowRejectRestart(params, callback){
    return this.modelExecute('/Order/WorkflowRejectRestart', params, callback)
  }
  /**
   *名称：订单.通用.订单流程等待 路由：/Order/WorkflowWait
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //订单Id
       "orderId":int
       //订单类型(A/I)
       "orderType":string
       //等待原因
       "waitReason":string
   }

   *Response:
   bool
   */
  orderWorkflowWait(params, callback){
    return this.modelExecute('/Order/WorkflowWait', params, callback)
  }
  /**
   *名称：风控.删除站点流水 路由：/Risk/Delete/CompanyWater
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //流水编号
       "waterId":int
   }

   *Response:
   bool
   */
  riskDeleteCompanyWater(params, callback){
    return this.modelExecute('/Risk/Delete/CompanyWater', params, callback)
  }
  /**
   *名称：风控.处理站点流水预警 路由：/Risk/Handle/CompanyWaterWarning
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //预警编号
       "warningId":int
       //处理内容
       "handleContent":string
   }

   *Response:
   bool
   */
  riskHandleCompanyWaterWarning(params, callback){
    return this.modelExecute('/Risk/Handle/CompanyWaterWarning', params, callback)
  }
  /**
   *名称：风控.导入站点流水 路由：/Risk/Import/CompanyWater
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //站点编号
       "companyId":int
       //银行
       "bankName":string
   }

   *Response:
   bool
   */
  riskImportCompanyWater(params, callback){
    return this.modelExecute('/Risk/Import/CompanyWater', params, callback)
  }
  riskCompanyWaterImport(params, callback){
    return this.modelExecute('/Risk/CompanyWater/Import', params, callback)
  }
  /**
   *名称：风控.查询站点流水 路由：/Risk/Query/CompanyWater
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //客户名称
       "customerName":string
       //站点名称
       "companyName":string
       //开始时间
       "tradeBeginTime":DateTime
       //结束时间
       "tradeEndTime":DateTime
   }

   *Response:
   {
       //流水编号
       "waterId":int
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //银行
       "bankName":string
       //交易时间
       "tradeTime":string
       //交易方
       "traderName":string
       //贷方发生额
       "inAmount":decimal
       //借方发生额
       "outAmount":decimal
       //余额
       "lastAmount":decimal
       //摘要
       "remark":string
       //导入时间
       "createTime":string
   }

   */
  riskQueryCompanyWater(params, callback){
    return this.modelExecute('/Risk/Query/CompanyWater', params, callback)
  }
  /**
   *名称：风控.查询站点流水预警 路由：/Risk/Query/CompanyWaterWarning
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //预警编号
       "warningId":int
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //交易时间
       "tradeTime":string
       //预警类型
       "warningType":string
       //预警项目
       "warningContent":string
       //处置结果
       "handleContent":string
       //处置时间
       "handleTime":string
       //状态
       "handleStatus":string
   }

   */
  riskQueryCompanyWaterWarning(params, callback){
    return this.modelExecute('/Risk/Query/CompanyWaterWarning', params, callback)
  }
  /**
   *名称：风控.查询站点流水预警设置 路由：/Risk/Query/CompanyWaterWarningSetting
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //非法人账户转出
       "investorOutSetting":string
       //当日入账当日出账
       "todaySetting":string
       //转入公司开票订单
       "noInvestorSetting":string
       //账户余额阈值
       "amountSetting":decimal
   }

   */
  riskQueryCompanyWaterWarningSetting(params, callback){
    return this.modelExecute('/Risk/Query/CompanyWaterWarningSetting', params, callback)
  }
  /**
   *名称：风控.查询开票站点预警 路由：/Risk/Query/GoodsIovoiceWarning
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //预警编号
       "warningId":int
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //商务编号
       "bussinessId":int
       //商务名称
       "bussinessName":string
       //预警内容
       "warningContent":string
       //预警时间
       "warningTime":string
   }

   */
  riskQueryGoodsIovoiceWarning(params, callback){
    return this.modelExecute('/Risk/Query/GoodsIovoiceWarning', params, callback)
  }
  /**
   *名称：风控.查询开票预警配置 路由：/Risk/Query/GoodsIovoiceWarningSetting
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //商品编号
       "goodsId":int
   }

   *Response:
   {
       //商品编号
       "goodsId":int
       //新站点定义
       "newCompanyMonth":int
       //单月限制
       "newMonthLimit":decimal
       //季度限制
       "newQuarterLimit":decimal
       //月数1
       "newTotalMonth1":int
       //限制1
       "newTotalMonthLimit1":decimal
       //月数2
       "newTotalMonth2":int
       //限制2
       "newTotalMonthLimit2":decimal
       //月数3
       "newTotalMonth3":int
       //限制3
       "newTotalMonthLimit3":decimal
       //阈值
       "newThreshold":decimal
       //代开是否受限
       "newIsRestrict":string
       //单月限制
       "oldMonthLimit":decimal
       //季度限制
       "oldQuarterLimit":decimal
       //年度限制
       "oldYearLimit":decimal
       //月数1
       "oldTotalMonth1":int
       //限制1
       "oldTotalMonthLimit1":decimal
       //月数2
       "oldTotalMonth2":int
       //限制2
       "oldTotalMonthLimit2":decimal
       //月数3
       "oldTotalMonth3":int
       //限制3
       "oldTotalMonthLimit3":decimal
       //阈值
       "oldThreshold":decimal
       //代开是否受限
       "oldIsRestrict":string
   }

   */
  riskQueryGoodsIovoiceWarningSetting(params, callback){
    return this.modelExecute('/Risk/Query/GoodsIovoiceWarningSetting', params, callback)
  }
  /**
   *名称：风控.保存站点流水 路由：/Risk/Save/CompanyWater
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //流水编号
       "waterId":int
       //站点编号
       "companyId":int
       //银行
       "bankName":string
       //交易日期
       "tradeTime":DateTime
       //交易方
       "traderName":string
       //贷方发生额
       "inAmount":decimal
       //借方发生额
       "outAmount":decimal
       //余额
       "lastAmount":decimal
       //摘要
       "remark":string
   }

   *Response:
   int
   */
  riskSaveCompanyWater(params, callback){
    return this.modelExecute('/Risk/Save/CompanyWater', params, callback)
  }
  /**
   *名称：风控.保存站点流水预警设置 路由：/Risk/Save/CompanyWaterWarningSetting
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //非法人账户转出
       "investorOutSetting":string
       //当日入账当日出账
       "todaySetting":string
       //转入公司开票订单
       "noInvestorSetting":string
       //账户余额阈值
       "amountSetting":decimal
   }

   *Response:
   bool
   */
  riskSaveCompanyWaterWarningSetting(params, callback){
    return this.modelExecute('/Risk/Save/CompanyWaterWarningSetting', params, callback)
  }
  /**
   *名称：风控.保存开票预警配置 路由：/Risk/Save/GoodsIovoiceWarningSetting
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //商品编号
       "goodsId":int
       //新站点定义
       "newCompanyMonth":int
       //单月限制
       "newMonthLimit":decimal
       //季度限制
       "newQuarterLimit":decimal
       //月数1
       "newTotalMonth1":int
       //限制1
       "newTotalMonthLimit1":decimal
       //月数2
       "newTotalMonth2":int
       //限制2
       "newTotalMonthLimit2":decimal
       //月数3
       "newTotalMonth3":int
       //限制3
       "newTotalMonthLimit3":decimal
       //阈值
       "newThreshold":decimal
       //代开是否受限
       "newIsRestrict":string
       //单月限制
       "oldMonthLimit":decimal
       //季度限制
       "oldQuarterLimit":decimal
       //年度限制
       "oldYearLimit":decimal
       //月数1
       "oldTotalMonth1":int
       //限制1
       "oldTotalMonthLimit1":decimal
       //月数2
       "oldTotalMonth2":int
       //限制2
       "oldTotalMonthLimit2":decimal
       //月数3
       "oldTotalMonth3":int
       //限制3
       "oldTotalMonthLimit3":decimal
       //阈值
       "oldThreshold":decimal
       //代开是否受限
       "oldIsRestrict":string
   }

   *Response:
   bool
   */
  riskSaveGoodsIovoiceWarningSetting(params, callback){
    return this.modelExecute('/Risk/Save/GoodsIovoiceWarningSetting', params, callback)
  }
  /**
   *名称：风控.站点流水统计 路由：/Risk/Statistics/ComapnyWater
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "tradeBeginTime":DateTime
       //结束时间
       "tradeEndTime":DateTime
   }

   *Response:
   {
       //交易次数
       "tradeCount":int
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //客户编号
       "customerId":int
       //客户名称
       "customerName":string
       //贷方发生额
       "sumInAmount":decimal
       //借方发生额
       "sumOutAmount":decimal
   }

   */
  riskStatisticsComapnyWater(params, callback){
    return this.modelExecute('/Risk/Statistics/ComapnyWater', params, callback)
  }
  /**
   *名称：角色.列表 路由：/Role/List
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
  roleList(params, callback){
    return this.modelExecute('/Role/List', params, callback)
  }
  /**
   *名称：角色.流程角色列表 路由：/Role/List/Flow
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //流程角色编号
       "flowRoleId":int
       //流程角色
       "flowRoleName":string
   }

   */
  roleListFlow(params, callback){
    return this.modelExecute('/Role/List/Flow', params, callback)
  }
  /**
   *名称：角色.新增/修改 路由：/Role/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //角色编号
       "adminRoleId":int
       //角色名称
       "adminRoleName":string
       //状态(N/D)
       "status":string
   }

   *Response:
   int
   */
  roleModify(params, callback){
    return this.modelExecute('/Role/Modify', params, callback)
  }
  /**
   *名称：角色.权限列表 路由：/Role/PermissionList
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
  rolePermissionList(params, callback){
    return this.modelExecute('/Role/PermissionList', params, callback)
  }
  /**
   *名称：角色.权限修改 路由：/Role/PermissionModify
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
  rolePermissionModify(params, callback){
    return this.modelExecute('/Role/PermissionModify', params, callback)
  }
  /**
   *名称：角色.修改状态 路由：/Role/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //角色编号
       "adminRoleId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  roleUpdate(params, callback){
    return this.modelExecute('/Role/Update', params, callback)
  }
  /**
   *名称：税源地.详情 路由：/SourceTax/Detail
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地编号
       "sourceTaxId":int
   }

   *Response:
   {
       //税源地编号
       "sourceTaxId":int
       //税源地名称
       "sourceTaxName":string
       //省编号
       "provinceId":int
       //省名
       "provinceName":string
       //城市编号
       "cityId":int
       //城市名
       "cityName":string
       //地址
       "taxAddress":string
       //法人年龄上限
       "legalAge":int
       //是否需要财务身份证复印件(Y/N)
       "isNeedFinanceID":string
       //增值税返税比率
       "zZSRatio":decimal
       //个税返税比率
       "gRSDSRatio":decimal
       //附加税返税比率
       "fJSRatio":decimal
       //印花税返税比率
       "yHSRatio":decimal
       //联系人
       "contact":string
       //联系电话
       "phone":string
       //状态(N/D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
       //供应商
       "suppliers":SupplierInfo[]
   }

   */
  sourceTaxDetail(params, callback){
    return this.modelExecute('/SourceTax/Detail', params, callback)
  }
  /**
   *名称：税源地.列表 路由：/SourceTax/List
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //税源地名称
       "sourceTaxName":string
       //省编号
       "provinceId":int
       //省名
       "provinceName":string
       //城市编号
       "cityId":int
       //城市名
       "cityName":string
       //税源地编号
       "sourceTaxId":int
       //地址
       "taxAddress":string
       //法人年龄上限
       "legalAge":int
       //是否需要财务身份证复印件(Y/N)
       "isNeedFinanceID":string
       //增值税返税比率
       "zZSRatio":decimal
       //个税返税比率
       "gRSDSRatio":decimal
       //附加税返税比率
       "fJSRatio":decimal
       //印花税返税比率
       "yHSRatio":decimal
       //联系人
       "contact":string
       //联系电话
       "phone":string
       //状态(N/D)
       "status":string
       //创建人
       "createAdminUserId":int
       //创建时间
       "showCreateTime":string
   }

   */
  sourceTaxList(params, callback){
    return this.modelExecute('/SourceTax/List', params, callback)
  }
  /**
   *名称：税源地.供应商列表 路由：/SourceTax/ListSupplier
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地编号
       "sourceTaxId":int
   }

   *Response:
   {
       //供应商编号
       "supplierId":int
       //供应商名称
       "supplierName":string
   }

   */
  sourceTaxListSupplier(params, callback){
    return this.modelExecute('/SourceTax/ListSupplier', params, callback)
  }
  /**
   *名称：税源地.新建/编辑 路由：/SourceTax/Modify
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地名称
       "sourceTaxName":string
       //省编号
       "provinceId":int
       //城市编号
       "cityId":int
       //增值税返税比率
       "zZSRatio":decimal
       //个税返税比率
       "gRSDSRatio":decimal
       //附加税返税比率
       "fJSRatio":decimal
       //印花税返税比率
       "yHSRatio":decimal
       //法人年龄上限
       "legalAge":int
       //是否需要财务身份证复印件(Y/N)
       "isNeedFinanceID":string
       //联系人
       "contact":string
       //联系电话
       "phone":string
       //状态(N/D)
       "status":string
       //编号(0新增,其他编辑)
       "sourceTaxId":int
       //供应商编号
       "supplierIds":int[]
   }

   *Response:
   int
   */
  sourceTaxModify(params, callback){
    return this.modelExecute('/SourceTax/Modify', params, callback)
  }
  /**
   *名称：税源地.修改状态 路由：/SourceTax/Update
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //税源地编号
       "sourceTaxId":int
       //状态(N/D)
       "status":string
   }

   *Response:
   bool
   */
  sourceTaxUpdate(params, callback){
    return this.modelExecute('/SourceTax/Update', params, callback)
  }
  /**
   *名称：统计.开户.分析 路由：/Statistics/AO/Analysis
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //年度
       "year":int
       //纬度(1周,2月,3季)
       "type":int
   }

   *Response:
   {
       //数据(周7,月30,季3)
       "aOAnalysisDatas":AOAnalysisData[]
   }

   */
  statisticsAOAnalysis(params, callback){
    return this.modelExecute('/Statistics/AO/Analysis', params, callback)
  }
  /**
   *名称：统计.开户.周期 路由：/Statistics/AO/Cycle
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //结束时间
       "endTime":DateTime
       //开始时间
       "beginTime":DateTime
   }

   *Response:
   {
       //站点总数
       "orderCount":int
       //押金总额
       "depositAmount":decimal
       //待收押金总额
       "depositWaitingAmount":decimal
       //开户中数量
       "orderWaitingCount":int
   }

   */
  statisticsAOCycle(params, callback){
    return this.modelExecute('/Statistics/AO/Cycle', params, callback)
  }
  /**
   *名称：统计.开户.首页 路由：/Statistics/AO/Index
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //站点总数
       "companyCount":int
       //正常站点数
       "companyNormalCount":int
       //禁用站点数
       "companyDisableCount":int
       //开户中数量
       "companyWaitingCount":int
       //产品占比
       "goodsDatas":PSOA.Model.KeyValue[]
       //税源地占比
       "sourceTaxDatas":PSOA.Model.KeyValue[]
   }

   */
  statisticsAOIndex(params, callback){
    return this.modelExecute('/Statistics/AO/Index', params, callback)
  }
  /**
   *名称：统计.站点.已开票 路由：/Statistics/Company/HasData
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //结束时间
       "endTime":DateTime
       //站点名称
       "companyName":string
       //开始时间
       "beginTime":DateTime
   }

   *Response:
   {
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //开票次数
       "iOCount":int
       //开票金额
       "sumInvoiceAmount":decimal
       //服务费金额
       "sumServiceAmount":decimal
       //开通时间
       "createTime":string
       //最后开票时间
       "lastIOTime":string
       //部门名称
       "deptName":string
       //所属商务
       "belongAdminUserId":int
       //所属商务名
       "belongAdminUserName":string
   }

   */
  statisticsCompanyHasData(params, callback){
    return this.modelExecute('/Statistics/Company/HasData', params, callback)
  }
  /**
   *名称：统计.站点.未开票 路由：/Statistics/Company/NoData
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
       //站点名称
       "companyName":string
   }

   *Response:
   {
       //站点编号
       "companyId":int
       //站点名称
       "companyName":string
       //开通时间
       "createTime":string
       //部门名称
       "deptName":string
       //所属商务
       "belongAdminUserId":int
       //所属商务名
       "belongAdminUserName":string
   }

   */
  statisticsCompanyNoData(params, callback){
    return this.modelExecute('/Statistics/Company/NoData', params, callback)
  }
  /**
   *名称：统计.部门.开户 路由：/Statistics/Dept/AO
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
   }

   *Response:
   {
       //部门
       "deptName":string
       //负责人
       "deptUserId":int
       //负责人
       "deptUserName":string
       //客户数
       "customerCount":int
       //站点数
       "companyCount":int
       //新站点数
       "newCompanyCount":int
       //活跃站点数
       "activeCompanyCount":int
   }

   */
  statisticsDeptAO(params, callback){
    return this.modelExecute('/Statistics/Dept/AO', params, callback)
  }
  /**
   *名称：统计.部门.开票 路由：/Statistics/Dept/IO
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
   }

   *Response:
   {
       //部门
       "deptName":string
       //负责人
       "deptUserId":int
       //负责人
       "deptUserName":string
       //开票金额
       "sumInvoiceAmount":decimal
       //服务费金额
       "sumServiceAmount":decimal
       //站点数
       "companyCount":int
   }

   */
  statisticsDeptIO(params, callback){
    return this.modelExecute('/Statistics/Dept/IO', params, callback)
  }
  /**
   *名称：统计.开票.分析 路由：/Statistics/IO/Analysis
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //年度
       "year":int
       //纬度(1周,2月,3季)
       "type":int
   }

   *Response:
   {
       //数据(周7,月30,季3)
       "iOAnalysisDatas":IOAnalysisData[]
   }

   */
  statisticsIOAnalysis(params, callback){
    return this.modelExecute('/Statistics/IO/Analysis', params, callback)
  }
  /**
   *名称：统计.开票.周期 路由：/Statistics/IO/Cycle
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //结束时间
       "endTime":DateTime
       //开始时间
       "beginTime":DateTime
   }

   *Response:
   {
       //订单总数
       "orderCount":int
       //已完成数
       "orderOverCount":int
       //站点数
       "companyCount":int
       //新客数
       "newCustomerCount":int
       //开票总额
       "sumInvoiceAmount":decimal
       //服务费总额
       "sumServiceAmoune":decimal
       //待收服务费
       "sumWaitingServiceAmount":decimal
       //总税额
       "sumTaxAmount":decimal
   }

   */
  statisticsIOCycle(params, callback){
    return this.modelExecute('/Statistics/IO/Cycle', params, callback)
  }
  /**
   *名称：统计.开票.首页 路由：/Statistics/IO/Index
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //
       "":
   }

   *Response:
   {
       //订单总数
       "orderCount":int
       //开票总额
       "sumInvoiceAmount":decimal
       //服务费总额
       "sumServiceAmount":decimal
       //总税额
       "sumTaxAmount":decimal
       //产品占比
       "goodsDatas":PSOA.Model.KeyValue[]
       //税源地占比
       "sourceTaxDatas":PSOA.Model.KeyValue[]
   }

   */
  statisticsIOIndex(params, callback){
    return this.modelExecute('/Statistics/IO/Index', params, callback)
  }
  /**
   *名称：统计.人员.开户 路由：/Statistics/User/AO
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
   }

   *Response:
   {
       //人员编号
       "adminUserId":int
       //人员名称
       "adminUserName":string
       //部门名称
       "deptName":string
       //部门负责人
       "deptUserId":int
       //负责人
       "deptUserName":string
       //客户数
       "customerCount":int
       //站点数
       "companyCount":int
       //新站点数
       "newCompanyCount":int
       //活跃站点数
       "activeCompanyCount":int
   }

   */
  statisticsUserAO(params, callback){
    return this.modelExecute('/Statistics/User/AO', params, callback)
  }
  /**
   *名称：统计.人员.开票 路由：/Statistics/User/IO
   *@param {*} params 向服务器传送的参数,对应Request
   *@param {Function} [callback]  回调函数
   *Request:
   {
       //开始时间
       "beginTime":DateTime
       //结束时间
       "endTime":DateTime
   }

   *Response:
   {
       //人员编号
       "adminUserId":int
       //人员名称
       "adminUserName":string
       //部门名称
       "deptName":string
       //部门负责人
       "deptUserId":int
       //负责人
       "deptUserName":string
       //开票金额
       "sumInvoiceAmount":decimal
       //服务费金额
       "sumServiceAmount":decimal
       //站点数
       "companyCount":int
   }

   */
  statisticsUserIO(params, callback){
    return this.modelExecute('/Statistics/User/IO', params, callback)
  }
}
