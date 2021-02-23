<template>
  <div class="page-content preview-content">
    <div class="main-info">
      <div v-for="(pages, i) in contentData" :key="i" class="page_card">
        <div
          v-for="(pagesCrad, a) in pages"
          :key="a"
          :style="{
            width: pageWidth + 'px',
            marginLeft:'30px',
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
            :class="['footer',{answer:question.questionType == 'answerQuestion' && question.orderFirst && index > 0}]"
          >
            <component
              :is="question.questionType"
              :content-data="question.content"
              :question-data="question"
              :preview-is="true"
              :preview-content="true"
              :page-index="index"
              :preview-width="parseInt(pageWidth)"
              :readonly="1"
            />
          </div>
        </div>
        <div class="card_footer" :style="{width:pageNum == 1 ? '826px' : '100%'}">
          第 {{ i + 1 }} 页 共 {{ contentData.length }} 页
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'

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
      pageData:JSON.parse(localStorage.getItem('accessToken')),
      pageWidth:this.$route.query.pageWidth - 25,
      pageNum:this.$route.query.pageNum,
      page_height:PAGE_HEIGHT,
      difference:20,
    }
  },

  watch: {
    pageData: {
      immediate: true,
      handler() {
        let data = this.pageContentFunc(this.pageData)
        let index = 0
        let newArray = []
        if(this.pageNum == 1){
          this.contentData = data.map(obj => ([obj]))
        }else{
          while (index < data.length) {
            newArray.push(data.slice(index, (index += this.pageNum)))
          }
          this.contentData = newArray
        }

      },
    },

  },
  mounted() {

  },
  methods: {
    ...mapMutations('pageContent', ['pageHeight_set']),
    pageContentFunc(rects = []) {
      var results = []

      // currentPage.height 总高度
      var currentPage = {height:0,rects:[]}

      //重置高度
      function resetCurrentPage () {
        currentPage.height = 0;
        currentPage.rects = [];
      }

      rects.forEach(rect =>{
        //计算变量及对象追加
        let backup = {}
        let superiorGrid = 0
        let segmented = 0
        let segmentedArr = []
        let contentRows = rect.content.rows // 用于英语作文

        var avalibleHeight = this.page_height - currentPage.height

        // 用于客观题 填空题数组分割
        const itemObj = JSON.parse(JSON.stringify(rect))

        // 高度溢出---------------------------------------------------------------------------

        if(rect.height > avalibleHeight){
          avalibleHeight -= this.difference
          if(rect.questionType == 'answerQuestion' && rect.orderFirst){
            avalibleHeight += this.difference
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
              rect.questionType == 'answerQuestion'
            ){
              backup = {
                rows:curRect.availableRow > rect.content.rows ? rect.content.rows :
                  curRect.availableRow > 0 ? curRect.availableRow : 0
              }
            }

            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows: contentRows > curRect.availableRow ? curRect.availableRow : contentRows
              }
              contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
            }

            segmentedArr.push(curRect.availableRow)

            currentPage.rects.push({
              ...rect,
              castHeight:curRect.height,
              ...backup,
              segmented:segmented,
              segmentedArr:segmentedArr
            })

            height = rect.height - curRect.height
            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid = rect.superiorGrid + curRect.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
              height += this.difference
            }

            if(rect.questionType == 'answerQuestion' && rect.orderFirst){
              avalibleHeight -= this.difference
            }
          }

          // 增加一页
          results.push(currentPage.rects)
          resetCurrentPage()

          // 剩余高度可以分占几页
          while (height > (this.page_height - this.difference)){
            segmented += 1

            let avalibleHeight =  this.page_height - this.difference
            let curRects = this.preliminaryQuestion(rect, avalibleHeight,false)
                segmentedArr.push(curRects.availableRow)
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRects.availableRow),
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion'
            ){
              let {rows} = rect.content
              backup = {
                rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
              }
            }

            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows: contentRows > curRects.availableRow ? curRects.availableRow : contentRows
              }
              contentRows = contentRows > curRects.availableRow ? contentRows - curRects.availableRow : 0
            }

            results.push([{
              ...rect,
              castHeight: curRects.height,
              first:false,
              ...backup,
              segmented:segmented,
              segmentedArr:segmentedArr
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

          //剩余高度增加 rect.MarginHeight 高度 分段后加入高度差值
          currentPage.height = height + this.difference
          if(rect.questionType == 'compositionLanguage'){
            currentPage.height = height - this.difference
          }

          //客观题 填空题
          if(rect.showData && rect.showData.length){
              backup = {
                showData: itemObj.showData,
              }
          }
          segmentedArr.push(itemObj.showData != undefined ? itemObj.showData.length : Math.floor((this.page_height - 20 - curRect.MarginHeight) / curRect.rowHeight))
          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion'
            ){
            let {rows} = rect.content
            backup = {
              rows:curRect.availableRow < 0  ? rows :  rows - curRect.availableRow
            }
          }

          if(rect.questionType == 'compositionEnglish'){
            backup = {
              rows: contentRows > curRect.availableRow && !curRect.pagination ? curRect.availableRow : contentRows
            }
            contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
          }

          if(rect.questionType != 'ObjectiveQuestion'){
              if(curRect.pagination){
                currentPage.height += rect.MarginHeight
              }
            }
          segmented += 1

          currentPage.rects.push({
            ...rect,
            castHeight: currentPage.height - this.difference, // 分段后减去加入的差值
            first:!curRect.pagination,
            ...backup,
            segmented:segmented,
            segmentedArr:segmentedArr
          })

        }else{
          // 变量
          let backup = {}
          currentPage.height += rect.height + this.difference

          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
            backup = {
              rows:rect.content.rows,
            }
          }

          if(rect.questionType == 'answerQuestion' && rect.orderFirst > 0){
            currentPage.height -= this.difference
          }
          currentPage.rects.push({
            ...rect,
            castHeight: rect.height,
            ...backup,
            segmented:segmented,
            segmentedArr:segmentedArr
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

      // 边框高度 剩余内容
      let margin = initial ? MarginHeight + heightTitle : MarginHeight
      let RemainingHeight

      switch(question.questionType){
          case 'compositionLanguage':
            RemainingHeight = question.first ?  avalibleHeight - margin - question.rowTitle : avalibleHeight - margin
            break;
          default:
            RemainingHeight = avalibleHeight - margin
      }

      // 剩余可容纳行数
      let availableRow = Math.floor(RemainingHeight / rowHeight)


      //题型高度
      let question_height = availableRow * rowHeight + margin
          // 不等于选作题的原因-选作题内部标题有一行内容的高度
          switch(question.questionType) {
              case 'compositionLanguage':
                  question_height = initial ?  question_height + question.rowTitle : question_height
                  break;
              case 'answerQuestion':
                  question_height = !question.orderFirst ? question_height - 2 : question_height - 1
                  break;
              default:
          }

      let parameter = {
        availableRow:availableRow,
        height:question_height,
        pagination:question_height >= question.height ? false :
          question_height < heightTitle ? false: true,
          MarginHeight:MarginHeight,
          rowHeight:rowHeight
      }

      return parameter
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
.page_info_itme{
  .footer {
    position: relative;
    left: 8px;
    // width: calc(100% - 40px);
    margin-top: 20px;
    &.answer{
      margin-top:0;
    }
  }
}
.page_info_itme {
  width: 760px;
  height: 1115px;
  border: 1px solid #888;
  border-radius: 3px;
  margin-left: 38px;
  margin-top: 50px;
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

<style lang="less">
  .preview-content{
    .question-info{
      width: calc(100% - 16px);
      &:hover{
        .question_arrays{
          display: none !important;
        }
        .question_editOrDel{
          display: none !important;
        }
      }
    }
    .question-handler{
      svg{display: none !important}
    }

    .question-title{
      &:hover{
        border-color: #fff;
      }
    }
}
</style>

