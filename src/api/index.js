import fetch from '@/api/http'
import { agentUrl, salesmanUrl } from '@/api/url.js'

/************** 基础数据 ****************/
// 根据code 获取用户信息
export const getWechatUserInfo = (query) => {
  return fetch.post(agentUrl + '/agentUser/getWechatUserInfo', query)
}
// 经纪人 - 初始化微信SDK
export const getJssdkSignature = (query) => {
  return fetch.post(agentUrl + '/agentUser/getJssdkSignature', query)
}
// 经纪人 - 获取品牌列表
export const getCarBrandList = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarBrandList', query)
}
// 经纪人 - 获取车系
export const getCarSeriesList = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarSeriesList', query)
}
// 经纪人 - 获取车系 取得车商某品牌车系列表
export const getCarSeriesList4Dealer = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarSeriesList4Dealer', query)
}
// 经纪人 - 获取车型
export const getCarModelList = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarModelList', query)
}
// 经纪人 - 车辆级别和排放标准
export const allLevelsAndStandards = (query) => {
  return fetch.post(agentUrl + '/api/car/allLevelsAndStandards', query)
}
// 经纪人 - 获取车辆数量
export const getSellCarCount = (query) => {
  return fetch.post(agentUrl + '/api/car/sell/count', query)
}


// 经纪人 - 获取车辆列表
export const getSellListCars = (query) => {
  return fetch.post(agentUrl + '/api/car/sell/listCars', query)
}
// 经纪人 - 获取车辆详情
export const getSellCarDetail = (query) => {
  return fetch.postHasHeader(agentUrl + '/api/car/sell/detail', query)
}
// 经纪人 - 获取车辆详细配置参数
export const getCarModelConfigList = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarModelConfigList', query)
}

// 经纪人 - 车商信息
export const getDealerInfo = (query) => {
  return fetch.post(agentUrl + '/api/dealer/getDealerInfo', query)
}
// 经纪人 - 取得车商的车辆品牌列表
export const getCarBrandListByDealerId = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarBrandListByDealerId', query)
}

// 经纪人 - 保存卖车买车商机
export const saveBusinessOpportunity = (query) => {
  return fetch.post(agentUrl + '/api/business/saveBusinessOpportunity', query)
}
// 经纪人 - 获取显示基本数据
export const getBaseStatics = (query) => {
  return fetch.post(agentUrl + '/api/business/getBaseStatics', query)
}


/* 线下店分享接口 */
// 经纪人 - 线下店分享 - 获取线下店信息
export const teamMemberInfo = (query) => {
  return fetch.post(agentUrl + '/api/midShop/teamMemberInfo', query)
}
// 经纪人 - 线下店分享 - 取得城市的车辆品牌列表
export const getCarBrandListByCityCode = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarBrandListByCityCode', query)
}
// 经纪人 - 线下店分享 - 取得城市某品牌车系列表
export const getCarSeriesList4City = (query) => {
  return fetch.post(agentUrl + '/api/systembase/getCarSeriesList4City', query)
}

// 员工版 - 营销工具 - 创建查看记录
export const viewLogCreate = (query) => {
  return fetch.post(salesmanUrl + '/st/viewLog/create', query)
}
// 员工版 - 营销工具 - 获取banner图片
export const bannerGetById = (query) => {
  return fetch.post(salesmanUrl + '/api/banner/getById', query)
}