<template>
  <!-- 解答题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="!data.orderFirst && data.first"
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
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #888' : 'none',
      }"
    >
      <div
        class="content-info"
        :style="{
          height: tinymceHeight - 0 + 'px'}"
      >
      <!-- height: data.first && data.orderFirst  ? tinymceHeight + 8 + 'px' : tinymceHeight - 2 + 'px'}" -->
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
import { mapState, mapMutations, mapGetters} from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { PAGE_HEIGHT } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/useArrayCutHook'

import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'

export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight,
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

    pageIndex:{
      type: Number,
      default: 0,
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
  data() {
    return {
      isEditor: false,
      data: {},
      content: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:28,
      tinymceHeight:28,
      str:'&ensp;',
      pageLayout: this.contentData.pageLayout,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
      tinymceEditObj:{}, // 用于区分富文本编辑后
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    topicData() {
      return this.contentData.group
    },
    rowsData() {
      let Arr = []
      for (let i = 1; i <= this.data.rows; i++) {
        Arr.push(i)
      }
      return Arr
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 20 : this.previewWidth - 40
    },

    questionInfo() {
      const {first,content,score,topic,rowHeight} = this.data

      let pList = ''
      let Arr = []
      this.rowsData.forEach((item,i) =>{

        let titleStr = `${topic}` + (content.ShowScore ? ` (${ score }分)` : '')

        let span1 =  i == 0 && first  ? `&ensp;${titleStr}&ensp; ` : ''

        let titleStrLong = i == 0 && first  ? titleStr.length * 10 : 0


        let spaceLong = Math.ceil((this.pageWidth - 22 - titleStrLong ) / 7)

        let spaceSum = ''
        for(let x = 0; x < spaceLong;x++){
            spaceSum += this.str
        }

        let span2 = content.HorizontalLine ? `<a class="line-style"> ${spaceSum} </a>` :`<a> ${this.str} </a>`
        if(content.HorizontalLine || i == 0){
          pList += `<p class="question_line">${span1}${span2}</p>` // 需要空一行回车，这样才能筛选行数，不能删除
        }
        else{
          pList += `<p class="question_line"></p>` // 需要空一行回车，这样才能筛选行数，不能删除
        }
        Arr.push(rowHeight)
      })

      return  {data:pList,Arr:Arr}
    },

    editorDetail(){
      const {
        editorContent,segmented,id,operatTinymce,
        rowHeightArr,
      } = this.tinymceEditObj

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
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }

        const {castHeight,heightTitle,orderFirst,titleContent,scoreTotal,first} = this.questionData
        this.tinymceHeight = orderFirst == 0 && first ? castHeight - heightTitle : castHeight

        this.content = ''
        let {number,topicName} = this.contentData

        if(!titleContent){
          this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</p>`
        }else{
          this.content = titleContent
        }
        this.pageLayout = this.contentData.pageLayout

        // 作用于富文本编辑之后
        this.tinymceEditObj = JSON.parse(JSON.stringify(this.questionData ))

        if(this.$refs.tinymceBox != undefined){
          this.$refs.tinymceBox.editorHtml()
        }

      },
    },

  },
  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_orderFirst',
      'pageData_editorStr',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor() {
      this.isEditor = true
    },

    subTopic_numberAnswerEdit() {
      this.$emit('current-question-answer-edit', this.data)
    },

    delHanlde() {
      let {group} = this.data.content
      let questionGroup = group[0]

      const {sid,fid,pid,id} = this.data

      if(sid){
        //三节
        let index = questionGroup.childGroup.findIndex(question => question.id === fid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === pid)
          if(twoIndex > -1){
            let levelThree = levelTwo.childGroup[twoIndex]
            let threeIndex = levelThree.childGroup.findIndex(question => question.id === id)
            if(threeIndex > -1){
              if(levelTwo.childGroup.length <= 1){
                questionGroup.childGroup.splice(index,1)
              }else if(levelThree.childGroup.length <= 1){
                levelTwo.childGroup.splice(twoIndex,1)
              }else{
                levelThree.childGroup.splice(threeIndex,1)
              }
            }
          }
        }
      }else if(fid && !sid){
        //二节
        let index = questionGroup.childGroup.findIndex(question => question.id === pid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === id)
          if(twoIndex > -1){

            if(levelTwo.childGroup.length <= 1){
              questionGroup.childGroup.splice(index,1)
            }else{
              levelTwo.childGroup.splice(twoIndex,1)
            }
          }
        }
      }else if(id && !fid && !sid){
        //一节
        let index = questionGroup.childGroup.findIndex(question => question.id === id)
        if(index > -1){
          questionGroup.childGroup.splice(index,1)
          this.subTopic_already_del([this.data])
          this.subTopic_determine_clean(this.data.topic)
        }
      }
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.pageData_del(index)
        this.pageData_orderFirst({objId:this.data.objId,scoreTotal:this.data.scoreTotal - this.data.score})
      }
      this.subTopic_number_calculate()

    },

    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]

        questionObj.answerArrHeight[questionObj.orderFirst] = height

        this.pageData_edit({
            ...questionObj,
            answerArrHeight: questionObj.answerArrHeight,
        })

      }
    },

    changeContent(obj){
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id && question.first)

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

    //改变内容
    tinymceChangeFunc(obj){
      // 富文本参数
      let eidtObj = JSON.parse(JSON.stringify(this.tinymceEditObj))
      const {val,tinyHeight,tinyId} = obj
      let tinys = tinyHeight - 14
      const { segmented,operatTinymce } = eidtObj

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)
      let tinyMceRowHeight = []
          tinymcePList.forEach((itme,index) => {
            let height = itme.offsetHeight
            if(index == 0){
              height -= 8
            }else if(index == tinymcePList.length - 1){
              height -= 5
            }
            tinyMceRowHeight.push(height)
          })

        this.tinymceHeight = tinys // 最大高度
      //-------------------------------------------------------------------------

      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      //-------------------------------------------------------------------------
      this.editConten(eidtObj,tinyHeight,val,tinyMceRowHeight)
    },


    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){

      let tinymceEditObj = JSON.parse(JSON.stringify(eidtObj))

      const {
        editorContent,segmented,first,id,MarginHeight,operatTinymce,rowHeight,
        rowHeightArr,remainderHeight,heightTitle,orderFirst,answerArrHeight,height,castHeight
      } = tinymceEditObj
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          // containerHeightNext,
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
          if(first && !orderFirst){
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
            // if(containerHeight > difference){
            //   containerHeightNext = containerHeight - difference
            // }
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
              answerArrHeight[orderFirst] = overflowHeight
            }else{
              if(containerHeight > difference && editorContent[nextSegmented] != undefined){
               //内容低于内容高度
               //内容框高度 - 内容
                containerHeight = (remainderHeight - 20 - MarginHeight - heightTitle)

                // rowHeightArr[nextSegmented].forEach(num => {
                //     impairment += num
                //   })

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
                answerArrHeight[orderFirst] = overflowHeight
              }else{
                editorContent[segmented] = val
                rowHeightArr[segmented] = tinyMceRowHeight
                if(first && !orderFirst){
                  overflowHeight = tinyHeight + heightTitle + 4
                }else{
                  overflowHeight = height - castHeight + tinyHeight
                }
                answerArrHeight[orderFirst] = overflowHeight
              }
            }
          }
          if(index > -1){
            let curObj = this.pageData[index]
            let data = {
              question:{
                ...curObj,
                editorContent: setArrContent.length ? setArrContent : editorContent,
                answerArrHeight:answerArrHeight,
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
.question-info {
  &:hover {
    .question_editOrDel {
      display: block;
    }
  }

  p{
    margin: 0;
  }
  .question_line {
    &:first-child{
      padding-top: 8px;
    }
    &:last-child{
      padding-bottom: 5px;
    }
    span{
      font-size: 14px !important;
    }

    img{
      max-width: 97%;
    }

    // display: flex;
    margin: 0;
    line-height: 35px;
    font-size: 14px;
    padding: 0 3mm;

    .title{
      font-size: 12px;
      flex-shrink: 0;
      margin-right: 5px;
    }

    .line-style {
      border-bottom: 1px solid @font-888;
      width: 100%;
      // flex-shrink: 1;
      height: 23px;
    }
  }

  .question-container{

    .answer_question_box{
      padding-top: 10px;
    }
  }

}
.question-container{
  margin-top: 0 !important;
  .answer_question_box {
    padding: 10px 15px 0 15px;
    .question_box_title {
      span.title {
        font-size: 12px;
        display: inline-block;
      }
    }
  }
}

.question-title {
  border: 1px solid #fff;
  cursor: text;
}
.question-title:hover {
  border-color: @main;
}

</style>
