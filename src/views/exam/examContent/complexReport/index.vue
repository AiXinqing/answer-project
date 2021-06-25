<template>
  <div class="exam_wapper">
    <div class="el-tabs el-tabs--top">
      <div class="el-tabs__header is-top">
        <div
          v-for="(item,i) in tabPaneBox"
          :key="i"
          :class="['el-tabs__item is-top',{'is-active':item.name == activeName}]"
          @click="handleClick(item)"
        >{{item.label}}</div>
      </div>
    </div>
    <div class="el-tabs__content">
      <div class="el-tab-pane">
        <component
          :is="activeName"
          :exam-info="examInfo"
          :prmTid="prmTid"
          ref="tabName"
        ></component>
      </div>
    </div>
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
  import { mapGetters, mapMutations } from 'vuex'

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

    computed: {
      ...mapGetters('getExam', ['examInfo']),
    },

    mounted () {
      if (window.performance.navigation.type == 1) {
        if(this.prmTid != ''){
          this.getExamFunc(this.prmTid)
        }
      }else{
        if(this.prmTid != ''){
          this.getExamFunc(this.prmTid)
        }
      }
    },
    methods: {
      ...mapMutations('getExam', ['Reset_classesArr']),
      // 切换tab
      handleClick(tab){
        this.activeName = tab.name

        this.$nextTick(()=>{
          this.$refs.tabName.initTable()
          this.Reset_classesArr()
        })

      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
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
  .exam_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    margin: 5px;
    transform: translateX(-50%);

    .el-tabs.el-tabs--top{
      height:auto;
      background: #fff;
    }

    &>div{
      height: calc(100% - 35px);
    }
  }
  .el-tabs__content{
    height: 100%;
    &>div{
      height: 100%;
    }
  }
</style>