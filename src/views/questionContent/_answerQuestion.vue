<template>
  <!-- 解答题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="!data.orderFirst && data.first"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        :max-height="maxHeight"
        ref="tinyMCE"
      />
    </div>

    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberAnswerEdit"
          >编辑</span
        >
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <drag-change-height
      :question="questionData"
      @height-resize="handleResize($event)"
      :style="{
          'border-top':!data.orderFirst || !pageIndex ? '1px solid #888' : 'none',
          'margin-top':!data.orderFirst  ? '10px' : '0px',
        }"
    >
      <div
        class="content-info"
        :style="{
            height:tinymceHeight + 'px'}"
      >
        <!-- 富文本编辑区 -->
        <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          v-if="pageLayout.column == 3"
        >
        </trigger-tinymce>
        <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          v-else
        >
        </trigger-tinymce>
      </div>
    </drag-change-height>

  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters} from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { PAGE_HEIGHT } from '@/models/base'

import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'

export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight,
  },
  props: {
    questionData: {
      type: Object,
      default: () => {},
    },
    contentData: {
      type: Object,
      default: () => {},
    },

    pageIndex:{
      type: Number,
      default: 0,
    },

    previewContent: {
      type: Boolean,
      default: false
    },

    previewWidth:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isEditor: false,
      data: {},
      content: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      tinymceHeight:28,
      str:'&nbsp;',
      pageLayout: this.contentData.pageLayout,
      page_height: PAGE_HEIGHT
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    minHeight(){
      const {rowHeight, row,MarginHeight,height,castHeight} = this.questionData
      return  castHeight >= height ? rowHeight * row + MarginHeight : 0
    },

    topicData() {
      return this.contentData.group
    },
    rowsData() {
      let Arr = []
      for (let i = 1; i <= this.data.rows; i++) {
        Arr.push(i)
      }
      return Arr
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 23 : this.previewWidth - 63
    },

    questionInfo() {
      const {first,content,score,topic} = this.data

      let pList = ''
      this.rowsData.forEach((item,i) =>{

        let titleStr = `${topic}` + (content.ShowScore ? ` (${ score }分)` : '')

        let span1 =  i == 0 && first  ? `&nbsp;${titleStr}&nbsp;` : ''

        let titleStrLong = i == 0 ? titleStr.length * 10 : 0


        let spaceLong = Math.ceil((this.pageWidth - 23 - titleStrLong ) / 4.25)

        let spaceSum = ''
        for(let x = 0; x < spaceLong;x++){
            spaceSum += this.str
        }

        let span2 = content.HorizontalLine ? `<a class="line-style"> (${spaceSum}) </a>` :''

        pList += `<p class="question_line">${span1}${span2}</p>
        ` // 需要空一行回车，这样才能筛选行数，不能删除
      })

      return pList
    },

    editorDetail(){
      const {editorContent,segmented,segmentedArr,first,objId,MarginHeight,operating,rowHeight} = this.questionData
      // 富文本编辑后内容
      let tinycmeContent = ''
      // 溢出多余内容
      let extraContent = ''
      // 数组中-当前位置之后一位
      let nextSegmented = segmented + 1

      if(editorContent[segmented] != undefined){
        //第一次赋值，内容高度未超出内容框，未低于内容框

        if(operating[segmented] == undefined ) {
          tinycmeContent = editorContent[segmented] + this.questionInfo
          // 变更后改变数据

          editorContent.splice(segmented,1,tinycmeContent)
          this.pageData_editorStr({id:objId,content:editorContent,operating:segmented,answer:true})
        }else{
          tinycmeContent = editorContent[segmented]
        }
        //----------------------------------------------------------------end
        // 当前内容数组
        let currentContentArr = this.convertArray(tinycmeContent)

        // 当前内容框能承受的最高长度
        let maxLong = first ? segmentedArr[segmented]:Math.floor((this.page_height - 20 - MarginHeight) / rowHeight)

        //内容溢出处理---------------------------------------------------------
        if(currentContentArr.length > maxLong){
          // 当前内容框显示内容
          tinycmeContent = ''

          for(let a = 0; a < maxLong;a++){
            if(currentContentArr[a] != undefined){
              tinycmeContent += currentContentArr[a]
            }
          }
          editorContent[segmented] = tinycmeContent

         // 溢出内容
          for(let i = maxLong; i < currentContentArr.length;i++){
            if(currentContentArr[i] != undefined){
              extraContent += currentContentArr[i]
            }
          }
          if(editorContent[nextSegmented] == undefined){
            editorContent.splice(nextSegmented, 1, extraContent)
          }else{
            editorContent.splice(nextSegmented, 1, extraContent + editorContent[nextSegmented])
          }
          this.pageData_editorStr({id:objId,content:editorContent,answer:true})
        }
        //内容溢出处理---------------------------------------------------------end

        // 内容低于内容框高度

        if(currentContentArr.length < maxLong && editorContent[nextSegmented] != undefined){
          let nextContentArr = this.convertArray(editorContent[nextSegmented])

              //减去不给当前内容的字符
              tinycmeContent = ''
              let long = maxLong - currentContentArr.length
              for(let i = long; i < nextContentArr.length - 1;i++){
                if(nextContentArr[i] != undefined){
                  tinycmeContent += nextContentArr[i]
                }
              }
              editorContent[nextSegmented] = tinycmeContent


              //计算出差值
              tinycmeContent = ''
              for(let a = 0; a < long;a++){
                if(nextContentArr[a] != undefined){
                  extraContent += nextContentArr[a]
                }
              }
              tinycmeContent = editorContent[segmented] + extraContent
              editorContent[segmented] = tinycmeContent
              this.pageData_editorStr({id:objId,content:editorContent,answer:true})

        }
      }

      //渲染数据

      return tinycmeContent == '' ? this.questionInfo : tinycmeContent
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }

        const {castHeight,heightTitle,first,titleContent,scoreTotal} = this.questionData
        this.tinymceHeight = first ? castHeight - heightTitle : castHeight
        this.content = ''
        let {number,topicName} = this.contentData

        if(!titleContent){
          this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</p>`
        }else{
          this.content = titleContent
        }
        this.pageLayout = this.contentData.pageLayout
      },
    },

  },
  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_orderFirst',
      'pageData_editorStr',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor() {
      this.isEditor = true
    },

    subTopic_numberAnswerEdit() {
      this.$emit('current-question-answer-edit', this.data)
    },

    delHanlde() {
      let {group} = this.data.content
      let questionGroup = group[0]

      const {sid,fid,pid,id} = this.data

      if(sid){
        //三节

        let index = questionGroup.childGroup.findIndex(question => question.id === fid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === pid)
          if(twoIndex > -1){
            let levelThree = levelTwo.childGroup[twoIndex]
            let threeIndex = levelThree.childGroup.findIndex(question => question.id === id)
            if(threeIndex > -1){
              if(levelTwo.childGroup.length <= 1){
                questionGroup.childGroup.splice(index,1)
              }else if(levelThree.childGroup.length <= 1){
                levelTwo.childGroup.splice(twoIndex,1)
              }else{
                levelThree.childGroup.splice(threeIndex,1)
              }
            }
          }
        }
      }else if(fid && !sid){
        //二节
        let index = questionGroup.childGroup.findIndex(question => question.id === pid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === id)
          if(twoIndex > -1){

            if(levelTwo.childGroup.length <= 1){
              questionGroup.childGroup.splice(index,1)
            }else{
              levelTwo.childGroup.splice(twoIndex,1)
            }
          }
        }
      }else if(id && !fid && !sid){
        //一节
        let index = questionGroup.childGroup.findIndex(question => question.id === id)
        if(index > -1){
          questionGroup.childGroup.splice(index,1)
          this.subTopic_already_del([this.data])
          this.subTopic_determine_clean(this.data.topic)
        }
      }
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.pageData_del(index)
        if(!this.data.orderFirst){
          this.$nextTick(()=>{
            this.pageData_orderFirst(this.data.objId)
          })
        }
      }
      this.subTopic_number_calculate()

    },

    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.objId === obj.objId)
      if(index > -1){
        let questionObj = this.pageData[index]

        this.pageData_edit({
            ...questionObj,
            height:height,
          })

      }
    },

    changeContent(obj){
      const {val,tinyHeight} = obj

      const index = this.pageData.findIndex(question => question.objId == this.questionData.objId && question.first)

      let height = tinyHeight
      this.maxHeight = height // 最大高度

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            titleContent:val,
            heightTitle:height,
            height:(curObj.height - curObj.heightTitle) + height
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }

    },

    //改变内容
    tinymceChangeFunc(obj){
      // 富文本参数
      const {val,tinyHeight} = obj

      const {objId,height,castHeight,heightTitle,segmented,editorContent,MarginHeight,first,operating} = this.questionData
      const index = this.pageData.findIndex(question => question.objId == objId)

      let heights = first ? tinyHeight + heightTitle + MarginHeight : tinyHeight + MarginHeight
      this.tinymceHeight = tinyHeight // 最大高度

      if(editorContent[segmented] == undefined){
        editorContent.length = segmented
        editorContent[segmented] = val
      }else{
        editorContent[segmented] = val
      }
      operating[segmented] = 1
      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            editorContent:editorContent,
            height:(height - castHeight) + heights,
            strLength:length,
            selectStr:segmented, // 判断当前编辑对象所在位置
            operating:operating // 是否操作
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }
    },

    convertArray(oldStr) {
      //转换富文本编辑的内容为数组
      if(oldStr != undefined){
        // let arr = oldStr.split(/[(\r\n)\r\n]+/) // 回车换行
        //     arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '\n')
        //               .filter(item => item !='')
        let arr = oldStr.split('</p>') // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '</p>')
                  .filter(item => item !='')
        return arr
      }
      //转换富文本编辑的内容为数组
    },

  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.question-info {
  &:hover {
    .question_editOrDel {
      display: block;
    }
  }

  p{
    margin: 0;
  }
  .question_line {
    &:first-child{
      margin-top: 8px;
    }

    // display: flex;
    margin: 0;
    line-height: 35px;
    font-size: 14px;
    padding: 0 3mm;

    .title{
      font-size: 12px;
      flex-shrink: 0;
      margin-right: 5px;
    }

    .line-style {
      border-bottom: 1px solid @font-888;
      width: 100%;
      // flex-shrink: 1;
      height: 23px;
    }
  }

  .question-container{

    .answer_question_box{
      padding-top: 10px;
    }
  }

}
.question-container{
  margin-top: 0 !important;
  .answer_question_box {
    padding: 10px 15px 0 15px;
    .question_box_title {
      span.title {
        font-size: 12px;
        display: inline-block;
      }
    }
  }
}

.question-title {
  border: 1px solid #fff;
  cursor: text;
}
.question-title:hover {
  border-color: @main;
}
</style>
