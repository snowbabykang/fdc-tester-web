import { EnvConfig } from './env'
import router from '../router'
import store from '../vuex/store'

export default async(url = '', data = {}, type = 'POST',tablein = 'api', method = 'fetch') => {
	let baseUrl = EnvConfig[tablein];
	type = type.toUpperCase();
	url = baseUrl + url;
	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		dataStr += 'token='+store.getters.getToken + '&';
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}
	
	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			mode: "cors",
			cache: "no-cache"
		}
		if (type !== 'GET') {
			url += '?token='+ store.getters.getToken;
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		
		try {
			const response = await fetch(url, requestConfig);
			if (response.status == 200) {
				//增加登录判断，请求失败等错误判断
				const responseJson = await response.json();
				// 200成功   400失败   401未登录   500服务器内部错误
				if(responseJson.code == 200){
					return responseJson;
				}else if(responseJson.code == 400 || responseJson.code == 500){
					Vue.prototype.$notification.error({
						message: '提示',
			          	description: responseJson.message,
			        });
			        return responseJson;
				}else if(responseJson.code == 401){
					store.dispatch('removeToken');
					window.location.href = process.env.demandLoginUrl;
				}
			} else if (response.status == 500){
				Vue.prototype.$notification.error({
					message: '提示',
		          	description: '服务器500错误',
		        });
			} else {
				Vue.prototype.$notification.error({
					message: '提示',
		          	description: response.statusText,
		        });
			}
			
		} catch (error) {
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}