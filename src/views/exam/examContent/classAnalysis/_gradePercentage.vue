<template>
  <!-- 学科等级占比 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>班级成绩概况</span>
      </div>
      <div class="search_right">
        <exam-button type="primary" @click="downTable">下载表格</exam-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    methods: {
      downTable() {

      }
    },
  }
</script>

<style lang="less">

</style>