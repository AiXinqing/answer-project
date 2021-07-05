<template>
  <div class="teacher_wapper">
    <div class="examComment_box">
      <div class="examComment_left">

        <questionCard />

      </div>
      <div class="examComment_right">
        <div class="card-header">答题情况（按得分率）</div>
        <div class="rate-depict">
          <p class="depict-item">
            <span class="rate-low"></span>
            <span class="rate-card">低于0.45</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import questionCard from "./questionCard"
  export default {
    components: {
      questionCard
    },

    methods: {
      initChange(formData){
        console.log(formData)
        // this.$refs.subQuestion.initTable(formData)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .examComment_box{
    display:flex;
    background:@white;
    margin-top: 10px;
    margin-left: 10px;
    width: 100%;
    padding: 10px 0;

    .examComment_left {
      width: calc(100% - 200px);
      margin-left: 10px;
    }

    .examComment_right{
      width:168px;
      border:1px solid @bc_e7e7;
      padding-bottom:20px;
      margin-left: 10px;
      p{
        .depict-item{
          padding: 0 0;
          margin: 5px 0;
        }
      }
    }

    .card-header{
      height: 40px;
      padding-left: 10px;
      line-height: 40px;
      color: @font-333;
      background-color: @pageBg;
      font-size:14px;
    }
    .rate-depict{
      padding: 6px;
      font-size: 13px;
      line-height: 2;
    }
    .depict-item{
      .rate-low{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 3px;
        vertical-align: middle;
        background-color: #f4664b;
      }
      .rate-card{
        margin-left: 5px;
      }
    }
  }
</style>