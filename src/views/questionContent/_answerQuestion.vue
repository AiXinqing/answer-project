<template>
  <!-- 解答题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="!data.orderFirst"
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
          'border-top':!data.orderFirst ? '1px solid #888' : 'none',
          'margin-top':!data.orderFirst  ? '10px' : '0px',
        }"
    >
      <trigger-tinymce
        :max-height="tinymceHeight"
        @tinymce-change="tinymceChangeFunc"
        v-if="questionData.editorContent ==''"
      >
        <div class="answer_question_box">
            <p v-for="(item, i) in rowsData" :key="i" class="question_line">
              <span class="title" v-if="i == 0 && data.first">{{ data.topic }} ({{ data.score }}分)</span>
              <span class="line-style" v-if="contentData.HorizontalLine"></span>
            </p>
        </div>
      </trigger-tinymce>
      <section v-else v-html="questionData.editorContent"></section>

    </drag-change-height>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

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
  },
  data() {
    return {
      isEditor: false,
      data: {},
      content: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      tinymceHeight:28
    }
  },
  computed: {
    ...mapState('page', ['pageData']),

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
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }
        this.tinymceHeight = this.questionData.castHeight - this.questionData.heightTitle
        this.content = ''
        let {number,topicName} = this.contentData

          if(!this.questionData.titleContent){
            this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${this.questionData.scoreTotal})</span>分</p>`
          }else{
            this.content = this.questionData.titleContent
          }
      },
    },

  },
  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_orderFirst'
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
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        this.pageData_edit({
            ...questionObj,
            height:height,
          })

      }
    },

    changeContent(val){
      const index = this.pageData.findIndex(question => question.id == this.questionData.id && question.first)
      const length = (val.split('<p>')).length - 1
      let height = length * 21
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
    tinymceChangeFunc(val){
      const {id,height,castHeight} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id && question.first)
      const length = (val.split('<p>')).length - 1
      let heights = length * 21
          heights = heights > height ? heights : height

      this.maxHeight = height // 最大高度

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            editorContent:val,
            height:heights > height ? (curObj.height - castHeight - curObj.heightTitle) + heights:height
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }
    }
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
    .question_line {
      display: flex;
      margin: 0;
      height: 35px;
      line-height: 35px;

      .title{
        font-size: 12px;
        flex-shrink: 0;
        margin-right: 5px;
      }

      span.line-style {
        border-bottom: 1px solid @font-888;
        width: 100%;
        flex-shrink: 1;
        height: 25px;
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
