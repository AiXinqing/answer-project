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
          @current-question-answer-edit="currentQuestionAnswerEdit"
          @current-question-optional-edit="currentQuestionOptionalEdit"
          @composition-english-edit="compositionEnglishEdit"
          @composition-language-edit="compositionLanguageEdit"
        />
      </div>
    </div>
    <!-- 公有弹框组件 -->
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
import compositionEnglish from './questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from './questionContent/_compositionLanguage' // 作文语文
import publicDialog from './dialog/_publicDialog'

export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    FillInTheBlank,
    answerQuestion,
    publicDialog,
    optionalQuestion,
    compositionEnglish,
    compositionLanguage,
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
      this.$refs.publicDialog.opened('studentTitle', Arr)
    },
    editAdmissionNumber () {
      this.$refs.publicDialog.opened('AdmissionNumber')
    },
    // pageContentFunc (rects = []) {
    //   // 重组题-分页
    //   const results = []
    //   // currentPage.height 总高度
    //   var currentPage = {
    //     height: 0,
    //     rects: [],
    //   }
    //   rects.forEach((rect) => {
    //     currentPage.height += rect.height
    //     if (currentPage.height < this.page_size) {
    //       currentPage.rects.push(rect)
    //     } else {
    //       currentPage.height = rect.height
    //       results.push(currentPage.rects)
    //       currentPage.rects = []
    //       if (rect.pid != undefined) {
    //         currentPage.rects.push({ ...rect, borderTop: true })
    //       } else {
    //         currentPage.rects.push(rect)
    //       }
    //     }
    //   })
    //   if (currentPage.rects.length > 0) {
    //     results.push(currentPage.rects)
    //   }
    //   return results
    // },
    pageContentFunc (rects = []) {

      let results = []
      let SplitVal = 0 // 拆分所用
      let curPage = {
        height: 0,
        rects: []
      }
      function restCutPage () {
        curPage.height = 0
        curPage.rects = []
      }
      rects.forEach(rect => {
        //rect.height = rect.height + 20
        // avalible 剩余高度
        let avalibleHeight = this.page_size - curPage.height
        let itemObj = JSON.parse(JSON.stringify(rect))
        // 高度溢出
        if (rect.height > avalibleHeight) {

          let curRect = this.questionType(rect, avalibleHeight)

          if (rect.questionType != 'ObjectiveQuestion' && avalibleHeight >= 32) {
            SplitVal = avalibleHeight - curRect.height

            curPage.rects.push({
              ...rect,
              castHeight: curRect.height,
              showData: itemObj.showData.splice(0, curRect.row),
              first: true
            })
          }

          // 追加一页页面
          results.push(curPage.rects)
          // 重置高度
          restCutPage()
          // 判罚当前高度能分几页
          let height = rect.height - avalibleHeight + SplitVal;
          console.log(itemObj)
          while (height > this.page_size) {
            let content = this.pageShow(rect)
            console.log(content)
            // SplitVal = page_size - content.height

            results.push([{
              ...rect,
              castHeight: content.height, // 追加一页高度
              showData: itemObj.showData.splice(0, content.row),
            }]);
            height -= content.height;
          }

          console.log(height)

          if (rect.questionType != 'ObjectiveQuestion' && avalibleHeight >= 32) {
            curPage.height = height
          } else {
            curPage.height = rect.height
            height = curPage.height
          }

          console.log(rect)

          curPage.rects.push({
            ...rect,
            castHeight: height,
            showData: itemObj.showData,
          }) // 追加剩余高度

        } else {
          curPage.height += rect.height
          curPage.rects.push({
            ...rect,
            castHeight: rect.height,
          })
        }
      })
      if (curPage.height) {
        console.log(2)
        results.push(curPage.rects)
      }
      console.log(results)
      return results
    },
    questionType (obj, rectHeigth) {
      let MarginHeight = obj.MarginHeight + obj.heightTitle
      let contentHeight = rectHeigth - MarginHeight
      switch (obj.questionType) {
        case 'FillInTheBlank':

          var row = Math.floor(contentHeight / 45)
          return { height: row * 45 + MarginHeight, row: row }
        case '':
          break;
        default:
          return { height: 0, row: 0 }
      }
      // console.log(obj)
    },
    pageShow (obj) {
      let MarginHeight = obj.MarginHeight
      let contentHeight = this.page_size - MarginHeight
      switch (obj.questionType) {
        case 'FillInTheBlank':
          var row = Math.floor(contentHeight / 45)
          return { height: row * 45 + MarginHeight, row: row }
        case '':
          break;
        default:
          return { height: 0, row: 0 }
      }
    },
    currentQuestionHanldeEdit (id) {
      this.$refs.publicDialog.openedEdit('questionDialogs', id)
    },
    currentQuestionFillEdit (id) {
      this.$refs.publicDialog.openedEdit('fillInTheBlanks', id)
    },
    currentQuestionAnswerEdit (obj) {
      this.$refs.publicDialog.openedEdit('answerQuestion', obj)
    },
    currentQuestionOptionalEdit (obj, id) {

      this.$refs.publicDialog.openedEdit('optionalQuestion', obj, id)
    },
    compositionEnglishEdit (obj) {
      this.$refs.publicDialog.openedEdit('compositionEnglish', obj)
    },
    compositionLanguageEdit (obj) {
      this.$refs.publicDialog.openedEdit('compositionLanguage', obj)
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
