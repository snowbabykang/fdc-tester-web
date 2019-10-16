<template>
    <section class="content-box content-white-box">
        <serviceStep :currentStep="1"></serviceStep>
        <a-alert class="alertinfo" message="注意：如类目无您的项目请选择其他 并联系我们工作人员" type="warning" showIcon closable />
        <a-row :gutter="24">
            <a-col :span="8">
                <a-select v-model="categoryOne" labelInValue style="width: 100%;" @change="handleChange('one')" placeholder="选择一级类目">
                    <a-select-option :getPopupContainer="GLOBAL.getPopupContainer" :value="item.id" v-for="item in categoryList.one" :key="item.id">{{item.commodityTypeName}}</a-select-option>
                </a-select>
            </a-col>
            <a-col :span="8" v-if="categoryList.two.length > 0">
                <a-select v-model="categoryTwo" labelInValue style="width: 100%;" @change="handleChange('two')" placeholder="选择二级类目">
                    <a-select-option :getPopupContainer="GLOBAL.getPopupContainer" :value="item.id" v-for="item in categoryList.two" :key="item.id">{{item.commodityTypeName}}</a-select-option>
                </a-select>
            </a-col>
            <a-col :span="8" v-if="categoryList.three.length > 0">
                <a-select v-model="categoryThree" labelInValue style="width: 100%;" @change="handleChange('three')" placeholder="项目选择">
                    <a-select-option :getPopupContainer="GLOBAL.getPopupContainer" :value="item.id" v-for="item in categoryList.three" :key="item.id">{{item.commodityTypeName}}</a-select-option>
                </a-select>
            </a-col>
        </a-row>
        <div class="btn-box" v-if="checkPower()">
            <a-button type="primary" :disabled="isSubmitDisable" :class="isSubmitDisable ? 'submit-disable-btn' : ''" @click="nextStep()">下一步，填写服务信息</a-button>
        </div>
    </section>
</template>
<script>
import serviceStep from '../components/serviceStep'
import {getCategory} from '@/service/getData'
export default {
    data() {
        return {
            isSubmitDisable : true,
            categoryList : {one : '',two : '',three : ''},
            categoryOne : undefined,
            categoryTwo : undefined,
            categoryThree : undefined,
        };
    },
    components: {
        serviceStep
    },
    methods: {
        async initData(type,pid){
            let res = await getCategory(pid);
            if(res.code == 200){
                this.categoryList[type] = res.data;
                this.isSubmitDisable = !this.checkDisabled();
            }
        },
        handleChange(type) {
            if(type == 'one'){
                this.categoryTwo = undefined;
                this.categoryThree = undefined;
                this.initData('two',this.categoryOne.key);
                this.categoryList.three = "";
            }else if(type == 'two'){
                this.categoryThree = undefined;
                this.initData('three',this.categoryTwo.key);
            }else{
                this.isSubmitDisable = !this.checkDisabled();
            }
        },
        checkDisabled(){
            if(this.categoryList.two.length > 0 && this.categoryList.three.length > 0){
                return this.categoryOne && this.categoryTwo && this.categoryThree;
            }
            if(this.categoryList.two.length > 0 && this.categoryList.three.length == 0){
                return this.categoryOne && this.categoryTwo;
            }
            if(this.categoryList.two.length == 0 && this.categoryList.three.length == 0){
                return this.categoryOne;
            }
            return true;
        },
        nextStep(){
            let arr = [];
            arr.push(this.categoryOne);
            if(this.categoryTwo) arr.push(this.categoryTwo);
            if(this.categoryThree) arr.push(this.categoryThree);
            this.$router.push('/publishSerivceAdd/'+arr[arr.length-1].key);
        }
    },
    mounted(){
        this.initData('one');
    }
};
</script>
<style type="text/css" scoped>
.content-box{
    min-height: 500px;
}
.btn-box{
    margin-top: 64px;
    text-align: center;
}
.alertinfo{
    margin-bottom: 24px;
}
.submit-disable-btn{
    background: #D9D9D9;
    color: #fff;
}
</style>