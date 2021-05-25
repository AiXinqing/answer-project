import  request from '@/utils/http'

export function getExamList({ url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { }
  })
}

export function getClassList({ tid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid }
  })
}

export function getProfileInfo({ tid,tsid,cid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,tsid,cid }
  })
}

export function getSubjectJuxtapose({ tid,tsid,cid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,tsid,cid }
  })
}

//获取学科等级分布学生详情
export function getSubjectDetail({ tid,tsid,cid, asid, pageIndex, pageSize, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,tsid,cid, asid, pageIndex, pageSize }
  })
}

//学科对比全部
export function subjectContrast({ tid,cid, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,cid }
  })
}

//学科对比单科
export function singleSubjectContrast({ tid, tsid, topNum, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,tsid,topNum }
  })
}

//成绩单(全科)
export function getTranscript({ tid, tsid,cid,keyWords, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid,cid,keyWords }
  })
}

//成绩单(单科)
export function getSingleTranscript({ tid, tsid, cid, keyWords, url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid,tsid,cid,keyWords }
  })
}