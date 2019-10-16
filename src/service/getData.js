import fetch from '../api/fetch'
import store from '../vuex/store';
/**
 * fetch参数说明，可查看fetch.js
 * 方法名 = （参数） =>  fetch(请求链接，请求参数，请求类型，请求域名的名（默认api就是后端接口的域名）)
 */

// 注销 退出登录
export const logout = () => fetch('/user/exit', {}, 'POST','api');

//修改密码获取短信验证码
export const getMsgCode = (phone) => fetch('/user/sendFindPasswordNote', {phone : phone}, 'POST','api');

// 验证短信验证码
export const verifyMsgCode = (phone,code) => fetch('/user/checkActive', {
    phone : phone ,
    active : code
}, 'POST','api');

// 修改密码
export const changePsd = (phone,password,active) => fetch('/user/setNewPassword', {
    phone : phone,
    password : password,
    active : active
}, 'POST','api');

/**
    * 首页
 */
// 首页机构信息查询
 export const getHomeInfo = (orgId,storeId) => fetch('/org/info/homepageinfo', {orgId : orgId ,storeId : storeId}, 'GET','api');

// 查询店铺主图
 export const getStoreMainpic = (storeId) => fetch('/file/host/mainpicture', {storeId : storeId}, 'GET','api');

// 上传店铺主图
 export const addStoreMainpic = (url,id) => fetch('/file/host/mainpicture', {fileUrl : url, relevanceId : id}, 'POST','api');

// 获取保证金信息
 export const getCashDeposit = (storeId) => fetch('/margin/storeMarginList', {storeId : storeId}, 'GET','api');

// 新增保证金
 export const addCashDeposit = (value) => fetch('/margin/addStoreMargin', value, 'POST','api');

// 修改保证金
 export const editCashDeposit = (value) => fetch('/margin/updateStoreMargin', value, 'PUT','api');


/**
    * 资质认证
 */
 // 查询证书资质认证
 export const getCertificate = (orgId,id) => fetch('/certificate/certList', {
    orgId : orgId,
    orgQualificationId :id
}, 'GET','api');

 // 添加证书资质认证
 export const addCertificate = (certificates,orgId,id) => fetch('/certificate/addCert', {
    certificates : certificates,
    orgId : orgId,
    orgQualificationId : id,
 }, 'POST','api');

// 查看设备权威认证
 export const getEquipment = (orgId,id) => fetch('/Equipment/equipmentList',{
    orgId : orgId,
    orgQualificationId : id,
 }, 'GET','api');

// 设备权威认证
 export const addEquipment = (value) => fetch('/Equipment/addEquipment', value, 'POST','api');

 // 专家资质认证
export const getProfessorList = (orgId,id) => fetch('/professor/'+orgId, {
  orgId : orgId,
  orgQualificationId : id,
}, 'GET','api');

// 新增专家资质认证
export const addProfessor = (value,orgId,id) => fetch('/professor/addPro', {
    professors : value,
    orgId :orgId,
    orgQualificationId : id,
}, 'POST','api');

 // 工商场地
export const getFactoryList = (orgId,id) => fetch('/factory/factoryList', {
  orgId : orgId,
  orgQualificationId : id,
}, 'GET','api');

// 新增工商场地
export const addFactory = (value,orgId,id) => fetch('/factory/addFactory', {
    factorys : value,
    orgId :orgId,
    orgQualificationId : id,
}, 'POST','api');




// 获取类目
export const getCategory = (pid) => fetch('/commodity/type/list', {
    pid : pid || ''
}, 'GET','api')


// 结算模块

// 获取结算单列表
export const getOrderListSettlement = (storeId, expendTime, status,page,size) => fetch('/settle/info/list', {
  storeId: storeId,
  expendTime: expendTime,
  status: status,
  pageNum: page || 1,
  pageSize: size || 10,
},'GET', 'api')

// 查询结算单详情
export const getSettleDetail = (id) => fetch('/settle/info/one', {id :id }, 'GET')

// 修改结算单状态
export const changeOrderStatus = (orderId, status) => fetch('/settle/info/one', {
    id: orderId,
    status: status,
} ,'PUT', 'api')

// 查看结算单内的订单列表
export const getSettleOrderList = (id,stime,etime) => fetch('/iorder/iorderListNoPage', {
  storeId :id,
  startTime : stime,
  overTime : etime
}, 'GET', 'api')


// 查看已开票发票详情
export const getReceiptInfoById = (id) => fetch('/invoice/info/record', {
  settleId: id,
},'GET', 'api')

