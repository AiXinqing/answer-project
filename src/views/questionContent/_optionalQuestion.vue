<template>
  <div class="question-info">
    <template v-if="data.first && data.borderTop == undefined || data.borderTop == 0">
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
        <span class="layui-btn layui-btn-xs" @click="currentQuestionAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box optional_box"
      :style="{
        'height':data.first ? data.castHeight - data.heightTitle  + 'px':data.castHeight  + 'px',
      }"
    >
      <template v-if="data.first && data.borderTop == undefined">
        <div class="topic_number_box">

          <span class="black_icon"></span>

          <span class="digital"
            v-for="(item,i) in topicData"
            :key="i"
          >{{item.topic}}</span>
          <span class="black_icon"></span>
        </div>
        <div class="number-info">
          <span>我选的题号（1分）</span>
        </div>
      </template>

    <div v-if="contentData.HorizontalLine">
      <div
        v-for="(item,i) in rowsData"
        :key="i"
        class="optional-item-list"
      ></div>
    </div>
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
      return this.contentData.group[0].childGroup
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
    ...mapMutations('pageContent', ['delPageData', 'del_objectiveData']),
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
      this.$emit('current-question-optional-edit', this.contentData, this.data.id)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.del_determineTopic(this.topicData)
        this.del_AlreadyTopics(this.topicData)
        this.delPageData(index)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
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
.optional-item-list {
  height: 34px;
  line-height: 34px;
  border-bottom: 1px solid #888;
}
.number-info {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  position: relative;
}
.topic_number_box {
  height: 20px;
  text-align: right;
  width: 100%;
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