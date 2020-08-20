<template>
  <div class="question-info">
    <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
        <div class="title-span" v-html="cotent"></div>
      </div>
      <quill-editor
        v-show="isEditor"
        :topic-content="TopicContent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="currentQuestionAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box optional_box"
      :style="{
        'height':data.height + 'px',
      }"
    >
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import quillEditor from '../../components/quillEditor'
export default {
  components: {
    quillEditor,
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

  },
  data () {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      promptTitle: '请考生用2B铅笔将所选题目对应题号涂黑，答题区域只允许选择一题，如果多做，则按所选做的前一题计分。'
    }
  },
  computed: {
    ...mapState('questionType', ['options', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    numberTitle () {
      let item = this.options.filter(item => item.value === this.contentData.number)
      return item[0].label
    },

    TopicContent () {
      let totalScore = this.contentData.group[0].totalScore
      return `<span>${this.numberTitle}.</span><span>${this.contentData.topic}</span><span class='p-5'>(${totalScore})</span>分<span class='optional-prompt'>${this.promptTitle}</span>`
    },
    topicData () {

      return this.contentData.group
    },
    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.contentData.rows; i++) {
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
        console.log(this.data)
        console.log(this.contentData)
      }
    },
    TopicContent: {
      immediate: true,
      handler () {
        this.cotent = this.TopicContent
      }
    }
  },
  // mounted () {
  //   this.$nextTick(()=>)
  // },
  methods: {
    ...mapMutations('pageContent', ['delPageData']),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic'
    ]),
    hanldeCloseEsitor (content) {
      this.isEditor = false
      this.cotent = content
    },
    hanldeEditor () {
      this.isEditor = true
    },
    currentQuestionAnswerEdit () {
      this.$emit('current-question-answer-edit', this.data)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        console.log(this.contentData.group)
      }

    },
  },
}
</script>


<style lang="less" >
.answer_question_box {
  &.optional_box {
    border-top: 1px solid #888;
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
</style>