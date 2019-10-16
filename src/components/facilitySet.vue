<template>
<section>
    <section v-if="!facilityInfo.id && editid ">
        <noData />
    </section>
    <section v-else>
        <a-form :form="form" class="form-item-label-left" :class="checkshowinfo() ? 'edit-form-box' : ''">
            <a-form-item v-bind="formItemLayout" label="可检测项目" extra="每个项目名以“、”顿号隔开">
                <div v-if="checkshowinfo()">{{facilityInfo.delecteItem}}</div>
                <a-textarea v-else maxlength="500" :rows="4" v-decorator="['delecteItem', {
                    rules: [{ required: true, message: '请输入可检测项目' }],
                    initialValue : facilityInfo.delecteItem
                } ]"/>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="主要设备名称" extra="每个设备名以“、”顿号相隔">
                <div v-if="checkshowinfo()">{{facilityInfo.equipName}}</div>
                <a-textarea v-else maxlength="500" :rows="6" v-decorator="['equipName', {
                    rules: [{ required: true, message: '请输入主要设备名称' }],
                    initialValue : facilityInfo.equipName
                }]"/>
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel" label="" extra="格式支持.png\jpg\jepg\bmp\raw">
                <div v-if="checkshowinfo()">
                    <div class="previewImgList" v-if="facilityInfo.fileHostShowDtos">
                        <div class="previewImgbox" @click="handlePreview(item)" v-for="(item ,index) in facilityInfo.fileHostShowDtos" :key="index">
                            <div class="imgbox"><img :src="item.url"></div>
                            <div class="showbigbtn">查看大图</div>
                        </div>  
                    </div>
                </div>
                <el-upload  v-else
                    accept="image/*"
                  :action="GLOBAL.uploadUrl"
                  :data="uploadData"
                  :file-list = "fileList"
                  :before-upload="GLOBAL.checkimg"
                  :multiple="true"
                  list-type="picture-card"
                  :on-change = "handleChange"
                  :on-remove="handleRemove"
                  :on-preview="handlePreview"
                  v-decorator="['imgurl', imgRules ]">
                    <div v-if="fileList.length < 20">
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                </el-upload>
                <!-- 预览 -->
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="" style="width: 100%" :src="previewImage" />
                </a-modal>
            </a-form-item>
            <div class="submitbtnbox" :class="editid ? 'editbox' : ''" v-if="checkPower()">
                <!-- 首页资质认证且不是审核成功和审核中状态 才有下一步按钮 -->
                <!-- 店铺页可以新增，删除不可编辑 -->
                <a-button v-if="!checkshowinfo()" type="primary" @click="handleSubmit(1)">下一步</a-button>
            </div>
        </a-form>
    </section>
</section>
</template>

<script>
import noData from '../components/noData'
import {addEquipment, getEquipment} from '@/service/getData'
export default {
    name: 'facilitySet',
    props: ['showinfo'],
    data () {
        return {
            editid : this.showinfo, 
            orgId : this.$store.getters.getOrgId,
            qualityId : this.$store.getters.getOrgQuaId,  //资质认证整个流程走完生成的总ID
            qualityStatus : this.$store.getters.getQualityStatus,   //资质认证的状态 0待审核 1审核通过 2审核拒绝  空-未提交 只有审核通过才可编辑
            isEdit : false,
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 10 },
            },
            formItemLayoutWithOutLabel : {
                wrapperCol: {span: 20, offset: 3 },
            },
            nameRules : {rules: [{ required: true, message: '请输入主要设备名称' }]},
            imgRules : {rules: [{ required: true, message: '请选择图片' }]},
            previewVisible: false,
            previewImage: '',
            fileList: [],
            loading : false,
            uploadData : {'functionCode' : 1,'id' : this.$store.getters.getOrgId},
            facilityInfo : '',
        }
    },
    components: {
        noData
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    mounted(){
        this.getEquipmentInfo();
    },
    methods: {
        getEquipmentInfo(){
            // 审核失败查询数据要为空，id传空
            let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
            getEquipment(this.orgId,qualityId).then((res) => {
                if(res && res.code == 200){
                    this.facilityInfo = res.data || {};
                    let defaultFileList = [];
                    if(res.data){
                        for(var i = 0; i < res.data.fileHostShowDtos.length;i ++){
                            defaultFileList.push({
                                name: i+'.png',
                                isold : 1,
                                url: res.data.fileHostShowDtos[i].url,
                                path: res.data.fileHostShowDtos[i].fileUrl,
                            });
                        }
                    }
                    this.fileList = defaultFileList;
                    this.form.getFieldDecorator('imgurl', { initialValue: defaultFileList, preserve: true });
                }
            })
        },
        checkshowinfo(){
            return !this.editid && this.qualityStatus !== 1 && this.qualityStatus !== 0 ? false : true;
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
            this.form.setFieldsValue({imgurl : fileList});
        },
        handleChange(file, fileList){
            this.fileList = fileList;
            this.form.setFieldsValue({imgurl : fileList});
        },
        handleCancel () {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
        },
        update(){
            this.isEdit = true;
        },
        handleSubmit  (type) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
                    let val = {
                        ...values,
                        orgId : this.orgId,
                        orgQualificationId : qualityId,
                        fileHostShowDtos : []
                    }
                    for(var i in this.fileList){
                        let file = this.fileList[i];
                        if(file.isold){
                            val.fileHostShowDtos.push({fileUrl : file.path});
                        }
                        if(file.response && file.response.code == 200){
                            val.fileHostShowDtos.push({fileUrl : file.response.data[0].path});
                        }
                    }
                    delete val.imgurl;
                    addEquipment(val).then((res) => {
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
                this.facilityInfo ='';
                this.getEquipmentInfo();
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
.submitbtnbox.editbox{
    margin-top: 34px;
}
</style>

