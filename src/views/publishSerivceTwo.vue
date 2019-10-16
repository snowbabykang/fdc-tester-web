<template>
    <section class="content-white-box">
        <serviceStep :currentStep="2" v-if="!editid"></serviceStep>
        <a-form :form="form" @submit="handleSubmit" class="form-item-label-left">
            <div class="big-border-title">服务基本信息</div>
                <a-form-item v-bind="formItemLayout" label="服务分类" v-if="categoryVal && categoryVal[1]">
                    <span v-if="categoryVal[2]">{{categoryVal[2].commodityTypeName}} - </span>
                    <span v-if="categoryVal[1]">{{categoryVal[1].commodityTypeName || ''}}</span>
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="服务名称" v-if="categoryVal">
                    {{categoryVal[0].commodityTypeName || '--'}}
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="价格">
                    <a-input-number v-decorator="['commodityPrice' ,{rules: [{ required: true, message: '请输入价格' }],initialValue : this.prdinfo.commodityPrice}]" :min="0.01" :max="999999" :precision="2" placeholder="请输入"/>
                    <span class="unit">元</span>
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="样布大小" v-if="isShow()">
                    <a-radio-group v-decorator="['sampleType', {rules: [{ required: true, message: '请选择样布大小'} ],initialValue : this.prdinfo.sampleType}]" @change="changeSample">
                        <a-radio :value="0">
                            布
                            <a-form-item class="sample-input-box">
                                <a-input-number class="sample-input" :precision="1" :min="0.1" :max="999" v-decorator="['commoditySize', {rules: [{ required: sampleTypeVal == 0, message: '请输入样布尺寸' }],initialValue : this.prdinfo.sampleType == 0 ? this.prdinfo.commoditySize : ''} ]" placeholder="请输入" @blur="validateSize"/>CM
                            </a-form-item>
                            <a-form-item class="sample-input-box">
                                <a-input-number class="sample-input" :precision="1" :min="0.1" :max="999" v-decorator="['commodityWidth', {rules: [{ required: sampleTypeVal == 0, message: '请输入样布尺寸' }],initialValue : this.prdinfo.commodityWidth} ]" placeholder="通副" @blur="validateSize"/>CM
                            </a-form-item>
                        </a-radio>
                        <a-radio :value="1">
                            服装
                            <a-form-item class="sample-input-box">
                                <a-input-number v-decorator="['commodityNum', {rules: [{ required: sampleTypeVal == 1, message: '请输入件数' }],initialValue : this.prdinfo.sampleType == 1 ? this.prdinfo.commoditySize : ''} ]" :min="1" :max="999" :precision="0" placeholder="请输入" @blur="validateSize"/>
                                <span class="unit">件</span>
                            </a-form-item>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="平台货号">
                    <a-input v-decorator="['platformCode',{rules : [{pattern : /^[a-zA-Z0-9]{1,20}$/, message: '平台货号最多20位数字与字母组成'}],initialValue : this.prdinfo.platformCode}]" placeholder="请输入" style="width: 500px;"/>
                </a-form-item>
            <div class="big-border-title">服务文宣</div>
            <div class="editorbox">
                <a-form-item :validate-status="contentType" :help="contentHelp">
                    <quill-editor  
                        v-model="commodityDetail"
                        ref="myQuillEditor" 
                        :options="editorOption" @change="changeContent($event)">
                    </quill-editor>
                </a-form-item>
            </div>
            <div class="submitbtnbox"  v-if="checkPower()"><a-button type="primary" html-type="submit">发布</a-button></div>
        </a-form>
        <el-upload class="imgupload"
          accept="image/*"
          :action="GLOBAL.uploadUrl"
          :data="uploadData"
          :file-list = "fileList"
          :before-upload="GLOBAL.checkimg"
          :multiple="true"
          :on-success = "handleSuccess">
            <div class="ant-upload-text">上传图片</div>
        </el-upload>
        <submit-success-modal :visible.sync="visible" message="提交成功！" confirmText="查看" @confirm="handleOk()" @cancel="handleCancel()" ></submit-success-modal>
    </section>
