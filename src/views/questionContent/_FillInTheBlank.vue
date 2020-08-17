<template>
<!-- 选这题 -->
  <div class="question-info">
    <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
      <div v-html="cotent"></div>
    </div>
    <quill-editor
      v-show="isEditor"
      :topic-content="TopicContent"
      @hanlde-close-esitor="hanldeCloseEsitor"
    />
    <div class="question_array">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="currentQuestionHanldeEdit()">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
    </div>
    <div class="content-info">
      <div class="content-row">
        <a><i>1(1)</i><span></span></a>
        <a><i></i><span></span></a>
        <a><i></i><span></span></a>
        <a><i></i><span></span></a>
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
      isEditor: false,
      cotent: ''
    }
  },
  computed: {
    ...mapState('questionType', ['options', 'letterArr']),
    ...mapState('pageContent', ['pageData']),
    numberTitle () {
      let item = this.options.filter(item => item.value === this.data.number)
      return item[0].label
    },

    TopicContent () {
      return `<span>${this.numberTitle}.</span><span>${this.data.topic}</span><span>(${this.data.totalScore})分</span>`
    },
    topicGroupData(){
      const arrays1 = [{child:[{space:1},{space:3}],space:4},{space:1,child:[]},{space:1,child:[]}];
      let temporaryArr=[]
      let data = []
      arrays1.forEach(ele => {
        if(ele.child.length > 0){
              ele.child.forEach(row => {
                  for(let i = 1; i <= row.space ;i++){
                    temporaryArr.push({...row,tp:i})

                  }
              })
        } else {
          console.log('11')
          temporaryArr.push(ele)
        }
        if(temporaryArr.length >= 4){
          data.push(temporaryArr)
          temporaryArr = []
        }
      })
      if(temporaryArr.length > 0){
          data.push(temporaryArr)
        } console.log(data)
        return data
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
    TopicContent: {
      immediate: true,
      handler () {
        this.cotent = this.TopicContent
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', ['delPageData']),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
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
      console.log(id)
    },
    currentQuestionHanldeEdit () {

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
.question_array {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .question_editOrDel {
    position: absolute;
    right: 0;
    top: -10px;
    display: block;
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
  a{
    display: inline-block;
    height: 30px;
    margin-left: 5px;
    i{
      display: inline-block;
      min-width: 24px;
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
    }
  }
}

</style>
