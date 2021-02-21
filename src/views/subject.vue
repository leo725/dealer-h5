<template>
  <div class="container">
    <header class="banner">
      <img class="banner-img" :src="bannerUrl" alt="">
      <!-- <transition name="van-slide-up">
        <div class="select-box" v-show="showOCBtns" @click="changeBanner">
          <img src="../assets/icon-img.png" alt="" class="icon">
          <span>选择专题图</span>
        </div>
      </transition> -->
    </header>
    <div class="infos">
      <div class="shop flex">
        <template v-if="$store.state.isMidShop">
          <div class="shop-name">
            <img src="../assets/icon-shop.png" alt="" class="icon">
            <span>{{$store.state.midShopInfo.name}}</span>
          </div>
          <div class="link" @click="jumpPage({path:'/'})">
            <span>进店逛逛</span>
            <van-icon name="arrow" />
          </div>
        </template>
      </div>
      <div class="user flex">
        <a :href="'tel:'+$store.state.employeeInfo.mobile" class="name" v-if="$store.state.employeeInfo">
          {{$store.state.employeeInfo.realName}} {{$store.state.employeeInfo.mobile}}
        </a>
        <img src="../assets/icon-phone.png" alt="" class="icon">
      </div>
    </div>
    <div class="line"></div>
    <div class="cars">
      <!-- <transition name="van-slide-up">
        <div class="sticky" v-show="showOCBtns">
          <div class="select-box" @click="changeBanner">
            <img src="../assets/icon-car.png" alt="" class="icon">
            <span>选择车辆</span>
          </div>
        </div>
      </transition> -->
      <carList v-if="listData.length" :list-data="listData" :style-type='styleType' :originalPrice='true' />
      <van-empty v-else description="暂无车源，去店铺逛逛吧" />
    </div>
    <van-divider v-if="listData.length">到底啦</van-divider>
  </div>
</template>

<script>
import carList from 'components/carList'
import { getSellListCars, bannerGetById } from 'api'
import { jumpPage, filterParams, initWechatShare } from 'utils/utils'
export default {
  metaInfo() {
    return {
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name ? this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name : '好车推荐',
      meta: []
    }
  },
  components: { carList },
  data() {
    return {
      styleType: 'card', // card list
      listData: [],
      bannerUrl: ''
    }
  },
  created() {
    this.getListCars();
    this._bannerGetById();
  },
  methods: {
    // 获取banner 图片
    async _bannerGetById() {
      if (!this.$route.query.bannerId) return
      let res = await bannerGetById({ id: this.$route.query.bannerId });
      if (res.code == 0) {
        this.bannerUrl = res.data.filePath;
        initWechatShare({
          title: res.data.name,
          desc: '',
          imgUrl: 'https://resource.xiaopangche.cn/resource/wechatImage/zhuanti.jpg'
        })
      }
    },
    // 获取车源
    async getListCars() {
      let ids = this.$route.query.ids ? this.$route.query.ids.split(',') : [];
      if (!ids.length) {
        return
      }
      let params = {
        pageIndex: 1,
        pageSize: 100,
        ids,
        sortStr: "f_last_update_date DESC"
      }
      let res = await getSellListCars(params)
      if (res.code == 0) {
        this.listData = res.data.tlist;
      }
    },
    // 跳转页面
    jumpPage(to) {
      jumpPage(this.$router, to)
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #f3f3f3;
  .banner {
    height: 286px;
    position: relative;
    .banner-img {
      width: 100%;
      height: 100%;
    }
  }
  .select-box {
    position: absolute;
    height: 88px;
    width: 288px;
    padding-left: 40px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid #3b3b3b;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 44px 0 0 44px;
    bottom: 30px;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 99;
    .icon {
      width: 44px;
      margin-right: 18px;
    }
    span {
      font-size: 32px;
      color: #3b3b3b;
    }
  }
  .infos {
    background: #fff;
    .shop {
      align-items: center;
      height: 130px;
      padding: 0 32px;
      border-bottom: 2px solid #e5e5e5;
      .shop-name {
        flex: 1;
        img {
          width: 80px;
          vertical-align: middle;
        }
        span {
          font-size: 30px;
          color: #3b3b3b;
          margin-left: 20px;
          font-weight: bold;
          vertical-align: middle;
        }
      }
      .link {
        span {
          font-size: 26px;
          color: #ff7300;
          vertical-align: middle;
        }
        .van-icon-arrow {
          font-size: 30px;
          color: #999;
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }
    .user {
      align-items: center;
      border-bottom: 2px solid #e5e5e5;
      height: 90px;
      padding: 0 32px;
      .name {
        flex: 1;
        font-size: 26px;
        color: #3b3b3b;
      }
      .icon {
        width: 36px;
      }
    }
  }
  .line {
    background: #f8f8f8;
    height: 20px;
  }
  .cars {
    position: relative;
  }
  .sticky {
    position: sticky;
    top: 0px;
    z-index: 99;
    height: 0;
    .select-box {
      position: absolute;
      top: 40px;
      bottom: 0;
      right: 0;
      float: right;
    }
  }
}
</style>