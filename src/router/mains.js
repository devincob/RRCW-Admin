export default [
  {path: '/', component: require('../pages/index')},
  {path: '/user/worker', component: require('../pages/user/worker-user')},
  {path: '/user/worker-detail', component: require('../pages/user/worker-user-detail')},
  {path: '/user/company', component: require('../pages/user/company-user')},
  {path: '/user/company-detail', component: require('../pages/user/company-user-detail')},
  {path: '/user/detail', component: require('../pages/user/deital')},
  {path: '/user/stat', component: require('../pages/user/stat')},
  {path: '/user/sys-message', component: require('../pages/user/sys-message')},

  // 订单
  {path: '/order/publish', component: require('../pages/order/publish')},
  {path: '/order/orders', component: require('../pages/order/orders')},
  {path: '/order/detail', component: require('../pages/order/detail')},
  {path: '/order/suborders', component: require('../pages/order/suborders')},
  {path: '/order/suborder-detail', component: require('../pages/order/suborder-detail')},
  {path: '/order/appointment', component: require('../pages/order/appointment')},
  {path: '/order/waitforwork', component: require('../pages/order/waitforwork')},
  {path: '/order/atwork', component: require('../pages/order/atwork')},
  {path: '/order/waitforpay', component: require('../pages/order/waitforpay')},

  // 财务管理
  {path: '/caiwu/openCity', component: require('../pages/caiwu/openCity')},
  {path: '/caiwu/eventManagement', component: require('../pages/caiwu/eventManagement')},
  {path: '/caiwu/feedbackManagement', component: require('../pages/caiwu/feedbackManagement')},
  {path: '/caiwu/labelSettings', component: require('../pages/caiwu/labelSettings')},
  {path: '/caiwu/feedbackDeital/:feedbackId', component: require('../pages/caiwu/feedbackDeital')},
  {path: '/caiwu/invoicingApplication', component: require('../pages/caiwu/invoicingApplication')},
  {path: '/caiwu/applicationDeital/:applyId', component: require('../pages/caiwu/applicationDeital')},
  {path: '/caiwu/noConfirmed', component: require('../pages/caiwu/noConfirmed')},
  {path: '/caiwu/mailingInformation', component: require('../pages/caiwu/mailingInformation')},
  {path: '/caiwu/cash', component: require('../pages/caiwu/cash')},
  {path: '/caiwu/cash_flow', component: require('../pages/caiwu/cash_flow')},
  {path: '/caiwu/refund', component: require('../pages/caiwu/refund')},
  {path: '/caiwu/transfer', component: require('../pages/caiwu/transfer')},
  {path: '/caiwu/promoterWithdrawal', component: require('../pages/caiwu/promoterWithdrawal')},
  {path: '/caiwu/event-detail', component: require('../pages/caiwu/event-detail')},

  // 渠道推广
  {path: '/promoter/insert', component: require('../pages/promoter/insert')},
  {path: '/promoter/list', component: require('../pages/promoter/list')},
  {path: '/promoter/level', component: require('../pages/promoter/level')},

  // 权限
  {path: '/privileges/accounts', component: require('../pages/privileges/accounts')},
  {path: '/privileges/roles', component: require('../pages/privileges/roles')},
  {path: '/privileges/logs', component: require('../pages/privileges/logs')},
  // 调整工资审核、调整工资记录
  {path: '/adjust/adjustSalaryApproval', component: require('../pages/adjust/adjustSalaryApproval')},
  {path: '/adjust/adjustSalaryRecord', component: require('../pages/adjust/adjustSalaryRecord')},

  // 潜客来源
  // { path: '/client/taxAdvisor', component: require('../pages/client/taxAdvisor') },
  // { path: '/client/taxManager', component: require('../pages/client/taxManager') },
  { path: '/client/tax/:type(t|h)', component: require('../pages/client/tax') }
]
