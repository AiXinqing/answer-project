import request from '@/utils/http'
import { URL } from '../api'

export function getExamInfo ({ tid }) {
  return request({
    url: URL.GetExamInfo,
    method: 'get',
    params: { tid }
  })
}

export function GetStuResults ({ tid, tsid, scids, keyWords, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, scids, keyWords, pageIndex, pageSize }
  })
}

// 获取动态表头
export function dynamicHeader ({ tid, tsid, url }) {
  return request({
    url: url, //URL.GetTableHeadeSubject,
    method: 'get',
    params: { tid, tsid }
  })
}