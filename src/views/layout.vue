<template>
  <div class="wechat">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"  class="wechat-main"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"  class="wechat-main"></router-view>
    <ul class="wechat-tabs">
      <li :class="$route.path=='/index'?'active':''" @click="changeTab('/index')">
        <img src="../assets/tab-home.png" class="tab-default" alt="">
        <img src="../assets/tab-home-a.png" class="tab-active" alt="">
        <p>首页</p>
      </li>
      <li :class="$route.path=='/cars'?'active':''" @click="changeTab('/cars')">
        <img src="../assets/tab-car.png" class="tab-default" alt="">
        <img src="../assets/tab-car-a.png" class="tab-active" alt="">
        <p>买车</p>
      </li>
      <li :class="$route.path=='/sell'?'active':''" @click="changeTab('/sell')">
        <img src="../assets/tab-sell.png" class="tab-default" alt="">
        <img src="../assets/tab-sell-a.png" class="tab-active" alt="">
        <p>卖车</p>
      </li>
      <li :class="$route.path=='/custom'?'active':''" @click="changeTab('/custom')">
        <img src="../assets/tab-search.png" class="tab-default" alt="">
        <img src="../assets/tab-search-a.png" class="tab-active" alt="">
        <p>帮我找车</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { jumpPage } from 'utils/utils'
export default {
  created() {

  },
  methods: {
    // 跳转tab
    changeTab(path, query = {}) {
      jumpPage(this.$router, {
        path,
        query
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wechat {
  height: 100%;
  position: relative;
  .wechat-main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 100px;
    overflow: auto;
    height: auto;
  }
  .wechat-tabs {
    font-size: 28px;
    position: absolute;
    z-index: 2500;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    border-top: 1px solid #e5e5e5;
    height: 100px;
    padding-top: 4px;
    background: #fff;
    li {
      flex: 1;
      text-align: center;
      img {
        width: 60px;
      }
      .tab-default {
        display: inline-block;
      }
      .tab-active {
        display: none;
      }
      p {
        font-size: 20px;
      }
      &.active {
        .tab-default {
          display: none;
        }
        .tab-active {
          display: inline-block;
        }
        p {
          color: #ff7300;
        }
      }
    }
  }
}
/*fade*/
.fade-enter-active,
.fade-leave-active {
  -webkit-transition: opacity 0.28s;
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  -webkit-transform: translateX(-20%);
  transform: translateX(-20%);
}

.fade-transform-leave-to {
  opacity: 0;
  -webkit-transform: translateX(20%);
  transform: translateX(20%);
}

/*breadcrumb transition*/
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  -webkit-transform: translateX(20%);
  transform: translateX(20%);
}

.breadcrumb-move {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>