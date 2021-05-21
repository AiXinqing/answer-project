import  request from '@/utils/http'

export function getExamList({ url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { }
  })
}

export function getClassList({ tid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid }
  })
}

