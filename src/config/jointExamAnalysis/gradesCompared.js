import request from '@/utils/http'

//联考学校成绩对比报表
export function GetSchoolGradesComparedResults ({ tid, tsid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid }
  })
}

//联考学校成绩对比学生详情
export function JointExamSchoolDetails ({ tid, tsid, scid, asid, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, scid, asid, pageIndex, pageSize }
  })
}

//联考班级成绩对比报表
export function GetClassGradesComparedResults ({ tid, tsid, scids, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, scids }
  })
}

//联考班级成绩对比学生详情
export function JointExamClassDetails ({ tid, tsid, cid, asid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cid, asid }
  })
}


//联考学校成绩分段统计报表
export function GetSchoolGradesStatisticsResults ({ tid, tsid, step, type, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, step, type }
  })
}

// 联考学校成绩分段统计学生详情
export function schoolStatisticsDetails ({ tid, tsid, scid, segmentName, step, type, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, scid, segmentName, step, type, pageIndex, pageSize }
  })
}

//联考班级成绩分段统计报表
export function GetClassGradesStatisticsResults ({ tid, tsid, scids, step, type, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, scids, step, type }
  })
}