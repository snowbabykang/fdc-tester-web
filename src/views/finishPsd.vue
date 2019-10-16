<template>
    <section>
        <psdStep :currentStep="3"></psdStep>
        <div class="finishpsd-con">
            <div class="imgbox"><img src="static/common-img/successicon.png"/></div>
            <div class="messageinfo">重置成功</div>
            <div><router-link :to="'/login'" class="primarylink">去登录</router-link></div>
        </div>
    </section>
</template>
<script>
import psdStep from '../components/psdStep'
export default {
    data() {
        return {
            
        };
    },
    components: {
        psdStep
    },
    mounted(){
        let that = this;
        setTimeout(function(){
            that.$router.push('/login');
        },1000)
    }
};
</script>

<style type="text/css" scoped>
.finishpsd-con{
    text-align: center;
    padding-top: 0.42rem;
    font-weight: 500;
}
.imgbox{
    width: 0.5rem;
    height: 0.5rem;
    line-height: 0.5rem;
    margin: 0 auto;
}
.imgbox img{
    width: 100%;
}
.messageinfo{
    margin: 0.12rem 0 0.09rem 0;
}
</style>