<template>
    <section class="content-white-box">
        <section class="centerInfoBox">
            <div class="tablebox">
                <div class="table-cell center-imgbox">
                    <div class="center-img">
                        <div v-if="checkPower()">
                        <a-upload class="mainimg"
                            accept="image/*"
                            name="certificateimg"
                            listType="picture-card"
                            :showUploadList="false"
                            :action="GLOBAL.uploadUrl"
                            :data="imguploadData"
                            :beforeUpload="beforeUpload"
                            @change="uploadChange"
                          >
                            <img  v-if="mainpic" :src="mainpic" alt="" style="max-height: 100%;">
                            <div v-else>
                                <a-icon :type="imgloading ? 'loading' : 'cloud-upload'"/>
                                <div class="ant-upload-text" style="color: #4A90E2">上传店铺主图</div>
                            </div>
                        </a-upload>
                        </div>
                        <div v-else>
                            <div class="upload-img-box" style="width: 146px; height: 146px; margin: 0;">
                                <img :src="mainpic" style="padding: 8px;">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-cell">
                    <div class="status-list">
                        <span class="test-title">{{title}}</span>
                        <a-tag :color="item.color" v-for="(item,key) in status_list" :key="key">
                            <span :class="item.icon"></span>{{item.title}}
                        </a-tag>
                    </div>
                    <div class="manageinfo">管理权限：{{$store.getters.getPowerName}}</div>
                    <!-- 没有填完资质认证信息，或者填完资质认证信息却审核失败才可操作 -->
                    <div v-if="checkPower()">
                        <div v-if="!this.$store.getters.getOrgQuaId || (this.$store.getters.getOrgQuaId && this.$store.getters.getQualityStatus == 2)">
                            <router-link to="/approveQuality"><a-button type="primary">资质提交</a-button></router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section v-if="companyInfo.sysStatus == 0">
            <div class="cashtitle">保证金提交</div>
            <div class="cashDepositbox">
                <div class="cashstatus">
                    <span v-if="companyInfo.id && companyInfo.status !== null" :class="checkStatus[companyInfo.status].color">{{checkStatus[companyInfo.status].name}}</span>
                    <span v-else class="red">未提交</span>
                </div>  
                <a-form  :form="form">
                    <a-form-item v-bind="formItemLayout" label="公司账号" class="margin0 companytitle">
                        <div>{{companyInfo.companyAccount}}</div>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="开户银行" class="margin0">
                        <div>{{companyInfo.bankName}}</div>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="开户名" class="margin0">
                        <div>{{companyInfo.accountName}}</div>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="金额" class="margin0">
                        <div><span class="price">{{companyInfo.amount}}</span><span v-if="companyInfo.amount">RMB</span></div>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="打款时间">
                        <div v-if="companyInfo.id && !editCash">{{companyInfo.paymentTime}}</div>
                        <a-date-picker v-else :getCalendarContainer="GLOBAL.getPopupContainer" v-decorator="['paymentTime', timeRule() ]" placeholder="请输入"/>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="上传凭证">
                        <div class="tablebox">
                            <div class="table-cell">
                                <div v-if="companyInfo.id && !editCash" class="upload-img-box">
                                    <img :src="companyInfo.url">
                                    <a-input type="hidden" v-decorator="['imgurl',{
                                        rules: [{ required: true, message: '请选择图片' }],
                                        initialValue : companyInfo.url
                                    } ]"/>
                                </div>
                                <a-upload v-else
                                    accept="image/*"
                                    name="cashdepositimg"
                                    listType="picture-card"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    :action="GLOBAL.uploadUrl"
                                    :data="uploadData"
                                    :beforeUpload="GLOBAL.checkimg"
                                    @change="handleChange"
                                    v-decorator="['imgurl1',{
                                        rules: [{ required: true, message: '请选择图片' }],
                                        initialValue : companyInfo.fileHost ? companyInfo.fileHost.fileUrl : ''
                                    } ]"
                                  >
                                    <img v-if="cashImg && cashImg.url" :src="cashImg.url"/>
                                    <div v-else>
                                        <a-icon :type="loading ? 'loading' : 'plus'"/>
                                        <div class="ant-upload-text">上传图片</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="table-cell">
                                <div>上传凭证：上传保证金打款凭证照片</div>
                                <div>格式支持.png\jpg\jepg\bmp\raw</div>
                            </div>
                        </div>
                    </a-form-item>
                    <!-- <a-form-item v-bind="{wrapperCol: { span: 12,offset : 1 }}" label="">
                        <a-checkbox v-if="companyInfo.id && !editCash" checked>《保证金协议》</a-checkbox>
                        <a-checkbox v-else @change="changeCheck" :checked="ischecked">《保证金协议》</a-checkbox>
                        <a-input type="hidden" v-decorator="['ischecked',{rules: [{ required: true, message: '请勾选保证金协议' }],initialValue : companyInfo.status == 2 ? true : undefined}]"/>
                    </a-form-item> -->
                    <a-form-item v-bind="{wrapperCol: { span: 12,offset : 1 }}" label="" v-if="companyInfo && companyInfo.status == 2">
                        <div><span class="red">失败原因：</span>{{companyInfo.failureReason}}</div>
                    </a-form-item>
                    <div class="text-right submitbtn" v-if="checkPower()">
                        <a-button v-if="!companyInfo.id" type="primary" @click="submit()">提交</a-button>
                        <div v-if="companyInfo.status == 2">
                            <a-button v-if="!editCash" type="primary" ghost @click="update()">修改</a-button>
                            <a-button v-if="editCash" type="primary" @click="submit()">确定</a-button>
                        </div>
                    </div>
                </a-form>
            </div>  
        </section>
    </section>
