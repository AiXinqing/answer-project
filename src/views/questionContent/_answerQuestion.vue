<template>
<!-- 解答题 -->
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
        <span class="layui-btn layui-btn-xs" @click="currentQuestionFillEdit(data.pid)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(data.id)">删除</span>
      </div>
    </div>
    <div class="answer_question_box"
      :style="{'height':data.height + 'px'}"
    >
      <div class="question_box_title" v-if="!contentData.HorizontalLine">
        <span>
          {{topicData.topic}}
          <span v-if="contentData.ShowScore">({{topicData.score}})分</span>
        </span>
      </div>
      <div
        v-else
        v-for="(item,i) in rowsData"
        :key="i"
        class="question_line"
      >
        <span class="title" v-if="i == 0">
          {{topicData.topic}}
          <span v-if="contentData.ShowScore">({{topicData.score}})分</span>
        </span>
        <span class="line-style" :style="{'width':i == 0 ? 'calc(100% - 60px)':'100%'}"></span>
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
    // questionDialog,
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
    currentQuestionFillEdit (id) {
      this.$emit('current-question-fill-edit', id)
    },
    delHanlde (id) { // 删除大题-小题数
      // const index = this.pageData.findIndex((itme) => itme.id === id)
      // if (index > -1) {
      //   this.del_determineTopic(this.topicBox)
      //   this.delPageData(index)
      //   this.set_currentQuestion()
      // }
      console.log(id)
    },
  },
}
</script>

<style lang="less" >
@import '~@/assets/css/variables.less';
.answer_question_box {
  padding: 0 10px;
  border: 1px solid @font-888;
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
</style>