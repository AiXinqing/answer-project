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
        class="mar_T10 d_jump"
        id="parking0"
        index="parking0"
        :prmTid="prmTid"
      />

      <parking2
        class="mar_T10 d_jump"
        id="parking1"
        index="parking1"
        :prmTid="prmTid"
      />

      <parking3
        class="mar_T10 d_jump"
        id="parking2"
        index="parking2"
        :prmTid="prmTid"
      />

      <parking4
        class="mar_T10 d_jump"
        id="parking3"
        index="parking3"
        :prmTid="prmTid"
      />

      <parking5
        class="mar_T10 d_jump"
        id="parking4"
        index="parking4"
        :prmTid="prmTid"
      />

      <parking6
        class="mar_T10 d_jump"
        id="parking5"
        index="parking5"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <parking7
        class="mar_T10 d_jump"
        id="parking6"
        index="parking6"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <parking8
        class="mar_T10 d_jump"
        id="parking7"
        index="parking7"
        :prmTid="prmTid"
        :subjects-arr="subjectsArr"
      />

      <!-- 动态锚点 -->
    </div>

    <!-- 浮动锚点点击处 -->
    <div class="Anchor_box">
      <div class="anchor_title">成绩分析</div>
      <div class="anchor_list">
        <div
          v-for="(tab ,index) in tabsAnchor"
          :key="index"
          class="cur_style"
          :class="{'cur':tabView == index}"
          :id="`parkingA${index}`"
          @click="goAnchor(index)"
        >
          {{tab.name}}
        </div>
      </div>
    </div>
    <!-- 浮动锚点点击处 -->

  </section>
</template>

<script>
  import parking1 from './analyzed/'
  import parking2 from './totalScoreDistributed/'
  import parking3 from './upperGearLine/'
  import parking4 from './subjectUpperGearLine/'
  import parking5 from './criticalBirth/'
  import parking6 from './sectionNumPeople/'
  import parking7 from './subjectExam/'
  import parking8 from './excellentGrade/'

  import { mapState } from 'vuex'
  export default {
    components: {
      parking1,
      parking2,
      parking3,
      parking4,
      parking5,
      parking6,
      parking7,
      parking8
    },

    data() {
      return {
        tabView: '0',
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

      goAnchor(index) {
        this.tabView = index
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

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        })
      },

      windowScroll() {
        // 滚动条距离页面顶部的距离
        // 以下写法原生兼容
        let parkingA1 = 0,
            parkingA2 = 0,
            parkingA3 = 0,
            parkingA4 = 0,
            parkingA5 = 0,
            parkingA6 = 0,
            parkingA7 = 0,
            parkingA8 = 0
            parkingA1 = document.getElementById('parking0').offsetTop
            parkingA2 = document.getElementById('parking1').offsetTop
            parkingA3 = document.getElementById('parking2').offsetTop
            parkingA4 = document.getElementById('parking3').offsetTop
            parkingA5 = document.getElementById('parking4').offsetTop
            parkingA6 = document.getElementById('parking5').offsetTop
            parkingA7 = document.getElementById('parking6').offsetTop
            parkingA8 = document.getElementById('parking7').offsetTop


        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

            if(scrollTop <= parkingA1 ){
              this.tabView = 0
            } else if(scrollTop <= parkingA2 ){
              this.tabView = 1
            }else if(scrollTop <= parkingA3 ){
              this.tabView = 2
            }else if(scrollTop <= parkingA4 ){
              this.tabView = 3
            }else if(scrollTop <= parkingA5 ){
              this.tabView = 4
            }else if(scrollTop <= parkingA6 ){
              this.tabView = 5
            }else if(scrollTop <= parkingA7 ){
              this.tabView = 6
            }else if(scrollTop > parkingA8 ){
              this.tabView = 7
            }else if(scrollTop > parkingA8 ){
              this.tabView = 7
            }
      },

    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

</style>