<template>
    <section class="content-white-box">
        <div class="big-border-title">出售中的商品</div>
        <a-form layout="inline">
            <a-form-item>
                <a-select :getPopupContainer="GLOBAL.getPopupContainer" style="width: 224px;" v-model="searchtype">
                    <a-select-option value="1">服务名称</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-input placeholder="请输入" v-model="searchinfo"  style="width: 224px;"/>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="search()"> 搜索 </a-button>
            </a-form-item>
        </a-form>
        <a-alert class="alertinfo" message="提示：序号为前台店铺列表展现位的5个服务，序号为1-5不可重复，再次添加需删除数字序号." type="warning" showIcon closable />
        <table class="product-table">
            <thead>
                <tr>
                    <td width="200">
                        <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll"> 全选 </a-checkbox>
                        <a-button v-if="checkPower()" @click="deleteAll(checkedList)" size="small">删除</a-button>
                    </td>
                    <td>服务名称</td>
                    <td>价格</td>
                    <td>发布时间</td>
                    <td>操作</td>
                </tr>
            </thead>
            <tbody v-for="(item,key) in datalist" v-if="datalist.length > 0">
                <tr class="product-code">
                    <td colspan="5">
                        <a-checkbox @change="onChange(key,item)" :checked="item.checked">平台货号：{{item.platformCode}}</a-checkbox>
                        <span class="red" v-if="item.status == 2">已被删除、删除原因：{{item.outSoldReason}}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a-popover placement="topLeft" trigger="focus" >
                            <template slot="content">
                                <product-example/>
                            </template>
                            <a-input-number size="small" :min="1" :max="5" :precision="0" v-model="item.sortNumber" @blur="onChangeNum(item.sortNumber,item.id,item)" placeholder="序号" @focus="showIntroduce"/>
                        </a-popover>
                    </td>
                    <td><span class="product-name" v-if="item.commodityName">{{item.commodityName}}</span></td>
                    <td>¥ {{item.commodityPrice}}</td>
                    <td>{{item.updateDate}}</td>
                    <td>
                        <div v-if="checkPower()">
                            <router-link :to="'/publishSerivceEdit/'+item.id+'/'+item.commodityTypeId" class="btn-link" :class="item.status == 2 ? 'disabled' : ''">编辑</router-link>
                            <a-divider type="vertical" v-if="item.status == 0"/>
                            <a v-if="item.status == 0" href="javascript:void(0);" class="btn-link" @click="deleteProduct(item.id)">删除</a>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody  v-if="datalist.length == 0"> 
                <tr>
                    <td colspan="5"><noData /></td>
                </tr>
            </tbody>
        </table>
        <div class="pagination-box" v-show="datalist.length > 0">
            <a-pagination v-model="currentPage" :total="total" :pageSize="pagesize" :showTotal="total => `共 ${total} 条数据`" @change="onChangePage"></a-pagination>
        </div>
    </section>
</template>
<script>
import productExample from '../components/productExample'
import noData from '../components/noData'
import {getServiceListByname,delProduct,sortProduct} from '@/service/getData'
export default {
    data() {
        return {
            storeid : this.$store.getters.getStoreId,
            searchtype : '1',
            searchinfo : "",
            indeterminate: false,
            checkAll: false,
            checkedList : [],
            datalist : [],
            loading: false,
            currentPage : 1,
            pagesize : 10,
            total : 0,
        };
    },
    components: {
        productExample,noData
    },
    methods: {
        async initData(page,size){
            this.loading = true;
            let res = await getServiceListByname(this.storeid,this.searchinfo,page,size);
            if(res && res.code == 200){
                this.total = res.data.total;
                this.loading = false;
                this.datalist = res.data.list;
            }
        },
        // 分页
        onChangePage(current){
            this.currentPage = current;
            this.initData(this.currentPage,this.pagesize);
        },
        search(val){
            this.currentPage = 1;
            this.onChangePage(1);
        },
        // 选择服务
        onChange (key,data) {
            data.checked = !data.checked;
            this.$set(this.datalist, key, data);
            if(data.checked){
                this.checkedList.push(data.id);
            }else{
                this.checkedList.splice(this.checkedList.findIndex(item => item === data.id), 1);
            }
            this.indeterminate = !!this.checkedList.length && (this.checkedList.length < this.datalist.length);
            this.checkAll = this.checkedList.length === this.datalist.length;
        },
        // 全选
        onCheckAllChange (e) {
            Object.assign(this, {
                indeterminate: false,
                checkAll: e.target.checked,
            })
            this.checkedList = [];
            if(e.target.checked){
                this.datalist.forEach(data => {
                    data.checked = true;
                    this.checkedList.push(data.id);
                })
            }else{
                this.datalist.forEach(data => {
                    data.checked = false;
                })
                this.checkedList = [];
            }
            
        },
        // 全选删除
        deleteAll(ids){
            let that = this;
            if(ids.length <= 0){
                that.$message.error("请选择要删除的服务");
                return false;
            }
            this.$confirm({
                title: '确认要删除服务吗？',
                content : '删除后相关描述信息将不存在',
                okType : 'danger',
                iconType : 'close-circle',
                onOk() {
                    that.confirmDelete(ids);
                },
            });
        },
        deleteProduct(id){
            let that = this;
            this.$confirm({
                title: '确认要删除服务吗？',
                content : '删除后相关描述信息将不存在',
                okType : 'danger',
                iconType : 'close-circle',
                onOk() {
                    let ids = new Array(id);
                    that.confirmDelete(ids);
                },
            });
        },
        confirmDelete(ids){
            delProduct(ids).then((res) => {
                if(res && res.code == 200){
                    this.$message.success("删除成功");
                    this.initData(1,this.pagesize);
                }
            })
        },
        // 设置序号首页推荐位
        onChangeNum(num,id,item){
            sortProduct(id,this.$store.getters.getStoreId,num).then((res) => {
                if(res && res.code == 200){
                    this.$message.success('设置成功');
                }else{
                    item.sortNumber = '';
                }
            })
        },
        // 设置序号首页推荐位 简介
        showIntroduce(){

        },
        
    },
    mounted(){
        this.initData(this.currentPage,this.pagesize);
    }
};
</script>
<style type="text/css" scoped>
.alertinfo{
    margin: 32px 0 12px;
}
.product-table{
    width: 100%;
    border:1px solid rgba(0,0,0,0.15);
}
.product-table thead{
    background:rgba(232,232,232,1);
    font-weight:500;
    color:rgba(0,0,0,0.65);
}
.product-table tr td:first-child{
    padding-left: 32px;
}
.product-table td{
    padding: 22px 16px 22px 0;
}
.product-table thead td,.product-code td{
    height: 38px;
    padding: 0 16px 0;
}
.product-code td{
    background:rgba(243,243,243,1);
    border-top: 1px solid #E8E8E8;
}
.product-name{
    display: inline-block;
    height:24px;
    background:rgba(243,243,243,1);
    border-radius:2px;
    font-size:12px;
    font-weight:500;
    color:rgba(0,0,0,0.45);
    padding: 4px 5px;
}
</style>