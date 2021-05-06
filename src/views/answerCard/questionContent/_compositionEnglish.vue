<template>
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first"
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
        <span class="layui-btn layui-btn-xs" @click="compositionEnglishEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <drag-change-height
      :question="questionData"
      v-if="data.heightTitle != data.castHeight"
      @height-resize="handleResize($event)"
    >

      <div class="answer_question_box composition_box english content-info"
        :style="{
          height:tinymceHeight + 'px'}"
      >
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
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/useArrayCutHook'
import { PAGE_HEIGHT } from '@/models/base'

import tinyVue from '@/components/tinymce'
import dragChangeHeight from '../questionContent/drag'
import triggerTinymce from '@/components/tinymce/triggerEditor'
export default {
  components: {
    tinyVue,
    dragChangeHeight,
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
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      pageLayout: this.contentData.pageLayout,
      tinymceHeight: 28,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
    }
  },
  computed: {
    ...mapState('page', ['pageData']),

    strLong () {
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },

    topicData () {
      return ''
    },

    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.data.rows; i++) {
        Arr.push(i)
      }
      return Arr
    },

    questionInfo(){
      const {rows,rowHeight,content,first} = this.questionData
      let Arr = []
      let questionInfo = ''
      let str = ' &ensp;'

      for (let i = 0; i <= rows - 1; i++) {
        if(i == 0 && first){
          questionInfo += `<p class="compositionEnglish_item"><a v-if="i == 0" class="pre-t5">${content.topic}.</a><a class="line-style">${str}</a></p>
                        `
        }else{
          questionInfo += `<p class="compositionEnglish_item"><a class="line-style">${str}</a></p>
                          `
        }
        Arr.push(rowHeight)
      }

      return {data:questionInfo,Arr:Arr}
    },

    editorDetail(){
      const {editorContent,segmented,id,operatTinymce,rowHeightArr} = this.questionData
      // 判断是否进行过富文本编辑
      if(operatTinymce[segmented] == undefined){
        editorContent[segmented] = this.questionInfo.data
        rowHeightArr[segmented] = this.questionInfo.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }
      return editorContent[segmented]
    }

  },
  watch: {

    contentData: {
      immediate: true,
      handler () {
        this.pageLayout = this.contentData.pageLayout
      },
    },

    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        this.content = ''
        const {topicName,number,score} = this.contentData
        const {first,castHeight,heightTitle,titleContent} = this.questionData

          if(!titleContent){
            this.content = `<span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${score})</span>分`
          }else{
            this.content = titleContent
          }

          this.tinymceHeight = first ? castHeight - heightTitle - 2 : castHeight - 2

          if(this.$refs.tinymceBox != undefined){
            this.$refs.tinymceBox.editorHtml()
          }
      }
    },

  },

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_id_clean',
      'pageData_edit',
      'pageData_editorStr',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page',['pageData_edit_title']),

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

    tinymceChangeFunc (obj) {
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj

      // 首个p向下top7px
      let tinyContentH = tinyHeight - 13
      // 参数
      const {segmented,operatTinymce} = this.questionData

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)

      let tinyMceRowHeight = []
          tinymcePList.forEach((itme,index) => {
            let height = itme.offsetHeight
            if(index == 0){
              height -= 7
            }else if(index == tinymcePList.length - 1){
              height -= 5
            }
            tinyMceRowHeight.push(height)
          })
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      this.tinymceHeight =  tinyContentH  // 最大高度

      this.editConten(this.questionData,tinyHeight,val,tinyMceRowHeight)
    },

    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){

      let tinymceEditObj = JSON.parse(JSON.stringify(eidtObj))

      const {
        editorContent,segmented,first,id,MarginHeight,operatTinymce,rowHeight,
        rowHeightArr,remainderHeight,heightTitle,height,castHeight
      } = tinymceEditObj
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = [],
          // 内容高度小于内容框高度差值
          // impairment = 0,
          // 富文本字符串
          overflowHeight = 0,
          currentContentArr = []

          currentContentArr = this.convertArray_p(val).filter(item => item.indexOf(this.strP) != -1)

            //计算容器容纳高度
          if(first && segmented == 0){
            containerHeight = (remainderHeight - 20 - MarginHeight - heightTitle)
          }else{
            containerHeight = this.page_height - 20 - MarginHeight
          }
          // 计算当前容器内容高度
          tinyMceRowHeight.forEach(num =>{
            difference += num
            if (num >= rowHeight && !(num % rowHeight == 0)) {
              difference += 13
            }
            if(containerHeight < difference){
              differenceLong += 1
            }
          })

      // 下一级长度
      let RemainingHeight =  this.page_height - 20 - MarginHeight

      if(editorContent[segmented] != undefined){

        let editorArr = editorContent.map( item => {
          return this.convertArray_p(item).filter(ele => ele.indexOf(this.strP) != -1)
        }).map((ele,index) =>{
          return ele.map((item,i) => {
            return {str:item,height: rowHeightArr[index][i]}
          })
        })

        let currentEditorContent = currentContentArr.map((item,index) => {
          return {str:item,height: tinyMceRowHeight[index]}
        })

        if(differenceLong > 0){
          // 截取溢出的高度

          let testH =  (remainderHeight - 20 - MarginHeight - heightTitle)
          let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight })
          let setArrContent1 = textCo.setArr(segmented, currentEditorContent)

          setArrContent = setArrContent1.map(item => {
            let strContent = ''
              item.forEach(element => {
              strContent+= element.str
            })
            return strContent
          })
          overflowArrs = setArrContent1.map(item => {
            return item.map(ele => ele.height)
          })
          operatTinymceArr = overflowArrs.map(() => {return 1})

          let nextHeight = 0
              overflowArrs.forEach((ele,index) => {
                if(index != 0 && index < overflowArrs.length - 1){
                  let nums = 0
                  ele.forEach(num => {
                    nums += num
                    nextHeight += num
                  })
                  if(nums < RemainingHeight) {
                    let numLong = Math.ceil((RemainingHeight - nums) / rowHeight)
                    nextHeight += numLong * rowHeight
                  }
                }else if(index == overflowArrs.length - 1){
                  ele.forEach(num => {
                    nextHeight += num
                  })
                }
              })
          overflowHeight = (remainderHeight - 20 - 12) + nextHeight
        }else{
          if(containerHeight > difference && editorContent[nextSegmented] != undefined){
            //内容低于内容高度
            //内容框高度 - 内容
            containerHeight = (remainderHeight - 20 - MarginHeight - heightTitle)

            let testH =  (remainderHeight - 20 - MarginHeight - heightTitle)
            let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight })
            let setArrContent1 = textCo.setArr(segmented, currentEditorContent)

              setArrContent = setArrContent1.map(item => {
                let strContent = ''
                item.forEach(element => {
                  strContent+= element.str
                })
                return strContent
              })
              overflowArrs = setArrContent1.map(item => {
                return item.map(ele => ele.height)
              })
              operatTinymceArr = overflowArrs.map(() => {return 1})
            let nextHeight = 0
              overflowArrs.forEach((ele,index) => {
                if(index != 0 && index < overflowArrs.length - 1){
                  let nums = 0
                  ele.forEach(num => {
                    nums += num
                    nextHeight += num
                  })
                  if(nums < RemainingHeight) {
                    let numLong = Math.ceil((RemainingHeight - nums) / rowHeight)
                    nextHeight += numLong * rowHeight
                  }
                }else if(index == overflowArrs.length - 1){
                  ele.forEach(num => {
                    nextHeight += num
                  })
                }
              })

            overflowHeight = (remainderHeight - 20 - 12) + nextHeight
          }else{
            editorContent[segmented] = val
            rowHeightArr[segmented] = tinyMceRowHeight
            if(first  && segmented == 0){
              overflowHeight = tinyHeight + heightTitle + 4
            }else{
              overflowHeight = height - castHeight + tinyHeight
            }
          }
        }
      }
      if(index > -1){
        let curObj = this.pageData[index]
        let data = {
          question:{
            ...curObj,
            editorContent: setArrContent.length ? setArrContent : editorContent,
            operatTinymce:operatTinymceArr.length ? operatTinymceArr : operatTinymce, // 是否操作
            rowHeightArr: overflowArrs.length ? overflowArrs : rowHeightArr,
            height:overflowHeight
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }
    },

    convertArrayConten (oldStr) {
      //转换富文本编辑的内容为数组
      if(oldStr != undefined){
        let arr = oldStr.split('</p>') // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '</p>')
                  .filter(item => item !='')
            console.log(arr)
        return arr
      }
      //转换富文本编辑的内容为数组
    }
  },
}
</script>


<style lang="less" >
.answer_question_box {
  &.composition_box {

    padding-bottom: 5px;
    &.english{
      padding: 0 0;
      p{
        margin: 0 15px;
      }
    }
  }

}
.compositionEnglish_item {
  width: calc(100% - 30px);
  height: 35px;
  line-height: 35px;
  display: flex;
  margin: 0;

  &:first-child{
    margin-top: 7px;
    padding-top: 7px
  }

  &:last-child{
    padding-bottom: 5px
  }

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

