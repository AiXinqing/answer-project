<template>
  <section>
    <div class="classAnalysis_content">
      <!-- 标题 -->
      <div class="classAnalysis_title mar_T10">
        <div class="title_h2">{{examData.name}}</div>
        <div class="title_h5">校级级对比分析报告</div>
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

      <parking1
        class="mar_T10"
        id="parking1"
        :prmTid="prmTid"
      />

      <parking2
        class="mar_T10"
        id="parking2"
        :prmTid="prmTid"
      />

      <parking3
        class="mar_T10"
        id="parking3"
        :prmTid="prmTid"
      />

      <parking4
        class="mar_T10"
        id="parking4"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <parking5
        class="mar_T10"
        id="parking5"
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
          @click="iscur=index,goAnchor('parking' + (index + 1))"
        >
          {{tab.name}}
        </a>
      </div>
    </div>
    <!-- 浮动锚点点击处 -->

  </section>
</template>

<script>
  import parking1 from './analyzed/'
  import parking2 from './totalScoreDistributed/'
  import parking3 from './criticalBirth/'
  import parking4 from './sectionNumPeople/'
  import parking5 from './subjectExam/'

  import { mapState } from 'vuex'
  export default {
    components: {
      parking1,
      parking2,
      parking3,
      parking4,
      parking5
    },

    data() {
      return {
        tabView: 'parking1',
        tabsAnchor: [
          {
            name:'总体情况汇总'
          },
          {
            name:'总分分布'
          },
          {
            name:'总分上档线分析'
          },
          {
            name:'学科上档线分析'
          },
          {
            name:'临界生分布'
          },
          {
            name:'分段人数分布'
          },
          {
            name:'学科考试分析'
          },
          {
            name:'优秀生学困生'
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
     // window.addEventListener('scroll', this.windowScroll)
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
        let parkingA1 = document.getElementById('parking1').offsetTop
        let parkingA2 = document.getElementById('parking2').offsetTop
        let parkingA3 = document.getElementById('parking3').offsetTop
        let parkingA4 = document.getElementById('parking4').offsetTop
        let parkingA5 = document.getElementById('parking5').offsetTop

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
            }

      }

    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/variables.less';
  .Anchor_box{
    display: none
  }
</style>