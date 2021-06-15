<template>
  <div class="teacher_wapper">

    <!-- 整体概况 -->
    <overall-overview
      ref="overallOverview"
      class="mr_10" />

    <!-- 学科等级分布 -->
    <subject-juxtapose
      ref="subjectJuxtapose"
      class="mr_10"
    />

    <!-- 学科对比 -->
    <subject-contrast
      ref="subjectContrast"
      class="mr_10"
    />

    <!-- 成绩单 -->
    <template v-if="tsid == 0">
      <transcript
        ref="transcript"
        class="mr_10"
      />
    </template>
    <template v-else>
      <singleTranscript
        ref="transcript"
        class="mr_10"
      />
    </template>

  </div>
</template>

<script>
  import overallOverview from "./overallOverview"
  import subjectJuxtapose from "./subjectJuxtapose"
  import subjectContrast from "./subjectContrast"
  import transcript from "./transcript"
  import singleTranscript from "./transcript/singleTranscript"
  import { mapState } from 'vuex'

  export default {

    components: {
      overallOverview,
      subjectJuxtapose,
      subjectContrast,
      transcript,
      singleTranscript
    },

    methods: {

      initChange(formData){

        this.$refs.overallOverview.initTable(formData)
        this.$refs.subjectJuxtapose.initTable(formData)
        this.$refs.subjectContrast.initTable(formData)
        this.$refs.transcript.initTable(formData)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

  .teacher_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 20px;
  }

  .exam_subject{
    padding: 20px 0;
    background-color: @white;
    width: 100%;

    &>div{
      margin: 0 10px;
    }

    .select_box{
      display: flex;
      width: clac(100% - 20px);

      .search_select{
        display: flex;
        width: 50%;

        .select_label{
          font-size: 14px;
          line-height: 28px;
        }

        .hj-select{
          width: 250px;
          .el-select{
            width: 250px;
          }

          .el-input--mini .el-input__inner{
            text-align: left;
            text-indent: 1em;
          }
        }

      }
    }

    .subject_box{
      display: flex;
      font-size: 14px;

      .subject_left{
        line-height: 28px;
        margin-top: 20px;
        width: 75px;
      }
    }
  }

  .mr_10{
    margin-top: 10px;
  }

  .subject_right{
    display: flex;
    width: 100%;

    .subject_item{
      padding: 0 15px;
      border-radius: 4px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      margin-left: 10px;
      margin-top: 20px;

      &.active{
        background-color: @main;
        color: @white;
      }
    }
  }

  .no_data {
    line-height: 28px;
    margin-top: 20px;
    color: @font-999;
    margin-left: 20px;
  }
</style>