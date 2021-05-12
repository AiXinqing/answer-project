<template>
  <!-- 班级成绩概况 -->
  <div class="average_content">
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
    methods:{
      downTable(){
        // 下载表格
        const {cids,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportQuestionSummary}?tid=${tid}&tsid=${tsid}&cids=${cids}`)
      },
    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .average_content{
    height: 450px;
    background-color: @white
  }
</style>