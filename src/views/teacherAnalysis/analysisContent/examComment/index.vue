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
          <p class="depict-item rate-mid">
            <span class="rate-low"></span>
            <span class="rate-card">介于0.45~0.75</span>
          </p>
          <p class="depict-item rate-min">
            <span class="rate-low"></span>
            <span class="rate-card">大于0.75</span>
          </p>
        </div>
        <div class="card-body">
          <div class="card-row-item main active">1-3</div>
          <div class="card-row-item low">1-3</div>
          <div class="card-row-item high">1-3</div>
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
      max-height: calc(100vh - 280px);
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
      margin: 0;
      &.rate-mid{
        .rate-low{
          background-color: @ffb;
        }
      }
      &.rate-min{
        .rate-low{
          background-color: @main;
        }
      }
      .rate-low{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 3px;
        vertical-align: middle;
        background-color: @f46;
      }
      .rate-card{
        margin-left: 5px;
      }
    }
  }
  .card-body{
    display: flex;
    flex-wrap:wrap;
    flex-direction:row;

    margin-top: 10px;
    .card-row-item{
      margin: 5px 10px;
      min-width:64px;
      height: 27px;
      overflow: hidden;
      font-size: 13px;
      line-height: 27px;
      text-align: center;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      border-radius: 2px;
      &.main{
        color: @main;
        background-color: @main-d;
        &:hover,
        &.active{
          color: @white;
          background-color: @main;
        }
      }

      &.low{
        color: @ffb;
        background-color: @fdf-d;
        &:hover,
        &.active{
          color: @white;
          background-color: @ffb;
        }
      }

      &.high{
        color: @f46;
        background-color: @f46-d;
        &:hover,
        &.active{
          color: @white;
          background-color: @f46;
        }
      }
    }
  }
</style>