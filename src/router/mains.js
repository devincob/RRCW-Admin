export default [
  {path: '/', component: require('../pages/index')},

  // 权限
  {path: '/privileges/accounts', component: require('../pages/privileges/accounts')},
  {path: '/privileges/roles', component: require('../pages/privileges/roles')},
  {path: '/privileges/logs', component: require('../pages/privileges/logs')},

  {path: '/goods/list', component: require('../pages/goods/goods_list')},
  {path: '/goods/create', component: require('../pages/goods/goods_create')},

  {path: '/company/list', component: require('../pages/company/company_list')},
  {path: '/company/create', component: require('../pages/company/company_create')},

  // 客户管理
  {path: '/customerManagement/addCustomer', component: require('../pages/customerManagement/addCustomer')},
  {path: '/customerManagement/customerList', component: require('../pages/customerManagement/customerList')},
  // 税源地管理
  {path: '/taxSourceManagement/addTaxSource', component: require('../pages/taxSourceManagement/addTaxSource')},
  {path: '/taxSourceManagement/taxSourceList', component: require('../pages/taxSourceManagement/taxSourceList')},
  // 渠道管理
  {path: '/channelManagement/addChannel', component: require('../pages/channelManagement/addChannel')},
  {path: '/channelManagement/channelList', component: require('../pages/channelManagement/channelList')},
  // 订单
  {path: '/order/account-order-create', component: require('../pages/order/account-order-create')},
  {path: '/order/account-orders', component: require('../pages/order/account-orders')},
  {path: '/order/account-order-details', component: require('../pages/order/account-order-details')},
  {path: '/order/invoice-order-create', component: require('../pages/order/invoice-order-create')},
  {path: '/order/invoice-orders', component: require('../pages/order/invoice-orders')},
  {path: '/order/invoice-order-details', component: require('../pages/order/invoice-order-details')},
  {path: '/order/difference-order-list', component: require('../pages/order/difference-order-list')},

  {path: '/analysis/account-base-statistics', component: require('../pages/analysis/account-base-statistics')},
  {path: '/analysis/account-trend-statistics', component: require('../pages/analysis/account-trend-statistics')},
  {path: '/analysis/account-order-share-statistics', component: require('../pages/analysis/account-order-share-statistics')},

  {path: '/analysis/billing-base', component: require('../pages/analysis/billing-base')},
  {path: '/analysis/billing-trend', component: require('../pages/analysis/billing-trend')},
  {path: '/analysis/billing-order-share', component: require('../pages/analysis/billing-order-share')},
  // 潜客来源
  // { path: '/client/taxAdvisor', component: require('../pages/client/taxAdvisor') },
  // { path: '/client/taxManager', component: require('../pages/client/taxManager') },

  // 站点统计
  {path: '/company-statistics/invoiced', component: require('../pages/companyStatistics/invoiced')},
  {path: '/company-statistics/no-invoice', component: require('../pages/companyStatistics/no-invoice')},

  // 部门业绩统计
  {path: '/dep-achieve-statistics/account', component: require('../pages/depAchieveStatistics/account')},
  {path: '/dep-achieve-statistics/invoice', component: require('../pages/depAchieveStatistics/invoice')},

  // 银行流水录入 银行流水预警
  {path: '/risk-control/bank-entry', component: require('../pages/bankEntry/bank-entry')},
  {path: '/risk-control/bank-flow-warning', component: require('../pages/bankFlowWarning/bank-flow-warning')},

  // 个人业绩统计
  {path: '/personal-achieve-statistics/account', component: require('../pages/personalAchieveStatistics/account')},
  {path: '/personal-achieve-statistics/invoice', component: require('../pages/personalAchieveStatistics/invoice')},

  // 风控管理
  {path: '/risk/invoice-threshold', component: require('../pages/risk/invoice-threshold')},
  {path: '/risk/statement-threshold', component: require('../pages/risk/statement-threshold')},
  {path: '/risk/invoice-company-warning', component: require('../pages/risk/invoice-company-warning')}
]
