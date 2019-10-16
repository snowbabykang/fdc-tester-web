<template>
    <!-- 委托书信息 -->
    <section class="content-white-box">
        <div class="big-border-title-status">
            <span class="red" v-if="!mandateInfo.id">待填写</span>
            <span class="success" v-else>已填写</span>
        </div>
        <div class="big-border-title">委托书信息 <span class="subinfo"><span class="red">提示：</span>此输入关系到检测单表头、表尾信息，请一定准确填写，需求方会按照此信息生成的委托书使用</span></div>
        <a-form :form="form" class="form-item-label-left" :class="isEdit ? '' : 'edit-form-box'">
            <a-form-item v-bind="formItemLayout" label="表头名称">
                <a-input v-if="isEdit" v-decorator="['headerName', {
                    rules: [{ required: true, message: '请输入表头名称' }],
                    initialValue : mandateInfo.headerName} ]" placeholder="请输入" maxlength="50"/>
                <div v-if="!isEdit">{{mandateInfo.headerName}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="户名">
                <a-input v-if="isEdit" v-decorator="['accountName', {
                    rules: [{ required: true, message: '请输入开户银行账号' }],
                    initialValue : mandateInfo.accountName} ]" placeholder="请输入" maxlength="50"/>
                <div v-if="!isEdit">{{mandateInfo.accountName}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="账号">
                <a-input v-if="isEdit" v-decorator="['account', {
                    rules: [{ required: true, message: '请输入账号' }],
                    initialValue : mandateInfo.account} ]" placeholder="请输入" maxlength="50"/>
                <div v-if="!isEdit">{{mandateInfo.account}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="开户行">
                <a-input v-if="isEdit" v-decorator="['bankName', 
                {rules: [{ required: true, message: '请输入开户行' }],
                initialValue : mandateInfo.bankName} ]" placeholder="请输入" maxlength="50"/>
                <div v-if="!isEdit">{{mandateInfo.bankName}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="地址">
                <a-input v-if="isEdit" v-decorator="['address', 
                {rules: [{ required: true, message: '请输入地址' }],
                initialValue : mandateInfo.address} ]" placeholder="请输入" maxlength="50"/>
                <div v-if="!isEdit">{{mandateInfo.address}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout1" label="电话">
                <a-input v-if="isEdit" v-decorator="['phone' , 
                {rules: [{ required: true, message: '请输入电话' },{pattern : /^\d{3}-?\d{8}$|^1[3456789][0-9]{9}$/, message : '请输入正确电话'}],
                initialValue : mandateInfo.phone} ]" placeholder="请输入"/>
                <div v-if="!isEdit">{{mandateInfo.phone}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout1" label="传真">
                <a-input v-if="isEdit" v-decorator="['fax', 
                {rules: [{ required: true, message: '请输入传真' },{ pattern: /^\d{11}$/, message: '请输入11位传真号' }],
                initialValue : mandateInfo.fax} ]" placeholder="请输入"/>
                <div v-if="!isEdit">{{mandateInfo.fax}}</div>
            </a-form-item>
            <section class="mandate-item-box" v-for="(k, index) in form.getFieldValue('keys')" :key="k">
                <div class="mandate-item-box-con">
                <a-popconfirm v-if="isEdit" title="你确定删除此模块吗？" @confirm="() => remove(k)">
                    <a-icon slot="icon" type="exclamation-circle" theme="filled" style="color: red" />
                    <a href="#" class="dynamic-delete-button">删除</a>
                </a-popconfirm>
                <a-form-item v-bind="formItemLayout" label="地址">
                    <a-input v-if="isEdit" v-decorator="[`storeBranch[${k}].storeAddr`, addressRule(k) ]" placeholder="请输入" maxlength="50"/>
                    <div v-if="!isEdit">{{mandateInfo.storeBranch[index].storeAddr}}</div>
                </a-form-item>
                <a-form-item v-bind="formItemLayout1" label="电话">
                    <a-input v-if="isEdit" v-decorator="[`storeBranch[${k}].storePhone`,phoneRule(k) ]" placeholder="请输入"/>
                    <div v-if="!isEdit">{{mandateInfo.storeBranch[index].storePhone}}</div>
                </a-form-item>
                <a-form-item v-bind="formItemLayout1" label="传真">
                    <a-input v-if="isEdit" v-decorator="[`storeBranch[${k}].storeFax`,faxRule(k)]" placeholder="请输入"/>
                    <div v-if="!isEdit">{{mandateInfo.storeBranch[index].storeFax}}</div>
                </a-form-item>
                </div>
            </section>
            <div v-if="checkPower()">
                <a-form-item class="addbtnbox" v-if="isEdit"> <a-button type="primary" ghost @click="add">添加分部信息</a-button> </a-form-item>
                <div class="submitbtnbox text-right">
                    <a-button v-if="isEdit" type="primary" ghost @click="handleSubmit">提交</a-button>
                    <a-button v-if="!isEdit" type="primary" ghost @click="isEdit = true">修改</a-button>
                </div>
            </div>
        </a-form>
    </section>