// 查看发票信息
export const getInvoiceInfo = (storeId) => fetch('/invoice/info/defaultinfo', {
  storeId: storeId
}, 'GET', 'api')

// 新建编辑开票信息
export const addInvoiceInfo = (value) => fetch('/invoice/info/newdefaultinfo', value ,'POST', 'api')

// 查看发票邮寄信息
export const getExpressInfo = (storeId) => fetch('/invoice/info/defaultaddress', {
  storeId: storeId
}, 'GET')

// 新建开票邮寄信息
export const addExpressInfo = (value) => fetch('/invoice/info/newdefaultaddress', value ,'POST', 'api')

// 开票
export const createInvoice = (amount, settleId, storeId) => fetch('/invoice/info/new', {
  amount: amount,
  settleId: settleId,
  storeId : storeId
}, 'POST')



// 获取类目 (根据类目id，获取父级的名字列表)
export const getParentCategory = (id) => fetch('/commodity/type/parentlist', {id : id}, 'GET','api');

//发布商品
export const addProduct = (data) => fetch('/commodity/info/one', data, 'POST','api');

//编辑商品
export const editProduct = (data) => fetch('/commodity/info/one', data, 'PUT','api');

//查询商品
export const searchProduct = (id) => fetch('/commodity/info/one', {id : id}, 'GET','api');

//删除商品
export const delProduct = (ids) => fetch('/commodity/info/list', {idList : ids}, 'DELETE','api');

//商品在前端展示序号
export const sortProduct = (id,storeid,sortNumber) => fetch('/commodity/info/sortnumber', {
    id : id,
    storeId : storeid,
    sortNumber : sortNumber
}, 'PUT','api');


// 商品服务列表
export const getServiceList = (storeId,page,size) => fetch('/commodity/info/list', {
    storeId : storeId,
    pageNum : page || 1,
    pageSize : size || 10,
}, 'GET','api');

//订单列表
export const getOrderList = (orderInfo) => fetch('/iorder/iorderList', {
  typeId: orderInfo.typeId,
  storeId: orderInfo.storeId,
  orderCode: orderInfo.orderCode,
  overTime: orderInfo.overTime,
  pageNum: orderInfo.pageNum,
  pageSize: orderInfo.pageSize,
  startTime: orderInfo.startTime,
  userName: orderInfo.userName
}, 'GET','api');

//订单详情
export const orderInformation = (orderCode) => fetch('/iorder/OrderInformation', {
  orderCode: orderCode,
}, 'GET','api');
//修改订单
export const iorder = (orderCode,typeId,fileHostShowDtos) =>fetch('/iorder',{
  orderCode:orderCode,
  typeId:typeId,
  fileHostShowDtos: fileHostShowDtos
}, 'PUT','api');
//显示物流
export const expressList = (orderCode,flag) =>fetch('/express/expressList',{
  orderCode:orderCode,
  flag:flag,
}, 'GET','api');
//填写物流
export const addExpress = (orderCode,expressNumber,expressCompany) =>fetch('/express/addExpress',{
  orderCode:orderCode,
  expressNumber:expressNumber,
  expressCompany:expressCompany,
  flag:1
}, 'POST','api');

// 按名称搜索商品服务列表
export const getServiceListByname = (storeId,name,page,size) => fetch('/commodity/info/list/name', {
    storeId : storeId,
    commodityName : name,
    pageNum : page || 1,
    pageSize : size || 10,
}, 'GET','api');




/*
 * 店铺模块
*/
// 店铺设置

// 获取授权信息
export const getAuthorize = (id) => fetch('/storeEmpower/empowerList', {storeId : id}, 'GET','api');

// 下载授权书模板
export const downAuthorize = () => {
    return process.env.API_HOST + '/storeEmpower/downEmpower'
}

// 提交授权信息
export const addAuthorize = (url,id) => fetch('/storeEmpower/addEmpower', {
  fileHost : {fileUrl : url},
  storeId : id
}, 'POST','api');

// 获取打款信息
export const getBankInfo = (id) => fetch('/bank/info/BankInfoList', {storeId : id}, 'GET','api');

// 新增打款信息——银行信息
export const addBankInfo = (value) => fetch('/bank/info/addBankInfo', value, 'POST','api');

// 获取委托书信息
export const getMandateList = (id) => fetch('/storeEntrust/storeEntrustList', {storeId : id}, 'GET','api');

// 新增委托书
export const addMandate = (value) => fetch('/storeEntrust/addStore', value, 'POST','api');

// 修改委托书
export const editMandate = (value) => fetch('/storeEntrust/updateStore', value, 'PUT','api');

