<template>
    <section class="company-content-box">
        <div class="company-img"><img src="static/common-img/company-example.png"></div>
        <div class="company-introduce">
            <table>
                <tr>
                    <td>企业名：</td>
                    <td><span class="company-title">北京某某某质量检验站 </span></td>
                </tr>
                <tr class="padding-tr">
                    <td>企业简介：</td>
                    <td><div class="detail-eclip">具有检验鉴定机构证书、中国合格评定国家认可委员会实验室认可证书、国际羊毛局认可测试中心、CMA计量认证证书、CAL授权证书</div></td>
                </tr>
                <tr>
                    <td>检测范围：</td>
                    <td><div class="detail-eclip">18401全项、纤维含量、材质鉴定、服装外观、色牢度、起球、绒质、静电性能、色差、酚黄变、PH值、甲醛、可分解致癌芳香胺染料、重金属、燃烧性能、单位重量</div></td>
                </tr>
            </table>
        </div>
        <div class="service-list">
            <table>
                <tr>
                    <td colspan="3">序号</td>
                </tr>
                <tr v-for="(item,index) in list" :key="item.id">
                    <td>{{index+1}}</td>
                    <td>{{item.name}}</td>
                    <td><sub>￥</sub>{{item.price}}</td>
                </tr>
            </table>
        </div>
    </section>  
</template>
<script>
export default {
    data() {
        return {
            list : [
                {id : 1,name : '18401全项',price : '5980.00'},
                {id : 2,name : '色牢度',price : '300.00'},
                {id : 3,name : '成分分析',price : '1000.00'},
                {id : 4,name : '加印',price : '10.00'},
                {id : 5,name : '邻苯二甲酸酯检测',price : '500.00'},
            ]
        };
    },
    mounted() {

    },
};
</script>
<style scoped>
.company-content-box{
    height: 234px;
    overflow: hidden;
    border:1px solid #D9D9D9;
}
.company-img{
    float: left;
    width: 234px;
}
.company-img img{
    width: 100%;
}
.company-introduce{
    float: left;
    width: 387px;
    padding: 0 28px 0 20px;
    margin: 20px 0;
    border-right:1px dotted #D9D9D9;
}
.company-introduce table tr td:first-child{
    font-weight:500;
    color:rgba(102,102,102,1);
    width: 72px;
    vertical-align: top;
}
.company-introduce table tr td:last-child{
    color:rgba(102,102,102,1);
}
.company-introduce .company-title{
    color: #2300A8;
    font-weight:500;
}
.detail-eclip{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-box-orient: vertical;
}
.padding-tr td{padding:20px 0;}
.service-list{
    float: left;
    padding: 20px 0 20px 20px;
}
.service-list tr td{
    padding: 10px 30px 10px 0;
    line-height: 1;
    color:#333;
}
.service-list tr td:first-child{
    color: #E6242E;
}
.service-list tr td:last-child{
    color:rgba(0,0,0,0.65);
}
.service-list tr:first-child td{
    padding: 0;
    color: #E6242E;
}
.service-list sub{
    bottom: 0;
}
</style>