</template>
<script>
import {getMandateList , addMandate ,editMandate} from '../service/getData'
export default {
    data() {
        return {
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
            formItemLayout1: {
                labelCol: { span: 3 },
                wrapperCol: { span: 4 },
            },
            isEdit : false,
            keyid : undefined,
            mandateInfo : {},
            storeid : this.$store.getters.getStoreId,
            editid : '',
        };
    },
    components: {
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    created(){
        // 获取委托书信息
        this.getMandateInfo();
    },
    methods:{
        getMandateInfo(){
            getMandateList(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.mandateInfo = res.data || {};
                    if(!res.data){
                        let len = -1;
                        this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
                        this.keyid = len;
                        this.isEdit = true;
                        this.editid = '';
                    }else{
                        let len = res.data.storeBranch.length;
                        let arr = [];
                        for(var i = 0; i < len;i++){
                            arr.push(i);
                        }
                        this.form.getFieldDecorator('keys', { initialValue: arr, preserve: true });
                        this.keyid = len - 1;
                        this.isEdit = false;
                        this.editid = res.data.id;
                    }
                }
            })
        },
        addressRule(index){
            return {
                rules: [{ required: true, message: '请输入地址' }],
                initialValue : this.mandateInfo.storeBranch[index] ? this.mandateInfo.storeBranch[index].storeAddr : ''
            }
        },
        phoneRule(index){
            return {
                rules: [
                    { required: true, message: '请输入电话或座机' },
                    {pattern : /^\d{3}-?\d{8}$|^1[3456789][0-9]{9}$/, message : '请输入正确电话或座机'}
                ],
                initialValue : this.mandateInfo.storeBranch[index] ? this.mandateInfo.storeBranch[index].storePhone : ''
            }
        },
        faxRule(index){
            return {
                rules: [
                    { required: true, message: '请输入传真' },
                    { pattern: /^\d{11}$/, message: '请输入11位传真号' }
                ],
                initialValue : this.mandateInfo.storeBranch[index] ? this.mandateInfo.storeBranch[index].storeFax : ''
            }
        },
        // 新增分部信息
        add () {
            const { form } = this;
            if(!this.mandateInfo.storeBranch){
                this.mandateInfo.storeBranch = [];
            }
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++this.keyid);
            form.setFieldsValue({
                keys: nextKeys,
            });
        },
        //移除分部信息
        remove (k) {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        },
        handleSubmit  (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let obj = {
                        ...values,
                        storeId : this.storeid,
                    }
                    delete obj.keys;
                    if(obj.storeBranch && obj.storeBranch.length > 0){
                        for(var i = 0 ;i<obj.storeBranch.length;i++){
                            if(obj.storeBranch[i] == "" || typeof(obj.storeBranch[i]) == "undefined"){
                                 obj.storeBranch.splice(i,1);
                                 i= i-1;
                            }
                        }
                    }
                    if(this.mandateInfo.id){
                        obj.id = this.editid;
                        this.editmandate(obj);
                    }else{
                        this.addmandate(obj);
                    }
                }
            });
        },
        addmandate(obj){
            addMandate(obj).then((res) => {
                if(res && res.code == 200){
                    this.getMandateInfo();
                }
            })
        },
        editmandate(obj){
            editMandate(obj).then((res) => {
                if(res && res.code == 200){
                    this.getMandateInfo();
                }
            })
        }
    }
};
</script>
<style type="text/css" scoped>
.mandate-item-box{
    position: relative;
    padding-bottom: 10px;
    border-top: 8px solid #eee;
    padding-top: 20px;
    margin-left: -32px;
    margin-right: -32px;
}
.mandate-item-box-con{
    padding-left: 32px;
}
.dynamic-delete-button{
    position: absolute;
    right: 32px;
    top: 5px;
    color: rgba(0,0,0,0.45);
    z-index: 100;
}
</style>