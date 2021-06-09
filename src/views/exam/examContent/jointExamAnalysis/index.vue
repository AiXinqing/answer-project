<template>
  <div class="exam_wapper">
    <hj-tabs
      v-model="activeName"
      :tab-pane="tabPaneBox"
      @tab-click="handleClick"
    >
      <component
        :is="activeName"
        :exam-info="examConditionInfo"
        :prmTid="prmTid"
        ref="tabName"
      ></component>
    </hj-tabs>
  </div>
</template>

<script>
  import jointExam from './jointExam'
  import subTable from './subTable'
  import question from './question'
  import schoolGradesCompared from './schoolGradesCompared'
  import classGradesCompared from './classGradesCompared'
  import schoolGradesStatistics from './schoolGradesStatistics'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      jointExam,
      subTable,
      question,
      schoolGradesCompared,
      classGradesCompared,
      schoolGradesStatistics
    },

    data() {
      return {
        activeName: 'jointExam',
        tabPaneBox:[
          {
            label:'联考成绩册',
            name:'jointExam'
          },
          {
            label:'学生小分表',
            name:'subTable'
          },
          {
            label:'试题汇总表',
            name:'question'
          },
          {
            label:'学校成绩对比',
            name:'schoolGradesCompared'
          },
          {
            label:'班级成绩对比',
            name:'classGradesCompared'
          },
          {
            label:'学校成绩分段统计',
            name:'schoolGradesStatistics'
          },
          {
            label:'班级成绩分段统计',
            name:'classGradesStatistics'
          },
        ],
        prmTid:''
      }
    },

    computed: {
      ...mapGetters('getExam', ['examInfo']),
      ...mapGetters('jointExams', ['schoolExamInfo']),

      examConditionInfo() {
        return this.examInfo.length && this.schoolExamInfo.length ?  this.examInfo.concat(this.schoolExamInfo).filter(item => item.subject != '班级') : []
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
    },

    methods: {
      handleClick(tab) {
        this.activeName = tab.name
        this.$nextTick(()=>{
          this.$refs.tabName.initTable()
        })
      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        })
        this.$store.dispatch('jointExams/getExamInfo', {
          tid: prmTid
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.$nextTick(()=>{
              // 获取动态表头
              this.$refs.tabName.initTable()
            })
          }
        })

      },
    },
  }
</script>

<style lang="less">

</style>