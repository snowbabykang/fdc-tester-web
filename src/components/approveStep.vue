<template>
    <a-row class="step-list" type="flex">
        <a-col :span="8" class="step-item" v-bind:class="current == 1 ? 'active' : ''">
            <div class="step-title">1.验证身份</div>
        </a-col>
        <a-col :span="8" class="step-item" v-bind:class="current == 2 ? 'active' : ''">
            <div class="step-title">2.设备权威认证</div>
        </a-col>
        <a-col :span="8" class="step-item last-item" v-bind:class="current == 3 ? 'active' : ''">
            <div class="step-title">3.工商场地，分支机构认证</div>
        </a-col>
    </a-row>
</template>
<script>
export default {
    name: 'approveStep',
    props: ['currentStep'],
    data() {
        return {
            current : this.currentStep
        };
    },
    mounted() {

    },
};
</script>
<style scoped>
.step-list{
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    margin-bottom: 42px;
}
.step-list .step-item{
    text-align: center;
    background: #F3F3F3;
    color:rgba(0,0,0,0.65);
}
.step-list .step-item.active{
    background: #044FE8;
    color: #fff;
}
.step-list .step-item .step-title{}
.active .step-title{
    position: relative;
    overflow: hidden;
}
.active .step-title:after,.active .step-title:before{
    content: "";
    height: 0px;
    width: 0px;
    position: absolute;
    right: 0;
    z-index: 1;
    border-top: 29px solid transparent;
    border-bottom: 29px solid transparent;
    border-right: 29px solid #F3F3F3;
}
.active .step-title:after{
    top: -29px;
}
.active .step-title:before{
    top : 29px;
}
.last-item.active .step-title:after,.last-item.active .step-title:before{
    display: none;
}
</style>