import axios from 'axios'

import {
  Notify
} from 'vant'
import {
  getSign
} from './sign.js'

/* 请求拦截 */
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // NProgress.start();
  config.withCredentials = true;
  return config;
}, error => {
  // 对请求错误做些什么
  Notify({
    type: 'danger',
    message: '通知内容'
  })
  // NProgress.done()
  return Promise.reject(error);
});

/* 请求响应拦截 */
axios.interceptors.response.use(response => {
  // NProgress.done()
  try {
    if (response) {
      if (response.data.code == 0) {
        return response.data;
      } else {
        if (!response.config.url.includes('getJssdkSignature')) {
          Notify({
            type: 'danger',
            message: response.data.message || "出现异常状况！"
          })
        }
        return response.data;
      }
    }
  } catch (e) {
    // NProgress.done()
    Notify({
      type: 'danger',
      message: "处理返回的数据发生异常"
    })
  }
  return response.data;
}, error => {
  // 对响应错误做点什么
  // NProgress.done()
  Notify({
    type: 'danger',
    message: "网络连接异常,请稍后再试"
  })
  return Promise.reject(error);
})

export default {
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  post(url, param = {}) {
    if (param.sign) delete param.sign;
    param.sign = getSign(param)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  postNoSign(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  postHasHeader(url, param = {}) {
    if (param.sign) delete param.sign;
    param.sign = getSign(param)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        headers: { browseSource: ' h5'},
        url,
        data: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}