<template>
  <div class="love-list container">
    <car-list v-if="loveList.length" :list-data="loveList"></car-list>
    <van-empty v-else description='抱歉，暂时还没有收藏的车~'></van-empty>
  </div>
</template>

<script>
import carList from 'components/carList'
import vx from 'utils/utils'
export default {
  data() {
    return {
      loveList: []
    }
  },
  components: { carList },
  created() {
    this.getLoveList();
  },
  methods: {
    getLoveList() {
      let storageKey = this.$store.state.isMidShop ? 'userLoveObjectMidShop': 'userLoveObject'
      let obj = vx.localStorage.getItem(storageKey) || {};
      let key = this.$route.query.dId || this.$route.query.mId
      let loveObj = obj[key] || {};
      for (const key in loveObj) {
        if (loveObj.hasOwnProperty(key)) {
          const ele = loveObj[key];
          this.loveList.push(ele);
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.love-list {
  background: #f6f6f6;
  .no-data {
    text-align: center;
    padding-top: 100px;
    p {
      font-size: 28px;
      color: #999;
      margin-top: 30px;
    }
  }
}
</style>