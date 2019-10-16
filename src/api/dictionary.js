export const banklist = [
    '中国工商银行',
    '中国农业银行',
    '招商银行',
    '中国建设银行',
    '交通银行',
    '中国银行',
    '中国光大银行',
    '平安银行',
    '中国邮政储蓄银行',
    '北京银行',
    '中信银行',
    '兴业银行',
    '浦发银行',
    '杭州银行',
    '广发银行CGB',
    '上海银行',
    '华夏银行',
    '上海农村商业银行',
    '微商银行',
    '汇丰银行',
    '东亚银行',
    '宁波银行',
    '江苏银行',
    '民生银行',
    '南京银行',
    '广州农村商业银行',
    '北京农村商业银行',
    '成都农村商业银行',
];

// 店铺——店铺设置   填写银行信息打款信息状态
export const bankPayStatus = {
    0 : {name : '提交中', color : 'primary'},
    1 : {name : '已打款', color : 'success'},
    2 : {name : '打款成功', color : 'success'},
    3 : {name : '打款失败', color : 'red'},
}

// 审核状态
export const checkStatus = {
    0 : {name : '审核中', color : 'primary'},
    1 : {name : '审核成功', color : 'success'},
    2 : {name : '审核失败', color : 'red'},
}
export const settleStatus = {
    0 : '待确认',
    1 : '已确认',
    2 : '已结算',
    3 : '待开票',
    4 : '已开票',
}

export const orderStatus = {
    1 : '待付款',
    2 : '已付款',
    3 : '已寄样',
    4 : '已收样',
    5 : '检测中',
    6 : '检测完成',
    7 : '待收货',
    8 : '已完成',
    9 : '已取消'
}

export const paymentTypes = {
  1 : '支付宝',
  2 : '微信',
  3 : '银联'
}

export const cancelReasonText = {
  1 : '不想买了',
  2 : '信息填写错误，重新拍',
  3 : '卖家缺货',
  4 : '付款遇到问题',
  5 : '选错了',
  6 : '其他原因',
  7 : '超时未支付，自动取消',
}

// 发票类型
export const invoiceType = {"0" : '企业增值税专用发票', "1" : '企业增值税普通发票'}

// 发票状态
export const invoiceStatus = {0 : '待确认',1 : '已确认',2 : '已结算',3 : '开票中',4 : '已开票'}
