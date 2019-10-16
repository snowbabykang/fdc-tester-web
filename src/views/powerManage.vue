<template>
  <section>
    <section class="content-white-box">
      <div class="big-border-title">权限设置</div>
      <section class="steplist">
        <router-link class="btn active" to="/powerManage">操作员</router-link>
        <router-link class="btn" to="/roleSet">权限组</router-link>
      </section>
      <a-button v-if="checkPower()" type="primary" class="addbtn"  @click="addOperator">添加操作员</a-button>
      <a-table :columns="columns" :rowSelection="rowSelection"
               :rowKey="record => record.userId"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
      >
        <template slot="action" slot-scope="record">
          <div v-if="!record.editable">超级管理员不可编辑</div>
          <div v-if="record.editable && checkPower()">
            <a href="javascript:void(0);" class="btn-link" @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:void(0);" class="btn-link" @click="deleteOperator(record.userId)">删除</a>
          </div>

        </template>
      </a-table>
      <div v-if="data.length > 0 && checkPower()" style="margin-top: -38px;"><a @click="alldel"> 批量删除</a></div>
    </section>
    <addOperatorModal :visible.sync="visible" :record="record" @confirm="confirm" />
  </section>

</template>
<script>
  import addOperatorModal from '../components/addOperatorModal'
  import {getOperatorList, deleteOperatorList} from '../service/getData'

  const columns = [
    {title: '登录名', dataIndex: 'phone', },
    {title: '上次登录', dataIndex: 'lastLoginTime', },
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
      visible : false,
      record: {}
    }
  },
    components: {
      addOperatorModal
    },
  computed : {
        rowSelection() {
            const { selectedRowKeys } = this;
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys
                },
                getCheckboxProps: record => ({
                  props: {
                    disabled: !record.editable, 
                  }
                }),
            }
        },
  },
  methods: {
      // 获取操作员列表数据
      async initData (orgId,panelType, page, size) {
        this.loading = true;
        let res = await getOperatorList(orgId,panelType, page, size);
        if (res && res.code == 200) {
          const pagination = {...this.pagination};
          pagination.total = res.data.total;
          pagination.pageSize = size;
          this.loading = false;
          this.data = res.data.list;
          this.pagination = pagination
        }
      },
      handleTableChange (pagination) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.initData(this.$store.getters.getOrgId, 1, pagination.current-1,this.pagesize);
      },
      // 添加操作员
      addOperator () {
        this.record = "";
        this.visible=true;
      },
      edit(record){
        this.visible=true;
        this.record = record;
      },
      confirm(){
        this.initData(this.$store.getters.getOrgId, 1, 0, this.pagesize);
        this.GLOBAL.getPower();
      },
      deleteOperator(id){
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
        deleteOperatorList(this.$store.getters.getOrgId, 1, this.$store.getters.getStoreId, arr).then((res) => {
          if(res && res.code == 200) {
            this.initData(this.$store.getters.getOrgId, 1, 0, this.pagesize);
          }
        })
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
      }
    },
    mounted () {
      this.initData(this.$store.getters.getOrgId, 1, 0, this.pagesize)
    },
};
</script>
<style scoped>
  .expanderTb{
    width: 100%;
  }
  .expanderTb tr:first-child td{
    padding-bottom: 22px;
  }
  .addbtn{
    float: right;
  }
</style>
