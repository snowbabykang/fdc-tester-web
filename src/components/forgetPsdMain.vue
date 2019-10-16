<template>
  <div id="demand-layout">
    <a-layout>
      <a-layout-header> <psd-header></psd-header> </a-layout-header>
      <a-layout-content><router-view/></a-layout-content>
    </a-layout>
  </div>
</template>
<script>
import psdHeader from '../components/forgetPsdHeader'
export default {
  name: 'forgetPadMain',
  data() {
    return {

    }
  },
  components: {
    psdHeader,
  }
}

</script>
<style scoped>
#demand-layout .ant-layout{
  background: #fff;
}
#demand-layout .ant-layout-header {
  padding: 0;
  background:#F0EFF0;
  height: 0.59rem;
  line-height: 0.59rem;
}
#demand-layout .ant-layout-content{
    padding-top: 0.59rem;
    padding-bottom: 1.94rem;
    width: 4rem;
    margin: 0 auto;
}
#demand-layout .ant-layout-content >>> .ant-input,
#demand-layout .ant-layout-content >>> .ant-btn{
  border-radius: 0;
}
#demand-layout .ant-layout-content >>> .ant-btn-primary{
  background: #044FE8;
}
</style>
