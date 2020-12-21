<template>
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first && data.borderTop == undefined || data.borderTop == 0"
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
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <drag-change-height
      v-if="!previewContent"
      :question="questionData"
      @height-resize="handleResize($event)"
      :style="{
        'height':minHeight  + 'px',
      }"
    >
      <trigger-tinymce
        :max-height="tinymceHeight"
        @tinymce-change="tinymceChangeFunc"
      >
        <div class="answer_question_box optional_box">
          <template v-if="data.first || data.heightTitle == (data.height - data.castHeight)">
            <span class="topic_number_box">

              <span class="black_icon"></span>

              <span class="digital"
                v-for="(item,i) in topicData"
                :key="i"
              >{{item.topic}}</span>
              <span class="black_icon"></span>
            </span>
            <span class="number-info">
              <span>我选的题号（1分）</span>
            </span>
          </template>
          <div v-if="contentData.HorizontalLine">
            <p
              v-for="(item,i) in rowsData"
              :key="i"
              class="optional-item-list"
            ><a/></p>
          </div>
        </div>
      </trigger-tinymce>
    </drag-change-height>
    <drag-change-height
      v-else
      :question="questionData"
      @height-resize="handleResize($event)"
      :style="{
        'height':minHeight  + 'px',
      }"
    >
      <div class="answer_question_box optional_box"  v-html="questionData.editorContent"></div>
    </drag-change-height>


  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import dragChangeHeight from '../questionContent/drag'
import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'

export default {
  components: {
    dragChangeHeight,
    tinyVue,
    triggerTinymce
  },
  props: {
    questionData: {
      type: Object,
      default: () => { }
    },
    contentData: {
      type: Object,
      default: () => { }
    },
    previewContent: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      promptTitle: '请考生用2B铅笔将所选题目对应题号涂黑，答题区域只允许选择一题，如果多做，则按所选做的前一题计分。',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      tinymceHeight:28
    }
  },
  computed: {
    ...mapState('page', ['pageData']),

    minHeight(){
      const {first,heightTitle,castHeight} = this.questionData
      return  first ? castHeight - heightTitle : castHeight
    },

    topicData () {
      return this.contentData.group.map(question => question.childGroup).flat()
    },
    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.data.rows; i++) {
        Arr.push(i)
      }
      return Arr
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        this.tinymceHeight = this.questionData.castHeight - this.questionData.heightTitle
        this.content = ''
        let {number,topicName} = this.contentData

        if(!this.questionData.titleContent){
          this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${this.questionData.content.scoreTotal})</span>分</p>`
        }else{
          this.content = this.questionData.titleContent
        }
      }
    },
  },

  methods: {
    ...mapMutations('page', ['pageData_del','pageData_edit']),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor () {
      this.isEditor = true
    },
    subTopic_numberAnswerEdit () {
      this.$emit('current-question-optional-edit', this.contentData, this.data.id)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.subTopic_already_del(this.topicData)
        this.topicData.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }

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
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)
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
    tinymceChangeFunc(val){
      const {id,height,castHeight} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)
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


<style lang="less" >
.question-container{
  margin-top: 10px;

  .answer_question_box {
    height: 35px;
    line-height: 35px;
    padding: 0 15px ;
    position: relative;
    margin: 0;
  }
}
.question-title {
  .title-span {
    color: #000 !important;
    font-weight: 600;
    span {
      &.optional-prompt {
        color: #333;
        margin-left: 5px;
        font-weight: 400;
      }
    }
    .p-5 {
      margin: 0 5px;
    }
  }
}
.optional-item-list {
    margin: 0 0;
    width: 100%;
    height: 35px;
    line-height: 35px;

  a{
    width: 100%;
    border-bottom: 1px solid #888;
    display: inline-block;
  }
}
.number-info {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  position: relative;
}
.topic_number_box {
  height: 20px;
  position: absolute;
  right: 15px;
  top: -13px;

  span {
    display: inline-block;
    margin-left: 5px;
  }
  .black_icon {
    width: 16px;
    height: 10px;
    background-color: #000;
  }
  .digital {
    min-width: 26px;
    font-size: 12px;
    border: 1px solid #000;
    text-align: center;
    height: 10px;
    line-height: 10px;
  }
}
</style>