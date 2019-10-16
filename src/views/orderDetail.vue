<template>
  <div class="container" v-if="data">
    <div class="top flexbox">
      <p>
        订单编号：
        <span>{{data.iorders.orderCode}}</span>
      </p>
      <p>
        下单时间：
        <span>{{data.iorders.createTime}}</span>
      </p>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 2">
      <p class="status-icon">
        <a-icon type="check-circle"/>已付款
      </p>
      <a-button type="primary" @click="showEntrust()">查看委托书</a-button>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 3">
      <p class="status-icon">
        <span class="icon-uniE900"></span>已寄样
      </p>
      <a-button type="primary" v-if="checkPower()" @click="showSample=true">确认收样</a-button>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 4">
      <p class="status-icon">
        <span class="icon-uniE900"></span>已收样
      </p>
      <a-button type="primary" v-if="checkPower()" @click="upDateIorderTypeId(5)">开始检测</a-button>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 5">
      <p class="status-icon">
        <a-icon type="clock-circle"/>检测中
      </p>
      <a-upload
        name="file"
        :multiple="true"
        :showUploadList="false"
        :action="GLOBAL.uploadUrl"
        :data="uploadData"
        :headers="headers"
        @change="handleChange"
        v-if="checkPower()">
        <a-button type="primary" class="trigger-btn" style="padding-top: 0;">上传报告单</a-button>
      </a-upload>
      <a-button type="primary" class="trigger-btn" style="padding-top: 0;" v-if="checkPower()" @click="handleAlert()">确认完成</a-button>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 6">
      <p class="status-icon">
        <a-icon type="check-circle"/>检测完成
      </p>
      <a-button type="primary" v-if="checkPower()" @click="fillCourierModal()">填写快递单号</a-button>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 7">
      <p class="status-icon" style="margin-top: 10px;">
        <a-icon type="clock-circle" style="color: #000000;"/>待收单
      </p>
      <p class="status-confirm">还剩{{countdownTime}}自动确认</p>
      <a-button type="primary" style="margin-top: 10px;" @click="getReport()">查看报告单</a-button>
    </div>
    <div class="status borderline status-line" v-if="data.iorders.typeId == 8">
      <p class="status-icon">
        <a-icon type="check-circle"/>已完成
      </p>
    </div>
    <div class="status borderline" v-if="data.iorders.typeId == 9">
      <p class="status-icon" style="margin-top: 54px;">
        <a-icon type="close-circle" style="color: #E6242E;"/>已取消
      </p>
      <span class="status-cause">取消原因：{{cancelReasonText[data.iorders.cancelReason]}}</span>
    </div>
    <div class="service borderline">
      <div class="title">服务信息</div>
      <table class="service-table">
        <thead>
          <tr>
            <td>项目</td>
            <td width="10%">交期</td>
            <td width="10%">数量</td>
            <td width="10%">实付款</td>
            <td width="20%">操作</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding-top: 11px;">
              <span
                class="service-name"
                v-for="(item,index) in data.iorders.orderCommodityList"
                :key="index"
              >{{item.commodityName}}</span>
            </td>
            <td>
              <span v-if="data.iorders.isUrgent==0">常规</span>
              <span v-if="data.iorders.isUrgent==1">加急</span>
            </td>
            <td>{{data.iorders.sampleNumber}}份</td>
            <td v-if="data.payments">¥ {{data.payments.paymentAmount}}</td>
            <td v-else>未付款</td>
            <td>
              <a href="javascript:;" class="action-btn" @click="showEntrust()">查看委托书</a>
              <a href="javascript:;" class="action-btn" v-if="data.iorders.typeId >= 6" @click="getReport()">查看报告单</a>
            </td>
          </tr>
        </tbody>
        <transition name="slide-fade">
          <tbody v-if="showAllProject">
            <tr style="background:rgba(197,194,194,0.15);">
              <td>单项目</td>
              <td>单价</td>
              <td>样品数量</td>
              <td>合计</td>
              <td>实付款</td>
            </tr>
            <tr v-for="(item,index) in data.iorders.orderCommodityList" :key="index">
              <td style="padding-top: 11px;">
                <span class="service-name">{{item.commodityName}}</span>
              </td>
              <td>¥ {{item.urgentPrice}}</td>

              <td v-if="item.commodityName == '加印报告'"> {{item.count}}份</td>
              <td v-else>{{data.iorders.sampleNumber}}份</td>

              <td v-if="item.commodityName == '加印报告'">¥ {{item.urgentPrice | capitalize(item.count)}}</td>
              <td v-else>¥ {{item.urgentPrice | capitalize(data.iorders.sampleNumber)}}</td>

              <td :rowspan="data.iorders.orderCommodityList.length" v-if="index == 0 && data.payments">¥ {{data.payments.paymentAmount}}</td>
              <td :rowspan="data.iorders.orderCommodityList.length" v-if="index == 0 && !data.payments">未付款</td>
            </tr>
          </tbody>
        </transition>
      </table>
      <a-button class="service-allbtn" ghost @click="showAllProMethods()">{{showAllProjectBtn}}</a-button>
    </div>
    <div class="service borderline">
      <div class="title">支付信息</div>
      <div class="info">
          <a-row type="flex">
            <a-col class="status_title">支付信息：</a-col>
            <a-col :span="18" v-if="data.payments">{{paymentTypes[data.payments.paymentType]}}</a-col>
          </a-row>
          <a-row type="flex">
            <a-col class="status_title">付款时间：</a-col>
            <a-col :span="18" v-if="data.payments">{{data.payments.createTime}}</a-col>
          </a-row>
      </div>
    </div>
    <div class="service borderline" v-if="data.iorders.typeId != 2">
      <div class="title">物流信息</div>
      <a-row class="info">
        <a-col :span="10" v-if="data.iorders.sendType == 0" style="margin-bottom: 8px;">
          亲自送样
        </a-col>
        <a-col :span="10" v-for="(item,index) in data.express" :key="index" style="margin-bottom: 8px;">
          <a-row type="flex">
            <a-col class="status_title" v-if="item.flag == 0 && data.iorders.sendType == 1">寄样物流单号：</a-col>
            <a-col class="status_title" v-if="item.flag == 1">检测物流单号：</a-col>
            <a-col :span="18" v-if="data.express">
              <span class="wordbreak">{{item.expressNumber}}</span>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col class="status_title">快递公司：</a-col>
            <a-col :span="18" v-if="data.express">
              <span class="wordbreak">{{item.expressCompany}}</span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <confirm-received :visible.sync="showSample" @confirm="upDateIorderTypeId(4)"></confirm-received>
    <fill-courier-modal
      :visible.sync="showFillModel"
      :onlyShow="onlyShow"
      :orderCode="orderCode"
      :distribution="distribution"
      @iorder="finshFill()"
    ></fill-courier-modal>
    <a-modal
        centered
        :maskClosable="false"
        :keyboard="false"
        :closable="true"
        :footer="null"
        v-model="uploadReport"
        :width="440"
    >
        <div class="quality-success-box">
            <div class="message">是否上传完毕，进入“检测完成”状态后不可上传，请确认无误</div>
            <div class="btnlist">
                <a-button type="primary" ghost @click="handleOk()">确定</a-button>
            </div>
        </div>
    </a-modal>
    <entrustModal :visible.sync="entrustVisible" :imgSrc="entrust" @confirm="getDownEntrust()"></entrustModal>
  </div>
  <div v-else style="text-align:center;line-height: 500px;">
    <a-spin size="large" />
  </div>
