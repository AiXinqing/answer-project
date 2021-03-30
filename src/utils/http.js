import axios from 'axios';
import Qs from 'qs'
import {API_VERSION} from '../config/api'
import Cookie from '../utils/cookie'

// axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';
//http request 拦截器
axios.interceptors.request.use(
  config => {
    if(config.method === 'get') {
        //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
        config.paramsSerializer = function (params) {
            return Qs.stringify(params, {arrayFormat: 'repeat'})
        }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    }
)


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}, deep = false) {
  return new Promise((resolve, reject) => {
      if (deep) {
          data = Object.assign(data, { version: API_VERSION })
      } else {
          data = { data, version: API_VERSION }
      }
      let headers = getHeader()
      axios.post(url, JSON.stringify(data), {
          headers
      }).then(response => {
          if (response.data.result.code !== 0) {
              if (response.data.result.code === 4001) {
                let url = document.referrer;
                  if(url.indexOf("localhost") == -1){
                      window.location.href = url.replace('/AnswerCardWeb/#/exam', '/Manage/Login')
                  }else{
                      window.location.href = window.location.host + '/Manage/Login';
                  }
              }else{
                this.$message({
                  message: '操作失败：' + response.data.result.message,
                  type: 'warning'
                });
              }
              reject(response)
          }else{
              resolve(response.data.result);
          }
      }, err => {
        this.$message({
          message: '网络连接错误',
          type: 'warning'
        });
        reject(err.response)
      })
  })
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
      params['version'] = API_VERSION

      let headers = getHeader()
      console.log(headers)
        axios.get(url, {
                params: params,
                headers:headers
            })
            .then(response => {
                if (response.data.result.code !== 0) {
                    if (response.data.result.code === 4001) {
                        let url = document.referrer;
                            if(url.indexOf("localhost") == -1){
                                window.location.href = url.replace('/AnswerCardWeb/#/exam', '/Manage/Login')
                            }else{
                                window.location.href = window.location.host + '/Manage/Login';
                            }
                    }else{
                      this.$message({
                        message: '操作失败：' + response.data.result.message,
                        type: 'warning'
                      });
                    }
                    reject(response)
                }else{
                    resolve(response.data.result);
                }
            }, err => {
              this.$message({
                message: '网络连接错误',
                type: 'warning'
              })
              reject(err.response)
            })
    })
}


/**
 * 封装postForm请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postForm(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: [function(data) {
                    // 对 data 进行任意转换处理
                    return Qs.stringify(data)
                }]
            })
            .then(response => {
                resolve(response.data.result);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

function getHeader() {
  let headers = { 'Content-Type': 'application/json' }
  let userInfo = Cookie.get('authinfo')
  if (userInfo) {
      let d = JSON.parse(userInfo)
      const token = 'Bearer ' + d['AccessToken']
      if (token) {
          headers['authorization'] = token
      }
  }
  return headers
}
