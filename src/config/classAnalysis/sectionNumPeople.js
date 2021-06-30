import request from '@/utils/http'

export function GetStuResults ({ tid, tsid, step, showGrade, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, step, showGrade }
  })
}
