<template>
  <div class="car-model" v-show="showCarModel">
    <header>
      <i class="icon-back" @click="goback"></i>
      <span>{{carBaseInfoShowType == 1? '请选择品牌' : carBaseInfoShowType == 2 ? selectedCarInfo.brand.brandName :selectedCarInfo.series.seriesName}}</span>
    </header>
    <!-- 品牌 -->
    <div id="pinpai" v-show="carBaseInfoShowType == 1">
      <mt-index-list>
        <mt-index-section v-for="(item,index) in carBaseInfo.brandList" :index="item.initials" :key="item.initials">
          <p v-for="(brand,i) in item.carBrands" class="list-item" :class="selectedCarInfo.brand.id==brand.id &&'active'" @click="selectBrand(brand)">
            <img v-lazy="brand.icon" alt="">
            <span>{{brand.brandName}}</span>
          </p>
        </mt-index-section>
      </mt-index-list>
    </div>
    <!-- 车系 -->
    <ul v-show="carBaseInfoShowType == 2" id="chexi" class="lists">
      <li v-for="(item,index) in carBaseInfo.seriesList">
        <div class="item-key">{{item.carManufacturer}}</div>
        <p class="list-item" v-for="series in item.carSeriesItems" :class="selectedCarInfo.series.id==series.id &&'active'" @click="selectSeries(series)">
          <span>{{series.seriesName}}</span>
        </p>
      </li>
    </ul>
    <!-- 车型 -->
    <ul v-show="carBaseInfoShowType == 3" id="chexing" class="lists">
      <li v-for="(item,index) in carBaseInfo.modelList">
        <div class="item-key" @click="toggleShow(item)">
          {{item.productiveYear}}
          <i class="up-down" :class="item.showList&&'up'"></i>
        </div>
        <p v-show="item.showList" class="list-item" v-for="model in item.carModelItems" :class="selectedCarInfo.model.id==model.id &&'active'" @click="selectModel(model,item.productiveYear)">
          <span>{{model.carModelName}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCarBrandList, getCarSeriesList, getCarModelList } from '@/api'
export default {
  props: {
    showCarModel: {
      type: Boolean,
      default: false
    },
    returnType: {
      type: String,
      default: 'model'
    }
  },
  data() {
    return {
      carBaseInfoShowType: 1,
      carBaseInfo: {
        brandList: [], // 品牌
        seriesList: [], // 车系
        modelList: [] // 车型
      },
      selectedCarInfo: {
        brand: {},
        series: {},
        model: {}
      },
    };
  },
  created() {
    this.getCarBrandList();
  },
  methods: {
    // 获取品牌
    async getCarBrandList() {
      let res = await getCarBrandList({});
      if (res.code === 0) {
        this.carBaseInfo.brandList = res.data;
      }
    },
    // 选择品牌 - 获取车系
    async selectBrand(brand) {
      this.selectedCarInfo.brand = brand;
      let res = await getCarSeriesList({ brandId: brand.id })
      if (res.code === 0) {
        this.carBaseInfo.seriesList = res.data;
        this.carBaseInfoShowType = 2;
      }
    },
    // 选择车系 - 获取车型
    async selectSeries(series) {
      this.selectedCarInfo.series = series;
      if (this.returnType == 'series') {
        this.$emit("changeCarModel", { series, brand: this.selectedCarInfo.brand });
        return;
      }
      let res = await getCarModelList({ seriesId: series.id });
      if (res.code === 0) {
        if (res.data.length > 0) {
          res.data[0].showList = true;
        }
        this.carBaseInfo.modelList = res.data;
        this.carBaseInfoShowType = 3;
      }
    },
    // 选择车型
    selectModel(model, productiveYear) {
      this.selectedCarInfo.model = model;
      this.carBaseInfoShowType = 1;
      model.productiveYear = productiveYear;
      this.$emit("changeCarModel", { model, series: this.selectedCarInfo.series, brand: this.selectedCarInfo.brand });
    },
    // 返回
    goback() {
      if (this.carBaseInfoShowType == 1) {
        this.$emit("closeCarModel");
      } else {
        this.carBaseInfoShowType -= 1;
      }
    },
    toggleShow(item) {
      if (!item.showList) {
        this.carBaseInfo.modelList.forEach(el => {
          this.$set(el, 'showList', false)
        });
      }
      item.showList = !item.showList
    }
  }
};
</script>

<style lang="less" scoped>
.car-model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: #fff;
  height: 100vh;
  > div,
  > ul {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  /deep/.mint-indexsection-index {
    font-size: 26px;
    padding-left: 30px;
    line-height: 40px;
    font-weight: bold;
    color: #c1c1c1;
    background: #f8f8f8;
  }
  /deep/.mint-indexlist-nav {
    width: 56px;
    .mint-indexlist-navitem {
      color: #ff7300;
      font-size: 24px;
    }
  }
  /deep/.mint-indexlist {
    position: absolute;
    top: 0;
    bottom: 0px;
    left: 0;
    right: 0;
    .mint-indexlist-content {
      height: auto !important;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .list-item {
    height: 98px;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
    margin-left: 30px;
    img {
      width: 70px;
      height: 70px;
      vertical-align: middle;
      display: inline-block;
      margin-right: 20px;
    }
    span {
      vertical-align: middle;
      font-size: 28px;
      line-height: 98px;
    }
  }
  .list-item:last-child {
    border-bottom: 0;
  }
  .list-item.active {
    span {
      color: #ff7300;
    }
  }
  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 11;
    background: #fff;
    height: 80px;
    text-align: center;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
    .icon-back {
      position: absolute;
      left: 30px;
      top: 50%;
      width: 48px;
      height: 48px;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      background: url(~@/assets/imgs/icon-back.png) no-repeat;
      background-size: 100% 100%;
    }
    span {
      font-size: 32px;
      color: #3b3b3b;
      line-height: 80px;
      font-weight: bold;
    }
  }
  .lists {
    .item-key {
      line-height: 60px;
      padding-left: 30px;
      color: #c1c1c1;
      font-size: 26px;
      background: #f8f8f8;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      .up-down {
        display: inline-block;
        position: absolute;
        right: 30px;
        top: 10px;
        width: 40px;
        height: 40px;
        transform: rotateZ(180deg);
        -webkit-transform: rotateZ(180deg);
        background: url(~@/assets/imgs/icon-d.png) no-repeat;
        background-size: 100% 100%;
        transition: all linear 0.15s;
      }
      .up-down.up {
        transform: rotateZ(0);
        -webkit-transform: rotateZ(0);
      }
    }
  }
}
</style>

