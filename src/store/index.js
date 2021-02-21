import Vue from 'vue'
import Vuex from 'vuex'
import { getDealerInfo, getCarBrandListByDealerId, teamMemberInfo, getWechatUserInfo, viewLogCreate } from 'api'
import { filterParams, getWeChatCode } from 'utils/utils'
import { clientId } from 'api/url'
import vx from 'utils/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dId: '',
    sId: '',
    mId: '',
    dealerInfo: {},
    employeeInfo: {},
    midShopInfo: {},
    cityCode: '',
    isMidShop: false,
    wechatUserInfo: {},
    shareId: '',
    carsPageScrollTop: 0
  },
  mutations: {
    SET_DID: (state, id) => {
      state.dId = id
      state.isMidShop = false
    },
    SET_SID: (state, id) => {
      state.sId = id
    },
    SET_MID: (state, id) => {
      state.mId = id
      state.isMidShop = true
    },
    SET_DEALER_INFO: (state, info) => {
      state.dealerInfo = info
    },
    SET_EMPLOYEE_INFO: (state, info) => {
      state.employeeInfo = info
    },
    SET_MID_SHOP_INFO: (state, info) => {
      state.midShopInfo = info
    },
    SET_CITY_CODE: (state, cityCode ) => {
      state.cityCode = cityCode
    },
    SET_WECHAT_USER_INFO: (state, info)=>{
      state.wechatUserInfo = info;
    },
    SET_SHARE_ID: (state, shareId)=>{
      state.shareId = shareId;
    },
    SET_CARS_PAGE_SCROLL_TOP: (state, val)=>{
      state.carsPageScrollTop = val
    }
  },
  actions: {
    // 获取车商信息
    getDealerInfo({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        getDealerInfo(params).then(async res => {
          if (res.code == 0) {
            commit('SET_DEALER_INFO', res.data.dealer);
            commit('SET_EMPLOYEE_INFO', res.data.employeeVO);
          }
        }).catch(() => {

        })
      })
    },
    // 线下店信息
    getMidShopInfo({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        teamMemberInfo(params).then(async res => {
          if (res.code == 0) {
            let {name,account,phone,sex,teamName,teamId,duty} = res.data;
            commit('SET_MID_SHOP_INFO', res.data.midShopSimpleVO);
            commit('SET_EMPLOYEE_INFO', {
              realName: name,
              mobile: phone || account,
              headImage: res.data.headImage?res.data.headImage.headImage:'',
              position: duty
            });
          }
        }).catch(() => {

        })
      })
    },
    // 根据code 获取用户信息
    getWechatUserInfo({commit, state}, code){
      let getCodeTime = vx.localStorage.getItem('getCodeTime') || 1;
      return new Promise((resolve,reject)=>{
        getWechatUserInfo({jsCode:code,clientId}).then(res=>{
          if(res.code == 0){
            commit('SET_WECHAT_USER_INFO', res.data)
            vx.localStorage.setItem('wechatUserInfo', res.data)
          }else {
            vx.localStorage.setItem('getCodeTime', parseInt(getCodeTime)+1);
            if(getCodeTime <=1){
              getWeChatCode()
            }
          }
        })
      })
    },
    // 提交营销工具的浏览记录
    submitToolWechatInfo({commit, state}, params){
      return new Promise((resolve,reject)=>{
        viewLogCreate(params).then(res=>{
          if(res.code==0){}
        })
      })
    }
  },
  modules: {}
})