<template>
    <section class="layout-header">
        <a-row>
            <a-col :span="12">
                <img src="static/common-img/logo.png" class="logoimg">
                <b style="font-size: 0.1rem;">修改密码</b>
            </a-col>
            <a-col :span="12" class="text-right">
                <span class="routerlink">您好，{{$store.getters.getPhone}}</span>
                <a-divider type="vertical" />
                <a href="javascript:void(0)" class="routerlink" @click="logout">退出</a>
            </a-col>
        </a-row>
    </section>
</template>
<script>
import {logout} from '@/service/getData'
export default {
    name: 'psdHeader',
    data() {
        return {
        };
    },
    methods : {
        logout(){
            logout().then(res => {
                if(res && res.code == 200){
                    this.$store.dispatch('removeToken');
                    window.location.href = process.env.demandLoginUrl;
                }
            })
        }
    },
    mounted() {
    },
};
</script>
<style type="text/css" scoped>
.layout-header{
    max-width: 1200px;
    margin: 0 auto;
}
.logoimg{
    width: 1.76rem;
    margin-top: -0.05rem;
    margin-right: 0.18rem;
}
.layout-header .routerlink{
    color: #666666;
    font-size: 0.08rem;
}
.layout-header .ant-divider{
    background: #979797;
}
</style>