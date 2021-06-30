import request from '@/utils/http'

export function GetStuResults ({ tid, tsid, cid, asid, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, asid, pageIndex, pageSize }
  })
}

// 获取动态表头
export function dynamicHeader ({ tid, tsid, url }) {
  return request({
    url: url, //URL.GetTableHeadeSubject,
    method: 'get',
    params: { tid, tsid }
  })
}