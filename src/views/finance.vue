<template>
  <div class="container">
    <van-form v-if="detailData.carShowFinanceProductVO" class="finance2" @submit="submit('new')">
      <div class="header">
        <p class="title">{{detailData.brandName}}{{detailData.modelName}}</p>
        <div class="price">
          <span class="retail">{{detailData.retailPrice|_toFixed}}万</span>
          <span class="tax">新车含税价：<i>{{detailData.taxInclusivePrice|_toFixed}}万</i></span>
        </div>
      </div>
      <div class="box-container" v-if="detailData.carShowFinanceProductVO">
        <van-tabs v-model="activeTab" sticky color='#ff7300' :swipeable='true' :animated='true'>
          <van-tab title="按揭分期" name='AJFQ' v-if="detailData.carShowFinanceProductVO.financialKfqVOS && detailData.carShowFinanceProductVO.financialKfqVOS.length">
            <ul class="finance-ul">
              <li v-for="( item,index ) in detailData.carShowFinanceProductVO.financialKfqVOS" :key="item.id" @click.stop.prevent="selectItem(item)" :class="{active: selectedItem.id == item.id}">
                <div class="item-l">
                  <i class="radio" :class="{active: selectedItem.id == item.id}"></i>
                </div>
                <div class="item-c item-main padding-l">
                  <p>
                    <span>{{item.monthlyPayments}}</span>元
                  </p>
                  <label>{{item.productDeadline}}期</label>
                </div>
                <div class="item-r item-main">
                  <p>
                    <span>{{item.downPayment}}</span>元
                  </p>
                  <label>首付</label>
                </div>
              </li>
            </ul>
            <div class="other-box1">
              <div class="input-box1">
                <span><img src="../assets/icon-phone2.png" alt="">手机号</span>
                <van-field v-model="formData.mobile" name='name' :rules='rules.mobile' type='tel' placeholder='请填写联系人姓名'></van-field>
              </div>
              <van-button class="submit-btn" block :loading='loadingBtn' native-type='submit' color='#ff7300'>提交</van-button>
              <p class="shenming">
                提交即视为同意 <a target="_black" href="http://share.xiaopangche.cn/html/webSiteagreement/statementWeb.html">《个人信息保护声明》</a>
                <i>具体分期方案需要根据您的资质进行评估</i>
              </p>
            </div>
          </van-tab>
          <van-tab title="融资租赁" name='RZZL' v-if="detailData.carShowFinanceProductVO.websiteCarLeaseVOMap">
            <template v-for="(value, key, idx) in detailData.carShowFinanceProductVO.websiteCarLeaseVOMap">
              <p class="finance-txt">{{key}}：</p>
              <ul class="finance-ul">
                <li v-for="( item,index ) in value" :key="item.id" class="not-flex" :class="{active: selectedItem.id == item.id}">
                  <div class="flex" @click.stop.prevent="selectItem(item)">
                    <div class="item-r item-main padding-l">
                      <p>
                        <span>{{item.downPayment}}</span>元
                      </p>
                      <label>首付</label>
                    </div>
                    <div class="item-c item-main">
                      <p>
                        <span>{{item.monthly}}</span>元
                      </p>
                      <label>{{item.productDeadline}}期</label>
                    </div>
                    <div class="item-other">
                      <p>审核条件</p>
                      <i :class="{active: selectedItem.id == item.id}"></i>
                    </div>
                  </div>
                  <div class="form-box" v-show="selectedItem.id == item.id">
                    <p class="yellow-tit">准入标准</p>
                    <div class="biaozhun">{{item.customerAccessStandard}}</div>
                    <p class="yellow-tit">资料要求</p>
                    <div class="biaozhun">{{item.businessOperationStandard}}</div>
                    <div class="input-box">
                      <van-field v-model="formData.mobile" name='name' :rules='rules.mobile' maxlength='11' type='tel' placeholder='请填写联系人姓名'></van-field>
                      <van-button class="submit-btn2" :loading='loadingBtn' native-type='submit' color='#ff7300'>提交申请</van-button>
                    </div>
                    <p class="shenming">
                      提交即视为同意 <a target="_black" href="http://share.xiaopangche.cn/html/webSiteagreement/statementWeb.html">《个人信息保护声明》</a>
                    </p>
                  </div>
                </li>
              </ul>
            </template>
          </van-tab>
        </van-tabs>
      </div>
    </van-form>
    <van-form @submit="submit" v-else-if="detailData.supportMortgage == 'Y'" class="finance">
      <div class="header">
        <img v-if="detailData.imgList" :src="detailData.imgList[0].filePath" alt="">
        <div class="header-r">
          <p class="title">{{detailData.brandName}}</p>
          <p class="title">{{detailData.modelName}}</p>
          <div class="txt">
            <span>{{detailData.plateYear}}年</span>
            <span>{{detailData.kilometres}}万公里</span>
            <span>{{detailData.cityName}}</span>
          </div>
          <p class="price">
            <span class="retail">{{detailData.retailPrice|_toFixed}}万元</span>
            <span class="tax">新车含税价：<i>{{detailData.taxInclusivePrice|_toFixed}}</i> 万元</span>
          </p>
        </div>
      </div>
      <div class="mid">
        <p class="fenqi-money">
          分期首付
          <span>￥{{detailData.downPayment|_toFixed}}万</span>
        </p>
        <ul class="fenqi-list">
          <li v-for="(item,index) in fenqiList" :class="item == formData.stages && 'active'" @click="formData.stages = item">
            <i class="iconfont" :class="item == formData.stages ? 'icon-ok3': 'icon-yuan'"></i>
            <span>{{item}}期</span>
            <img src="../assets/icon-coin.png" class="coin" alt="">
          </li>
        </ul>

        <div class="form-box">
          <van-field v-model="formData.name" name='name' label='姓名' placeholder='请填写联系人姓名' :rules='rules.name'></van-field>
          <van-field v-model="formData.mobile" name='mobile' label='手机号' placeholder='请填写手机号' type='tel' :rules='rules.mobile'></van-field>
          <div></div>
        </div>

      </div>
      <div class="fix-box">
        <a class="fix-l fix-sub" :href='"tel:"+ $store.state.employeeInfo.mobile'>
          <i class="iconfont icon-phone2"></i>
          <span>电话</span>
        </a>
        <van-button :loading='loadingBtn' block native-type='submit' color='#ff7300' class="fix-r fix-sub">
          立即咨询
        </van-button>
      </div>
    </van-form>
    <submit-success :visible='visible' btn-txt='返回' @close='()=>{visible=false}' @btnClick="back"></submit-success>
  </div>
