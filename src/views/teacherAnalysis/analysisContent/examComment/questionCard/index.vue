<template>
  <div class="card_item">
    <div class="card-header">
      <span class="question-num">第{{questionItem.name}}题</span>
      <span>班级/年级平均分: <dd class="color_main">{{questionItem.classAvgScore}}</dd>/ {{questionItem.gradeAvgScore}} （全对{{questionItem.fullScoreNum}}人/全错{{questionItem.zeroScoreNum}}人）<dd class="color_main">班级得分率{{questionItem.classScoreRate}}</dd></span>
    </div>
    <div class="card-img"></div>
    <div class="card-prompt">
      <span>【试题详情】:</span>
      <span class="look_style" > 第{{questionItem.name}}题 分值:{{questionItem.fullScore}}分</span>
    </div>
    <div class="card-prompt" v-if="questionItem.type !='主观题'">
      <span>【正确答案】:</span>
      <span class="look_style" >{{questionItem.answer}}</span>
    </div>
    <div class="card-prompt">
      <span>【答题详情】：</span>
      <span style="margin-left: 0px;">下方柱状图可查看学生名单及作答情况</span>
    </div>

    <histogram
      :question-options="histogramData"
      :id-tqid="questionItem.tqid"
    />


    <div class="card-grade-score">
      <span>班级/年级得分率：<dd class="color_main"> {{questionItem.classScoreRate}} </dd> / {{questionItem.gradeScoreRate}} 得分率差值：<dd class="color_main">{{questionItem.rateDifference}}</dd> </span>
    </div>

  </div>
</template>

<script>

  import histogram from './histogram'

  export default {
    components: {
      histogram
    },

    props: {
      questionItem: {
        type: Object,
        default:()=> {}
      },
      parameter: {
        type: Object,
        default:()=> {}
      }
    },

    computed: {
      histogramData() {
        const {
        answer,classAvgScore,classScoreRate,cname,fullScore,
        fullScoreNum,gradeAvgScore,gradeScoreRate,name,rateDifference,
        tqid,type,zeroScoreNum
        } = this.questionItem
        return this.questionItem.QuestionOptions.length ? this.questionItem.QuestionOptions.map(item => ({
          ...item,
          answer: answer,
          classAvgScore: classAvgScore,
          classScoreRate: classScoreRate,
          cname: cname,
          fullScore: fullScore,
          fullScoreNum: fullScoreNum,
          gradeAvgScore: gradeAvgScore,
          gradeScoreRate: gradeScoreRate,
          name: name,
          rateDifference: rateDifference,
          tqid: tqid,
          type: type,
          zeroScoreNum: zeroScoreNum,
          ...this.parameter
        })) : []
      }
    },

    methods: {
      // lookExcellentAnswers() {
      //   this.$refs.lookExcellentAnswers.openFrame()
      // }
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
      .look_style{
        margin-left:10px;
        color:@main;
        cursor: pointer;
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
    // margin-top: 20px;
    font-size: 14px;
    color: @font-333;
  }
</style>