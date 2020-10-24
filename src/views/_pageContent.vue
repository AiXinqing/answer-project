<template>
  <div class="container-card">
    <div
      v-for="(pageList, i) in contentData"
      :key="i"
      class="page-contents"
      :style="{ width: pageWidth + 'px' }"
    >
      <div
        v-for="(topice,index) in pageList"
        :key="topice.id + '_' + i + '_' + index"
        :class="[
          'footer',
          { answer: topice.first != undefined && topice.first == false },
        ]"
        ref="box"
        :style="{ minHeight: topice.castHeight + 'px' }"
      >
        <component
          ref="answerComponent"
          :is="topice.questionType"
          :content-data="topice.content"
          :question-data="topice"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
          @current-question-hanlde-edit="subTopic_numberHanldeEdit"
          @current-question-fill-edit="subTopic_numberFillEdit"
          @hanlde-subtraction="hanldeSubtraction"
          @current-question-answer-edit="subTopic_numberAnswerEdit"
          @current-question-optional-edit="subTopic_numberOptionalEdit"
          @composition-english-edit="compositionEnglishEdit"
          @composition-language-edit="compositionLanguageEdit"
          @cur-edit-non="curEditNon"
          @hanlde-subtraction-non="hanldeSubtractionNon"
        />
      </div>
    </div>
    <!-- 公有弹框组件 -->
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapState, mapMutations} from 'vuex'

