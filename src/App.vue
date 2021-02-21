<template>
  <div id="app" :class="isPC&&'pc'">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { filterParams } from 'utils/utils'
import vx from 'utils/utils'
export default {
  data() {
    return {
      isPC: true
    }
  },
  created() {

  },
  watch: {
    '$store.state.wechatUserInfo': {
      deep: true,
      immediate: true,
      handler(newV) {
        if (!this.$store.state.shareId || JSON.stringify(newV) == '{}') return
        let shareTargetType = this.$route.query.shareTargetType == 'carDealer' || this.$route.query.shareTargetType == 'car_dealer' ? 'car_dealer' : 'car';
        let shareIdSubmitHistory = vx.sessionStorage.getItem('shareIdSubmitHistory') || {};
        if (!shareIdSubmitHistory[this.$store.state.shareId]) {
          let params = {
            avatar: newV.headimgurl,
            nickName: newV.nickName,
            openId: newV.openid,
            shareLogId: this.$store.state.shareId,
            unionId: newV.unionid,
            shareTargetType: this.$route.query.shareTargetType,
            TargetId: shareTargetType == 'car' ? this.$route.query.id : this.$route.query.mId || this.$route.query.dId,
            shareType: this.$route.query.shareType
          }
          this.$store.dispatch('submitToolWechatInfo', filterParams(params))
          shareIdSubmitHistory[this.$store.state.shareId] = params;
          vx.sessionStorage.setItem('shareIdSubmitHistory', shareIdSubmitHistory)

        }
      }
    }
  }
}
</script>
<style lang="less">
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
ul,
ol,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  margin: 0;
  padding: 0;
  word-wrap: break-word;
  overflow-x: hidden;
}

body,
html,
input,
button,
select,
textarea {
  font: 12px Microsoft YaHei, arial, sans-serif;
  outline: none;
}

* {
  margin: 0;
  padding: 0;
  outline: none;
  font: 0px Microsoft YaHei, arial, sans-serif;
  outline: none;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  /* Firefox */
  -webkit-box-sizing: border-box;
  /* Safari */
  -o-user-select: text !important;
  -moz-user-select: text !important;
  -user-select: text !important;
  -webkit-user-select: text !important;
  // touch-action: none;
}

ul,
ol,
li {
  list-style: none;
}

input {
  border: none;
}

b {
  font-weight: normal;
}

