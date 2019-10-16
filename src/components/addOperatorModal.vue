<!-- 新建编辑操作员modal -->
<template>
  <section class="">
    <a-modal
      centered
      :footer="null"
      :width="527"
      v-model="isvisible"
      @cancel = "handleCancel()"
    >
      <a-form :form="form" class="form-item-label-left myform">
        <a-form-item v-bind="formItemLayout" label="手机号码">
          <a-input :disabled="disabled" v-decorator="['username',{rules : phoneRule}]" placeholder="请输入"/>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="权限组" extra="提示：默认密码为手机号后6位">
          <a-select
            v-decorator="['roleid',{rules: [{required:true, message: '请选择权限组!' }]}]"
            placeholder="请选择">
            <a-select-option :value="item.id" v-for="item in rolelist" :key="item.id"> {{item.roleName}} </a-select-option>
          </a-select>
        </a-form-item>
        <div class="text-center" style="margin-top: 42px;">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </a-form>
    </a-modal>
  </section>
</template>
<script>
  import {getAllRoleList, createOperatorList, redactOperatorList} from '@/service/getData'
  export default {
    name: 'addOperatorModal',
    props: {
      visible: { type: Boolean, default: false },
      record: {default: {}}
    },
    data() {
      return {
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
        },
        rolelist : [],
        phoneRule : [
          { required: true, message: '请填写手机号' },
          { pattern : /^1[3456789][0-9]{9}$/, message: '请填写正确手机号' },
        ],
        disabled: false,
      };
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    computed : {
      isvisible: {     //点击背景阴影隐藏model
        get: function () {
          this.form.resetFields();
          if(this.record.roleName && this.visible){
            this.disabled = true
            this.form.getFieldDecorator('userId', { preserve: true });
            setTimeout(()=>{
              this.form.setFieldsValue({
                username : this.record.phone,
                roleid : this.record.roleId,
                userId : this.record.userId
              });
            },0)
          } else {
            this.disabled = false
          }
          return this.visible;
        },
        set: function () {

        }
      },
    },
    methods: {
      // 取消
      handleCancel(){
        this.$emit('update:visible', false);    // 更新visible的值
        this.$emit('cancel');   // 传递取消事件
      },
      // 提交
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            let userId = values.userId || '';
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('confirm');  // 传递确认事件
            if(userId) { // 编辑
              redactOperatorList(this.$store.getters.getOrgId, 1,values.roleid, this.$store.getters.getStoreId, values.userId).then(res=>{
                if(res.code===200){
                  this.$emit('update:visible', false);    // 更新visible的值
                  this.$emit('confirm');  // 传递确认事件
                }
              })
            } else {  // 新增
              createOperatorList(this.$store.getters.getOrgId, 1, values.username,values.roleid, this.$store.getters.getStoreId).then(res=>{
                if(res.code===200){
                  this.$emit('update:visible', false);    // 更新visible的值
                  this.$emit('confirm');  // 传递确认事件
                }
              })
            }
          }
        });
      },
    },
    mounted(){
      getAllRoleList(1,this.$store.getters.getStoreId).then((res) => {
        if(res && res.code == 200){
          this.rolelist = res.data;
        }
      })
    }
  };
</script>
<style scoped>
  .myform{
    padding: 42px 8px 8px;
  }
</style>
