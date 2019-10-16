<template>
  <section>
    <a-modal
      centered
      :closable="false"
      :footer="null"
      v-model="isvisible"
      :width="527"
      :orderCode="orderCode"
      :distribution="distribution"
    >
      <div class="fill-delivery">
        <button class="fill-delivery-close" @click="handleCancel()">
          <a-icon type="close"/>
        </button>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item label="快递物流号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <span v-if="onlyShow">
              <span v-if="this.distribution.expressNumber0">{{this.distribution.expressNumber0}}</span>
              <span v-else>{{this.distribution.expressNumber1}}</span>
            </span>
            <a-input v-else placeholder="填写物流单号，限制数字与字母"  maxLength="30"
              v-decorator="['expressNumber',{rules: [{ required: true, message: '请填写物流单号!' },{
                pattern : /^[a-zA-z0-9]{1,30}$/ ,message: '请填写正确物流单号!'
              }]}]"
            />
          </a-form-item>
          <a-form-item label="配送物流" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <span v-if="onlyShow">
              <span v-if="this.distribution.expressCompany0">{{this.distribution.expressCompany0}}</span>
              <span v-else>{{this.distribution.expressCompany1}}</span>
            </span>
            <a-input v-else placeholder="填写物流公司名称" maxLength="30"
              v-decorator="['expressCompany',{rules: [{ required: true, message: '请填写配送物流!' }]}]"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 10 }" style="margin-bottom: 0;">
            <a-button type="primary" ghost @click="handleCancel()" v-if="onlyShow">确认</a-button>
            <a-button type="primary" ghost html-type="submit" v-else>确认</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </section>
</template>

<script>
import { addExpress } from "@/service/getData";
export default {
  name: "fillCourierModal",
  props: {
    visible: { type: Boolean, default: false },
    onlyShow: { type: Boolean, default: false }, //检查物流信息是否可编辑，默认编辑
    // id: ""
    orderCode: { type: String, default: "" },
    distribution: { type: Object, default: "" }
  },
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  computed : {      
      isvisible : {     //点击背景阴影隐藏model
          get: function () {
              this.form.resetFields();
              return this.visible;
          },
          set: function () {

          }
      },
  },
  methods: {
    handleSubmit(e) {
      //填写物流表单提交
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.expressSave(this.orderCode, values);
        }
      });
    },
    expressSave(orderCode, values) {
      let expressNumber = values.expressNumber;
      let expressCompany = values.expressCompany;
      addExpress(orderCode, expressNumber, expressCompany).then(res => {
        if (res && res.code == 200) {
          this.$emit("iorder");
        }
      });
    },
    handleCancel() {
      this.$emit("update:visible", false); // 更新visible的值
      this.$emit("cancel"); // 传递取消事件
    }
  },
  mounted() {
    // console.log(this.id);
  }
};
</script>
<style scoped>
.fill-delivery {
  position: relative;
  margin-top: 26px;
  margin-bottom: 8px;
}
.fill-delivery form {
  margin: auto;
}
.fill-delivery form >>> .ant-form-item-label {
  text-align: left !important;
}
.fill-delivery form >>> .ant-form-item-label .ant-form-item-required::before {
  display: none;
}
.fill-delivery-close {
  border: 0;
  background: transparent;
  position: absolute;
  top: -35px;
  right: -20px;
  cursor: pointer;
}
</style>
