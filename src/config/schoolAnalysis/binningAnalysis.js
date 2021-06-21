import request from '@/utils/http'

//总分上档线分析
export function GetStuResults ({ tid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid }
  })
}

//获取上档线设置表格数据
export function getUpperGearLine ({ tid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid }
  })
}


//总分上档线分析学生详情
export function GetClassTotalScoreLineStuDetails ({ tid, cid, lineName, type, pageIndex, pageSize, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, cid, lineName, type, pageIndex, pageSize }
  })
}