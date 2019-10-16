<template>
<section>
    <section v-if="certificateInfo.length == 0 && editid ">
        <noData />
    </section>
    <section v-else class="quality-content">
        <a-form :form="form" class="form-item-label-left">
            <section class="quality-item-box" v-for="(k, index) in form.getFieldValue('keys')" :key="k">

               <!--  <span v-if="checkshowinfo(k)">输入框只能查看----</span>
                <span v-else>输入框可编辑----</span>
                <span v-if="checkDelete(k,index)">可删除----</span>
                <span v-else>不可删除----</span>
                <span v-if="!checkNew(k)">isNew = 0  原有</span>
                <span v-else>isNew = 1  </span> -->


                <section class="quality-item-box-dis" :class="checkshowinfo(k) ? 'edit-form-box' : ''">
                    <div v-if="checkDelete(k,index)">
                        <a-popconfirm title="你确定删除此模块吗？" @confirm="() => remove(k)" v-if="form.getFieldValue('keys').length">
                            <a-icon slot="icon" type="exclamation-circle" theme="filled" style="color: red" />
                            <a href="#" class="dynamic-delete-button">删除</a>
                        </a-popconfirm>
                    </div>

                    <a-form-item  v-if="checkshowinfo(k)" v-bind="formItemLayout" :label="index == 0 ? 'CNAS' :(index == 1 ? 'CMA' : '证书电子版')" extra="格式支持.png\jpg\jepg\bmp\raw">
                        <div class="upload-img-box">
                            <img :src="certificateInfo[k].url" v-if="certificateInfo[k] && certificateInfo[k].url">
                            <!-- 不写一个隐藏的，信息展示再编辑form就没有值 -->
                            <a-input type="hidden" v-decorator="[`cerlist[${k}].fileHost.fileUrl`, imgRule(k) ]"/>
                        </div>
                    </a-form-item>
                    <a-form-item v-else v-bind="formItemLayout" :label="index == 0 ? 'CNAS' :(index == 1 ? 'CMA' : '证书电子版')" extra="格式支持.png\jpg\jepg\bmp\raw">
                        <div @click="handleClick(k)">
                            <a-upload
                                accept="image/*"
                                name="certificateimg"
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :action="GLOBAL.uploadUrl"
                                :data="uploadData"
                                :beforeUpload="GLOBAL.checkimg"
                                @change="uploadChange"
                                v-decorator="[`cerlist[${k}].fileHost.fileUrl`, imgRule(k) ]"
                              >
                                <img v-if="imglist[k] && imglist[k].img" :src="imglist[k].img"/>
                                <div v-else>
                                    <a-icon :type="imglist[k] && imglist[k].loading ? 'loading' : 'plus'"/>
                                    <div class="ant-upload-text">上传图片</div>
                                </div>
                            </a-upload>
                        </div>
                    </a-form-item>

                    <!-- 区分主副证书 证书类型-->
                    <a-form-item style="display: none;">
                        <a-input v-decorator="[`cerlist[${k}].certType`,{initialValue : index > 1 ? 1 : 0}]"/>
                    </a-form-item>

                    <!-- 审核成功后新增的证书isNew = 1  其他情况都是0 -->
                    <a-form-item style="display: none;">
                        <a-input v-decorator="[`cerlist[${k}].isNew`,{initialValue : checkNew(k)}]"/>
                    </a-form-item>


                    <!-- 证书名 -->
                    <a-form-item v-if="checkshowinfo(k)" v-bind="formItemLayout" label="证书名" extra="请输入证书名" :style="{'display' : (index > 1 ? 'block' : 'none')}">
                        <div>{{certificateInfo[k].certName}}</div>
                        <a-input type="hidden" v-decorator="[`cerlist[${k}].certName`, certNameRule(k) ]"/>
                    </a-form-item>
                    <a-form-item v-else v-bind="formItemLayout" label="证书名" extra="请输入证书名" :style="{'display' : (index > 1 ? 'block' : 'none')}">
                        <a-input v-decorator="[`cerlist[${k}].certName`, certNameRule(k) ]"  maxlength="100"/>
                    </a-form-item>

                    <!-- 证书编号 -->
                    <!-- 判断需分开，一个a-form-item不能有两个相同的v-decorator -->
                    <a-form-item v-if="checkshowinfo(k)" v-bind="formItemLayout" label="证书编号" extra="请输入证书编号">
                        {{certificateInfo[k].certCode}}
                        <!-- 不写一个隐藏的，信息展示再编辑form就没有值 -->
                        <a-input type="hidden" v-decorator="[`cerlist[${k}].certCode`, certCodeRule(k) ]"/>
                    </a-form-item>
                    <a-form-item v-else v-bind="formItemLayout" label="证书编号" extra="请输入证书编号">
                        <a-input v-decorator="[`cerlist[${k}].certCode`, certCodeRule(k) ]"/>
                    </a-form-item>
                    
                    <!-- 许可期限 -->
                    <a-form-item v-if="checkshowinfo(k)" v-bind="formItemLayout" label="许可期限" extra="请输入认可有效期限">
                        {{certificateInfo[k].startDate}} - {{certificateInfo[k].dueDate}}
                        <a-range-picker :getCalendarContainer="GLOBAL.getPopupContainer" style="display: none;" v-decorator="[`cerlist[${k}].permissionTime`, timeRule(k)]"/>
                    </a-form-item>
                    <a-form-item v-else v-bind="formItemLayout" label="许可期限" extra="请输入认可有效期限">
                        <a-range-picker :getCalendarContainer="GLOBAL.getPopupContainer" v-decorator="[`cerlist[${k}].permissionTime`, timeRule(k)]"/>
                    </a-form-item>

                </section>
            </section>
            <!-- 店铺资质查看页且可编辑且审核成功状态  首页资质认证且不是审核成功和审核中状态  才可新增-->
            <a-form-item v-if="(editid && qualityStatus == 1 && isEdit) || (!editid && qualityStatus !== 1 && qualityStatus !== 0)"> 
                <a-button type="primary" ghost @click="add">添加资质</a-button> 
            </a-form-item>

            <div class="submitbtnbox" v-if="checkPower()">
                <!-- 首页资质认证且不是审核成功和审核中状态 才有下一步按钮 -->
                <a-button v-if="!editid && qualityStatus !== 1 && qualityStatus !== 0" type="primary" @click="handleSubmit(1)">下一步</a-button>
                <!-- 店铺资质查看页且审核成功 才可修改，点击修改才可编辑 -->
                <div v-if="editid && qualityStatus == 1">
                    <div v-if="qualityId && qualityStatus == 1">
                        <a-button v-if="!isEdit" type="primary" ghost @click="isEdit = true">修改</a-button>
                        <a-button v-if="isEdit" type="primary" ghost @click="handleSubmit(2)">保存</a-button>
                    </div>
                </div>
            </div>
        </a-form>
    </section>
