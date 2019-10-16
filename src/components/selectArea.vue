<template>
    <section>
        <a-select placeholder="省" @change="handleChangeP(provinceVal)" v-model="provinceVal">
            <a-select-option :value="item.id" v-for="item in provinceData" :key="item.id">{{item.addressName}}</a-select-option>
        </a-select>
        <a-select placeholder="市" @change="handleChangeC(cityVal)" :disabled="cityDisabled" v-model="cityVal">
            <a-select-option :value="item.id" v-for="item in cityData" :key="item.id">{{item.addressName}}</a-select-option>
        </a-select>
        <a-select placeholder="区" @change="handleChangeA(areaVal)" :disabled="areaDisabled" v-model="areaVal">
            <a-select-option :value="item.id" v-for="item in areaData" :key="item.id">{{item.addressName}}</a-select-option>
        </a-select>
    </section>
</template>
<script>
import {getProvince,getCity,getArea} from '@/service/getData'
export default {
    name: 'selectArea',
    props: ['addrkey','addr'],
    data() {
        return {
            addrKey : this.addrkey,   //类似工商场地列表每条数据都有选择地址的，方便赋值
            provinceData : [],
            cityData : [],
            areaData : [],
            provinceVal : undefined,
            cityVal : undefined,
            areaVal : undefined,
            cityDisabled : true,
            areaDisabled : true,
            editaddr : {           //编辑地址赋值
                province : '',
                city : '',
                area : '',
            }
        };
    },
    watch : {
        addr(val){
            this.setDefault(val);
        }
    },
    methods: {
        setDefault(val){
            this.editaddr = val;
            if(val.province){
                this.provinceVal = val.province;
                this.handleChangeP(this.provinceVal,1);
            }else{
                this.provinceVal = undefined;
                this.cityVal = undefined;
                this.areaVal = undefined;
            }
        },
        async initData(){
            let res = await getProvince();
            if(res && res.code == 200){
                this.provinceData = res.data;
            }

        },
        handleChangeP(id,type){
            let that = this;
            that.cityDisabled = true;
            that.areaDisabled = true;
            getCity(id).then((res) => {
                if(res && res.code == 200){
                    that.cityData = res.data;
                    that.cityDisabled = false;
                    if(type){
                        that.cityVal = this.addr.city
                    }else{
                        that.cityVal = res.data[0].id;
                    }
                    // that.cityVal = this.addr.city || res.data[0].id;
                    that.handleChangeC(that.cityVal,type);
                }
            })
        },
        handleChangeC(id,type){
            let that = this;
            that.areaDisabled = true;
            getArea(id).then((res) => {
                if(res && res.code == 200){
                    that.areaData = res.data;
                    that.areaDisabled = false;
                    if(type){
                        that.areaVal = this.addr.area
                    }else{
                        that.areaVal = res.data[0].id;
                    }
                    // that.areaVal = this.addr.area || res.data[0].id;
                    that.handleChangeA(that.areaVal,type);
                }
            })
        },
        handleChangeA(id,type){
            let that = this;
            let selectedArea = {
                province : that.provinceVal,
                city : that.cityVal,
                area : that.areaVal,
            };
            this.$emit('selectedArea',selectedArea,this.addrKey);
        }
    },
    mounted() {
        this.initData();
        this.setDefault(this.addr);
    },
};
</script>
<style scoped>
.ant-select{
    width: 160px;
    margin-right: 16px;
}
</style>