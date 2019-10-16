export const EnvConfig = {
  'host' : process.env.HOST,
  'api' : process.env.API_HOST,
}

import CryptoJS from './aes'
// var key = CryptoJS.enc.Utf8.parse("XpnzaWR8aRZIAJXY");//十六位十六进制数作为秘钥//统一认证授权秘钥 正式服务器
const key = CryptoJS.enc.Utf8.parse("fdcFabricCheck88");//十六位十六进制数作为秘钥//统一认证授权秘钥 测试服务器
// var iv = Aes.enc.Utf8.parse('十六位十六进制数作为秘钥偏移量')

//解密方法
export const Decrypt = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}
//加密方法
export const Encrypt = (secretPwd) => {
  var encrypted = CryptoJS.AES.encrypt(secretPwd, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  //  加密
  return encrypted.ciphertext.toString().toLowerCase();
}


/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}