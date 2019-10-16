<template>
<section class="content-white-box notfoundbox">
    <img :src="'../../static/common-img/404.png'">
    <div class="text-center btnlist">
        <a-button type="primary" ghost @click="$router.go(-1)" class="goback">上一页</a-button>
        <router-link to="/"><a-button type="primary" ghost>回到首页</a-button></router-link>
    </div>  
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
		}
	}

</script>
<style scoped>
.notfoundbox{
    text-align: center;
    padding: 122px 0;
}
.notfoundbox img{
    max-width: 785px;
}
.btnlist{
    padding-top: 64px;
}
.btnlist .goback{
    margin-right: 52px;
    width: 88px;
}
</style>