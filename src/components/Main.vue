<template>
  <a-layout>
    <a-layout-sider>
      <div class="logo">FDC检测平台</div>
      <a-menu theme="dark" mode="inline" 
              :openKeys="openKeys" 
              @openChange="onOpenChange" 
              :selectedKeys="selectedKeys"
              @click="select">
        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
          <a-menu-item :key="item.meta.path" v-if="!item.leaf && $store.getters.getPower[item.meta.powerid] !== undefined">
            <router-link :to="item.meta.path" class="routertitle"><a-icon :type="item.iconCls" theme="filled" v-if="item.iconCls"/><span>{{item.meta.title}}</span></router-link>
          }
          </a-menu-item>
          <a-sub-menu :key="item.meta.group" v-if="item.leaf && $store.getters.getMenuPower[index]">
            <span slot="title"><a-icon :type="item.iconCls" v-if="item.iconCls"/><span>{{item.name}}</span></span>
            <a-menu-item :key="submenu.path" v-for="submenu in item.children" v-if="!submenu.hidden && $store.getters.getPower[submenu.meta.powerid] !== undefined ">
              <router-link :to="submenu.path">{{submenu.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="headerbox" :style="{textAlign : 'right',color:'#fff'}"> 
        <a :href="demandhome" class="routerlink" style="padding-right: 20px;">FDC检测中心</a>
        <span><a-avatar src="static/common-img/avatar.png" />{{loginphone}}</span>
        <router-link to="/verifyIdentity" class="routerlink">修改密码</router-link>
        <a-divider type="vertical" :style="{height : '24px',background : '#eee'}"/>
        <a href="javascript:;" style="color: inherit;" @click="logout"><a-icon type="poweroff"/></a>
      </a-layout-header>
      <a-layout-header class="header-breadcrumb" v-if="$route.path !== '/404'">
        <a-row type="flex" align="middle" :style="{height : '100%'}">
          <a-col :span="24">
            <a-breadcrumb separator=">">
              <a-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name || item.meta.title}}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content :style="{'top':$route.path == '/404' ? '64px' : '128px'}"> 
        <div v-if="$store.getters.getPower[$route.meta.powerid] !== undefined"><router-view  v-if="isRouterAlive" /> </div>
        <noData v-else message="哎呀！你没有权限呀~"/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {logout} from '@/service/getData'
import noData from '../components/noData'
export default {
    name: 'Main',
    provide(){
        return{
          reload : this.reload
        }
    },
    data () {
        return {
          isRouterAlive : true,
          rootSubmenuKeys: [],   //有二级菜单的key值组合
          openKeys: [],         //当前打开哪个二级菜单
          selectedKeys : [],      //当前选中的菜单
          demandhome : process.env.demand_HOST,
          loginphone : this.$store.getters.getPhone,
        }
    },
    components : {noData},
    methods: {
      reload(){
          this.isRouterAlive = false;
              this.$nextTick(function(){
                this.isRouterAlive = true;
              })
      },
      logout(){
            logout().then(res => {
                if(res && res.code == 200){
                    this.$store.commit('resetState');
                    window.location.href = process.env.demandLoginUrl;
                }
            })
      },
      onOpenChange (openKeys) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : []
        }
      },
      select ({ item, key, selectedKeys }) { // 选中项
        this.selectedKeys = [key];
      }
    },
    created(){
      let that = this;
      for(let item of that.$router.options.routes){
        if(item.leaf && item.meta.group){
          that.rootSubmenuKeys.push(item.meta.group);
        }
      }
      that.selectedKeys.push(that.$route.meta.index || that.$route.path);
      if(that.$route.matched[0].meta.group){
        that.openKeys.push(that.$route.matched[0].meta.group);
      }
    },
    mounted(){
        this.GLOBAL.getPower();
    },
    watch: {
        $route(){
            let that = this;
            that.selectedKeys = [];
            that.selectedKeys.push(that.$route.meta.index || that.$route.path);
        },
    }
}
</script>
<style scoped>
.ant-layout-sider{
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  background: #060040;
}
.ant-layout-sider::-webkit-scrollbar {
    width: 2px;     
    height: 1px;
}
.ant-layout-sider::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #060040;
}
.ant-layout-sider::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #060040;
}
.ant-layout-sider .logo {
  font-size:27px;
  font-weight:800;
  color: #fff;
  line-height: 38px;
  padding: 39px 0px 0 22px;
}
.ant-menu-dark, .ant-menu-dark .ant-menu-sub{
  background: #060040;
}
.ant-menu-dark >>> .ant-menu-inline.ant-menu-sub{
  background: #04002A;
}
.ant-layout-sider >>> .ant-menu-item,.ant-layout-sider >>> .ant-menu-submenu-title{
  padding-left: 32px!important;
}
.ant-layout-sider >>> .ant-menu-submenu .ant-menu-item{
  padding-left: 57px!important;
}
.ant-menu{
  margin-top: 61px;
}
.ant-layout{
  position: fixed;
  left: 200px;
  right : 0;
  bottom : 0;
  top: 0;
  overflow: hidden;
}
.ant-layout-header{
  position: fixed;
  left: 200px;
  right : 0;
  overflow: hidden;
  background: #050035;
  top: 0;
  padding: 0;
  color: #fff;
  padding: 0 70px 0 23px;
}

.ant-layout-header.header-breadcrumb{
  background: #fff;
  top: 64px;
  box-shadow: 0 1px 5px -3px rgba(0,0,0,0.25);
  z-index: 100;
}
.ant-layout-header.headerbox .routerlink{
  padding-left: 16px;
}
.ant-avatar-image{
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.ant-layout-content{
  position: fixed;
  left: 200px;
  right : 0;
  bottom : 0;
  top : 128px;
  background: #F2F2F2;
  padding: 24px;
  overflow: auto;
}
.ant-layout-content::-webkit-scrollbar {
    width: 4px;     
    height: 1px;
}
.ant-layout-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
}
.ant-layout-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
}
.routertitle{
  color: rgba(255, 255, 255, 0.65);
}
.ant-menu-item-active .routertitle{
  color: #fff;
}
</style>