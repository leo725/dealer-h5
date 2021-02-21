<template>
  <van-popup v-model="selfVisible" class="success-popup" :close-on-popstate='true' safe-area-inset-bottom @close='close'>
    <img src="../assets/icon-success.png" alt="">
    <p class="title">{{title}}</p>
    <p class="txt">{{subTxt}}</p>
    <van-button class="btn" plain @click="btnClick">{{btnTxt}}</van-button>
  </van-popup>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title:{
      type: String,
      default:'已为您通知商家',
    },
    subTxt:{
      type: String,
      default:'您的专属销售顾问会尽快与您联系！',
    },
    btnTxt:{
      type: String,
      default:'确定',
    },
  },
  data() {
    return {
      selfVisible: false
    }
  },
  methods: {
    close() {
      this.$emit('close', false)
    },
    btnClick(){
      this.close();
      this.$emit('btnClick')
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler() {
        this.selfVisible = this.visible
      }
    }
  }
}
</script>

<style lang="less" scoped>
.success-popup {
  height: 560px;
  width: 640px;
  border-radius: 10px;
  text-align: center;
  padding-top: 64px;
  img {
    width: 178px;
  }
  .title {
    font-size: 38px;
    color: #ff7300;
    margin: 36px 0 26px;
  }
  .txt {
    font-size: 26px;
    color: #7f7f7f;
    line-height: 36px;
    height: 72px;
    width: 480px;
    margin: 0 auto 30px;
  }
  .btn {
    width: 480px;
    /deep/.van-button__text{
      color: #3B3B3B !important;
    }
  }
}
</style>