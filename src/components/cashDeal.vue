<!--保证金协议 -->
<template>
    <section>
        <a-modal
            class="cashDealModal"
            v-model="isvisible"
            :width="700"
            @cancel = "handleCancel()"
        >
            11
        </a-modal>
    </section>
</template>

<script>
export default {
    name: 'cashDealModal',
    props: {
        visible: { type: Boolean, default: false }, 
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
        },
    },
}
</script>

<style scoped>

</style>
