import request from '@/utils/http'

export function GetStuResults ({ tid, tsid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid }
  })
}

export function getTotalScoreResults ({ tid, tsid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid }
  })
}
