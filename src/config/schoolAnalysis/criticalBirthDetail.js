import request from '@/utils/http'

//临界生分析学生详情
export function GetStuResults ({ tid, tsid, cid, minScore, maxScore, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, minScore, maxScore, pageIndex, pageSize }
  })
}

//各分数段详细人数学生详情
export function sectionNumPeopleDetail ({ tid, tsid, cid, segmentName, step, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, segmentName, step, pageIndex, pageSize }
  })
}

//优秀生/学困生学生详情
export function excellentGradeDetail ({ tid, tsid, cid, type, rank, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, type, rank, pageIndex, pageSize }
  })
}