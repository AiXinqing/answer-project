<template>
  <!-- 解答题 -->
  <div
    class="question-info"
    :style="{ 'margin-top': data.top != undefined ? data.top : 0 }"
  >
    <template v-if="data.first && data.borderTop == undefined">
      <div class="question-title" :style="{height: data.heightTitle - 10 + 'px'}" v-if="!isEditor" @click="hanldeEditor">
        <div class="title-span" v-html="cotent"></div>
      </div>
      <quill-editor
        v-show="isEditor"
        :topic-content="TopicContent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    </template>
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberAnswerEdit"
          >编辑</span
        >
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <drag-change-height
      :question="questionContetn"
      @height-resize="handleResize($event)"
      :min-height="minHeight"
      :style="{
          height: data.first
            ? data.castHeight - data.heightTitle - 2 + 'px'
            : data.castHeight - 1 + 'px',
          'border-top':
            data.first || data.borderTop != undefined ? '1px solid #888' : 'none',
          'margin-top':
            data.first || data.borderTop != undefined ? '20px' : '0',
        }"
    >
      <div
        class="answer_question_box"
      >

        <p v-for="(item, i) in rowsData" :key="i" class="question_line">
          <span class="title" v-if="i == 0">{{ data.topic }} ({{ data.score }}分)</span>
          <span class="line-style" v-if="contentData.HorizontalLine"></span>
        </p>
      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import quillEditor from '../../components/quillEditor'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    quillEditor,
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
  },
  data() {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    heightContetn(){
      const {castHeight,heightTitle,height} = this.questionData
      let obj = {
        height: castHeight >= height  ? castHeight - heightTitle - 3 : castHeight
      }
      return obj
    },

    minHeight(){
      const {rowHeight, row,MarginHeight,height,castHeight} = this.questionData
      return  castHeight >= height ? rowHeight * row + MarginHeight - 3 : 0
    },

    TopicContent() {
      const {number,topicName} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${topicName}</span><span>(${this.questionData.scoreTotal})分</span>`
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
      },
    },
    TopicContent: {
      immediate: true,
      handler() {
        this.cotent = this.TopicContent
      },
    },

    heightContetn:{
      immediate: true,
      handler() {
        this.questionContetn = this.heightContetn
      },
    },
  },
  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
    ]),
    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),
    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
    },
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
      }

    },
    handleResize (rectHeight) {
      const {castHeight,height} = this.questionData
      let crrHeight = rectHeight

      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        if(castHeight < height){
          crrHeight = (height - castHeight) + rectHeight
        }
        this.pageData_edit({
            ...questionObj,
            height:crrHeight >= this.minHeight ? crrHeight + questionObj.heightTitle + 3:this.minHeight,
          })

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
}
.question-container{

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
