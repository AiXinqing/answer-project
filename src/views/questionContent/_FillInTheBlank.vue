<template>
  <!-- 填空题 -->
  <div class="question-info">
    <template v-if="questionData.first && questionData.borderTop == undefined">
      <div
        class="question-title"
        ref="questionTitle"
        :style="{height: data.heightTitle - 10 + 'px'}" v-if="!isEditor" @click="hanldeEditor">
        <template v-if="!quilleditor">
          <div class="title-span">
            <span>{{options[data.number].label}}.</span>
            <span>{{data.topicName}}</span>
            <span>({{data.scoreTotal}})分</span>
          </div>
        </template>
        <template
          v-else
        >
          <div class="title-span" v-html="cotent"></div>
        </template>
      </div>
      <quill-editor
        v-if="isEditor"
        ref="quillEditor"
        :topic-content="cotent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    </template>
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span
          class="layui-btn layui-btn-xs"
          @click="subTopic_numberFillEdit(questionData.id)"
          >编辑</span
        >
        <span class="layui-btn layui-btn-xs" @click="delfillTheBlank"
          >删除</span
        >
      </div>
    </div>

    <drag-change-height
      :question="questionContetn"
      @height-resize="handleResize($event)"
      :min-height="minHeight"
    >

      <div class="content-info" ref="questionChange" >
        <div class="content-row" v-for="(subtopic, i) in subtopicGroup" :key="i">
          <section
            v-for="(topic,index) in subtopic"
            :key="topic.lid ? `${topic.lid}_${index}` : `${topic.sid}_${index}`"
            class="subtopic_a"
            :style="{ width: pageWidth / data.rows + 'px' }"
          >
            <template
              v-if="topic.lid"
            >
              <p>{{topic.topic}}({{topic.smallTopic}})</p>
              <a></a>
            </template>

            <template
              v-else
            >
            <!-- 一级 -->
              <p>{{topic.topic}}</p>
              <a></a>
            </template>
          </section>
        </div>

      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations,mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import quillEditor from '../../components/quillEditor'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    quillEditor,
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
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterList']),
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    heightContetn(){
      const {castHeight,heightTitle,first} = this.questionData

      let obj = {
        height: first ? castHeight - heightTitle : castHeight
      }
      return obj
    },

    minHeight(){
      const {rowHeight, showData,MarginHeight,height,castHeight} = this.questionData
      return  castHeight >= height ? rowHeight * showData.length + MarginHeight - 3 : 0
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
    heightContetn:{
      immediate: true,
      handler() {
        this.questionContetn = this.heightContetn
      },
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.cotent = this.$refs.questionChange.innerHTML
    })
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
    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
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
.content-info{
  padding-top: 6px;
}
.content-row  {
  display: flex;

  section{
    display: flex;
    height: 35px;
    margin-left: 5px;
    width: 100%;
    font-size:12px;
    p{
      height: 100%;
      flex:0;
      text-align: center;
      padding: 0 1mm 0 4mm;
      line-height: 35px;
      margin: 0 0;
    }
    a{
        flex:  2;
        border-bottom: 1px solid @font-888;
        margin-left: 5px;
        height: 25px;
      }
  }

}
</style>
