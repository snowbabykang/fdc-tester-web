<template>
    <section class="service-step-box">
        <a-steps size="small">
            <a-step title="选择服务类目" status="process" :class="currentStep == 2 ? 'step-border-active' : ''"/>
            <a-step title="填写服务详情" :status="currentStep !== 1 ? 'process' : ''" />
            <a-step title="提交成功" />
        </a-steps>
    </section>
</template>
<script>
export default {
    name: 'serviceStep',
    props: ['currentStep'],
    data() {
        return {
            current : this.currentStep
        };
    },
};
</script>
<style type="text/css" scoped>
.service-step-box{
    margin: 0 72px 42px;
}
.step-border-active >>> .ant-steps-item-title:after{
    background-color: #1890FF;
}
.ant-steps-item-process >>> .ant-steps-item-icon{
    background-color: #1890FF;
    border-color: #1890FF;
}
</style>