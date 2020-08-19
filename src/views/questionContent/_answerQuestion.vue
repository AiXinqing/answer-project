<template>
<!-- 解答题 -->
  <div class="question-info">
    <div class="question-title" v-if="!isEditor" @click="hanldeEditor">
      <div v-html="cotent"></div>
    </div>
    <quill-editor
      v-show="isEditor"
      :topic-content="TopicContent"
      @hanlde-close-esitor="hanldeCloseEsitor"
    />
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="currentQuestionFillEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
    </div>
    <div class="answer_question_box"></div>

  </div>
</template>

<script>
export default {
  props: {
    answerData: {
      type: Object,
      default: () => { }
    },
  },
}
</script>

<style lang="less" scoped>
.answer_question_box {
  border: 1px solid #888;
}
</style>