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
  export default {
    components: {
      jointExam,
      subTable
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