<template>
  <div class="teacher_wapper">
    <div class="examComment_box">
      <div
        class="examComment_left"
        v-loading="tableLoading"
      >

        <questionCard
          v-for="(item,i) in TableList"
          :key="item.tqid"
          :question-item="item"
          :parameter="parameter"
          :id="`questionCard`+i"
        />

      </div>
      <div class="examComment_right">
        <div class="dow_examConten">
          <exam-button type="primary" @click="downTable">试卷讲评下载</exam-button>
        </div>
        <div
          class="col_box"
          :class="{'active':scrollActive}"
        >
          <div class="card-header">答题情况（按得分率）</div>
          <div class="rate-depict">
            <p class="depict-item">
              <span class="rate-low"></span>
              <span class="rate-card">低于45</span>
            </p>
            <p class="depict-item rate-mid">
              <span class="rate-low"></span>
              <span class="rate-card">介于45~75</span>
            </p>
            <p class="depict-item rate-min">
              <span class="rate-low"></span>
              <span class="rate-card">大于75</span>
            </p>
          </div>
          <div class="card-body">
            <div
              v-for="(item,i) in TableList"
              :key="i"
              class="card-row-item"
              :class="[{'active':cardRowActive == i},colorStyle(item)]"
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
        },
        colorStyle:(item)=>{
          let num = Number(item.classScoreRate)
          return num > 75 ? 'main' : num > 45 && num <= 75 ? 'low' : 'high'
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
        let jump = document.querySelectorAll('.d_jump')
        let total = jump[index].offsetTop
        let distance = document.documentElement.scrollTop || document.body.scrollTop
        // 平滑滚动，时长500ms，每10ms一跳，共50跳
        let step = total / 50
        if (total > distance) {
          smoothDown()
        } else {
          let newTotal = distance - total
          step = newTotal / 50
          smoothUp()
        }

        function smoothDown () {
          if (distance < total) {
            distance += step
　　　　　　 document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothDown, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }

        function smoothUp () {
          if (distance > total) {
            distance -= step
　　　　　　 document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothUp, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
      },
      windowScroll(){
        let t1 = 0
        let t2 = 0
        let timer = null // 定时器
        let index = null
        let thisT = this
        clearTimeout(timer)
        timer = setTimeout(isScrollEnd, 1000)
        t1 = document.documentElement.scrollTop || document.body.scrollTop

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 固定答题情况
        if(scrollTop >= 208){
          this.scrollActive = true
        }else{
          this.scrollActive = false
        }

        let Arr =  this.TableList.map((item,i) => {
          return document.getElementById('questionCard'+i).offsetTop
        })

        function isScrollEnd() {
          t2 = document.documentElement.scrollTop || document.body.scrollTop

          if(t2 == t1){
            index = Arr.findIndex(item => scrollTop <= item)
            if(index > 1){
              index -= 1
            }
            thisT.cardRowActive = index
          }
        }

      },
      downTable(){
        const {tid,tsid,cid } = this.parameter
        window.open(`${this.URL.ExportExaminationPaperComment}?tid=${tid}&tsid=${tsid}&cid=${cid}`)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .dow_examConten{
    margin-bottom: 10px;
    text-align: center;
    background: @pageBg;
    height: 39px;
    line-height: 38px;
    border: 1px solid @bc_e7e7;
  }

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