</template>

<script>
import {getHomeInfo, getStoreMainpic, addStoreMainpic, getCashDeposit , addCashDeposit , editCashDeposit} from '../service/getData'
import { checkStatus } from '../api/dictionary'
import moment from 'moment'
export default {
    name: 'Home',
    data () {
        return {
            storeid : this.$store.getters.getStoreId,
            orgid : this.$store.getters.getOrgId,
            title : "",
            status_list : {       //企业认证，资质审核，保证金状态
                'orgAuth' : {'color' : '', 'title' : '企业认证', 'icon' : 'icon-status1', },
                'qualification' : {'color' : '', 'title' : '资质审核', 'icon' : 'icon-status4', },
                'cashDeposit' : {'color' : '', 'title' : '保证金', 'icon' : 'icon-status5', },
            },
            colorobj : { 0 : 'blue', 1 : 'green' , 2 : 'red'},
            mainpic : '',    //主图
            imguploadData : {'functionCode' : 3,'id' : this.$store.getters.getStoreId},
            imgloading : false,
            checkStatus : checkStatus,
            formItemLayout: {          
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
            companyInfo : '',    //保证金信息
            cashImg : {},    //保证金图
            ischecked : false,
            loading: false,
            imageUrl: '',
            uploadData : {'functionCode' : 3,'id' : this.$store.getters.getStoreId},
            editCash : false,
        }
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods: {
        // 获取所有状态信息
        getAllStatus(){
            getHomeInfo(this.orgid,this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.title = res.data.storeInfo.storeName;
                    // 企业认证状态
                    if(res.data.orgAuth){
                        let astatus = res.data.orgAuth.status;
                        let authobj = {0 : '认证中',1 : '认证', 2 : '认证'};
                        this.status_list.orgAuth.title = authobj[astatus] ? authobj[astatus] : '企业认证';
                        this.status_list.orgAuth.color = this.colorobj[astatus] ? this.colorobj[astatus] : '';
                        this.status_list.cashDeposit.icon = astatus == 0 ? 'icon-status3' : 'icon-status1';
                    }else{
                        this.status_list.orgAuth = {'color' : '', 'title' : '企业认证', 'icon' : 'icon-status1' };
                    }
                    // 资质审核状态
                    if(res.data.orgQualification){
                        let qstatus = res.data.orgQualification.status;
                        let quaobj = {0 : '审核中',1 : '资质', 2 : '资质'}
                        this.status_list.qualification.title = quaobj[qstatus] ? quaobj[qstatus] : '资质审核';
                        this.status_list.qualification.color = this.colorobj[qstatus] ? this.colorobj[qstatus] : '';
                        this.status_list.cashDeposit.icon = qstatus == 0 ? 'icon-status7' : 'icon-status4';
                        this.$store.dispatch('saveOrgQualificationId',res.data.orgQualification.id);   //保存资质审核总id
                        this.$store.dispatch('saveQualityStatus',res.data.orgQualification.status);
                    }else{
                        this.status_list.qualification = {'color' : '', 'title' : '资质审核', 'icon' : 'icon-status4', };
                        this.$store.dispatch('saveOrgQualificationId','');
                        this.$store.dispatch('saveQualityStatus','');
                    }
                    // 保证金状态
                    if(res.data.storeMargin){
                        this.status_list.cashDeposit.color = this.colorobj[res.data.storeMargin.status] ? this.colorobj[res.data.storeMargin.status] : '';
                        this.status_list.cashDeposit.title = res.data.storeMargin.status == 0 ? '提交中' : '保证金';
                        this.status_list.cashDeposit.icon = res.data.storeMargin.status == 0 ? 'icon-status6' : 'icon-status2';
                    }else{
                        this.status_list.cashDeposit = {'color' : '', 'title' : '保证金', 'icon' : 'icon-status5', };
                    }
                }
            })
        },
        // 获取主图信息
        getMainImg(){
            getStoreMainpic(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.mainpic = res.data;
                }
            })
        },
        beforeUpload(file){
            return new Promise((resolve, reject) => {
                const isJPEG = file.type === 'image/jpeg';
                const isJPG = file.type === 'image/jpg';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isRAW = file.type === 'image/raw';
                // const isPDF = file.type === 'application/pdf';
                const isPic = isJPG || isJPEG || isPNG || isBMP || isRAW;
                if (!isPic) {
                    Vue.prototype.$message.error('支持图片格式.png.jpg.jepg.bmp.raw');
                    return reject(false)
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image = new Image();
                    image.onload=function(){
                        var squareW = 800,//定义画布大小,也就是图片压缩之后的像素
                            squareH = 800,
                            canvas = document.createElement('canvas'),
                            context = canvas.getContext('2d'),
                            data = '';
                            canvas.width = squareW;
                            canvas.height = squareH;
                            // 铺底色
                            context.clearRect(0,0,squareW,squareH);
                            context.fillStyle = "#fff";
                            context.fillRect(0,0,squareW,squareH);
                        if (this.width !== this.height || this.width < squareW || this.height < squareH){
                            Vue.prototype.$message.error('图片尺寸必须是800x800像素以上的正方形');
                            return reject(false);
                        }
                        const isLt2M = file.size / 1024 / 1024 < 2
                        if (!isLt2M) {
                            context.drawImage(this,0,0,squareW,squareH);
                            data = canvas.toDataURL('image/jpeg');
                            var initSize = file.size;
                            var arr = data.split(',');
                            var mime = arr[0].match(/:(.*?);/)[1];
                            var bstr = atob(arr[1]);
                            var n = bstr.length;
                            var u8arr = new Uint8Array(n);
                            while(n--){
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return resolve(new File([u8arr],file.name, {type:mime}));
                        }else{
                            return resolve(true);
                        }
                    };
                    image.src= e.target.result;
                };
                reader.readAsDataURL(file);
            });
        },
        // 上传主图
        uploadChange(info){
            if (info.file.status === 'uploading') {
                this.imgloading = true;
                return
            }
            if (info.file.status === 'done') {
                if(info.file.response.code == 200){
                    this.imgloading = false;
                    // this.mainpic = info.file.response.data[0].url; 
                    let path = info.file.response.data[0].path; 
                    addStoreMainpic(path,this.storeid).then((res) => {
                        if(res && res.code == 200){
                            this.getMainImg();
                        }   
                    })
                }
            }
        },
        timeRule(){
            return {
                rules: [{ required: true, message: '请选择打款时间' }],
                initialValue : this.companyInfo.paymentTime && moment(this.companyInfo.paymentTime, 'YYYY-MM-DD')
            }
        },
        // 获取保证金
        getEntrustMoney(){
            getCashDeposit(this.storeid).then((res) => {
                if(res && res.code == 200){
                    this.companyInfo = res.data || {};
                    if(res.data.id){
                        this.editCash = false;
                        this.cashImg = {
                            path : res.data.fileHost.fileUrl,
                            url : res.data.url,
                        }
                    }else{
                        this.editCash = true;
                    }
                }
            })
        },
        handleChange (info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return
            }
            if (info.file.status === 'done') {
                if(info.file.response.code == 200){
                    this.loading = false;
                    this.cashImg = info.file.response.data[0]; 
                }
            }
        },
        // changeCheck(e){
        //     this.ischecked = e.target.checked;
        //     this.form.setFieldsValue({'ischecked' : e.target.checked ? true : undefined});
        // },
        update(){
            this.editCash = true;
            this.ischecked = true;
        },
        submit(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    let time = values.paymentTime.format('YYYY-MM-DD');
                    let obj = {
                        companyAccount : this.companyInfo.companyAccoun,
                        bankName : this.companyInfo.bankName,
                        accountName : this.companyInfo.accountName,
                        amount : this.companyInfo.amount,
                        paymentTime : time,
                        fileHost : {
                            fileUrl : this.cashImg.path
                        },
                        storeId : this.storeid
                    }
                    if(this.companyInfo.id){
                        obj.id = this.companyInfo.id;
                        editCashDeposit(obj).then((res) => {
                            if(res && res.code == 200){
                                this.getEntrustMoney();
                                this.getAllStatus();
                            }
                        })
                    }else{
                        addCashDeposit(obj).then((res) => {
                            if(res && res.code == 200){
                                this.getEntrustMoney();
                                this.getAllStatus();
                            }
                        })
                    }
                }
            });
        }
    },
    mounted(){
        this.getAllStatus();
        this.getEntrustMoney();
        this.getMainImg();
    }
}
</script>
<style scoped>
.centerInfoBox{
    background: #FAFAFA;
    padding: 40px 32px;
    margin-bottom: 42px;
}
.status-list{
    line-height: 1;
}
.status-list .test-title{
    font-size:34px;
    font-weight:800;
    color: #000;
    padding-right: 30px;
    vertical-align: middle;
}
.status-list .ant-tag{
    padding: 0px 20px;
    line-height: 24px;
    height: 24px;
    background: transparent;
}
.status-list .ant-tag span{
    font-size: 14px;
    padding-right: 2px;
    vertical-align: text-bottom;
}
.center-imgbox{
    padding-right: 20px;
    width: 176px;
}
.mainimg{
    display: inline-block;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
}
.center-img >>> .ant-upload{
    width: 146px!important;
    height: 146px!important;
}
.manageinfo{
    font-size:24px;
    color: #333;
    padding: 30px 0 24px 0;
    line-height: 1;
}
.cashtitle{
    font-size:20px;
    color: rgba(0,0,0,0.65);
    font-weight: 500;
}
.cashDepositbox{
    border: 1px solid #DBDBDB;
    padding: 32px 42px 42px 20px;
    position: relative;
}
.cashstatus{
    position: absolute;
    right: 42px;
}
.companytitle >>> *{
    font-size:16px;
    font-weight: 500;
    color: rgba(0,0,0,0.65);
}
.companytitle >>> label{
    padding-left: 15px;
    border-left: 2px solid #044FE8;
}
.anticon-cloud-upload{
    color : #0450E8!important;
}
.price{
    color: #E6242E;
    font-size: 16px;
    font-weight: 500;
    padding-right: 14px;
}
.upload-img-box{
    margin-right: 10px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.submitbtn{
    margin-top: 164px;
}
.statusname{
    font-weight: normal;
    font-size: 14px;
}
.margin0{
    margin-bottom: 0;
}
.mainimg img{
    max-width: none;
}
</style>