</template>

<script>
import { getSellCarDetail, saveBusinessOpportunity } from 'api'
import { checkPhone, filterParams } from 'utils/utils'
import submitSuccess from 'components/submitSuccess'
import vx from 'utils/utils'
export default {
  data() {
    return {
      detailData: {},
      visible: false,
      loadingBtn: false,
      fenqiList: [12, 24, 36],
      formData: {
        stages: 36,
        name: '',
        mobile: '',
      },
      rules: {
        name: [{ required: true, message: '请填写您的姓名' }],
        mobile: [{ required: true, message: '请填写您的手机号' }, { validator: checkPhone, message: '请填写11位手机号', trigger: 'onChange' }],
      },
      activeTab: '',
      selectedItem: {}
    }
  },
  created() {
    this.getSellCarDetail();
    let userInfo = vx.localStorage.getItem('userInfo') || {};
    let { mobile, name, dealerId, midShopId } = userInfo;
    if ((dealerId && dealerId == this.$route.query.dId) || (midShopId && midShopId == this.$route.query.mId)) {
      this.formData.name = name;
      this.formData.mobile = mobile;
    }
  },
  components: { submitSuccess },
  methods: {
    mobileInput(val) {
      if (this.formData.mobile && this.formData.mobile.length > 11) {
        this.formData.mobile = this.formData.mobile.slice(0, 11)
      }
    },
    async getSellCarDetail() {
      let res = await getSellCarDetail({ id: this.$route.query.id });
      if (res.code == 0) {
        this.detailData = res.data;
        if (this.detailData.carShowFinanceProductVO && this.detailData.carShowFinanceProductVO.financialKfqVOS && this.detailData.carShowFinanceProductVO.financialKfqVOS.length) {
          this.selectedItem = this.detailData.carShowFinanceProductVO.financialKfqVOS[0]
        }
      }
    },
    // 提交
    async submit(isNew) {
      if (this.loadingBtn) return
      let params, remarks;
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
      if ( this.detailData.carShowFinanceProductVO &&(!this.selectedItem || !this.selectedItem.productDeadline)) {
        return this.$notify({ type: 'warning', message: `请选择${this.activeTab == 'AJFQ' ? '按揭分期' : '融资租赁'}期数` })
      }
      if (isNew) {
        remarks = `${this.activeTab == 'AJFQ' ? '按揭分期' : '融资租赁'}: ${this.selectedItem.productDeadline}期； 车型：${this.detailData.brandName} ${this.detailData.modelName}`
      } else {
        remarks = `分期购车 ${this.formData.stages}期； 车型：${this.detailData.brandName} ${this.detailData.modelName}`
      }
      params = Object.assign(params, {
        businessType: 'buy_car',
        carSellId: this.$route.query.id,
        remarks
      }, this.formData);
      this.loadingBtn = true;
      let res = await saveBusinessOpportunity(filterParams(params));
      this.loadingBtn = false
      this.visible = true;
      let obj = Object.assign({ dealerId: this.$route.query.dId, midShopId: this.$route.query.mId }, this.formData)
      vx.localStorage.setItem('userInfo', obj)
    },
    async submit2() {
      if (this.loadingBtn) return
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

    },
    // 返回
    back() {
      this.$router.back()
    },
    // 选择
    selectItem(item) {
      this.selectedItem = item;
      // this.selectedItem = this.selectedItem.id == item.id ? {} : item;
    },
  }
}
</script>

