<template>
    <section class="step-list">
        <div class="step-item" v-bind:class="current == 1 ? 'active' : ''">
            <div class="step-icon">
                <div class="step-block"><div>1</div></div>
                <div class="step-divider"></div>
            </div>
            <div class="step-description">验证身份</div>
        </div>
        <div class="step-item" v-bind:class="current == 2 ? 'active' : ''">
            <div class="step-icon">
                <div class="step-block"><div>2</div></div>
                <div class="step-divider"></div>
            </div>
            <div class="step-description">重置密码</div>
        </div>
        <div class="step-item" v-bind:class="current == 3 ? 'active' : ''">
            <div class="step-icon">
                <div class="step-block"><div>3</div></div>
            </div>
            <div class="step-description">完成</div>
        </div>
        <div class="clearfix"></div>
    </section>
</template>
<script>
export default {
    name: 'psdStep',
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
    margin: 0 auto;
    width: 3.4rem;
}
.step-item{
    float: left;
}
.step-item .step-icon{
    margin-left: 0.05rem;
}
.step-item .step-block{
    width: 0.18rem;
    height: 0.18rem;
    background: #D8D8D8;
    cursor: #999;
    text-align: center;
    line-height: 0.18rem;
    font-size: 0.08rem;
    transform: rotate(45deg);
    display: inline-block;
}
.step-item .step-block div{
    transform: rotate(-45deg);
}
.step-item .step-divider{
    width: 1.17rem;
    height: 0.01rem;
    background: #b9b9b9;
    display: inline-block;
    vertical-align: text-top;
    margin: 0.06rem 0.02rem 0 0.07rem;
}
.step-item .step-description{
    color: #B7B7B7;
    margin-top: 0.1rem;
    width: 4em;
    text-align: center;
    margin-left: -0.03rem;
    font-size: 0.07rem;
}
.step-item.active .step-block{
    background: #044FE8;
    color: #fff;
}
.step-item.active .step-description{
    color: #044FE8;
}
</style>