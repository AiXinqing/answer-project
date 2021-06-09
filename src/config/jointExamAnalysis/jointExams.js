import  request from '@/utils/http'
import { URL } from '../api'

export function getExamInfo({ tid }) {
  return request({
    url: URL.GetJointExamSchool,
    method: 'get',
    params: { tid }
  })
}

export function GetStuResults({ tid, tsid, scids, keyWords, pageIndex, pageSize,url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid, scids, keyWords, pageIndex, pageSize }
  })
}

// 获取动态表头
export function dynamicHeader({ tid, tsid ,url}) {
  return request({
    url: url, //URL.GetTableHeadeSubject,
    method: 'get',
    params: { tid, tsid }
  })
}