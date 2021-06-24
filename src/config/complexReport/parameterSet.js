import request from '@/utils/http'

//获取分析参数得分率
export function GetASAnalyseSettingList ({ tid, tsid, type, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, tsid, type }
  })
}
