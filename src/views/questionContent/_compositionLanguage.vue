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
        <span class="layui-btn layui-btn-xs" @click="compositionEnglishEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box composition_box"
      :style="{
        'height':data.height + 'px',
      }"
    >

      <div
        v-for="(item,i) in rowsData"
        :key="i"
        class="compositionLanguage_item"
      >
      <template  v-if="data.first">
        <span
        v-if="i == 0"
        class="pre-t5"
        :style="{'width':strLong + 'px'}">{{contentData.topic}}.</span>
        <span
          class="line-style"
          :style="{'width':'calc(100% - '+ strLong +'px)'}"
        />
      </template>
      <template v-else>
        <span class="line-style" style="width:100%"/>
      </template>
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
      'Empty_PageData'
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
    compositionEnglishEdit () {
      this.$emit('composition-english-edit', this.data)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.del_determineTopic([this.contentData])
        this.Empty_PageData(this.data.id)
        this.set_currentQuestion()
      }

    },
  },
}
</script>


<style lang="less" >
.answer_question_box {
  &.composition_box {
    border-top: 1px solid #888;
    padding-bottom: 5px;
  }
}
.compositionEnglish_item {
  width: 100%;
  height: 35px;
  display: inline-flex;
  span {
    display: inline-block;
  }
  .pre-t5 {
    position: relative;
    top: 18px;
    font-size: 12px;
  }
  .line-style {
    height: 34px;
    border-bottom: 1px solid #888;
    flex-basis: auto;
  }
}
</style>