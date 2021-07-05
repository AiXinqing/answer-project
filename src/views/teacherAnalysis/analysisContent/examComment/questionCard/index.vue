<template>
  <div class="card_item">
    <div class="card-header">
      <span class="question-num">123</span>
      <span>班级/年级平均分: <dd class="color_main">7.65</dd>/ 7.32 （全对3人/全错0人）<dd class="color_main">班级得分率76.50%</dd></span>
    </div>
    <div class="card-img"></div>
    <div class="card-prompt">
      <span>【优秀答案】:</span>
      <a href="#">查看优秀答案</a>
    </div>
    <div class="card-prompt">
      <span>【答题详情】：</span>
      <span style="margin-left: 0px;">下方柱状图可查看学生名单及作答情况</span>
    </div>
    
    <histogram />
    

    <div class="card-grade-score">
      <span>班级/年级得分率：<dd class="color_main"> 76.50%</dd>/73.20% 得分率差值：<dd class="color_main">3.30%</dd> </span>
    </div>
  </div>
</template>

<script>
  // import Histogram from "./Histogram"
  import histogram from './histogram'
  export default {
    components: {
      histogram
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .card_item{
    width:100%;
    border: 1px solid @bc_e7e7;
    height: auto;
    margin-bottom: 10px;

    dd {
      display: inline-block;
      margin-left: 0;
    }

    .card-prompt {
      font-size: 14px;
      a{
        margin-left:10px;
        color:@main
      }
    }

    i{ font-style:normal}

    .card-header{
      height: 40px;
      padding-left: 10px;
      font-size: 13px;
      line-height: 40px;
      color: @font-333;
      background-color: @pageBg;

      .question-num{
        margin-left:5px;
      }

      .card-img{
        padding: 10px;
        img{
          width:100%;
        }
      }
    }
    .echarts{
      margin-top: 10px;
      margin-left: 10px;
    }
  }
  .color_main{
    color:@main
  }
  .card-grade-score{
    span{
      &:nth-child(n+2){
        margin-left:0;
      }
    }
    padding-left: 8px;
    margin-top: 20px;
    font-size: 14px;
    color: @font-333;
  }
</style>