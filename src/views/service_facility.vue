<template>
<section>
    <div style="float: right; margin-top: -54px;" v-if="checkPower()">
        <a-button v-if="isEdit" type="primary" ghost @click="handleSubmit">提交设备信息</a-button>
        <a-button v-else type="primary" ghost @click="update()">修改设备信息</a-button>
    </div>
    <a-form class="form-item-label-left ">
        <div class="editorbox">
            <quill-editor v-model="facilityContent" ref="myQuillEditor" :options="editorOption" > </quill-editor>
        </div>
        <!-- <div v-else class="borderbox facilitybox" v-html="facilityContent"></div> -->
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
import {editStoreFacility} from '../service/getData'
export default {
    data() {
        return {
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
            facilityContent : "",
            isEdit : true,
        };
    },
    computed : {
        storeInfo(){
            return this.$store.getters.getStoreInfo.storeInfo || {}
        }
    },
    mounted(){
        this.facilityContent = this.storeInfo.equipmentIntroduction ? decodeURIComponent(this.storeInfo.equipmentIntroduction) : '';
        this.isEdit = this.storeInfo.equipmentIntroduction ? false : true;
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
            if(!this.facilityContent){
                this.$notification.error({message : '提示',description: '请输入设备介绍' });
                return false;
            }
            let info = encodeURIComponent(this.facilityContent);
            editStoreFacility(this.storeInfo.id,info).then((res) => {
                if(res && res.code == 200){
                    this.isEdit = false;
                    this.quill.enable(false);
                    this.$message.success("提交成功");
                    this.$emit('confirm',true);
                }
            })
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