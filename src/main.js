import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'
import 'vant/lib/index.css';
import MetaInfo from 'vue-meta-info'
import vx from 'utils/utils'
import VConsole from 'vconsole'
import {
  getWeChatCode,
  getQueryString,
  initWechatSDK
} from 'utils/utils'
import {
  agentUrl
} from 'api/url'
import {
  Button,
  Icon,
  Popup,
  Search,
  IndexBar,
  IndexAnchor,
  Field,
  Tag,
  Swipe,
  SwipeItem,
  Notify,
  List,
  Divider,
  Tabs,
  Tab,
  Collapse,
  CollapseItem,
  Lazyload,
  Form,
  Toast,
  Empty,
  ImagePreview,
  Overlay
} from 'vant';

Vue
  .use(MetaInfo)
  .use(Button)
  .use(Icon)
  .use(Popup)
  .use(Search)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Field)
  .use(Tag)
  .use(Swipe)
  .use(SwipeItem)
  .use(Notify)
  .use(List)
  .use(Divider)
  .use(Tabs)
  .use(Tab)
  .use(Collapse)
  .use(CollapseItem)
  .use(Lazyload, {
    error: require('./assets/nodata.png'),
    loading: require('./assets/loading.gif'),
    attempt: 3,
    preload: 1.33
  })
  .use(Form)
  .use(Toast)
  .use(Empty)
  .use(ImagePreview)
  .use(Overlay)
Vue.config.productionTip = false

if(process.env.NODE_ENV === 'development'){
  new VConsole()
}

// 初始化数据
initData();

function initData() {
  initWechatSDK();
  // 获取微信code
  let wechatUserInfo = vx.localStorage.getItem('wechatUserInfo');
  // 开发环境不获取userinfo
  if (process.env.NODE_ENV != "development") {
    // 如果有用户信息
    if (wechatUserInfo) {
      store.commit('SET_WECHAT_USER_INFO', wechatUserInfo);
    } else {
      // 如果没有用户信息
      let code = getQueryString('code');
      if (!code) {
        getWeChatCode();
      } else {
        store.dispatch('getWechatUserInfo', code)
      }
    }
  }

  // 获取url 传参
  let sId = getQueryString("sId"); // 员工id
  let dId = getQueryString("dId"); // 车商id
  let mId = getQueryString("mId"); // 线下店id
  let cityCode = getQueryString("city"); // 城市code
  let shareId = getQueryString('shareId'); // 是否营销工具分享
  if (sId && (dId || mId)) {
    store.commit("SET_SID", sId);
    if (shareId) {
      store.commit('SET_SHARE_ID', shareId)
    }
    // 车商分享
    if (dId) {
      store.commit("SET_DID", dId);
      store.dispatch('getDealerInfo', {
        employeeId: sId,
        dealerId: dId
      });
    } else {
      store.commit("SET_MID", mId);
      store.commit("SET_CITY_CODE", cityCode);
      // 线下店分享
      store.dispatch('getMidShopInfo', {
        salesmanId: sId
      });
    }
  };
}


// 过滤器
import * as myFilter from './utils/filter'
Object.keys(myFilter).forEach(key => {
  Vue.filter(key, myFilter[key])
})


/* 如果是PC端，设置html的样式，防止postcss-pxtorem自适应造成过大的问题 */
windoeResize();
window.onresize = windoeResize;

function windoeResize() {
  let windowWidth = document.documentElement.clientWidth;
  if (windowWidth > 1024) {
    document.getElementsByTagName('html')[0].style.fontSize = '37.5px'
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')