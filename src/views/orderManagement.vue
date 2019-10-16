<template>
  <section class="content-white-box">
    <a-form layout="inline">
      <a-form-item label="下单时间" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-range-picker @change="onChangeTime"/>
      </a-form-item>
      <a-form-item
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        label="委托人"
        style="margin-left: 20px;"
      >
        <a-input placeholder="请输入" v-model="orderInfo.userName"/>
      </a-form-item>
      <a-form-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17}"
        label="订单编号"
        style="margin-left: 20px;"
      >
        <a-input placeholder="请输入" v-model="orderInfo.orderCode"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="margin-left: 20px;" @click="search()" ghost>搜索</a-button>
      </a-form-item>
    </a-form>
    <div class="status-box">
      <a-radio-group @change="onChange" v-model="isActive">
        <a-radio-button
          :value="statusValue.status"
          v-for="(statusValue,index) in statusValue"
          :key="index"
        >{{statusValue.name}}</a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="loadingData" style="text-align:center;line-height: 500px;">
      <a-spin size="large" />
    </div>
    <table class="order-table" v-if="datalist.length>0">
      <thead>
        <tr>
          <td width="200">商品详情</td>
          <td>单价</td>
          <td>订单总价</td>
          <td>委托人</td>
          <td>状态</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody v-for="(item,id) in datalist" v-if="item.typeId != 1">
        <tr class="order-code">
          <td colspan="4">
            <span>{{item.orderTime}}</span>
            <span style="margin-left: 24px;">订单编号：{{item.orderCode}}</span>
          </td>
          <td style="text-align: right;padding-right: 20px;">
            <button type="button" class="action-btn" v-if="item.typeId == 3 && item.sendType == 1" @click="showDeliverBySend(item.orderCode,0)">寄样物流</button>
            <button type="button" class="action-btn" v-if="item.typeId == 3 && item.sendType == 0">亲自送样</button>
            <button type="button" class="action-btn" v-if="item.typeId == 6" @click="getReport(item.id)">查看报告</button>
            <button type="button" class="action-btn" v-if="item.typeId == 7" @click="showDeliverBySend(item.orderCode,1)">检测物流</button>
          </td>
          <td>
            <router-link :to="'/orderDetail/'+item.orderCode" class="textover">
              <button type="button" class="action-btn">查看订单</button>
            </router-link>
          </td>
        </tr>
        <tr>
          <td width="40%" style="padding: 24px 19px;">
            <div class="order-product">
              <span style="width: 3em;">项目：</span>
              <ul>
                <li
                  v-for="(items,index) in item.orderCommodityList"
                  :key="index"
                >{{items.commodityName}}</li>
              </ul>
            </div>
            <span>样品数量：{{item.sampleNumber}}份</span>
            <span style="margin-left: 24px;" v-if="item.isUrgent==0">交期：常规</span>
            <span style="margin-left: 24px;" v-if="item.isUrgent==1">交期：加急</span>
          </td>
          <td>¥ {{item.unitPrice}}</td>
          <td>¥ {{item.totalPrices}}</td>
          <td>{{item.userName}}</td>
          <td><span v-if="item.typeId">{{orderStatus[item.typeId]}}</span></td>
          <td>
            <a
              href="javascript:void(0);"
              class="trigger-btn"
              v-if="item.typeId == 2"
              @click="showEntrust(item.orderCode)"
            >查看委托书</a>
            <a
              href="javascript:void(0);"
              class="trigger-btn"
              v-else-if="item.typeId == 3 && checkPower()"
              @click="handleCollection(item.orderCode)"
            >确认收样</a>
            <a
              href="javascript:void(0);"
              class="trigger-btn"
              v-else-if="item.typeId == 4  && checkPower()"
              @click="handleDetection(item.orderCode)"
            >开始检测</a>
            <a href="javascript:void(0);" v-else-if="item.typeId == 5 && checkPower()" @click="handleClick(item.orderCode)">
              <a-upload
                name="file"
                :multiple="true"
                :showUploadList="false"
                :action="GLOBAL.uploadUrl"
                :data="uploadData"
                :headers="headers"
                @change="handleChange"
              >
                <a-button class="trigger-btn" style="padding-top: 0;width: auto;">上传报告单</a-button>
              </a-upload>
              <a href="javascript:void(0);" class="trigger-btn" @click="handleAlert(item.orderCode)">确认完成</a>
            </a>
            <a
              href="javascript:void(0);"
              class="trigger-btn"
              v-else-if="item.typeId == 6 && checkPower()"
              @click="showDeliverByFill(item.orderCode)"
            >填写快递单</a>
            <span v-else>————</span>
          </td>
        </tr>
      </tbody>
    </table>
    <noData v-else />
    <div class="pagination-box" v-if="datalist.length>0">
      <a-pagination
        :current="current"
        :total="total"
        :showTotal="total => `共 ${total} 条数据`"
        @change="onChangePage"
      ></a-pagination>
    </div>
    <confirm-received :visible.sync="visible" @confirm="iorderok()"></confirm-received>
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
  </section>