import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from './questionContent/_FillInTheBlank' // 填空题
import answerQuestion from './questionContent/_answerQuestion' // 解答题
import optionalQuestion from './questionContent/_optionalQuestion' // 选作题
import compositionEnglish from './questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from './questionContent/_compositionLanguage' // 作文语文
import NonRresponseArea from './questionContent/_NonRresponseAreaContent' // 非作答
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
    NonRresponseArea,
  },
  data() {
    return {
      contentData: [],
      heightArray: [],
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 正常跳转
      next()
    }).catch(() => {
      // 如果取消跳转地址栏会变化，这时保持地址栏不变
      window.history.go(1)
    })
  },
  computed: {
    ...mapState('pageContent', [
      'pageLayout',
      'pageData',
      'page_size',
      'questionOrder',
    ]),

    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 520
        : 785
    },
  },
  watch: {
    pageData: {
      immediate: true,
      handler() {
        this.contentData = this.pageContentFunc(this.pageData)
        if (this.contentData.length > 0) {
          this.$nextTick(() => {
            this.heightArray = this.$refs['box'].map(
              (item) => item.clientHeight
            )
            this.pageHeight_set(this.heightArray)
          })
        }
        localStorage.setItem('accessToken', JSON.stringify(this.pageData))
      },
    },
  },
  methods: {
    ...mapMutations('pageContent', ['pageHeight_set','scoreTotal_reset','scoreTotal_sum']),
    hanldeStudent(Arr) {
      this.$refs.publicDialog.opened('studentTitle', Arr)
    },
    editAdmissionNumber() {
      this.$refs.publicDialog.opened('AdmissionNumber')
    },
    pageContentFunc(rects = []) {
      this.scoreTotal_reset() // 试卷总分清零

      let results = []
      let SplitVal = 0 // 拆分所用
      let curPage = {
        height: 0,
        rects: [],
      }
      function restCutPage() {
        curPage.height = 0
        curPage.rects = []
      }
      rects.forEach((rect) => {
        if(rect.content.scoreTotal){
          // 试卷总分叠加
          this.scoreTotal_sum(rect.content.scoreTotal)
        }
        let ActualHeight = rect.height + 20 //
        // avalible 剩余高度
        let avalibleHeight = this.page_size - curPage.height
        // 用于填空题数组切割
        let itemObj = JSON.parse(JSON.stringify(rect))


        // 高度溢出
        if (ActualHeight > avalibleHeight) {
          // 返回计算行数及最低高度
          let curRect = this.questionType(rect, avalibleHeight)

          if (avalibleHeight >= 32 &&!curRect.isPage) {
            SplitVal = avalibleHeight - curRect.height

            curPage.rects.push({
              ...rect,
              castHeight: curRect.height,
              showData: curRect.isArray
                ? itemObj.showData.splice(0, curRect.row)
                : [],
              first: curRect.isArray ? true : rect.first,
            })
          }

          // 追加一页页面
          results.push(curPage.rects)
          // 重置高度
          restCutPage()
          // 判罚当前高度能分几页
          let height = rect.height - avalibleHeight + SplitVal
          while (height > this.page_size) {
            let curRects = this.questionType(rect, this.page_size)
            results.push([
              {
                ...rect,
                castHeight: curRects.height, // 追加一页高度
                showData: curRect.isArray
                  ? itemObj.showData.splice(0, curRects.row)
                  : [],
                borderTop: !curRects.isPage ? 1 : 0, // 分页第一个
              },
            ])
            height -= curRects.height
          }

          if (avalibleHeight >= 32 &&!curRect.isPage) {
            curPage.height = height
          } else {
            curPage.height = ActualHeight
            height = curPage.height
          }

          curPage.rects.push({
            ...rect,
            castHeight: height,
            heightTitle: 0,
            showData: itemObj.showData,
            borderTop: !curRect.isPage ? 1 : 0,
          }) // 追加剩余高度
        } else {
          curPage.height += ActualHeight
          curPage.rects.push({
            ...rect,
            castHeight: rect.height,
          })
        }
      })
      if (curPage.height) {
        results.push(curPage.rects)
      }

      return results
    },
    questionType(obj, rectHeigth) {

      let MarginHeight = obj.MarginHeight + obj.heightTitle
      let contentHeight = rectHeigth - MarginHeight
      //-----------当前高度可占多少行
      let RowHeight = obj.rowHeight
      let row = Math.floor(contentHeight / RowHeight)

      let rectObj = {
        height: row * RowHeight + MarginHeight,
        row: row,
        isArray: false,
        isPage: row * RowHeight + MarginHeight < MarginHeight ? true : false,
      }
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return {
            ...rectObj,
            isPage: false,
            isArray: true,
          }
        case 'ObjectiveQuestion':
          return {
            ...rectObj,
            isPage: false,
            isArray: true,
          }
        case 'answerQuestion':
          return rectObj
        case 'optionalQuestion':
          return rectObj
        case 'compositionEnglish':
          return rectObj
        case 'compositionLanguage':
          return rectObj
        case 'NonRresponseArea':
          return rectObj
        default:
          return { height: 0, row: 0, isPage: false, isArray: false }
      }
    },

    subTopic_numberHanldeEdit(id) {
      this.$refs.publicDialog.openedEdit('questionDialogs', id)
    },
    hanldeSubtraction(id, num) {
      // 选择题每组行数加减法
      this.$refs.publicDialog.change('questionDialogs', id, num)
    },
    hanldeSubtractionNon(obj, num) {
      this.$refs.publicDialog.change('NonRresponseArea', obj, num)
    },
    subTopic_numberFillEdit(id) {
      this.$refs.publicDialog.openedEdit('fillInTheBlanks', id)
    },
    subTopic_numberAnswerEdit(obj) {
      this.$refs.publicDialog.openedEdit('answerQuestion', obj)
    },
    subTopic_numberOptionalEdit(obj, id) {
      this.$refs.publicDialog.openedEdit('optionalQuestion', obj, id)
    },
    compositionEnglishEdit(obj) {
      this.$refs.publicDialog.openedEdit('compositionEnglish', obj)
    },
    compositionLanguageEdit(obj) {
      this.$refs.publicDialog.openedEdit('compositionLanguage', obj)
    },
    curEditNon(obj) {
      this.$refs.publicDialog.openedEdit('NonRresponseArea', obj)
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
