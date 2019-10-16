<template>
    <!-- 收款账号信息 -->
    <!-- 收款信息在未通过可修改，通过之后这版本不做再次编辑 -->
    <section class="content-white-box">
        <div class="big-border-title-status"><span v-if="bankinfo" :class="bankPayStatus[bankinfo.status].color">{{bankPayStatus[bankinfo.status].name}}</span></div>
        <div class="big-border-title">收款账号信息</div>
        <a-form :form="form" class="form-item-label-left accountForm" :class="isEdit ? '' : 'edit-form-box'">
            <a-form-item v-bind="formItemLayout" label="开户银行城市" extra="用于结算操作">
                <selectArea v-if="isEdit" :addr="addrSelected" @selectedArea="selectedArea" v-decorator="['addr', {type: 'object',rules: [{ required: true, message: '请选择开户银行城市' }]} ]"></selectArea>
                <div v-if="!isEdit">{{bankinfo.province}} - {{bankinfo.city}} - {{bankinfo.area}}</div>
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="银行名称" extra="用于结算操作">
                <a-select  v-if="isEdit" :getPopupContainer="GLOBAL.getPopupContainer" style="width: 200px" v-decorator="['bankName', {
                    rules: [{ required: true, message: '请输入银行名称' }],
                    initialValue : bankinfo ? bankinfo.bankName : undefined
                } ]" placeholder="请选择" maxlength="30">
                  <a-select-option v-for="(item,index) in bankNamelist" :key="index" :value="item">{{item}}</a-select-option>
                </a-select>
                <div v-if="!isEdit">{{bankinfo.bankName}}</div>
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="开户银行账号" extra="用于发票">
                <a-input v-if="isEdit" v-decorator="['accountNumber', {
                    rules: [{ required: true, message: '请输入开户银行账号' },{pattern : /^\d{16,19}$/,message: '请输入正确的开户银行账号'}],
                    initialValue : bankinfo ? bankinfo.accountNumber : ''
                } ]" placeholder="请输入"/>
                 <div v-if="!isEdit">{{bankinfo.accountNumber}}</div>
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="开户银行" extra="您的开户银行，如某某某支行">
                <a-input v-if="isEdit" v-decorator="['bankOpening', {
                    rules: [{ required: true, message: '请输入开户银行' }],
                    initialValue : bankinfo ? bankinfo.bankOpening : ''
                } ]" placeholder="请输入" maxlength="30"/>
                 <div v-if="!isEdit">{{bankinfo.bankOpening}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="打款金额" v-if="bankinfo && (bankinfo.status == 1 || bankinfo.status == 3) ">
                <a-row>
                    <a-col :span="8">
                        <a-input-number v-decorator="['remitMoney', {rules: [{ required: true, message: '请输入打款金额' }]} ]" placeholder="请输入" :min="0.01" :max="1" :precision="2" style="width: 90%;"/>
                        <span class="unit">元</span>
                    </a-col>
                    <a-col :span="12" style="padding-left: 32px;">收到随机金额打款后，填写金额</a-col>
                </a-row>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="打款金额" v-if="bankinfo && bankinfo.status == 2">
                {{bankinfo.remitMoney}}元
            </a-form-item>
            <div class="submitbtnbox text-right" v-if="checkPower()">
                <a-button v-if="isEdit" type="primary" ghost @click="handleAccountSubmit">提交</a-button>
                <a-button v-if="bankinfo && (bankinfo.status == 1 || bankinfo.status == 3)" type="primary" ghost @click="confirmAccountSubmit">确认</a-button>
            </div>
        </a-form>
    </section>
</template>
<script>
import selectArea from '../components/selectArea'
import {getBankInfo , addBankInfo } from '../service/getData'
import { banklist,bankPayStatus } from '../api/dictionary'
export default {
    data() {
        return {
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
            isEdit : false,       //是否可编辑银行信息
            showMoney : false,
            storeid : this.$store.getters.getStoreId,
            bankinfo : '',
            addrSelected : '',
            bankNamelist : banklist,
            bankPayStatus : bankPayStatus,
        };
    },
    components: {
        selectArea
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    created(){
        this.getBankinfo();
    },
    methods:{
        // 1、初始进入页面填写银行信息，状态变成提交中（可修改银行信息）
        // 2、admin那边进行打款，状态变为已打款，展示金额填写，提交
        // 3、金额正确，状态变为打款成功，金额失败，有3次机会，全部失败则回到第一步
        // 0 提交中,1 已打款,2 打款成功 3 打款失败; 必填
        getBankinfo(){
            getBankInfo(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.bankinfo = res.data || '';
                    if(!res.data){
                        this.isEdit = true;
                        this.addrSelected = '';
                        this.form.getFieldDecorator('addr', { initialValue: '', preserve: true });
                    }else{
                        this.isEdit = false;
                        this.addrSelected = {
                            province: res.data.province, 
                            city: res.data.city, 
                            area: res.data.area
                        }
                    }
                }
            })
        },
        // 省市区联动
        selectedArea(data,addrtype){
            const { form } = this;
            form.setFieldsValue({'addr' : data});
        },
        handleAccountSubmit  (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let val = {
                        ...values,
                        'province' : values.addr.province,
                        'city' : values.addr.city,
                        'area' : values.addr.area,
                    }
                    delete val.addr;
                    val.storeId = this.storeid;
                    addBankInfo(val).then((res) => {
                        if(res && res.code == 200){
                            this.isEdit = false;
                            this.getBankinfo();
                        }
                    })
                }
            });
        },
        confirmAccountSubmit(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.storeId = this.storeid;
                    addBankInfo(values).then((res) => {
                        if(res && res.code == 200){
                            this.getBankinfo();
                            if(res.data == '400'){
                                this.$message.error('校对金额失败');
                            }else if(res.data == '200'){
                                this.$message.success('校对金额成功');
                            }
                        }
                    })
                }
            });
        }
    }
};
</script>
<style type="text/css" scoped>
.submitbtnbox{
    margin-top: 28px;
}
</style>