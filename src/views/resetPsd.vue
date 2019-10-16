<template>
    <section class="">
        <psdStep :currentStep="2"></psdStep>
        <a-form :form="form" layout="horizontal" @submit="handleSubmit" class="verify-form">
            <a-row class="errormsgbox">
                <a-col :span="6"> </a-col>
                <a-col :span="13">
                    <div class="errormsg" v-if="errormsg">
                        <a-row type="flex" align="middle" style="height:100%;">
                            <a-col style="text-align: center;width: 0.18rem;"><a-icon type="close-circle" /></a-col>
                            <a-col style="flex: 1;">
                                {{errormsg}}
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
            <a-form-item label="设置密码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input size="large" type="password" v-model="forminfo.password" @blur="validatePassword"> </a-input>
            </a-form-item>
            <a-form-item label="确认密码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="psd-form-item">
                <a-input size="large" type="password" v-model="forminfo.confirm" @blur="validateNextPassword"> </a-input>
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button type="primary" html-type="submit" size="large" class="submitbtn">确定</a-button> 
            </a-form-item>
        </a-form>
    </section>
</template>
<script>
import psdStep from '../components/psdStep'
import {validatePsd} from '../api/validateForm.js'
import {Encrypt} from '../api/env'
import {changePsd} from '@/service/getData'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
};
export default {
    data() {
        return {
            formItemLayout,
            form: this.$form.createForm(this),
            forminfo: {
                password: "",
                confirm: "",
            },
            errormsg : "",
        };
    },
    components: {
        psdStep
    },
    methods: {
        handleSubmit  (e) {
            e.preventDefault();
            let psdinfo = this.$store.getters.getPsdInfo;
            this.validatePassword();
            if(this.forminfo.password && this.forminfo.confirm){
                changePsd(psdinfo.phone,Encrypt(this.forminfo.password),psdinfo.active).then(res => {
                    if(res && res.code == 200){
                        this.$store.dispatch('removePsdInfo');
            this.$router.push('/finishPsd');
                    }
                })
            }
        },
        validatePassword  () {
            let psd = this.forminfo.password;
            let confirmpsd = this.forminfo.confirm;
            if(!psd ){
                this.errormsg = "哎呀~！请设置密码";
                return false;
            }
            var msg = validatePsd(psd);
            if(msg){
                this.errormsg = msg;
                return false;
            }
            if(psd && confirmpsd && psd !== confirmpsd){
                this.errormsg = "哎呀~！两次密码不一样";
                return false;
            }else{
                this.errormsg = "";
            }
        },
        validateNextPassword(){
            let psd = this.forminfo.password;
            let confirmpsd = this.forminfo.confirm;
            if(!confirmpsd ){
                this.errormsg = "哎呀~！请确认密码";
                return false;
            }
            if(psd && confirmpsd && psd !== confirmpsd){
                this.errormsg = "哎呀~！两次密码不一样";
                return false;
            }else{
                this.errormsg = "";
            }
        }
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
    padding-left: 0.08rem;
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
.psd-form-item{
    margin: 0.39rem 0 0.46rem;
}
</style>
