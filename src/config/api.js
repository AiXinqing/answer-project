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
  //分析参数设置
  GetASAnalyseSettingList: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetASAnalyseSettingList', // 获取分析参数得分率
  DeleteASAnalyseSetting: BASEURL + '/Api/Marking/ASAnalysisReportBLL/DeleteASAnalyseSetting', // 删除分析参数得分率
  SaveComparedASAnalyseSetting: BASEURL + '/Api/Marking/ASAnalysisReportBLL/SaveASAnalyseSetting', // 保存分析参数得分率

  GetAnswerStaticAnalysis: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetAnswerStaticAnalysis', // 作答统计分析
  ExportAnswerStaticAnalysis: BASEURL + '/Report/AnlyReport/ExportAnswerStaticAnalysis', // 作答统计分析下载
  GetAnswerStaticAnalysisStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetAnswerStaticAnalysisStuDetails', // 作答统计分析学生详情
  ExportAnswerStaticAnalysisStuDetails: BASEURL + '/Report/AnlyReport/ExportAnswerStaticAnalysisStuDetails', // 作答统计分析学生详情下载

  //---------------------------------------班级分析报告
  GetClassAvgScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassAvgScore', //学科平均分排名
  GetClassScoreSurvey: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSurvey', //班级成绩概况 -------------- // 班级 false  // 校级 true
  ExportClassScoreSurvey: BASEURL + '/Report/AnlyReport/ExportClassScoreSurvey', //班级成绩概况下载 -------------- // 班级 false  // 校级 true
  GetClassScoreScaleNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreScaleNum', //各等级人数占比比较 -------------- // 班级 false  // 校级 true
  ExportClassScoreScaleNum: BASEURL + '/Report/AnlyReport/ExportClassScoreScaleNum', //各等级人数占比下载 -------------- // 班级 false  // 校级 true

  GetClassScoreSegmentNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegmentNum', //各分数段详细人数 -------------- // 班级 false  // 校级 true
  ExportClassScoreSegmentNum: BASEURL + '/Report/AnlyReport/ExportClassScoreSegmentNum', //各分数段详细人数下载   -------------- // 班级 false  // 校级 true
  GetClassScoreSegmentNumStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreSegmentNumStuDetails', //各分数段详细人数学生详情
  ExportClassScoreSegmentNumStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreSegmentNumStuDetails', //各分数段详细人数学生详情下载

  GetClassQuestionScoringRate: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassQuestionScoringRate', //学科试题得分率
  ExportClassQuestionScoringRate: BASEURL + '/Report/AnlyReport/ExportClassQuestionScoringRate', //学科试题得分率下载

  //---------------------------------------校级分析报告
  GetTotalScoreSituation: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTotalScoreSituation', //总分基本情况
  GetSubjectScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetSubjectScoreContrast', //各学科基本数据对比情况
  ExportSubjectScoreContrast: BASEURL + '/Report/AnlyReport/ExportSubjectScoreContrast', //各学科基本数据对比情况下载
  GetTotalScoreDistribution: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetTotalScoreDistribution', //总分分布

  GetClassSubjectScoreCriticalityNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassSubjectScoreCriticalityNum', //临界生分析
  ExportClassSubjectScoreCriticalityNum: BASEURL + '/Report/AnlyReport/ExportClassSubjectScoreCriticalityNum', //临界生分析下载
  GetClassSubjectScoreCriticalityStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassSubjectScoreCriticalityStuDetails', //临界生分析学生详情
  ExportClassSubjectScoreCriticalityStuDetails: BASEURL + '/Report/AnlyReport/ExportClassSubjectScoreCriticalityStuDetails', //临界生分析学生详情下载

  GetSubjectScoreLvlContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetSubjectScoreLvlContrast', //各科成绩等级人数占比比较
  ExportSubjectScoreLvlContrast: BASEURL + '/Report/AnlyReport/ExportSubjectScoreLvlContrast', //各科成绩等级人数占比下载

  GetClassScoreRankNum: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreRankNum', //优秀生/学困生分析
  ExportClassScoreRankNum: BASEURL + '/Report/AnlyReport/ExportClassScoreRankNum', //优秀生/学困生分析下载
  GetClassScoreRankNumStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassScoreRankNumStuDetails', //优秀生/学困生学生详情
  ExportClassScoreRankNumStuDetails: BASEURL + '/Report/AnlyReport/ExportClassScoreRankNumStuDetails', //优秀生/学困生学生详情下载

  GetASAnalyseScoreLine: BASEURL + '/Api/Marking/ASAnalyseScoreLineBLL/GetASAnalyseScoreLine', //获取上档线设置表格数据
  SaveASAnalyseSetting: BASEURL + '/Api/Marking/ASAnalyseScoreLineBLL/SaveASAnalyseSetting', //保存上档线设置

  GetClassTotalScoreLine: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassTotalScoreLine', //总分上档线分析
  ExportClassTotalScoreLine: BASEURL + '/Report/AnlyReport/ExportClassTotalScoreLine', //总分上档线分析下载
  GetClassTotalScoreLineStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassTotalScoreLineStuDetails', //总分上档线分析学生详情
  ExportClassTotalScoreLineStuDetails: BASEURL + '/Report/AnlyReport/ExportClassTotalScoreLineStuDetails', //总分上档线分析学生详情下载

  GetClassSubjectScoreLine: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassSubjectScoreLine', //单科上档线分析
  ExportClassSubjectScoreLine: BASEURL + '/Report/AnlyReport/ExportClassSubjectScoreLine', //单科上档线分析下载
  GetClassSubjectScoreLineStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetClassSubjectScoreLineStuDetails', //单科上档线分析学生详情
  ExportClassSubjectScoreLineStuDetails: BASEURL + '/Report/AnlyReport/ExportClassSubjectScoreLineStuDetails', //单科上档线分析学生详情下载

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

  GetExaminationPaperComment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetExaminationPaperComment', // 试卷讲评
  ExportExaminationPaperComment: BASEURL + '/Report/AnlyReport/ExportExaminationPaperComment', // 试卷讲评下载
  GetExaminationPaperCommentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetExaminationPaperCommentStuDetails', // 试卷讲评单项学生名单

  //---------------------------------------联考分析报告

  GetJointExamSchool: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchool', // 获取联考学校
  GetJointExamStuResults: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamStuResults', // 联考成绩册分析报表
  ExportJointExamStuResults: BASEURL + '/Report/AnlyReport/ExportJointExamStuResults', // 联考成绩册分析报表下载
  GetJointExamStuSmallScore: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamStuSmallScore', // 联考小题分数报表
  ExportJointExamStuSmallScore: BASEURL + '/Report/AnlyReport/ExportJointExamStuSmallScore', // 联考小题分数报表
  GetJointExamQuestionSummary: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamQuestionSummary', // 联考试题汇总报表
  ExportJointExamQuestionSummary: BASEURL + '/Report/AnlyReport/ExportJointExamQuestionSummary', // 联考试题汇总报表下载
  GetJointExamQuestionSummaryStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamQuestionSummaryStuDetails', // 联考试题汇总报表学生详情
  ExportJointExamQuestionSummaryStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamQuestionSummaryStuDetails', // 联考试题汇总报表学生详情下载


  GetJointExamSchoolScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreContrast', // 联考学校成绩对比报表
  GetJointExamSchoolScoreContrastStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreContrastStuDetails', // 联考学校成绩对比学生详情
  ExportJointExamSchoolScoreContrastStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreContrastStuDetails', // 联考学校成绩对比学生详情下载
  ExportJointExamSchoolScoreContrast: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreContrast', // 联考学校成绩对比报表下载

  GetJointExamClassScoreContrast: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreContrast', // 联考班级成绩对比报表
  ExportJointExamClassScoreContrast: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreContrast', // 联考班级成绩对比报表下载
  GetJointExamClassScoreContrastStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreContrastStuDetails', // 联考班级成绩对比学生详情
  ExportJointExamClassScoreContrastStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreContrastStuDetails', // 联考班级成绩对比学生详情下载


  GetJointExamSchoolScoreSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreSegment', // 联考学校成绩分段统计报表
  GetJointExamSchoolScoreSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamSchoolScoreSegmentStuDetails', // 联考学校成绩分段统计学生详情
  ExportJointExamSchoolScoreSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreSegmentStuDetails', // 联考学校成绩分段统计学生详情下载

  ExportJointExamSchoolScoreSegment: BASEURL + '/Report/AnlyReport/ExportJointExamSchoolScoreSegment', // 联考学校成绩分段统计报表下载
  GetJointExamClassScoreSegment: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreSegment', // 联考班级成绩分段统计报表
  ExportJointExamClassScoreSegment: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreSegment', // 联考班级成绩分段统计报表下载

  GetJointExamClassScoreSegmentStuDetails: BASEURL + '/Api/Marking/ASAnalysisReportBLL/GetJointExamClassScoreSegmentStuDetails', // 联考班级成绩分段统计学生详情
  ExportJointExamClassScoreSegmentStuDetails: BASEURL + '/Report/AnlyReport/ExportJointExamClassScoreSegmentStuDetails', // 联考班级成绩分段统计学生详情下载

  // 判断是否显示联考成绩分析
  IsShowJointExam: BASEURL + '/Api/Marking/ASAnalysisReportBLL/IsShowMenu', // 判断是否显示联考成绩分析

}