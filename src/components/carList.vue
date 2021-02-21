<template>
  <div class="car-list">
    <div class="list-box" :class="styleType" v-if="listData.length>0">
      <div class="item" v-for="item in listData" @click="gotoDetail(item)">
        <img v-if="item.img" v-lazy="getLittliImg(item.img.filePath)" alt="" />
        <img v-else src="../assets/nodata.png" alt="" />
        <div class='content'>
          <div class='title'>
            <p>{{item.brandName}}</p>
            <p>{{item.modelName}}</p>
          </div>
          <div class="info">
            <span v-if="item.plateYear">{{item.plateYear}}年</span>
            <span v-if="item.kilometres">{{item.kilometres}}万公里</span>
            <span>{{item.cityName}}</span>
          </div>
          <div class='price'>
            <span>{{item.retailPrice}}</span>万元
            <p class="hsj" v-if="originalPrice">
              新车含税价<span>{{item.taxInclusivePrice}}万元</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="nodata" v-if="hasRequest && listData.length<=0">
      <img src="../assets/imgs/want-info.png" alt="">
      <div class="empty-text">未检索到相关车辆信息，</div>
      <div class="empty-text">把您想要的告诉我们吧！</div>
      <span>结果将在1个工作日内反馈</span>
      <router-link class="empty-box-btn" to="/wechat/buyCar">帮我找车</router-link>
    </div> -->
  </div>
</template>

<script>
import { littleImg2 } from '@/utils/filter.js'
import { jumpPage } from 'utils/utils'
export default {
  props: {
    listData: {
      type: Array
    },
    hasRequest: {
      type: Boolean,
      default: false
    },
    styleType: {
      type: String,
      default: 'list'
    },
    originalPrice:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    // 缩略图
    getLittliImg() {
      return function (url) {
        return littleImg2(url, 375)
      }
    }
  },
  methods: {
    gotoDetail(item) {
      let query = {
        id: item.id
      }
      jumpPage(this.$router,{
        path: "/carDetail",
        query: query
      })
    }
  }
};
</script>

<style scoped lang="less">
body {
  height: 100%;
  overflow: hidden;
}
.car-list {
  .item {
    width: 100%;
    height: 244px;
    border-bottom: 1px solid #e5e5e5;
    background: #fff;
    padding-top: 34px;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    position: relative;
    img {
      width: 240px;
      height: 180px;
      flex: 0 0 240px;
    }
    .icon {
      position: absolute;
      width: 89px;
      height: 28px;
      top: 34px;
      left: 30px;
    }
    .content {
      flex: 1;
      padding-left: 23px;
      overflow: hidden;
      .title {
        p {
          font-size: 28px;
          color: #3b3b3b;
          font-weight: 400;
          line-height: 42px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
        }
      }
      .info {
        margin: 10px 0;
        span {
          font-size: 24px;
          color: #888;
          padding-right: 10px;
          &:not(:first-child) {
            border-left: 1px solid #dbdbdb;
            padding-left: 10px;
          }
        }
      }
      .price {
        color: #ff7300;
        font-weight: 400;
        font-size: 22px;
        line-height: 36px;
        margin-top: 10px;
        span {
          font-size: 36px;
          color: #ff7300;
          font-weight: bold;
          margin-right: 6px;
        }
        .hsj{
          color: #A8A8A8;
          font-size: 24px;
          display: inline-block;
          vertical-align: middle;
          margin-left: 12px;
          span{
            color: #A8A8A8;
            font-size: 24px;
            text-decoration: line-through;
          }
        }
      }
    }
  }
  .nomore {
    line-height: 80px;
    text-align: center;
    font-size: 26px;
    color: #aaa;
  }
  .nodata {
    text-align: center;
    padding-top: 100px;
    img {
      width: 235px;
      height: 204px;
    }
    .empty-text {
      color: #333;
      font-size: 32px;
      width: 366px;
      margin: 0 auto;
      line-height: 40px;
    }
    span {
      font-size: 28px;
      color: #999;
      display: block;
      margin: 20px auto 60px;
    }
    .empty-box-btn {
      width: 480px;
      height: 80px;
      line-height: 80px;
      margin: 0 auto;
      background: linear-gradient(90deg, #ffa154, #ff7300);
      border-radius: 10px;
      text-align: center;
      color: #fff;
      font-size: 30px;
    }
  }
}
.card {
  .item {
    display: block;
    height: auto;
    border-bottom: 20px solid #f3f3f3;
    padding: 0;
    img {
      width: 100%;
      height: 517px;
    }
    .content {
      padding: 20px 30px 30px;
      .title {
        height: auto;
      }
      .price,
      .price span {
        font-size: 34px;
        font-weight: 400;
      }
    }
  }
}
</style>
