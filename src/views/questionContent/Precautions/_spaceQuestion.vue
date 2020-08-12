<template>
<!-- 填空题题组 -->
  <div class="space_box">
    <space-item />
    <div class="add_question" @click="hanldeAddSubtopic">+ 分段添加小题</div>
    <div class="question-group"></div>
  </div>
</template>

<script>
  import spaceItem from './spaceItem/_item'
  export default {
    components: {
        spaceItem,
    },
    methods: {
      hanldeAddSubtopic() {

      }
    },
  }
</script>

<style lang="less">
  .space_box,
  .add_question{
    margin-top: 20px;
  }
</style>