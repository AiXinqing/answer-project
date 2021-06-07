<template>
  <div class="exam_wapper">
    <hj-tabs
      v-model="activeName"
      :tab-pane="tabPaneBox"
      @tab-click="handleClick"
    >
      <component
        :is="activeName"
        :exam-info="examInfo"
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
  import schoolgradesStatistics from './schoolgradesStatistics'
  export default {
    components: {
      jointExam,
      subTable,
      question,
      schoolGradesCompared,
      classGradesCompared,
      schoolgradesStatistics
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
            name:'schoolgradesStatistics'
          },
        ]
      }
    },

    methods: {
      handleClick() {

      }
    },
  }
</script>

<style lang="less">

</style>