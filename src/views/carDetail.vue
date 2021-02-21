<template>
  <div class="container">
    <div class="container-main" @scroll="windowScroll" ref="scrollDiv">
      <div class="banner video-box" v-if="detailData.attachmentCarVideoVO && detailData.attachmentCarVideoVO.filePath && detailData.attachmentCarVideoVO.state == 'passed'">
        <video id='myVideo' ref="myVideo" controls :poster='detailData.imgList[0].filePath'>
          <source :src="detailData.attachmentCarVideoVO.filePath">
        </video>
        <a class="vr" :href="detailData.vr" v-if="detailData.vr" target="_blank">
          <img src="../assets/vr.png" alt="">
          <span>看车</span>
        </a>
      </div>
      <div class="banner" v-else>
        <van-swipe :autoplay="3000" :show-indicators='false' @change='swipeChange'>
          <van-swipe-item v-for="(item,index) in detailData.imgList" :key="index" v-if="item.attachmentType != 3">
            <img class="img" v-lazy="getLittliImg(item.filePath)" @click="previewImg(index)">
          </van-swipe-item>
        </van-swipe>
        <div class="banner-footer between">
          <p>上架时间：{{detailData.createDate}}</p>
          <p v-if="detailData.imgList">{{currentSwiperItem}}/{{imgList.length}}</p>
        </div>
        <a class="vr" :href="detailData.vr" v-if="detailData.vr" target="_blank">
          <img src="../assets/vr.png" alt="">
          <span>看车</span>
        </a>
      </div>
      <!-- 价格等 -->
      <div class="header">
        <div class="title">
          <p class="title-content">{{detailData.brandName}} {{detailData.modelName}}</p>
        </div>
        <p class="infos">
          <span v-if="detailData.plateYear">{{detailData.plateYear}}年</span>
          <span v-if="detailData.kilometres">{{detailData.kilometres}}万公里</span>
          <span v-if="detailData.cityName">{{detailData.cityName}}</span>
          <span v-if="detailData.standard">{{detailData.standard}}</span>
        </p>
        <div class="price">
          售价:
          <span>{{detailData.retailPrice | _toFixed}}</span> 万元
        </div>
        <div class="zhidaojia">
          新车含税价：<span>{{detailData.taxInclusivePrice | _toFixed}}万元</span>
          <div class="tongzhi" @click="visible.jiangjia= true">降价通知</div>
        </div>
        <div class="report" v-if="detailData.externalCarCheckVO && (detailData.externalCarCheckVO.reportUrl || detailData.externalCarCheckVO.attachments)" @click="openReport">
          <img src="../assets/icon-report.png" alt="">
          <b>检测报告</b>
          <span>精准检测 让您放心买车</span>
          <i class="iconfont icon-jt-right"></i>
        </div>
        <div class="line"></div>
      </div>
      <!-- 贷款 -->
      <div @click="jumpPage({path:'/finance',query:{id:$route.query.id}})" class="loan between" v-if="getDownPayment">
        <div class="loan-l">
          <!-- <i class="iconfont icon-wenhaofill"></i> -->
          <img src="../assets/icon-dk.png" alt="">
          <span>分期购车</span>
        </div>
        <div class="loan-r">
          <span>首付<b>{{getDownPayment}}</b>起</span>
          <!-- <span><b>36</b>期</span> -->
          <i class="iconfont icon-jt-right"></i>
        </div>
      </div>
      <!-- 店铺信息 -->
      <div class="shop-info">
        <!-- 车商分享 -->
        <template v-if="!$store.state.isMidShop">
          <div class="shop-main pad30">
            <div class="shop-main-top">
              <img class="shop-logo" v-if="detailData.carDealerVO.logo" v-lazy="detailData.carDealerVO.logo" alt="">
              <img class="shop-logo" v-else src="https://resource.xiaopangche.cn/resource/wechatImage/shop_default_icon.png" alt="">
              <div class="shop-m-center">
                <p>{{detailData.carDealerVO.shopName}}</p>
                <div>{{detailData.carDealerVO.cityName}}</div>
              </div>
              <div @click="jumpPage({path:'/'})" class="go-shop-btn">进店逛逛</div>
            </div>
            <div class="shop-nums">
              <span>在售车 {{detailData.dealerCarCount}} </span>
              <!-- <span>已售车 160 </span> -->
              <span>浏览人数 {{detailData.carViewCount}} </span>
            </div>
          </div>
          <a v-if="detailData.carDealerVO.longitude && detailData.carDealerVO.latitude" class="between pad30" target="_blank" :href="'https://m.amap.com/navi/?dest='+detailData.carDealerVO.longitude+','+detailData.carDealerVO.latitude+'&destName='+detailData.carDealerVO.addressDetail+'&key=69dfa52c5cc477b041e0129edbb149a0'">
            <span>{{detailData.carDealerVO.addressDetail}}</span>
            <i class="iconfont icon-location"></i>
          </a>
        </template>
        <!-- 线下店 -->
        <template v-else>
          <div class="shop-main pad30">
            <div class="shop-main-top">
              <img class="shop-logo" src="https://resource.xiaopangche.cn/resource/wechatImage/shop_default_icon.png" alt="">
              <div class="shop-m-center">
                <p>{{$store.state.midShopInfo.name}}</p>
                <div>{{$store.state.midShopInfo.cityName}}</div>
              </div>
              <div @click="jumpPage({path:'/'})" class="go-shop-btn">进店逛逛</div>
            </div>
          </div>
          <a v-if="$store.state.midShopInfo.longitude && $store.state.midShopInfo.latitude" class="between pad30" target="_blank" :href="'https://m.amap.com/navi/?dest='+$store.state.midShopInfo.longitude+','+$store.state.midShopInfo.latitude+'&destName='+$store.state.midShopInfo.address+'&key=69dfa52c5cc477b041e0129edbb149a0'">
            <span>{{$store.state.midShopInfo.cityName}}{{$store.state.midShopInfo.address}}</span>
            <i class="iconfont icon-location"></i>
          </a>
        </template>
        <a class="between pad30" :href="'tel:'+$store.state.employeeInfo.mobile">
          <span>{{$store.state.employeeInfo.realName}} {{$store.state.employeeInfo.mobile}}</span>
          <i class="iconfont icon-phone"></i>
        </a>
        <div class="line"></div>
      </div>
      <!-- navs -->
      <van-tabs class="tabs" :sticky='true' color='#ff7300' title-active-color='#3b3b3b' scrollspy>
        <van-tab title="车辆信息">
          <!-- 基本信息 -->
          <div class="base">
            <van-divider>基本信息</van-divider>
            <ul>
              <li>
                <p>{{detailData.plateYear}}年{{detailData.plateMonth}}月</p>
                <span>上牌日期</span>
              </li>
              <li>
                <p>{{detailData.kilometres}}万公里</p>
                <span>公里数</span>
              </li>
              <li>
                <p>{{detailData.cityName || '--'}}</p>
                <span>看车地</span>
              </li>
              <li>
                <p>{{detailData.carPlateSiteDesc || '--'}}</p>
                <span>上牌地</span>
              </li>
              <li>
                <p>{{detailData.gearboxTypeDesc || '--'}}</p>
                <span>变速箱</span>
              </li>
              <li>
                <p>{{ detailData.carEmissions ? detailData.carEmissions : detailData.carModelItem && detailData.carModelItem.carEmissions ? detailData.carModelItem.carEmissions : '--'}}</p>
                <span>排放量</span>
              </li>
              <li>
                <p>{{detailData.standard || '--'}}</p>
                <span>尾汽国标</span>
              </li>
              <li>
                <p>{{detailData.carLevel || '--'}}</p>
                <span>级别</span>
              </li>
              <li>
                <p>{{detailData.drivingModel || '--'}}</p>
                <span>驱动方式</span>
              </li>
            </ul>
          </div>
          <!-- 车辆描述 -->
          <div class="describe">
            <van-divider>车辆描述</van-divider>
            <div class="content">{{detailData.carDesc}}</div>
          </div>
        </van-tab>
        <van-tab title="详细配置">
          <div class="line"></div>
          <div class="common-title">
            <p>详细配置</p>
            <span>以下参配信息仅供参考，实际参数配置以售卖车辆为准</span>
          </div>
          <van-collapse accordion v-model="configOpenIndex" v-if="configData.length">
            <van-collapse-item v-for="(config,index) in configData" :key="config.title" :name='index' :title="config.title">
              <ul class="config-list">
                <li v-for="(item,idx) in config.carModelConfigItems" :key="item.id">
                  <label>{{item.name}}</label>
                  <span>{{item.value}}</span>
                </li>
              </ul>
            </van-collapse-item>
          </van-collapse>
          <van-empty v-else description='该车型暂无详细配置'></van-empty>
        </van-tab>
        <van-tab title="车辆实拍">
          <div class="line"></div>
          <div class="common-title">
            <p>车辆实拍</p>
          </div>
          <div class="content-img-box" v-for="(item,index) in detailData.imgList" v-if="index<=9 && item.attachmentType != 3">
            <img v-lazy="getLittliImg(item.filePath)" :alt="detailData.modelName" @click="previewImg(index)">
            <p v-if="item.position" class="img-position">{{item.position}}</p>
          </div>
          <div v-if="detailData.imgList.length>9" @click="previewImg(10)" class="see-more">
            <span>查看更多</span>
            <div class="iconfont icon-sanjiao-right"></div>
          </div>
        </van-tab>
        <template v-if="loveCarsList.length">
          <div class="common-title">
            <p>猜你喜欢</p>
          </div>
          <car-list :list-data="loveCarsList"></car-list>
        </template>
        <div class="line"></div>
        <bottom-banner></bottom-banner>
      </van-tabs>
    </div>
    <!-- 按钮 -->
    <div class="fixed-box">
      <div class="fixed-l">
        <div class="icon-box" @click="jumpPage({path:'/'})">
          <i class="iconfont icon-shop"></i>
          <p>进店</p>
        </div>
        <div class="icon-box" @click="toggleLove">
          <i class="iconfont" :class="isLove?'icon-love-a':'icon-love'"></i>
          <p>收藏</p>
        </div>
        <a class="icon-box" :href="'tel:'+$store.state.employeeInfo.mobile">
          <i class="iconfont icon-phone2"></i>
          <p>电话</p>
        </a>
      </div>
      <div class="fixed-r" @click="visible.showUserSubmit = true">
        <i :class="'money-animation-'+moneyAnimationIndex"></i>
        <span>询最低价</span>
      </div>
    </div>

    <!-- 询价 -->
    <user-submit :visible="visible.showUserSubmit" :num='totalSeeNum' :car-info='detailData' type='xunjia' @close='()=>{visible.showUserSubmit = false}'></user-submit>

    <!-- 右下角功能 -->
    <van-popup position='bottom' v-model="visible.showTools" :overlay='false' class="tools">
      <div class="box">
        <div class="tool-box" :class="visible.showToolBtns?'show':'hide'" @click="jumpPage({path:'/loveList'})">
          <div class="tool-btn">
            <div class="tool-icon-box">
              <i class="iconfont icon-love"></i>
            </div>
            <span>收藏夹</span>
          </div>
        </div>
        <div class="pic" v-if="$store.state.employeeInfo.realName" @click="visible.showToolBtns = !visible.showToolBtns">
          <span>{{$store.state.employeeInfo.realName | getName}}</span>
        </div>
        <img v-else src="../assets/xunjia.png" class="pic" alt="" @click="visible.showToolBtns = !visible.showToolBtns">
      </div>
      <br />
      <img v-show="showGoTop" src="../assets/icon-top.png" alt="" class="gotop" @click="gotop">

      <div class="toast" :class="visible.showToast && 'show'">
        <div>
          已有{{totalSeeNum || '多'}}人通过此功能询到底价，快来试试吧！
        </div>
      </div>
    </van-popup>

    <!-- 降价通知 -->
    <van-popup v-model="visible.jiangjia" position='top' closeable :close-on-popstate='true' safe-area-inset-bottom class="form-popup">
      <van-form @submit="submitJiangjia">
        <p class="title">第一时间获得降价通知</p>
        <p class="info">当前报价：<span>{{detailData.retailPrice | _toFixed}}万</span></p>
        <van-field v-model="formData.price" name='price' placeholder='请填写您的意向价' class="self-input" type='number' clearable :rules='rules.price'>
          <template #button>
            <span class="self-input-right">万元</span>
          </template>
        </van-field>
        <van-field v-model="formData.mobile" name='mobile' placeholder='请填写您的手机号' @input="mobileOnInput" class="self-input" type='tel' clearable :rules='rules.mobile'></van-field>
        <van-button :loading='loadingBtn' block native-type='submit' color='#ff7300'>降价通知我</van-button>
      </van-form>
    </van-popup>

    <!-- 提交成功 -->
    <submit-success :visible='visible.showSuccess' @close='successClose' @btnClick='successClose'></submit-success>

    <!-- 询价弹框 -->
    <van-popup v-model="visible.xunjia" closeable :close-on-popstate='true' class="xunjia-popup">
      <van-form @submit="submitXunjia">
        <p class="title">
          <img src="../assets/xunjia.png" alt="">
          <span>喜欢这辆车？</span>
        </p>
        <p class="txt">已有<span>{{totalSeeNum || '多'}}</span>人通过询价获得优惠，快来试试！</p>
        <van-field v-model="formData.mobile" placeholder='请填写您的手机号' @input="mobileOnInput" class="self-input" type='tel' clearable :rules='rules.mobile'></van-field>
        <van-button :loading='loadingBtn' block native-type='submit' color='#ff7300'>立即询价</van-button>
      </van-form>
    </van-popup>

    <!-- 用户咨询记录 -->
    <div class="user-history" :style="{'animation-iteration-count': mobileArray.length}">
      <div class="user-box">
        <img :src="headerImg" alt="">
        <span>买家{{tongzhiMobile}}最近咨询过车辆</span>
      </div>
    </div>

    <!-- 图片预览 -->
    <van-image-preview v-model="showPreview" :images='imgList' :start-position='previewImgCurrent.start' @change='onImageChange' :close-on-popstate='true'>
      <template v-slot:index>
        {{ previewImgCurrent.index }} / {{imgList.length}}
        <template v-if="previewImgCurrent.position">( {{previewImgCurrent.position}} )</template>
      </template>
    </van-image-preview>

    <!-- 检测报告附件 -->
    <div v-show="visible.reportFiles" @click="visible.reportFiles=false" :z-index='2003' class="report-imgs-container">
      <div class="report-imgs-box">
        <p class="report-tit">检测报告</p>
        <div class="report-imgs" v-if="detailData.externalCarCheckVO">
          <template v-for="(item,index) in detailData.externalCarCheckVO.attachments">
            <pdfView v-if="item.filePath.includes('.pdf')" :key='index' :src='item.filePath' />
            <img v-else :key="index" :src="item.filePath" alt="" @click.stop="previewReport(index)">
          </template>
          <!-- <viewer :images="detailData.externalCarCheckVO && detailData.externalCarCheckVO.attachments ? detailData.externalCarCheckVO.attachments : []" :options="options">
        </viewer> -->
        </div>
      </div>

      <!-- 检测报告预览 -->
      <van-image-preview v-model="showPreviewReport" :images='reportImgList' :start-position='previewReportCurrent.start' :close-on-popstate='true'></van-image-preview>
    </div>
  </div>
