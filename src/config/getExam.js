import  request from '@/utils/http'
import { URL } from './api'

export function getExamInfo({ prmTid }) {
  return request({
    url: URL.GetExamInfo,
    method: 'get',
    params: { prmTid }
  })
}

export function GetStuResults({ tid, subjectId, classIds, keyWords, pageIndex, pageSize }) {
  return request({
    url: URL.GetStuResults,
    method: 'get',
    params: { tid, subjectId, classIds, keyWords, pageIndex, pageSize }
  })
}
