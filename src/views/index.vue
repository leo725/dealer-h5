<template>
  <div class="index">
    <!-- <header class="header">
      <img src="../assets/index-bg.jpg" alt="">
      <div class="cover" v-if="$store.state.isMidShop">
        <p class="shop-name">{{$store.state.midShopInfo.name}}</p>
        <span class="city-name">{{$store.state.midShopInfo.cityName}}</span>
      </div>
      <div class="cover" v-else>
        <p class="shop-name">{{$store.state.dealerInfo.shopName}}</p>
        <span class="city-name">{{$store.state.dealerInfo.cityName}}</span>
      </div>
    </header> -->
    <div class="header flex">
      <div class="header-l" v-if="$store.state.isMidShop">
        <img src="../assets/header-img.jpg" alt="">
        <span>{{$store.state.midShopInfo.name}}</span>
      </div>
      <div class="header-l" v-else>
        <img v-if="$store.state.dealerInfo.logo" :src="$store.state.dealerInfo.logo" alt="">
        <img v-else src="../assets/header-img.jpg" alt="">
        <span>{{$store.state.dealerInfo.shopName}}</span>
      </div>
      <div class="header-r" @click="showShareDialog = true">
        <img src="../assets/icon-share.png" alt="">
        <span>分享好友</span>
      </div>
    </div>
    <section class="option-box">
      <div class="search">
        <van-search placeholder="搜索品牌/车型" v-model="formData.keyWord" maxlength='30' @search='search' @clear='clear' />
        <span class="search-btn" @click="search">搜索</span>
      </div>
      <!-- 快速找车 -->
      <div class="fast">
        <div class="com-tit flex">
          <!-- <span>快速找车</span> -->
          <div class="tabs-box">
            <van-tabs line-height='4' line-width='12' color='#ff7300' :border='false' v-model="activeTab">
              <van-tab title="车型"></van-tab>
              <van-tab title="品牌"></van-tab>
              <van-tab title="价格"></van-tab>
            </van-tabs>
          </div>
          <div @click="jumpPage({path:'/cars'})" class="cars-link">
            <i>高级筛选</i>
            <i class="iconfont icon-sanjiao-right"></i>
          </div>
        </div>
        <div class="fast-levels" v-show="activeTab == 0">
          <div v-for="item in fast.carLevels" @click="jumpPage({name:'买车',params:{carLevels:item}})" :key='item' class="fast-levels-item">
            <img :src="allSellCarLevelsIcons[item]" alt="">
            <p>{{item}}</p>
          </div>
        </div>
        <div class="fast-brands" v-show="activeTab == 1">
          <div v-for="(item,index) in fast.carBrands" v-if="index<=9" @click="jumpPage({name:'买车',params:{brandId:item.id,brandName:item.brandName}})" :key='item.id' class="fast-brands-item">
            <img :src="item.icon" alt="">
            <p>{{item.brandName}}</p>
          </div>
          <div @click="jumpPage({path:'/cars'})" class="see-more">
            <span>更多品牌</span>
            <div class="iconfont icon-sanjiao-right"></div>
          </div>
        </div>
        <ul class="fast-cars" v-show="activeTab == 2">
          <li class="car-price-li" v-for="(item,index) in fast.carPrice" :key="index" @click="jumpPage({name:'买车',params:{min:item.min,max:item.max}})">{{item.name}}</li>
        </ul>
        <!-- <div class="fast-cars" v-show="activeTab == 1">
          <div @click="jumpPage({name:'买车',params:{min:0,max:5}})" class="fast-cars-item">
            <img src="../assets/fast-car-2.png" alt="">
            <span>5万以下</span>
          </div>
          <div @click="jumpPage({name:'买车',params:{min:5,max:10}})" class="fast-cars-item">
            <img src="../assets/fast-car-1.png" alt="">
            <span>5-10万</span>
          </div>
          <div @click="jumpPage({name:'买车',params:{min:10,max:20}})" class="fast-cars-item">
            <img src="../assets/fast-car-0.png" alt="">
            <span>10-20万</span>
          </div>
          <div @click="jumpPage({name:'买车',params:{min:20}})" class="fast-cars-item">
            <img src="../assets/fast-car-3.png" alt="">
            <span>20万以上</span>
          </div>
        </div> -->
        

      </div>
    </section>
    <section class="box">
      <p class="common-title">店长推荐</p>
      <car-list :list-data="listData" v-if="listData.length"></car-list>
      <van-empty v-else description='暂无车源'></van-empty>
      <div @click="jumpPage({path:'/cars'})" class="see-more" v-if="listData.length">
        <span>查看更多</span>
        <div class="iconfont icon-sanjiao-right"></div>
      </div>
    </section>
    <section class="box">
      <customized></customized>
    </section>
    <div class="banner box" @click="jumpPage({path:'/sell'})">
      <img src="../assets/sell-banner.jpg" alt="">
    </div>

    <!-- 提示弹窗 -->
    <van-overlay :show="showShareDialog" @click="showShareDialog = false">
      <div class="share-dialog">
        <img src="../assets/share-dialog.png" alt="">
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { initWechatShare, jumpPage, filterParams, priceArray } from 'utils/utils'
import { allLevelsAndStandards, getSellListCars, getCarBrandListByDealerId, getCarBrandListByCityCode } from 'api'
import carList from 'components/carList'
import sellCar from 'components/sellCar'
import customized from 'components/customized'
import vx from 'utils/utils'
export default {
  metaInfo() {
    return {
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name ? this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name + '-首页' : '首页',
      meta: []
    }
  },
  data() {
    return {
      allSellCarLevelsIcons: { '轿车': require('../assets/car-level-jc.png'), 'SUV': require('../assets/car-level-suv.png'), 'MPV': require('../assets/car-level-mpv.png'), '跑车': require('../assets/car-level-pc.png'), '面包车': require('../assets/car-level-mbc.png'), '商务': require('../assets/car-level-swc.png'), '不限': require('../assets/car-level-all.png') },
      fast: {
        carLevels: ['轿车', '跑车', 'SUV', 'MPV', '面包车', '商务', '不限'],
        carBrands: [],
        carPrice: priceArray
      },
      formData: {
        keyWord: ''
      },
      activeTab: 0,
      levelsList: [],
      listData: [],
      showShareDialog: false
    }
  },
  created() {
    this.allLevelsAndStandards();
    this.getSellListCars();
    this.getBrandList();
  },
  mounted() {

  },
  components: { carList, sellCar, customized },
  methods: {
    // 获取车源品牌
    async getBrandList() {
      let res;
      if (this.$route.query.dId) {
        res = await getCarBrandListByDealerId({ dealerId: this.$route.query.dId, employeeId: this.$route.query.sId })
      } else {
        res = await getCarBrandListByCityCode({ cityCode: this.$store.state.cityCode })
      }

      if (res.code == 0) {
        let brandList = []
        res.data.forEach(ele => {
          ele.carBrands.forEach(brand => {
            brandList.push(brand)
          })
        });
        this.fast.carBrands = brandList;
      }
      initWechatShare({
        title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name,
        desc: this.$store.state.dealerInfo.shopBrief || this.$store.state.midShopInfo.memo || ''
      })
    },
    // 获取车类别
    async allLevelsAndStandards() {
      let sessionAllLevel = vx.sessionStorage.getItem('allLevelsAndStandards')
      if (sessionAllLevel) {
        this.levelsList = sessionAllLevel.allSellCarLevels
      } else {
        let res = await allLevelsAndStandards({});
        if (res.code == 0) {
          this.levelsList = res.data.allSellCarLevels
          vx.sessionStorage.setItem('allLevelsAndStandards', res.data)
        }
      }
    },
    // 获取店铺车源
    async getSellListCars() {
      let res = await getSellListCars(filterParams({
        pageIndex: 1,
        pageSize: 10,
        dealerId: this.$route.query.dId,
        cityId: this.$route.query.city
      }))
      if (res.code == 0) {
        this.listData = res.data.tlist;
      }
    },
    // 选择筛选项
    selectOption(type, value) {
      let params = {};
      params[type] = value;
      this.$router.push({
        path: '/cars',
        name: '买车',
        params
      })
    },
    search() {
      let to = {
        name: '买车',
        params: {
          keyWord: this.formData.keyWord
        }
      }
      jumpPage(this.$router, to)
    },
    clear() {

    },
    jumpPage(to) {
      jumpPage(this.$router, to);
    }
  }
}
</script>

