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
        :class="['footer',{answer:topice.questionType == 'answerQuestion' && topice.orderFirst && index > 0}]"
        ref="box"
        :style="{ minHeight: topice.castHeight + 'px' }"
      >
        <component
          ref="answerComponent"
          :is="topice.questionType"
          :content-data="topice.content"
          :question-data="topice"
          :page-index="index"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
          @current-question-hanlde-edit="subTopic_numberHanldeEdit"
          @current-question-fill-edit="subTopic_numberFillEdit"
          @hanlde-subtraction="hanldeSubtraction"
          @current-question-answer-edit="subTopic_numberAnswerEdit"
          @current-question-optional-edit="subTopic_numberOptionalEdit"
          @composition-english-edit="compositionEnglishEdit"
          @composition-language-edit="compositionLanguageEdit"
          @subtract-spacing="subtractSpacing"
          @cur-edit-non="curEditNon"
          @hanlde-subtraction-non="hanldeSubtractionNon"
        />
      </div>
      <div class="card_footer">
          第 {{i + 1}}-{{contentData.length}} 页
      </div>
    </div>
    <!-- 公有弹框组件 -->
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapMutations, mapGetters} from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'

import AnswerSheetTitle from '../questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from '../questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from '../questionContent/_FillInTheBlank' // 填空题
import answerQuestion from '../questionContent/_answerQuestion' // 解答题
import optionalQuestion from '../questionContent/_optionalQuestion' // 选作题
import compositionEnglish from '../questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from '../questionContent/_compositionLanguage' // 作文语文
import NonRresponseArea from '../questionContent/_NonRresponseAreaContent' // 非作答
import publicDialog from '../dialog/_publicDialog'

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
      page_height: PAGE_HEIGHT,
      difference: 22
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
    ...mapGetters('page',['page_width','compile_pageData']),

    pageWidth() {
      return this.page_width + 40
    },
  },
  watch: {
    compile_pageData: {
      immediate: true,
      handler() {
        this.contentData = this.pageContentFunc(this.compile_pageData)
        if (this.contentData.length > 0) {
          this.$nextTick(() => {
            this.heightArray = this.$refs['box'].map(
              (item) => item.clientHeight
            )
            this.pageHeight_set(this.heightArray)
          })
        }
        localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
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
      // 试卷总分清零
      this.scoreTotal_reset()

      //参数变量
      var results = []
      var currentPage = {height:0,rects:[]}

      //重置参数变量
      function resetCurrentPage () {
        currentPage.height = 0;
        currentPage.rects = [];
      }

      rects.forEach(rect =>{
        // 总分叠加
        if(rect.content.scoreTotal){
          this.scoreTotal_sum(rect.content.scoreTotal)
        }

        //计算变量及对象追加
        let backup = {}
        let superiorGrid = 0

        var avalibleHeight = this.page_height - currentPage.height

        // 用于客观题 填空题数组分割
        const itemObj = JSON.parse(JSON.stringify(rect))

        // 高度溢出---------------------------------------------------------------------------
        if(rect.height > (avalibleHeight - this.difference)){
          avalibleHeight -= this.difference
          if(rect.questionType == 'answerQuestion' && rect.orderFirst > 0){
            avalibleHeight += (this.difference - 2)
          }

          let height = rect.height
          let curRect = this.preliminaryQuestion(rect, avalibleHeight)

          // 是否分割当前题型
          if(curRect.pagination){

            // 客观题 填空题
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRect.availableRow),
                first:curRect.pagination
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
              backup = {
                rows:curRect.availableRow > rect.content.rows ? rect.content.rows :
                  curRect.availableRow > 0 ? curRect.availableRow : 0
              }
            }

            currentPage.rects.push({
              ...rect,
              castHeight:curRect.height,
              ...backup
            })

            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid = rect.superiorGrid + curRect.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
            }

            height = rect.height - curRect.height
          }

          // 增加一页
          results.push(currentPage.rects)
          resetCurrentPage()

          // 剩余高度可以分占几页
          while (height > (this.page_height - this.difference)){
            let avalibleHeight =  this.page_height - this.difference
            let curRects = this.preliminaryQuestion(rect, avalibleHeight,false)

            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRects.availableRow),
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
              let {rows} = rect.content
              backup = {
                rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
              }
            }

            results.push([{
              ...rect,
              castHeight: curRects.height,
              first:false,
              ...backup
            }]);

            height -= curRects.height

            if(rect.questionType != 'ObjectiveQuestion'){
              if(curRect.pagination){
                height += rect.MarginHeight
              }
            }

            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid += curRects.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
              height += this.difference
            }
          }

          //溢出剩余高度---------------------------------------------------

          //剩余高度增加 rect.MarginHeight 高度
          currentPage.height = height

          //客观题 填空题
          if(rect.showData && rect.showData.length){
              backup = {
                showData: itemObj.showData,
              }
          }

          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
            let {rows} = rect.content
            backup = {
              rows:curRect.availableRow < 0  ? rows :  rows - curRect.availableRow
            }
          }

          if(rect.questionType != 'ObjectiveQuestion'){
              if(curRect.pagination){
                currentPage.height += rect.MarginHeight
              }
            }

          currentPage.rects.push({
            ...rect,
            castHeight: currentPage.height,
            first:!curRect.pagination,
            ...backup
          })

        }else{
          // 变量
          let backup = {}
          currentPage.height += rect.height + this.difference

          if(rect.questionType == 'answerQuestion' && rect.orderFirst > 0){
            currentPage.height -= (this.difference - 2)
          }

          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
            backup = {
              rows:rect.content.rows,
            }
          }

          currentPage.rects.push({
            ...rect,
            castHeight: rect.height,
            ...backup
          })
        }
      })

      if(currentPage.height){
        results.push(currentPage.rects)
      }

      return results
    },

    preliminaryQuestion(question,avalibleHeight,initial = true){
      // 变量
      const { MarginHeight,heightTitle,rowHeight } = question
      console.log(avalibleHeight)
      // 边框高度 剩余内容
      let margin = initial ? MarginHeight + heightTitle : MarginHeight
          margin = question.questionType == 'optionalQuestion' ? margin + question.rowTitle : margin
          margin = question.questionType == 'compositionLanguage' && initial ? margin + question.rowTitle : margin

      let RemainingHeight = avalibleHeight - margin

      // 剩余可容纳行数
      let availableRow = Math.floor(RemainingHeight / rowHeight)


      //题型高度
      let question_height = availableRow * rowHeight + margin
          // 不等于选作题的原因-选作题内部标题有一行内容的高度
          question_height =
            availableRow == 0 && question.questionType != 'optionalQuestion' ? question_height - MarginHeight : question_height
          question_height =
            availableRow == 0 && question.questionType != 'compositionLanguage' ? question_height - MarginHeight : question_height

      let parameter = {
        availableRow:availableRow,
        height:question_height,
        pagination:question_height >= question.height ? false :
          question_height < heightTitle ? false: true
      }

      return parameter
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
    subtractSpacing(obj){
      this.$refs.publicDialog.changeSpacing(obj)
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

  .card_footer {
    text-align: center;
    font-size: 14px;
    line-height: 35px;
    position: absolute;
    bottom: 0;
    height: 70px;
    width: 100%;
  }
}
</style>
