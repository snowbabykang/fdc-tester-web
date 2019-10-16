<template>
<section>
    <div style="float: right; margin-top: -54px;" v-if="checkPower() && professorsInfo.length > 0">
        <a-button v-if="isEdit" slot="tabBarExtraContent" type="primary" ghost @click="handleSubmit">提交权威介绍</a-button>
        <a-button v-else slot="tabBarExtraContent" type="primary" ghost @click="isEdit = true">修改权威介绍</a-button>
    </div>
    <a-form :form="form" class="form-item-label-left ">
        <div class="borderbox user-identify-box" :class="professorsInfo.length%2 == 0 ? 'user-identify-box-even' : ''">
            <a-row>
                <a-col :span="12">
                    <section class="user-item-box">
                        <a-form-item v-bind="formItemLayout2" label="专家" required>
                            {{professorsInfo.length}}人
                        </a-form-item>
                    </section>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12" v-for="(item,key) in professorsInfo" :key="key">
                    <section class="user-item-box">
                        <a-form-item v-bind="formItemLayout2" label="姓名" class="static-item"> <div class="text-ellipsis">{{item.professorName}} </div></a-form-item>
                        <a-form-item v-bind="formItemLayout2" label="资质" class="static-item"> <div class="text-ellipsis">{{item.qualificationName}} </div></a-form-item>
                        <a-form-item v-bind="formItemLayout2" label="证书">
                            <div class="upload-img-box">
                                <img :src="item.url">
                            </div>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout2" label="描述">
                            <a-textarea v-if="isEdit" v-decorator="[`professorsInfo[${key}].description`, {rules: [{ required: true, message: '请输入描述' }],initialValue : item.description} ]" placeholder="请输入" :rows="4"  style="resize: none;" maxlength="500"/>
                            <div v-if="!isEdit">{{item.description || '暂无描述'}}</div>
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout2" label="id" style="display: none;">
                            <a-input v-decorator="[`professorsInfo[${key}].id`,{initialValue : item.id}]"/>
                        </a-form-item>
                    </section>
                </a-col>
            </a-row>
        </div>
    </a-form>
</section>
</template>
<script>
import {editProfessor} from '../service/getData'
export default {
    data() {
        return {
            formItemLayout2: {
                labelCol: { span: 4 },
                wrapperCol: { span: 16 },
            },
            isEdit : false,
            orgId : this.$store.getters.getOrgId,
            qualityId : this.$store.getters.getOrgQuaId,
        };
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    computed : {
        professorsInfo(){
            return this.$store.getters.getStoreInfo.professors || []
        }
    },
    methods:{
        handleSubmit  (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    editProfessor(this.orgId,this.qualityId,values.professorsInfo).then((res) => {
                        if(res && res.code == 200){
                            this.isEdit = false;
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
</style>