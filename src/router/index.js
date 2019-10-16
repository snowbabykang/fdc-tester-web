import Router from 'vue-router'

import Main from '../components/Main.vue'
import forgetPsdMain from '../components/forgetPsdMain'
const NotFound = () => import(/* webpackChunkName: "notfound" */ '../components/404')
// const Login = () => import(/* webpackChunkName: "login" */ '../views/login')
// 需求方跳检测方中间页面
const loadingPage = () => import(/* webpackChunkName: "loading" */ '../views/loadingPage')

const verifyIdentity = () => import(/* webpackChunkName: "forgetpsd" */ '../views/verifyIdentity')
const resetPsd = () => import(/* webpackChunkName: "forgetpsd" */ '../views/resetPsd')
const finishPsd = () => import(/* webpackChunkName: "forgetpsd" */ '../views/finishPsd')

const Home = () => import(/* webpackChunkName: "index" */ '../views/home')
const approveQuality = () => import(/* webpackChunkName: "index" */ '../views/approveQuality')
const approveFacility = () => import(/* webpackChunkName: "index" */ '../views/approveFacility')
const approvePlace = () => import(/* webpackChunkName: "index" */ '../views/approvePlace')


const publishSerivce = () => import(/* webpackChunkName: "service" */ '../views/publishSerivce')
const publishSerivceTwo = () => import(/* webpackChunkName: "service" */ '../views/publishSerivceTwo')
const serivceOnSale = () => import(/* webpackChunkName: "service" */ '../views/serivceOnSale')

const shopConfig = () => import(/* webpackChunkName: "shop" */ '../views/shopConfig')
const qualification = () => import(/* webpackChunkName: "shop" */ '../views/qualification')

const orderManagement = () => import(/* webpackChunkName: "order" */ '../views/orderManagement')
const orderDetail = () => import(/* webpackChunkName: "order" */ '../views/orderDetail')

const roleSet = () => import(/* webpackChunkName: "set" */ '../views/roleSet')
const powerManage = () => import(/* webpackChunkName: "set" */ '../views/powerManage.vue')
const addPermissionsSet = () => import(/* webpackChunkName: "set" */ '../views/addPermissionsSet')
// 结算管理
const feeSettlement = () => import(/* webpackChunkName: "settle" */ '../views/feeSettlement.vue')
const billInformation = () => import(/* webpackChunkName: "settle" */ '../views/billInformation')



Vue.use(Router)

export default new Router({
  routes: [
    // {
    //     path: '/login',
    //     component: Login,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '/loading',
        component: loadingPage,
        name: '',
        hidden: true
    },
    // {
    //     path: '/404',
    //     component: NotFound,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '/forgotpsd',
        component: forgetPsdMain,
        meta: {title: '重置密码' },
        name: '' ,
        hidden: true,
        children: [
            { path: '/verifyIdentity', component: verifyIdentity, name: '验证身份',meta: {title: '验证身份' }},
            { path: '/resetPsd', component: resetPsd, name: '重置密码',meta: {title: '重置密码' }},
            { path: '/finishPsd', component: finishPsd, name: '完成',meta: {title: '重置密码' }},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '首页' ,path: '/',powerid : '14'},
        name: '' ,     //name要为空，因为没有二级菜单，如果命名首页会和下面有重复警告，同样这里用在面包屑
        iconCls: 'home',
        children: [      //二级菜单的meta中index关系到左侧菜单的选中状态，比如首页的资质认证全部选中首页，所以index都是'/'，默认不写指向自己的path
            { path: '/', component: Home, name: '首页',meta:{powerid : '14'}},
            { path: '/404', component: NotFound, name: '找不到页面'},
            { path: '/approveQuality', component: approveQuality, name: '资质认证',meta : {index : '/',powerid : '14'}},
            { path: '/approveFacility', component: approveFacility, name: '设备权威认证',meta : {index : '/',powerid : '14'}},
            { path: '/approvePlace', component: approvePlace, name: '工商场地分支机构认证',meta : {index : '/',powerid : '14'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '服务',path: '/publishSerivce',group : 1},     //导航菜单子菜单模块的key值
        name: '服务' ,
        iconCls: 'heart',
        leaf : true,    //有二级菜单
        children: [
            { path: '/publishSerivce', component: publishSerivce, name: '发布服务',meta:{powerid : '05'}},
            { path: '/publishSerivceAdd/:categoryid', component: publishSerivceTwo, name: '商品发布',hidden : true,meta : {index : '/publishSerivce',powerid : '05'}},
            { path: '/publishSerivceEdit/:id/:categoryid', component: publishSerivceTwo, name: '商品编辑',hidden : true,meta : {index : '/serivceOnSale',powerid : '05'}},
            { path: '/serivceOnSale', component: serivceOnSale, name: '出售中服务',meta:{powerid : '06'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '订单',path: '/orderManagement',group : 2},
        name: '订单' ,
        iconCls: 'shop',
        leaf : true,
        children: [
            { path: '/orderManagement', component: orderManagement, name: '订单管理',meta:{powerid : '07'}},
            { path: '/orderDetail/:id', component: orderDetail, name: '订单详情',hidden : true,meta : {index : '/orderManagement',powerid : '07'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '店铺',path: '/shopConfig',group : 3},
        name: '店铺' ,
        iconCls: 'shop',
        leaf : true,
        children: [
            { path: '/shopConfig', component: shopConfig, name: '店铺设置',meta:{powerid : '08'}},
            { path: '/qualification', component: qualification, name: '资质信息',meta:{powerid : '09'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '结算', path: '/feeSettlement', group: 4},
        name: '结算',
        iconCls: 'money-collect',
        leaf: true,
        children: [
            { path: '/feeSettlement', component: feeSettlement, name: '结算管理',meta:{powerid : '10'}},
            { path: '/billInformation/:id', component: billInformation, name: '账单详情',hidden : true, meta : {index : '/feeSettlement',powerid : '10'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '账号',path: '/powerManage',group : 5},
        name: '账号' ,
        iconCls: 'user',
        leaf : true,
        children: [
          { path: '/powerManage', component: powerManage, name: '权限管理',meta:{powerid : '13'}},
          { path: '/roleSet', component: roleSet, name: '权限组设置', hidden : true,meta : {index : '/permissionsSet',powerid : '13'}},
          { path: '/addPermissionsSet', component: addPermissionsSet, name: '添加权限组', hidden : true,meta : {index : '/permissionsSet',powerid : '13'}},
          { path: '/redactPermissionsSet/:id', component: addPermissionsSet, name: '编辑权限组', hidden : true,meta : {index : '/permissionsSet',powerid : '13'}},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
]});
