'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const config = require('./index')

module.exports = merge(prodEnv, {
  	NODE_ENV: '"development"',
  	HOST: '"http://localhost:'+config.dev.port+'"',
    demandLoginUrl : '"http://localhost:8881/#/login"',     //需求方登录页链接
    demandEnterUrl : '"http://localhost:8881/#/entering"',     //需求方企业入驻链接
    demand_HOST : '"http://localhost:8881/#/"',     //需求方首页
    API_HOST : '"http://39.105.28.161:8003"',
    UPLOAD_URL : '"http://39.105.28.161:8003/file/host/one"',   //上传图片请求链接   
})
