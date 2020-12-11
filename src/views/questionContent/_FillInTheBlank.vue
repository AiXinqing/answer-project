<template>
  <!-- 填空题 -->
  <div class="question-info">
    <!-- <template v-if="questionData.first && questionData.borderTop == undefined">
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
    </template> -->

    <div
      class="question-title"
      ref="tinyeditor"
      v-if="questionData.first && questionData.borderTop == undefined"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        ref="tinyMCE"
      />
    </div>

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
      :question="questionData"
      @height-resize="handleResize($event)"
    >

      <div class="content-info" ref="questionChange" >
        <div class="content-row" v-for="(subtopic, i) in subtopicGroup" :key="i">
          <section
            v-for="(topic,index) in subtopic"
            :key="topic.lid ? `${topic.lid}_${index}` : `${topic.sid}_${index}`"
            class="subtopic_a"
            :style="{ width: pageWidth / data.rows + 'px' }"
          >

            <template v-if="topic.lid">
              <p>
                <template v-if="topic.smallTopic == 1 && topic.spaceNum == 1">{{topic.topic}}</template>
                <template v-if=" topic.spaceNum <= 1">({{topic.smallTopic}})</template>
              </p>
            </template>

            <template v-else>
              <p v-if="!topic.spaceNum || topic.spaceNum == 1 ">{{topic.topic}}</p>
            </template>

            <a></a>

          </section>
        </div>

      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations,mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import tinyVue from '../../components/tinymce'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    tinyVue,
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

      if(index > -1){
        let curObj = this.pageData[index]
        let height = this.$refs.tinyeditor.offsetHeight

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
