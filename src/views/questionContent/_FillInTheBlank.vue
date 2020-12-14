<template>
  <!-- 填空题 -->
  <div class="question-info">
    <div
      id="question-title"
      ref="tinyeditor"
      v-if="questionData.first && questionData.borderTop == undefined"
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
        <span
          class="layui-btn layui-btn-xs"
          @click="subTopic_numberFillEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delfillTheBlank">删除</span
        >
      </div>
    </div>
    <drag-change-height
      :question="questionData"
      @height-resize="handleResize($event)"
      ref="tinyDrag"
    >
      <trigger-tinymce
        :max-height="questionData.castHeight"
        @tinymce-change="tinymceChangeFunc"
      >
        <div class="content-info" ref="questionChange">
          <div class="content-row" v-for="(subtopic, i) in subtopicGroup" :key="i">
            <div
              v-for="(topic,index) in subtopic"
              :key="topic.lid ? `${topic.lid}_${index}` : `${topic.sid}_${index}`"
              class="subtopic_a"
              :style="{ width: pageWidth / data.rows + 'px' }"
            >

              <template v-if="topic.lid">
                <div class="s_p">
                  <template v-if="topic.smallTopic == 1 && topic.spaceNum == 1">{{topic.topic}}</template>
                  <template v-if=" topic.spaceNum <= 1">({{topic.smallTopic}})</template>
                </div>
              </template>

              <template v-else>
                <div class="s_p" v-if="!topic.spaceNum || topic.spaceNum == 1 ">{{topic.topic}}</div>
              </template>

              <div class="a_p"></div>

            </div>
          </div>

        </div>
      </trigger-tinymce>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations,mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight
  },
  props: {
    contentData: {
      type: Object,
      default: () => {},
    },
    questionData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data: {},
      isEditor: false,
      cotent: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      quilleditor:false,
      pageLayout:this.contentData.pageLayout,
      richText:'',
      maxHeight:28
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterList']),
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    minHeight(){
      const {rowHeight, showData,MarginHeight,height,castHeight} = this.questionData
      return  castHeight >= height ? rowHeight * showData.length + MarginHeight : 0
    },

    pageWidth() {
      return this.page_width - 50
    },
    subtopicGroup() {
      return this.questionData.showData
    },
    topicBox() {
      return this.data.group.map(question => question.childGroup).flat()
    },
  },
  watch: {
    contentData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.contentData,
        }
        this.pageLayout = this.contentData.pageLayout
      },
    },

    questionData:{
      immediate: true,
      handler () {
        this.content = ''
        let {number,topicName,scoreTotal} = this.data

          if(!this.questionData.titleContent){
            this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</p>`
          }else{
            this.content = this.questionData.titleContent
          }
      }
    }

  },
  mounted () {
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
    ...mapMutations('page',['pageData_edit_title']),

    delfillTheBlank() {
      // 删除大题-小题数
      let {id} = this.questionData
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.subTopic_already_del(this.topicBox)
        this.topicBox.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }
    },
    subTopic_numberFillEdit(id) {
      this.$emit('current-question-fill-edit', id)
    },
    hanldeEditor() {
      this.isEditor = true
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
    tinymceChangeFunc(){
      // console.log(val)
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.question-item{
  margin-top: 10px;
}
#question-title{
  overflow: auto;
}
.question-title {
  margin-bottom: 10px;
  span {
    color: @font-333;
  }
}
.question-info{
  &:hover{
    .question_arrays{
      display: block;
    }
  }
}
.question_arrays {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: none;

  .question_editOrDel {
    position: absolute;
    right: 0;
    top: -10px;
    // display: block;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
  .question-title img {
    max-width: 100%;
  }
  .question-title>div {
    padding: 10px 0 10px 10px;
    border: 1px solid #fff;
    p{margin: 0 0}
}
  .question-title:hover{
    div{border-color: @main}
  }
}

.content-row  {
  display: flex;

  div.subtopic_a{
    display: flex;
    height: 35px;
    margin-left: 5px;
    width: 100%;
    font-size:12px;
    .s_p{
      height: 100%;
      flex:0;
      text-align: center;
      padding: 0 1mm 0 4mm;
      line-height: 35px;
      margin: 0 0;
    }
    .a_p{
        flex:  2;
        border-bottom: 1px solid @font-888;
        margin-left: 5px;
        display: inline-block;
        line-height: 25px;
        height: 25px;
      }
  }

}
</style>
