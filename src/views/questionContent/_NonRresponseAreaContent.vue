<template>
  <div class="NonRresponseArea_box"
    :style="{
      'height':questionData.castHeight + 'px'
    }"
  >
    <div class="prompt_style">请勿在此区域作答</div>
    <div class="question_array">
      <div class="question_editOrDel">
        <span  class="btn_addSub_name">每组题数</span>
        <span class="btn_addSub" @click="hanldeSubtractionNon(questionData,1)">-</span>
        <span class="btn_addSub_info" >{{data.rows}}</span>
        <span class="btn_addSub" @click="hanldeSubtractionNon(questionData,2)">+</span>
        <span class="layui-btn layui-btn-xs" @click="curEditNon(questionData)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
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
      data: {}
    }
  }
  , computed: {
    ...mapState('pageContent', ['pageData']),
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
  },
  methods: {
    ...mapMutations('pageContent', ['pageData_del', 'del_objectiveData','answer_editPageOrder']),
    delHanlde (id) {
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        let question = this.pageData[index + 1]
        if(question && question.questionType ==="answerQuestion"){
          this.answer_editPageOrder({objId:question.objId,num:index - 1})
        }
        this.pageData_del(index)
      }
    },
    curEditNon (obj) {
      this.$emit('cur-edit-non', obj)
    },
    hanldeSubtractionNon (obj, num) {
      this.$emit('hanlde-subtraction-non', obj, num)
    }
  },
}
</script>

<style lang="less">
.NonRresponseArea_box {
  border: 1px solid #888;
  position: relative;
  background: #ddd;
  min-height: 43px;
  &:hover {
    .question_editOrDel {
      display: block;
    }
  }
  .prompt_style {
    font-size: 32px;
    font-weight: bold;
    // width: 256px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .question_editOrDel {
    top: 5px;
    right: 5px;
  }
}
</style>