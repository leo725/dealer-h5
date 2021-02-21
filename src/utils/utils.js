var vx = { version: "1.0" };
import store from '@/store'
import { agentUrl } from 'api/url'
import wx from 'weixin-js-sdk';
import { getJssdkSignature } from '@/api'
import { littleImg2 } from './filter'

export function initWechatShare({title = '小胖车汽车资源共享平台',desc = '小胖车汽车资源共享平台',link = window.location.href,imgUrl = 'https://resource.xiaopangche.cn/resource/wechatImage/shop_default_icon.png'}) {
  wx.ready(() => {
    let shareData = {
      title,desc,link,
      imgUrl: littleImg2(imgUrl,300)
    }
    wx.updateAppMessageShareData(shareData);
    wx.updateTimelineShareData(shareData);
  })
}

// IOS 失去焦点回弹
export function iosWindowBack() {
  document.body.addEventListener('focusout', () => {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //软键盘收起的事件处理
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight - 1, 0))
      }, 100)
    }
  })
}

// 获取微信 code
export function getWeChatCode() {
  // 如果非微信环境不获取code
  if(!navigator.userAgent.toLowerCase().includes('micromessenger')){
    return
  }
  let appid = 'wxe7383fd0c94d89c4'
  // 测试环境
  if (agentUrl.includes('testagent')) {
    appid = 'wxdf6737a5e92358fc'
  }
  // 去除原来链接中的code
  const redirectUri = encodeURIComponent(location.href.replace(/\?code=(\S*)#\//,'#/'))
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

// 获取url参数
export const  getQueryString = (name) =>{
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let search = window.location.hash.split('?'),
    r = null;
  if (name == "code") {
    search = window.location.search.split('?');
  }
  if (search.length > 1) {
    r = ('?' + search[1]).substr(1).match(reg);
  }
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

// 初始化微信SDK
export const initWechatSDK = () => {
  let reportUrl = window.location.href.split("#")[0];
  let params = {
    reportUrl: reportUrl
  }
  getJssdkSignature(params).then(res => {
    if (res.code == 0) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.appId, // 必填，公众号的唯一标识  res.data.appId
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature, // 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'getLocation', 'openLocation'] // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
      });
    }
  });
}


// 调整页面 带入相应参数
export const jumpPage = (router, to = {query:{}} ) => {
  if(!to.query) to.query={};
  // dId: 车商id sId: 员工id
  to.query = filterParams(Object.assign(to.query,{dId:store.state.dId,sId:store.state.sId,mId:store.state.mId,city: store.state.cityCode}));
  try {
    if(JSON.stringify(store.state.dealerInfo) == '{}' && !store.state.isMidShop){
      store.dispatch('getDealerInfo',{dealerId:store.state.dId,employeeId:store.state.sId})
    }else if(JSON.stringify(store.state.midShopInfo) == '{}' && store.state.isMidShop){
      store.dispatch('getMidShopInfo',{salesmanId:store.state.sId})
    }
  } catch (error) {
    
  }
  router.push(to)
}

// 价格
export const priceArray = [
  { name: "不限", min: "", max: "" },
  { name: "3万以下", min: '', max: 3 },
  { name: "3-5万", min: 3, max: 5 },
  { name: "5-10万", min: 5, max: 10 },
  { name: "10-15万", min: 10, max: 15 },
  { name: "15-20万", min: 15, max: 20 },
  { name: "20-30万", min: 20, max: 30 },
  { name: "30-50万", min: 30, max: 50 },
  { name: "50万以上", min: 50, max: "" }
]

// 变速箱类型
export const gearboxTypeObj = { manual: '手动', auto: '自动'};

// 验证手机号码
export function regPhone(phone) {
  return (/^1[3456789]\d{9}$/.test(phone))
}
// 验证邮箱
export function regEmail(email) {
  return (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))
}
// 验证身份证
export function regCard(ID) {
  return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(ID))
}

// 清除 object 中的空值
export function filterParams(params){
  let obj = {}
  for(let key in params){
    if (params[key]!=undefined  && params[key] !== '' && params[key] != null) {
      obj[key] = params[key]
    }
  }
  return obj
}

// 验证手机号
export function checkPhone (value, rule) {
  if (!value) {
    return false;
  } else {
    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
    return reg.test(value)
  }
};

// localStorage存储
vx.localStorage = {
  setItem: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem: function (key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },

  removeItem: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};
vx.sessionStorage = {
  setItem: function (key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem: function (key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },

  removeItem: function (key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {}
  }
};

// 页面缓存
export const pageParams = {
  set : (path,params)=>{
    try {
      vx.sessionStorage.setItem(path,params)
    } catch (error) {
      
    }
  },
  get : (path)=>{
    try {
      let params = vx.sessionStorage.getItem(path);
      return params || {}
    } catch (error) {
      
    }
  },
  remove : (path)=>{
    try {
      vx.sessionStorage.removeItem(path)
    } catch (error) {
      
    }
  }  
}

export default vx;