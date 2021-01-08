<template>
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first && data.borderTop == undefined || data.borderTop == 0"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        :max-height="maxHeight"
        ref="tinyMCE"
      />
    </div>

    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <drag-change-height
      :question="questionData"
      @height-resize="handleResize($event)"
      :style="{
        'height':minHeight  + 'px',
      }"
    >
      <div
        class="content-info"
        :style="{
          height:tinymceHeight + 'px'}"
      >
          <!-- 富文本编辑区 -->
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            v-if="pageLayout.column == 3"
          >
          </trigger-tinymce>
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            v-else
          >
          </trigger-tinymce>
      </div>
    </drag-change-height>

  </div>
</template>

<script>
import { mapState, mapMutations ,mapGetters} from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

import dragChangeHeight from '../questionContent/drag'
import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'

export default {
  components: {
    dragChangeHeight,
    tinyVue,
    triggerTinymce
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
    previewContent: {
      type: Boolean,
      default: false
    },
    previewWidth:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      promptTitle: '请考生用2B铅笔将所选题目对应题号涂黑，答题区域只允许选择一题，如果多做，则按所选做的前一题计分。',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      tinymceHeight:28,
      str:'&nbsp;',
      pageLayout: this.contentData.pageLayout,
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    minHeight(){
      const {first,heightTitle,castHeight} = this.questionData
      return  first ? castHeight - heightTitle : castHeight
    },

    topicData () {
      return this.contentData.group.map(question => question.childGroup).flat()
    },

    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.questionData.rows; i++) {
        Arr.push(i)
      }
      return Arr
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 23 : this.previewWidth - 63
    },

    spaceStr () {
      let sum = Math.ceil((this.pageWidth - 23) / 5)
      let space = ''

      for(let x = 0; x < sum;x++){
          space += this.str
      }
      return space
    },

    editorDetail() {
      // 内容详情编译
      const {first,heightTitle,height,castHeight,content,editorContent,segmented,segmentedArr,id} = this.data

      let boxP = ''
      if(first || heightTitle == (height - castHeight)){
        let spans = ''
        this.topicData.forEach(item =>{
          spans += `<span class="digital">${item.topic}</span>`
        })
        boxP = `<p data-i="p" class="answer_question_box optional_box">
                  <span class="topic_number_box">
                    <span class="black_icon">&nbsp;</span>${spans}<span class="black_icon">&nbsp;</span>
                  </span>
                  <span class="number-info">
                    <span>我选的题号（1分）</span>
                  </span>
                </p>`
      }
      let pList = ''
      this.rowsData.forEach(() =>{
        let classS = content.HorizontalLine ? 'outline':''
        pList += `<p data-i="p" class="optional-item-list ${classS}"><a> ${this.spaceStr} </a></p>`
      })

      let questionInfo = `${boxP}${pList}`

      let strContent = ''
      let prevStr = ''
      let editorStrContent = '' // 字符串内容综合
      let difference = 0 // 上级小于容器高度差值
      let differenceStr = '' // 上级小于容器高度差值

      if(editorContent[segmented] != undefined){
        let convertArray = this.convertArray(editorContent[segmented])
        // 判断长度
        let long = segmentedArr[segmented] != undefined ? segmentedArr[segmented]:convertArray.length
            for(let i = 0; i < long;i++){
              if(convertArray[i] != undefined){
                strContent += convertArray[i]
              }
            }
            if(convertArray.length < long){
              difference = long - convertArray.length
              if(editorContent[segmented + 1] != undefined){
                let nextArray = this.convertArray(editorContent[segmented + 1])
                for(let i = 0; i < difference;i++){
                  if(nextArray[i] != undefined){
                    differenceStr += nextArray[i]
                  }
                }
                strContent = strContent + differenceStr
              }
            }
          // 分页判断上一部分是否剩余字符
      }
      editorStrContent = prevStr  + strContent
      if(!first){
        let prevArr = this.convertArray(editorContent[segmented - 1])
        if(editorContent[segmented - 1] != undefined){

          if(prevArr.length > segmentedArr[segmented - 1]){
            for(let i = segmentedArr[segmented - 1] ; i < prevArr.length;i++){
              if(prevArr[i] != undefined){
                prevStr += prevArr[i]
              }
            }
            editorContent[segmented] = prevStr + editorContent[segmented]
            this.pageData_editorStr({id:id,content:editorContent})
          }
        }
        editorStrContent = prevStr  + strContent
        if(editorContent[segmented] != undefined){
          let curArr = this.convertArray(editorContent[segmented])
          if(prevArr.length < segmentedArr[segmented - 1]){
            let index = segmentedArr[segmented - 1] - prevArr.length
            for(let i = index ; i < curArr.length;i++){
                if(curArr[i] != undefined){
                  prevStr += curArr[i]
                }
              }
              editorContent[segmented] = prevStr
              this.pageData_editorStr({id:id,content:editorContent})
          }
          editorStrContent = prevStr
        }
      }
      // editorContent == '' ? `${boxP}${pList}` : editorContent
      return  editorStrContent == '' ? questionInfo : editorStrContent
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        console.log(this.questionData)
        const {castHeight,heightTitle,content,titleContent,first} = this.questionData
        this.tinymceHeight = first ? castHeight - heightTitle : castHeight
        this.content = ''
        let {number,topicName} = this.contentData

        if(!titleContent){
          this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${content.scoreTotal})</span>分</p>`
        }else{
          this.content = titleContent
        }
        this.pageLayout = this.contentData.pageLayout
      }
    },

  },

  methods: {
    ...mapMutations('page', ['pageData_del','pageData_edit']),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor () {
      this.isEditor = true
    },
    subTopic_numberAnswerEdit () {
      this.$emit('current-question-optional-edit', this.contentData, this.data.id)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.subTopic_already_del(this.topicData)
        this.topicData.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }

    },
    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        this.pageData_edit({
            ...questionObj,
            height:height,
          })

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

    },
    tinymceChangeFunc(obj){
      const {val,tinyHeight} = obj
      console.log(tinyHeight)

      const {id,first,height,MarginHeight,castHeight,heightTitle,segmented,editorContent} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)
      editorContent[segmented] = val

      let heights = first ? tinyHeight + heightTitle + MarginHeight : tinyHeight + MarginHeight
      this.tinymceHeight =  tinyHeight  // 最大高度

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            editorContent:editorContent,
            height:(height - castHeight) + heights,
            strLength:length,
            selectStr:segmented // 判断当前编辑对象所在位置
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }
    },

    convertArray(oldStr) {
      //转换富文本编辑的内容为数组
      if(oldStr != undefined){
        let arr = oldStr.split(/[(\r\n)\r\n]+/) // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '\n')
                      .filter(item => item !='')
        return arr
      }
      //转换富文本编辑的内容为数组
    },
  },
}
</script>


<style lang="less" >
.question-container{
  margin-top: 10px;

  .answer_question_box {
    height: 35px;
    line-height: 35px;
    padding: 0 15px ;
    position: relative;
    margin: 0;
    padding-top: 7px !important;
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
    margin: 0 0;
    line-height: 35px;
    width: calc(100% - 30px);
    margin-left: 15px;
    padding: 0 3mm;

  &.outline{
    a{
      border-bottom: 1px solid #888;
    }
  }

  a{
    width: 100%;
  }
}
.number-info {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  position: relative;
}
.topic_number_box {
  height: 20px;
  position: absolute;
  line-height: 20px;
  right: 15px;
  top: 0;

  span {
    display: inline-block;
    margin-left: 5px;
  }
  .black_icon {
    width: 18px;
    height: 8px;
    background-color: #000;
    display: inline-table;
    overflow: hidden;
    line-height: 8px;
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