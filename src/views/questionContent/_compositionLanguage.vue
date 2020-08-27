<template>
  <div class="question-info">
    <template v-if="data.first">
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
        <span class="layui-btn layui-btn-xs" @click="compositionLanguagehEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box composition_box">
      <template v-if="data.first">
        <div class="Language_item_title">
          <span>1.</span>
        </div>
      </template>
      <div class="compositionLanguage_box">
        <div
          v-for="(item,i) in rowsData"
          :key="i"
          class="compositionLanguage_item"
          :style="{'height':i != rowsData.length - 1 ? data.rowHeight + 'px':data.rowHeight - contentData.spacing + 'px'}"
        >
          <span
            v-for="(item,i) in latticeData"
            :key="i"
            :style="{
              'width':data.rowWidth - 1 + 'px',
              'height':data.rowWidth - 1 + 'px',
            }"
          />
        </div>
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
    }
  },
  computed: {
    ...mapState('questionType', ['options', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    numberTitle () {
      let item = this.options.filter(item => item.value === this.contentData.number)
      return item[0].label
    },
    strLong () {

      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    TopicContent () {
      return `<span>${this.numberTitle}.</span><span>${this.contentData.name}</span><span class='p-5'>(${this.contentData.score})</span>分`
    },
    topicData () {
      return ''
    },
    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.data.showRow; i++) {
        Arr.push(i)
      }
      return Arr
    },
    latticeData () {
      let Arr = []
      for (let i = 1; i <= this.data.lattice; i++) {
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

  methods: {
    ...mapMutations('pageContent', [
      'delPageData',
      'Empty_PageData',
      'del_objectiveData',
    ]),
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
    compositionLanguagehEdit () {
      this.$emit('composition-language-edit', this.data)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.del_determineTopic([this.contentData])
        this.Empty_PageData(this.data.id)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
      }

    },
  },
}
</script>


<style lang="less" >
.answer_question_box.composition_box {
  padding-top: 10px;
}
.Language_item_title {
  height: 45px;
  position: relative;
  margin-top: -10px;
  line-height: 45px;
  font-size: 14px;
}
.compositionLanguage_box {
  border: 1px solid #888;
  border-left: 2px solid #bfbfbf;
  border-right: 2px solid #bfbfbf;
  .compositionLanguage_item {
    span {
      display: inline-block;
      border: 1px solid #888;
      border-left: none;
    }
    span:last-child {
      border-right: none;
    }
  }
  .compositionLanguage_item:first-child {
    span {
      border-top: none;
    }
  }
}
</style>