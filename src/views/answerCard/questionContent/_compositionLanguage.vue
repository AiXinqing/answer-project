<template>
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first && data.borderTop == undefined && !data.segmented"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        :max-height="maxHeight"
        :readonly="readonly"
        ref="tinyMCE"
      />
    </div>

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
      <template v-if="data.first && data.borderTop == undefined && !data.segmented">
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
              height="30"
              v-show="
                /(^[1-9]\d*$)/.test((i * data.lattice + a + superiorGrid) / 100) &&
                contentData.mark == '2'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ i * data.lattice + (a += 1) + superiorGrid - 1 }}字
              </text>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              height="30"
              v-show="
                (i * data.lattice + (a += 1) + superiorGrid - 1) == contentData.minWordCount &&
                contentData.mark == '1'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ contentData.minWordCount }}字
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

import tinyVue from '@/components/tinymce'
export default {
  components: {
    tinyVue,
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
    previewWidth:{
      type: Number,
      default: 0
    },
    readonly: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
    }
  },
  computed: {
    ...mapState('page', ['pageData']),

    strLong() {
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
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
        rowTitle,
        segmentedArr,
        segmented,
        totalRow,
      } = this.data
      let row = 0
      if (first && borderTop == undefined) {
        row = Math.floor((castHeight - MarginHeight - heightTitle - rowTitle) / rowHeight)
      } else {
        row = Math.floor(castHeight / rowHeight)
        if(segmentedArr.length - 1 == segmented){
          row = totalRow
          segmentedArr.forEach((num,i) => {
            if(i != segmented){
              row -= num
            }
          })
        }
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
    superiorGrid(){
      const {segmentedArr,lattice,segmented} = this.data
      let nums = 0
      // 解析格子总数
      for(let i = 1 ; i <= segmentedArr.length;i++){
        if(i <= segmented){
          nums += segmentedArr[i - 1]
        }
      }

      return nums * lattice
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }
        this.content = ''
        const {topicName,number,score} = this.contentData

          if(!this.questionData.titleContent){
            this.content = `<span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${score})</span>分`
          }else{
            this.content = this.questionData.titleContent
          }
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

    ...mapMutations('page',['pageData_edit_title']),

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

    changeContent(obj){
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)

      let height = tinyHeight
      this.maxHeight = height // 最大高度

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            titleContent:val,
            heightTitle:height,
            height:(curObj.height - curObj.heightTitle) + height
          },
          index:index,
        }

        this.pageData_edit_title(data)
      }
    }
  },
}
</script>

<style lang="less">
.answer_question_box.composition_box {
  padding: 10px 5px 5px 5px;
}
.Language_item_title {
  height: 37px;
  position: relative;
  line-height: 37px;
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

