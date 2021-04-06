export const API_VERSION = 'v1'

let BASEURL = 'http://localhost:60044'
if(process.env.NODE_ENV === 'development'){
    BASEURL = 'http://192.168.0.54:8094'
}

export const URL = {
  setCookies: BASEURL + '/api/services/common/user/refreshtoken', //cookies获取覆盖
  setLogin:BASEURL +'/api/services/common/user/login',
}