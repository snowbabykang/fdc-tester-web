<template>
    <section>
        <a-modal
          centered
          :footer="null"
          :closable="true"
          :width="527"
          v-model="isvisible"
          @cancel = "handleCancel()"
        >
          <div class="sample">
            <div class="sample-info">
              <span>!</span>
              <span>请确认收到样布及委托单</span>
            </div>
            <a-button type="primary" ghost @click="handleOk()">确定</a-button>
          </div>
        </a-modal>
    </section>
</template>

<script>
export default {
    name: 'confirmReceived',
    props: {
        visible: { type: Boolean, default: false },
    },
    data() {
        return {
        };
    },
    computed : {         //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                return this.visible;
            },
            set: function () {

            }
        }
    },
    methods: {
        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        handleOk(e) {
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('confirm');  // 传递确认事件
        },
    },
}
</script>
<style scoped>
.sample {
  text-align: center;
}
.sample .sample-info {
  margin: 35px 0px 50px 0px;
}
.sample .sample-info span:first-child {
  display: inline-block;
  width: 22px;
  height: 22px;
  margin-right: 16px;
  background: rgba(250, 173, 20, 1);
  color: #fff;
  text-align: center;
  border-radius: 100%;
}
.sample .sample-info span:nth-child(2) {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>
