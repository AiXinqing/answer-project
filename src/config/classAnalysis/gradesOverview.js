import  request from '@/utils/http'

export function GetStuResults({ tid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid }
  })
}
