<template>
<section>
    <section class="content-white-box">
        <div class="big-border-title-status"><span v-if="fileinfo" :class="checkStatus[fileinfo.status].color">{{checkStatus[fileinfo.status].name}}</span></div>
        <div class="big-border-title">授权信息</div>
        <a-form  :form="form" class="form-item-label-left">
            <a-form-item v-bind="formItemLayout" label="确认授权" style="margin-bottom: 0;">
                <div class="tablebox">
                    <div class="table-cell" style="max-width: 320px;">
                        <!-- <iframe v-if="fileinfo && fileinfo.status !== 2" :src="fileinfo.url" id='iframebox' ref='pdfiframe' width='200' height="200" frameborder="0" scrolling="no"></iframe> -->
                        <div v-if="fileinfo && fileinfo.status !== 2">
                            <a-button type="primary" @click="showPdf(fileinfo.url)">查看授权书</a-button>
                        </div>
                        <div v-else>
                            <a-upload style="float: left"
                                accept=".pdf"
                                name="certificateimg"
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :action="GLOBAL.uploadUrl"
                                :data="uploadData"
                                :beforeUpload="GLOBAL.checkpdf"
                                @change="uploadChange"
                                v-decorator="['fileUrl', imgRule() ]"
                              >
                                <div>
                                    <a-icon :type="loading ? 'loading' : 'plus'"/>
                                    <div class="ant-upload-text">上传文件</div>
                                </div>
                            </a-upload>
                            <a-button v-if="fileUrl" type="primary" @click="showPdf(fileUrl)">查看授权书</a-button>
                            <!-- <iframe  v-if="fileUrl" :src="fileUrl" id='iframebox' width='200' height="200" frameborder="0" scrolling="no"></iframe> -->
                        </div>
                    </div>
                    <div class="table-cell">
                        <div class="mandate-box">
                            <div><a @click="download()" class="btn-link">点击下载《确认授权书》</a>模版，打印并填写信息，拍照或图片扫码上传</div>
                            <ul>
                                <li>·填写运营者姓名，身份证号，加盖与主体一致的公章</li>
                                <li>·无公章的个体工商户可加盖法人私章或法人签字</li>
                                <li>·图片格式支持：.PDF</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </a-form-item>
            <div class="submitbtnbox" v-if="!fileinfo || (fileinfo && fileinfo.status == 2)">
                <a-button v-if="checkPower()" type="primary" @click="handleSubmit">提交审核</a-button>
            </div>
        </a-form>
    </section>
    <a-modal v-model="pdfvisible" :footer="null" :width="600" centered>
        <iframe :src="pdfUrl" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
    </a-modal>
    <accountFormConfig />
    <mandateFormConfig />
    <serviceFormConfig />
</section>
</template>
<script>
import accountFormConfig from '../views/shopConfig_account'
import mandateFormConfig from '../views/shopConfig_mandate'
import serviceFormConfig from '../views/shopConfig_service'
import {getAuthorize , addAuthorize , downAuthorize} from '../service/getData'
import { checkStatus } from '../api/dictionary'
export default {
    data() {
        return {
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 21 },
            },
            uploadData : {'functionCode' : 3,'id' : this.$store.getters.getStoreId},
            loading : false,
            fileUrl : '',      //上传图片存储路径 
            filePath : '',     //上传图片存储的path
            fileinfo : '',    //获取授权书信息
            checkStatus : checkStatus,
            pdfvisible : false,
            pdfUrl : '',
        };
    },
    components: {
        accountFormConfig,mandateFormConfig,serviceFormConfig
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods:{
        imgRule(index){
            return {
                rules: [{ required: true, message: '请选择文件' }],
                initialValue : this.filePath
            }
        },
        uploadChange(info){
            if (info.file.status === 'uploading') {
                this.loading = true;
                return
            }
            if (info.file.status === 'done') {
                if(info.file.response.code == 200){
                    this.loading = false;
                    this.fileUrl = info.file.response.data[0].url; 
                    this.filePath = info.file.response.data[0].path; 
                }
            }
        },
        getauth(){
            getAuthorize(this.$store.getters.getStoreId).then((res) => {
                if(res &&res.code == 200){
                    this.fileinfo = res.data || '';
                    this.fileUrl = this.fileinfo ? this.fileinfo.url : ''; 
                    this.filePath = this.fileinfo && this.fileinfo.fileHost ? this.fileinfo.fileHost.fileUrl : ''; 
                }
            })
        },
        handleSubmit(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    addAuthorize(this.filePath,this.$store.getters.getStoreId).then((res) => {
                        if(res && res.code == 200){
                            this.getauth();
                        }
                    })
                }
            });
        },
        // 下载授权书模板
        download(){
            let url = downAuthorize()+'?token='+this.$store.getters.getToken+'&storeId='+this.$store.getters.getStoreId;
            window.open(url);
        },
        showPdf(url){
            this.pdfvisible = true;
            this.pdfUrl = url;
        }
    },
    mounted(){
        this.getauth();
    }
};
</script>
<style type="text/css" scoped>
.ant-upload-select-picture-card i {
    font-size: 24px;
    color:rgba(0,0,0,0.45);
}
.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 12px;
    color:rgba(0,0,0,0.65);
}
.mandate-box{
    line-height: 1;
    color:rgba(0,0,0,0.45);
    padding-left: 32px;
    margin-top: -8px;
}
.mandate-box li{
    padding-top: 12px;
}
.submitbtnbox{
    text-align: center;
    margin-top: 64px;
}
</style>