</template>

<script>
import { getSellCarDetail, getCarModelConfigList, getSellListCars, saveBusinessOpportunity, getBaseStatics } from '@/api'
import { littleImg } from 'utils/filter.js'
import { jumpPage, checkPhone, filterParams, initWechatShare, gearboxTypeObj } from 'utils/utils'
import { ImagePreview } from "vant";
import carList from 'components/carList'
import bottomBanner from 'components/bottomBanner'
import userSubmit from 'components/userSubmit'
import submitSuccess from 'components/submitSuccess'
import pdfView from 'components/pdfView'
import vx from 'utils/utils'
var preview, timerToast, timerTongzhi, timerXunjia, interval;
export default {
  metaInfo() {
    return {
      title: this.detailData.brandName ? this.detailData.brandName + ' ' + this.detailData.modelName : '',
      meta: []
    }
  },
  data() {
    return {
      gearboxTypeObj: gearboxTypeObj,
      currentSwiperItem: 1,
      showPreview: false,
      showPreviewReport: false,
      previewImgCurrent: { index: 1, start: 0, position: '' },
      previewReportCurrent: { index: 1, start: 0, position: '' },
      detailData: {
        carDealerVO: {},
        imgList: []
      },
      showGoTop: false,
      options: {
        button: false,
        title: false,
        navbar: false,
        tooltip: false,
        toolbar: false
      },
      scrollTop: 0,
      loveObj: {},
      isLove: false,
      imgList: [],
      reportImgList: [],
      configData: [], // 配置项
      configOpenIndex: '',
      loveCarsList: [], // 猜你喜欢
      visible: {
        showTools: true,
        showToast: false,
        showUserSubmit: false,
        showToolBtns: false,
        jiangjia: false,
        showSuccess: false,
        xunjia: false,
        reportFiles: false
      },
      loadingBtn: false,
      formData: {
        mobile: '',
        price: ''
      },
      rules: {
        mobile: [{ required: true, message: '请填写您的手机号' }, { validator: checkPhone, message: '请填写11位手机号' }],
        price: [{ required: true, message: '请填写意向价' }],
      },
      tongzhiMobile: '18212345678',
      mobileArray: [],
      moneyAnimationIndex: 0, // 钱币滚动动画
      totalSeeNum: 0, // 看过的人数量
      headerImg: '',
      scrollBottom: 0, // 是否滚动到底部

    };
  },
  components: { carList, bottomBanner, userSubmit, submitSuccess, pdfView },
  computed: {
    // 缩略图
    getLittliImg() {
      return function (url) {
        return littleImg(url, 750)
      }
    },
    // 获取最低首付
    getDownPayment() {
      if (!this.detailData.carShowFinanceProductVO && this.detailData.supportMortgage == 'Y') {
        return this.detailData.downPayment+'万'
      } else if (this.detailData.carShowFinanceProductVO) {
        let {financialKfqVOS,websiteCarLeaseVOMap} = this.detailData.carShowFinanceProductVO;
        if(financialKfqVOS && financialKfqVOS.length){
          let downPayment;
         financialKfqVOS.forEach(ele => {
            if(ele.downPayment<downPayment || !downPayment){
              downPayment = ele.downPayment
            }
          });
          return downPayment+'元'
        } else {
          let {financialKfqVOS,websiteCarLeaseVOMap} = this.detailData.carShowFinanceProductVO;
          let keys = Object.keys(websiteCarLeaseVOMap);
          let downPayment;
          keys.forEach(key => {
            if(websiteCarLeaseVOMap[key] && websiteCarLeaseVOMap[key].length){
              websiteCarLeaseVOMap[key].forEach(ele=>{
                if(!downPayment || ele.downPayment<downPayment){
                  downPayment = ele.downPayment
                }
              })
            }
          });
          return downPayment+'元'
        }
      } else {
        return ''
      }
    }
  },
  created() {
    this.getDetail();
    this.checkLove();
    let userInfo = vx.localStorage.getItem('userInfo') || {};
    let { mobile, name, dealerId, midShopId } = userInfo;
    if ((dealerId && dealerId == this.$route.query.dId) || (midShopId && midShopId == this.$route.query.mId)) {
      this.formData.mobile = mobile;
      this.formData.name = name;
    }
    interval = setInterval(() => {
      this.moneyAnimationIndex += 1;
      if (this.moneyAnimationIndex > 50) {
        this.moneyAnimationIndex = 0;
      }
    }, 80)
    this.getBaseStatics()
    let index = parseInt(Math.random() * 5 + 0);
    this.headerImg = require(`@/assets/head-${index}.jpg`)
  },
  beforeDestroy() {
    try {
      preview.close()
      clearInterval(interval);
      clearTimeout(timerToast)
      clearTimeout(timerTongzhi)
      clearTimeout(timerXunjia)
    } catch (error) {

    }
  },
  methods: {
    // 获取基本数据
    async getBaseStatics() {
      let res = await getBaseStatics(filterParams({
        dealerId: this.$route.query.dId,
        carDealerId: this.$route.query.dId,
        midShopId: this.$route.query.mId
      }))
      if (res.code == 0) {
        this.mobileArray = res.data.mobileList || [];
        this.totalSeeNum = res.data.buyCarNum;
        if (this.mobileArray.length > 0) {
          this.initTongzhi();
        }
      }
    },
    // 手机号输入
    mobileOnInput(e) {
      if (e.length > 11) {
        this.formData.mobile = e.substr(0, 11)
      }
    },
    // 监听滚动
    windowScroll(e) {
      this.showGoTop = e.target.scrollTop > 0;
      this.scrollTop = e.target.scrollTop;
      this.scrollBottom = this.$refs['scrollDiv'].scrollHeight == e.target.scrollTop + document.documentElement.clientHeight
    },
    // 返回顶部
    gotop() {
      this.$refs.scrollDiv.scrollTop = 0;
      this.showGoTop = false;
    },
    // 轮播回调
    swipeChange(index) {
      this.currentSwiperItem = index + 1;
    },
    // 获取车源详情
    async getDetail() {
      let params = {
        id: this.$route.query.id
      }
      let res = await getSellCarDetail(params);
      if (res.code == 0) {
        res.data.createDate = res.data.createDate.split(" ")[0];
        this.detailData = res.data;
        res.data.imgList.forEach(ele => {
          if (ele.attachmentType != 3) {
            this.imgList.push(littleImg(ele.filePath, 1000));
          }
        });
        // 右下角通知
        timerToast = setTimeout(() => {
          this.visible.showToast = true;
          setTimeout(() => {
            this.visible.showToast = false;
          }, 5000)
        }, 7000);
        // 询价
        timerXunjia = setTimeout(() => {
          if (this.visible.showSuccess || this.visible.showUserSubmit) {
            return
          }
          this.visible.xunjia = true;
        }, 20000);
        this.getCarModelConfigList(this.detailData.modelId);
        this.getLoveCars(this.detailData.carLevel);
        initWechatShare({
          title: this.detailData.brandName + ' ' + this.detailData.modelName,
          desc: this.$store.state.dealerInfo.shopBrief || this.$store.state.midShopInfo.memo,
          imgUrl: this.detailData.imgList[0].filePath
        })
      }
    },
    // 获取车源配置项
    async getCarModelConfigList(modelId) {
      let res = await getCarModelConfigList({ modelId });
      if (res.code == 0) {
        this.configData = res.data;
      }
    },
    // 猜你喜欢
    async getLoveCars(carLevel) {
      if (!carLevel) return
      let res = await getSellListCars(filterParams({
        pageIndex: 1,
        pageSize: 6,
        excludeCarIds: [this.$route.query.id],
        carLevels: carLevel ? [carLevel] : [],
        dealerId: this.$route.query.dId,
        cityId: this.$route.query.city
      }));
      if (res.code == 0) {
        this.loveCarsList = res.data.tlist;
      }
    },

    // 检测收藏
    checkLove() {
      let storageKey = this.$store.state.isMidShop ? 'userLoveObjectMidShop' : 'userLoveObject'
      let loveObj = vx.localStorage.getItem(storageKey);
      this.loveObj = loveObj || {};
      let key = this.$route.query.dId || this.$route.query.mId
      let obj = this.loveObj[key] || {};
      this.isLove = obj[this.$route.query.id] ? true : false
    },
    // 收藏/取消收藏
    toggleLove() {
      let params = this.isLove ? {} : {
        id: this.$route.query.id,
        img: {
          filePath: this.detailData.imgList[0].filePath,
        },
        brandName: this.detailData.brandName,
        modelName: this.detailData.modelName,
        plateYear: this.detailData.plateYear,
        kilometres: this.detailData.kilometres,
        cityName: this.detailData.cityName,
        retailPrice: this.detailData.retailPrice
      }
      let key = this.$route.query.dId || this.$route.query.mId
      this.loveObj[key] = this.loveObj[key] || {}
      if (this.isLove) {
        delete this.loveObj[key][this.$route.query.id];
        this.$toast('取消收藏')
      } else {
        this.loveObj[key][this.$route.query.id] = params;
      }
      let storageKey = this.$store.state.isMidShop ? 'userLoveObjectMidShop' : 'userLoveObject'
      vx.localStorage.setItem(storageKey, this.loveObj);
      try {

      } catch (error) {

      }
      this.isLove = !this.isLove;
    },
    // 跳转页面
    jumpPage(to) {
      jumpPage(this.$router, to)
    },
    // 降价通知提交
    async submitJiangjia() {
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
        mobile: this.formData.mobile,
        name: this.formData.name,
        carSellId: this.$route.query.id,
        remarks: `降价通知 车型：${this.detailData.brandName} ${this.detailData.modelName}，意向价：${this.formData.price}万元`
      })
      this.loadingBtn = true;
      let res = await saveBusinessOpportunity(filterParams(params));
      this.loadingBtn = false;
      this.visible.showSuccess = true;
      this.formData.price = '';
      let obj = Object.assign({ dealerId: this.$route.query.dId, midShopId: this.$route.query.mId }, this.formData)
      vx.localStorage.setItem('userInfo', obj);
    },
    // 关闭弹窗
    successClose() {
      this.visible.jiangjia = false;
      this.visible.showSuccess = false;
      this.visible.xunjia = false
    },
    // 询价
    async submitXunjia() {
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
        mobile: this.formData.mobile,
        name: this.formData.name,
        carSellId: this.$route.query.id,
        remarks: `询价 车型：${this.detailData.brandName} ${this.detailData.modelName}`
      })
      this.loadingBtn = true;
      let res = await saveBusinessOpportunity(filterParams(params));
      this.loadingBtn = false;
      this.visible.showSuccess = true;
      this.formData.price = '';
      let obj = filterParams(Object.assign({ dealerId: this.$route.query.dId, midShopId: this.$route.query.mId }, this.formData))
      vx.localStorage.setItem('userInfo', obj);
    },
    // 通知
    initTongzhi() {
      for (let i = 0; i < this.mobileArray.length; i++) {
        setTimeout(() => {
          this.tongzhiMobile = this.mobileArray[i]
        }, i * 5000);
      }
    },
    // 打开检测报告
    openReport() {
      let { reportUrl, attachments } = this.detailData.externalCarCheckVO;
      if (reportUrl) {
        window.open(reportUrl)
      } else {
        let reportImgList = [];
        attachments.forEach(ele => {
          reportImgList.push(ele.filePath)
        });
        this.reportImgList = reportImgList;
        this.visible.reportFiles = true;
      }
    },
    // 预览图片
    previewImg(index) {
      this.previewImgCurrent.start = index;
      this.onImageChange(index);
      this.showPreview = true;
    },
    // 图片预览
    onImageChange(index) {
      try {
        this.previewImgCurrent.index = index + 1;
        this.previewImgCurrent.position = this.detailData.imgList[index].position
      } catch (error) {

      }
    },
    // 检测报告预览
    previewReport(index) {
      this.previewReportCurrent.start = index;
      this.showPreviewReport = true;
    }
  },
  watch: {
    '$route.query.id'(newV) {
      this.getDetail()
      this.gotop();
    }
  }
};
</script>

