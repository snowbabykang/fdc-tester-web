<template>
<section>
    <a-alert class="alertinfo" type="error" showIcon closable v-if="authStatus == 2">
        <template slot="message">
            <div class="tablebox">
                <div class="table-cell title"><b>企业认证未通过！</b></div>
                <div class="table-cell">你所提交的信息已经审核失败，可以进入个人信箱查看原因，如有疑问，请联系客服人员。</div>
            </div>
        </template>
    </a-alert>
    <a-alert class="alertinfo" type="error" showIcon closable v-if="qualityStatus == 2">
        <template slot="message">
            <div class="tablebox">
                <div class="table-cell title"><b>资质认证未通过！</b></div>
                <div class="table-cell">你所提交的信息已经审核失败，可以进入个人信箱查看原因，如有疑问，请联系客服人员。</div>
            </div>
        </template>
    </a-alert>
    <a-alert class="alertinfo" type="error" showIcon closable v-if="cashStatus == 2">
        <template slot="message">
            <div class="tablebox">
                <div class="table-cell title"><b>保证金未通过！</b></div>
                <div class="table-cell">你所提交的信息已经审核失败，失败原因：{{allInfo.storeMargin.failureReason}}；如有疑问，请联系客服人员。</div>
            </div>
        </template>
    </a-alert>
    <section class="content-white-box">
        <a-steps class="steps">
            <a-step status="finish">
                <a-icon type="safety" slot="icon"/>
                <template slot="title">
                    企业认证 <span class="status" :class="statuslist[authStatus] ? statuslist[authStatus].color : 'red'">（{{statuslist[authStatus] ? statuslist[authStatus].name : '未认证'}}）</span>
                </template>
                <span slot="description" v-if="authStatus === '' || authStatus == 2">
                    <a :href="orgEnterUrl"><a-button type="primary">企业申请</a-button></a>
                </span>
            </a-step>
            <a-step status="finish">
                <a-icon type="solution" slot="icon"/>
                <template slot="title">
                    资质审核 <span class="status" :class="statuslist[qualityStatus] ? statuslist[qualityStatus].color : 'red'">（{{statuslist[qualityStatus] ? statuslist[qualityStatus].name : '未认证'}}）</span>
                </template>
                <span slot="description" v-if="qualityStatus === '' || qualityStatus == 2">
                    <router-link to="/approveQuality"><a-button type="primary">资质审核</a-button></router-link>
                </span>
            </a-step>
            <a-step status="process">
                <a-icon type="insurance" slot="icon"/>
                <template slot="title">
                    保障金 <span class="status" :class="statuslist[cashStatus] ? statuslist[cashStatus].color : 'red'">（{{statuslist[cashStatus] ? statuslist[cashStatus].name : '未提交'}}）</span>
                </template>
                <span slot="description" v-if="cashStatus === '' || cashStatus == 2">
                    <router-link to="/"><a-button type="primary">保证金提交</a-button></router-link>
                </span>
            </a-step>
        </a-steps>
    </section>
    <section class="content-white-box">
        <section class="steplist">
            <span class="btn" :class="currentStep == 1 ? 'active' : ''" @click="tabChange(authInfo,1)">企业信息</span>
            <span class="btn" :class="currentStep == 2 ? 'active' : ''" @click="tabChange(qualityCertificate,2)">资质证书</span>
            <span class="btn" :class="currentStep == 3 ? 'active' : ''" @click="tabChange(facilityAndUser,3)">设备员工</span>
            <span class="btn" :class="currentStep == 4 ? 'active' : ''" @click="tabChange(placeBranch,4)">工商场地</span>
        </section>
        <div :is="currentView" :showinfo="true" @confirm="confirm"></div>
    </section>
</section>
</template>
<script>
import authInfo from '../components/authInfo'
import qualityCertificate from '../components/qualityCertificate'
import facilityAndUser from '../components/facilityAndUser'
import placeBranch from '../components/placeBranch'
import {getHomeInfo} from '../service/getData'
export default {
    data() {
        return {
            storeid : this.$store.getters.getStoreId,
            orgid : this.$store.getters.getOrgId,
            allInfo:{},
            authStatus : '',     //企业认证状态    0-待认证,1-通过认证,2-未通过认证
            qualityStatus : '',   //资质认证状态   0待审核  1审核通过  2审核拒绝
            cashStatus : '',     //保证金状态      0 审核中,1 审核成功,2 审核失败
            statuslist : {
                0 : {name : '审核中', color : 'primary'},
                1 : {name : '已通过', color : 'success'},
                2 : {name : '未通过', color : 'red'},
            },
            orgEnterUrl : process.env.demandEnterUrl + '?orgId='+this.$store.getters.getOrgId,
            currentStep : 1,
            currentView : 'authInfo',   //组件名变量
            authInfo : 'authInfo',
            qualityCertificate : 'qualityCertificate',
            facilityAndUser : 'facilityAndUser',
            placeBranch : 'placeBranch'
        };
    },
    components: {
        authInfo , qualityCertificate, facilityAndUser, placeBranch
    },
    methods: {
        tabChange(item,type){
            this.currentView = item;
            this.currentStep = type;
        },
        // 获取所有状态信息
        getAllStatus(){
            getHomeInfo(this.orgid,this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.allInfo = res.data;
                    this.authStatus = res.data.orgAuth ? res.data.orgAuth.status : '';
                    this.qualityStatus = res.data.orgQualification ? res.data.orgQualification.status : '';
                    this.cashStatus = res.data.storeMargin ? res.data.storeMargin.status : '';
                    if(res.data.orgQualification){
                        this.$store.dispatch('saveOrgQualificationId',res.data.orgQualification.id);   //保存资质审核总id
                        this.$store.dispatch('saveQualityStatus',res.data.orgQualification.status);
                    }else{
                        this.$store.dispatch('saveOrgQualificationId','');
                        this.$store.dispatch('saveQualityStatus','');
                    }
                }
            })
        },
        confirm(){
            console.log('返回');
            
        },
    },
    mounted(){
        this.getAllStatus();
    }
};
</script>
<style type="text/css" scoped>
.alertinfo{
    margin-bottom: 8px;
}
.alertinfo .tablebox .title{
    width: 8em;
    vertical-align: top;
}
.status{
    font-size: 14px;
}
.steps {
    width: 860px;
    margin: 0 auto;
}
.steps .ant-btn{
    border-radius: 0;
    margin-top: 22px;
}
.ant-steps-item-process >>> .ant-steps-item-title {
    font-weight: normal;
}
</style>