//获取token值
export const getToken = (state) => {
  return state.token;
};
export const getOrgId = (state) => {
    return state.orgId;
};
export const getStoreId = (state) => {
    return state.storeId;
};
export const getPhone = (state) => {
    return state.loginphone;
};
export const getOrgQuaId = (state) => {
    return state.orgQualificationId;
};
export const getQualityStatus = (state) => {
    return state.qualityStatus;
};
export const getCategory = (state) => {
    return state.publishCategory;
};

export const getStoreInfo = (state) => {
    return state.storeInfo;
};

export const getPower = (state) => {
    return state.powerList;
};
export const getMenuPower = (state) => {
    return state.menuPower;
};
export const getPowerName = (state) => {
    return state.powerName;
};