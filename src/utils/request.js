import axios from 'axios';
// import { MessageBox, Message } from 'element-ui'
import { URL } from './config'


var service = axios.create({
  baseURL: URL.SERVICE_CONTEXT_PATH,
  withCredentials: true,
  timeout: 1000,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
  }
});

// 添加请求拦截器
service.interceptors.request.use(config => {
    // 在发送请求之前做什么
    // console.log(process.env.NODE_ENV)

    // if (!config.data) config.data = {}
    // if (store.getters.token) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken()
    // }
    // config.headers['X-Requested-With'] = 'XMLHttpRequest'

    return config
  },
  error => {
    // 对请求错误做什么
    return Promise.reject(error)
  }
)

// 添加相应拦截器
service.interceptors.response.use(response => {
    // 对相应数据做点什么
    return response
  },
  error => {
    // 对相应错误做点什么
    return Promise.reject(error)
  }
)

export default service
