<template>
  <div class="question-info">
    <template v-if="data.first && data.borderTop == undefined">
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
        <span class="layui-btn layui-btn-xs" @click="compositionLanguagehEdit"
          >编辑</span
        >
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box composition_box">
      <template v-if="data.first && data.borderTop == undefined">
        <div class="Language_item_title">
          <span>{{contentData.topic}}.</span>
        </div>
      </template>
      <div class="compositionLanguage_box">
        <div
          v-for="(rowsList, i) in rowsData"
          :key="i"
          class="compositionLanguage_item"
          :style="{
            height:
              i != rowsData.length - 1
                ? data.rowHeight + 'px'
                : data.rowHeight - contentData.spacing + 'px',
          }"
        >
          <span
            v-for="(lattices, a) in latticeData"
            :key="'id_' + (i * data.lattice + (a += 1))"
            class="svg_span"
            :style="{
              width: data.rowWidth - 1 + 'px',
              height: data.rowWidth - 1 + 'px',
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              v-show="
                /(^[1-9]\d*$)/.test((i * data.lattice + (a += 1)) / 100) &&
                  contentData.mark == '2'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ i * data.lattice + (a += 1) - 1 }}字
              </text>
            </svg>
          </span>
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
      default: () => {},
    },
    contentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isEditor: false,
      data: {},
      cotent: '',
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    strLong() {
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    TopicContent() {
      const {name,number,score} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${name}</span><span class='p-5'>(${score})</span>分`
    },
    topicData() {
      return ''
    },
    rowsData() {
      const {
        heightTitle,
        MarginHeight,
        castHeight,
        first,
        borderTop,
        rowHeight,
      } = this.data
      let row = 0
      if (first && borderTop == undefined) {
        row = Math.floor((castHeight - MarginHeight - heightTitle) / rowHeight)
      } else {
        row = Math.floor(castHeight / rowHeight)
      }
      let Arr = []
      for (let i = 1; i <= row; i++) {
        Arr.push(i)
      }
      return Arr
    },
    latticeData() {
      let Arr = []
      for (let i = 1; i <= this.data.lattice; i++) {
        Arr.push(i)
      }
      return Arr
    },
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      },
    },
    TopicContent: {
      immediate: true,
      handler() {
        this.cotent = this.TopicContent
      },
    },
  },

  methods: {
    ...mapMutations('pageContent', [
      'delPageData',
      'Empty_PageData',
      'del_objectiveData',
      'del_orderSort',
    ]),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
    ]),
    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
    },
    hanldeEditor() {
      this.isEditor = true
    },
    compositionLanguagehEdit() {
      this.$emit('composition-language-edit', this.data)
    },
    delHanlde() {
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.del_determineTopic([this.contentData])
        this.del_AlreadyTopics([this.contentData])
        this.del_orderSort(this.pageData[index].order + 1)
        this.Empty_PageData(this.data.id)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
        this.del_existBigQuestion(this.questionData)
      }
    },
  },
}
</script>

<style lang="less">
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
.svg_span {
  position: relative;
  svg {
    position: absolute;
    top: 20px;
    left: 5px;
    z-index: 9999;
  }
}
</style>

<style lang="less" scoped>
  .composition_box{
    border: 1px solid #888;
  }
</style>
