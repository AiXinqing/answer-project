<template>
  <div class="question-info">
    <div v-if="data.first">
      <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
        <div v-html="cotent"></div>
      </div>
      <quill-editor
        v-show="isEditor"
        :topic-content="TopicContent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    </div>
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="currentQuestionAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box"
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
      cotent: ''
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
      return `<span>${this.numberTitle}.</span><span>${this.contentData.topic}</span><span>(${this.contentData.totalScore})分</span>`
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


<style lang="less" scoped>
</style>