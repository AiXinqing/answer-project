import  request from '@/utils/http'

export function GetStuResults({ tid, tsid, cids,step,type,url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, cids,step,type}
  })
}
