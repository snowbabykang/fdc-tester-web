<template>
<section  class="content-white-box">
    <a-form layout="inline" style="margin-bottom: 20px;">
        <a-form-item label="按月份搜索">
            <a-month-picker :getCalendarContainer="GLOBAL.getPopupContainer" @change="onChange" :disabledDate="disabledDate" placeholder="日期" />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" ghost  @click="handleSubmit">查询</a-button>
        </a-form-item>
    </a-form>  
    <section class="steplist">
        <span class="btn" :class="currentStep == 5 ? 'active' : ''" @click="tabChange(5,'')">结算管理</span>
        <span class="btn" :class="currentStep == key ? 'active' : ''" @click="tabChange(key,key)" v-for="(item,key) in statusArr" :key="key">{{item}}</span>
    </section>
    <a-alert type="info" closable style="margin-bottom: 10px;">
        <div slot="description">·此处列出了详细的店铺账单信息，点击查看可以查看详细的订单信息，退单信息和店铺费用信息</div>
        <div slot="description">
          ·账单处理流程：系统出账>商家审核>平台支付（完成结算）2个环节
          <!-- <span style="color: red">协议佣金为5%</span> -->
        </div>
    </a-alert>
    <a-table :columns="columns"
        :rowKey="record => record.id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="settleAmount" slot-scope="settleAmount">
            <span v-if="settleAmount">￥{{settleAmount}}</span>
        </template>
        <template slot="periodSettleAmount" slot-scope="periodSettleAmount">
            <span v-if="periodSettleAmount">￥{{periodSettleAmount}}</span>
        </template>
        <template slot="status" slot-scope="status">
            {{statusArr[status]}}
        </template>
        <template slot="detailAction" slot-scope="record">
            <router-link v-if="checkPower()" class="btn-link" :to="'/billInformation/'+record.id">查看</router-link>
        </template>
        <template slot="action" slot-scope="record">
            <div v-if="checkPower()">
                <a-button v-if="record.status == 0" type="primary" @click="changeStatus(record.id,1)">确认提交</a-button>
                <a-button v-if="record.status == 2" type="primary" @click="addInvoice(record.id,record.periodSettleAmount)">开发票</a-button>
                <span v-if="record.status == 3 || record.status == 4" class="btn-link" @click="showDetail(record.id)">发票详情</span>
            </div>
        </template>
    </a-table>
    <!-- 开票 -->
    <addInvoiceModal :visible.sync="invoiceVisible" :id="settleId" :amount="invoiceAmount" @confirm="creatInvoice"/>
    <!-- 查看详情modal -->
    <a-modal v-model="detailvisible" :footer="null" :centered="true" width="100%" :style="{paddingLeft : '224px',paddingRight : '24px'}">
        <div class="expressStatus">
            <div class="title" v-if="detailInfo.invoiceRecord">{{invoiceStatus[detailInfo.invoiceRecord.status]}} 
            </div>
            <div class="expressinfo" v-if="detailInfo.express && detailInfo.express.id">发票已邮寄<span style="padding-left: 64px;"></span>{{detailInfo.express.expressCompany}}：<span class="expresscode">{{detailInfo.express.expressNumber}}</span></div>
        </div>
        <a-row :gutter="12" type="flex">
            <a-col :span="12">
                <div class="invoicebox">
                    <div class="big-border-title">开票信息</div>
                    <table v-if="detailInfo && detailInfo.invoiceRecord">
                        <tr> <td width="120">申请开票时间：</td> <td>{{detailInfo.invoiceRecord.createTime}}</td> </tr>
                        <tr> <td>开票金额：</td> <td class="red">￥{{detailInfo.invoiceRecord.amount}}</td> </tr>
                        <tr> <td>发票类型：</td> <td>{{invoiceType[detailInfo.invoiceRecord.invoiceTypeId]}}</td> </tr>
                        <tr> <td>发票抬头：</td> <td>{{detailInfo.invoiceRecord.header}}</td> </tr>
                        <tr> <td>纳税人识别号：</td> <td>{{detailInfo.invoiceRecord.taxerCode}}</td> </tr>
                        <tbody v-if="detailInfo.invoiceRecord.invoiceTypeId == '0'">
                        <tr> <td>开户银行：</td> <td>{{detailInfo.invoiceRecord.bankName}}</td> </tr>
                        <tr> <td>开户账号：</td> <td>{{detailInfo.invoiceRecord.bankAccount}}</td> </tr>
                        <tr> <td>注册场所地址：</td> <td>{{detailInfo.invoiceRecord.regAddr}}</td> </tr>
                        <tr> <td>公司注册电话</td> <td>{{detailInfo.invoiceRecord.regPhone}}</td> </tr>
                        </tbody>
                    </table>
                    <div v-else class="nodata">
                        <img src="static/common-img/nodata.png">
                        <div class="message">暂无发票信息</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="invoicebox">
                    <div class="big-border-title">邮寄信息</div>
                    <table v-if="detailInfo && detailInfo.address">
                        <tr> <td width="120">发票邮寄地址：</td> <td>{{detailInfo.address.provinceName}}{{detailInfo.address.cityName}}{{detailInfo.address.areaName}}{{detailInfo.address.detailAddress}}</td> </tr>
                        <tr> <td>邮编：</td> <td>{{detailInfo.address.postCode || '000000'}}</td> </tr>
                        <tr> <td>联系人姓名：</td> <td>{{detailInfo.address.contactName}}</td> </tr>
                        <tr> <td>联系电话</td> <td>{{detailInfo.address.contactPhone}}</td> </tr>
                    </table>
                    <div v-else class="nodata">
                        <img src="static/common-img/nodata.png">
                        <div class="message">暂无邮寄信息</div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </a-modal>
