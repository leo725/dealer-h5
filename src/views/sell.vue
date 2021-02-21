<template>
  <div class="sell">
    <sell-car></sell-car>
    <div class="banner">
      <img src="../assets/sell-banner.jpg" alt="">
    </div>
  </div>
</template>

<script>
import sellCar from 'components/sellCar'
import {initWechatShare} from 'utils/utils'
export default {
  metaInfo() {
    return {
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name ? this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name + '-0费用卖车，卖车无忧' : '',
      meta: []
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    initWechatShare({
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name+ '-0费用卖车，卖车无忧',
      desc: this.$store.state.dealerInfo.shopBrief || this.$store.state.midShopInfo.memo
    })
  },
  components: { sellCar }
}
</script>

<style lang="less" scoped>
.sell {
  background: #f3f3f3;
  .banner {
    border-top: 20px solid #f3f3f3;
    img {
      width: 100%;
    }
  }
  /deep/.common-title {
    padding-bottom: 30px;
  }
}
</style>