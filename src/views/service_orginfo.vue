<template>
<section>
    <div style="float: right; margin-top: -54px;" v-if="checkPower()">
        <a-button v-if="isEdit" type="primary" ghost @click="handleSubmit">提交机构介绍</a-button>
        <a-button v-else type="primary" ghost @click="update()">修改机构介绍</a-button>
    </div>
    <a-form :form="form" class="form-item-label-left ">
        <div class="borderbox organbox">
            <a-form-item v-bind="formItemLayout" label="联系方式">
                <a-input v-if="isEdit" v-decorator="['storePhone', {rules: [
                { required: true, message: '请输入联系方式' }
            ],initialValue : storeInfo.storePhone || ''} ]" placeholder="请输入"/>
                <div v-if="!isEdit">{{storeInfo.storePhone}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否支持加急">
                <a-radio-group v-if="isEdit" v-decorator="['isUrgent', {rules: [{ required: true, message: '请选择是否支持加急' }],initialValue : storeInfo.isUrgent || ''} ]" @change="handleChange">
                    <a-radio :value="'1'">
                        是
                        <a-form-item class="sample-input-box">
                            <a-input-number class="sample-input" :precision="1" :min="0" :max="200" placeholder="请输入" v-decorator="['urgentRate', {rules: [{ required: isurgent, message: '请输入' }],initialValue : isurgent == '1' ? storeInfo.urgentRate : ''} ]" />%
                        </a-form-item>
                    </a-radio>
                    <a-radio :value="'0'"> 否 </a-radio>
                </a-radio-group>
                <div v-if="!isEdit">
                    <span v-if="storeInfo.isUrgent == '1'">加急{{storeInfo.urgentRate}}%</span>
                    <span v-else="storeInfo.isUrgent == '0'">不加急</span>
                </div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="企业简介">
                <a-textarea v-if="isEdit" v-decorator="['storeIntroduce', {rules: [{ required: true, message: '请输入企业简介' }],initialValue : storeInfo.storeIntroduce || ''} ]" placeholder="请输入" :rows="4" maxlength="500"/>
                <div v-if="!isEdit">{{storeInfo.storeIntroduce}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="检测范围">
                <a-textarea v-if="isEdit" v-decorator="['storeDetectionScope', {rules: [{ required: true, message: '请输入检测范围' }],initialValue : storeInfo.storeDetectionScope || ''} ]" placeholder="请输入" :rows="4" maxlength="500"/>
                <div v-if="!isEdit">{{storeInfo.storeDetectionScope}}</div>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="详情" style="margin-bottom: 0;">
            </a-form-item>
        </div>
        <div class="editorbox">
            <quill-editor v-model="organContent" ref="myQuillEditor" :options="editorOption"> </quill-editor>
        </div>
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
</section>
</template>
<script>
import {editOrgInfo} from '../service/getData'
export default {
    data() {
        return {
            uploadData : {'functionCode' : 3,'id' : this.$store.getters.getStoreId},
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
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
            isurgent : this.$store.getters.getStoreInfo && this.$store.getters.getStoreInfo.storeInfo.isUrgent == '1' ? true : false,
            organContent : '',
            isEdit : true,
        };
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    computed : {
        storeInfo(){
            return this.$store.getters.getStoreInfo.storeInfo || {}
        }
    },
    mounted(){
        this.organContent = this.storeInfo.storeDetail ? decodeURIComponent(this.storeInfo.storeDetail) : '';
        this.isEdit = this.storeInfo.storeIntroduce ? false : true;
        this.quill = this.$refs.myQuillEditor.quill;
        if(!this.isEdit){
            this.quill.enable(false);
        }
    },
    methods:{
        update(){
            this.isEdit = true;
            this.quill.enable();
        },
        handleChange  (e) {
            this.isurgent = e.target.value == '1' ? true : false;
            this.$nextTick(() => {
                this.form.validateFields(['urgentRate'], { force: true });
            });
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
                    values.storeDetail = encodeURIComponent(this.organContent);
                    values.id = this.storeInfo.id;
                    editOrgInfo(values).then((res) => {
                        if(res && res.code == 200){
                            this.isEdit = false;
                            this.quill.enable(false);
                            this.$message.success("提交成功");
                            this.$emit('confirm',true);
                        }
                    })
                }
            });
        },
    }
};
</script>
<style type="text/css" scoped>
.borderbox{
    border:1px solid rgba(0,0,0,0.15);
}
.organbox{
    border-bottom: none;
    padding: 32px 32px 0 32px;
}
.sample-input-box{
    display: inline-block;
    margin: -10px 0 0 12px;
}
.sample-input{
    margin: 0 12px 0 0;
}
.user-item-box{
    border-bottom: 8px solid #eee;
    padding-left: 32px;
    margin-bottom: 32px;
}
.user-identify-box{
    padding-top: 32px;
}
.user-identify-box .ant-col-12:last-child .user-item-box,
.user-identify-box-even .ant-col-12:nth-last-child(2) .user-item-box{
    border-bottom: none;
    margin-bottom: 0;
}
.static-item{
    margin-bottom: 8px;
}

.facilitybox{
    padding: 32px;
}
.editorbox .quill-editor{
    height: 280px;
    margin-bottom: 60px;
}
.imgupload{
    display: none;
}
</style>