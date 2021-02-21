<template>
  <div class="sell-car">
    <div class="common-title" v-if="styleType =='default'">帮我找车</div>
    <div class="user" v-if="styleType !='default'">
      <div class="pic" v-if="$store.state.employeeInfo.realName">
        <span>{{$store.state.employeeInfo.realName | getName}}</span>
      </div>
      <img src="../assets/xunjia.png" v-else alt="" class="pic">
      <p class="name">{{$store.state.employeeInfo.position}}</p>
      <span class="txt">告诉我您想要的车</span>
    </div>
    <van-form @submit="submit" class="pad30" :show-error-message='false' @failed='failed'>
      <van-field v-model="formData.name" name='name' label='姓名' placeholder='请填写联系人姓名' :rules='rules.name'></van-field>
      <van-field v-model="formData.mobile" name='mobile' label='手机号' @input="mobileOnInput" placeholder='请填写手机号' type='tel' :rules='rules.mobile'></van-field>
      <van-field v-model="formData.remarks" name='remarks' type='textarea' placeholder='请填写大致车况要求' class="self-textarea"></van-field>
      <van-button :loading='loadingBtn' block native-type='submit' color='#ff7300' class="btn">{{btnTxt}}</van-button>
    </van-form>

    <submit-success :visible='showSuccess' @close='()=>{showSuccess = false}'></submit-success>
  </div>
</template>

<script>
import { checkPhone, filterParams } from 'utils/utils'
import { saveBusinessOpportunity } from 'api'
import vx from 'utils/utils'
import submitSuccess from './submitSuccess'
export default {
  props: {
    styleType: {
      type: String,
      default: 'default'
    },
    btnTxt: {
      type: String,
      default: '提交'
    }
  },
  data() {
    return {
      formData: {
        name: '',
        mobile: '',
        remarks: ''
      },
      rules: {
        name: [{ required: true, message: '请填写您的姓名' }],
        mobile: [{ required: true, message: '请填写您的手机号' }, { validator: checkPhone, message: '请填写11位手机号', trigger: 'onChange' }],
      },
      loadingBtn: false,
      showSuccess: false
    }
  },
  created() {
    let userInfo = vx.localStorage.getItem('userInfo') || {};
    let { mobile, name, dealerId, midShopId } = userInfo;
    if ((dealerId && dealerId == this.$route.query.dId) || (midShopId && midShopId == this.$route.query.mId)) {
      this.formData.name = name;
      this.formData.mobile = mobile;
    }
  },
  components: { submitSuccess },
  methods: {
    // 提交表单数据
    async submit(val) {
      if(this.loadingBtn) return;
      let params;
      if(this.$store.state.isMidShop){
        params = Object.assign({ salesmanId: this.$route.query.sId, midShopId: this.$route.query.mId, businessType: 'buy_car' }, val);
      }else{
        params = Object.assign({ employeeId: this.$route.query.sId, dealerId: this.$route.query.dId, businessType: 'buy_car' }, val);
      }
      this.loadingBtn = true;
      let res = await saveBusinessOpportunity(filterParams(params));
      this.loadingBtn = false;
      let obj = Object.assign({ dealerId: this.$route.query.dId, midShopId: this.$route.query.mId }, this.formData)
      vx.localStorage.setItem('userInfo', obj)
      if (res.code == 0) {
        this.showSuccess = true;
        this.formData.remarks = ''
      }
    },
    // 表单校验失败
    failed(err) {
      if (err) {
        this.$notify({
          type: 'warning',
          message: err.errors[0].message
        })
      }
    },
    // 手机号输入
    mobileOnInput(e) {
      if (e.length > 11) {
        this.formData.mobile = e.substr(0, 11)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.sell-car {
  padding: 0 30px 40px;
  background: #fff;
  .self-textarea {
    margin: 30px 0;
  }
  .btn {
    width: 590px;
    margin: 50px auto 0;
  }
  .common-title {
    font-size: 44px;
    color: #3b3b3b;
    padding: 30px 0px 10px;
    font-weight: bold;
  }
  .user {
    text-align: center;
    padding: 50px 0 60px;
    .pic {
      margin-left: 0;
      width: 104px;
      height: 104px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #ffd9ad;
      margin: 0 auto;
      background: #ff7300;
      text-align: center;
      span {
        font-size: 30px;
        line-height: 96px;
        color: #fff;
      }
    }
    img.pic{
      width: 104px;
      height: 104px;
      border: 0;
    }
    .name {
      font-size: 34px;
      color: #3b3b3b;
      margin: 24px 0 20px;
    }
    .txt {
      font-size: 24px;
      color: #7f7f7f;
    }
  }
}
</style>