</section>
</template>

<script>
import {getOrderListSettlement,changeOrderStatus,getReceiptInfoById} from '@/service/getData'
import { settleStatus ,invoiceStatus ,invoiceType} from '../api/dictionary'
import addInvoiceModal from '../components/addInvoiceModal'
const columns = [
    {title: '账单编号', dataIndex: 'settleCode', },
    {title: '开始日期', dataIndex: 'startDay', },
    {title: '结束日期', dataIndex: 'completeDay', },
    {title: '订单金额', dataIndex: 'settleAmount',scopedSlots: { customRender: 'settleAmount' } },
    {title: '本月应结', dataIndex: 'periodSettleAmount',scopedSlots: { customRender: 'periodSettleAmount' } },
    {title: '出账日期', dataIndex: 'expendDay', },
    {title: '账单状态', dataIndex: 'status',scopedSlots: { customRender: 'status' }, },
    {title: '详情', key: 'detailAction',scopedSlots: { customRender: 'detailAction' }, },
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];
export default {
    data () {
        return {
            currentStep : 5,
            month : '',
            status : '',
            data: [],
            pagination: {},
            loading: false,
            columns,
            pagesize : 10,
            statusArr : settleStatus,
            detailvisible : false,
            detailInfo : '',
            invoiceStatus : invoiceStatus,
            invoiceType : invoiceType,
            settleId : '',  //账单ID
            invoiceAmount : '',   //开票金额
            invoiceVisible : false,
        }
    },
    components: {addInvoiceModal},
    methods: {
        tabChange(type,status){
            this.currentStep = type;
            this.status = status;
            this.searchData();
        },
        disabledDate(current) {
            return current < new Date('2019-1') || current > new Date('2020-1');
        },
        onChange(date, dateString) {
            if(date){
                this.month = dateString.replace('-','');
            }else{
                this.month = '';
            }   
        },
        handleSubmit(){
            this.searchData();
        },
        async initData(page,size){
            this.loading = true;
            let res = await getOrderListSettlement(this.$store.getters.getStoreId,this.month,this.status,page,size);
            if(res && res.code == 200){
                const pagination = { ...this.pagination };
                pagination.total = res.data.total;
                pagination.pageSize = size;
                this.loading = false;
                this.data = res.data.list;
                this.pagination = pagination;
            }
        },
        handleTableChange (pagination) {
            const pager = { ...this.pagination };
            pager.current = pagination.current;
            this.pagination = pager;
            this.initData(pagination.current,this.pagesize);
        },
        searchData(){
            this.pagination.current = 1;
            this.handleTableChange(this.pagination);
        },
        changeStatus(id,status){
            changeOrderStatus(id,status).then((res) => {
                if(res && res.code == 200){
                    this.searchData();
                }
            })
        },
        addInvoice(id,amount){
            this.settleId = id;
            this.invoiceAmount = amount;
            this.invoiceVisible = true;
        },
        creatInvoice(){
            this.searchData();
        },
        showDetail(id){
            getReceiptInfoById(id).then((res) => {
                if(res && res.code == 200){
                    this.detailvisible = true;
                    this.detailInfo = res.data;
                }
            })
        },
    },
    mounted(){
        this.initData(1,this.pagesize);
    },
    
}
</script>

<style scoped>
.nodata{text-align: center;padding:60px 0;}
.nodata img{width: 200px;}
.nodata .message{padding-top: 20px;}
.invoicebox{
    background:rgba(0,0,0,0.03);
    padding: 22px 16px 10px 16px;
    height: 100%;
}
.invoicebox .big-border-title{
    margin-bottom: 12px;
}
.expressStatus{}
.expressStatus .title{
    font-size:20px;
    font-weight:500;
    padding-bottom: 14px;
}
.expressStatus .expressinfo{
    font-size:16px;
    font-weight:500;
    padding: 0px 0 26px;
}
.expressStatus .expresscode{
    font-size: 14px;
    font-weight: normal;
}
.invoicebox table{
    width: 100%;
}
.invoicebox table tr td{
    font-size:14px;
    font-weight:normal;
    padding: 8px 0px 8px 8px;
    vertical-align: top;
}
.invoicebox table tr td:first-child{
    font-size:16px;
    font-weight:500;
}
</style>