a {
  display: inline-block;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

html,
body,
#app {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  
}
body{
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

textarea {
  resize: none;
}

button {
  border: 0;
}

img {
  object-fit: cover;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #999;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #999;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #999;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #999;
}

input[type="search"]::-webkit-search-cancel-button {
  /* -webkit-appearance: none; */
  -webkit-appearance: none;
  width: 32px;
  height: 32px;
  position: relative;
  right: 10px;
  /* background: url(../img/icon-close.png) no-repeat; */
  background-size: 32px 32px;
}

/* 微信video 视频问题 */
video {
  object-fit: fill;
  position: relative;
  z-index: 1 !important;
}

/*清除浮动*/
.clearfix:after {
  content: " ";
  display: block;
  clear: both;
  height: 0;
}

.clearfix {
  zoom: 1;
}

/* between */
.between {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.container {
  height: 100%;
  overflow: auto;
  position: relative;
}

.flex {
  display: flex;
}

/********** 组件样式调整 *********/
#nprogress {
  .bar {
    z-index: 4999 !important;
    height: 6px !important;
    background: #ff7300 !important;
    background-image: linear-gradient(to right, #ffd30b, #ff7300) !important;
  }
  .peg {
    box-shadow: 0 0 10rem #ff7300, 0 0 0.06667rem #ff7300 !important;
  }
  // .spinner .spinner-icon{
  //   height: 40px;
  //   width: 40px;
  // }
}
#app {
  .van-list {
    .van-list__loading {
      background: #f6f6f6;
      font-size: 24px;
      .van-loading__text {
        line-height: 68px;
        font-size: 24px;
      }
    }
    .van-list__finished-text {
      line-height: 68px;
      font-size: 24px;
    }
  }

  .van-divider {
    font-size: 24px;
    color: #7f7f7f;
    margin: 40px 150px 10px;
    &::before,
    &::after {
      border-color: #e5e5e5;
    }
  }

  /* tab标签 */
  .van-tabs {
    .van-tabs__wrap {
      height: 90px;
    }
    .van-tab {
      padding: 30px 0 10px;
      .van-tab__text {
        font-size: 30px;
        color: #7f7f7f;
      }
      &.van-tab--active {
        .van-tab__text {
          font-weight: bold;
          color: #3b3b3b;
        }
      }
    }
    .van-tabs__line {
      height: 4px;
    }
  }

  /* 折叠面板 */
  .van-collapse {
    .van-cell {
      font-size: 28px;
      padding: 0 30px;
      .van-cell__title {
        span {
          font-size: 28px;
          color: #3b3b3b;
          line-height: 90px;
        }
      }
      .van-icon {
        font-size: 32px;
        line-height: 90px;
      }
    }
    .van-collapse-item__content {
      padding-top: 20px 30px;
    }
  }

  /* 空状态 */
  .van-empty {
    .van-empty__image {
      width: 300px;
      height: auto;
    }
    .van-empty__description {
      font-size: 28px;
      line-height: 48px;
    }
  }

  /* 骨架屏 */
  .van-skeleton__row,
  .van-skeleton__title {
    height: 40px;
  }
}

.van-notify {
  z-index: 5000 !important;
  line-height: 60px !important;
  font-size: 28px !important;
}
.van-image-preview {
  z-index: 2100 !important;
  .van-image-preview__index {
    font-size: 24px;
  }
}

/* van-popup */
.van-popup {
  .van-icon-cross {
    font-size: 40px;
  }
}

/* 输入框 */
.van-field.self-input {
  padding: 0 0 30px 0 !important;
  position: relative;
  .van-field__body {
    border-radius: 10px;
    border: 1px solid #d2d2d2; /* no */
    .van-field__control {
      font-size: 30px;
      color: #3b3b3b;
      padding: 20px 20px;
      &::placeholder {
        color: #7f7f7f;
      }
    }
    .van-icon-clear {
      font-size: 30px;
      padding: 0 20px;
    }
  }

  .van-field__error-message {
    position: absolute;
    bottom: -30px;
    font-size: 22px;
    line-height: 30px;
  }
}
/* 输入框 */
.van-field:not(.self-input) {
  position: relative;
  .van-field__label {
    width: 140px;
    span {
      font-size: 30px;
      color: #3b3b3b;
      line-height: 80px;
    }
  }
  .van-field__control {
    font-size: 30px;
    color: #3b3b3b;
    padding: 20px 20px;
    // font-size: 30px;
    &::placeholder {
      color: #7f7f7f;
    }
  }
  .van-icon-clear {
    font-size: 30px;
    padding: 0 20px;
  }
  .van-field__error-message {
    padding-left: 20px;
    position: absolute;
    left: 0;
    top: 60px;
    font-size: 20px;
  }
}

.van-field.self-textarea {
  background: #f5f5f5;
  margin-bottom: 30px;
  border-radius: 10px;
  .van-field__control {
    font-size: 28px !important;
    padding: 10px;
    height: 200px;
  }
}

/* 按钮 */
.van-button--default {
  height: 88px !important;
  border-radius: 10px !important;
  overflow: hidden !important;
  .van-button__text {
    color: #fff !important;
    font-size: 30px !important;
  }
}

/* 轻提示 */
.van-toast {
  padding: 16px 30px !important;
  border-radius: 10px !important;
  width: auto;
  .van-toast__text {
    font-size: 24px;
    line-height: 48px;
    // padding: 20px 30px;
  }
}


/* VConsole 样式 */
#__vconsole{
  *{
    font-size: 24px;
  }
  .vc-toolbar{
    .vc-tool{
      line-height: 3em;
    }
  }
}
</style>
