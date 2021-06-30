import request from '@/utils/http'

//联考学校成绩对比报表
export function GetStuResults ({ tid, tsid, cid, minScore, maxScore, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, minScore, maxScore, pageIndex, pageSize }
  })
}
