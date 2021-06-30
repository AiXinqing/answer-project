import request from '@/utils/http'

export function GetStuResults ({ tid, criticalScale, floatScale, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid, criticalScale, floatScale }
  })
}

