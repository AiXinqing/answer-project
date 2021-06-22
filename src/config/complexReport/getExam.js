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