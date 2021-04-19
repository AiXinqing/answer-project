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
        :readonly="readonly"
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
      v-if="tinymceHeight > 0"
    >
      <div
        class="content-info info_pLIst"
        :style="{
          height:tinymceHeight + 'px',
        }"
      >
          <!-- 富文本编辑区 -->
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            v-if="pageLayout.column == 3"
            :readonly="readonly"
            ref="tinymceBox"
          >
          </trigger-tinymce>
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            :readonly="readonly"
            ref="tinymceBox"
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
import { PAGE_HEIGHT } from '@/models/base'

import dragChangeHeight from '../questionContent/drag'
import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'

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
    },
    readonly: {
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
      page_height: PAGE_HEIGHT,
      strP:'</p>'
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
      let sum = Math.ceil((this.pageWidth - 23) / 4.8)
      let space = ''

      for(let x = 0; x < sum;x++){
          space += this.str
      }
      return space
    },

    questionInfo(){
      const {first,heightTitle,height,castHeight,content,rowHeight} = this.data
      let boxP = ''
      let Arr = []

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
      this.rowsData.forEach((e,index) =>{
        let classS = content.HorizontalLine ? 'outline':''
        if(first && index == 0 || heightTitle == (height - castHeight) && index == 0){
          pList += boxP
        }else{

          pList += `<p data-i="p" class="optional-item-list ${classS}"><a> ${this.spaceStr} </a></p>`
        }
        Arr.push(rowHeight)
      })
      return  {data:pList,Arr:Arr}
    },

    editorDetail() {
      const {editorContent,segmented,segmentedArr,first,id,MarginHeight,operatTinymce,rowHeight,height,rowHeightArr} = this.questionData

      // 判断是否进行过富文本编辑
      if(operatTinymce[segmented] == undefined){
        editorContent[segmented] = this.questionInfo.data
        rowHeightArr[segmented] = this.questionInfo.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }else{
        if(editorContent[segmented] != undefined){
          let currentContentArr = []
          // 初始参数----------------------------------------------------------------------------------------
          // 当前内容框能容纳高度
          let maxLong = first ? segmentedArr[segmented]:Math.floor((this.page_height - 20 - MarginHeight) / rowHeight)
          let accommodateHeight = maxLong * rowHeight

          // 差值
          let difference = 0

          // 差值长度
          let differenceLong = 0

          // 数组中-当前位置之后一位
          let nextSegmented = segmented + 1
          // 溢出行高
          let overflowArr = []

          // 内容高度小于内容框高度差值
          let impairment = 0
          let impairmentLong = 0

          // 当前内容数组
          currentContentArr = this.convertArray(editorContent[segmented]).filter(item => item.indexOf(this.strP) != -1)

          // 当前富文本编辑后内容行高数组与容纳高度差值
          if(rowHeightArr[segmented] != undefined){

            rowHeightArr[segmented].forEach(val => {
                difference += val
                differenceLong = difference > accommodateHeight ? differenceLong + 1 : differenceLong + 0
            })
          }
          // 初始参数----------------------------------------------------------------------------------------

          // 富文本字符串

          let tinymceContent =''
          let extraContent = ''
          let overflowHeight = ''

          if(difference > accommodateHeight){
            //高度溢出
            if(differenceLong > 0) {
                // 截取溢出的高度

                for(let a = 0; a < currentContentArr.length - differenceLong;a++){
                  if(currentContentArr[a] != undefined){
                    tinymceContent += currentContentArr[a]
                  }
                }
                // 赋值
                editorContent[segmented] = tinymceContent

                // 溢出内容
                for(let i = currentContentArr.length - differenceLong; i < currentContentArr.length;i++){
                  if(currentContentArr[i] != undefined){
                    extraContent += currentContentArr[i]
                  }
                }

                if(editorContent[nextSegmented] == undefined){
                  editorContent[nextSegmented] = extraContent
                }else{
                  editorContent[nextSegmented] = extraContent + editorContent[nextSegmented]
                }
                // 富文本编辑标识
                operatTinymce[nextSegmented] = 1
                // 截取溢出行高追加进下一个数组
                overflowArr = rowHeightArr[segmented].slice(rowHeightArr[segmented].length - differenceLong, rowHeightArr[segmented].length)
                overflowHeight = 0
                //获取溢出高度
                overflowArr.forEach(val => {
                  overflowHeight += val
                })


                if(rowHeightArr[nextSegmented] != undefined){
                  rowHeightArr[nextSegmented] = overflowArr.concat(rowHeightArr[nextSegmented])
                }else {
                  rowHeightArr[nextSegmented] = overflowArr
                }
                // 更新行高数组
                rowHeightArr[segmented] = rowHeightArr[segmented].slice(0, rowHeightArr[segmented].length - differenceLong)

                // 更新数组
                this.pageData_editorStr({
                  id:id,
                  content:editorContent,
                  height:height + overflowHeight, // 总高度 = 总 - 超出高度 + 超出行总高度
                  rowHeightArr:rowHeightArr,
                  operatTinymce:operatTinymce
                })
            }

          }else{
            //内容低于内容高度
           //内容框高度 - 内容
              impairment = accommodateHeight - difference

              if(rowHeightArr[nextSegmented] != undefined && impairment > 0){

                rowHeightArr[nextSegmented].forEach(val => {
                    impairment -= val
                    impairmentLong = impairment >= 0 ? impairmentLong + 1 : impairmentLong + 0
                })
              }

              if(impairmentLong > 0 && segmented < editorContent.length){
                if(editorContent[nextSegmented] != undefined){

                  let nextContentArr = this.convertArray(editorContent[nextSegmented])

                  //追加差值
                  for(let a = 0; a < impairmentLong;a++){
                    if(nextContentArr[a] != undefined){
                      extraContent += nextContentArr[a]
                    }
                  }
                  editorContent[segmented] += extraContent
                  rowHeightArr[segmented] = rowHeightArr[segmented].concat(rowHeightArr[nextSegmented].slice(0,impairmentLong))


                  //减去不给当前内容的字符
                  tinymceContent = ''
                  for(let i = impairmentLong; i < nextContentArr.length;i++){
                    if(nextContentArr[i] != undefined){
                      tinymceContent += nextContentArr[i]
                    }
                  }

                  editorContent[nextSegmented] = tinymceContent
                  rowHeightArr[nextSegmented] = rowHeightArr[nextSegmented].slice(impairmentLong, rowHeightArr[nextSegmented].length)

                  operatTinymce[nextSegmented] = 1
                  // 更新数组
                  this.pageData_editorStr({
                    id:id,
                    content:editorContent,
                    rowHeightArr:rowHeightArr,
                    operatTinymce:operatTinymce
                  })
                }
              }
          }
        }
      }
      return editorContent[segmented]
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }

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
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_editorStr',]),

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
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj
      let tinyContentH = tinyHeight - 7

      const {id,first,height,MarginHeight,castHeight,heightTitle,segmented,editorContent,operatTinymce,rowHeightArr,segmentedArr,rowHeight} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)

       // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)
      let nextSegmented = segmented + 1
      let tinyMceRowHeight = []
          tinymcePList.forEach((itme,index) => {
              tinyMceRowHeight.push(index == 0 ? itme.offsetHeight - 7 : itme.offsetHeight)
          })
      rowHeightArr[segmented] = tinyMceRowHeight
      //-------------------------------------------------------------------------

      // 富文本编辑后内容赋值
      editorContent[segmented] = val
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      // 计算高度
      let difference = 0

      let tinyHeights = 0
      let less = 0 // 用于判断内容低于内容框高度
      if(operatTinymce[segmented]){
        let maxLong = first ? segmentedArr[segmented]:Math.floor((this.page_height - 20 - MarginHeight) / rowHeight)
        let accommodateHeight = maxLong * rowHeight

        rowHeightArr[segmented].forEach(val => {
              difference += val
              tinyHeights = difference > accommodateHeight ? tinyHeights + val : tinyHeights + 0
        })
        if(difference < accommodateHeight){
          //内容框高度 - 内容
            let  impairment = accommodateHeight - difference
                  less = impairment

              if(rowHeightArr[nextSegmented] != undefined && impairment > 0){
                rowHeightArr[nextSegmented].forEach(val => {
                    impairment -= val
                    tinyHeights = impairment >= 0 ? tinyHeights - val : tinyHeights + 0
                })
              }
        }
      }

      let heights = first ? tinyContentH + heightTitle + MarginHeight : tinyContentH + MarginHeight
      this.tinymceHeight =  tinyContentH  // 最大高度
      let contentHeight = (height - castHeight) + heights

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            editorContent:editorContent,
            height: tinyHeights == 0 && less == 0 ? contentHeight : height + tinyHeights,
            selectStr:segmented, // 判断当前编辑对象所在位置
            operatTinymce:operatTinymce, // 是否操作
            rowHeightArr: rowHeightArr,
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }
    },

  },
}
</script>


<style lang="less" >

.info_pLIst {
  p{
    &:first-child{
      padding-top: 7px !important
    }
  }
}

.question-container{
  margin-top: 10px;

  .answer_question_box {
    height: 35px;
    line-height: 35px;
    padding: 0 15px ;
    position: relative;
    margin: 0;
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