export const URL = {
  AXIOS_TIMEOUT:10000,
  SERVICE_CONTEXT_PATH:'/', // http://localhost:60044 http://192.168.0.56:8012
  SERVICE_UPLOAD_PICTURE:'https://lzxxt.cn:60041/' // 图片上传服务器端口 //http://172.16.10.99:60041/
}

export function getCookie(name){
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return "";
}