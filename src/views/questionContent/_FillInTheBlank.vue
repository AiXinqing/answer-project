<template>
  <!-- 填空题 -->
  <div class="question-info">
    <div
      id="question-title"
      ref="tinyeditor"
      v-if="questionData.first && questionData.borderTop == undefined"
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
        <span
          class="layui-btn layui-btn-xs"
          @click="subTopic_numberFillEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delfillTheBlank">删除</span
        >
      </div>
    </div>
    <drag-change-height
      :question="questionData"
      @height-resize="handleResize($event)"
    >
      <div class="content-info"
        :style="{
          height:tinymceHeight + 'px'}"
      >
        <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          v-if="pageLayout.column == 3"
          class="fillTinymce"
          ref="tinymceBox"
        >
        </trigger-tinymce>
        <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          class="fillTinymce"
          ref="tinymceBox"
          v-else
        >
        </trigger-tinymce>
      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { PAGE_HEIGHT } from '@/models/base'

import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'


export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight
  },
  props: {
    contentData: {
      type: Object,
      default: () => { },
    },
    questionData: {
      type: Object,
      default: () => { },
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
      data: {},
      isEditor: false,
      cotent: '',
      options: QUESTION_NUMBERS.map((label, value) => ({ label, value })),
      quilleditor: false,
      pageLayout: this.contentData.pageLayout,
      richText: '',
      maxHeight: 28,
      tinymceHeight: 28,
      str:'&nbsp;',
      aWidth:1,
      page_height: PAGE_HEIGHT,
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterList']),
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    minHeight () {
      const { rowHeight, showData, MarginHeight, height, castHeight } = this.questionData
      return castHeight >= height ? rowHeight * showData.length + MarginHeight : 0
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 23 : this.previewWidth - 63
    },

    topicBox () {
      return this.data.group.map(question => question.childGroup).flat()
    },

    strBox(){
      let num = Math.ceil(Math.ceil(this.pageWidth /this.data.rows) / 5)
      let strBox = []
          for(let x = 0; x < num;x++){
            strBox.push(this.str)
          }
      return strBox
    },

    questionInfo(){
      const {showData,rowHeight} = this.questionData
      let questionInfo = ''
      let Arr = []
      showData.forEach(subtopic =>{
        let aList = ''
        subtopic.forEach((topic) =>{
          let spanBox = ''

          if(topic.lid){
            let li1 = topic.smallTopic == 1 && topic.spaceNum == 1 ? topic.topic : ''
            let li2 = topic.spaceNum <= 1 ? topic.smallTopic : ''
            spanBox = `${li1}${li2}`
          }else{
            let li3 = !topic.spaceNum || topic.spaceNum == 1 ? topic.topic : ''
            spanBox = `${li3}`
          }
          let numLong = spanBox.length * 2 + 4
          let spaceStr = ''
          for(let x = 0; x < this.strBox.length - numLong ;x++){
            spaceStr +=  this.strBox[x]
          }
          aList += `&nbsp;&nbsp;${spanBox}&nbsp;&nbsp;<a class="subtopic_a" style="flex:${subtopic.length >= 4 ? 1:0}">${spaceStr}</a>`
        })
      questionInfo +=  `<p class="content-row">${aList}</p>
      `// 需要空一行回车，这样才能筛选行数，不能删除
      Arr.push(rowHeight)
    })
      return {data:questionInfo,Arr:Arr}
    },

    editorDetail(){
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

          // 当前内容数组
          let currentContentArr = this.convertArray(editorContent[segmented])

          //高度溢出
          if(differenceLong > 0 && differenceLong != 0) {

              // 截取溢出的高度
              for(let a = 0; a < currentContentArr.length - differenceLong;a++){
                if(currentContentArr[a] != undefined){
                  tinymceContent += currentContentArr[a]
                }
              }
              // 赋值
              editorContent[segmented] = tinymceContent
              // 更新行高值
              rowHeightArr[segmented] = rowHeightArr[segmented].slice(0, rowHeightArr[segmented].length - differenceLong)


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

              // 更新数组
              this.pageData_editorStr({
                id:id,
                content:editorContent,
                height:height + overflowHeight, // 总高度 = 总 - 超出高度 + 超出行总高度
                rowHeightArr:rowHeightArr,
                operatTinymce:operatTinymce
              })
          }
        }
      }

      return editorContent[segmented]

      // const {editorContent,segmented,segmentedArr,first,id,MarginHeight,operatTinymce,rowHeight,tinymceCHeight,height,heightArr} = this.questionData
      // // 富文本编辑后内容
      // let tinymceContent = ''
      // // 溢出多余内容
      // let extraContent = ''
      // // 数组中-当前位置之后一位
      // let nextSegmented = segmented + 1

      // // 计算超出高度的行数
      // let sumPLong = 0
      // // 内容行高度
      // let contentArrH = []
      // let heightArrs = []
      // let overflowHeight = 0 // 溢出高度

      // if(heightArr.length){
      //   contentArrH = contentArrH.concat(heightArr)
      // }

      // if(editorContent[segmented] != undefined){
      //   //第一次赋值，内容高度未超出内容框，未低于内容框

      //   if(operatTinymce[segmented] == undefined ) {
      //     tinymceContent = editorContent[segmented] + this.questionInfo
      //     // 变更后改变数据

      //     editorContent.splice(segmented,1,tinymceContent)
      //     this.pageData_editorStr({id:id,content:editorContent,operatTinymce:segmented})
      //   }else{
      //     tinymceContent = editorContent[segmented]
      //   }

      //   // 当前内容框能承受的最高长度
      //   let maxLong = first ? segmentedArr[segmented]:Math.floor((this.page_height - 20 - MarginHeight) / rowHeight)

      //   // 计算超出长度行数----------------------------------------------------------------------

      //   if(this.tinymceId[segmented] != undefined){
      //     let tinymcePList = document.querySelectorAll(`#${this.tinymceId[segmented]} p`)
      //     let Arr1 = []
      //         tinymcePList.forEach((itme,index) => {
      //             Arr1.push(index == 0 ? itme.offsetHeight - 7 : itme.offsetHeight)
      //         })

      //         contentArrH = contentArrH.concat(Arr1)

      //         contentArrH.forEach((itme,index) => {
      //             sumPLong = itme > rowHeight && index < tinymcePList.length - 1 ? sumPLong + (itme - rowHeight) / rowHeight :
      //                             itme > rowHeight && index == tinymcePList.length - 1 ? sumPLong + 1 :
      //                                 index >= segmentedArr[segmented] ? sumPLong + 1 : sumPLong + 0
      //         })
      //         // 截取溢出的行
      //         heightArrs = contentArrH.slice(contentArrH.length - sumPLong, contentArrH.length)
      //         // 溢出行的总高
      //         heightArrs.forEach(item =>{
      //           overflowHeight += item
      //         })
      //   }

      //  // 计算超出长度行数----------------------------------------------------------------------

      //   // 当前内容数组
      //   let currentContentArr = this.convertArray(tinymceContent)

      //   let tinymceCLong = tinymceCHeight[segmented] / rowHeight

      //   //内容溢出处理---------------------------------------------------------

      //   if(tinymceCLong > maxLong){
      //     // 当前内容框显示内容
      //     tinymceContent = ''
      //     for(let a = 0; a < currentContentArr.length - sumPLong;a++){
      //       if(currentContentArr[a] != undefined){
      //         tinymceContent += currentContentArr[a]
      //       }
      //     }

      //     editorContent.splice(segmented, 1, tinymceContent)

      //     // 溢出内容
      //     for(let i = currentContentArr.length - sumPLong; i < currentContentArr.length;i++){
      //       if(currentContentArr[i] != undefined){
      //         extraContent += currentContentArr[i]
      //       }
      //     }

          // if(editorContent[nextSegmented] == undefined){
          //   editorContent.splice(nextSegmented, 1, extraContent)
          // }else{
          //   editorContent.splice(nextSegmented, 1, extraContent + editorContent[nextSegmented])
          // }

      //     tinymceCHeight[segmented] = maxLong * rowHeight

      //     //更新数组对象参数值不刷新
      //     this.pageData_editorStr({
      //       id:id,
      //       content:editorContent,
      //       height:height - sumPLong * rowHeight + overflowHeight, // 总高度 = 总 - 超出高度 + 超出行总高度
      //       heightArr:heightArrs,
      //       tinymceCHeight:tinymceCHeight
      //     })
      //       sumPLong = 0

      //   }
      //   //内容溢出处理--------------------------------------------------------------------------------end

      //   // 内容低于内容框高度


      //   if(tinymceCLong < maxLong && editorContent[nextSegmented] != undefined){
      //     // 计算富文本与最大高度之间差值
      //     let difference = maxLong * rowHeight -  tinymceCHeight[segmented]
      //     let differenceLong = 0
      //     overflowHeight = 0
      //     heightArr.forEach(val =>{
      //       difference -= val
      //       differenceLong = difference >= 0 ? differenceLong + 1: differenceLong + 0
      //       // 差值高度
      //       overflowHeight += val
      //     })

      //     if(differenceLong > 0){
      //       let nextContentArr = this.convertArray(editorContent[nextSegmented])
      //           //减去不给当前内容的字符
      //           tinymceContent = ''
      //           for(let i = differenceLong; i < nextContentArr.length - 1;i++){
      //             if(nextContentArr[i] != undefined){
      //               tinymceContent += nextContentArr[i]
      //             }
      //           }
      //           editorContent[nextSegmented] = tinymceContent

      //           //计算出差值
      //           tinymceContent = ''
      //           for(let a = 0; a < differenceLong;a++){
      //             if(nextContentArr[a] != undefined){
      //               extraContent += nextContentArr[a]
      //             }
      //           }
      //           tinymceContent = editorContent[segmented] + extraContent
      //           editorContent[segmented] = tinymceContent
      //           this.pageData_editorStr({id:id,content:editorContent,height: height + overflowHeight})
      //     }

      //   }
      // }

      // //渲染数据
      // // console.log(tinymceContent)
      // return tinymceContent == '' ? this.questionInfo : tinymceContent
    }
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData,
        }
        this.pageLayout = this.contentData.pageLayout
      },
    },

    questionData: {
      immediate: true,
      handler () {
        this.content = ''
        let { number, topicName, scoreTotal } = this.data

        const {first,castHeight,heightTitle,titleContent} = this.questionData

        if (!titleContent) {
          this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</p>`
        } else {
          this.content = titleContent
        }
        this.tinymceHeight = first ? castHeight - heightTitle - 2 : castHeight - 2
      }
    },

    pageWidth:{
      immediate: true,
      handler () {
        this.aWidth = this.pageWidth /this.data.rows
      }
    }

  },
  mounted () {
  },

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_editorStr',
    ]),
    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),
    ...mapMutations('page', ['pageData_edit_title']),

    delfillTheBlank () {
      // 删除大题-小题数
      let { id } = this.questionData
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.subTopic_already_del(this.topicBox)
        this.topicBox.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }
    },
    subTopic_numberFillEdit (id) {
      this.$emit('current-question-fill-edit', id)
    },
    hanldeEditor () {
      this.isEditor = true
    },


    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if (index > -1) {
        let questionObj = this.pageData[index]

        this.pageData_edit({
          ...questionObj,
          height: isNaN(height) ? questionObj.height : height,
        })

      }
    },

    //转换富文本编辑的内容为数组

    convertArray(oldStr) {
      if(oldStr != undefined){
        let arr = oldStr.split(/[(\r\n)\r\n]+/) // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '\n')
                      .filter(item => item !='')
        return arr
      }
    },
    //转换富文本编辑的内容为数组

    changeContent (obj) {
      const {val,tinyHeight} = obj

      const index = this.pageData.findIndex(question => question.id == this.questionData.id)

      let height = tinyHeight
      this.maxHeight = height // 最大高度

      if (index > -1) {
        let curObj = this.pageData[index]

        let data = {
          question: {
            ...curObj,
            titleContent: val,
            heightTitle: height,
            height: (curObj.height - curObj.heightTitle) + height,
          },
          index: index,
        }

        this.pageData_edit_title(data)
      }
    },
    tinymceChangeFunc (obj) {
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj

      // 首个p向下top7px
      let tinyContentH = tinyHeight - 7
      // 参数
      const {id,segmented,editorContent,operatTinymce,rowHeightArr,} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)
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

      this.tinymceHeight =  tinyContentH  // 最大高度

      if (index > -1) {
        let curObj = this.pageData[index]
        let data = {
          question: {
            ...curObj,
            editorContent: editorContent,
            selectStr:segmented, // 判断当前编辑对象所在位置
            operatTinymce:operatTinymce, // 是否操作
            rowHeightArr: rowHeightArr,
          },
          index: index,
        }

        this.pageData_edit_title(data)
      }
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.content-info{
  overflow: auto;
}
.question-item{
  margin-top: 10px;
}
#question-title{
  overflow: auto;
}
.question-title {
  margin-bottom: 10px;
  span {
    color: @font-333;
  }
}
.question-info{
  &:hover{
    .question_arrays{
      display: block;
    }
  }
}
.question_arrays {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: none;

  .question_editOrDel {
    position: absolute;
    right: 0;
    top: -10px;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
  .question-title img {
    max-width: 100%;
  }
  .question-title>div {
    padding: 10px 0 10px 10px;
    border: 1px solid #fff;
    p{margin: 0 0}
}
  .question-title:hover{
    div{border-color: @main}
  }
}

.content-row  {
  line-height: 35px;
  padding: 0 3mm 0 3mm;
  margin: 0;

  &:first-child{
    padding-top: 7px;
  }

  .subtopic_a{
    border-bottom: 1px solid #888;
  }

}
</style>