// 服务基础信息
// 获取服务基础信息
export const getServiceInfo = (orgId,storeId,id) => fetch('/storeinfo/one', {
    orgId :orgId,
    storeId : storeId,
    orgQualificationId : id,
}, 'GET','api');

//下载报告单
export const downLoadReport = (iOrderId) => {  return process.env.API_HOST+'/iorder/downLoadReport?iOrderId='+iOrderId+'&token='+store.getters.getToken};
// 更新机构信息
export const editOrgInfo = (value) => fetch('/storeinfo/one', value, 'PUT','api');
// 更新权威信息
export const editProfessor = (orgId,id,professors) => fetch('/professor/list', {
    orgId :orgId,
    orgQualificationId : id,
    professors : professors,
}, 'PUT','api');
// 更新设备信息
export const editStoreFacility = (id,info) => fetch('/storeinfo/equipment', {
  id : id,
  equipmentIntroduction : info
}, 'PUT','api');

//下载委托书
export const downEntrust = (id) => {  return process.env.API_HOST+'/iorder/downEntrust?orderCode='+id+'&token='+store.getters.getToken};

//预览委托书
export const showEntrust = (id) => {  return process.env.API_HOST+'/iorder/showEntrust?orderCode='+id+'&token='+store.getters.getToken};

//上传报告单
// /file/host/one

// 获取企业认证信息
export const getAuthInfo = (id) => fetch('/org/auth/one', {orgId : id}, 'GET','api');



// 获取省市区地址
export const getProvince = () => fetch('/address/type/province', {}, 'GET','api');
export const getCity = (id) => fetch('/address/type/city', {provinceId : id}, 'GET','api');
export const getArea = (id) => fetch('/address/type/area', {cityId : id}, 'GET','api');


// 操作员模块
// 根据token获取当前登录用户权限
export const getpower = () => fetch('/user/role/one', {}, 'GET','api');

// 查询操作员列表
export const getOperatorList = (orgId,panelType, page, size) => fetch('/user/role/list', {
  orgId: orgId,
  panelType: panelType,
  page: page,
  size: size
},'GET')


// 新建操作员
export const createOperatorList = (orgId,panelType, phone, roleId, storeId) => fetch('/user/role/one', {
  orgId: orgId,
  panelType: panelType,
  phone: phone,
  roleId: roleId,
  storeId: storeId
},'POST')

// 编辑操作员
export const redactOperatorList = (orgId,panelType, roleId, storeId, userId) => fetch('/user/role/one', {
  orgId: orgId,
  panelType: panelType,
  roleId: roleId,
  storeId: storeId,
  userId: userId
},'PUT')

// 删除操作员
export const deleteOperatorList = (orgId, panelType, storeId, userIdList) => fetch('/user/role/list', {
  orgId: orgId,
  panelType: panelType,
  storeId: storeId,
  userIdList: userIdList
},'DELETE')

// 权限组模块
// 获取角色权限组列表
export const getRoleList = (panelType, storeId, page, size) => fetch('/role/list', {
  panelType: panelType,
  storeId: storeId,
  page: page,
  size: size
},'GET')

// 获取无分页角色权限组列表
export const getAllRoleList = (panelType, storeId,) => fetch('/role/list/nopage', {
  panelType: panelType,
  storeId: storeId,
},'GET')

// 查询角色权限组
export const getRoleDetail = (orgId, panelType, roleId) => fetch('/role/one', {
  orgId: orgId,
  panelType: panelType,
  roleId: roleId
},'GET')

// 新建角色权限组
export const createRole = (orgId, roleName, storeId, rolePermissionList) => fetch('/role/one',{
  role: {
    flagAdmin: 0,
    orgId: orgId,
    panelType: 1,
    roleName: roleName,
    storeId: storeId,
  },
  rolePermissionList: rolePermissionList
},'POST')

// 编辑角色权限组
export const redactRole = (orgId, roleName, storeId, id, rolePermissionList) => fetch('/role/one',{
  role: {
    flagAdmin: 0,
    orgId: orgId,
    panelType: 1,
    roleName: roleName,
    storeId: storeId,
    id: id,
  },
  rolePermissionList: rolePermissionList
},'PUT')

// 批量删除角色权限组
export const deleteRole = (orgId, panelType, roleIdList, storeId) => fetch('/role/list', {
  orgId: orgId,
  panelType: panelType,
  roleIdList: roleIdList,
  storeId: storeId
}, 'DELETE')

// 查询角色权限列表
export const getPermissionList = () => fetch('/role/permissionList', {
  panelType: 1
}, 'GET')




