<template>
  <div class="page-content preview-content" :class="downs ? 'down_style' : ''" ref="pageContent" >
    <div class="main-info">
      <div v-for="(pages, i) in contentData" :key="i" class="page_card" :style="{width:pageNum == 1 ? '875px' : '1650px'}">
        <div class="previewCanvas">
          <div class="left" style="flex-shrink:1">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
              <rect x="0" y="1" width="27" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
            </svg>
          </div>
          <div class="right" style="flex-shrink:1">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
              <rect x="0" y="1" width="27" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
            </svg>
          </div>
        </div>

        <div
          v-for="(pagesCrad, a) in pages"
          :key="a"
          :style="{
            width: pageWidth + 'px',
            marginLeft:a == 0 ? '50px' :'30px',
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

        <div class="previewCanvas bottom">
          <div class="left">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
              <rect x="0" y="1" width="27" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
            </svg>
          </div>

          <div class="card_footer" :style="{width:pageNum == 1 ? '826px' : '100%',position:'relative'}">
              第 {{ i + 1 }} 页 共 {{ contentData.length }} 页
          </div>
          <div class="right">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
              <rect x="0" y="1" width="27" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'
import qs from 'qs'

import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from './questionContent/_FillInTheBlank' // 填空题
import answerQuestion from './questionContent/_answerQuestion' // 解答题
import optionalQuestion from './questionContent/_optionalQuestion' // 选作题
import compositionEnglish from './questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from './questionContent/_compositionLanguage' // 作文语文
import NonRresponseArea from './questionContent/_NonRresponseAreaContent' // 非作答
import { URL } from '../utils/config.js'

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
      down:this.$route.query.down,
      page_height:PAGE_HEIGHT,
      difference:20,
      svgWidth:110,
      titleVal:'',
      pageSize:'A3'
    }
  },

  computed: {
    downs() {
      return this.$route.query.down ? 1 : 0
    },
  },

  watch: {
    pageData: {
      immediate: true,
      handler() {
        let data = this.pageContentFunc(this.pageData)

        const {content} = this.pageData[0]
        this.titleVal = content.textVal
        this.pageSize = content.pageLayout.size
        if(this.pageNum == 1){
          this.contentData = data.map(obj => ([obj]))
        }else{

          const num = this.pageNum //分割长度
          const times = Math.ceil(data.length / num)
          const newArr = []
          for(let i = 0; i <= times; i++){
            if(i*num >= data.length){
            break
          }
          newArr.push(data.slice(i*num, (i+1)*num))
          }
          this.contentData = newArr
        }

      },
    },

  },

  mounted () {
    let slef = this

    if(slef.downs){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout( () => {
        loading.close()

          slef.generatorImage()
      },5000);
    }

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
          let curRect = this.preliminaryQuestion(rect, avalibleHeight,rect.first,segmented)

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
              // segmented += 1
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
            let avalibleHeight =  this.page_height - this.difference
            backup = {
              first: !segmented
            }

            if(rect.questionType == 'FillInTheBlank' && avalibleHeight == 1000){
              backup = {
                first: false
              }
            }
            segmented += 1
            let curRects = this.preliminaryQuestion(rect, avalibleHeight,backup.first,segmented)

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
            first:rect.questionType == 'compositionLanguage' ? false : !curRect.pagination,
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

    preliminaryQuestion(question,avalibleHeight,initial = true,segmented){
      // 变量
      const { MarginHeight,heightTitle,rowHeight } = question

      // 边框高度 剩余内容
      let margin = initial  ? MarginHeight + heightTitle : MarginHeight
      let RemainingHeight

      switch(question.questionType){
        case 'compositionLanguage':
          RemainingHeight = question.first && segmented == 0 ?  avalibleHeight - margin - question.rowTitle : avalibleHeight - MarginHeight
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
        height:question_height < rowHeight ? 0 : question_height,
        pagination:question_height >= question.height ? false :
          question_height < heightTitle ? false: question_height < rowHeight ? false : true,
          MarginHeight:MarginHeight,
          rowHeight:rowHeight
      }

      return parameter
    },

    generatorImage(){
      let htmlText = document.documentElement.outerHTML //document.getElementsByTagName('html')[0].outerHTML
      this.$nextTick(()=>{
        if(this.htmlText != ''){
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          htmlText = document.documentElement.outerHTML
          this.$http.post('/FileUpLoad/SaveHtml',
              qs.stringify({'htmlText':htmlText,'AnswerCardName':this.titleVal}),
              {
                baseURL: URL.SERVICE_UPLOAD_PICTURE,
              }
              ).then(({data}) => {
                if(data.ReturnCode == 9998){ // http://localhost:60044
                  window.location.href = `/Assembly/AnswerCard/DownLoadAnswerCard?htmlUrl=${data.ReturnInfo}&AnswerCardName=${this.titleVal}&PageSize=${this.pageSize}`
                  loading.close()
                }
              })
            .catch(() => { // 请求失败处理
              loading.close()
            })
        }
      })

    }
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
    position: relative;
  }

  &.down_style{
    margin-top:0
  }

  .previewCanvas{
    width: 100%;
    height: 69px;
    display: flex;
    justify-content: space-between;

    div{
      margin-top: 20px;
      flex-shrink:0;

      &.left{
        margin-left: 5px
      }

      &.card_footer{
        flex-shrink:1;
      }
      &.right{
        margin-right: 0px;
      }
    }
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
  height: 1025px;
  border: 1px solid #888;
  border-radius: 3px;
  margin-left: 38px;
  // margin-top: 50px;
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