<style lang="less" scoped>
.index {
  .header {
    padding: 30px 30px 10px;
    .header-l {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 16px;
      }
      span {
        font-size: 30px;
        color: #3b3b3b;
        font-weight: bold;
      }
    }
    .header-r {
      background: #f2f2f2;
      border-radius: 24px;
      height: 48px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
      span {
        font-size: 22px;
        color: #3b3b3b;
      }
    }
  }
  .see-more {
    width: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafc;
    border-radius: 10px;
    height: 76px;
    margin: 20px auto 30px;
    span {
      font-size: 28px;
      color: #3b3b3b;
    }
    .iconfont {
      font-size: 20px;
      color: #ff7300;
      margin-left: 4px;
    }
  }
  .option-box {
    .search {
      color: #7f7f7f;
      display: flex;
      padding: 20px 30px 0;
      /deep/.van-search {
        flex: 1;
        padding: 0;
        vertical-align: middle;
        border-radius: 6px;
        .van-icon-search {
          font-size: 36px;
          line-height: 64px;
        }
        .van-cell__value {
          input {
            line-height: 64px;
            font-size: 28px;
            padding: 0;
          }
        }
      }
      .search-btn {
        font-size: 30px;
        padding: 0 20px;
        line-height: 72px;
        vertical-align: middle;
        background: #ff7300;
        color: #fff;
        margin-left: 16px;
        border-radius: 6px;
      }
    }
    .fast {
      padding: 0px 30px 20px;
      .tabs-box {
        flex: 1;
        padding-right: 200px;
        /deep/.van-tab--active {
          margin-top: -16px;
          .van-tab__text {
            font-size: 44px !important;
            transition: all linear 0.1s;
          }
        }
      }
      .com-tit {
        display: flex;
        margin: 40px 0;
        align-items: center;
        span {
          font-size: 44px;
          color: #3b3b3b;
          font-weight: bold;
          flex: 1;
        }
        .cars-link {
          background: #f6f6f6;
          border-radius: 10px;
          padding-left: 14px;
          i {
            font-size: 24px;
            color: #7f7f7f;
            line-height: 48px;
            vertical-align: middle;
          }
          .iconfont {
            font-size: 16px;
            padding: 0 10px 0 4px;
          }
        }
      }
      .fast-cars {
        // display: flex;
        .fast-cars-item {
          flex: 1;
          text-align: center;
          &:first-child p {
            color: #ff8119;
          }
          &:nth-child(2) p {
            color: #20bd5f;
          }
          &:nth-child(3) p {
            color: #ff662a;
          }
          &:nth-child(4) p {
            color: #5353ff;
          }
          p {
            font-size: 30px;
            font-weight: bold;
          }
          span {
            display: block;
            font-size: 24px;
            color: #7f7f7f;
            margin: 22px 0 26px;
          }
          img {
            width: 152px;
          }
        }
        .car-price-li {
          width: 160px;
          display: inline-block;
          line-height: 68px;
          text-align: center;
          font-size: 24px;
          color: #3b3b3b;
          background: #f6f6f6;
          margin-right: 15px;
          margin-bottom: 30px;
          &:nth-child(4n) {
            margin-right: 0px;
          }
        }
      }
      .fast-levels {
        margin: 28px 0 38px;
        .fast-levels-item {
          text-align: center;
          width: 25%;
          display: inline-block;
          border-radius: 10px;
          padding-bottom: 20px;
          p {
            font-size: 24px;
            color: #3b3b3b;
          }
          img {
            width: 100%;
          }
        }
      }
      .fast-brands {
        .fast-brands-item {
          width: 20%;
          display: inline-block;
          text-align: center;
          img {
            width: 80px;
            height: 80px;
            display: inline-block;
          }
          p {
            text-align: center;
            font-size: 24px;
            margin-top: 10px;
            margin-bottom: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .box {
    border-top: 20px solid #f3f3f3;
    .common-title {
      font-size: 44px;
      color: #3b3b3b;
      padding: 30px 30px 10px;
      font-weight: bold;
    }
    /deep/.list-box {
      .item:last-child {
        border-bottom: 0;
      }
    }
  }
  .banner {
    border-bottom: 20px solid #f3f3f3;
    img {
      width: 100%;
    }
  }
  .van-overlay {
    z-index: 9999;
    .share-dialog {
      text-align: right;
      padding: 10px 40px;
      img {
        width: 360px;
      }
    }
  }
}
</style>