<template>
  <!-- 解答题 -->
  <div
    class="question-info"
    :style="{ 'margin-top': data.top != undefined ? data.top : 0 }"
  >
    <template v-if="data.first && data.borderTop == undefined">
      <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
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
        <span class="layui-btn layui-btn-xs" @click="currentQuestionAnswerEdit"
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
        <div class="question_box_title" v-if="!contentData.HorizontalLine">
          <span class="title">
            {{ data.topic }}
            <span v-if="contentData.ShowScore && data.score != undefined"
              >({{ data.score }})分</span
            >
          </span>
        </div>
        <div v-else v-for="(item, i) in rowsData" :key="i" class="question_line">
          <span class="title" v-if="i == 0">
            {{ data.topic }}
            <span v-if="contentData.ShowScore && data.score != undefined"
              >({{ data.score }})分</span
            >
          </span>
          <span
            class="line-style"
            :style="{ width: i == 0 ? 'calc(100% - 60px)' : '100%' }"
          ></span>
        </div>
      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import quillEditor from '../../components/quillEditor'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    quillEditor,
    dragChangeHeight,
    // questionDialog,
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
      options:[],
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
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
      const {number,topic} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${topic}</span><span>(${this.data.totalScore})分</span>`
    },
    topicData() {
      return this.contentData.group
    },
    rowsData() {
      let Arr = []
      for (let i = 1; i <= this.contentData.rows; i++) {
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
        this.options = this.questionNumber.map((label,value)=>({label,value}))
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
    ...mapMutations('pageContent', [
      'delPageData',
      'del_objectiveData',
      'del_orderSort',
      'amendPageData',
      'deletePageData'
    ]),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
    ]),
    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
    },
    hanldeEditor() {
      this.isEditor = true
    },
    currentQuestionAnswerEdit() {

      this.$emit('current-question-answer-edit', this.data)
    },
    delHanlde() {

      let {group} = this.data.content
      let questionGroup = group[0]

      const {sid,fid,pid,id,objId} = this.data

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
        }
      }
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.delPageData(index)
        setTimeout(function(){
          this.deletePageData({group:questionGroup,objId:objId})
        },500)
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
        this.amendPageData({
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
.answer_question_box {
  padding: 0 10px;
  // border: 1px solid @font-888;
  border-top: none;
  overflow: hidden;
  .question_box_title {
    span.title {
      font-size: 12px;
      display: inline-block;
    }
    // margin-top: 10px;
  }
  .question_line {
    height: 34px;
    .title {
      width: 60px;
      font-size: 12px;
      text-align: center;
    }
    span.line-style {
      height: 100%;
      display: inline-block;
      border-bottom: 1px solid @font-888;
      width: 100%;
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
