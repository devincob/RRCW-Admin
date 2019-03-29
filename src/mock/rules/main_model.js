import Mock from 'mock2js'
import { bindModel } from '../util'
import Config from '../../src/config'

// 模拟 CaiWuModel 接口

const globalRules = {
  'POST /Index/Data.json': {
    // 今日新增开户订单数量
    'aOCount': '@integer(1, 10000)',
    // 本月已完成开户订单数量
    'aOCompletedCount': '@integer(1, 10000)',
    // 今天新增开票订单数量
    'iOCount': '@integer(1, 10000)',
    // 本月已完成开票订单数量
    'iOCompletedCount': '@integer(1, 10000)'
  },
  'POST /Common/CreateCode.json ': {
    // 验证码序列号
    'codeSn': '@string(32)',
    // BASEB4编码
    'base64Image': '@dataImage(90x40, 随便填写)'
  },
  'POST /Common/Login.json delay:3000': req => {
    // 使用setTimeout 延时
    return new Promise(resolve => {
      setTimeout(() => {
        if (req.body.loginName === 'admin' && req.body.loginPwd === '888888') {
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
  'POST /AdminUser/RoleList.json delay:500': {
    isSuccess: true,
    'body|5': [
      {'roleId': '@integer(1, 1000000)', 'roleName|1': ['系统管理员', '超级管理员', '运营管理', '管理员', 'xx管理员']}
    ]
  },
  'POST /AdminUser/RoleOperation.json delay:1000': true,
  'POST /AdminUser/List.json delay:1000': req => {
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
  'POST /Channel/List.json delay:1000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        'channelId': '2678',
        'channelName': '@cname',
        'channelContact': '@cname',
        'othersName': '@cname',
        'channelPhone': /1[345789]\d{9}/,
        'channelRatio': '@integer(1, 100)',
        'channelStatus|1': ['N', 'D']
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
  'POST /Order/EditAccountOrder.json delay:500': {
    isSuccess: true,
    body: true
  },
  'POST /Common/ListCustomer.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 客户编号
        'customerId': '@integer(1, 200)',
        // 客户名称
        'customerName': '@cname(2, 3)'
      }]
    }
  },
  'POST /Common/ListSourceTax.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 税源地编号
        'sourceTaxId': '@integer(1, 200)',
        // 税源地名称
        'sourceTaxName': '@ctitle(4, 8)',
        // 增值税返税比率
        'zZSRatio': '@integer(1, 30)',
        // 个税返税比率
        'gRSDSRatio': '@integer(1, 30)',
        // 附加税返税比率
        'fJSRatio': '@integer(1, 30)',
        // 印花税返税比率
        'yHSRatio': '@integer(1, 30)'
      }]
    }
  },
  'POST /Common/ListGoods.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 商品编号
        'goodsId': '@integer(1, 200)',
        // 商品名
        'goodsName': '@ctitle(4, 8)',
        // 纳税性质(N一般,S小规模)
        'taxType|1': ['N', 'S'],
        // 发票类型
        'invoiceTypeId': '@integer(1, 200)',
        // 发票类型名称
        'invoiceTypeName': '@ctitle(4, 8)',
        // 开票服务费费率
        'invoiceServiceRatio': '@integer(1, 50)',
        // 开户服务费
        'serviceCharge': '@integer(1, 200)',
        // 开户押金
        'deposit': '@integer(1, 200)'
      }]
    }
  },
  'POST /Common/ListCompanyType.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 公司类型编号
        'companyTypeId': '@integer(1, 200)',
        // 名称
        'companyTypeName': '@ctitle(4, 8)公司',
        // 经营范围
        'businessScope': '@ctitle(40, 80)'
      }]
    }
  },
  // 'POST /Common/ListDept.json delay:2000': req => {
  //   return {
  //     datas: [{
  //       //  部门编号(人工填入)
  //       'deptId': 24576,
  //       // 上级部分编号
  //       'parentDeptId': 0,
  //       // 部门名称
  //       'deptName': '总部',
  //       // 部门负责人
  //       'deptUserId': 0,
  //       'deptLevel': 1
  //     },
  //     {'deptId': 26112,
  //       'parentDeptId': 24576,
  //       'deptName': '华南大区',
  //       'deptUserId': 0,
  //       'deptLevel': 2
  //     },
  //     {'deptId': 26111,
  //       'parentDeptId': 24576,
  //       'deptName': '华东大区',
  //       'deptUserId': 0,
  //       'deptLevel': 2
  //     },
  //     {'deptId': 26496,
  //       'parentDeptId': 26112,
  //       'deptName': '成都分公司',
  //       'deptUserId': '@integer(1, 10)',
  //       'deptLevel': 3
  //     },
  //     {'deptId': 26497,
  //       'parentDeptId': 26112,
  //       'deptName': '重庆分公司',
  //       'deptUserId': '@integer(1, 10)',
  //       'deptLevel': 3
  //     },
  //     {'deptId': 26508,
  //       'parentDeptId': 26496,
  //       'deptName': '成都东运营部',
  //       'deptUserId': 0,
  //       'deptLevel': 4
  //     },
  //     {'deptId': 26509,
  //       'parentDeptId': 26496,
  //       'deptName': '成都西运营部',
  //       'deptUserId': 0,
  //       'deptLevel': 4
  //     }
  //     ]
  //   }
  // },
  'POST /Common/ListDistict.json delay:2000': req => {
    return {
      datas: [{
        'distictId': 2,
        'districtName': '澳门特别行政区',
        'level': 'P',
        'parentId': 1
      },
      {
        'distictId': 11,
        'districtName': '北京',
        'level': 'P',
        'parentId': 1
      },
      {
        'distictId': 12,
        'districtName': '北京东城区',
        'level': 'C',
        'parentId': 11
      },
      {
        'distictId': 13,
        'districtName': '北京西城区',
        'level': 'C',
        'parentId': 11
      },
      {
        'distictId': 22,
        'districtName': '上海',
        'level': 'P',
        'parentId': 1
      },
      {
        'distictId': 21,
        'districtName': '徐汇区',
        'level': 'C',
        'parentId': 22
      }
      ]
    }
  },
  'POST /Role/List.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      // 'totalCount': '@integer(30, 200)',
      isSuccess: true,
      [`body|${pageSize}`]: [{
        // 客户编号
        'adminRoleId': '@integer(1, 200)',
        // 客户名称
        'adminRoleName': '@cname(2, 3)'
      }]
    }
  },
  'POST /Role/PermissionList.json': {},
  'POST /Customer/List.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 客户编号
        'customerId': '@integer(1, 200)',
        // 客户名称
        'customerName': '@cname(2, 3)',
        // 客户名称所属商务
        'belongAdminUserName': '@cname(2, 3)',
        // 电话
        'phone': '@integer(1, 99999999999)',
        // 邮箱
        'email': '@email',
        // 生日
        'showBirthday': '@datetime',
        // 居住地址
        'liveAddress': '@ctitle(5)',
        //   办公地址
        'workAddress': '@ctitle(6)',
        // 状态(N/D)
        'status|1': ['N', 'D'],
        // 来源(直属:D;渠道:C)
        'source|1': ['C', 'D'],
        // 所属部门
        'deptId': '@integer(1, 200)',
        // 所属部门
        'deptName': '@cname(2, 3)',
        // 所属商务
        'belongAdminUserId': '@integer(1, 200)',
        // 备注
        'remark': '@string',
        // 创建人
        'createAdminUserId': '@integer(1, 200)',
        //  创建时间
        'showCreateTime': '@datetime'
      }]
    }
  },
  'POST /Customer/Detail.json delay:2000': req => {
    return {
      datas: {
        // 编号
        'customerId': '@integer(1, 200)',
        // 客户名称
        'customerName': '@cname(3, 4)',
        // 客户名称所属商务
        'belongAdminUserName': '@cname(2, 3)',
        // 电话
        'phone': '@integer(1, 9999999999)',
        // 邮箱
        'email': '@email',
        // 生日
        'showBirthday': '@datetime',
        // 居住地址
        'liveAddress': '上海市@ctitle(2)区@ctitle(2)路@integer(1, 200)号',
        //   办公地址
        'workAddress': '上海市@ctitle(2)区@ctitle(2)路@integer(1, 200)号',
        // 状态(N/D)
        'status|1': ['N', 'D'],
        // 来源(直属:D;渠道:C)
        'source|1': ['C', 'D'],
        // 所属部门
        'deptId': 26508,
        // 所属部门
        'deptName': '成都运营部',
        // 所属商务
        'belongAdminUserId': '@integer(1, 200)',
        // 备注
        'remark': '@string',
        // 创建人
        'createAdminUserId': '@integer(1, 200)',
        //  创建时间
        'showCreateTime': '@datetime'
      }
    }
  },
  'POST /Customer/Update.json delay:500': {
    isSuccess: true,
    body: true
  },
  'POST /Channel/Update.json delay:500': {
    isSuccess: true,
    body: true
  },
  'POST /SourceTax/List.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 编号
        'sourceTaxId': '@integer(1, 200)',
        // 税源地名称
        'sourceTaxName': '@cname(2, 3)',
        // 省编号
        'provinceId': '@integer(1, 200)',
        'provinceName': '@cname(2, 3)',
        // 城市编号
        'cityId': '@integer(1, 200)',
        'cityName': '@cname(2, 3)',
        // 电话
        'phone': '@integer(1, 99999999999)',
        'zZSRatio': '@integer(1, 30)',
        // 个税返税比率
        'gRSDSRatio': '@integer(1, 30)',
        // 附加税返税比率
        'fJSRatio': '@integer(1, 30)',
        // 印花税返税比率
        'yHSRatio': '@integer(1, 30)',
        // 居住地址
        'TaxAddress': '@ctitle(6)',
        // 状态(N/D)
        'status|1': ['N', 'D'],
        'isNeedFinanceID|1': ['Y', 'N'],
        'belongAdminUserId': '@integer(1, 200)',
        'contact': '@cname(2, 3)',
        'legalAge': '@integer(18, 99)',
        // 创建人
        'createAdminUserId': '@integer(1, 200)',
        //  创建时间
        'showCreateTime': '@datetime'
      }]
    }
  },
  'POST /SourceTax/Detail.json delay:2000': req => {
    return {
      datas: {
        // 编号
        'sourceTaxId': '@integer(1, 200)',
        // 税源地名称
        'sourceTaxName': '@cname(2, 3)',
        // 省编号
        'provinceId': 11,
        'provinceName': '北京',
        // 城市编号
        'cityId': 12,
        'cityName': '北京城区',
        // 电话
        'phone': '@integer(1, 99999999999)',
        'zZSRatio': '@integer(1, 30)',
        // 个税返税比率
        'gRSDSRatio': '@integer(1, 30)',
        // 附加税返税比率
        'fJSRatio': '@integer(1, 30)',
        // 印花税返税比率
        'yHSRatio': '@integer(1, 30)',
        // 居住地址
        'TaxAddress': '@ctitle(6)',
        // 状态(N/D)
        'status|1': ['N', 'D'],
        'isNeedFinanceID|1': ['Y', 'N'],
        'belongAdminUserId': '@integer(1, 200)',
        'contact': '@cname(2, 3)',
        'legalAge': '@integer(18, 99)',
        // 创建人
        'createAdminUserId': '@integer(1, 200)',
        //  创建时间
        'showCreateTime': '@datetime'
      }
    }
  },
  'POST /Channel/Detail.json delay:2000': req => {
    return {
      datas: {
        'channelId': '2678',
        'ChannelName': '@cname(2, 3)',
        'channelContact': '@cname(2, 3)',
        'channelPhone': '@integer(1, 99999999999)',
        'channelRatio': '@integer(1, 30)',
        'ChannelStatus|1': ['N', 'D']
      }
    }
  },
  'POST /SourceTax/Update.json delay:500': {
    isSuccess: true,
    body: true
  },
  'POST /SourceTax/Modify.json delay:2000': req => {
    return {
      datas: {
        // 编号
        'sourceTaxId': '@integer(1, 200)',
        // 税源地名称
        'sourceTaxName': '@cname(2, 3)',
        // 省编号
        'provinceId': '@integer(1, 200)',
        'provinceName': '@cname(2, 3)',
        // 城市编号
        'cityId': '@integer(1, 200)',
        'cityName': '@cname(2, 3)',
        // 电话
        'phone': '@integer(1, 99999999999)',
        'zZSRatio': '@integer(1, 30)',
        // 个税返税比率
        'gRSDSRatio': '@integer(1, 30)',
        // 附加税返税比率
        'fJSRatio': '@integer(1, 30)',
        // 印花税返税比率
        'yHSRatio': '@integer(1, 30)',
        // 居住地址
        'TaxAddress': '@ctitle(6)',
        // 状态(N/D)
        'status|1': ['N', 'D'],
        'isNeedFinanceID|1': ['Y', 'N'],
        'belongAdminUserId': '@integer(1, 200)',
        'contact': '@cname(2, 3)',
        'legalAge': '@integer(18, 99)',
        // 创建人
        'createAdminUserId': '@integer(1, 200)',
        //  创建时间
        'showCreateTime': '@datetime'
      }
    }
  },
  'POST /Common/ListBelongAdminUser.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(1, 10)',
      [`datas|${pageSize}`]: [{
        // 客户编号
        'adminUserId': '@integer(1, 200)',
        // 客户名称
        'userName': '@cname(2, 3)'
      }]
    }
  },
  'POST /Common/ListInvoiceType.json': {
    'datas|4': [{
      // 类型编号
      'invoiceTypeId': '@integer(1,1000)',
      // 发票名称
      'invoiceTypeName|1': ['3%增值税普票', '3%增值税专票', '6%增值税普票', '6%增值税专票'],
      // 发票税率
      'invoiceTypeTax': '@decimal'
    }]
  },
  'POST /Goods/List.json': {
    totalCount: '@integer(10, 100)',
    'datas|10-20': [{
      // 商品名
      'goodsName': '@cname',
      // 纳税性质(N一般,S小规模)
      'taxType|1': ['N', 'S'],
      // 发票类型
      'invoiceTypeId': '@integer(1,5)',
      // 发票类型名称
      'invoiceTypeName': '@cname',
      // 开票服务费费率
      'invoiceServiceRatio': '@integer(1,5)',
      // 开户服务费
      'serviceCharge': '@integer(1,5)',
      // 开户押金
      'deposit': '@integer(1,5)',
      // 状态(N,D)
      'status|1': ['N', 'D'],
      // 创建人
      'createAdminUserId': '@integer(1,5)',
      // 创建时间
      'showCreateTime': '@datetime',
      // 商品编号
      'goodsId': '@integer(1,55)',
    }]
  },
  'POST /Goods/Modify.json delay:2000': true,
  'POST /Goods/Update.json delay:2000': true,
  'POST /Goods/Detail.json': req => {
    return {
      // 商品名
      'goodsName': '@cname',
      // 纳税性质(N一般,S小规模)
      'taxType|1': ['N', 'S'],
      // 发票类型
      'invoiceTypeId': '@integer(1,5)',
      // 发票类型名称
      'invoiceTypeName': ['3%增值税普票', '3%增值税专票', '6%增值税普票', '6%增值税专票'],
      // 开票服务费费率
      'invoiceServiceRatio': 22.22,
      // 开户服务费
      'serviceCharge': '@integer(100, 10000)',
      // 开户押金
      'deposit': '@integer(1000,10000)',
      // 状态(N,D)
      'status|1': ['N', 'D'],
      // 创建人
      'createAdminUserId': '@integer(1, 100)',
      // 创建时间
      'showCreateTime': '@datetime',
      // 商品编号
      'goodsId': '@integer(1,1000)'
    }
  },
  'POST /Company/Modify.json delay:1000': true,
  'POST /Company/Update.json delay:1000': true,
  'POST /Company/List.json delay:1000': {
    totalCount: '@integer(10,100)',
    'datas|10-20': [{
      // 公司编号
      'companyId': '@integer(1, 1000)',
      // 公司名
      'companyName': '@cname',
      // 客户编号
      'customerId': '@integer(100,1000)',
      // 姓名
      'customerName': '@cname',
      // 税源地编号
      'sourceTaxId': '@integer(1, 1000)',
      // 税源地名称
      'sourceTaxName': '@cname',
      // 商品编号
      'goodsId': '@integer(1, 1000)',
      // 商品名
      'goodsName': '@cname',
      // 执照地址
      'licenseUrl': '@image',
      // 状态(N/D)
      'status|1': ['N', 'D'],
      // 创建人
      'createAdminUserId': '@integer(1, 10000)',
      // 创建时间
      'showCreateTime': '@datetime'
    }]
  },
  'POST /Company/Detail.json delay:1000': {
    // 公司编号
    'companyId': '@integer(1, 1000)',
    // 公司名
    'companyName': '@cname',
    // 客户编号
    'customerId': '@integer(1, 1000)',
    // 姓名
    'customerName': '@cname',
    // 税源地编号
    'sourceTaxId': '@integer(1, 1000)',
    // 税源地名称
    'sourceTaxName': '@cname',
    // 商品编号
    'goodsId': '@integer(1, 1000)',
    // 商品名
    'goodsName': '@cname',
    // 执照地址
    'licenseUrl': '@image',
    // 状态(N/D)
    'status|1': ['N', 'D'],
    // 创建人
    'createAdminUserId': '@integer(1, 10000)',
    // 创建时间
    'showCreateTime': '@datetime'
  },
  'POST /Common/ListSourceTax.json delay:1000': {
    'datas|10-20': [{
      // 税源地编号
      'sourceTaxId': '@integer(1, 1000)',
      // 税源地名称
      'sourceTaxName': '@cname',
      // 增值税返税比率
      'zZSRatio': '@integer(1, 1000)',
      // 个税返税比率
      'gRSDSRatio': '@integer(1, 1000)',
      // 附加税返税比率
      'fJSRatio': '@integer(1, 1000)',
      // 印花税返税比率
      'yHSRatio': '@integer(1, 1000)'
    }]
  },
  'POST /Common/ListCompany.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 公司编号
        'companyId': '@integer(1, 200)',
        // 名称
        'companyName': '@ctitle(4, 8)公司'
      }]
    }
  },
  'POST /Order/AccountOrderQuery.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 订单Id
        'orderId': '@integer(1, 200)',
        // 订单编号
        'orderNo': '@integer(111111111, 9999999999)',
        // 客户编号
        'customerId': '@integer(1, 200)',
        // 客户姓名
        'customerName': '@cname(2, 3)',
        // 税源地名称
        'sourceTaxName': '@ctitle(3, 5)',
        // 商品名称
        'goodsName': '@ctitle(3, 5)',
        // 实际支付交易费
        'totalAmount': '@integer(1, 200)',
        // 实际支付押金
        'realDepositFee': '@integer(1, 200)',
        // 是否加急(Y/N)
        'isPriority|1': ['Y', 'N'],
        // 流程名称
        'workflowName': '@ctitle(3, 5)'
      }]
    }
  },
  'POST /Order/InvoiceOrderQuery.json delay:2000': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        // 订单Id
        'orderId': '@integer(1, 200)',
        // 订单编号
        'orderNo': '@integer(111111111, 9999999999)',
        // 客户编号
        'customerId': '@integer(1, 200)',
        // 客户姓名
        'customerName': '@cname(2, 3)',
        // 税源地名称
        'sourceTaxName': '@ctitle(3, 5)',
        // 商品名称
        'goodsName': '@ctitle(3, 5)',
        // 开票金额
        'invoiceAmount': '@integer(1, 200)',
        // 发票税率
        'invoiceTypeTax': '@integer(1, 200)',
        // 是否加急(Y/N)
        'isPriority|1': ['Y', 'N'],
        // 流程名称
        'workflowName': '@ctitle(3, 5)'
      }]
    }
  },
  'POST /Order/AccountOrderDetail.json delay:100': req => {
    return {
      isSuccess: true,
      body: {
        // 订单信息
        'orderInfo': {
          // 订单Id
          'orderId': '@integer(1, 1000)',
          // 订单编号
          'orderNo': '@integer(111111111, 999999999)',
          // 客户编号
          'customerId': '@integer(1, 1000)',
          // 客户姓名
          'customerName': '@cname(2, 3)',
          // 税源地编号
          'sourceTaxId': '@integer(1, 1000)',
          // 税源地名称
          'sourceTaxName': '@ctitle(5, 11)',
          // 商品编号
          'goodsId': '@integer(1, 1000)',
          // 商品名称
          'goodsName': '@ctitle(3, 6)',
          // 站点名称
          'companyName': '@ctitle(3, 6)',
          // 站点类型编号
          'companyTypeId': '@integer(1, 1000)',
          // 站点类型名称
          'companyTypeName': '@ctitle(3, 6)',
          // 经营范围
          'businessScope': '@ctitle(15, 60)',
          // 注册资本
          'registeredCapital': '@integer(1, 1000)',
          // 纳税性质
          'taxTypeName': '@ctitle(3, 6)',
          // 投资人姓名
          'investorName': '@cname(2, 3)',
          // 投资人手机
          'investorMobile': /1[345789]\d{9}/,
          // 投资人身份证正面URL
          'investorIdCardFrontUrl': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 投资人身份证背面
          'investorIdCardBackUrl': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865932337&di=b5b47d0c4896aff62a21a8ba17c9c945&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3Db05d0b3c38fa828bc52e95a394672458%2Fd788d43f8794a4c2717d681205f41bd5ad6e39a8.jpg',
          // 投资人身份证号码
          'investorIdCardNo': '654896521458745632',
          // 投资人邮箱
          'investorEmail': 'dsklfhakjsl@djkf.com',
          // 财务人员姓名
          'financePersonName': '@cname(2, 3)',
          // 财务人员手机
          'financePersonMobile': /1[345789]\d{9}/,
          // 财务人员身份证正面URL
          'financePersonIdCardFrontUrl': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 财务人员身份证背面URL
          'financePersonIdCardBackUrl': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865932337&di=b5b47d0c4896aff62a21a8ba17c9c945&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3Db05d0b3c38fa828bc52e95a394672458%2Fd788d43f8794a4c2717d681205f41bd5ad6e39a8.jpg',
          // 财务人员身份证号
          'financePersonIdCardNo': '322165488864897564',
          // 身份证寄回地址
          'idCardReturnAddress': '@ctitle(5, 11)',
          // 发票快递地址
          'invoiceExpressAddress': '@ctitle(5, 11)',
          // 材料交付地址
          'fileExpressAddress': '@ctitle(5, 11)',
          'isAdjustment|1': ['Y', 'N'],
          // 是否需要审批
          'isNeedApproval|1': ['Y', 'N'],
          // 是否加急
          'isPriority|1': ['Y', 'N'],
          // 交易费
          'tradeFee': '@integer(1, 1000)',
          // 押金费用
          'depositFee': '@integer(1, 1000)',
          // 押金减免(实际减免金额)
          'depositRemissionAmount': '@integer(1, 1000)',
          // 交易费折扣(折扣)
          'tradeFeeDiscount': '@integer(1, 1000)',
          // 交易费折扣金额
          'tradeFeeDiscountAmount': '@integer(1, 1000)',
          // 合计支付金额
          'totalAmount': '@integer(1, 1000)',
          // 订单创建时间
          'createTime': '@datetime',
          // 创建人
          'createAdminUserId': '@integer(1, 1000)',
          // 提交时间
          'showSubmitTime': '@datetime',
          // 创建部门
          'createAdminUserDeptId': '@integer(1, 1000)',
          // 流程编号
          'workflowId': 1170,
          // 流程名称
          'workflowName': '@ctitle(3, 5)',
          // 显示按钮
          'isShowButton': true,
          // 订单完成时间
          'showOrderCompletedTime': '@datetime'
        },
        // 收款信息
        'bankReceipts|1-3': [{
          // 收款银行名称
          bankName: '@ctitle(3, 5)银行',
          // 收款账户
          bankNo: '453213245643213',
          // 银行回单号
          bankBillNo: '456456456432132',
          // 到账日期
          showInDate: '@datetime',
          // 到账金额
          inAmount: '@integer(1, 50000)',
          // 回单图片URL
          billImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg'
        }],
        // 公司注册信息
        'companyRegInfo': {
          // 站点名称
          companyName: '@ctitle(3, 5)',
          // 站点类型
          companyTypeName: '@ctitle(3, 5)',
          // 经营范围
          businessScope: '@ctitle(30, 50)',
          // 注册资本
          registeredCapital: '@integer(1, 1000)',
          // 纳税性质
          taxTypeName: '@ctitle(2)',
          // 投资人姓名
          investorName: '@cname(2, 3)',
          // 投资人手机
          investorMobile: /1[345789]\d{9}/,
          // 投资人身份证正面URL
          investorIdCardFrontUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 投资人身份证背面URL
          investorIdCardBackUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 投资人身份证号码
          investorIdCardNo: '5164564564536',
          // 投资人邮箱
          investorEmail: 'sdfasdf@ajs.com',
          // 财务人员姓名
          financePersonName: '@cname(2, 3)',
          // 财务人员手机
          financePersonMobile: /1[345789]\d{9}/,
          // 财务人员身份证正面URL
          financePersonIdCardFrontUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 财务人员身份证背面URL
          financePersonIdCardBackUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 财务人员身份证号
          financePersonIdCardNo: '4561321564156456',
          // 备注
          remark: '@ctitle(5, 20)'
        },
        // 进度信息
        'processInfo': {
          // 商务提交订单时间
          showSubmitTime: '@datetime',
          // 下单时间(跟单确认订单流转至交易员)
          showConfirmOrderTime: '@datetime',
          // 材料提交时间（交易将资料交付供应商时间）
          showSubmitSupplierTime: '@datetime',
          // 核名完成时间
          showCheckNameCompletedTime: '@datetime',
          // 营业执照发放时间
          showLicenseTime: '@datetime',
          // 银行开户时间
          showBankOpenAccountTime: '@datetime',
          // 银行开户完成时间
          showBankOpenAccountCompletedTime: '@datetime',
          // 核税完成时间
          showCheckTaxCompletedTime: '@datetime'
        },
        // 供应商交付物（货物）
        'companyAttachment': {
          // U盾图片路径
          ukeyImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 公章图片路径
          stampImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 营业执照图片路径
          licenseImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 国地税协议三方PDF
          taxAgreementPDFUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg'
        },
        // 交付物流信息
        'accountOrderExpress': {
          // 快递单号
          expressNo: '@integer(124124124124, 111241231232000)',
          // 快递单回单截图URL
          expressImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 快递公司
          expressName: '@ctitle(5, 10)'
        },
        // 客服回访信息
        'customerServiceRecord': {
          // 评分
          evalValue: '@integer(1, 5)',
          // 反馈
          feedback: '@ctitle(5, 20)'
        }
      }
    }
  },
  'POST /Order/LogList.json delay:500': req => {
    const pageSize = req.body.pageSize || 10
    return {
      'totalCount': '@integer(30, 200)',
      [`datas|${pageSize}`]: [{
        'logId': '@integer(1, 200)',
        'actionUserName': '@cname(2, 3)',
        'actionUserRoleName': '@cname(3, 5)',
        'actionContent': '@ctitle(5, 10)',
        'actionTime': '@datetime'
      }]
    }
  },
  'POST /Order/InvoiceOrderDetail.json delay:100': req => {
    return {
      isSuccess: true,
      body: {
        // 订单信息
        'orderInfo': {
          // 订单Id
          'orderId': '@integer(1, 1000)',
          // 订单编号
          'orderNo': '@integer(111111111, 999999999)',
          // 客户编号
          'customerId': '@integer(1, 1000)',
          // 客户姓名
          'customerName': '@cname(2, 3)',
          // 税源地编号
          'sourceTaxId': '@integer(1, 1000)',
          // 税源地名称
          'sourceTaxName': '@ctitle(5, 11)',
          // 商品编号
          'companyId': '@integer(1, 1000)',
          // 商品名称
          'goodsName': '@ctitle(3, 6)',
          // 站点名称
          'companyName': '@ctitle(3, 6)',
          // 站点类型编号
          'companyTypeId': '@integer(1, 1000)',
          // 站点类型名称
          'companyTypeName': '@ctitle(3, 6)',
          // 发票类型编号
          invoiceTypeId: '@integer(1, 200)',
          // 发票类型名称
          invoiceTypeName: '@ctitle(5, 8)',
          // 发票税率
          invoiceTypeTax: '@integer(1, 100)',
          // 开票金额
          invoiceAmount: '@integer(1, 100)',
          // 开票项目
          invoiceContent: '@ctitle(5, 8)',
          // 开票公司名
          invoiceCompanyName: '@ctitle(5, 8)',
          // 开票公司税号
          invoiceCompanyTaxNo: /\d{12}/,
          // 开票公司地址
          invoiceCompanyAddress: '@ctitle(5, 8)',
          // 开票公司电话
          invoiceCompanyPhone: /1\d{10}/,
          // 开票公司银行名称
          invoiceCompanyBankName: '@ctitle(5, 8)',
          // 开票公司银行账号
          invoiceCompanyBankNo: /\d{12}/,
          // 发票快递地址
          invoiceExpressAddress: '@ctitle(5, 8)',
          // 是否需要审批
          'isNeedApproval|1': ['Y', 'N'],
          // 是否加急
          'isPriority|1': ['Y', 'N'],
          // 服务费折扣
          serviceFeeDiscount: '@integer(1, 100)',
          // 服务费
          serviceFee: '@integer(1, 100)',
          // 合计支付金额
          totalAmount: '@integer(1, 100)',
          // 订单创建时间
          showCreateTime: '@datetime',
          // 创建人
          createAdminUserId: '@integer(1, 100)',
          // 提交时间
          showSubmitTime: '@datetime',
          // 增值税返税比率
          zZSRatio: '@integer(1, 100)',
          // 个税返税比率
          gRSDSRatio: '@integer(1, 100)',
          // 附加税返税比率
          fJSRatio: '@integer(1, 100)',
          // 印花税返税比率
          yHSRatio: '@integer(1, 100)',
          // 创建部门
          createAdminUserDeptId: '@integer(1, 100)',
          // 流程编号
          workflowId: '@integer(1, 100)',
          // 流程名称
          workflowName: '@ctitle(5, 8)',
          // 订单完成时间
          showOrderCompletedTime: '@datetime'
        },
        // 收款信息
        'bankReceipts|1-3': [{
          // 收款银行名称
          bankName: '@ctitle(3, 5)银行',
          // 收款账户
          bankNo: /\d{12}/,
          // 银行回单号
          bankBillNo: /\d{12}/,
          // 到账日期
          showInDate: '@datetime',
          // 到账金额
          inAmount: '@integer(1, 50000)',
          // 回单图片URL
          billImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg'
        }],
        // 发票信息
        'invoiceInfo': {
          // 发票号
          invoiceNo: /\d{12}/,
          // 发票图片URL
          invoiceImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 快递单号
          expressNo: /\d{12}/,
          // 快递单回单截图URL
          expressImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528865905353&di=8eef2357a6499129c22945af641a0c7a&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377522814.jpg',
          // 快递公司
          expressName: '@ctitle(3, 5)'
        },
        // 客服回访信息
        'customerServiceRecord': {
          // 评分
          evalValue: '@integer(1, 5)',
          // 反馈
          feedback: '@ctitle(5, 20)'
        }
      }
    }
  }
}

Mock.mockWithRules(bindModel(globalRules), {
  baseUrl: 'http://' + Config.getRestfulUrl()
})
