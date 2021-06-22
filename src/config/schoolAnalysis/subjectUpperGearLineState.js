import request from '@/utils/http'

export function GetStuResults ({ tid, lineName, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, lineName }
  })
}


export function GetClassSubjectScoreLineStuDetails ({ tid, tsid, cid, lineName, type, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, lineName, type, pageIndex, pageSize }
  })
}