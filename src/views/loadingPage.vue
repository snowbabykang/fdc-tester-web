<template>
<section class="content-white-box loadingbox">
    <img :src="'../../static/common-img/loadingpage.gif'">
</section>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            
        },
        mounted() {
            this.$store.dispatch('saveToken',this.$route.query.token);
            this.$store.dispatch('saveOrgId',this.$route.query.orgid);
            this.$store.dispatch('saveStoreId',this.$route.query.storeid);
            this.$store.dispatch('savePhone',this.$route.query.phone);
            let that = this;
            setTimeout(function(){
                that.$router.push('/');
            },2000)
            
        }
    }

</script>
<style scoped>
.loadingbox{
    
}
.loadingbox img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

</style>