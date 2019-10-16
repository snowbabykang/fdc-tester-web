<template>
    <section>
        <div class="big-border-title">设备资质</div>
        <facilitySet :showinfo="editid" @confirm = "handleconfirm()"/>
        <div class="content-border-divider"></div>
        <div class="big-border-title">学位认证</div>
        <professorListSet :showinfo="editid" @confirm = "handleconfirm2()" />
        <submit-success-modal :visible.sync="visible" message="提交成功！" :showCancelButton="false" ></submit-success-modal>
    </section>
</template>

<script>
import facilitySet from '../components/facilitySet'
import professorListSet from '../components/professorListSet'
import submitSuccessModal from '../components/submitSuccessModal'
export default {
    name: 'facilityAndUser',
    props: ['showinfo'],
    data () {
        return {
            editid : this.showinfo,
            visible : false,
        }
    },
    components: {
        facilitySet, professorListSet, submitSuccessModal
    },
    methods: {
        handleconfirm(){
            this.visible = true;
        },
        handleconfirm2(){
            this.visible = true;
        }
    },
}
</script>
<style scoped>

</style>

