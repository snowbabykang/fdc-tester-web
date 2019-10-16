<!-- 查看委托单modal -->
<template>
    <section>
        <a-modal
            class="entrustModal"
            centered
            :closable = "false"
            :footer="null"
            v-model="isvisible"
            :width="780"
            @cancel = "handleCancel()"
        >
            <div class="entrustBox">
              <div class="closebox" @click = "handleCancel()">
                  <span class="closeicon"><a-icon type="close-circle" theme="filled" /></span>
              </div>
              <img :src="imgSrc" alt="">
              <div class="text-center submitbtn"><a-button type="primary" @click="handleDownload">下载委托书</a-button></div>
            </div>
        </a-modal>
    </section>
</template>

<script>
export default {
    name: 'entrustModal',
    props: {
        visible: { type: Boolean, default: false },
        imgSrc: ''
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
        handleDownload(e) {
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('confirm');  // 传递确认事件
        },
    },
}
</script>
<style type="text/css">
.entrustModal .ant-modal-content{
    background: transparent;
}
</style>
<style scoped>
.entrustBox{
    background: #fff;
    padding: 20px;
    position: relative;
    margin-top: 40px;
}
.closebox{
    position: absolute;
    top: -52px;
    right: 0;
    color: #000;
    cursor: pointer;
}
.closebox .closeicon{
    font-size: 26px;
}
.closebox .closeicon:after{
    content : "";
    border-right: 2px solid #000;
    position: absolute;
    top: 26px;
    right: 12px;
    height: 26px;
}
.submitbtn{
    margin-top: 42px;
}
</style>
