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
        :class="['footer',{'answer':row.first != undefined && row.first == false}]"
        ref="box"
        :style="{ minHeight: row.height + 'px' }"
      >
        <component
          :is="row.questionType"
          :content-data="row.content"
          :question-data="row"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
          @current-question-hanlde-edit="currentQuestionHanldeEdit"
          @current-question-fill-edit="currentQuestionFillEdit"
          @current-question-answer-edit="currentQuestionAnswerEdit"
        />
      </div>
    </div>
    <!-- 学生标题 -->
    <column-dialog ref="studentDialog" />
    <!-- 准考证号 -->
    <admission-number-dialog ref="admissionDialog" />
    <question-dialog ref="questionDialogs" />
    <fill-in-the-blank-dialog ref="fillInTheBlanks" />
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from './questionContent/_FillInTheBlank' // 填空题
import answerQuestion from './questionContent/_answerQuestion' // 解答题
import optionalQuestion from './questionContent/_optionalQuestion' // 选作题
import columnDialog from './dialog/_studentColumnDialog'
import AdmissionNumberDialog from './dialog/_AdmissionNumberDialog'
import questionDialog from './dialog/_questionData'
import FillInTheBlankDialog from './dialog/_FillInTheBlankDialog'
import publicDialog from './dialog/_publicDialog'
// import { constants } from 'zlib';

export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    columnDialog,
    AdmissionNumberDialog,
    questionDialog,
    FillInTheBlank,
    FillInTheBlankDialog,
    answerQuestion,
    publicDialog,
    optionalQuestion,
  },
  data () {
    return {
      contentData: [],
      heightArray: []
    }
  },
  computed: {
    ...mapState('pageContent', ['pageLayout', 'pageData', 'page_size']),
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 520
        : 785
    },
  },
  watch: {
    pageData: {
      immediate: true,
      handler () {
        this.contentData = this.pageContentFunc(this.pageData)
        if (this.contentData.length > 0) {
          this.$nextTick(() => {
            this.heightArray = this.$refs['box'].map(item => item.clientHeight)
            this.set_pageHeight(this.heightArray)
          })
        }
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    ...mapActions('pageContent', ['getPageData']),
    ...mapMutations('pageContent', ['set_pageHeight']),
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
        currentPage.height += parseInt(rect.height)

        if (currentPage.height < this.page_size) {
          currentPage.rects.push(rect)
        } else {
          currentPage.height = rect.height
          results.push(currentPage.rects)
          currentPage.rects = []
          if (rect.pid != undefined) {
            currentPage.rects.push({ ...rect, borderTop: true })
          } else {
            currentPage.rects.push(rect)
          }
        }
      })
      if (currentPage.rects.length > 0) {
        results.push(currentPage.rects)
      }
      return results
    },
    currentQuestionHanldeEdit (id) {
      this.$refs.questionDialogs.openedEdit(id)
    },
    currentQuestionFillEdit (id) {
      this.$refs.fillInTheBlanks.openedEdit(id)
    },
    currentQuestionAnswerEdit (obj) {
      this.$refs.publicDialog.openedEdit('answerQuestion', obj)
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
  padding-top: 20px;
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
    width: calc(100% - 40px);
    padding-top: 20px;
    left: 20px;
    &.answer {
      padding-top: 0px;
    }
  }
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