</template>
<script>
import { Modal } from "ant-design-vue";
import fillCourierModal from "../components/fillCourierModal";
import entrustModal from "../components/entrustModal";
import confirmReceived from "../components/confirmReceived";
import {paymentTypes,cancelReasonText} from '../api/dictionary'
import {orderInformation,downLoadReport,downEntrust,showEntrust,iorder} from "@/service/getData";
export default {
  components: {
    fillCourierModal,entrustModal,confirmReceived
  },
  data() {
    return {
      orderCodeByRoute: this.$route.params.id, //暂时用id替代
      showSample: false,
      showFillModel: false,
      onlyShow: false,
      data: "",
      orderCode: "",
      fillModelById: 0,
      distribution: {
        expressCompany0: "",
        expressNumber0: "",
        expressCompany1: "",
        expressNumber1: ""
      },
      showAllProject: false,
      showAllProjectBtn: "查看所有项目",
      paymentTypes: paymentTypes,
      uploadData: {'functionCode' : 4,'id' : this.$route.params.id},
      uploadReport: false,
      uploadPath: [],
      cancelReasonText: cancelReasonText,
      entrustVisible: false,
      countdown: true,
      countdownTime: '',
    };
  },
  filters: {
    capitalizePay: function(paymentAmount, commissionRate) {
      if (!paymentAmount) return "";
      commissionRate = commissionRate / 100;
      return paymentAmount * commissionRate;
    },
    capitalize: function(price, quantity) {
      if (!price) return "";
      return price * quantity;
    },
    capitalizeQuantity(commodityPrice, commodityQuantity, commissionRate) {
      if (!commodityPrice) return "";
      commissionRate = commissionRate / 100;
      return commodityPrice * commodityQuantity * commissionRate;
    }
  },
  methods: {
    handleChange(info) {    //上传报告
      if (info.file.status !== "uploading") {
         console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 文件上传成功`);
        if(info.file.response.code == 200){
          this.uploadPath.push({'fileUrl':info.file.response.data[0].path});
        }
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
    },
    handleAlert(){
      if(this.uploadPath.length){
        this.uploadReport = true;
      }else{
        this.$message.error("请上传报告单");
      }
    },
    handleOk(){
      let fileHostShowDtos = this.uploadPath;
      iorder(this.orderCodeByRoute,6,fileHostShowDtos).then(res => {
        if (res && res.code == 200) {
          this.uploadReport = false;
          this.getOrderInfo();
        }
      });
    },
    fillCourierModal(id) {
      this.showFillModel = true;
      this.orderCode = this.orderCodeByRoute;
    },
    finshFill(){
      this.showFillModel = false;
      this.getOrderInfo();
    },
    showAllProMethods() {
      if (this.showAllProject) {
        this.showAllProject = false;
        this.showAllProjectBtn = "查看所有项目";
      } else {
        this.showAllProject = true;
        this.showAllProjectBtn = "收起所有项目";
      }
    },
    upDateIorderTypeId(typeId){
      iorder(this.orderCodeByRoute, typeId).then(res => {
        if (res && res.code == 200) {
          this.getOrderInfo();
          if(typeId == 4){
            this.showSample = false;
          }
        }
      });
    },
    getOrderInfo(){
      orderInformation(this.orderCodeByRoute).then(res => {
        if (res && res.code == 200) {
          this.data = res.data;
          if(res.data.iorders.typeId == 7){
            this.countdown = true;
            this.goCountdown();
          }
        }
      });
    },
    showEntrust(){
      this.entrust = showEntrust(this.orderCodeByRoute);
      this.entrustVisible = true;
    },
    getDownEntrust(){
       window.open(downEntrust(this.orderCodeByRoute));
    },
    getReport(){
      window.open(downLoadReport(this.data.iorders.id));
    },
    goCountdown(){
      if(this.countdown){
        --this.data.iorders.min;
        if(!this.data.iorders.day){
          this.data.iorders.day = 0;
        }
        if(this.data.iorders.min < 0){
            --this.data.iorders.hour;
            this.data.iorders.min = 59;
        }
        if(this.data.iorders.hour < 0){
            --this.data.iorders.day;
            this.data.iorders.hour=23
        }
        if(this.data.iorders.day < 0){
            this.data.iorders.min = 0;
            this.data.iorders.hour = 0;
            this.data.iorders.day = 0;
        }
        this.countdownTime = this.data.iorders.day+"天"+this.data.iorders.hour+"时"+this.data.iorders.min+"分";
        setTimeout(this.goCountdown,60000);
      }
      if(this.data.iorders.min == 0 && this.data.iorders.hour == 0 && this.data.iorders.day == 0){
        this.countdown = false;
      }
    }

  },
  mounted() {
    this.getOrderInfo();
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
p {
  margin: 0;
  bottom: 0;
}
.flexbox {
  display: flex;
}
.borderline {
  border-top: 8px solid #f2f2f2;
}
.container {
  background: #fff;
}
.top {
  padding: 0px 32px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  line-height: 38px;
}
.top p span {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  margin: 0px 132px 0px 41px;
}
.status {
  height: 135px;
  text-align: center;
  box-sizing: border-box;
  font-size: 18px;
}
.status-icon {
  margin-top: 24px;
}
.status-cause {
  font-size: 14px;
}
.status-line {
  line-height: 86px;
}
.status-icon i,
.status-icon span {
  margin-right: 20px;
  font-size: 24px;
  color: #52c41a;
  vertical-align: text-top;
}
.status-confirm {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(230, 36, 46, 1);
}
.status button {
  height: 38px;
  margin-top: 20px;
}
.service {
  padding: 32px;
}
.title {
  width: 96px;
  height: 25px;
  border-left: 3px solid rgba(4, 79, 232, 1);
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  line-height: 28px;
  text-align: center;
}
.service-table {
  width: 100%;
  padding-left: 19px;
  margin-top: 25px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(51, 51, 51, 1);
}
.service-table thead {
  background: rgba(232, 232, 232, 1);
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 38px;
}
.service-table tr {
  height: 47px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.service-table tr td:first-child {
  padding-left: 11px;
}
.service-name {
  padding: 6px 9px;
  background: rgba(243, 243, 243, 1);
  border-radius: 2px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
}
.info {
  margin-top: 34px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  line-height: 38px;
}
.action-btn {
  text-decoration: none;
}
.service-allbtn {
  margin-top: -1px;
  margin-left: calc(50% - 116px);
  color: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(217, 217, 216, 1);
  border-top: 1px solid #fff;
  border-radius: 0;
}
.quality-success-box{
    text-align: center;
    padding-bottom: 8px;
    padding-top: 18px;
}
.quality-success-box .message{
    font-size:16px;
    font-weight:500;
    color:rgba(0,0,0,0.65);
    margin: 24px 0 32px;
}
.quality-success-box .ant-btn{
    margin: 0 16px;
}
.status_title{
  width: 7em;
}
.wordbreak{
  word-break: break-all;
}
</style>
