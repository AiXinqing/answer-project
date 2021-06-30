import request from '@/utils/http'

export function GetStuResults ({ tid, tsid, showGrade, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, showGrade }
  })
}
