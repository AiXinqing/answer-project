<template>
  <div class="classAnalysis_content">
    <!-- 标题 -->
    <div class="classAnalysis_title mar_T10">
      <div class="title_h2">20年秋期九年级半期考试</div>
      <div class="title_h5">班级对比分析报告</div>
    </div>
    <div class="title_info">
      <div class="title_p padding_10">老师您好：</div>
      <div class="title_p">本次考试（考试时间：2020-11-09)， 全校 初三 共 24 个班级，1334 名学生参加考试。 考试学科： 语文、数学、英语、物理化学(物理、化学)、物理、化学、生物、道法历史(道法、历史)、历史、地理、道法 11 门学科。</div>
    </div>
    <!-- 标题 -->
  </div>
</template>

<script>
  export default {
    methods: {
      goAnchor(selector) {
          var anchor = this.$el.querySelector(selector) // 参数为要跳转到的元素id
          document.body.scrollTop = anchor.offsetTop; // chrome
          document.documentElement.scrollTop = anchor.offsetTop; // firefox
      }
    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .classAnalysis_content{
    width: 1200px;
    height: 100%;
    // background-color: @white;
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    .mar_T10{
      margin-top: 10px;
    }

    .classAnalysis_title{
      width: 100%;
      padding-top: 60px;
      background-color: @main;
      color: @white;

      .title_h2{
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
      }

      .title_h5{
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .title_info{
      width: calc(100% - 70px);
      background-color: @white;
      padding: 0 34px;
      font-size: 14px;
      padding-top: 35px;

      .title_p{
        line-height: 24px;
        padding-bottom: 10px;
      }
    }

    .padding_10{
      padding-bottom: 15px;
    }
  }
</style>