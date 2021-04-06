<template>
  <div class="exam_wapper">
    <hj-tabs
      :v-model="activeName"
      :tab-pane="tabPaneBox"
      @tab-click="handleClick"
    >
      <component :is="activeName"></component>
    </hj-tabs>
  </div>
</template>

<script>
  import gradebook from './gradebook'
  import subTable from './subTable'
  import classGrades from './classGrades'
  export default {
    components: {
      gradebook,
      subTable,
      classGrades
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
        ]
      }
    },
    mounted () {
      // this.$fetch(this.URL.setLogin, {input:''})
      // .then((res) => {
      //     console.log(res)
      // })
    },
    methods: {
      handleClick(tab){
        this.activeName = tab.name
      }
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