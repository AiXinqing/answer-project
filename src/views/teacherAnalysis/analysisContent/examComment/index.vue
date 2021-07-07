<template>
  <div class="teacher_wapper">
    <div class="examComment_box">
      <div class="examComment_left">

        <questionCard
          v-for="item in TableList"
          :key="item.tqid"
          :question-item="item"
          :parameter="parameter"
        />

      </div>
      <div class="examComment_right">
        <div
          class="col_box"
          :class="{'active':scrollActive}"
        >
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
            <div
              v-for="(item,i) in TableList"
              :key="i"
              class="card-row-item main"
              :class="{'active':cardRowActive == i}"
              @click="changeCardRow(i)"
            >{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import questionCard from "./questionCard"
  import { mapState } from 'vuex'
  export default {
    components: {
      questionCard
    },

    data() {
      return {
        cardRow: ['1-3','4-6','7-9'],
        cardRowActive:null,
        scrollActive:false,
        parameter:{
          tid: '',
          tsid: '',
          cid:'',
          url:this.URL.GetExaminationPaperComment
        }
      }
    },

    computed: {
      ...mapState('examComment',['tableLoading','TableList']),

    },

    mounted () {
      window.addEventListener('scroll', this.windowScroll)
    },

    methods: {
      initChange(formData){

        this.parameter = {
          ...this.parameter,
          ...formData
        }

        this.$nextTick(()=>{
          this.getExamComment()
        })

      },

      getExamComment(){
        this.$store.dispatch('examComment/getExamComment', this.parameter)
      },

      changeCardRow(index){
        this.cardRowActive = index
      },
      windowScroll(){
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 固定答题情况
        if(scrollTop >= 208){
          this.scrollActive = true
        }else{
          this.scrollActive = false
        }
      }
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
      position: relative;
      margin-left: 10px;
      .col_box{
        width:168px;
        padding-bottom:20px;
        border:1px solid @bc_e7e7;
        max-height: calc(100vh - 280px);
        background: @white;

        &.active{
          position: fixed;
          top: 0;
        }

        p{
          .depict-item{
            padding: 0 0;
            margin: 5px 0;
          }
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
      margin-top: 5px;
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
      &.active{
        box-shadow: 0px 4px 6px #cbcccc;
      }

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