<template>
    <section class="">
        <psdStep :currentStep="1"></psdStep>
        <a-form :form="form" layout="horizontal" @submit="handleSubmit" class="verify-form">
            <a-row class="errormsgbox">
                <a-col :span="6"> </a-col>
                <a-col :span="13">
                    <div class="errormsg" v-if="errormsg"><a-icon type="close-circle" />{{errormsg}}</div>
                </a-col>
            </a-row>
            <a-form-item label="手机号码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input size="large" v-model="forminfo.phone" @keyup="checkIsShowBtn" @blur="validatePhone"> </a-input>
            </a-form-item>
            <a-form-item label="验证码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="code-form-item">
                <a-row :gutter="8">
                    <a-col :span="14">
                        <a-input size="large" v-model="forminfo.captcha" @change="validateCaptcha"></a-input>
                    </a-col>
                    <a-col :span="10">
                        <a-button size="large" class="verifybtn" disabled v-if="!isGetCaptcha">{{captchaBtn}}</a-button>
                        <a-button size="large" class="verifybtn blackbtn" v-else @click="getCaptha()">获取验证码</a-button>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button type="primary" html-type="submit" size="large" class="submitbtn" :disabled="!isSubmitBtn">确定</a-button> 
            </a-form-item>
        </a-form>
    </section>
</template>
<script>
import psdStep from '../components/psdStep'
import {getMsgCode, verifyMsgCode} from '@/service/getData'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
};
export default {
    data() {
        return {
            formItemLayout,
            form: this.$form.createForm(this),
            forminfo : {
                phone : '',
                captcha : '',
            },
            isGetCaptcha : false,   //是否可点击获取验证码
            isSubmitBtn : false,   //是否可点击提交按钮
            errormsg : "",
            captchaBtn : "获取验证码",
            countdown : 60,
        };
    },
    components: {
        psdStep
    },
    methods: {
        checkIsShowBtn(){
            let phone = this.forminfo.phone;
            if(phone.length !== 11){
                this.isGetCaptcha = false;
                this.isSubmitBtn = false;
            }
        },
        validatePhone(){
            let phone = this.forminfo.phone;
            let captcha = this.forminfo.captcha;
            const reg =  /^1[3456789][0-9]{9}$/;
            if(reg.test(phone)){
                this.isGetCaptcha = true;
                this.errormsg = "";
                this.isSubmitBtn = captcha && captcha.length == 6 ? true : false;
                return true;
            }else{
                this.isGetCaptcha = false;
                this.isSubmitBtn = false;
                this.errormsg = phone ? "哎呀~！手机号输入有误" : "哎呀~！没输入手机号";
                return false;
            }
        },
        validateCaptcha(){
            let phone = this.forminfo.phone;
            let captcha = this.forminfo.captcha;
            this.isSubmitBtn = captcha && captcha.length == 6 && this.validatePhone() ? true : false;
        },
        settime() {
            let that = this;
            if (that.countdown == 0) {
                that.isGetCaptcha = true;
                that.captchaBtn = "获取验证码";
                that.countdown = 60;
            } else {
                that.isGetCaptcha = false;
                that.captchaBtn = "重新发送（" + that.countdown + "）";
                that.countdown--;
                setTimeout(function() {
                    that.settime()
                },1000);
            }
        },
        //获取验证码
        getCaptha(){
            getMsgCode(this.forminfo.phone).then(res => {
                if(res && res.code == 200){
                    this.settime();
                }
            })
        },
        handleSubmit(e) {
            e.preventDefault();
            let phone = this.forminfo.phone;
            let info = {phone : phone, active : this.forminfo.captcha};
            verifyMsgCode(phone,this.forminfo.captcha).then(res => {
                if(res && res.code == 200){
                    this.$store.dispatch('savePsdInfo',info);
                    this.$router.push('/resetPsd');
                }
            })
        },
    },
};
</script>
<style type="text/css" scoped>
.verify-form{
    padding-top: 0.19rem;
}
.verify-form >>> .ant-form-item-label label{
    font-size: 0.07rem;
}
.verify-form .ant-input,.verify-form .ant-btn{
    height: 0.26rem;
    line-height: 0.26rem;
    margin-top: -0.03rem;
    font-size: 0.07rem;
}
.submitbtn,.verifybtn{
    width: 0.74rem;
}
.errormsgbox{
    height: 0.29rem;
    margin-bottom: 0.1rem;
}
.errormsg{
    height: 0.29rem;
    border: 0.01rem solid #F5222D;
    padding-left: 0.13rem;
    line-height: 0.29rem;
    color: #F5222D;
    font-size: 0.08rem;
}
.errormsg .anticon{
    font-size: 0.13rem;
    margin-right: 0.08rem;
    vertical-align: middle;
    margin-top: -0.02rem;
}
.verifybtn{
    background: #E4E2E4;
    color: #333;
    border-color: #E4E2E4;
}
.blackbtn{
    background: #8D94AA;
    color: #fff;
    border-color: #8D94AA;
}
.submitbtn[disabled]{
    background: #CACCCD!important;
    color: #666!important;
}
.code-form-item{
    margin:0.39rem 0 0.46rem;
}
</style>
