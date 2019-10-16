// 应用初始状态
export const state = {
    token : '',        //登录获取的token，每个请求都要带
    orgId : '',       //机构id
    storeId : '',     //店铺id
    loginphone :'',     //登录账号的手机号，需求方传过来的
    orgQualificationId : '',   //资质审核总id
    qualityStatus : '',       //资质审核状态  0待审核  1审核通过  2审核拒绝   ’‘未提交
    publishCategory : '',   //发布商品选择的类目
    storeInfo : '',   //店铺信息
    powerList : '',       //当前登陆者功能权限列表
    menuPower : '',       //当前登陆者菜单权限
    powerName : '',       //当前登陆者权限名
};