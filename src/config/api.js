export const API_VERSION = 'v1'
// 报表服务器地址
let BASEURL = 'http://localhost:60044'
if(process.env.NODE_ENV === 'development'){
    BASEURL = 'http://192.168.0.54:8094'
}

export const URL = {
  GetExamInfo: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetExamInfo', // 获取考试班级和科目信息
  GetStuResults: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResults', // 成绩册分析报表
  GetTableHeadeSubject: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResultsHeade', //成绩册报表动态科目
  ExportStuResults: BASEURL + '/Report/AnlyReport/ExportStuResults', // 成绩册分析报表下载
  BrowsescoreAnsw: BASEURL + '/Manage/Marking/BrowsescoreAnsw', // 跳转链接地址
  // 小题分数
  GetStuSmallScoreHeade: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuSmallScoreHeade', // 小题分数报表动态表头
  GetStuSmallScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuSmallScore', //小题分数报表
  ExportStuSmallScore: BASEURL + '/Report/AnlyReport/ExportStuSmallScore', // 小题分数报表下载
  //班级成绩对比报表
  GetClassScoreContrast:BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreContrast', // 班级成绩对比报表
  ExportClassScoreContrast:BASEURL + '/Report/AnlyReport/ExportClassScoreContrast', // 班级成绩对比报表下载
  GetStuDetails:BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreContrastStuDetails', // 班级成绩对比报表下载
  ExportStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreContrastStuDetails', // 班级成绩对比报表学生名单详情下载
  //试题汇总报表
  GetQuestionSummary: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetQuestionSummary', //试题汇总报表
  ExportQuestionSummary:BASEURL + '/Report/AnlyReport/ExportQuestionSummary', //试题汇总报表下载
  GetSummaryStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetQuestionSummaryStuDetails', // 试题汇总报表学生名单详情
  ExportSummaryStuDetails: BASEURL + '/Report/AnlyReport/ExportQuestionSummaryStuDetails', //试题汇总报表学生名单详情下载
  //成绩分段报表
  GetClassScoreSegment:BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegment', //成绩分段报表
  ExportClassScoreSegment:BASEURL + '/Report/AnlyReport/ExportClassScoreSegment', //成绩分段报表下载
  GetSegmentStuDetails:BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegmentStuDetails', //成绩分段报表学生名单详情
  ExportSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreSegmentStuDetails', //成绩分段报表学生名单详情下载
  //成绩名次和比例分析
  GetPlacingSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScorePlacingSegment', //成绩名次和比例分析
  ExportPlacingSegment: BASEURL + '/Report/AnlyReport/ExportClassScorePlacingSegment', //成绩名次和比例分析下载
  GetClassSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScorePlacingSegmentStuDetails', // 成绩名次学生名单详情
  ExportClassSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScorePlacingSegmentStuDetails', // 成绩名次学生名单详情下载
}