import  request from '@/utils/http'

//联考学校成绩对比报表
export function GetSchoolGradesComparedResults({ tid, tsid,url }) {
  return request({
    url: url, //URL.GetStuResults,
    method: 'get',
    params: { tid, tsid }
  })
}
