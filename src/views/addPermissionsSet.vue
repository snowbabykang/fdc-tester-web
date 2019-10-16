<template>
  <section class="content-white-box">
    <div class="big-border-title">{{editid ? '编辑' : '添加'}}权限设置</div>
    <a-form :form="form" class="form-item-label-left">
      <a-form-item v-bind="formItemLayout" label="权限组">
        <a-input v-decorator="['roleName', {rules:[{required: true, message: '请输入权限组'}]}]" maxlength="30"></a-input>
      </a-form-item>
      <table class="mytable">
        <tr>
          <th colspan="2">权限设置</th>
        </tr>
        <tr v-for="item in data" :key="item.id">
          <td width="100">
            <a-checkbox @change="checkall(item)" :indeterminate="item.checkall" :checked="item.checked">{{item.permissionName}}</a-checkbox>
          </td>
          <td>
            <span v-for="i in item.sonNodes" :key="i.id" style="padding-right: 64px;">
              <a-checkbox @change="changeSub(item,i)" :checked="i.checked">{{i.permissionName}}</a-checkbox>
              <a-radio-group size="small" v-model="i.permissionType">
                <a-radio-button :value="1" :disabled="!i.checked">操作</a-radio-button>
                <a-radio-button :value="0" :disabled="!i.checked">查看</a-radio-button>
              </a-radio-group>
            </span>
          </td>
        </tr>
      </table>
      <div class="text-center"><a-button type="primary" @click="handleSubmit">确定</a-button></div>
    </a-form>
  </section>
</template>

<script>
  import {getPermissionList, getRoleDetail, createRole, redactRole} from '../service/getData'
  export default {
    name: "addPermissionsSet",
    data () {
      return {
        editid : '',
        data: [],
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 2 },
          wrapperCol: { span: 12 },
        },
        checkedlist : {},
        editChecked : {},    //编辑时获取的权限数组
      }
    },
    mounted () {
      this.editid = this.$route.params.id;
      this.getPermissionList()

    },
    methods: {
      checkall(item){
        let checked = item.checked;
        this.$set(item, 'checked', !checked);
        for(var i in item.sonNodes){
          this.$set(item.sonNodes[i], 'checked', !checked);
          if(!checked){
            this.$set(item.sonNodes[i], 'permissionType', 1);
          }else{
            this.$set(item.sonNodes[i], 'permissionType', null);
          }
        }
      },
      changeSub(main, sub) {
        let checked = sub.checked;
        this.$set(sub, 'checked', !checked);
        if (!checked) {
          this.$set(sub, 'permissionType', 1)
        } else {
          this.$set(sub, 'permissionType', null)
        }
        this.setMaincheck(main)
      },
      setMaincheck (main) {
        let length = main.sonNodes.length;
        let checkedlength = 0;
        for (var i in main.sonNodes) {
          if (main.sonNodes[i].checked) {
            checkedlength++
          }
        }
        main.checkall = !!checkedlength && (checkedlength < length);
        main.checked = checkedlength === length
      },
      handleSubmit () {
        let data = this.data;
        let arr = [];
        for (var i in data) {
          for (var j in data[i].sonNodes) {
            if (data[i].sonNodes[j].checked) {
              arr.push({permissionId: data[i].sonNodes[j].id, permissionType: data[i].sonNodes[j].permissionType,orgId: this.$store.getters.getOrgId,panelType: 1,storeId: this.$store.getters.getStoreId});
            }
          }
          if(data[i].sonNodes.filter(item=>item.checked == true).length){
            arr.push({permissionId: data[i].id, permissionType: data[i].permissionType,orgId: this.$store.getters.getOrgId,panelType: 1,storeId: this.$store.getters.getStoreId})
          }
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!arr.length) {
              this.$message.error('请为权限组选择权限')
              return false;
            }
            if (this.editid) {
              this.edit(this.$store.getters.getOrgId, values.roleName, this.$store.getters.getStoreId, this.editid, arr);
            } else {
              this.add(this.$store.getters.getOrgId, values.roleName, this.$store.getters.getStoreId, arr);
            }
          }
        })
      },
      add (orgId, name, storeId, arr) {
        createRole(orgId, name, storeId, arr).then(res => {
          if (res && res.code ==200) {
            this.$router.push('/roleSet');
          }
        })
      },
      edit (orgId, roleName, storeId, id, rolePermissionList) {
        redactRole(orgId, roleName, storeId, id, rolePermissionList).then(res => {
          if (res && res.code ==200) {
            this.GLOBAL.getPower();
            this.$router.push('/roleSet');
          }
        })
      },

      // 获取功能列表，树结构
      getPermissionList(){
        getPermissionList().then((res) => {
          if(res && res.code == 200){
            this.data = res.data;
            if(this.editid){
              this.getEditCheckedlist();
            }
          }
        })
      },
      // 编辑时获取当前权限组原本选中的权限
      getEditCheckedlist(){
        getRoleDetail(this.$store.getters.getOrgId, 1, this.editid).then((res) => {
          if(res && res.code == 200){
            this.form.setFieldsValue({
              roleName : res.data.roleName,
            });
            let permissions = res.data.permissions;
            for(var i in permissions){
              for(var j in permissions[i].sonNodes){
                this.editChecked[permissions[i].sonNodes[j].id] = permissions[i].sonNodes[j].permissionType;
              }
            }
            this.setChecked();
          }
        })
      },
      // 编辑赋值
      setChecked(){
        let data = this.data;
        let editChecked = this.editChecked;
        for(var i in data){
          for(var j in data[i].sonNodes){
            let id = data[i].sonNodes[j].id;
            if(editChecked[id] == 1 || editChecked[id] == 0){
              this.$set(data[i].sonNodes[j], 'checked', true);
              this.$set(data[i].sonNodes[j], 'permissionType', parseInt(editChecked[id]))
            }
          }
          this.setMaincheck(data[i]);
        }
      }
    }
  }

</script>

<style scoped>
  .mytable{
    border: 1px solid #D9D9D8;
    border-bottom: none;
    width: 100%;
    margin-bottom: 64px;
  }
  .mytable tr th{
    background: #E8E8E8;
    padding: 8px 10px;
  }
  .mytable tr td{
    border-bottom: 1px solid #D9D9D8;
    padding: 14px 10px;
  }
</style>
