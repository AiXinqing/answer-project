import  request from '@/utils/http'

export function GetStuResults({ tid, tsid, cid, rankName, type, pageIndex, pageSize, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, cid, rankName, type, pageIndex, pageSize}
  })
}

// 获取动态表头
export function dynamicHeader({ tid, tsid ,url}) {
  return request({
    url: url, //URL.GetTableHeadeSubject,
    method: 'get',
    params: { tid, tsid }
  })
}