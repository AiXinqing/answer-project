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
      <div class="question_editOrDel language">
        <span  class="btn_addSub_name spacing">行间距：</span>
        <span class="btn_addSub" @click="subtractSpacing">-</span>
        <span class="btn_addSub_info">{{contentData.spacing.label}}</span>
        <span class="btn_addSub" @click="addSpacing">+</span>
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
        <p
          v-for="(rowsList, i) in rowsData"
          :key="i"
          class="compositionLanguage_item"
          :style="{
            height:
              i != rowsData.length
                ? data.rowHeight + 'px'
                : data.rowHeight - contentData.spacing + 'px',
          }"
        >
          <a
            v-for="(lattices, a) in latticeData"
            :key="'id_' + (i * data.lattice + (a += 1))"
            class="svg_span"
            :style="{
              height: data.rowWidth - 1 + 'px',
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              v-show="
                /(^[1-9]\d*$)/.test((i * data.lattice + (a += 1) + data.superiorGrid) / 100) &&
                  contentData.mark == '2'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ i * data.lattice + (a += 1) + data.superiorGrid - 1 }}字
              </text>
            </svg>
          </a>
        </p>
      </div>
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
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    strLong() {
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    TopicContent() {
      const {topicName,number,score} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${score})</span>分`
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
    ...mapMutations('page', [
      'pageData_del',
      'pageData_id_clean',
    ]),
    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
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

    subtractSpacing(){
      const { label,value } = this.data.content.spacing
      let spacLabel = label - 0.2
          spacLabel = Number(spacLabel.toFixed(2))
      let spacVal = value - 0.5
          spacVal =  Number(spacVal.toFixed(2))

      if(spacLabel < 1){
        this.$message({
          message: '行间距最小值1',
          type: 'warning'
        });
      }else{
        this.$emit('subtract-spacing',{
          ...this.data,
          content:{
            ...this.data.content,
            spacing:{
              label:spacLabel,
              value:spacVal
            }
          }
        })
      }

    },
    addSpacing(){
      const { label,value } = this.data.content.spacing

      let spacLabel = label + 0.2
          spacLabel = Number(spacLabel.toFixed(2))
      let spacVal = value + 0.5
          spacVal =  Number(spacVal.toFixed(2))

      if(spacLabel <= 2.8){
        this.$emit('subtract-spacing',{
          ...this.data,
          content:{
            ...this.data.content,
            spacing:{
              label:spacLabel,
              value:spacVal
            }
          }
        })
      }else{
        this.$message({
          message: '行间距最大值2.8',
          type: 'warning'
        });
      }
    },

    delHanlde() {
      // 删除大题-小题数
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

<style lang="less">
.answer_question_box.composition_box {
  padding: 10px 5px 5px 5px;
}
.Language_item_title {
  height: 35px;
  position: relative;
  line-height: 35px;
  font-size: 14px;
}
.compositionLanguage_box {
  border: 1px solid #888;
  border-left: 2px solid #bfbfbf;
  border-right: 2px solid #bfbfbf;
  .compositionLanguage_item {
    margin: 0;
    display: flex;

    a {
      flex-shrink:1;
      border: 1px solid #888;
      border-left: none;
      width: 100%;
    }

    a:last-child {
      border-right: none;
    }
  }
  .compositionLanguage_item:first-child {
    a {
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
.spacing{color: #333}
.question_editOrDel{
  &.language{
    top: 2px
  }
}
</style>

<style lang="less" scoped>
  .composition_box{
    border: 1px solid #888;
  }
</style>
