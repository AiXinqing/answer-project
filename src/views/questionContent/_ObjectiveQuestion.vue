<template>
<!-- 选择题 -->
  <div class="question-info">

    <template v-if="questionData.first && questionData.borderTop == undefined">
      <div
        class="question-title"
        ref="questionTitle"
        :style="{height: data.heightTitle - 10 + 'px'}" v-if="!isEditor" @click="hanldeEditor">
        <template v-if="!quilleditor">
          <div class="title-span">
            <span>{{options[data.number].label}}.</span>
            <span>{{data.topic}}</span>
            <span>({{data.totalScore}})分</span>
          </div>
        </template>
        <template
          v-else
        >
          <div class="title-span" v-html="cotent"></div>
        </template>
      </div>
      <quill-editor
        v-if="isEditor"
        ref="quillEditor"
        :topic-content="cotent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    </template>
    <!-- <vue-ueditor></vue-ueditor> -->
    <div class="question_array">
      <div class="question_editOrDel">
        <span  class="btn_addSub_name">每组题数</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,1)">-</span>
        <span class="btn_addSub_info" >{{data.rows}}</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,2)">+</span>
        <span class="layui-btn layui-btn-xs" @click="currentQuestionHanldeEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
      <div class="question-groups"
        v-for="(item,i) in groupData"
        :key="i"
      >
        <div
          v-for="row in item"
          :key="row.id"
          class="group_item"
        >
          <span class="topic-num">{{row.topic}}</span>
          <span
            v-for="(list,index) in row.selectBox"
            :key="index"
            class="sketch"
          >
            <span>[<i>{{list}}</i>]</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import quillEditor from '../../components/quillEditor'
// import VueUeditor from '../../components/VueUeditor'

export default {
  components: {
    quillEditor,
    // VueUeditor
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
      cotent: '',
      options:[],
      quilleditor:false,
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterArr']),
    ...mapState('pageContent', ['pageData']),

    topicBox () {
      let group = this.data.group
      const singleBox = group.singleBox
      //---------------------------------小题计算
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkbox = group.checkbox
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgment = group.judgment
      const judgmentArr = this.traverse(judgment, this.letterArr)
      let topicList = [...singleArr, ...checkArr, ...judgmentArr]
      //--------------------------------------------------------
      return topicList
    },
    groupDataa () {
      let result = [];
      for (var i = 0; i < this.topicBox.length; i += this.data.rows) {
        result.push(this.topicBox.slice(i, i + this.data.rows));
      }
      return result
    },

      groupData () {
        return this.questionData.showData.flat()
      },
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      }
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.cotent = this.$refs.questionTitle.innerHTML
    })
  },
  methods: {
    ...mapMutations('pageContent', ['delPageData', 'del_objectiveData',
      'del_orderSort',]),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
    ]),
    traverse (Arr, letterArr) {
      if (Arr.length > 0) {
        let data = []
        Arr.forEach(item => {

          item.childGroup.forEach(row => {
            let obj = {
              ...row,
              selectBox: row.select == 2 && row.id.indexOf('judgment') != -1 ? ['T', 'F'] : letterArr.slice(0, row.select),
              width: row.select * 26 + 42
            }
            data.push(obj)
          })
        })

        return data
      } else {
        return []
      }
    },
    delHanlde (id) { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.del_AlreadyTopics(this.topicBox)
        this.del_determineTopic(this.topicBox)
        this.del_orderSort(this.pageData[index].order + 1)
        this.delPageData(index)
        this.del_objectiveData() // 删减一个大题号
        this.del_existBigQuestion(this.questionData)
        this.set_currentQuestion()
      }
    },
    currentQuestionHanldeEdit (id) {
      this.$emit('current-question-hanlde-edit', id)
    },
    hanldeEditor () {
      this.isEditor = true
      this.quilleditor = true
    },
    hanldeCloseEsitor (content) {
      this.isEditor = false
      this.cotent = content
      console.log(content)
    },
    hanldeSubtraction (id, num) {
      this.$emit('hanlde-subtraction', id, num)
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.ql-toolbar.ql-snow{
  padding: 0 8px;
}
.question-title {
  margin-bottom: 10px;
  span {
    color: @font-333;
  }
}
.question_array {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .question-groups {
    margin-bottom: 10px;
  }
  .group_item {
    display: table-header-group;
    height: 20px;
    line-height: 20px;
    span.topic-num {
      font-size: 12px;
      width: 40px;
      text-align: right;
      display: inline-block;
    }
    span.sketch {
      margin-left: 3px;
      i {
        font-style: normal;
        padding: 0 1px;
      }
      span {
        position: relative;
        top: -1px;
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
  .question_editOrDel {
    position: absolute;
    right: 0;
    top: -10px;
    display: none;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
  &:hover {
    .question_editOrDel {
      display: block;
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
.btn_addSub,
.btn_addSub_info{
  display: inline-block;
  padding: 0 5px;
  height: 21px;
  min-width: 12px;
  line-height: 20px;
  border:1px solid  @main;
  color: @main;
  text-align: center;
  position: relative;
  cursor: pointer;
  top: 0px;
  font-size: 12px;
}
.btn_addSub_info{
  min-width: 14px;
}
.btn_addSub_name{
  font-size: 14px;
  color: @main;
  position: relative;
    top: 0px;
}
.question-info{
  position: relative;
  .ql-editor{
    padding: 0 0;
    position: relative;
  }
  .ql-toolbar{
    &.ql-snow{
      padding: 0;
      position: absolute;
      top: -26px;
      z-index: 99;
      background: #fff;
      width: 100%;
    }
  }
}

.title-span{
  p{padding: 0;margin: 0;}
}
</style>
