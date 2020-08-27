<template>
<!-- 填空题 -->
  <div class="question-info">
      <template v-if="questionData.first &&  questionData.borderTop == undefined" >
        <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
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
        <span class="layui-btn layui-btn-xs" @click="currentQuestionFillEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
    </div>
    <div class="content-info">
      <div
        class="content-row"
        v-for="(item,i) in topicGroupData"
        :key="i"
      >
        <a
          v-for="(row,a) in item"
          :key="a"
          :style="{'width':pageWidth / data.rows + 'px'}"
        >
        <i v-if="row.lgTopic != undefined" ref="iWidth">
          <template v-if="row.lgTopic < 2 ">{{row.topic}}</template>
          <template v-if="row.lgTopic != 0">({{row.lgTopic}})</template>
        </i>
        <i v-else ref="iWidth"></i>
        <span v-if="row.lgTopic != undefined" :style="{
          'width':row.lgTopic != 0 ?  'calc(100% - '+ (row.topic.toString().length + row.lgTopic.toString().length + 2) * 9 +'px)':'calc(100% - 23px)'
          }"/>
        <span v-else :style="{
          'width':'calc(100% - 22px)'
          }"/>
        </a>
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
    // questionDialog,
  },
  props: {
    contentData: {
      type: Object,
      default: () => { }
    },
    questionData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      data: {},
      isEditor: false,
      cotent: ''
    }
  },
  computed: {
    ...mapState('questionType', ['options', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    numberTitle () {
      let item = this.options.filter(item => item.value === this.data.number)
      return item[0].label
    },

    TopicContent () {
      return `<span>${this.numberTitle}.</span><span>${this.data.topic}</span><span>(${this.data.totalScore})分</span>`
    },
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 440
        : 695
    },
    topicGroupData () {
      // let rows = this.data.rows
      // let array = this.data.group.map(item => {
      //   return item.childGroup
      // })
      // if (array.length > 0) {
      //   array = array[0]
      //   let temporaryArr = []
      //   let datas = []
      //   array.forEach(ele => {
      //     if (ele.childGroup != undefined) {
      //       ele.childGroup.forEach((row, index) => {
      //         for (let i = 1; i <= row.space; i++) {
      //           if (i == 1) {
      //             temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
      //           } else {
      //             temporaryArr.push({ ...row })
      //           }
      //           if (temporaryArr.length >= rows) {
      //             datas.push(temporaryArr)
      //             temporaryArr = []
      //           }
      //         }
      //       })
      //     } else {
      //       for (let i = 1; i <= ele.space; i++) {
      //         if (i == 1) {
      //           temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
      //         } else {
      //           temporaryArr.push({ ...ele })
      //         }
      //         if (temporaryArr.length >= rows) {
      //           datas.push(temporaryArr)
      //           temporaryArr = []
      //         }
      //       }
      //     }
      //     if (temporaryArr.length >= rows) {
      //       datas.push(temporaryArr)
      //       temporaryArr = []
      //     }
      //   })
      //   if (temporaryArr.length > 0) {
      //     datas.push(temporaryArr)
      //   }
      //   // console.log(datas)
      //   return datas
      // } else { return [] }
      return this.questionData.showData
    },
    topicBox () {
      let topicList = []
      this.data.group.forEach(item => {
        topicList.push(...item.childGroup)
      })
      return topicList
    }
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData
        }
        console.log(this.data)
        console.log(this.questionData)
      }
    },
    TopicContent: {
      immediate: true,
      handler () {
        this.cotent = this.TopicContent
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', ['delPageData', 'del_objectiveData']),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic'
    ]),
    delHanlde (id) { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.del_determineTopic(this.topicBox)
        this.del_AlreadyTopics(this.topicBox)
        this.delPageData(index)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
      }
    },
    currentQuestionFillEdit (id) {
      this.$emit('current-question-fill-edit', id)
    },
    hanldeEditor () {
      this.isEditor = true
    },
    hanldeCloseEsitor (content) {
      this.isEditor = false
      this.cotent = content
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
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
.content-info{
  border:1px solid @font-888;
  padding-bottom: 15px;
}
.content-row  {
  a{
    display: inline-block;
    height: 30px;
    margin-left: 5px;
    width: 100%;
    i{
      display: inline-block;
      min-width: 22px;
      font-size: 12px;
      font-style: normal;
      text-align: center;
    }
    span{
      display: inline-block;
      height: 30px;
      width: 80px;
      top: 3px;
      position: relative;
      border-bottom: 1px solid #888;
      width: calc(100% - 22px)
    }
  }
  margin-bottom: 10px;
}

</style>
