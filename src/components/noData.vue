<template>
    <section class="nodatabox">
        <img src="static/common-img/nodata.png">
        <div class="message">{{message}}</div>
    </section>
</template>
<script>
export default {
    name: 'noData',
    props: {
        message: { type: String, default: '哎呀！当前暂无数据～' }, 
    }, 
    data() {
        return {
        };
    },
    mounted() {

    },
};
</script>
<style scoped>
.nodatabox{
    text-align: center;
    padding: 260px 0;
}
.nodatabox img{
    width: 194px;
}
.nodatabox .message{
    font-weight:500;
    color:rgba(0,0,0,0.45);
    padding-top: 20px;
}
</style>