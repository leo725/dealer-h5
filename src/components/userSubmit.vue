<template>
  <div>
    <van-popup v-model="selfVisible" position='top' class="user-submit" closeable :close-on-popstate='true' safe-area-inset-bottom @close='close'>
      <p class="title">{{txtObj[type].title}}</p>
      <div class="txt" v-if="txtObj[type].txt">
        {{txtObj[type].txt}}
      </div>
      <div class="txt" v-else>
        已有<span>{{num || '多'}}</span>人通过询价获得优惠，快来试试！
      </div>
      <van-form @submit="sumit">
        <van-field v-model="formData.mobile" placeholder='请填写您的手机号' @input="mobileOnInput" class="self-input" type='tel' clearable :rules='rules.mobile'></van-field>
        <van-button :loading='loadingBtn' block native-type='submit' color='#ff7300'>{{txtObj[type].btn}}</van-button>
      </van-form>
    </van-popup>
    <submit-success :visible='showRes' btn-txt='返回首页' @close='resClose' @btnClick="backIndex"></submit-success>
  </div>
</template>

<script>
import { checkPhone, jumpPage, filterParams } from 'utils/utils'
import { saveBusinessOpportunity } from 'api'
import vx from 'utils/utils'
import submitSuccess from './submitSuccess'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'xunjia'
    },
    carInfo: {
      type: Object,
      default: () => ({})
    },
    num: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selfVisible: false,
      showRes: false,
      loadingBtn: false,
      formData: {
        mobile: ''
      },
      rules: {
        mobile: [{ required: true, message: '请填写您的手机号' }, { validator: checkPhone, message: '请填写11位手机号' }],
      },
      txtObj: {
        xunjia: { title: '询最低价', btn: '立即询价', },
        finance: { title: '立即咨询', btn: '立即咨询', txt: '留下您的电话，我们会有专人为您服务' },
      }
    }
  },
  components: { submitSuccess },
  created() {
    let userInfo = vx.localStorage.getItem('userInfo') || {};
    let { mobile, name, dealerId, midShopId } = userInfo;
    if ((dealerId && dealerId == this.$route.query.dId) || (midShopId && midShopId == this.$route.query.mId)) {
      this.formData.mobile = mobile;
      this.formData.name = name;
    }
  },
  methods: {
    async sumit(val) {
      if (this.loadingBtn) return;
      let params;
      if (this.$store.state.isMidShop) {
        params = {
          salesmanId: this.$route.query.sId,
          midShopId: this.$route.query.mId
        }
      } else {
        params = {
          employeeId: this.$route.query.sId,
          dealerId: this.$route.query.dId,
        }
      }
      params = Object.assign(params, {
        businessType: 'buy_car',
        carSellId: this.carInfo.id,
        remarks: `询最低价 车型：${this.carInfo.brandName} ${this.carInfo.modelName}`
      }, this.formData);
      this.loadingBtn = true;
      let res = await saveBusinessOpportunity(filterParams(params));
      this.loadingBtn = false
      this.showRes = true;
      let obj = Object.assign({ dealerId: this.$route.query.dId, midShopId: this.$route.query.mId }, this.formData)
      vx.localStorage.setItem('userInfo', obj)
    },
    resClose() {
      this.showRes = false;
      this.close();
    },
    close() {
      this.$emit('close', false)
    },
    // 返回首页
    backIndex() {
      jumpPage(this.$router, {
        path: '/'
      })
    },
    // 手机号输入
    mobileOnInput(e) {
      if (e.length > 11) {
        this.formData.mobile = e.substr(0, 11)
      }
    },
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
.user-submit {
  height: 496px;
  padding: 85px 30px 0;
  color: #3b3b3b;
  text-align: center;
  .title {
    font-weight: bold;
    font-size: 38px;
    margin-bottom: 30px;
  }
  .txt {
    font-size: 28px;
    color: #3b3b3b;
    margin-bottom: 60px;
    span {
      font-size: 28px;
      color: #ff7300;
    }
  }
}
</style>