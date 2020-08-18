<template>
  <div class="container-card">
    <div
      v-for="(item, i) in contentData"
      :key="i"
      class="page-contents"
      :style="{ width: pageWidth + 'px' }"
    >
      <div
        v-for="(row, a) in item"
        :key="a"
        class="footer"
        :style="{ minHeight: row.castHeight + 'px' }"
      >
        <component
          :is="row.questionType"
          :content-data="row.content"
          :question-data="row"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
          @current-question-hanlde-edit="currentQuestionHanldeEdit"
          @current-question-fill-edit="currentQuestionFillEdit"
        />
      </div>
    </div>
    <!-- 学生标题 -->
    <column-dialog ref="studentDialog" />
    <!-- 准考证号 -->
    <admission-number-dialog ref="admissionDialog" />
    <question-dialog ref="questionDialogs" />
     <fill-in-the-blank-dialog ref="fillInTheBlanks" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from './questionContent/_FillInTheBlank' // 填空题
import columnDialog from './dialog/_studentColumnDialog'
import AdmissionNumberDialog from './dialog/_AdmissionNumberDialog'
import questionDialog from './dialog/_questionData'
import FillInTheBlankDialog from './dialog/_FillInTheBlankDialog'
// import { constants } from 'zlib';

export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    columnDialog,
    AdmissionNumberDialog,
    questionDialog,
    FillInTheBlank,
    FillInTheBlankDialog
  },
  data () {
    return {
      contentData: [],
    }
  },
  computed: {
    ...mapState('pageContent', ['pageLayout', 'pageData', 'page_size']),
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 520
        : 785
    }
  },
  watch: {
    pageData: {
      immediate: true,
      handler () {
        this.contentData = this.pageContentFunc(this.pageData)
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    ...mapActions('pageContent', ['getPageData']),
    hanldeStudent (Arr) {
      this.$refs.studentDialog.openedFrameFunc(Arr)
    },
    editAdmissionNumber () {
      this.$refs.admissionDialog.openedFrameFunc()
    },
    pageContentFunc (rects = []) {
     // 重组题-分页
      const results = []
       // currentPage.height 总高度
      var currentPage = {
        height: 0,
        rects: [],
      }
      rects.forEach((rect) => {
        currentPage.height += rect.height
        if(currentPage.height < this.page_size){
          currentPage.rects.push(rect)
        }else{
          currentPage.height = rect.rects
          results.push(currentPage.rects)
          currentPage.rects = []
          currentPage.rects.push(rect)
        }
      })
      if(currentPage.rects.length > 0){
          results.push(currentPage.rects)
        }
      return results
    },
    currentQuestionHanldeEdit (id) {
      this.$refs.questionDialogs.openedEdit(id)
    },
    currentQuestionFillEdit (id) {
      this.$refs.fillInTheBlanks.openedEdit(id)
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.container-card {
  position: relative;
  padding-top: 30px;
  width: calc(100% - 330px);
  height: calc(100% - 20px);
  overflow: auto;
  float: left;
}
.page-contents {
  width: 785px;
  height: 1170px;
  border: 1px solid @font-333;
  overflow: hidden;
  background: @white;
  border-radius: 3px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  .footer {
    position: relative;
    padding-top: 20px;
    width: calc(100% - 40px);
    left: 20px;
  }
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
