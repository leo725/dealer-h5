<template>
  <div class="container" @scroll="windowScroll" ref="scrollDiv">
    <seniorOption @changeViewStyle='changeStyleType' :style-type='styleType' @emitParams='emitParams'></seniorOption>
    <van-list v-model="loading" :finished='noMoreData' @load='getListCars'>
      <car-list :list-data="listData" :style-type='styleType'></car-list>
      <van-empty v-if="!listData.length && noMoreData" image="search" description='当前搜索条件下，暂无车源'></van-empty>
      <div :class="visible.showBanner && !loveList.length ?'pb120':''" v-if="noMoreData">
        <bottom-banner></bottom-banner>
      </div>
    </van-list>
    <!-- 想买什么车 -->
    <van-popup v-model="showPopup" :lock-scroll='false' :overlay='false' position='bottom' class="bottom-popup">
      <div class="gotop" v-show="visible.goTop" @click="gotop">
        <img src="../assets/icon-top.png" alt="">
      </div>
      <div class="bottom-banner" v-show="visible.showBanner">
        <i class="iconfont icon-close" @click="visible.showBanner=false;"></i>
        <div class="pic" v-if="$store.state.employeeInfo.realName">
          <span>{{$store.state.employeeInfo.realName | getName}}</span>
        </div>
        <img v-else class="pic" src="../assets/xunjia.png" alt="">
        <div class="txt-box">
          <p>想买什么车？</p>
          <span>专属顾问帮您找</span>
        </div>
        <div @click="jumpPage({path:'/custom'})" class="link">帮我找车</div>
      </div>
    </van-popup>
    <!-- 猜你喜欢 -->
    <div v-if="loveList.length" class="love-box">
      <div class="common-title">猜你喜欢</div>
      <car-list :list-data="loveList" :style-type='styleType'></car-list>
    </div>
  </div>
</template>

<script>
import seniorOption from 'components/seniorOption'
import carList from 'components/carList'
import bottomBanner from 'components/bottomBanner'
import { getSellListCars } from 'api'
import { jumpPage, initWechatShare, filterParams } from 'utils/utils'
export default {
  metaInfo() {
    return {
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name ? this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name + '-帮你找好车' : '',
      meta: []
    }
  },
  data() {
    return {
      loading: false,
      listData: [],
      loveList: [],
      noMoreData: false,
      pageSize: 10,
      pageIndex: 1,
      styleType: 'list', // card list
      showPopup: true,
      scrollTop: 0,
      visible: {
        goTop: false,
        showBanner: false
      },
      listParams: {}
    }
  },
  components: { seniorOption, carList, bottomBanner },
  created() {
    
  },
  mounted() {
    initWechatShare({
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name || this.$store.state.midShopInfo.name + '-帮你找好车',
      desc: this.$store.state.dealerInfo.shopBrief || this.$store.state.midShopInfo.memo
    })
  },
  activated() {
    if(JSON.stringify(this.$route.params)!=='{}'){
      this.getListCars({},true)
    }else{
      this.$refs['scrollDiv'].scrollTop = this.$store.state.carsPageScrollTop;
    }
    setTimeout(() => {
      this.visible.showBanner = true;
      this.showPopup = true;
    }, 10000)
  },
  deactivated() {
    this.$store.commit('SET_CARS_PAGE_SCROLL_TOP', this.scrollTop)
  },
  methods: {
    // 监听滚动
    windowScroll(e) {
      this.visible.goTop = e.target.scrollTop > 100;
      this.scrollTop = e.target.scrollTop
      if (this.visible.goTop) {
        this.showPopup = true
      }
    },
    // 返回顶部
    gotop() {
      this.$refs.scrollDiv.scrollTop = 0;
      this.showGoTop = false;
    },
    // 获取列表
    async getListCars(params = {}, clearAll) {
      if (clearAll) {
        this.pageIndex = 1;
        this.listData = [];
        this.noMoreData = false;
      }
      let postParams = { ...this.listParams, pageIndex: this.pageIndex, pageSize: this.pageSize, ...params }
      if (this.$store.state.isMidShop) {
        postParams.cityId = this.$store.state.cityCode
      } else {
        postParams.dealerId = this.$route.query.dId;
      }
      this.loading = true
      let res = await getSellListCars(filterParams(postParams));
      this.loading = false;
      if (res.code == 0) {
        this.listData = this.listData.concat(res.data.tlist);
        this.noMoreData = res.data.tlist.length < this.pageSize;
        this.pageIndex += 1;
        if (this.pageIndex == 2 && res.data.tlist.length <= 5 && JSON.stringify(this.listParams) != '{}') {
          this.getLoveCars()
        }
      } else {
        this.noMoreData = true
      }
    },
    async getLoveCars() {
      let res = await getSellListCars(filterParams({ pageIndex: 1, pageSize: 10, dealerId: this.$route.query.dId, cityId: this.$route.query.city }));
      if (res.code == 0) {
        this.loveList = res.data.tlist
      }
    },
    // 获取数据集
    emitParams(params) {
      this.listParams = params;
      this.getListCars(params, true)
    },
    // 改变样式
    changeStyleType() {
      this.styleType = this.styleType == 'card' ? 'list' : 'card'
    },
    // 跳页面
    jumpPage(to) {
      jumpPage(this.$router, to)
    }
  },
  watch:{
    // '$route'(to,from){
    //   console.log(1);
    // }
  }
}
</script>

<style lang="less" scoped>
.bottom-popup {
  overflow: initial;
  min-height: 100px;
  background: transparent;
  .gotop {
    position: absolute;
    right: 30px;
    top: -206px;
    img {
      width: 96px;
      height: 96px;
    }
  }
}
.pb120 {
  padding-bottom: 120px;
}
.bottom-banner {
  height: 220px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  padding: 0 30px 100px;
  .iconfont {
    font-size: 36px;
    color: #dfdddb;
  }
  .pic {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #ffd9ad;
    margin: 0 20px;
    background: #ff7300;
    text-align: center;
    span {
      font-size: 30px;
      line-height: 80px;
      color: #fff;
    }
  }
  img.pic {
    width: 84px;
    height: 84px;
    border: 0;
  }
  .txt-box {
    flex: 1;
    p {
      font-size: 30px;
      color: #fff;
      font-weight: bold;
      margin-bottom: 8px;
    }
    span {
      font-size: 22px;
      color: #e7e7e7;
    }
  }
  .link {
    color: #3b3b3b;
    padding: 12px 20px;
    font-size: 28px;
    background: #fff;
    border-radius: 10px;
    display: inline-block;
  }
}
.love-box {
  border-top: 20px solid #f6f6f6;
  padding-bottom: 120px;
  .common-title {
    font-size: 40px;
    color: #3b3b3b;
    padding: 30px 30px 10px;
  }
}
</style>