<style scoped lang="less">
.pad30 {
  padding-left: 30px;
  padding-right: 30px;
}
.container-main {
  height: 100%;
  overflow: auto;
  padding-bottom: 108px;
  -webkit-overflow-scrolling: touch;
  .banner {
    position: relative;
    height: 562px;
    .van-swipe {
      width: 100%;
      img {
        width: 100%;
        height: 562px;
      }
    }
    video {
      width: 100%;
      height: 562px;
      object-fit: contain;
    }
    &.video-box {
      background: #000;
    }

    .vr {
      position: absolute;
      right: 30px;
      bottom: 100px;
      background: rgba(0, 0, 0, 0.4);
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      border-radius: 32px;
      z-index: 10;
      img {
        width: 48px;
        margin-right: 14px;
      }
      span {
        font-size: 24px;
        color: #fff;
      }
    }

    .banner-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      z-index: 9;
      padding: 0 30px;
      p {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        color: #fff;
        font-size: 20px;
        padding: 0 16px;
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
.header {
  .title {
    display: flex;
    padding: 30px 30px 10px;
    min-height: 96px;
    .title-content {
      flex: 1;
      font-size: 34px;
      color: #000;
      font-weight: 400;
      line-height: 48px;
      overflow: hidden;
    }
  }
  .infos {
    padding: 0 30px;
    span {
      font-size: 26px;
      color: #666;
      &:not(:first-child) {
        margin-left: 14px;
        padding-left: 14px;
        border-left: 1px solid #dbdbdb;
      }
    }
  }
  .price {
    font-size: 28px;
    color: #ff7300;
    font-weight: 400;
    padding: 0 30px;
    padding-bottom: 10px;
    line-height: 50px;
    margin-top: 20px;
    img {
      width: 92px;
      position: relative;
      top: 4px;
      margin-right: 10px;
    }
    span {
      color: #ff7300;
      font-weight: 400;
      font-size: 50px;
    }
  }
  .zhidaojia {
    font-size: 26px;
    color: #7f7f7f;
    padding: 0 30px 30px;
    span {
      font-size: 26px;
      color: #7f7f7f;
      text-decoration: line-through;
      margin-left: 10px;
    }
    .tongzhi {
      margin-top: -10px;
      float: right;
      right: 0;
      font-size: 24px;
      color: #3b3b3b;
      padding: 6px 20px;
      border-radius: 10px;
      border: 1px solid #b2b2b2; /* no */
    }
  }
  .report {
    background: #ecf8e8;
    margin: 0 30px 30px;
    border-radius: 10px;
    display: flex;
    height: 82px;
    align-items: center;
    padding: 0 20px;
    img {
      width: 68px;
    }
    b,
    i {
      font-size: 28px;
      color: #22ac38;
    }
    b {
      margin: 0 18px 0 12px;
    }
    span {
      font-size: 28px;
      color: #79c480;
      flex: 1;
    }
  }
}

/* 贷款 */
.loan {
  padding: 0 30px;
  height: 110px;
  align-items: center;
  border-bottom: 20px solid #f8f8f8;
  .loan-l {
    img {
      width: 40px;
      margin-right: 10px;
      position: relative;
      top: 8px;
    }
    span {
      font-size: 30px;
      color: #3b3b3b;
    }
  }
  .loan-r {
    color: #7f7f7f;
    font-size: 26px;

    span {
      font-size: 26px;
      padding: 0 20px;
      background-image: linear-gradient(90deg, #fa1d19, #ff6d25);
      border-radius: 20px;
      line-height: 40px;
      color: #fff;
      b {
        color: #fff;
        font-size: 26px;
      }
    }
  }
}

/* 店铺信息 */
.shop-info {
  .shop-main {
    padding-top: 28px;
    padding-bottom: 28px;
    .shop-main-top {
      display: flex;
      align-items: center;
      .shop-logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .shop-m-center {
        flex: 1;
        padding-left: 30px;
        p {
          font-weight: bold;
          font-size: 30px;
          color: #3b3b3b;
          margin-bottom: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        div {
          font-size: 22px;
          color: #7f7f7f;
        }
      }
      .go-shop-btn {
        font-size: 24px;
        color: #ff7300;
        line-height: 48px;
        padding: 0 18px;
        border: 1px solid #ff7300; /* no */
        border-radius: 10px;
      }
    }
    .shop-nums {
      padding-top: 30px;
      span {
        font-size: 24px;
        color: #b2b2b2;
        padding-right: 10px;
        &:not(:first-child) {
          border-left: 1px solid #dbdbdb; /* no */
          padding-left: 10px;
        }
      }
    }
  }
  .between {
    height: 90px;
    border-top: 1px solid #e5e5e5; /* no */
    align-items: center;
    span {
      font-size: 26px;
      color: #3b3b3b;
      flex: 1;
      padding-right: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    i {
      color: #7f7f7f;
      font-size: 32px;
    }
  }
}

/* 配置信息 */
.config-list {
  li {
    display: flex;
    padding: 16px;
    label {
      font-size: 26px;
      color: #7f7f7f;
    }
    span {
      flex: 1;
      font-size: 26px;
      color: #3b3b3b;
      text-align: right;
    }
  }
}

.common-title {
  padding: 30px;
  p {
    font-size: 34px;
    color: #3b3b3b;
    margin-bottom: 10px;
    font-weight: bold;
  }
  span {
    font-size: 20px;
    color: #ff5400;
  }
}

.line {
  height: 20px;
  background: #f8f8f8;
}

.content {
  padding: 30px;
  font-size: 28px;
  color: #3b3b3b;
}

.content-img-box {
  margin-bottom: 20px;
  position: relative;
  img {
    width: 100%;
  }
  .img-position {
    font-size: 28px;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
}

/* 基础信息 */
.base {
  ul {
    padding-bottom: 40px;
  }
  li {
    display: inline-block;
    width: 33.33%;
    text-align: center;
    margin-top: 30px;
    p {
      color: #000;
      font-size: 32px;
      margin-bottom: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    span {
      font-size: 28px;
      color: #7f7f7f;
    }
  }
}

/* 底部按钮 */

.fixed-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 108px;
  background: #fff;
  z-index: 2002;
  display: flex;
  border-top: 1px solid #e5e5e5; /* no */
  align-items: center;
  padding-right: 30px;
  .fixed-l {
    flex: 1;
    display: flex;
    padding: 0 10px;
    .icon-box {
      display: inline-block;
      color: #3b3b3b;
      text-align: center;
      flex: 1;

      .iconfont {
        font-size: 40px;
      }
      p {
        font-size: 20px;
        margin-top: 8px;
      }
    }
  }
  .fixed-r {
    width: 400px;
    background: #ff4800;
    color: #fff;
    border-radius: 40px;
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: center;
    i {
      width: 40px;
      height: 40px;
      background: url(../assets/money.png) no-repeat;
      background-size: auto 40px;
      margin-right: 20px;
      overflow: hidden;
    }
    .money-animation-1 {
      background-position-x: -40px * 1;
    }
    .money-animation-2 {
      background-position-x: -40px * 2;
    }
    .money-animation-3 {
      background-position-x: -40px * 3;
    }
    .money-animation-4 {
      background-position-x: -40px * 4;
    }
    .money-animation-5 {
      background-position-x: -40px * 5;
    }
    .money-animation-6 {
      background-position-x: -40px * 6;
    }
    .money-animation-7 {
      background-position-x: -40px * 7;
    }
    .money-animation-8 {
      background-position-x: -40px * 8;
    }
    .money-animation-9 {
      background-position-x: -40px * 9;
    }
    .money-animation-10 {
      background-position-x: -40px * 10;
    }
    .money-animation-12 {
      background-position-x: -40px * 12;
    }
    .money-animation-13 {
      background-position-x: -40px * 13;
    }
    .money-animation-14 {
      background-position-x: -40px * 14;
    }
    .money-animation-15 {
      background-position-x: -40px * 15;
    }
    .money-animation-16 {
      background-position-x: -40px * 16;
    }
    .money-animation-17 {
      background-position-x: -40px * 17;
    }
    .money-animation-18 {
      background-position-x: -40px * 18;
    }
    .money-animation-19 {
      background-position-x: -40px * 19;
    }
    .money-animation-20 {
      background-position-x: -40px * 20;
    }
    .money-animation-21 {
      background-position-x: -40px * 21;
    }
    .money-animation-22 {
      background-position-x: -40px * 22;
    }
    .money-animation-23 {
      background-position-x: -40px * 23;
    }
    .money-animation-24 {
      background-position-x: -40px * 24;
    }
    .money-animation-25 {
      background-position-x: -40px * 25;
    }
    span {
      font-size: 30px;
    }
  }
}

/deep/.bottom-banner-c {
  position: relative;
  z-index: 2002;
  height: 130px;
  border-top: 0;
}

/* 右下角功能 */
.tools {
  width: 96px;
  left: auto;
  bottom: 108px;
  right: 30px;
  background: transparent;
  text-align: right;
  height: auto;
  overflow: initial;
  transition: padding ease-in-out 0.25s;
  z-index: 2001 !important;
  &.tools-scroll-bottom {
    padding-bottom: 120px;
  }
  .box {
    position: relative;
    width: 96px;
    min-height: 96px;
    display: inline-block;
    .pic {
      background: #ff7300;
      height: 96px;
      width: 96px;
      border: 4px solid #ffd7b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      left: 0;
      span {
        font-size: 30px;
        color: #fff;
      }
    }
    img.pic {
      height: 96px;
      width: 96px;
      border: 0;
    }
    .tool-box {
      background: rgba(0, 0, 0, 0.35);
      border-radius: 44px 44px 48px 48px;
      padding-top: 4px;
      padding-bottom: 96px;
      overflow: hidden;
      transition: all ease-in-out 0.25s;
      &.hide {
        height: 0;
        padding-top: 0;
        background: transparent;
      }
      &.show {
        height: 240px;
      }
      .tool-btn {
        color: #fff;
        width: 88px;
        margin: 0 auto;
        text-align: left;
        padding-bottom: 20px;
        text-align: center;
        .tool-icon-box {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff7300;
          i {
            font-size: 40px;
            font-weight: bold;
          }
        }
        span {
          font-size: 24px;
          text-align: left;
        }
      }
    }
  }
  .gotop {
    width: 92px;
    height: 92px;
    margin-top: 20px;
  }
  .toast {
    margin-top: 20px;
    width: 400px;
    transition: all ease-in-out 0.25s;
    text-align: left;
    height: 0;
    overflow: initial;
    margin-left: -304px;
    div {
      padding: 20px 30px;
      font-size: 26px;
      color: #ff6000;
      border: 1px solid #ff7300; /* no */
      background: #fff9e7;
      border-radius: 10px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background: #fff9e7;
        border-left: 1px solid #ff7300; /* no */
        border-bottom: 1px solid #ff7300; /* no */
        transform: rotateZ(-45deg) translateY(50%);
        bottom: -4px;
        right: 100px;
        border-radius: 0 0 0 6px;
      }
    }
    &.show {
      height: 124px;
    }
  }
}
.form-popup {
  height: 600px;
  padding: 85px 30px 0;
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 38px;
    margin-bottom: 50px;
  }
  .info {
    font-size: 28px;
    color: #3b3b3b;
    margin-bottom: 10px;
    span {
      font-size: 28px;
      color: #ff7300;
    }
  }
}

.xunjia-popup {
  width: 640px;
  padding: 30px;
  border-radius: 10px;
  color: #3b3b3b;
  text-align: center;
  &.hide {
    display: none;
  }
  .title {
    margin-bottom: 50px;
    img {
      width: 80px;
      margin-right: 12px;
      vertical-align: middle;
    }
    span {
      font-size: 38px;
      vertical-align: middle;
      font-weight: bold;
    }
  }
  .txt {
    font-size: 28px;
    color: #3b3b3b;
    margin-bottom: 40px;
    span {
      font-size: 28px;
      color: #ff7300;
    }
  }
}

.user-history {
  position: fixed;
  z-index: 100;
  top: 30px;
  left: 30px;
  width: 460px;
  height: 72px;
  overflow: hidden;
  opacity: 0;
  display: block;
  animation: moveTop 5s linear;
  animation-fill-mode: forwards;
  .user-box {
    display: flex;
    height: 72px;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 36px;
    padding-left: 8px;
  }
  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin-right: 10px;
  }
  span {
    font-size: 24px;
    color: #fff;
  }
}
@keyframes moveTop {
  0% {
    display: none;
    opacity: 0;
    margin-top: 50px;
  }
  40% {
    display: block;
    opacity: 0;
    margin-top: 50px;
  }
  50% {
    opacity: 1;
    margin-top: 0;
  }
  90% {
    opacity: 1;
    margin-top: 0;
  }
  99% {
    opacity: 0;
    margin-top: -130px;
  }
  100% {
    opacity: 0;
    margin-top: -130px;
    display: none;
  }
}

.self-input-right {
  font-size: 28px;
  padding: 0 20px;
}

.see-more {
  width: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafc;
  border-radius: 10px;
  height: 76px;
  margin: 20px auto 30px;
  span {
    font-size: 28px;
    color: #3b3b3b;
  }
  .iconfont {
    font-size: 20px;
    color: #ff7300;
    margin-left: 4px;
  }
}

.report-imgs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2003;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .report-imgs-box {
    width: 80%;
    height: 86%;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: auto;
    .report-tit {
      font-size: 32px;
      color: #ff7300;
      text-align: center;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .report-imgs {
      overflow: auto;
      height: 100%;
      flex: 1;

      img {
        width: 100%;
        &:not(:first-child) {
          margin-top: 20px;
        }
      }
    }
  }
}

/deep/.config-list {
  overflow: hidden;
}
</style>
