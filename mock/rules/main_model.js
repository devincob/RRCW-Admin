import Mock from 'mock2js'
import { bindModel } from '../util'
import Config from '../../src/config'

// 模拟 CaiWuModel 接口

const globalRules = {
  'POST /User/CreateCode.json ': {
    // 验证码序列号
    'codeSn': '@string(32)',
    // BASEB4编码
    'base64Image': '@dataImage(90x40, 随便填写)'
  },
  'POST /User/Login.json delay:3000': req => {
    // 使用setTimeout 延时
    return new Promise(resolve => {
      setTimeout(() => {
        if (req.body.loginName === 'admin' && req.body.userPwd === '888888') {
          resolve({
            'sessionId': '@string',
            'permissionFullModel': require('./menus'),
            'adminName': '@cname',
            'adminUserId': '@integer(1, 10000)',
            'mobile': '@string',
            'userMail': '@email',
            'adminRoleIds': [1, 2, 3, 4]
          })
        } else {
          resolve({
            isSuccess: false,
            message: '账号或密码不正确'
          })
        }
      }, 2000)
    })
  },
  // 使用 delay: time 规则延时
  'POST /User/UpdatePwd.json delay:2000': (req) => {
    if (req.body.oldPwd === '888888') {
      return {
        isSuccess: true,
        body: true
      }
    } else {
      return {
        isSuccess: false,
        message: '旧密码验证失败'
      }
    }
  },
  'POST /User/CList.json delay:500': req => {
    const pageSize = req.body.pageSize || 15
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 15,
        [`datas|${pageSize}`]: [{
          // 用户编号
          'workerUserId': '@integer(1000, 2000)',
          // 姓名
          'userName': '@cname',
          // 性别(F/M/U)
          'sex|1': ['F', 'M', 'U'],
          // 手机号码
          'mobilePhone': /1[345789]\d{9}/,
          // 城市
          'cityName|1': ['北京', '上海', '广州'],
          // 注册时间
          'registerTime': '@datetime',
          // 注册时间(string)
          'formatRegisterTime': '@datetime',
          // 实名状态(PA:通过)
          'realNameStatus|1': ['R', 'N'],
          // 抢单资格(N:正常,D:取消)
          'orderStatus|1': ['N', 'D'],
          // 账号状态(N:正常,D:封号)
          'status|1': ['N', 'D']
        }]
      }
    }
  },
  'POST /User/CInfoDetails.json delay:1000': {
    // 手机号码
    'mobilePhone': /1[345789]\d{9}/,
    // 姓名
    'userName': '@cname',
    // 头像
    'headImage': '@dataImage',
    // 性别(F/M/U)
    'sex|1': ['F', 'M', 'U'],
    // 身高
    'height': '@integer(150, 250)',
    // 体重
    'weight': '@integer(40, 200)',
    // 是否在校(N/D)
    'isStudent|1': ['Y', 'N'],
    // 注册时间
    'registerTime': '@datetime',
    // 注册时间(string)
    'formatRegisterTime': '@datetime',
    // 抢单资格(N/D)
    'orderStatus|1': ['N', 'D'],
    // 账号状态(N/D)
    'userStatus|1': ['N', 'D'],
    // 生活照
    'lifePhoto|0-5': ['@dataImage(200x200, 生活照)'],
    // 真实姓名
    'realName': '@cname',
    // 身份证号
    'idCardNo': /\d{18}/,
    // 民族
    'nation|1': ['汉族', '黎族'],
    // 生日
    'birthday': '@datetime',
    // 证件照
    'photoUrl': '@dataImage(320x240, 身份证照片)',
    // 状态(PA:通过,UP:未通过,CT:审核中)
    'status|1': ['PA', 'UP', 'CT'],
    // 余额
    'amount': '@integer(0, 99999)',
    // 实名认证编号
    'realNameId': '@integer(1000, 999999)'
  },
  'POST /User/CSaveInfo.json delay:1000': {
    isSuccess: true,
    body: true
  },
  'POST /User/SaveRealNameInfo.json delay:1000': {
    isSuccess: true,
    body: true
  },
  'POST /Order/Query/ListWorker.json delay:500': req => {
    const pageSize = req.body.pageSize || 15
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 15,
        [`datas|${pageSize}`]: [{
          'mobilePhone': /1[345789]\d{9}/,
          'userName': '@cname',
          'workerUserId': '@integer(1000, 2000)'
        }]
      }
    }
  },
  'POST /Salary/RechargeDebit.json delay:1000': true,
  'POST /User/BList.json delay:500': req => {
    const pageSize = req.body.pageSize || 15
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 15,
        [`datas|${pageSize}`]: [{
          'companyUserId': /\d{6}/,
          'companyUserName': '@cname',
          'userType|1': ['C', 'P'],
          'contactPhone': /1[345789]\d{9}/,
          'autoPayHour': '@integer(0, 24)',
          'registerTime': '@datetime',
          'formatRegisterTime': '@datetime',
          'orderStatus|1': ['N', 'D'],
          'status|1': ['N', 'D']
        }]
      }
    }
  },
  'POST /User/BInfo.json delay:1000': {
    'loginName': /1[345789]\d{9}/,
    // 手机号码
    'contactPhone': /1[345789]\d{9}/,
    // 姓名/公司名称
    'companyUserName': '@cname',
    // 用户类型(P:个人,C:企业用户)
    'userType|1': ['C', 'P'],
    // 联系人
    'contact': '@cname',
    // 公司简称
    'shortName': '@cname',
    // 注册时间
    'formatRegisterTime': '@datetime',
    // 发单状态(N/D)
    'orderStatus|1': ['N', 'D'],
    // 用户状态(N/D)
    'status|1': ['N', 'D'],
    // 订单自动支付时间
    'autoPayHour': '@integer(1, 24)',
    // 余额
    'amount': '@integer(0, 999999)'
  },
  'POST /User/BSaveUserInfo.json delay:1000': true,
  'POST /Salary/CWithdrawalsList.json': {
    'totalCount': '@integer(30, 200)',
    [`datas|15`]: [{
      // 提现编号
      'cashApplyId': '@integer(1, 10000)',
      // 提现用户
      'userName': '@cname',
      // 提现金额
      'amount': '@integer(1, 9999)',
      // 提现银行名称
      'bankName|1': ['CCB', 'CMB', 'ICBC', 'BOC', 'ABC', 'BOCOM', 'CMBC'],
      // 账号
      'bankNo': '@integer(16)',
      // 户主
      'bankUserName': '@cname',
      // 提现账户
      'withdrawalsAccount': '@integer(16)',
      // 申请时间
      'applyTime': '@datetime',
      // 申请时间(string)
      'formatApplyTime': '@datetime',
      // 状态(A:审核中,S:已标记,P:已通过,R:已驳回)
      'status|1': ['A', 'S', 'P', 'R'],
      // 驳回原因
      'rejectReason': '@csentence\n@csentence',
      // 联系电话
      'mobilePhone': /1[345789]\d{9}/
    }]
  },
  'POST /Salary/UpdateWithdrawalsStatus.json delay:1000': {
    isSuccess: true,
    body: true,
    message: 'ID不能为空'
  },
  'POST /Salary/TradeList.json delay:1000': {
    totalCount: 1,
    'datas|15': [{
      // 流水编号
      'transId': '@integer(1,10000)',
      // 账号
      'inAccountCashId': '@integer(1,100000)',
      // 交易金额
      'amount': '@integer(0,99999)',
      // 交易时间
      'transTime': '@datetime',
      // 交易时间(string)
      'formatTransTime': '@datetime',
      // 交易类型
      'transType|1': ['RC', 'PP', 'PS', 'AC', 'AB', 'PB', 'DA', 'TA'],
      // 交易对象
      'outAccountCashId': '@integer(1, 100)',
      // 支付方式(W:微信,C:钱包,O:线下,L:支付宝)
      'payType|1': ['L', 'W', 'C', 'O'],
      // 业务单号
      'bizNo': '@integer(0)'
    }]
  },
  'POST /User/RoleList.json delay:500': {
    isSuccess: true,
    'body|5': [
      {'roleId': '@integer(1, 1000000)', 'roleName|1': ['系统管理员', '超级管理员', '运营管理', '管理员', 'xx管理员']}
    ]
  },
  'POST /User/RoleOperation.json delay:1000': true,
  'POST /User/AdminList.json delay:1000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        'adminId': '@integer(1, 10000)',
        'adminName': '@cname',
        'loginName': '@string(5, 20)',
        'loginPwd': '@string(32)',
        'phone': /1[345789]\d{9}/,
        'email': '@email',
        'status|1': ['N', 'D'],
        'createTime': '@datetime',
        'formatCreateTime': '@datetime',
        'roleName|1': ['系统管理员', '超级管理员', '运营管理', '管理员', 'xx管理员'],
        'roleId|1': [1, 2, 3, 4, 5]
      }]
    }
  },
  'POST /SA/User/AdminOperation.json delay:2000': true,
  'POST /Finance/CStatisList.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        'orderMonth': '@date',
        'userName': '@cname',
        'mobile': /1[345789]\d{9}/,
        'orderCount': '@integer(10, 1000)',
        'receiveAmount': '@integer(1000, 1000000)',
        'userId': '@integer(100, 999)'
      }]
    }
  },
  'POST /User/SystemLogList.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        'createTime': '@now(\'year\')',
        'formatCreateTime': '@now(\'year\')',
        'userName': '@cname',
        'remark': '@csentence'
      }]
    }
  },
  // 使用 delay: time 规则延时
  'POST /A/TimeOrder/Query/List.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 支付状态(S1待支付,S2待财务确认,S3已支付,S4财务已确认)
          'payStatus': function () {
            let arr = ['S1', 'S2', 'S3', 'S4']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          // 服务者编号
          'workerUserId': '@integer(1, 10000)',
          // 服务者名
          'workerName': '@ctitle(0, 3)',
          // 订单编号
          'orderId': '@integer(1, 9999999999)',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          // 发布时间
          'showCreateTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 商品编号
          'itemId': '@integer(1, 9999999999)',
          // 商品名
          'itemName': '@ctitle(10)',
          // 服务实际时间
          'overWorkingTime': '@integer(1, 5)',
          // 支付金额
          'payAmount': '@integer(1, 1000)',
          // 支付类型
          'payType': function () {
            let arr = ['T1', 'T2']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          // 公司名
          'companyName': '@ctitle(8)公司',
          // 上门地址
          'address': '@ctitle(15)',
          // 预约服务时间
          'showAppointmentBeginTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 服务状态(S1预约中,S2待服务,S3服务中,S4服务完成,S5已取消)
          'serviceStatus': function () {
            let arr = ['S1', 'S2', 'S3', 'S4', 'S5']
            return arr[Math.floor(Math.random() * arr.length)]
          }
        }]
      }
    }
  },
  // 使用 delay: time 规则延时
  'POST /A/TimeOrder/Query/Detail.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        // 订单编号
        'orderId': '@integer(1, 10000)',
        // 订单号
        'orderNo': '@integer(1000000000, 9999999999)',
        // 服务状态(S1预约中,S2待服务,S3服务中,S4服务完成,S5已取消)
        'serviceStatus': function () {
          let arr = ['S1', 'S2', 'S3', 'S4', 'S5']
          return arr[Math.floor(Math.random() * arr.length)]
        },
        // 支付状态(S1待支付,S2待财务确认,S3已支付,S4财务已确认)
        'payStatus': function () {
          let arr = ['S1', 'S2', 'S3', 'S4']
          return arr[Math.floor(Math.random() * arr.length)]
        },
        // 发布时间
        'showCreateTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
        // 商品编号
        'itemId': '@integer(1, 9999999999)',
        // 商品名
        'itemName': '@ctitle(10)',
        // 服务者编号
        'workerUserId': '@integer(1, 9999999999)',
        // 服务者名
        'workerName': '@ctitle(3)',
        // 服务者电话
        'workerMobile': '13655599666',
        // 公司名
        'companyName': '@ctitle(10)公司',
        // 上门地址
        'address': '@ctitle(15)',
        // 预约服务时间
        'showAppointmentBeginTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
        // 联系人
        'contact': '@ctitle(3)',
        // 联系电话
        'phone': '15966655356',
        // 预计时长
        'expectHours': '@integer(1, 5)',
        // 服务实际时间
        'overWorkingTime': '@integer(1, 5)',
        // 支付金额
        'payAmount': '@integer(1, 1000)',
        // 支付类型
        'payType': function () {
          let arr = ['T1', 'T2']
          return arr[Math.floor(Math.random() * arr.length)]
        },
        // 备注
        'description': '@ctitle(50)',
        // 是否上门
        'isVisit': function () {
          let arr = ['Y', 'N']
          return arr[Math.floor(Math.random() * arr.length)]
        },
        // B端电话
        'companyUserMobile': '13855555666'
      }
    }
  },
  'POST /A/FixOrder/Query/List.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 发布时间
          'showCreateTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          // 公司名
          'companyName': '@ctitle(10)公司',
          // 业务类型
          'businessType': '@ctitle(10)',
          // 支付金额
          'payAmount': '@integer(5, 1000)',
          // 支付方式
          'payType': function () {
            let arr = ['T1', 'T2']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          // 客户来源
          'orderSource': '@ctitle(10)',
          // 供应商
          'supplier': '@ctitle(10)',
          // 财务确认时间
          'showFinanceConfirmTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 订单编号
          'orderId': '@integer(1, 9999999999)'
        }]
      }
    }
  },
  // 接口名称：Finance.Query.待确认订单接口编码：AFinanceQueryWaitConfirmOrderList 接口路由：/A/Finance/Query/WaitConfirmOrderList

  'POST /A/Finance/Query/WaitConfirmOrderList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 服务者编号
          'financeUserId': '@integer(1, 10000)',
          // 服务者名
          'financeUserName': '@ctitle(4)',
          // 订单编号
          'payNo': '@integer(1, 9999999999)',
          // 支付单号
          'orderId': '@integer(1, 9999999999)',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          // 订单类型
          'orderType': '@integer(1, 9999999999)',
          // 服务完成时间
          'showOverTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 支付金额
          'payAmount': '@integer(1, 1000)',
          // 付款对象 PayUser string
          'payUser': '@ctitle(4)',
          // 支付时间 ShowPayTime string
          'showPayTime': '@integer(1, 5)',
          // 有无确认 IsConfirm string
          'isConfirm': function () {
            let arr = ['Y', 'N']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          // 编号 WaitId int
          'waitId': '@integer(1, 9999999999)',
          // isSuccess: true,
          // 支付类型
          'payType': function () {
            let arr = ['T1', 'T2']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          // 确认时间
          'showFinanceConfirmTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 服务状态(S1预约中,S2待服务,S3服务中,S4服务完成,S5已取消)
          'serviceStatus': function () {
            let arr = ['S1', 'S2', 'S3', 'S4', 'S5']
            return arr[Math.floor(Math.random() * arr.length)]
          }
        }]
      }
    }
  },
  'POST /A/Finance/MailInfoList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          'invoiceNo': '@integer(1, 9999999999)',
          'receiveName': '@ctitle(4)',
          'phone': '@integer(1, 9999999999)',
          'address': '@ctitle(15)',
          'expressName': '@ctitle(5)',
          'expressNo': '@integer(1, 9999999999)',
          'applyId': '@integer(1, 9999999999)',
          // 状态(M:开票中,D:已寄出)
          'status': function () {
            let arr = ['M', 'D']
            return arr[Math.floor(Math.random() * arr.length)]
          }
        }]
      }
    }
  },
  'POST /A/Finance/OrderList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 10
    return {
      body: {
        totalCount: pageSize * 10,
        [`datas|${pageSize}`]: [{
          'orderNo': '@integer(1, 9999999999)',
          'payUser': '@ctitle(10)',
          'payAmount': '@integer(1, 1000)',
          'orderAmount': '@integer(1, 1000)',
          'payType': function () {
            let arr = ['T1', 'T2']
            return arr[Math.floor(Math.random() * arr.length)]
          }
        }]
      }
    }
  },
  'POST /A/Finance/Details.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        'invoiceTitle': '@ctitle(4)',
        'mobile': '@integer(1, 9999999999)',
        'companyAddress': '@ctitle(15)',
        'bankName': '@ctitle(5)',
        'companyTaxNo': '@integer(1, 9999999999)',
        'bankAccount': '@integer(1, 9999999999)'
      }
    }
  },

  'POST /A/Finance/ApplyInvoiceList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          'invoiceNo': '@integer(1, 9999999999)',
          'applyTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          'formatApplyTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          'invoiceType': function () {
            let arr = ['IO', 'IE']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          'orderAmount': '@integer(1, 1000)',

          'status': function () {
            let arr = ['I', 'A', 'D', 'R']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          'rejectReason': '@ctitle(10)',
          'adminName': '@ctitle(4)',
          'applyId': '@integer(1, 9999999999)',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          'totalAmount': '@integer(1, 10000)',
          'showPayTime': '@integer(1, 5)'
        }]
      }
    }
  },
  'POST /A/TimeOrder/Query/AppointmentList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 订单编号
          'orderId': '@integer(1, 9999999999)',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          // 预约时间
          'showAppointmentBeginTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 预约时长
          'expectHours': '@integer(1, 5)',
          // 服务者
          'workerName': '@ctitle(2,4)',
          // 公司名
          'companyName': '@ctitle(10)公司',
          // 地址
          'address': '@ctitle(10)'
        }]
      }
    }
  },
  'POST /A/TimeOrder/Query/DelayList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 订单编号
          'orderId': '@integer(1, 9999999999)',
          // 订单号
          'orderNo': '@integer(1000000000, 9999999999)',
          // 付款对象
          'payUser': '@ctitle(2,4)',
          // 支付金额
          'payAmount': '@integer(100, 500)',
          // 支付方式
          'payType': 'T@integer(1, 2)',
          // 原因
          'financeReason': '@ctitle(10, 50)',
          // 支付时间
          'showPayTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
        }]
      }
    }
  },
  'POST /A/User/TaxList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 15
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 15,
        [`datas|${pageSize}`]: [
          {
            'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")', // 提交时间
            'formatCreateTime': '@datetime("yyyy-MM-dd HH:mm:ss")', // 提交时间
            'userName': '@cname', // 用户名
            'mobile': '@float', // 电话
            'otherMobile': '@float', // 其他电话
            'soure|1': ['人人财务官网', '微信服务号', '朋友', '微信朋友圈', '微博', '今日头条'], // 来源
            'cityName': `@cfirst@clast` // 城市
          }
        ]
      }
    }
  },
  'POST /A/TimeOrder/Do/DelayReason.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: true
    }
  },
  // 反馈列表
  'POST /User/FeedBackList.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          'feedbackId': '@integer(1, 9999999999)',
          'formatFeedbackTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          'feedbackTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          'userType': function () {
            let arr = ['B', 'C']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          'status': function () {
            let arr = ['W', 'O']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          'content': '@ctitle(10)',
          'loginName': '@ctitle(4)'
        }]
      }
    }
  },
  // 操作详情
  'POST /User/FeedBackDetails.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        userType: function () {
          let arr = ['B', 'C']
          return arr[Math.floor(Math.random() * arr.length)]
        },
        userName: '@ctitle(4)',
        mobile: '@integer(1, 9999999999)',
        actionResult: '@ctitle(15)',
        content: '@ctitle(10)',
        feedbackId: '@integer(1, 9999999999)'
      }
    }
  },
  // 保存备注
  'POST /User/SaveFeedBackRemark.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 标签列表
  'POST /Tag/List.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          jobTagId: '@integer(1, 9999999999)',
          jobTagName: '@ctitle(2,4)',
          status: function () {
            let arr = ['N', 'D']
            return arr[Math.floor(Math.random() * arr.length)]
          },
          jobDescription: '@ctitle(10)'
        }]
      }
    }
  },
  // 新增(编辑)标签
  'POST /Tag/Operation.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        isSuccess: true,
        'JobTagName': '@ctitle(4)',
        'JobTagId': '@integer(1, 9999999999)',
        'JobDescription': '@ctitle(15)'
      }
    }
  },
  // 修改标签状态接口
  'POST /Tag/UpdateStatus.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        isSuccess: true
      }
    }
  },
  'POST /A/Order/Query/Log.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          // 日志时间
          'showLogTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
          // 日志类型
          'logType': '@ctitle(4,8)',
          // 日志详情
          'logDetail': '@ctitle(20,40)',
          // 日志备注
          'logRemark': '@ctitle(20,40)',
          // 记录人
          'logUserId': '@integer(1, 100000)',
          // 记录人
          'logUserName': '@ctitle(2,4)',
          // 日志编号
          'logId': '@integer(1, 100000)',
          // 订单号
          'orderId': '@integer(1, 100000)'
        }]
      }
    }
  },
  'POST /Order/Query/ListMain.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          orderId: '@integer(1, 9999999999)',
          orderNo: '@integer(1, 9999999999)',
          continuityOrderId: '@integer(0, 1)',
          companyUserId: '@integer(1, 9999999999)',
          companyName: '@ctitle(4,8)',
          orderContact: '@ctitle(2,3)',
          orderPhone: '15988855643',
          jobTagId: '@integer(1, 9999999999)',
          jobTagName: '@ctitle(2,4)',
          showBeginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          showEndTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          originalWorkerNum: '@integer(1, 100)',
          workerNum: '@integer(1, 100)',
          applyWorkerNum: '@integer(1, 100)',
          singleSalary: '@integer(20, 100)',
          sumSalary: '@integer(200, 600)',
          cityId: '@integer(1, 9999999999)',
          cityName: '@ctitle(2, 4)市',
          address: '@ctitle(10,15)',
          orderStatus: '@integer(1, 4)'
        }]
      }
    }
  },
  'POST /Order/Query/DetailMain.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        orderId: '@integer(1, 9999999999)',
        orderNo: '@integer(1, 9999999999)',
        orderTitle: '@ctitle(4,8)',
        showCreateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        continuityOrderId: '@integer(0, 1)',
        'continuityDates|5-20': ['@datetime("yyyy-MM-dd HH:mm:ss")'],
        companyUserId: '@integer(1, 9999999999)',
        companyName: '@ctitle(4,8)',
        orderContact: '@ctitle(2,3)',
        orderPhone: '15988855643',
        jobTagId: '@integer(1, 9999999999)',
        jobTagName: '@ctitle(2,4)',
        showBeginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        showEndTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        originalWorkerNum: '@integer(1, 100)',
        workerNum: '@integer(1, 100)',
        applyWorkerNum: '@integer(1, 100)',
        singleSalary: '@integer(20, 100)',
        sumSalary: '@integer(200, 600)',
        cityId: '@integer(1, 9999999999)',
        cityName: '@ctitle(2, 4)市',
        address: '@ctitle(10,15)',
        orderStatus: '@integer(1, 4)',
        'createType|1': ['C', 'P'],
        prepayAmount: '@integer(100, 600)',
        description: '@ctitle(20,40)',
        orderRemark: '@ctitle(20,40)',
        createUserName: '@cname(2, 4)'
      }
    }
  },
  'POST /Order/Query/DetailMainListSub.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        'datas|15-20': [{
          orderSubId: '@integer(1, 9999999999)',
          orderSubNo: '@integer(1, 9999999999)',
          workerUserId: '@integer(0, 1)',
          workerName: '@ctitle(2, 4)',
          workerMobile: '18566665548',
          showApplyTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          showClockOnTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          clockOnAddress: '@ctitle(10,15)',
          showClockOffTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          clockOffAddress: '@ctitle(10,15)',
          overType: 'S@integer(1, 7)',
          timeStatus: '@integer(1, 4)'
        }]
      }
    }
  },
  // 取消主订单
  'POST /Order/Do/CancelMain.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 取消子订单
  'POST /Order/Do/CancelSub.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 修改详情
  'POST /Order/Do/Modify.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 修改备注
  'POST /Order/Do/Remark.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 指派
  'POST /Order/Do/Apply.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 支付
  'POST /Order/Do/Pay.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  // 处理事件
  'POST /Order/Do/EventHandel.json delay:1000': (req, res) => {
    res.send({
      isSuccess: true,
      body: {
        isSuccess: true
      }
    })
  },
  'POST /Order/Query/ListSub.json delay:1000': (req) => {
    const pageSize = req.body.pageSize || 20
    return {
      isSuccess: true,
      body: {
        totalCount: pageSize * 20,
        [`datas|${pageSize}`]: [{
          orderSubId: '@integer(1, 9999999999)',
          orderSubNo: '@integer(1, 9999999999)',
          orderId: '@integer(1, 9999999999)',
          orderNo: '@integer(1, 9999999999)',
          orderTitle: '@ctitle(2,10)',
          companyUserId: '@integer(1, 9999999999)',
          companyName: '@ctitle(4,8)',
          workerUserId: '@integer(0, 1)',
          workerName: '@ctitle(2, 4)',
          workerMobile: '18566665548',
          showBeginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          showEndTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          address: '@ctitle(10,15)',
          singleSalary: '@integer(20, 100)',
          adjustSalary: '@integer(20, 100)',
          orderContact: '@ctitle(2,3)',
          orderPhone: '15988855643',
          showApplyTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          showClockOnTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          clockOnAddress: '@ctitle(10,15)',
          showClockOffTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          clockOffAddress: '@ctitle(10,15)',
          subStatus: '@integer(1, 6)',
          autoPayMinutes: '@integer(1, 5000)'
        }]
      }
    }
  },
  'POST /Order/Query/DetailSub.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        orderSubId: '@integer(1, 9999999999)',
        orderSubNo: '@integer(1, 9999999999)',
        orderId: '@integer(1, 9999999999)',
        orderNo: '@integer(1, 9999999999)',
        orderTitle: '@ctitle(2,10)',
        companyUserId: '@integer(1, 9999999999)',
        companyName: '@ctitle(4,8)',
        workerUserId: '@integer(0, 1)',
        workerName: '@ctitle(2, 4)',
        workerMobile: '18566665548',
        showBeginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        showEndTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        address: '@ctitle(10,15)',
        singleSalary: '@integer(20, 100)',
        adjustSalary: '@integer(20, 100)',
        orderContact: '@ctitle(2,3)',
        orderPhone: '15988855643',
        showClockOnTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        clockOnAddress: '@ctitle(10,15)',
        showClockOffTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        clockOffAddress: '@ctitle(10,15)',
        autoPayMinutes: '@integer(1, 5000)',
        showOverTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        workingHours: '@integer(5, 10)',
        showCreateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        continuityOrderId: '@integer(0, 1)',
        'continuityDates|5-10': ['@datetime("yyyy-MM-dd HH:mm:ss")'],
        jobTagName: '@ctitle(2,3)',
        originalWorkerNum: '@integer(1, 100)',
        workerNum: '@integer(1, 100)',
        applyWorkerNum: '@integer(1, 100)',
        prepayAmount: '@integer(100, 500)',
        description: '@ctitle(20,80)',
        showApplyTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        subStatus: '@integer(1, 6)',
        overType: 'S@integer(1, 7)',
        timeStatus: '@integer(1, 4)',
        cityName: '@ctitle(2, 3)市'
      }
    }
  },
  'POST /Order/Query/ListEvent.json delay:1000': (req) => {
    return {
      isSuccess: true,
      body: {
        'datas|0-2': [{
          eventId: '@integer(1, 9999999999)',
          eventContent: '@ctitle(20, 40)',
          showCreateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          actionUserName: '@cname(2, 3)',
          showActionTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          orderSubId: '@integer(1, 9999999999)',
          orderSubNo: '@integer(1, 9999999999)',
          'status|1': ['P', 'C'],
          remark: '@ctitle(20, 40)'
        }]
      }
    }
  },
  'POST /User/Like/SettingDetail.json': {
    // 企业编号
    'companyUserId': '@integer(10, 100)',
    // 是否开启
    'isOpen': '@boolean',
    // 个数限制
    'likeCountLimit': '@integer(1, 100)',
    // 服务有效期
    'likeServicesLimit': '@datetime'
  },
  'POST /User/Like/SettingSave.json delay:2000': true,
  'POST /User/Like/ListC.json delay:1000': {
    'totalCount': '@integer(10, 20)',
    'datas|10': [{
      // 收藏编号
      'likeId': '@integer(1, 9999999999)',
      // 工人编号
      'workerUserId': '@integer(1, 9999999999)',
      // 工人姓名
      'workerUserName': '@cname',
      // 性别
      'sex|1': ['F', 'M'],
      // 抢单资格
      'orderStatus|1': ['A', 'B'],
      // 抢单资格
      'orderStatusText|1': ['A', 'B'],
      // 状态
      'status|1': ['A', 'B'],
      // 状态
      'statusText|1': ['A', 'B'],
      // 完成单数
      'completeOrderCount': '@integer(1, 9999999999)',
      // 最后接单时间
      'lastOrderTime': '@datetime',
      // 收藏时间
      'likeTime': '@datetime',
      // 收藏过期时间
      'likeExpireTime': '@datetime',
      // 收藏类型
      'likeType|1': ['A', 'B'],
      // 收藏人
      'likeUserId': '@integer(1, 9999999999)',
      // 收藏人
      'likeUserName': '@cname'
    }]
  }
}

Mock.mockWithRules(bindModel(globalRules), {
  baseUrl: 'http://' + Config.getRestfulUrl()
})
