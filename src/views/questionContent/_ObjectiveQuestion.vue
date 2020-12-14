<template>
<!-- 选择题 -->
  <div class="question-info">
    <div class="question-title" ref="tinyeditor" v-if="questionData.first">
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        ref="tinyMCE"
        :max-height="maxHeight"
      />
    </div>

    <div class="question_array">
      <div class="question_editOrDel">
        <span  class="btn_addSub_name">每组题数</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,1)">-</span>
        <span class="btn_addSub_info" >{{data.rows}}</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,2)">+</span>
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberHanldeEdit(questionData.id)">编辑</span>
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
import { mapState, mapMutations,mapGetters } from 'vuex'

import tinyVue from '../../components/tinymce'
import triggerTinymce from '../../components/tinymce/triggerEditor'

export default {
  components: {
    tinyVue,
    triggerTinymce
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
      quilleditor:false,
      pageLayout:this.contentData.pageLayout,
      maxHeight:28
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('question',['options']),

    topicBox(){
      const {singleChoice,checkChoice,judgmentChoice} = this.data.group
      return [
        ...singleChoice.map(group => group.childGroup).flat(),
        ...checkChoice.map(group => group.childGroup).flat(),
        ...judgmentChoice.map(group => group.childGroup).flat(),
      ]
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
        this.pageLayout = this.contentData.pageLayout
      }
    },
    questionData:{
      immediate: true,
      handler () {
        this.content = ''
        let {number,topicName,scoreTotal} = this.data

          if(!this.questionData.titleContent){
            this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal})</span>分</p>`
          }else{
            this.content = this.questionData.titleContent
          }

      }
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations('page', ['pageData_del',]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    delHanlde (id) { // 删除大题-小题数
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

    subTopic_numberHanldeEdit (id) {
      this.$emit('current-question-hanlde-edit', id)
    },

    hanldeEditor () {
      this.isEditor = true
      this.quilleditor = true
    },

    hanldeCloseEsitor (content) {
      this.isEditor = false
      this.cotent = content

    },

    hanldeSubtraction (id, num) {
      this.$emit('hanlde-subtraction', id, num)
    },

    changeContent(val){
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)
      let height = val.length
      this.maxHeight = val.length // 最大高度
      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            titleContent:val,
            heightTitle:height,
            height:{
              ...curObj.height,
              titleH:height + curObj.MarginHeight
            }
          },
          index:index,
        }

        this.pageData_edit_title(data)
      }

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
