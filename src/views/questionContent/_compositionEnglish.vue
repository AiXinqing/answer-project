<template>
  <div class="question-info">
    <template v-if="data.first">
      <div class="question-title" :style="{height: data.heightTitle - 10 + 'px'}" v-if="!isEditor" @click="hanldeEditor">
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
    <div class="answer_question_box composition_box english">

      <p
        v-for="(item,i) in rowsData"
        :key="i"
        class="compositionEnglish_item"
      >
      <template  v-if="data.first && data.borderTop == undefined">
        <a v-if="i == 0" class="pre-t5">{{contentData.topic}}.</a>
        <a class="line-style" />
      </template>
      <template v-else>
        <span class="line-style" style="width:100%"/>
      </template>
      </p>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

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
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    strLong () {

      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    TopicContent () {
      const {topicName,number,score} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${score})</span>分`
    },
    topicData () {
      return ''
    },
    rowsData () {
      const { heightTitle, MarginHeight, castHeight, first, borderTop } = this.data
      let row = 0
      if (first && borderTop == undefined) {
        row = Math.floor((castHeight - MarginHeight - heightTitle) / 35)
      } else {
        row = Math.floor(castHeight / 35)
      }
      // console.log(row)
      let Arr = []
      for (let i = 1; i <= row; i++) {
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

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_id_clean',
    ]),
    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
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
        this.subTopic_already_del([this.contentData])
        this.subTopic_determine_clean(this.contentData.topic)
        this.pageData_id_clean(this.data.id)
        this.subTopic_number_calculate()
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
  &.english{
    padding: 0 15px !important;
  }
}
.compositionEnglish_item {
  width: 100%;
  height: 35px;
  line-height: 35px;
  display: flex;
  margin: 0;

  .pre-t5 {
    font-size: 12px;
    flex-shrink:0;
  }
  .line-style {
    width: 100%;
    border-bottom: 1px solid #888;
    flex-shrink:1;
    height: 25px;
  }
}
</style>
<style lang="less" scoped>
  .composition_box{
    border: 1px solid #888;
  }
</style>
