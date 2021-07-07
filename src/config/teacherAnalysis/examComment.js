import  request from '@/utils/http'

export function getExamComment({ tid,tsid,cid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid,tsid,cid }
  })
}