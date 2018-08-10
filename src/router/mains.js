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
  // 订单
  {path: '/order/account-order-create', component: require('../pages/order/account-order-create')},
  {path: '/order/account-orders', component: require('../pages/order/account-orders')},
  {path: '/order/account-order-details', component: require('../pages/order/account-order-details')},
  {path: '/order/invoice-order-create', component: require('../pages/order/invoice-order-create')},
  {path: '/order/invoice-orders', component: require('../pages/order/invoice-orders')},
  {path: '/order/invoice-order-details', component: require('../pages/order/invoice-order-details')}
  // 潜客来源
  // { path: '/client/taxAdvisor', component: require('../pages/client/taxAdvisor') },
  // { path: '/client/taxManager', component: require('../pages/client/taxManager') },
]
