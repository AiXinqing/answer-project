<template>
  <div class="NonRresponseArea_box"
    :class="{'active':previewIs}"
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
    },
    previewIs: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      data: {}
    }
  }
  , computed: {
    ...mapState('page', ['pageData']),
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
    ...mapMutations('page', ['pageData_del',
      'pageData_order_edit','del_nonAnswer']),
    delHanlde (id) {
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        let question = this.pageData[index + 1]
        if(question && question.questionType ==="answerQuestion"){
          this.pageData_order_edit({objId:question.objId,num:index - 1})
        }
        this.pageData_del(index)
        this.del_nonAnswer(this.questionData)
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
  background: #ddd;
  min-height: 43px;
  width: calc(100% - 1px);
  display: flex;
  align-items:center;
  position: relative;

  &.active{
    width: calc(100% - 18px);
  }

  &:hover {
    .question_editOrDel {
      display: block;
    }
  }
  .prompt_style {
    font-size: 32px;
    font-weight: bold;
    width: 100%;
    position: absolute;
    left: 0;
    text-align: center;
  }

  .question_array{
    width: 100%;
    position: absolute;
    top: 10px;
  }
}
</style>