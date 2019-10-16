<template>
    <!-- 服务基础信息 -->
    <section class="content-white-box">
        <!-- <div class="big-border-title-status"><span class="red">待填写</span></div> -->
        <div class="big-border-title">服务基础信息</div>
        <section class="steplist">
            <span class="btn" :class="currentStep == 1 ? 'active' : ''" @click="tabChange(service_orginfo,1)">机构介绍</span>
            <span class="btn" :class="currentStep == 2 ? 'active' : ''" @click="tabChange(service_professor,2)">权威介绍</span>
            <span class="btn" :class="currentStep == 3 ? 'active' : ''" @click="tabChange(service_facility,3)">主要设备</span>
        </section>
        <div :is="currentView" @confirm="getStoreInfo"></div>
    </section>
</template>
<script>
import service_orginfo from '../views/service_orginfo'
import service_professor from '../views/service_professor'
import service_facility from '../views/service_facility'
import {getServiceInfo} from '../service/getData'
export default {
    data() {
        return {
            currentStep : 1,
            currentView : 'service_orginfo',   //组件名变量
            service_orginfo : 'service_orginfo',
            service_professor : 'service_professor',
            service_facility : 'service_facility',
            orgId : this.$store.getters.getOrgId,
            storeId : this.$store.getters.getStoreId,
            qualityId : this.$store.getters.getOrgQuaId,  //资质认证整个流程走完生成的总ID
            qualityStatus : this.$store.getters.getQualityStatus,   //资质认证的状态 0待审核 1审核通过 2审核拒绝  
            storeinfo : '',
        };
    },
    components: {
        service_orginfo,service_professor,service_facility
    },
    methods:{
        tabChange(item,type){
            this.currentView = item;
            this.currentStep = type;
        },
        getStoreInfo(){
            let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
            getServiceInfo(this.orgId,this.storeId,qualityId).then((res) => {
                if(res && res.code == 200){
                    this.storeinfo = res.data;
                    this.$store.dispatch("saveStoreInfo",this.storeinfo);
                }
            })
        },
    },
    mounted(){
        this.getStoreInfo();
    }
};
</script>
<style type="text/css" scoped>

</style>