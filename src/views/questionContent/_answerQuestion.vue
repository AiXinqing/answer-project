<template>
<!-- 解答题 -->
  <div class="question-info" :style="{'margin-top':data.top != undefined ? data.top : 0  }">
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
        <span class="layui-btn layui-btn-xs" @click="currentQuestionAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box"
      :style="{
        'height':data.first ? data.castHeight - data.heightTitle - 2 + 'px':data.castHeight - 1  + 'px',
        'border-top':data.first || data.borderTop != undefined  ? '1px solid #888':'none',
      }"
    >
      <div class="question_box_title" v-if="!contentData.HorizontalLine">
        <span class="title">
          {{topicData.topic}}
          <span v-if="contentData.ShowScore && topicData.score != undefined">({{topicData.score}})分</span>
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
          <span v-if="contentData.ShowScore && topicData.score != undefined">({{topicData.score}})分</span>
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
    ...mapMutations('pageContent', ['delPageData', 'del_objectiveData', 'del_orderSort']),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
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
        this.del_orderSort(this.pageData[index].order + 1)
        this.delPageData(index)
        this.del_determineTopic(this.topicBox)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
        console.log(this.data)
        this.del_existBigQuestion(this.data, this.data.objId)
      }

    },
  },
}
</script>

<style lang="less" >
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
  border: 1px solid @font-888;
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