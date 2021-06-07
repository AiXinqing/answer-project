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
  export default {
    components: {
      jointExam,
    },

    data() {
      return {
        activeName: 'jointExam',
        tabPaneBox:[
          {
            label:'联考成绩册',
            name:'jointExam'
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