<template>
<section class="content-white-box">
    <div class="big-border-title">账单信息</div>
    <table class="settleTb">
        <tr>
            <td><span class="title">账单编号：</span>{{data.settleCode}}</td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td width="27%"><span class="title">开始日期：</span>{{data.startDay}}</td>
            <td width="27%"><span class="title">结束日期：</span>{{data.completeDay}}</td>
            <td width="27%"><span class="title">出账日期：</span>{{data.expendDay}}</td>
            <td width="19%"><span class="title">账单状态：</span>{{statusArr[data.status]}}</td>
        </tr>
    </table>
    <a-table  style="border:1px solid #e8e8e8; border-bottom: none;"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="orderlist"
        :loading="loading"
        :pagination="false"
      >
        <template slot="commodityTypeList" slot-scope="record">
            <span v-for="item in record.commodityTypeList" :key="item.id">{{item.commodityTypeName}}</span>
        </template>
        <template slot="totalPrices" slot-scope="totalPrices"> <span v-if="totalPrices">￥{{totalPrices}} </span></template>
        <template slot="typeId" slot-scope="typeId">{{typeArr[typeId]}} </template>
    </a-table>
    <div class="text-right" style="padding-top: 32px;font-size: 16px;">
        合计：¥ {{data.settleAmount}} <span style="padding-left: 24px;"></span> 应结：<span class="red">¥ {{data.periodSettleAmount}}</span>
    </div>
</section>     
</template>

<script>
import {getSettleDetail,getSettleOrderList} from '@/service/getData'
import { settleStatus ,orderStatus} from '../api/dictionary'
const columns = [
    {title: '账单编号', dataIndex: 'orderCode', },
    {title: '订单服务', key: 'commodityTypeList',scopedSlots: { customRender: 'commodityTypeList' } },
    {title: '下单时间', dataIndex: 'orderTime', },
    // {title: '完成时间', dataIndex: 'orderTime', },
    {title: '订单金额', dataIndex: 'totalPrices',scopedSlots: { customRender: 'totalPrices' }, },
    {title: '状态', dataIndex: 'typeId',scopedSlots: { customRender: 'typeId' }, },
];
export default {
    data () {
        return {
            data: {},
            orderlist : [],
            loading: false,
            columns,
            statusArr : settleStatus,
            typeArr :  orderStatus,
        }
    },
    methods: {
        async initData(id){
            let res = await getSettleDetail(id);
            if(res && res.code == 200){
                this.data = res.data;
                this.getList();
            }
        },
        getList(){
            this.loading = true;
            getSettleOrderList(this.$store.getters.getStoreId,this.data.startDate,this.data.completeDate).then((res) => {
                if(res && res.code == 200){
                    this.loading = false;
                    this.orderlist = res.data;
                }
            })
        }
    },
    mounted(){
        this.initData(this.$route.params.id);
    },
    
}
</script>

<style scoped>
.settleTb{
    width: 100%;
    margin-bottom: 16px;
}
.settleTb tr td{
    padding: 0 0 24px 0;
}
.settleTb tr td .title{
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    width: 114px;
}
</style>
