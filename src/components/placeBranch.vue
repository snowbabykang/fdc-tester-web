<template>
<section>
    <section v-if="factoryList.length == 0 && editid ">
        <noData />
    </section>
    <section v-else class="quality-content">
        <a-form :form="form" class="form-item-label-left">
            <section class="quality-item-box" v-for="(k, index) in form.getFieldValue('keys')" :key="k">
                <section class="quality-item-box-dis" :class="checkshowinfo(k) ? 'edit-form-box' : ''">
                    <div v-if="checkDelete(k,index)">
                        <a-popconfirm title="你确定删除此模块吗？" @confirm="() => remove(k)">
                            <a-icon slot="icon" type="exclamation-circle" theme="filled" style="color: red" />
                            <a href="javascript:;" class="dynamic-delete-button">删除</a>
                        </a-popconfirm>
                    </div>
                    <div  v-if="index == 0" class="big-border-title">工商场地</div>
                    <div  v-if="index == 1" class="big-border-title">分支机构与分布 </div>

                    <!-- <span v-if="checkshowinfo(k)">输入框只能查看----</span>
                    <span v-else>输入框可编辑----</span>
                    <span v-if="checkDelete(k,index)">可删除----</span>
                    <span v-else>不可删除----</span>
                    <span v-if="!checkNew(k)">isNew = 0  原有</span>
                    <span v-else>isNew = 1  </span> -->

                    <!-- 区分主副类型-->
                    <a-form-item style="display: none;">
                        <a-input v-decorator="[`factory[${k}].factoryType`,{initialValue : index == 0 ? 0 : 1}]"/>
                    </a-form-item>
                    <!-- 审核成功后新增的专家isNew = 1  其他情况都是0 -->
                    <a-form-item style="display: none;">
                        <a-input v-decorator="[`factory[${k}].isNew`,{initialValue : checkNew(k)}]"/>
                    </a-form-item>

                    <a-form-item v-bind="formItemLayout" label="工商 场地地址">
                        <div v-if="checkshowinfo(k)">
                            {{factoryList[k].provinceName}} - {{factoryList[k].cityName}} - {{factoryList[k].areaName}}
                            <a-input type="hidden" v-decorator="[`factory[${k}].address`, addressRule(k) ]"/>
                        </div>
                        <selectArea v-else :addrkey="k" :addr="addrSelected[k]" @selectedArea="selectedArea" v-decorator="[`factory[${k}].address`, addressRule(k) ]"></selectArea>
                    </a-form-item>

                    <a-form-item v-bind="formItemLayout" label="详细地址">
                        <div v-if="checkshowinfo(k)">
                            {{factoryList[k].detailAddr}}
                            <a-input type="hidden" v-decorator="[`factory[${k}].detailAddr`, addrDetailRule(k) ]" placeholder="请输入" maxlength="50"/>
                        </div>
                        <a-input v-else v-decorator="[`factory[${k}].detailAddr`, addrDetailRule(k) ]" placeholder="请输入"/>
                    </a-form-item>

                    <a-form-item v-bind="formItemLayout" label="场地照片" extra="格式支持.png\jpg\jepg\bmp\raw">
                        <div v-if="checkshowinfo(k)">
                            <div class="previewImgList" v-if="factoryList[k]">
                                <div class="previewImgbox" @click="handlePreview(item)" v-for="(item ,index) in factoryList[k].fileHostShowDtos" :key="index">
                                    <div class="imgbox"><img :src="item.url"></div>
                                    <div class="showbigbtn">查看大图</div>
                                </div>  
                            </div>
                            <a-input type="hidden" v-decorator="[`factory[${k}].fileHostShowDtos`, imgRule(k) ]"/>
                        </div>
                        <div v-else>
                            <div @click="handleClick(k)">
                                <el-upload
                                    accept="image/*"
                                  :action="GLOBAL.uploadUrl"
                                  :data="uploadData"
                                  :file-list = "imglist[k] ? imglist[k].fileList : []"
                                  :before-upload="GLOBAL.checkimg"
                                  :multiple="true"
                                  list-type="picture-card"
                                  :on-change = "handleChange"
                                  :on-remove="handleRemove"
                                  :on-preview="handlePreview"
                                  v-decorator="[`factory[${k}].fileHostShowDtos`, imgRule(k) ]">
                                    <div v-if="imglist[k] && imglist[k].fileList.length < 20">
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传图片</div>
                                    </div>
                                </el-upload>
                            </div>
                            <div style="color: red;">场地照片，大门公司拍照照片</div>
                        </div>
                    </a-form-item>
                </section>
            </section>
            <a-form-item v-if="(editid && qualityStatus == 1 && isEdit) || (!editid && qualityStatus !== 1 && qualityStatus !== 0)">
                <a-button type="primary" ghost @click="add">添加分支</a-button> 
            </a-form-item>
            <!-- <a-form-item class="clause-box" v-if="!editid">
                <a-checkbox v-decorator="['agree', {rules: [{ required: true, message: '请同意' }]}]">同意<router-link to="">《服务条款》</router-link>和<router-link to="">《隐私权相关政策》</router-link></a-checkbox>
            </a-form-item> -->

            <div class="submitbtnbox" v-if="checkPower()">
                <!-- 首页资质认证且不是审核成功和审核中状态 才有下一步按钮 -->
                <a-button v-if="!editid && qualityStatus !== 1 && qualityStatus !== 0" type="primary" @click="handleSubmit(1)">提交</a-button>
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
        <submit-success-modal :visible.sync="visible" :showCancelButton="false" message="资质审核已提交，请您耐心等待！" @confirm="handleOk()" ></submit-success-modal>
    </section>