</section>
</template>

<script>
import noData from '../components/noData'
import moment from 'moment'
import {addCertificate,getCertificate} from '@/service/getData'
export default {
    name: 'qualityCertificate',
    props: ['showinfo'],
    data () {
        return {
            editid : this.showinfo,    //true代表从店铺资质信息那进入的
            orgId : this.$store.getters.getOrgId,
            qualityId : this.$store.getters.getOrgQuaId,  //资质认证整个流程走完生成的总ID
            qualityStatus : this.$store.getters.getQualityStatus,   //资质认证的状态 0待审核 1审核通过 2审核拒绝  空-未提交 只有审核通过才可编辑
            isEdit : false,    //店铺资质信息 修改编辑为true
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 8 },
            },
            keyid : undefined,
            uploadData : {'functionCode' : 1,'id' : this.$store.getters.getOrgId},
            imglist : [],   //图片展示数组
            currentuploadimg : '',   //当前上传图片是哪一个
            certificateInfo : '',   //获取到的资质认证信息
        }
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    components: {
        noData
    },
    created(){
        // 获取资质认证信息
        this.getCertificateInfo();
    },
    methods: {
        getCertificateInfo(){
            // 审核失败查询数据要为空，id传空
            let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
            getCertificate(this.orgId,qualityId).then((res) => {
                if(res && res.code == 200){
                    this.certificateInfo = res.data;
                    if(res.data.length == 0){
                        let len = 1;
                        this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
                        this.keyid = len;
                    }else{
                        let len = res.data.length;
                        let arr = [];
                        for(var i = 0; i < len;i++){
                            arr.push(i);
                            this.imglist[i] = {
                                path : res.data[i].fileHost.fileUrl,
                                img : res.data[i].url
                            }
                        }
                        this.form.getFieldDecorator('keys', { initialValue: arr, preserve: true });
                        this.keyid = len - 1;
                    }
                }
            })
        },
        certNameRule(index){
            let name = index == 0 ? 'CNAS' : (index == 1 ? 'CMA' : '');
            return {
                rules: [{ required: true, message: '请输入证书名' }],
                initialValue : this.certificateInfo[index] ? this.certificateInfo[index].certName : name
            }
        },
        certCodeRule(index){
            return {
                rules: [
                    { required: true, message: '请输入证书编号'},
                    { pattern: /^[a-zA-Z0-9]{1,50}$/, message: '请输入字母数字不超过50位'},
                ],
                initialValue : this.certificateInfo[index] ? this.certificateInfo[index].certCode : ''
            }
        },
        timeRule(index){
            return {
                rules: [{ type: 'array', required: true, message: '请输入认可有效期限' }],
                initialValue : this.certificateInfo[index] ? [moment(this.certificateInfo[index].startDate, 'YYYY-MM-DD'), moment(this.certificateInfo[index].dueDate, 'YYYY-MM-DD')] : []
            }
        },
        imgRule(index){
            return {
                rules: [{ required: true, message: '请选择图片' }],
                initialValue : this.certificateInfo[index] ? this.certificateInfo[index].fileHost.fileUrl : ''
            }
        },
        // 是否展示信息
        checkshowinfo(index){
            let qualityStatus = this.qualityStatus;
            if(!this.editid){    //首页
                //无状态初始信息，审核失败可编辑  审核中审核成功可查看
                return qualityStatus === 0 || qualityStatus === 1;    
            }else{          //店铺页
                if(qualityStatus == 1){
                    return this.certificateInfo && this.certificateInfo[index];
                }else{               //除了审核成功状态都只能查看
                    return true;      
                }
            }
        },
        // 是否可删除
        checkDelete(k,index){
            if(this.checkshowinfo(k)){
                return index > 1 && this.isEdit;    //店铺页 可编辑的时候，除了主干都可删除
            }else{
                return index > 1;
            }
        },
        // 查看是否是新增的，只有审核成功后修改新增的才算isNew=1
        checkNew(index){
            if(!this.editid){    //首页 ,可编辑的时候都是0
                return 0;
            }else{
                //非成功状态，店铺页只能查看
                if(this.qualityStatus == 1){
                    return this.certificateInfo && this.certificateInfo[index] ? (this.certificateInfo[index].isNew || 0) : 1;
                }
            }
        },

        handleClick(val){
            this.currentuploadimg = val;
        },
        uploadChange(info){
            this.imglist[this.currentuploadimg] = {};
            if (info.file.status === 'uploading') {
                this.imglist[this.currentuploadimg].loading = true;
                return
            }
            if (info.file.status === 'done') {
                if(info.file.response.code == 200){
                    this.imglist[this.currentuploadimg].loading = false;
                    this.imglist[this.currentuploadimg].img = info.file.response.data[0].url; 
                    this.imglist[this.currentuploadimg].path = info.file.response.data[0].path; 
                }
            }
        },
        // 新增资质
        add () {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++this.keyid);
            form.setFieldsValue({
                keys: nextKeys,
            });
        },
        //移除资质
        remove (k) {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        },
        //资质认证保存
        handleSubmit  (type) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let arr = [];
                    for(var j in values.keys){
                        let i = values.keys[j];
                        var obj = {
                            ...values.cerlist[i],
                            fileHost : {
                                fileUrl : this.imglist[i].path
                            },
                            startDate : values.cerlist[i].permissionTime[0].format('YYYY-MM-DD'),
                            dueDate : values.cerlist[i].permissionTime[1].format('YYYY-MM-DD'),
                        }
                        delete obj.permissionTime;
                        arr.push(obj);
                    }
                    let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
                    // console.log(arr);
                    // return false;
                    addCertificate(arr,this.orgId,qualityId).then((res) => {
                        if(res && res.code == 200){
                            this.saveNext(type);
                        }
                    })
                }
            });
        },
        saveNext(type){
            if(type == 1){
                this.$router.push('/approveFacility');
            }else if(type == 2){
                this.isEdit = false;
                this.editid = true;
                this.imglist= [];
                this.currentuploadimg = '';
                this.certificateInfo ='';
                this.getCertificateInfo();
            }
        },
        // 资质信息编辑，cnas cma不可编辑
        update(){
            this.isEdit = true;
        },
        getObjectURL(file){  
            var url=null   
            if(window.createObjectURL!=undefined){ // basic  
                url=window.createObjectURL(file)  
            }else if(window.URL!=undefined){ // mozilla(firefox)  
                url=window.URL.createObjectURL(file)  
            } else if(window.webkitURL!=undefined){ // webkit or chrome  
                url=window.webkitURL.createObjectURL(file)  
            }  
            return url  ;
        },
    },
    mounted(){
        
    },
}
</script>
<style scoped>
.ant-upload-select-picture-card i {
    font-size: 24px;
    color:rgba(0,0,0,0.45);
}
.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 12px;
    color:rgba(0,0,0,0.65);
}
.ant-form-item{
    margin-bottom: 14px;
}
.submitbtnbox{
    text-align: center;
    margin-top: 64px;
}
.quality-item-box{
    border-top: 8px solid #eee;
    padding-top: 32px;
    margin-left: -32px;
    margin-right: -32px;
}
.quality-item-box-dis{
    margin-left: 32px;
    position: relative;
}
.quality-content .quality-item-box:first-child{
    border-top: none;
    padding-top: 0px;
}
.dynamic-delete-button{
    position: absolute;
    right: 32px;
    top: -10px;
    color: rgba(0,0,0,0.45);
    z-index: 100;
}
</style>
