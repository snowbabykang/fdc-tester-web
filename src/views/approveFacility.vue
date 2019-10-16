<template>
    <section class="content-white-box">
        <approveStep :currentStep="2"></approveStep>
        <a-tabs v-model="activeTabkey" class="mytabs">
            <a-tab-pane tab="设备资质" key="1"  class="facilityBox" :disabled="!isDisabled">
                <facilitySet @confirm = "handleconfirm()" />
            </a-tab-pane>
            <a-tab-pane tab="权威人员认证" key="2" forceRender :disabled="isDisabled">
                <professorListSet @confirm = "handleconfirm2()" />
            </a-tab-pane>
            <template slot="renderTabBar" slot-scope="props, DefaultTabBar">
                <component :is="DefaultTabBar" {...props} />
            </template>
        </a-tabs>
    </section>
</template>

<script>
import approveStep from '../components/approveStep'
import facilitySet from '../components/facilitySet'
import professorListSet from '../components/professorListSet'
export default {
    data () {
        return {
            isDisabled : true,
            activeTabkey : '1',
        }
    },
    components: {
        approveStep, facilitySet, professorListSet
    },
    methods: {
        handleconfirm(){
            this.isDisabled = false;
            this.activeTabkey = '2';
        },
        handleconfirm2(){
            this.$router.push('/approvePlace');
        }
    },
}
</script>
<style scoped>
.mytabs{
    /*margin-left: -32px;
    margin-right: -32px;*/
}
.mytabs .ant-tabs-bar{
    width: 800px;
    margin :0 auto 32px;
}
.mytabs >>> .ant-tabs-nav{
    width: 100%;
}
.mytabs >>> .ant-tabs-tab{
    width: 50%;
    text-align: center;
    margin: 0;
    padding: 0;
    height: 48px;
    line-height: 48px;
}
.mytabs >>> .ant-tabs-ink-bar{
    width: 50%!important;
}
.mytabs >>> .ant-tabs-tab-active{
    background:rgba(243,243,243,1);
}
.facilityBox{
    /*margin-left: 32px;*/
}
</style>

