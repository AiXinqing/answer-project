import request from '@/utils/http'
import { URL } from '../api'

export function getExamInfo ({ tid }) {
  return request({
    url: URL.GetExamInfo,
    method: 'get',
    params: { tid }
  })
}

// 成绩册报表
export function GetStuResults ({ tid, tsid, cids, keyWords, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cids, keyWords, pageIndex, pageSize }
  })
}

// 等级成绩册报表
export function GetStuLvlResults ({ tid, tsid, cids, keyWords, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cids, keyWords, pageIndex, pageSize }
  })
}

// 获取等级
export function GetASAnalyseLvlList ({ tid, tsid, type,  url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, type }
  })
}

// 获取动态表头
export function dynamicHeader ({ tid, tsid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid }
  })
}

// 获取是否显示联考分析
export function getIsShowJointExam ({ tid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid }
  })
}

// 作答统计分析
export function GetAnswerStaticAnalysis ({ tid,tsid,cids,type, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid,tsid,cids,type }
  })
}

// 作答统计分析学生详情
export function staticAnalysisDetail ({ tid,tsid,cids,type,tqid,scoreOrOptions,pageIndex,pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid,tsid,cids,type,tqid,scoreOrOptions,pageIndex,pageSize}
  })
}