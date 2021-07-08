import request from '@/utils/http'
import { URL } from '../api'

export function getExamInfo ({ prmTid }) {
  return request({
    url: URL.GetExamInfo,
    method: 'get',
    params: { prmTid }
  })
}

export function GetStuResults ({ tid, tsid, cids, keyWords, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, cids, keyWords, pageIndex, pageSize }
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