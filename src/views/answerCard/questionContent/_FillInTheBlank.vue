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
        :readonly="readonly"
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
import { mapState, mapMutations, mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { PAGE_HEIGHT } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/_useArrayCutHook'

import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'
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
    },
    readonly: {
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
      str:'&ensp;',
      aWidth:1,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterList']),
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    airStr(){
      return  this.previewContent ? 2 : 3
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 23 : this.previewWidth - 63
    },

    topicBox () {
      return this.data.group.map(question => question.childGroup).flat()
    },

    strBox(){
      let num = Math.ceil(Math.ceil(this.pageWidth /this.data.rows) / 9)
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
          let sLeng = 0

          if(topic.lid){
            let li1 = topic.smallTopic == 1 && topic.spaceNum == 1 ? topic.topic : ''
            let li2 = topic.spaceNum <= 1 ? `(${topic.smallTopic})` : ''
            sLeng = li2 != '' ? 1 : 0
            spanBox = `${li1}${li2}`
          }else{
            let li3 = !topic.spaceNum || topic.spaceNum == 1 ? topic.topic : ''
            spanBox = `${li3}`
          }
          // + this.airStr

          let numLong = (spanBox.length - sLeng) / 2 + this.airStr
          let spaceStr = ''
          for(let x = 0; x < this.strBox.length - numLong ;x++){
            spaceStr +=  this.strBox[x]
          }

          aList += `&ensp;${spanBox}&ensp; <a class="subtopic_a" style="flex:${subtopic.length >= 4 ? 1:0}">${spaceStr}</a>`
        })
      questionInfo +=  `<p class="content-row">${aList}</p>
      `// 需要空一行回车，这样才能筛选行数，不能删除
      Arr.push(rowHeight)
    })
      return {data:questionInfo,Arr:Arr}
    },

    editorDetail(){
      const {
        editorContent,segmented,id,operatTinymce,
        rowHeightArr,
      } = this.questionData

      // 判断是否进行过富文本编辑
      if (operatTinymce[segmented] == undefined) {
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

        if(this.$refs.tinymceBox != undefined){
          this.$refs.tinymceBox.editorHtml()
        }
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
      const {segmented,operatTinymce} = this.questionData

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)

      let tinyMceRowHeight = []
          tinymcePList.forEach((itme,index) => {
            tinyMceRowHeight.push(index == 0 ? itme.offsetHeight - 7 : itme.offsetHeight)
          })

      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1

      this.tinymceHeight =  tinyContentH  // 最大高度

      this.editConten(this.questionData,tinyHeight,val,tinyMceRowHeight)
    },

    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){

      const {
        editorContent,segmented,first,id,MarginHeight,operatTinymce,rowHeight,
        rowHeightArr,remainderHeight,heightTitle,height,castHeight
      } = eidtObj
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = [],
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
              let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight,marginTop:7 })
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
                let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight,marginTop:7 })
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
                if(first && segmented == 0){
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
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.content-info{
  overflow: auto;
}
// .question-item{
//   margin-top: 10px;
// }
#question-title{
  overflow: auto;
  margin-bottom: 10px;
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