</section>
</template>

<script>
import selectArea from '../components/selectArea'
import submitSuccessModal from '../components/submitSuccessModal'
import {getFactoryList,addFactory} from '@/service/getData'
import noData from '../components/noData'
export default {
    name: 'placeBranch',
    props: ['showinfo'],
    data () {
        return {
            editid : this.showinfo, 
            orgId : this.$store.getters.getOrgId,
            qualityId : this.$store.getters.getOrgQuaId,  //资质认证整个流程走完生成的总ID
            qualityStatus : this.$store.getters.getQualityStatus,   //资质认证的状态 0待审核 1审核通过 2审核拒绝  
            isEdit : false,    //分支机构修改编辑为true
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
            currentuploadimg : '',   //当前上传图片是哪一个
            previewVisible: false,
            previewImage: '',
            imglist : [],   //图片展示数组
            visible: false,
            keyid : undefined,
            factoryList : '',   //获取到的场地信息
            uploadData : {'functionCode' : 1,'id' : this.$store.getters.getOrgId},
            addrSelected : [],
        }
    },
    components: {
        selectArea,submitSuccessModal,noData
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    created(){
        this.getAllInfo();
    },
    methods: {
        getAllInfo(){
            // 审核失败查询数据要为空，id传空
            let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
            // 获取资质认证信息
            getFactoryList(this.orgId,qualityId).then((res) => {
                if(res && res.code == 200){
                    this.factoryList = res.data;
                    if(res.data.length == 0){
                        let len = 1;
                        this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
                        this.keyid = len;
                        this.addrSelected = [
                            {province : undefined,city : undefined,area : undefined},
                            {province : undefined,city : undefined,area : undefined}
                        ];
                        this.imglist = [
                            {fileList : []},
                            {fileList : []},
                        ];
                    }else{
                        let len = res.data.length;
                        let arr = [];
                        for(var i = 0; i < len;i++){
                            arr.push(i);
                            this.imglist[i] = {
                                fileList : this.factoryList[i].fileHostShowDtos
                            };
                            let area = {
                                province: this.factoryList[i].province, 
                                city: this.factoryList[i].city, 
                                area: this.factoryList[i].area
                            }
                            this.addrSelected.push(area);
                        }
                        this.form.getFieldDecorator('keys', { initialValue: arr, preserve: true });
                        this.keyid = len - 1;
                    }
                }
            })
        },
        addressRule(index){
            let area = {
                province: this.factoryList[index] ? this.factoryList[index].province : undefined, 
                city: this.factoryList[index] ? this.factoryList[index].city : undefined, 
                area: this.factoryList[index] ? this.factoryList[index].area : undefined
            }
            return {
                type: 'object',
                rules: [{ required: true, message: '请选择所在地区' }] , 
                initialValue : this.factoryList[index] ? area : ''
            }
        },
        addrDetailRule(index){
            return  {
                rules: [{ required: true, message: '请输入详细地址' }],
                initialValue : this.factoryList[index] ? this.factoryList[index].detailAddr : ''
            }
        },
        imgRule(index){
            return {
                rules: [{ required: true, message: '请选择图片' }],
                initialValue : this.factoryList[index] ? this.factoryList[index].fileHostShowDtos : ''
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
                    return this.factoryList && this.factoryList[index];
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
                    return this.factoryList && this.factoryList[index] ? (this.factoryList[index].isNew || 0) : 1;
                }
            }
        },
        handleClick(val){
            this.currentuploadimg = val;
        },
        handleChange(file, fileList){
            if(!this.imglist[this.currentuploadimg]){
                this.imglist[this.currentuploadimg] = {};
            }
            this.imglist[this.currentuploadimg].fileList = fileList; 
            let factory = this.form.getFieldValue('factory');
            factory[this.currentuploadimg].fileHostShowDtos = fileList;
            this.form.setFieldsValue({factory : factory});
        },
        handleRemove(file, fileList) {
            let uid = file.uid;
            for(var i = 0;i < this.imglist.length; i++){
                let list = this.imglist[i].fileList;
                let flag = false;
                for(var j = 0;j < list.length; j++){
                    if(list[j].uid == uid){
                        flag = true;
                    }
                }
                if(flag){
                    this.imglist[i].fileList = fileList;
                }
            }
        },
        handleCancel () {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
        },
        // 省市区联动
        selectedArea(data,addrtype){
            const { form } = this;
            let factory = form.getFieldValue('factory');
            factory[addrtype].address = data;
            form.setFieldsValue({factory : factory});
        },
        // 新增资质
        add () {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            let keyid = ++this.keyid;
            const nextKeys = keys.concat(keyid);
            form.setFieldsValue({
                keys: nextKeys,
            });
            this.addrSelected[keyid] = {province : undefined,city : undefined,area : undefined};
            this.imglist[keyid] = {fileList : []};
        },
        //移除资质
        remove (k) {
            const { form } = this;
            const keys = form.getFieldValue('keys');
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        },
        // 工商场地分支机构保存
        handleSubmit  (type) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                    let arr = [];
                    for(var i in values.factory){
                        let fileHostShowDtos = [];
                        for(var j = 0; j < values.factory[i].fileHostShowDtos.length; j++){
                            let file = values.factory[i].fileHostShowDtos[j];
                            if(file.response && file.response.code == 200){
                                fileHostShowDtos.push({fileUrl : file.response.data[0].path});
                            }else{
                                fileHostShowDtos.push({fileUrl : file.fileUrl});
                            }
                        }
                        console.log(fileHostShowDtos);
                        let obj = {
                            province : values.factory[i].address.province,
                            city : values.factory[i].address.city,
                            area : values.factory[i].address.area,
                            detailAddr : values.factory[i].detailAddr,
                            factoryType  : values.factory[i].factoryType,
                            isNew  : values.factory[i].isNew,
                            fileHostShowDtos : fileHostShowDtos
                        };
                        arr.push(obj);
                    }

                    console.log(arr);
                    // return false;
                    let qualityId = this.qualityStatus == 2 ? '' : this.qualityId;
                    addFactory(arr,this.orgId,qualityId).then((res) => {
                        if(res && res.code == 200){
                            this.saveNext(type);
                        }
                    })
                }
            });
        },
        saveNext(type){
            if(type == 1){
                this.visible = true;
            }else if(type == 2){
                this.isEdit = false;
                this.currentuploadimg = '';
                this.factoryList ='';
                this.getAllInfo();
            }
        },
        // 分支机构编辑，工商场地不可编辑
        update(){
            this.isEdit = true;
        },
        handleOk(e) {
            this.$router.push('/');
        },
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
.clause-box{
    height:64px;
    background:rgba(250,250,250,1);
    margin-top: 32px;
    
    padding-left: 16px;
}
.clause-box >>> .ant-form-item-control{
    line-height: 64px;
}
.quality-success-box{
    text-align: center;
    padding-bottom: 8px;
    padding-top: 18px;
}
.quality-success-box img{
    width: 146px;
}
.quality-success-box .message{
    font-size:16px;
    font-weight:500;
    color:rgba(0,0,0,0.65);
    margin: 24px 0 32px;
}
.quality-success-box .ant-btn{
    margin: 0 16px;
}
</style>
