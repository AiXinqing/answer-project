<template>
  <div class="page-content preview-content">
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
      pageWidth:this.$route.query.pageWidth,
      pageNum:this.$route.query.pageNum,
      page_height:PAGE_HEIGHT
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
        let superiorGrid = 0
        let backup = {}

        var avalibleHeight = this.page_height - currentPage.height - 20
        // 用于填空题数组切割
        const itemObj = JSON.parse(JSON.stringify(rect))

        if(rect.height > avalibleHeight){ // 高度溢出
          let curRect = this.preliminaryQuestion(rect, avalibleHeight)

          if(!curRect.pagination){
            // 分页-剩余高度新建rect
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRect.availableRow),
                first:true
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion'){
              backup = {
                rows:curRect.availableRow
              }
            }

            currentPage.rects.push({
              ...rect,
              castHeight:curRect.height,
              ...backup
            })
          }

          // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid = rect.superiorGrid + curRect.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
            }

          results.push(currentPage.rects) // 增加一页
          resetCurrentPage()


          // 判断当前rect高度能分几页----------------------------------------
          let height = rect.height - curRect.height

          //剩余高度超过一页高度
          while (height > this.page_height) {
            let avalibleHeight =  this.page_height - 20
            let curRects = this.preliminaryQuestion(rect, avalibleHeight,false)

            if(rect.showData && rect.showData.length){
              // 切割数组
              backup = {
                showData:itemObj.showData.splice(0, curRects.availableRow),
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion'){
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
            height -= this.page_height - 20

            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid += curRects.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
            }
          }

          //最后剩余高度---------------------------------------------------

          if(rect.showData && rect.showData.length){
              backup = {
                showData: itemObj.showData,
              }
          }

          currentPage.height = height + rect.MarginHeight
          if(itemObj.showData && !curRect.pagination){
            currentPage.height = itemObj.showData.length * itemObj.rowHeight + rect.MarginHeight
          }

          // 选作题
          if(rect.questionType == 'optionalQuestion'){
            let {rows} = rect.content
            backup = {
              rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
            }
            currentPage.height = height
          }

          currentPage.rects.push({
            ...rect,
            castHeight: currentPage.height,
            first:curRect.pagination,
            ...backup
          })

        }else{
          currentPage.height += (rect.height + 20)

          currentPage.rects.push({
            ...rect,
            castHeight: rect.height,
          })
        }
      })

      if(currentPage.height){
        results.push(currentPage.rects)
      }

      return results
    },

    preliminaryQuestion(question,avalibleHeight,initial = true){

      const {MarginHeight,heightTitle,rowHeight} = question
      const cornerHeight = initial ? MarginHeight + heightTitle :
            question.questionType == 'compositionLanguage' ? 0 : MarginHeight
      const RemainingHeight = avalibleHeight - cornerHeight
      const availableRow = Math.floor(RemainingHeight / rowHeight)
      const current_height = availableRow * rowHeight  + cornerHeight


      const parameter = {
        availableRow:availableRow,
        height:current_height >= (cornerHeight + rowHeight) ? current_height : 0,
        pagination:current_height >= (cornerHeight + rowHeight) ? false : true,
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
    left: 20px;
    width: calc(100% - 40px);
    margin-top: 20px;
    &.answer{
      margin-top:0;
    }
  }
}
.page_info_itme {
  width: 785px;
  height: 1115px;
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

<style lang="less">
  .preview-content{
    .question-info{
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

