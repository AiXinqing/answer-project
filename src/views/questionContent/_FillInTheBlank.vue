<template>
  <!-- 填空题 -->
  <div class="question-info">
    <div
      id="question-title"
      ref="tinyeditor"
      v-if="questionData.first && questionData.borderTop == undefined"
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
      ref="tinyDrag"
    >
      <div class="content-info" ref="questionChange">
        <trigger-tinymce
          :max-height="tinymceHeight"
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
        >
        </trigger-tinymce>
      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'

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
      return this.page_width - 50
    },

    topicBox () {
      return this.data.group.map(question => question.childGroup).flat()
    },

    strBox(){
      let num = Math.ceil(Math.ceil(this.pageWidth /this.data.rows) / 5)
      let strBox = ''
          for(let x = 0; x < num ;x++){
            strBox += this.str
          }
      return strBox
    },

    editorDetail(){

      const {editorContent,
      showData,segmented,
      segmentedArr,castHeight,
      heightTitle,MarginHeight,rowHeight,first,id} = this.questionData
      let questionInfo = ''

      showData.forEach(subtopic =>{
        let aList = ''
        subtopic.forEach((topic) =>{
          let spanBox = ''
          if(topic.lid){
            let li1 = topic.smallTopic == 1 && topic.spaceNum == 1 ? topic.topic : ''
            let li2 = topic.spaceNum <= 1 ? topic.smallTopic : ''
            spanBox = `<span class="s_p">${li1}${li2}</span>`
          }else{
            let li3 = !topic.spaceNum || topic.spaceNum == 1 ? topic.topic : ''
            spanBox = `<span class="s_p">${li3}</span>`
          }

          aList += `<a class="subtopic_a" style="width:${this.aWidth}px">
                      ${spanBox}
                      <span class="a_p">${this.strBox}</span>
                    </a>`
        })
        questionInfo +=  `<p class="content-row">${aList}</p>`
      })
      let strContent = ''
      let prevStr = ''
      let editorStrContent = '' // 字符串内容综合
      let strLong = Math.floor((castHeight - heightTitle - MarginHeight + 2) / rowHeight)
      if(editorContent[segmented] != undefined){
        let convertArray = this.convertArray(editorContent[segmented])
            convertArray.length = strLong
            for(let i = 0; i < segmentedArr[segmented];i++){
              if(convertArray[i] != undefined){
                strContent += convertArray[i]
              }
            }
          // 分页判断上一部分是否剩余字符
      }
      if(!first){
          if(editorContent[segmented - 1] != undefined){

            let prevArr = this.convertArray(editorContent[segmented - 1])
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
        }
        editorStrContent = prevStr + strContent

      return editorStrContent == '' ? questionInfo : editorStrContent
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

        if (!this.questionData.titleContent) {
          this.content = `<><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</>`
        } else {
          this.content = this.questionData.titleContent
        }
        this.tinymceHeight = this.questionData.first ? this.questionData.castHeight - this.questionData.heightTitle :
          this.questionData.castHeight

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
          height: height,
        })

      }
    },

    //转换富文本编辑的内容为数组

    convertArray(oldStr) {
      if(oldStr != undefined){
        let arr = oldStr.split("</p>")
            arr = arr.map(item => item == '' ? '' : item + '</p>')
                      .filter(item => item !='')
        return arr
      }
    },
    //转换富文本编辑的内容为数组

    changeContent (val) {
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)
      const length = (val.split('<p>')).length - 1
      let height = length * 21
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
    tinymceChangeFunc (val) {
      const{height,rowHeight,id,MarginHeight,castHeight,first,heightTitle,segmented,editorContent} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)
      const length = (val.split('</p>')).length - 1
     // let prevStr =''
      editorContent[segmented] = val

      //判断富文本编辑内容是否超出容器
      // let prevArr = this.convertArray(val)
      // console.log(segmentedArr[segmented])
      // console.log(prevArr)
      // if(prevArr.length > segmentedArr[segmented]){
      //   for(let i = segmentedArr[segmented] ; i < prevArr.length;i++){
      //     if(prevArr[i] != undefined){
      //       prevStr += prevArr[i]
      //     }
      //   }
      //   editorContent[segmented + 1] = prevStr
      // }



      let heights = first ? length * rowHeight + heightTitle + MarginHeight : length * rowHeight + MarginHeight
      this.tinymceHeight =  heights // 最大高度

      if (index > -1) {
        let curObj = this.pageData[index]

        let data = {
          question: {
            ...curObj,
            editorContent: editorContent,
            height: (height - castHeight) + heights,
            strLength:length,
            selectStr:segmented // 判断当前编辑对象所在位置
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
    // display: block;
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
  display: flex;
  height: 35px;
  margin: 0;
  &:first-child{
    padding-top: 10px;
  }

  .subtopic_a{
    display: flex;
    height: 35px;
    margin-left: 5px;
    width: 100%;
    font-size:12px;
    overflow: hidden;

    .s_p{
      height: 100%;
      flex:0;
      text-align: center;
      padding: 0 1mm 0 4mm;
      line-height: 35px;
      margin: 0 0;
    }
    .a_p{
      flex:  2;
      border-bottom: 1px solid @font-888;
      margin-left: 5px;
      display: inline-block;
      line-height: 25px;
      height: 25px;
      span.dis{
        display: none
      }
    }
  }

}
</style>
