export const saveToken = (context,val) => {
  context.commit('saveToken',val);
};
export const removeToken = (context) =>{
  context.commit('removeToken')
}
export const saveOrgId = (context,val) => {
    context.commit('saveOrgId',val);
};
export const saveStoreId = (context,val) => {
    context.commit('saveStoreId',val);
};
export const savePhone = (context,val) => {
    context.commit('savePhone',val);
};
// 资质审核总id
export const saveOrgQualificationId = (context,val) => {
    context.commit('saveOrgQualificationId',val);
};
export const saveQualityStatus = (context,val) => {
    context.commit('saveQualityStatus',val);
};
export const saveCategory = (context,val) => {
    context.commit('saveCategory',val);
};
export const removeCategory = (context) => {
    context.commit('removeCategory');
};

// 店铺基础信息
export const saveStoreInfo = (context,val) => {
    context.commit('saveStoreInfo',val);
};

// 保存权限，菜单权限
export const savePower = (context,val) => {
    context.commit('savePower',val);
};
export const saveMenuPower = (context,val) => {
    context.commit('saveMenuPower',val);
};
export const savePowerName = (context,val) => {
    context.commit('savePowerName',val);
};
