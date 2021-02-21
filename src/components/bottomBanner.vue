<template>
  <div class="bottom-banner-c">
    <div class="pic" v-if="$store.state.employeeInfo.realName">
      <span>{{$store.state.employeeInfo.realName | getName}}</span>
    </div>
    <img v-else src="../assets/xunjia.png" class="pic" alt="">
    <div class="txt-box">
      <p>想买什么车？</p>
      <span>告诉我们您的需求，专属顾问帮您找</span>
    </div>
    <div class="link" @click="jumpPage">帮我找车</div>
  </div>
</template>

<script>
import { jumpPage } from 'utils/utils'
export default {
  created(){
  },
  methods: {
    jumpPage() {
      jumpPage(this.$router, { path: '/custom' })
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-banner-c {
  height: 160px;
  padding: 0 30px;
  background: #ffffff;
  border-top: 24px solid #f6f6f6;
  display: flex;
  align-items: center;

  .iconfont {
    font-size: 36px;
    color: #dfdddb;
  }
  .pic {
    margin-left: 0;
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
      font-weight: bold;
      margin-bottom: 8px;
      color: #3b3b3b;
    }
    span {
      font-size: 22px;
      color: #7f7f7f;
    }
  }
  .link {
    color: #3b3b3b;
    padding: 12px 20px;
    font-size: 28px;
    background: #fff;
    border-radius: 10px;
    display: inline-block;
    border: 2px solid #3b3b3b;
  }
}
</style>