<style lang="less" scoped>
.finance {
  background: #f3f3f3;
  .header {
    background: #fff;
    display: flex;
    padding: 30px;
    img {
      width: 240px;
      height: 180px;
    }
    .header-r {
      flex: 1;
      padding-left: 20px;
      overflow: hidden;
      .title {
        font-size: 28px;
        color: #3b3b3b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .txt {
        margin: 16px 0 10px;
        span {
          font-size: 26px;
          color: #7f7f7f;
          padding-right: 10px;
          &:not(:first-child) {
            border-left: 1px solid #dbdbdb; /* no */
            padding-left: 10px;
          }
        }
      }
      .price {
        .retail {
          font-size: 28px;
          color: #7f7f7f;
          margin-right: 20px;
          font-weight: bold;
        }
        .tax {
          font-size: 22px;
          color: #a8a8a8;
          i {
            font-size: 22px;
            text-decoration: line-through;
          }
        }
      }
    }
  }
  .mid {
    background: #fff;
    padding: 30px 30px 80px;
    .fenqi-money {
      font-size: 26px;
      color: #3b3b3b;
      span {
        font-size: 38px;
        color: #ff7300;
      }
    }
    .fenqi-list {
      display: flex;
      overflow: initial;
      padding-top: 50px;
      margin-bottom: 50px;
      li {
        flex: 1;
        border: 1px solid #cccccc; /* no */
        border-radius: 10px;
        box-shadow: 0px 2px 8px 0px rgba(214, 214, 214, 1);
        height: 86px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        &.active {
          box-shadow: 0px 2px 8px 0px #ff771f;
          border-color: #ff771f;
        }
        &:not(:first-child) {
          margin-left: 40px;
        }
        .iconfont {
          color: #c2c2c2;
          font-size: 38px;
          vertical-align: middle;
        }
        .icon-ok3 {
          color: #ff771f;
        }
        span {
          font-size: 32px;
          color: #ff771f;
          margin: 0 10px;
          vertical-align: middle;
        }
        .coin {
          position: absolute;
          right: -20px;
          bottom: -20px;
          width: 60px;
        }
      }
    }
  }
  .fix-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    .fix-sub {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 104px !important;
      border-radius: 0 !important;
    }
    .fix-l {
      width: 270px;
      color: #3b3b3b;
      span {
        font-size: 32px;
      }
      i {
        font-size: 36px;
        margin-right: 10px;
      }
    }
    .fix-r {
      flex: 1;
      background: #ff7300;
      span {
        font-size: 32px;
        color: #ffffff;
      }
    }
  }
}
.finance2 {
  .header {
    height: 168px;
    width: 100%;
    padding: 30px;
    background: url(~@/assets/finance-bg.jpg) no-repeat;
    background-size: 100% 100%;
    .title {
      color: #fff;
      font-size: 36px;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .price {
      .retail {
        font-size: 30px;
        color: #fff;
        margin-right: 30px;
      }
      .tax {
        font-size: 22px;
        color: #fff;
        i {
          font-size: 22px;
          color: #fff;
          // text-decoration: line-through;
        }
      }
    }
  }
  .tabs {
    display: flex;
    border-bottom: 1px solid #e5e5e5 /* no */;
    padding: 0 30px;
    span {
      color: #808080;
      font-size: 32px;
      flex: 1;
      text-align: center;
      line-height: 98px;
      &.active {
        color: #ff7300;
        position: relative;
        font-weight: bold;
        &::after {
          content: "";
          width: 124px;
          height: 6px;
          background: #ff7300;
          border-radius: 3px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .box-container {
    /deep/.van-tabs__wrap {
      border-bottom: 1px solid #eee /* no */;
    }
    /deep/.van-tab__pane-wrapper {
      padding: 30px;
    }
    .finance-txt {
      font-size: 28px;
      color: #3b3b3b;
      margin-bottom: 30px;
      font-weight: bold;
    }
    .finance-ul {
      overflow: visible;
      > li {
        display: flex;
        height: 184px;
        border-radius: 10px;
        background: #fff;
        border: 1px solid #eee /* no */;
        box-shadow: 0px 0px 17px 1px rgba(222, 222, 222, 0.6);
        margin-bottom: 30px;
        overflow: hidden;
        &.not-flex {
          display: block;
          height: auto;
        }
        &.active.not-flex {
        }
        .flex {
          display: flex;
          height: 182px;
        }
        .item-l {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 46px;
          .radio {
            width: 44px;
            height: 44px;
            border: 2px solid #ff963f;
            border-radius: 50%;
            display: inline-block;
            &.active {
              border: 0;
              background: url(~@/assets/radio.png) no-repeat;
              background-size: 100% 100%;
            }
          }
        }
        .padding-l {
          padding-left: 46px;
        }
        .item-main {
          flex: 1;
          padding-top: 34px;
          label {
            font-size: 28px;
            color: #7f7f7f;
          }
          p {
            font-size: 28px;
            color: #3b3b3b;
            margin-bottom: 10px;
            span {
              font-size: 44px;
              color: #3b3b3b;
              font-weight: bold;
              margin-right: 6px;
            }
          }
        }
        .item-c {
          p {
            span {
              color: #ff7300;
            }
          }
        }
        .item-other {
          text-align: center;
          width: 156px;
          background: #fff9ec;
          padding-top: 60px;
          p {
            color: #808080;
            font-size: 24px;
            margin-bottom: 16px;
          }
          i {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url(~@/assets/icon-jt.png) no-repeat;
            background-size: 100% 100%;
            transition: all ease-in-out 0.25s;
            &.active {
              transform: rotateZ(-180deg);
            }
          }
        }
        .form-box {
          padding: 0 24px 30px;
          border-top: 1px solid #eee /* no */;
          .yellow-tit {
            font-size: 32px;
            color: #da980b;
            margin: 40px 0 20px;
            font-weight: bold;
          }
          .biaozhun {
            color: #666666;
            font-size: 28px;
            text-align: justify;
          }
          .input-box {
            display: flex;
            border: 1px solid #eee /* no */;
            border-radius: 10px;
            margin-top: 50px;
            margin-bottom: 20px;
            overflow: hidden;
            input {
              flex: 1;
              height: 88px;
              font-size: 32px;
              padding: 0 24px;
            }
            .submit-btn2 {
              background: #ff7400;
              text-align: center;
              font-size: 32px;
              color: #fff;
              width: 208px;
              height: 100px !important;
              border-radius: 10px;
            }
          }
        }
      }
    }
    .other-box1 {
      padding-top: 40px;
      .input-box1 {
        display: flex;
        border: 1px solid #dddddd;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 48px;
        span {
          font-size: 32px;
          color: #3c3c3c;
          display: flex;
          align-items: center;
          padding: 0 20px;
          img {
            width: 36px;
            margin-right: 10px;
          }
        }
        .van-field {
          flex: 1;
          font-size: 32px;
        }
      }
      .submit-btn {
        margin-bottom: 39px;
      }
      .shenming {
        text-align: center;
        i {
          font-size: 24px;
          color: #666;
          display: block;
          margin-top: 10px;
        }
      }
    }
    .shenming {
      font-size: 24px;
      color: #2e2e2e;
      a {
        color: #ff7300;
        font-size: 24px;
      }
    }
  }
}
</style>