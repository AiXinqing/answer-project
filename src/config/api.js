export const API_VERSION = 'v1'
// 报表服务器地址
let BASEURL = 'http://localhost:60044'
if (process.env.NODE_ENV === 'development') {
  BASEURL = 'http://192.168.0.54:8094'
}

export const URL = {
  GetExamInfo: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetExamInfo', // 获取考试班级和科目信息
  GetStuResults: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResults', // 成绩册分析报表
  GetTableHeadeSubject: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResultsHeade', //成绩册报表动态科目
  ExportStuResults: BASEURL + '/Report/AnlyReport/ExportStuResults', // 成绩册分析报表下载
  BrowsescoreAnsw: BASEURL + '/Manage/Marking/BrowsescoreAnsw', // 跳转链接地址
  // 小题分数
  GetStuSmallScoreHeade: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuSmallScoreHeade', // 小题分数报表动态表头 -----------------(联考小题分数报表动态表头)
  GetStuSmallScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuSmallScore', //小题分数报表
  ExportStuSmallScore: BASEURL + '/Report/AnlyReport/ExportStuSmallScore', // 小题分数报表下载
  //班级成绩对比报表
  GetClassScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreContrast', // 班级成绩对比报表
  ExportClassScoreContrast: BASEURL + '/Report/AnlyReport/ExportClassScoreContrast', // 班级成绩对比报表下载
  GetStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreContrastStuDetails', // 班级成绩对比报表下载
  ExportStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreContrastStuDetails', // 班级成绩对比报表学生名单详情下载
  //试题汇总报表
  GetQuestionSummary: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetQuestionSummary', //试题汇总报表
  ExportQuestionSummary: BASEURL + '/Report/AnlyReport/ExportQuestionSummary', //试题汇总报表下载
  GetSummaryStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetQuestionSummaryStuDetails', // 试题汇总报表学生名单详情
  ExportSummaryStuDetails: BASEURL + '/Report/AnlyReport/ExportQuestionSummaryStuDetails', //试题汇总报表学生名单详情下载
  //成绩分段报表
  GetClassScoreSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegment', //成绩分段报表
  ExportClassScoreSegment: BASEURL + '/Report/AnlyReport/ExportClassScoreSegment', //成绩分段报表下载
  GetSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegmentStuDetails', //成绩分段报表学生名单详情
  ExportSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreSegmentStuDetails', //成绩分段报表学生名单详情下载
  //成绩名次和比例分析
  GetPlacingSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScorePlacingSegment', //成绩名次和比例分析
  ExportPlacingSegment: BASEURL + '/Report/AnlyReport/ExportClassScorePlacingSegment', //成绩名次和比例分析下载
  GetClassSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScorePlacingSegmentStuDetails', // 成绩名次学生名单详情
  ExportClassSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScorePlacingSegmentStuDetails', // 成绩名次学生名单详情下载

  //---------------------------------------班级分析报告
  GetClassAvgScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassAvgScore', //学科平均分排名
  GetClassScoreSurvey: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSurvey', //班级成绩概况 -------------- // 班级 false  // 校级 true
  ExportClassScoreSurvey: BASEURL + '/Report/AnlyReport/ExportClassScoreSurvey', //班级成绩概况下载 -------------- // 班级 false  // 校级 true
  GetClassScoreScaleNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreScaleNum', //各等级人数占比比较 -------------- // 班级 false  // 校级 true
  ExportClassScoreScaleNum: BASEURL + '/Report/AnlyReport/ExportClassScoreScaleNum', //各等级人数占比下载 -------------- // 班级 false  // 校级 true
  GetClassScoreSegmentNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegmentNum', //各分数段详细人数 -------------- // 班级 false  // 校级 true
  ExportClassScoreSegmentNum: BASEURL + '/Report/AnlyReport/ExportClassScoreSegmentNum', //各分数段详细人数下载   -------------- // 班级 false  // 校级 true
  GetClassQuestionScoringRate: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassQuestionScoringRate', //学科试题得分率
  ExportClassQuestionScoringRate: BASEURL + '/Report/AnlyReport/ExportClassQuestionScoringRate', //学科试题得分率下载

  //---------------------------------------校级分析报告
  GetTotalScoreSituation: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTotalScoreSituation', //总分基本情况
  GetSubjectScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetSubjectScoreContrast', //各学科基本数据对比情况
  ExportSubjectScoreContrast: BASEURL + '/Report/AnlyReport/ExportSubjectScoreContrast', //各学科基本数据对比情况下载
  GetTotalScoreDistribution: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTotalScoreDistribution', //总分分布
  GetClassSubjectScoreCriticalityNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassSubjectScoreCriticalityNum', //临界生分析
  ExportClassSubjectScoreCriticalityNum: BASEURL + '/Report/AnlyReport/ExportClassSubjectScoreCriticalityNum', //临界生分析下载
  GetSubjectScoreLvlContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetSubjectScoreLvlContrast', //各科成绩等级人数占比比较
  ExportSubjectScoreLvlContrast: BASEURL + '/Report/AnlyReport/ExportSubjectScoreLvlContrast', //各科成绩等级人数占比下载
  GetClassScoreRankNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreRankNum', //优秀生/学困生分析
  ExportClassScoreRankNum: BASEURL + '/Report/AnlyReport/ExportClassScoreRankNum', //优秀生/学困生分析下载

  //---------------------------------------教师分析
  GetAsTestList: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetAsTestList', // 获取考次列表
  GetAsTestClass: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetAsTestClass', // 获取本次考试的班级科目
  GetGeneralSituation: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetGeneralSituation', // 获取整体概况信息
  GetClassScoreLvlAnalysis: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreLvlAnalysis', // 获取学科等级分布
  GetClassScoreContrastStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreContrastStuDetails', // 获取学科等级分布学生详情
  GetStuResultsHeade: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetStuResultsHeade', // 获取学科等级分布学生详情动态表头 ----------------- （ 联考成绩册 ）
  GetTeacherSubjectScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTeacherSubjectScoreContrast', // 学科对比（科目选择全部）
  GetTeacherClassScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTeacherClassScoreContrast', // 学科对比（科目选择单科）
  GetClassStuTotalScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassStuTotalScore', // 成绩单（全科）
  ExportClassStuTotalScore: BASEURL + '/Report/AnlyReport/ExportClassStuTotalScore', // 成绩单（全科）下载
  GetClassStuSubjectScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassStuSubjectScore', // 成绩单（单科）
  ExportClassStuSubjectScore: BASEURL + '/Report/AnlyReport/ExportClassStuSubjectScore', // 成绩单（单科）下载
  GetTeacherClassQuestion: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTeacherClassQuestion', // 试题分析
  ExportTeacherClassQuestion: BASEURL + '/Report/AnlyReport/ExportTeacherClassQuestion', // 试题分析下载
  GetTeacherClassStuSmallScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTeacherClassStuSmallScore', // 学生小题得分
  ExportTeacherClassStuSmallScore: BASEURL + '/Report/AnlyReport/ExportTeacherClassStuSmallScore', // 学生小题得分下载

  //---------------------------------------联考分析报告

  GetJointExamSchool: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchool', // 获取联考学校
  GetJointExamStuResults: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamStuResults', // 联考成绩册分析报表
  ExportJointExamStuResults: BASEURL + '/Report/AnlyReport/ExportJointExamStuResults', // 联考成绩册分析报表下载
  GetJointExamStuSmallScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamStuSmallScore', // 联考小题分数报表
  ExportJointExamStuSmallScore: BASEURL + '/Report/AnlyReport/ExportJointExamStuSmallScore', // 联考小题分数报表
  GetJointExamQuestionSummary: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamQuestionSummary', // 联考试题汇总报表
  ExportJointExamQuestionSummary: BASEURL + '/Report/AnlyReport/ExportJointExamQuestionSummary', // 联考试题汇总报表下载
  GetJointExamSchoolScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreContrast', // 联考学校成绩对比报表
  GetJointExamSchoolScoreContrastStuDetails_s: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreContrastStuDetails', // 联考学校成绩对比学生详情
  ExportJointExamSchoolScoreContrastStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreContrastStuDetails', // 联考学校成绩对比学生详情下载

  ExportJointExamSchoolScoreContrast: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreContrast', // 联考学校成绩对比报表下载
  GetJointExamClassScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreContrast', // 联考班级成绩对比报表
  ExportJointExamClassScoreContrast: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreContrast', // 联考班级成绩对比报表下载
  GetJointExamSchoolScoreSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreSegment', // 联考学校成绩分段统计报表
  GetJointExamSchoolScoreSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreSegmentStuDetails', // 联考学校成绩分段统计学生详情
  ExportJointExamSchoolScoreSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreSegmentStuDetails', // 联考学校成绩分段统计学生详情下载

  ExportJointExamSchoolScoreSegment: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreSegment', // 联考学校成绩分段统计报表下载
  GetJointExamClassScoreSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreSegment', // 联考班级成绩分段统计报表
  ExportJointExamClassScoreSegment: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreSegment', // 联考班级成绩分段统计报表下载

}