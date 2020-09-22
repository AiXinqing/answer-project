<template>
  <div class="page-content">
    <div class="main-info">
      <div v-for="(pages, i) in contentData" :key="i" class="page_card">
        <div
          v-for="(pagesCrad, a) in pages"
          :key="a"
          :style="{
            width: pageWidth + 'px',
            marginLeft: pageWidth == 520 ? '25px' : '38px',
          }"
          :class="[
            'page_info_itme',
            {
              answer: pagesCrad.first != undefined && pagesCrad.first == false,
            },
          ]"
        >
          <div
            v-for="(question, index) in pagesCrad"
            :key="index"
            class="footer"
            :style="{ minHeight: question.castHeight + 'px' }"
          >
            <component
              :is="question.questionType"
              :content-data="question.content"
              :question-data="question"
              :preview-is="true"
            />
          </div>
        </div>
        <div class="card_footer">
          第 {{ i + 1 }} 页 共 {{ contentData.length }} 页
        </div>
      </div>
    </div>
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
import NonRresponseArea from './questionContent/_NonRresponseAreaContent' // 非作答
export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    FillInTheBlank,
    answerQuestion,
    optionalQuestion,
    compositionEnglish,
    compositionLanguage,
    NonRresponseArea,
  },
  data() {
    return {
      contentData: [],
      ces: '',
    }
  },
  computed: {
    ...mapState('pageContent', ['pageLayout', 'pageData', 'page_size']),
    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 520
        : 785
    },
    pageNum() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 3
        : 2
    },
  },
  watch: {
    pageData: {
      immediate: true,
      handler() {
        let data = this.pageContentFunc(this.pageData)
        let index = 0
        let newArray = []
        while (index < data.length) {
          newArray.push(data.slice(index, (index += this.pageNum)))
        }
        this.contentData = newArray

        console.log(this.contentData)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.pageData)
    })
  },
  methods: {
    ...mapActions('pageContent', ['getPageData']),
    ...mapMutations('pageContent', ['set_pageHeight']),
    pageContentFunc(rects = []) {
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
        let ActualHeight = rect.height + 20 //
        // avalible 剩余高度
        let avalibleHeight = this.page_size - curPage.height
        let itemObj = JSON.parse(JSON.stringify(rect))
        let whetherShow = this.shawDataFunc(rect) // 是否显示

        // 高度溢出

        if (ActualHeight > avalibleHeight) {
          let curRect = this.questionType(rect, avalibleHeight)

          if (
            rect.questionType != 'ObjectiveQuestion' &&
            avalibleHeight >= 32 &&
            !curRect.isPage
          ) {
            SplitVal = avalibleHeight - curRect.height

            curPage.rects.push({
              ...rect,
              castHeight: curRect.height,
              showData: whetherShow
                ? itemObj.showData.splice(0, curRect.row)
                : [],
              first: whetherShow ? true : rect.first,
            })
          }

          // 追加一页页面
          results.push(curPage.rects)
          // 重置高度
          restCutPage()
          // 判罚当前高度能分几页
          let height = rect.height - avalibleHeight + SplitVal
          while (height > this.page_size) {
            let content = this.pageShow(rect)

            results.push([
              {
                ...rect,
                castHeight: content.height, // 追加一页高度
                showData: whetherShow
                  ? itemObj.showData.splice(0, content.row)
                  : [],
                borderTop: !curRect.isPage ? 1 : 0, // 分页第一个
              },
            ])
            height -= content.height
          }

          if (
            rect.questionType != 'ObjectiveQuestion' &&
            avalibleHeight >= 32 &&
            !curRect.isPage
          ) {
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
      let RowHeight = 45
      let row = Math.floor(contentHeight / RowHeight)
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage: false,
          }
        case 'answerQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage: false,
          }
        case 'optionalQuestion':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage:
              row * RowHeight + MarginHeight < MarginHeight ? true : false,
          }
        case 'compositionEnglish':
          RowHeight = 35
          row = Math.floor(contentHeight / RowHeight)
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage:
              row * RowHeight + MarginHeight < MarginHeight ? true : false,
          }
        case 'compositionLanguage':
          RowHeight = obj.rowHeight
          row = Math.floor(contentHeight / RowHeight)
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage:
              row * RowHeight + MarginHeight < MarginHeight ? true : false,
          }
        case 'NonRresponseArea':
          RowHeight = obj.rowHeight
          row = Math.floor(contentHeight / RowHeight)
          return {
            height: row * RowHeight + MarginHeight,
            row: row,
            isPage: row * RowHeight + MarginHeight < 40 ? true : false,
          }
        default:
          return { height: 0, row: 0, isPage: false }
      }
      // console.log(obj)
    },
    pageShow(obj) {
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
    shawDataFunc(obj) {
      switch (obj.questionType) {
        case 'FillInTheBlank':
          return true
        default:
          return false
      }
    },
  },
}
</script>

<style lang="less" scoped>
html {
  background: #ffffff;
}
#app,
.page-content,
.main-info {
  background: #ffffff;
}
.page-content {
  margin-top: 50px;
  .page_card {
    display: flex;
    flex-wrap: wrap;
    width: 1650px;
    justify-content: left;
  }
}
.page_info_itme .footer {
  position: relative;
  left: 20px;
  width: calc(100% - 40px);
  margin-top: 20px;
}
.page_info_itme {
  width: 785px;
  height: 1170px;
  border: 1px solid #888;
  border-radius: 3px;
  margin-left: 38px;
  margin-top: 50px;
  // padding-top: 20px;
}
.card_footer {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  text-indent: 35px;
  margin-bottom: 20px;
}
</style>
