import request from '@/utils/http'

export function GetStuResults ({ tid, tsid, cids, step, type, placing, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cids, step, type, placing }
  })
}
