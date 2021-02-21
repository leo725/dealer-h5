<template>
  <div class="custom">
    <customized style-type='style2' btn-txt='有符合的车辆通知我'></customized>
  </div>
</template>

<script>
import customized from 'components/customized'
import {initWechatShare} from 'utils/utils'
export default {
  metaInfo() {
    return {
      title: this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name ? this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name + '-帮你找好车' : '',
      meta: []
    }
  },
  data() {
    return {

    }
  },
  mounted(){
    initWechatShare({
      title:this.$store.state.dealerInfo.shopName || this.$store.state.midShopInfo.name + '-帮你找好车',
      desc: this.$store.state.dealerInfo.shopBrief || this.$store.state.midShopInfo.memo
    })
  },
  components: { customized }
}
</script>

<style lang="less" scoped>
.custom{
  /deep/.common-title{
    padding-bottom: 30px;
  }
}
</style>