<template>
  <div class="question-info">
    <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
      <!-- <span>{{numberTitle}}.</span>
      <span>{{data.topic}}</span>
      <span>({{data.totalScore}}分)</span> -->
      <div v-html="cotent"></div>
    </div>
    <quill-editor
      v-show="isEditor"
      :topic-content="TopicContent"
      @hanlde-close-esitor="hanldeCloseEsitor"
    />
    <div class="question_array">
      <div class="question_editOrDel">
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
      //TopicContent:'',
      isEditor:false,
      cotent:''
    }
  },
  computed: {
    ...mapState('questionType', ['options', 'letterArr']),
    ...mapState('pageContent', ['pageData']),
    numberTitle () {
      let item = this.options.filter(item => item.value === this.data.number)
      return item[0].label
    },
    groupData () {
      let group = this.data.group
      const singleBox = group.singleBox
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkbox = group.checkbox
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgment = group.judgment
      const judgmentArr = this.traverse(judgment, this.letterArr)
      let topicList = [...singleArr, ...checkArr, ...judgmentArr]
      let result = [];
      for (var i = 0; i < topicList.length; i += this.data.rows) {
        result.push(topicList.slice(i, i + this.data.rows));
      }
      return result
    },
    TopicContent () {
      return `<span>${this.numberTitle}.</span><span>${this.data.topic}</span><span>(${this.data.totalScore})分</span>`
    }
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData
        }
      }
    },
    TopicContent:{
      immediate: true,
      handler () {
        this.cotent = this.TopicContent
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', ['delPageData']),
    traverse (Arr, letterArr) {
      if (Arr.length > 0) {
        let data = []
        Arr.map(item => {
          if (item.childGroup.length > 0) {
            let childGroup = item.childGroup.map(row => {
              let select = item.select
              let selectBox = []
              if (select == 2) {
                selectBox = ['T', 'F']
              } else {
                selectBox = letterArr.slice(0, select)
              }
              return { ...row, selectBox: selectBox }
            })
            data = [...data, ...childGroup]
          }
        })
        return data
      } else {
        return []
      }
    },
    delHanlde (id) {
      this.delPageData(id)
    },
    currentQuestionHanldeEdit (id) {
      this.$emit('current-question-hanlde-edit', id)
    },
    hanldeEditor(){
      this.isEditor = true
    },
    hanldeCloseEsitor(content){
      this.isEditor = false
      this.cotent = content
      //console.log(content)
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
}
</style>
