import  request from '@/utils/http'
import { URL } from './api'

export function getExamInfo({ prmTid }) {
  return request({
    url: URL.GetExamInfo,
    method: 'get',
    params: { prmTid }
  })
}

export function GetStuResults({ tid, tsid, cids, keyWords, pageIndex, pageSize }) {
  return request({
    url: URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, cids, keyWords, pageIndex, pageSize }
  })
}

// 获取动态表头
export function dynamicHeader({ tid, tsid }) {
  return request({
    url: URL.GetTableHeadeSubject,
    method: 'get',
    params: { tid, tsid }
  })
}