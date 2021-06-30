import request from '@/utils/http'

export function GetStuResults ({ tid, type, rank, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, type, rank }
  })
}

