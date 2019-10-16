<template>
<section>
    <section class="content-white-box">
        <div class="big-border-title">权限设置</div>
        <section class="steplist">
            <router-link class="btn" to="/powerManage">操作员</router-link>
            <router-link class="btn active" to="/roleSet">权限组</router-link>
        </section>
        <router-link v-if="checkPower()" to="/addPermissionsSet"  class="addbtn"><a-button type="primary">添加权限组</a-button></router-link>
        <a-table :columns="columns" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="action" slot-scope="record">
                <div v-if="checkPower()">
                    <router-link :to="'/redactPermissionsSet/'+record.id" class="btn-link">编辑</router-link>
                    <a-divider type="vertical" />
                    <a href="javascript:void(0);" class="btn-link" @click="deleteRole(record.id)">删除</a>
                </div>
            </template>
        </a-table>
        <div v-if="data.length > 0 && checkPower()" style="margin-top: -38px;"><a @click="alldel"> 批量删除</a></div>
    </section>
</section>
</template>

<script>
import {getRoleList, deleteRole} from '@/service/getData'
const columns = [
    {title: '权限组', dataIndex: 'roleName', },
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];
export default {
    data () {
        return {
            data: [],
            pagination: {},
            loading: false,
            columns,
            pagesize : 10,
            selectedRowKeys: [],
        }
    },
    methods: {
        async initData(panelType, storeId, page,size){
            this.loading = true;
            let res = await getRoleList(panelType, storeId, page, size);
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
            this.initData(1,this.$store.getters.getStoreId,0,pagination.current-1,this.pagesize);
        },
        deleteRole(id){
            let that = this;
            this.$confirm({
                title: '真的要删除吗？',
                onOk() {
                    let arr = [];
                    arr.push(id);
                    that.delete(arr);
                },
            });
        },
        delete(arr){
            deleteRole(this.$store.getters.getOrgId, 1, arr, this.$store.getters.getStoreId).then((res) => {
                if(res && res.code == 200){
                    this.initData(1,this.$store.getters.getStoreId,0,this.pagesize);
                }
            })
        },
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        alldel(){
            if(!this.selectedRowKeys.length){
                this.$notification.error({
                    message: '错误提示',
                    description: '请选择要删除的选项',
                });
            }else{
                let that = this;
                this.$confirm({
                    title: '真的要删除吗？',
                    onOk() {
                        that.delete(that.selectedRowKeys);
                    },
                });

            }
        },
    },
    mounted(){
        this.initData(1,this.$store.getters.getStoreId,0,this.pagesize);
    },

}
</script>

<style scoped>
.addbtn{
    float: right;
    display: block;
}
</style>
