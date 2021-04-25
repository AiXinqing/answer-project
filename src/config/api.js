export const API_VERSION = 'v1'
// 报表服务器地址
let BASEURL = 'http://localhost:60044'
if(process.env.NODE_ENV === 'development'){
    BASEURL = 'http://192.168.0.54:8094'
}

export const URL = {
  GetExamInfo: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetExamInfo', // 获取查询列表
  GetStuResults: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResults', // 获取tablel列表
  GetTableHeadeSubject: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResultsHeade', //获取动态表头
  ExportStuResults: BASEURL + '/Report/AnlyReport/ExportStuResults', // 下载table列表
  BrowsescoreAnsw:BASEURL + '/Manage/Marking/BrowsescoreAnsw', // 跳转链接地址
}