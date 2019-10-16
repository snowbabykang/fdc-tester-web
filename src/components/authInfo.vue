<template>
<section>
    <div v-if="companyInfo" class="companyInfoBox">
        <table>
            <tr> <td>企业名称：</td> <td>{{companyInfo.name}}</td> </tr>
            <tr> <td>社会信用代码：</td> <td>{{companyInfo.licenseCode}}</td> </tr>
            <tr> <td>营业执照：</td> <td>
                <div class="upload-img-box">
                    <img :src="companyInfo.licensePicFileUrl">
                </div>
            </td> </tr>
            <tr> <td>注册电话：</td> <td>{{companyInfo.tel}}</td> </tr>
            <tr> <td>邮箱地址：</td> <td>{{companyInfo.email}}</td> </tr>
        </table>
        <div class="content-border-divider"></div>
        <table>
            <tr> <td>法人代表：</td> <td>{{companyInfo.bossName}}</td> </tr>
            <tr> <td>法人身份证/护照号：</td> <td>{{companyInfo.bossIDCode}}</td> </tr>
            <tr> <td>法人代表联系电话：</td> <td>{{companyInfo.bossTel}}</td> </tr>
            <tr> <td>签章图片：</td> <td>
                <div class="upload-img-box">
                    <img :src="companyInfo.signaturePicFileUrl">
                </div>
            </td> </tr>
        </table>
    </div>
    <noData  v-else />
</section>
</template>
<script>
import noData from '../components/noData'
import {getAuthInfo} from '../service/getData'
export default {
    data() {
        return {
            storeid : this.$store.getters.getStoreId,
            orgid : this.$store.getters.getOrgId,
            companyInfo : "",
            statuslist : {
                0 : {name : '审核中', color : 'primary'},
                1 : {name : '已通过', color : 'success'},
                2 : {name : '未通过', color : 'red'},
            },
        };
    },
    components: {
        noData
    },
    methods: {
        getEnterpriseInfo(){
            getAuthInfo(this.orgid).then((res) => {
                if(res && res.code == 200){
                    this.companyInfo = res.data;
                }
            })
        }
    },
    mounted(){
        this.getEnterpriseInfo();
    }
};
</script>
<style type="text/css" scoped>

.companyInfoBox{}
.companyInfoBox table{

}
.companyInfoBox table td{
    vertical-align: top;
    padding: 12px 0;
}
.companyInfoBox table td:first-child{
    font-size: 16px;
    width: 10em;
}
</style>