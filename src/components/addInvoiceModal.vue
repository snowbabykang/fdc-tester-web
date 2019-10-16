<!-- 开发票modal -->
<template>
<section>
<a-modal v-model="isvisible" :footer="null" :centered="true" width="100%" :style="{paddingLeft : '224px',paddingRight : '24px'}" @cancel = "handleCancel()">
    <a-row :gutter="12" type="flex">
        <a-col :span="10">
            <div class="invoicebox">
                <div class="big-border-title">开票信息</div>
                <div v-if="!invoiceInfo.id && !invoiceEdit" class="nodata">
                    <span class="btn-link" @click="invoiceEdit = true">新增开票信息</span>
                </div>
                <div v-else>
                    <a-form :form="form" class="form-item-label-left" style="padding-top: 20px;" :class="!invoiceEdit ? 'showFormbox' : ''">
                        <span v-if="!invoiceEdit" class="btn-link updatebtn" @click="invoiceEdit = true">修改</span>
                        <a-alert type="info" v-if="isShow && invoiceEdit" style="margin-bottom: 10px;">
                            <div slot="description">
                            <span class="red">注意：</span>根据税法规定, 具有一般纳税人资质的企业才可开具<span class="red">增值税专用发票</span>请与您公司的财务人员确认是否有该资质，专票会根据税率扣除相应金额，总金额为开票金额。
                            </div>
                        </a-alert> 
                        <a-form-item v-bind="formItemLayout" label="发票类型">
                            <div v-if="!invoiceEdit"><span v-if="invoiceInfo.invoiceTypeId == '0' || invoiceInfo.invoiceTypeId == '1'">{{invoiceType[invoiceInfo.invoiceTypeId]}}</span></div>
                            <a-radio-group v-else v-decorator="['invoiceTypeId',{rules: [{ required: true, message: '请选择发票类型' }],initialValue : invoiceInfo.invoiceTypeId || '0'} ]" @change="changeType">
                                <a-radio :value="'0'">企业增值税专用发票</a-radio>
                                <a-radio :value="'1'">企业增值税普通发票</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="发票抬头">
                            <div v-if="!invoiceEdit">{{invoiceInfo.header}}</div>
                            <a-input v-else v-decorator="['header',{rules: [{ required: true, message: '请输入发票抬头' }],initialValue : invoiceInfo.header} ]" placeholder="请输入"  maxlength="50"/>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="纳税人识别号">
                            <div v-if="!invoiceEdit">{{invoiceInfo.taxerCode}}</div>
                            <a-input v-else v-decorator="['taxerCode',{rules: [{ required: true, message: '请输入纳税人识别号' }],initialValue : invoiceInfo.taxerCode} ]" placeholder="请输入社会统一信用代码"  :maxlength="isShow ? 30 : 18"/>
                        </a-form-item>
                        <div v-if="isShow">
                            <a-form-item v-bind="formItemLayout" label="开户银行">
                                <div v-if="!invoiceEdit">{{invoiceInfo.bankName}}</div>
                                <a-input v-else v-decorator="['bankName',{rules: [{ required: true, message: '请输入开户银行' }],initialValue : invoiceInfo.bankName} ]" placeholder="开户银行及支行"  maxlength="30"/>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout" label="开户账号">
                                <div v-if="!invoiceEdit">{{invoiceInfo.bankAccount}}</div>
                                <a-input v-else v-decorator="['bankAccount',{rules: [{ required: true, message: '请输入开户账号' }],initialValue : invoiceInfo.bankAccount} ]" placeholder="开户银行许可证登记银行帐号"  maxlength="30"/>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout" label="注册场所地址">
                                <div v-if="!invoiceEdit">{{invoiceInfo.regAddr}}</div>
                                <a-input v-else v-decorator="['regAddr',{rules: [{ required: true, message: '请输入注册场所地址' }],initialValue : invoiceInfo.regAddr} ]" placeholder="税务登记上的地址或营业场所地址"  maxlength="50"/>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout" label="公司注册电话">
                                <div v-if="!invoiceEdit">{{invoiceInfo.regPhone}}</div>
                                <a-input v-else v-decorator="['regPhone',{rules: [{ required: true, message: '请输入公司注册电话' }],initialValue : invoiceInfo.regPhone} ]" placeholder="公司注册电话"  maxlength="11"/>
                            </a-form-item>
                        </div>
                        <a-form-item style="text-align: center;" v-if="invoiceEdit">
                             <a-button type="primary" @click="submitInvoice" :disabled="hasErrors(form.getFieldsError())">确认</a-button>
                        </a-form-item>
                    </a-form>

                </div>
            </div>
        </a-col>
        <a-col :span="10">
            <div class="invoicebox">
                <div class="big-border-title">邮寄地址</div>
                <div v-if="!addressInfo.id && !addressEdit" class="nodata">
                    <span class="btn-link" @click="addressEdit = true">新增地址信息</span>
                </div>
                <div v-else>
                    <a-form :form="addressform" class="form-item-label-left" style="padding-top: 20px;" :class="!addressEdit ? 'showFormbox' : ''">
                        <span v-if="!addressEdit" class="btn-link updatebtn" @click="addressEdit = true">修改</span>
                        <a-form-item v-bind="formItemLayout" label="收货人姓名">
                            <div v-if="!addressEdit">{{addressInfo.contactName}}</div>
                            <a-input v-else v-decorator="['contactName',{rules: [{ required: true, message: '请输入收货人姓名' }],initialValue : addressInfo.contactName} ]" placeholder="请输入"  maxlength="25"/>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="开户银行城市">
                            <div v-if="!addressEdit">{{addressInfo.provinceName}}-{{addressInfo.cityName}}-{{addressInfo.areaName}}</div>
                            <selectArea v-else :addr="addrSelected" @selectedArea="selectedArea" v-decorator="['address', {type: 'object',rules: [{ required: true, message: '请选择开户银行城市' }] , initialValue : addressInfo.province ? {province : addressInfo.province,city : addressInfo.city,area : addressInfo.area} : ''} ]"></selectArea>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="街道地址">
                            <div v-if="!addressEdit">{{addressInfo.detailAddress}}</div>
                            <a-input v-else v-decorator="['detailAddress', {rules: [{ required: true, message: '请输入详细地址' }],initialValue : addressInfo.detailAddress} ]" placeholder="请输入"  maxlength="50" />
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="手机号码">
                            <div v-if="!addressEdit">{{addressInfo.contactPhone}}</div>
                            <a-input v-else v-decorator="['contactPhone',{
                                rules: [{ required: true, message: '请输入手机号码' },
                                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }] ,
                                initialValue : addressInfo.contactPhone}]" placeholder="请输入"/>
                        </a-form-item>
                        <a-form-item style="text-align: center;" v-if="addressEdit">
                             <a-button type="primary" @click="submitAdress" :disabled="hasErrors(addressform.getFieldsError())">确认</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </a-col>
        <a-col :span="4">
            <div class="invoicebox" style="display: table;width: 100%;">
                <div class="approvebox">
                    <div>开票金额</div>
                    <div style="padding: 8px 0;">￥{{amount}}</div>
                    <a-button type="primary" @click="approveInvoice" :disabled="isApprove()">申请开票</a-button>
                </div>
            </div>
        </a-col>
    </a-row>