</template>
<script>
import submitSuccessModal from "../components/submitSuccessModal";
import fillCourierModal from "../components/fillCourierModal";
import entrustModal from "../components/entrustModal";
import confirmReceived from "../components/confirmReceived";
import noData from "../components/noData";
import {orderStatus} from '../api/dictionary'
import { getOrderList, iorder, expressList,showEntrust,downEntrust ,downLoadReport} from "@/service/getData";
let valuess = "";
export default {
  components: {
    submitSuccessModal,
    fillCourierModal,
    entrustModal,
    confirmReceived,
    noData
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      orderInfo: {
        storeId: this.$store.getters.getStoreId,
        typeId: "",
        orderCode: "", //订单编号
        overTime: "", //下单结束时间
        startTime: "", //下单开始时间
        pageNum: "",
        pageSize: "",
        userName: "" //委托人
      },
      distribution: {
        expressCompany0: "",
        expressNumber0: "",
        expressCompany1: "",
        expressNumber1: ""
      },
      isActive: "",
      headers: {
        authorization: "authorization-text"
      },
      statusValue: [
        { name: "全部订单", status: "" },
        { name: "已付款", status: 2 },
        { name: "已寄样", status: 3 },
        { name: "已收样", status: 4 },
        { name: "检测中", status: 5 },
        { name: "检测完成", status: 6 },
        { name: "待收单", status: 7 },
        { name: "已完成", status: 8 },
        { name: "已取消", status: 9 }
      ],
      datalist: [],
      current: 1,
      total: 0,
      currentPage: 1,
      visible: false,
      showFillModel: false,
      onlyShow: false,
      orderright: [],
      flag: "",
      orderCode: "",
      fillModelById: 0,
      orderStatus: orderStatus,  //订单状态文字显示
      uploadReport: false,
      uploadData : '',
      orderId: '',
      uploadPath: [],
      entrustVisible: false,
      loadingData: true,
    };
  },
  methods: {
    search() {
      this.current = 1;
      this.onChangePage(this.current, this.orderInfo.typeId);
    },
    iorderok() {
      iorder(this.orderCode,4).then(res => {
        if(res && res.code == 200){
            this.current = 1;
            this.onChangePage(this.current, this.orderInfo.typeId);
        }
      })
    },
    handleDetection(orderCode) {
      let that = this;
      this.$confirm({
        title: "确认开始检测？",
        onOk() {
          iorder(orderCode, 5).then(res => {
            if (res && res.code == 200) {
              that.$message.success("开始检测成功");
              that.current = 1;
              that.onChangePage(that.current, that.orderInfo.typeId);
            }
          });
        }
      });
    },
    onChangeTime(date, dateString) {
      console.log(dateString);
      this.orderInfo.startTime = dateString[0];
      this.orderInfo.overTime = dateString[1];
    },
    onChange(e) {
      this.orderInfo.typeId = e.target.value;
      this.current = 1;
      this.onChangePage(this.current, this.orderInfo.typeId);
    },
    //查看委托书
    showEntrust(orderCode) {
      this.entrust = showEntrust(orderCode);
      this.entrustVisible = true;
    },
    getDownEntrust(){
       window.open(downEntrust(this.orderCode));
    },
    handleCollection(orderCode) {
      //确认收样
      this.visible = true;
      this.orderCode = orderCode;
      console.log(orderCode);
    },
    showDeliverBySend(orderCode, flag) {
      //寄样物流
      this.onlyShow = true;
      this.showFillModel = true;
      // this.fillModelById = id;
      this.orderCode = orderCode;
      this.flag = flag;
      console.log(orderCode);
      this.expressList(this.orderCode, this.flag);
    },
    expressList(orderCode, flag) {
        (this.distribution = {
          expressCompany0: "",
          expressNumber0: "",
          expressCompany1: "",
          expressNumber1: ""
        }),
        expressList(orderCode, flag).then(res => {
          if (res && res.code == 200) {
            for (var index in res.data) {
              if (res.data[index].flag == 0) {
                this.distribution.expressCompany0 = res.data[index].expressCompany;
                this.distribution.expressNumber0 = res.data[index].expressNumber;
              } else if (res.data[index].flag == 1) {
                this.distribution.expressCompany1 = res.data[index].expressCompany;
                this.distribution.expressNumber1 = res.data[index].expressNumber;
              }
            }
          }
        });
    },
    showDeliverByFill(orderCode) {
      //填写物流
      this.onlyShow = false;
      this.showFillModel = true;
      this.orderCode = orderCode;
    },
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
    handleClick(orderCode){
      this.uploadData = {'functionCode' : 4,'id' : orderCode};
      console.log(this.uploadData);
    },
    handleAlert(orderCode){
      this.orderCode = orderCode;
      if(this.uploadPath.length){
        this.uploadReport = true;
      }else{
        this.$message.error("请上传报告单");
      }
    },
    handleOk(){
      let fileHostShowDtos = this.uploadPath;
      iorder(this.orderCode,6,fileHostShowDtos).then(res => {
        if (res && res.code == 200) {
          this.uploadReport = false;
          this.current = 1;
          this.onChangePage(this.current, this.orderInfo.typeId);
        }
      });
    },
    // 分页
    onChangePage(current, typeId) {
      this.current = current;
      this.orderInfo.pageNum = current;
      this.showOrderList(this.orderInfo);
    },
    showOrderList(orderInfo) {
      getOrderList(orderInfo).then(res => {
        if (res && res.code == 200) {
          this.loadingData = false;
          this.datalist = res.data.iorder;
          this.total = res.data.count;
          this.current = this.orderInfo.pageNum;
        }
      });
    },
    finshFill(){
      this.showFillModel = false;
      this.current = 1;
      this.onChangePage(this.current, this.orderInfo.typeId);
    },
    getReport(id){
      window.open(downLoadReport(id));
    }
  },
  mounted() {
    this.current = 1;
    this.orderInfo.typeId = "";
    this.onChangePage(this.current, this.orderInfo.typeId);
  }
};
</script>
<style scoped>
button {
  outline: none;
}
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
button {
  cursor: pointer;
}
.ant-form {
  margin-left: -10px;
}
.status-box {
  margin-top: 37px;
}
.ant-radio-button-wrapper {
  width: 108px;
  height: 38px;
  line-height: 38px;
  text-align: -webkit-center;
  color: #fff;
  background: rgba(153, 153, 153, 1);
  border-radius: 0;
}
.ant-radio-button-wrapper-checked {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(217, 217, 216, 1);
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  border-top: 2px solid #044fe8;
  box-shadow: 0 0 0 0 #044fe8;
}
.order-table {
  width: 100%;
  padding-left: 19px;
  margin-top: 25px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(51, 51, 51, 1);
}
.order-table thead {
  background: rgba(232, 232, 232, 1);
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 38px;
}
.order-table tr td:first-child {
  padding-left: 19px;
}
.order-table .order-code {
  background: rgba(243, 243, 243, 1);
  line-height: 38px;
}
.order-product {
  display: flex;
  margin-bottom: 6px;
}
.order-product ul {
  display: flex;
  flex-wrap: wrap;
}
.order-product ul li {
  padding: 0px 9px;
  max-width: 10em;
  min-width: 2em;
  height: 24px;
  background: rgba(243, 243, 243, 1);
  border-radius: 2px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
  margin-right: 6px;
  margin-bottom: 6px;
  box-sizing: content-box;
  overflow: hidden;
}
.action-btn {
  width: 88px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(4, 79, 232, 1);
  line-height: 24px;
  border: 0;
}
.trigger-btn {
  width: 88px;
  padding: 6px 16px;
  background: rgba(4, 79, 232, 1);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 32px;
  border: 0;
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
</style>
