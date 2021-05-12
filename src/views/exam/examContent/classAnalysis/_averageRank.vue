<template>
  <!-- 学科平均分排名 -->
  <div class="average_content">
    <div class="card_item">
      <i></i>
      <span>学科平均分排名</span>
    </div>

    <singleLine
      :title-name="'学科平均分排名'"
      :is-label="true"
      :unit="''"
      width="calc(33.33% - 15px)"
    />
  </div>
</template>

<script>

  import singleLine from './_single'
  export default {
    components: {
      singleLine,
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .average_content{
    min-height: 450px;
    background-color: @white;
    border-radius: 4px;
    padding-top: 20px;
  }

  .card_contetn{
    display:flex;

    .card_item{
      width: 90%;
    }
    .search_right{
      margin-top: 5px;
    }
  }

  .card_item{

    line-height: 35px;
    height: 35px;
    font-size: 18px;

    i{
      width: 4px;
      border-radius: 3px;
      height: 22px;
      background-color: @main;
      display: inline-block;
      position: relative;
      top: 4px;
      margin-left: 30px;
    }

    span{
      margin-left: 10px;
    }
  }
</style>