</a-modal>
</section>
</template>

<script>
import selectArea from '../components/selectArea'
import {getServiceInfo,getInvoiceInfo,addInvoiceInfo,getExpressInfo,addExpressInfo,createInvoice} from '../service/getData'
import { invoiceType} from '../api/dictionary'
export default {
    name: 'addInvoiceModal',
    props: {
        visible: { type: Boolean, default: false },   
        id: {type: String, default: ""},           //提示信息
        amount: {},           //
    },
    data() {
        return {
            invoiceInfo : {},
            invoiceEdit : false,
            addressInfo : {},
            addressEdit : false,
            addrSelected : {province : undefined,city : undefined,area : undefined},
            formItemLayout: {
                labelCol: { span: 8 },
                wrapperCol: { span: 14 },
            },
            invoiceType : invoiceType,
            storeid : this.$store.getters.getStoreId,
            isShow : false,
        };
    },
    components: {
        selectArea
    },
    computed : {         //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                if(this.visible){
                    this.form.resetFields();
                    this.addressform.resetFields();
                    this.invoiceEdit = false;
                    this.addressEdit = false;
                    this.getInvoice();
                    this.getAddress();
                    this.hasErrors();
                }
                return this.visible;
            },
            set: function () {

            }
        }
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
        this.addressform = this.$form.createForm(this);
    },
    methods: {
        getInvoice(){
            getInvoiceInfo(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.invoiceInfo = res.data;
                    if(res.data && res.data.invoiceTypeId == '1'){
                        this.isShow = false;
                    }else{
                        this.isShow = true;
                    }
                    this.isApprove();
                }
            })
        },
        changeType(e){
            if(e.target.value == '0'){
                this.isShow = true;
            }else{
                this.isShow = false;
            }
        },
        getAddress(){
            getExpressInfo(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.addressInfo = res.data;
                    if(res.data && res.data.province){
                        this.addrSelected = {
                            province : res.data.province,
                            city : res.data.city,
                            area : res.data.area,
                        }
                    }
                    this.isApprove();
                }
            })
        },
        isApprove(){
            if(this.invoiceInfo.id && !this.invoiceEdit && this.addressInfo.id && !this.addressEdit){
                return false;
            }else{
                return true;
            }
        },
        hasErrors (fieldsError) {
            return fieldsError ? Object.keys(fieldsError).some(field => fieldsError[field]) : true;
        },
        submitInvoice(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.storeId = this.storeid;
                    addInvoiceInfo(values).then((res) => {
                        if(res && res.code == 200){
                            this.invoiceEdit = false;
                            this.getInvoice();
                        }
                    })
                }
            });
        },
        selectedArea(data,addrtype){
            this.addressform.setFieldsValue({address : data});
        },
        submitAdress(){
            this.addressform.validateFields((err, values) => {
                if (!err) {
                    let obj = {
                        ...values,
                        province : values.address.province,
                        city : values.address.city,
                        area : values.address.area,
                    }
                    delete obj.address;
                    console.log(obj);
                    obj.storeId = this.storeid;
                    addExpressInfo(obj).then((res) => {
                        if(res && res.code == 200){
                            this.addressEdit = false;
                            this.getAddress();
                        }
                    })
                }
            });
        },

        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        approveInvoice(e) {
            createInvoice(this.amount,this.id,this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.$emit('update:visible', false);    // 更新visible的值
                    this.$emit('confirm');  // 传递确认事件
                }
            })
        },
    },
}
</script>
<style scoped>
.nodata{padding:10px 0 158px 10px;}
.invoicebox{
    background:rgba(0,0,0,0.03);
    padding: 22px 16px 10px 16px;
    height: 100%;
}
.invoicebox .big-border-title{
    margin-bottom: 12px;
}
.approvebox{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.expressStatus{}
.expressStatus .title{
    font-size:20px;
    font-weight:500;
}
.expressStatus .expressinfo{
    font-size:16px;
    font-weight:500;
    padding: 14px 0 26px;
}
.expressStatus .expresscode{
    font-size: 14px;
    font-weight: normal;
}
.invoicebox table{
    width: 100%;
}
.invoicebox table tr td{
    font-size:14px;
    font-weight:normal;
    padding: 8px 0px 8px 8px;
    vertical-align: top;
}
.invoicebox table tr td:first-child{
    font-size:16px;
    font-weight:500;
}
.updatebtn{
    float: right;
    margin-top: -20px;
}
.showFormbox .ant-form-item{margin-bottom: 0;}
</style>
