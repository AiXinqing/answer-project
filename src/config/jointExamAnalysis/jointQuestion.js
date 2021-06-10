import  request from '@/utils/http'


export function GetStuResults({ tid, tsid, scids,url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, scids }
  })
}
