<template>
  <div class="exam_wapper">
    <hj-tabs
      v-model="activeName"
      :tab-pane="tabPaneBox"
      @tab-click="handleClick"
    >
      <component
        :is="activeName"
        :stretch-box="stretchBox"
        :prmTid="prmTid"
        ref="tabName"
      ></component>
    </hj-tabs>
  </div>
</template>

<script>
  import gradebook from './gradebook'
  import subTable from './subTable'
  import classGrades from './classGrades'
  import question from './question'
  import gradesStatistics from './gradesStatistics'
  import ranking from './ranking'
  // import Qs from 'qs'

  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      gradebook,
      subTable,
      classGrades,
      question,
      gradesStatistics,
      ranking
    },

    data() {
      return {
        activeName: 'gradebook',
        tabPaneBox:[
          {
            label:'成绩册',
            name:'gradebook'
          },
          {
            label:'小分表',
            name:'subTable'
          },
          {
            label:'班级成绩对比',
            name:'classGrades'
          },
          {
            label:'试题汇总表',
            name:'question'
          },
          {
            label:'成绩分段统计',
            name:'gradesStatistics'
          },
          {
            label:'名次和比例分析',
            name:'ranking'
          },
        ],
        prmTid: '',
        tsid:'',
        stretchBox:[],
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr']),
      ...mapGetters('getExam', ['examInfo']),
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
      // 切换tab
      handleClick(tab){
        this.activeName = tab.name
        this.subjectsArr.forEach((element,i) => {
          if(i == 0){
            this.tsid = element.tsid
          }
        })
        switch (this.activeName) {
          case 'subTable': // 小分表
          case 'question': // 试题汇总表
            this.subjectsArr.forEach((element,i) => {
              if(i == 1){
                this.tsid = element.tsid
              }
            })
            break;
          default:
            break
        }
        this.$nextTick(()=>{
          this.$refs.tabName.initTable(this.prmTid,this.tsid)
        })

      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.stretchBox = this.examInfo
            this.subjectsArr.forEach((element,i) => {
              if(i == 0){
                this.tsid = element.tsid
              }
            })
            this.$nextTick(()=>{
              // 获取动态表头
              this.$refs.tabName.initTable(this.prmTid,this.tsid)
            })
          }
        })
      },

    },
  }
</script>

<style lang="less">
  .exam_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    margin: 5px;
    transform: translateX(-50%);
    height: calc(100% - 40px);

    &>div{
      height: 100%;
    }
  }
  .el-tabs__content{
    height: 100%;
    &>div{
      height: 100%;
    }
  }
</style>