import App from './App'
import Antd from 'ant-design-vue'
import store from './vuex/store'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'ant-design-vue/dist/antd.less'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/common.css'

import '../static/js/flexible.js'

Vue.use(Antd);
Vue.use(VueQuillEditor);

import { Icon,Upload } from 'element-ui'
Vue.use(Icon);
Vue.use(Upload);

// 简单配置
// NProgress.inc(0.2)
// NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
});
router.afterEach((to, from) => {
  // 写在beforeEach中，刷新的时候会找不到
  if((!store.getters.getToken || !store.getters.getOrgId) && to.path !== '/loading'){
      window.location.href = process.env.demandLoginUrl;
  }
  NProgress.done();
});

Vue.prototype.checkPower = function(){
    let btnPermissions = this.$route.meta.powerid;
    return Vue.prototype.$_has(btnPermissions);
}

// 权限检查方法（且把该方法添加到vue原型中）
Vue.prototype.$_has = function(value) {
  let isExist = false
  var buttonpermsStr = store.getters.getPower;
  if (buttonpermsStr === undefined || buttonpermsStr == null) {
    return false
  }
  // 1是可操作  0 为只看
  if (buttonpermsStr[value] == 1) {
    isExist = true
  }
  return isExist
}

// 全局公用方法
import global from './api/common'
Vue.prototype.GLOBAL = global



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
