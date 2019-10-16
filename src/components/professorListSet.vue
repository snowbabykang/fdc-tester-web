<template>
<section>
    <section v-if="professorList.length == 0 && editid ">
        <noData />
    </section>
    <section v-else>
        <a-form :form="form" class="form-item-label-left user-identify-box" :class="form.getFieldValue('keys').length%2 == 0 ? 'user-identify-box-even' : ''">
            <a-row>
                <a-col :span="12">
                    <section class="user-item-box">
                        <a-form-item v-bind="formItemLayout2" label="权威人数" required>
                            <a-input-number placeholder="请输入" v-model="form.getFieldValue('keys').length" disabled style="margin-right: 24px;"/>人
                        </a-form-item>
                    </section>
                </a-col>
            </a-row>
            <a-row type="flex">
                <a-col :span="12" style="padding-bottom: 32px;"  v-for="(k, index) in form.getFieldValue('keys')" :key="k">
                    <section class="user-item-box" :class="checkshowinfo(k) ? 'edit-form-box' : ''">
                        <div v-if="checkDelete(k,index)">
                            <a-popconfirm title="你确定删除此模块吗？" @confirm="() => remove(k)" v-if="form.getFieldValue('keys').length">
                                <a-icon slot="icon" type="exclamation-circle" theme="filled" style="color: red" />
                                <a href="#" class="dynamic-delete-button">删除</a>
                            </a-popconfirm>
                        </div>

                        <!-- <span v-if="checkshowinfo(k)">输入框只能查看----</span>
                        <span v-else>输入框可编辑----</span>
                        <span v-if="checkDelete(k,index)">可删除----</span>
                        <span v-else>不可删除----</span>
                        <span v-if="!checkNew(k)">isNew = 0  原有</span>
                        <span v-else>isNew = 1  </span> -->
    
                        <!-- 审核成功后新增的专家isNew = 1  其他情况都是0 -->
                        <a-form-item style="display: none;">
                            <a-input v-decorator="[`userlist[${k}].isNew`,{initialValue : checkNew(k)}]"/>
                        </a-form-item>
                        <!-- 判断需分开，一个a-form-item不能有两个相同的v-decorator -->
                        <!-- 姓名 -->
                        <a-form-item v-bind="formItemLayout2" label="姓名">
                            <div v-if="checkshowinfo(k)">
                                {{professorList[k] ? professorList[k].professorName : ''}}
                                <!-- 不写一个隐藏的，信息展示再编辑form就没有值 -->
                                <a-input type="hidden" v-decorator="[`userlist[${k}].professorName`, usernameRule(k) ]"/>
                            </div>
                            <a-input v-else v-decorator="[`userlist[${k}].professorName`, usernameRule(k) ]" placeholder="请输入" maxlength="50"/>
                        </a-form-item>

                        <!-- 身份证号 -->
                        <a-form-item v-if="checkshowinfo(k)" v-bind="formItemLayout2" label="身份证号">
                            {{professorList[k] ? professorList[k].card : ''}}
                            <a-input type="hidden" v-decorator="[`userlist[${k}].card`, idcardRule(k) ]" placeholder="请输入"/>
                        </a-form-item>
                        <a-form-item v-else v-bind="formItemLayout2" label="身份证号">
                            <a-input v-decorator="[`userlist[${k}].card`, idcardRule(k) ]" placeholder="请输入"/>
                        </a-form-item>


                        <a-form-item v-bind="formItemLayout2" label="资质名称">
                            <div v-if="checkshowinfo(k)"> 
                                {{professorList[k] ? professorList[k].qualificationName : ''}} 
                                <a-input type="hidden" v-decorator="[`userlist[${k}].qualificationName`, qualitynameRule(k) ]" placeholder="请输入" maxlength="100"/>
                            </div>
                            <a-input v-else v-decorator="[`userlist[${k}].qualificationName`, qualitynameRule(k) ]" placeholder="请输入"/>
                        </a-form-item>

                        <a-form-item v-bind="formItemLayout2" label="证书编码">
                            <div v-if="checkshowinfo(k)"> 
                                {{professorList[k] ? professorList[k].certCode : ''}} 
                                <a-input type="hidden" v-decorator="[`userlist[${k}].certCode`, certificatecodeRule(k) ]" placeholder="请输入"/>
                            </div>
                            <a-input v-else v-decorator="[`userlist[${k}].certCode`, certificatecodeRule(k) ]" placeholder="请输入"/>
                        </a-form-item>

                        <a-form-item v-bind="formItemLayout2" label="证书" extra="格式支持.png\jpg\jepg\bmp\raw">
                            <div @click="handleClick(k)">
                                <div v-if="checkshowinfo(k)">
                                    <div class="previewImgList" v-if="professorList[k]">
                                        <div class="previewImgbox" @click="handlePreview(professorList[k])">
                                            <div class="imgbox"><img :src="professorList[k].url"></div>
                                            <div class="showbigbtn">查看大图</div>
                                        </div>  
                                    </div>
                                    <a-input type="hidden" v-decorator="[`userlist[${k}].fileHost.fileUrl`, imgRule(k) ]"/>
                                </div>
                                <a-upload v-else
                                    accept="image/*"
                                    name="certificateimg"
                                    listType="picture-card"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    :action="GLOBAL.uploadUrl"
                                    :data="uploadData"
                                    :beforeUpload="GLOBAL.checkimg"
                                    @change="uploadChange"
                                    v-decorator="[`userlist[${k}].fileHost.fileUrl`, imgRule(k) ]"
                                  >
                                    <img v-if="imglist[k] && imglist[k].img" :src="imglist[k].img"/>
                                    <div v-else>
                                        <a-icon :type="imglist[k] && imglist[k].loading ? 'loading' : 'plus'"/>
                                        <div class="ant-upload-text">上传图片</div>
                                    </div>
                                </a-upload>
                            </div>
                        </a-form-item>
                    </section>
                </a-col>
            </a-row>
            <a-form-item class="addbtnbox" v-if="(editid && qualityStatus == 1 && isEdit) || (!editid && qualityStatus !== 1 && qualityStatus !== 0)"> 
                <a-button type="primary" ghost @click="add">新增</a-button> 
            </a-form-item>
            <div class="submitbtnbox" :class="editid ? 'editbox' : ''" v-if="checkPower()">
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
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>
    </section>
