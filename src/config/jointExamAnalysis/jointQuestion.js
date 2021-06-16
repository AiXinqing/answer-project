import request from '@/utils/http'


export function GetStuResults ({ tid, tsid, scids, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, scids }
  })
}

// 联考试题汇总报表学生详情
export function jointQuestionDetails ({ tid, tsid, cid, tqid, type, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, tqid, type, pageIndex, pageSize }
  })
}