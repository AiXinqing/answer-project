import  request from '@/utils/http'

export function GetStuResults({ tid,type,rank, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,type,rank }
  })
}

