<template>
    <section>
        <a-modal
            centered
            :maskClosable="false"
            :keyboard="false"
            :closable = "false"
            :footer="null"
            v-model="isvisible"
            :width="440"
            :orderCode="orderCode"
            @cancel = "handleCancel()"
        >
            <div class="quality-success-box">
                <img src="static/common-img/quality-success.png">
                <div class="message">{{message}}</div>
                <div class="btnlist">
                    <a-button type="primary" ghost @click="handleOk()">{{confirmText}}</a-button>
                    <a-button v-if="showCancelButton" @click="handleCancel()">取消</a-button>
                </div>
            </div>
        </a-modal>
    </section>
</template>

<script>
import {iorder} from '@/service/getData'
export default {
    name: 'submitSuccessModal',
    props: {
        visible: { type: Boolean, default: false },   
        message: {type: String, default: ""},           //提示信息
        confirmText : {type: String, default: "确认"},    //确认按钮文字
        showCancelButton : {type: Boolean, default: true},    //默认展示取消按钮
    },
    data() {
        return {
        };
    },
    computed : {         //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                return this.visible;
            },
            set: function () {

            }
        }
    },
    methods: {
        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        handleOk(e) {
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('confirm');  // 传递确认事件
        },
    },
}
</script>
<style scoped>
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
