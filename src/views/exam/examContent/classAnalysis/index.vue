<template>
  <section>
    <div class="classAnalysis_content">
      <!-- 标题 -->
      <div class="classAnalysis_title mar_T10">
        <div class="title_h2">{{examData.name}}</div>
        <div class="title_h5">班级对比分析报告</div>
      </div>
      <div class="title_info">
        <div class="title_p padding_10">老师您好：</div>
        <div class="title_p">
          <span>
            本次考试（考试时间：{{examData.ttime}})，
          </span>
          <span>
            全校 {{examData.gname}} 共 {{classesArrLength}} 个班级，{{examData.studentNum}} 名学生参加考试。
          </span>
          <span>
            考试学科：<span class="color_style"> {{subjectsArrStr}} </span>  {{subjectsArrLength}} 门学科。
          </span>
        </div>
      </div>
      <!-- 标题 -->

      <Parking1
        class="mar_T10"
        id="Parking1"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <Parking2
        class="mar_T10"
        id="Parking2"
        :prmTid="prmTid"
      />

      <Parking3
        class="mar_T10"
        id="Parking3"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <Parking4
        class="mar_T10"
        id="Parking4"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <Parking5
        class="mar_T10"
        id="Parking5"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <!-- 动态锚点 -->
    </div>

    <!-- 浮动锚点点击处 -->
    <div class="Anchor_box">
      <div class="anchor_title">成绩分析</div>
      <div class="anchor_list">
        <a
          v-for="(tab ,index) in tabsAnchor"
          :key="index"
          :class="['cur_style',{cur:iscur==index}]"
          href="javascript:void(0)"
          :id="`parkingA${index + 1}`"
          @click="iscur=index,goAnchor('Parking' + (index + 1))"
        >
          {{tab.name}}
        </a>
      </div>
    </div>
    <!-- 浮动锚点点击处 -->

  </section>
</template>

<script>
  import Parking1 from './averageRank/'
  import Parking2 from './gradesOverview/'
  import Parking3 from './gradePercentage/'
  import Parking4 from './sectionNumPeople/'
  import Parking5 from './scoringRate/'

  import { mapState } from 'vuex'
  export default {
    components: {
      Parking1,
      Parking2,
      Parking3,
      Parking4,
      Parking5
    },

    data() {
      return {
        tabView: 'Parking1',
        tabsAnchor: [
          {
            name:'学科平均分排名'
          },
          {
            name:'班级成绩概况'
          },
          {
            name:'学科等级占比'
          },
          {
            name:'分段人数分布'
          },
          {
            name:'学科试题得分率'
          },
        ],
        iscur:0,
        prmTid:''
      }
    },

    computed: {
      ...mapState('getExam', ['examData','classesArr','subjectsArr']),

      classesArrLength(){
        return this.classesArr.length ? this.classesArr.filter(item => item.cid != 'all').length : 0
      },

      subjectsArrLength(){
        return this.subjectsArr.length ? this.subjectsArr.filter(item => item.sid != 'totalScore').length : 0
      },

      subjectsArrStr(){
        return this.subjectsArr.filter(item => item.sid != 'totalScore')
                                .map(item => item.sname).toString()
      }
    },

    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query.prmTid) {
            this.prmTid = query.prmTid
          }
        },
        immediate: true
      },
    },

    mounted () {
      if(this.prmTid != ''){
        this.getExamFunc(this.prmTid)
      }
      window.addEventListener('scroll', this.windowScroll)
    },

    methods: {

      goAnchor(selector) {
        var anchor = document.getElementById(selector)
        document.documentElement.scrollTop = anchor.offsetTop
      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        })
      },

      windowScroll() {
        // 滚动条距离页面顶部的距离
        // 以下写法原生兼容
        let parkingA1 = document.getElementById('Parking1').offsetTop
        let parkingA2 = document.getElementById('Parking2').offsetTop
        let parkingA3 = document.getElementById('Parking3').offsetTop
        let parkingA4 = document.getElementById('Parking4').offsetTop
        let parkingA5 = document.getElementById('Parking5').offsetTop

        let curStyle = document.getElementsByClassName('cur_style')
            for(let i = 0; i < 5;i++){
              curStyle[i].classList.remove('cur')
            }

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

            if(scrollTop <= parkingA1 ){
              document.getElementById('parkingA1').classList.add("cur")
            } else if(scrollTop <= parkingA2 ){
              document.getElementById('parkingA2').classList.add("cur")
            }else if(scrollTop <= parkingA3 ){
              document.getElementById('parkingA3').classList.add("cur")
            }else if(scrollTop <= parkingA4 ){
              document.getElementById('parkingA4').classList.add("cur")
            }else if(scrollTop <= parkingA5 ){
              document.getElementById('parkingA5').classList.add("cur")
            }else if(scrollTop > parkingA5 ){
              document.getElementById('parkingA5').classList.add("cur")
            }

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
    padding-bottom: 10px;

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
      padding-bottom: 10px;

      .title_p{
        line-height: 24px;
        padding-bottom: 10px;
      }
    }

    .padding_10{
      padding-bottom: 15px;
    }

  }
  .Anchor_box{
    // display: none;

    width: 180px;
    position: fixed;
    left: 100px;
    top: 35%;
    z-index: 999;
    background-color: @white;

    .anchor_title{
      height: 52px;
      line-height: 52px;
      background-color: @main_t;
      font-weight: 700;
      text-align: center;
    }

    .anchor_list{
      padding: 10px 0 20px 0;
      width: 100%;
      background-color: @white;

      a{
        width: 100%;
        text-align: center;
        cursor: pointer;
        text-decoration:none;
        display: inline-block;
        color:@font-909;
        line-height: 32px;

        &.cur{
          color: @main
        }
      }
    }
  }
  .color_style{
    color: @main
  }
</style>