</template>
<script>
import serviceStep from '../components/serviceStep'
import submitSuccessModal from '../components/submitSuccessModal'
import {addProduct,editProduct,getParentCategory,searchProduct} from '@/service/getData'
export default {
    data() {
        return {
            editid : this.$route.params.id,
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 21 },
            },
            categoryid : '',
            categoryVal : undefined,
            prdinfo : {},    //产品编辑时获取的信息
            sampleTypeVal : undefined,
            commodityDetail : "",
            contentType : "",
            contentHelp : "",
            contentRules : {rules: [{ required: true, message: '请输入服务文宣', trigger: 'blur' }]},
            uploadData : {'functionCode' : 3,'id' : this.$store.getters.getStoreId},
            quill : '',
            editorOption:{
                placeholder: '富文本编辑器，支持插入图片和链接',
                height : '280',
                modules:{
                    toolbar: {
                        container: [
                            [{ 'header': 1 }, { 'header': 2 }],[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }],   
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],[{ 'indent': '-1'}, { 'indent': '+1' }],
                            ['blockquote', 'code-block','link','image']
                        ],  // 工具栏
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    document.querySelector('.imgupload .ant-upload-text').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            visible : false,
        };
    },
    components: {
        serviceStep,submitSuccessModal
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
        if(this.categoryVal && this.categoryVal[0].commodityTypeName.indexOf('加印报告') == -1){
            this.form.getFieldDecorator('sampleType', { initialValue: 0, preserve: true });
        }
        this.form.getFieldDecorator('commodityDetail', { initialValue: "", preserve: true });
    },
    methods : {
        isShow(){
            if(this.categoryVal && this.categoryVal[0].commodityTypeName.indexOf('加印报告') !== -1){
                return false;
            }else{
                return true;
            }
        },
        changeSample(e){
            this.sampleTypeVal = e.target.value;
            this.validateSize();
        },
        validateSize(){
            this.$nextTick(() => {
                this.form.validateFields(['commoditySize'], { force: true });
                this.form.validateFields(['commodityWidth'], { force: true });
                this.form.validateFields(['commodityNum'], { force: true });
            });
        },
        changeContent(value){
            this.contentType = !value.html ? "error" : "";
            this.contentHelp = !value.html ? "请输入服务文宣" : "";
        },
        handleSuccess(res,file, fileList){
            // 如果上传成功
            if (res && res.code == 200) {
                let length = this.quill.getSelection().index;
                this.quill.insertEmbed(length, 'image', res.data[0].url,'user');
                this.quill.setSelection(length + 1)
            } else {
                this.$message.error('图片插入失败')
            }
        },
        handleSubmit  (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    // if(!this.commodityDetail){
                    //     this.contentType = "error";
                    //     this.contentHelp = "请输入服务文宣";
                    //     return false;
                    // }
                    values.commodityDetail = this.commodityDetail ? encodeURIComponent(this.commodityDetail) : '';
                    if(values.sampleType == 1){
                        values.commoditySize = values.commodityNum;
                        delete values.commodityNum;
                        delete values.commodityWidth;
                    }else{
                        delete values.commodityNum;
                    }
                    values.commodityTypeId = this.categoryid;
                    values.storeId = this.$store.getters.getStoreId;
                    values.status = 0;
                    if(this.editid){
                        values.id = this.editid;
                        editProduct(values).then((res) => {
                            if(res.code == 200){
                                this.visible = true;
                            }   
                        })
                    }else{
                        addProduct(values).then((res) => {
                            if(res.code == 200){
                                this.visible = true;
                            }   
                        })
                    }
                }
            });
        },
        handleOk(e) {
            this.$router.push('/serivceOnSale');
        },
        handleCancel(){
            this.$router.push('/publishSerivce');
        },
        //根据类目id获取类目名
        getCategoryByid(id){
            getParentCategory(id).then((res) => {
                if(res && res.code == 200){
                    this.categoryVal = res.data;
                }
            })
        }
    },
    mounted(){
        this.quill = this.$refs.myQuillEditor.quill;
        const form = this.form;
        if(this.editid){
            searchProduct(this.editid).then((res) => {
                if(res && res.code == 200){
                    this.prdinfo = res.data;
                    this.sampleTypeVal = res.data.sampleType;
                    this.commodityDetail = decodeURIComponent(res.data.commodityDetail);
                }
            })
        }
        this.categoryid = this.$route.params.categoryid;
        this.getCategoryByid(this.categoryid);
    }
};
</script>
<style type="text/css" scoped>
.unit{
    padding-left: 24px;
}
.sample-input-box{
    display: inline-block;
    margin: -10px 0 0 12px;
}
.sample-input{
    margin: 0 12px 0 0;
}
.submitbtnbox{
    text-align: center;
    margin-top: 64px;
}
.editorbox .quill-editor{
    height: 280px;
    margin-bottom: 60px;
}
.ant-radio-wrapper{
    margin-right: 124px;
}
.imgupload{
    display: none;
}
</style>