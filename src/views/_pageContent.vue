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
          @hanlde-subtraction="hanldeSubtraction"
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
        // if (rect.first) { rect.height = rect.height - 20 }
        let curH = rect.height + 20
        // avalible 剩余高度
        let avalibleHeight = this.page_size - curPage.height
        let itemObj = JSON.parse(JSON.stringify(rect))
        let whetherShow = this.shawDataFunc(rect) // 是否显示

        // 高度溢出
        if (curH > avalibleHeight) {

          let curRect = this.questionType(rect, avalibleHeight)
          // let sd = this.shawDataFunc(rect, avalibleHeight, curRect.height)

          if (rect.questionType != 'ObjectiveQuestion' && avalibleHeight >= 32 && curRect.height != 0) {
            SplitVal = avalibleHeight - curRect.height

            curPage.rects.push({
              ...rect,
              castHeight: curRect.height,
              showData: whetherShow ? itemObj.showData.splice(0, curRect.row) : [],
              first: whetherShow ? true : rect.first,
            })
          }

          // 追加一页页面
          results.push(curPage.rects)
          // 重置高度
          restCutPage()
          // 判罚当前高度能分几页
          let height = rect.height - avalibleHeight + SplitVal;
          // console.log(itemObj)
          while (height > this.page_size) {
            let content = this.pageShow(rect)

            results.push([{
              ...rect,
              castHeight: content.height, // 追加一页高度
              showData: whetherShow ? itemObj.showData.splice(0, content.row) : [],
              borderTop: 1, // 分页第一个
            }]);
            height -= content.height;
          }

          // console.log(height)

          if (rect.questionType != 'ObjectiveQuestion' && avalibleHeight >= 32 && curRect.height != 0) {
            curPage.height = height
          } else {
            curPage.height = curH
            height = curPage.height
          }

          // console.log(rect)

          curPage.rects.push({
            ...rect,
            castHeight: height,
            heightTitle: 0,
            showData: itemObj.showData,
            borderTop: 1,
          }) // 追加剩余高度

        } else {
          curPage.height += curH
          curPage.rects.push({
            ...rect,
            castHeight: rect.height,
          })
        }
      })
      if (curPage.height) {
        // console.log(2)
        results.push(curPage.rects)
      }
      // console.log(JSON.stringify(rects))
      // console.log(results)
      return results
    },
    questionType (obj, rectHeigth) {
      let MarginHeight = obj.MarginHeight + obj.heightTitle
      let contentHeight = rectHeigth - MarginHeight
      let RowHeight = 45
      let row = Math.floor(contentHeight / RowHeight)
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return { height: row * RowHeight + MarginHeight, row: row }
        case 'answerQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return { height: row * RowHeight + MarginHeight, row: row }
        case 'optionalQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return { height: row * RowHeight + MarginHeight, row: row }
        default:
          return { height: 0, row: 0 }
      }
      // console.log(obj)
    },
    pageShow (obj) {
      let MarginHeight = obj.MarginHeight
      let contentHeight = this.page_size - MarginHeight
      let RowHeight = 45
      let row = Math.floor(contentHeight / RowHeight)
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return { height: row * RowHeight + MarginHeight, row: row }
        case 'answerQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return { height: row * RowHeight + MarginHeight, row: row }
        case 'optionalQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return { height: row * RowHeight + MarginHeight, row: row }
        default:
          return { height: 0, row: 0 }
      }
    },
    shawDataFunc (obj, avalibleHeight, Remaini) {
      if (obj.questionType == 'ObjectiveQuestion') {
        return false
      } else if (avalibleHeight < 32) {
        return false
      } else if (obj.questionType == 'optionalQuestion' && Remaini < 108) {
        return false
      } else {
        return true
      }
    },
    isToPage (obj, ) {
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return true
        // case 'optionalQuestion':
        //   return true
        default:
          return false
      }
    },
    currentQuestionHanldeEdit (id) {
      this.$refs.publicDialog.openedEdit('questionDialogs', id)
    },
    hanldeSubtraction (id, num) {
      // 选择题每组行数加减法
      this.$refs.publicDialog.change('questionDialogs', id, num)
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
    },
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
  // padding-top: 20px;
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
