import request from '@/utils/http'

export function GetStuResults ({ tid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid }
  })
}