</section>
</template>

<script>
import {validateIDcard} from '../api/validateForm.js'
import noData from '../components/noData'
import {getProfessorList , addProfessor} from '../service/getData'
export default {
    name: 'professorListSet',
    props: ['showinfo'],
    data () {
        return {
            editid : this.showinfo, 
            orgId : this.$store.getters.getOrgId,
            qualityId : this.$store.getters.getOrgQuaId,  //资质认证整个流程走完生成的总ID
            qualityStatus : this.$store.getters.getQualityStatus,   //资质认证的状态 0待审核 1审核通过 2审核拒绝  空-未提交 
            isEdit : false,     //是否可修改
            formItemLayout2: {
                labelCol: { span: 6 },
                wrapperCol: { span: 12 },
            },
            uploadData : {'functionCode' : 1,'id' : this.$store.getters.getOrgId},
            professorList : '',   //专家资质认证列表
            imglist : [],   
            currentuploadimg : '',   //当前上传图片是哪一个
            keyid : undefined,
            previewVisible: false,
            previewImage: '',
        }
    },
    components: {
        noData
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
        this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
    },
    created(){
        // 获取资质认证信息
        this.getProfessorInfo();
    },
    methods: {
        getProfessorInfo(){
            // 审核失败查询数据要为空，id传空
            let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
            getProfessorList(this.orgId,qualityId).then((res) => {
                if(res && res.code == 200){
                    this.professorList = res.data;
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
        usernameRule(index){
            return  {
                rules: [{ required: true, message: '请输入姓名' }],
                initialValue : this.professorList[index] ? this.professorList[index].professorName : ''
            }
        },
        idcardRule(index){
            return  {
                rules: this.editid ? [{ required: true, message: '请输入身份证号' }] : [{ required: true, message: '请输入身份证号' }, { validator: this.validateIDcardRule }],
                initialValue : this.professorList[index] ? this.professorList[index].card : ''
            }
        },
        qualitynameRule(index){
            return  {
                rules: [{ required: true, message: '请输入资质名称' }],
                initialValue : this.professorList[index] ? this.professorList[index].qualificationName : ''
            }
        },
        certificatecodeRule(index){
            return {
                rules: [{ required: true, message: '请输入证书编码' },
                { pattern: /^[a-zA-Z0-9]{1,50}$/, message: '请输入字母数字不超过50位'}],
                initialValue : this.professorList[index] ? this.professorList[index].certCode : ''
            }
        },
        imgRule(index){
            return {
                rules: [{ required: true, message: '请选择图片' }],
                initialValue : this.professorList[index] ? this.professorList[index].fileHost.fileUrl : ''
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
                    return this.professorList && this.professorList[index];
                }else{               //除了审核成功状态都只能查看
                    return true;      
                }
            }
        },
        // 是否可删除
        checkDelete(k,index){
            if(this.checkshowinfo(k)){
                return index > 0 && this.isEdit;    //店铺页 可编辑的时候，除了主干都可删除
            }else{
                return index > 0;
            }
        },
        // 查看是否是新增的，只有审核成功后修改新增的才算isNew=1
        checkNew(index){
            if(!this.editid){    //首页 ,可编辑的时候都是0
                return 0;
            }else{
                //非成功状态，店铺页只能查看
                if(this.qualityStatus == 1){
                    return this.professorList && this.professorList[index] ? (this.professorList[index].isNew || 0) : 1;
                }
            }
        },
        handleClick(val){
            this.currentuploadimg = val;
        },
        handleCancel () {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
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
        // 新增人数
        add () {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++this.keyid);
            form.setFieldsValue({
                keys: nextKeys,
            });
        },
        //移除人数
        remove (k) {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        },
        // 验证身份证
        validateIDcardRule (rule, value, callback) {
            const form = this.form;
            if (value) {
                let msg = validateIDcard(value);
                if(msg){
                    callback(msg);
                }else{
                    callback();
                }
            }
            callback();
        },
        update(){
            this.isEdit = true;
        },
        handleSubmit  (type) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let arr = [];
                    for(var j in values.keys){
                        let i = values.keys[j];
                        var obj = {
                            ...values.userlist[i],
                            fileHost : {
                                fileUrl : this.imglist[i].path
                            },
                        }
                        arr.push(obj);
                    }
                    // console.log(arr);
                    // return false;
                    let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
                    addProfessor(arr,this.orgId,qualityId).then((res) => {
                        if(res && res.code == 200){
                            this.saveNext(type);
                        }
                    })
                }
            });
        },
        saveNext(type){
            if(type == 1){
                this.$emit('confirm');
            }else if(type == 2){
                this.isEdit = false;
                this.imglist= [];
                this.currentuploadimg = '';
                this.professorList ='';
                this.getProfessorInfo();
            }
        },
    },
}
</script>
<style scoped>
.submitbtnbox{
    text-align: center;
    margin-top: 64px;
}
.ant-upload-select-picture-card i {
    font-size: 24px;
    color:rgba(0,0,0,0.45);
}
.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 12px;
    color:rgba(0,0,0,0.65);
}
.user-identify-box{
    margin-left: -32px;
    margin-right: -32px;
}
.user-item-box{
    padding-bottom: 8px;
    position: relative;
    border-bottom: 8px solid #eee;
    padding-left: 32px;
    /*margin-bottom: 32px;*/
    height: 100%;
}

.user-identify-box .ant-col-12:last-child .user-item-box,
.user-identify-box-even .ant-col-12:nth-last-child(2) .user-item-box{
    border-bottom: none;
    margin-bottom: 0;
}
.addbtnbox{
    padding-left: 32px;
}
.dynamic-delete-button{
    position: absolute;
    right: 80px;
    top: -20px;
    color: rgba(0,0,0,0.45);
    z-index: 100;
}
</style>

