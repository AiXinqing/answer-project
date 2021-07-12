<template>
  <div class="teacher_wapper">

    <!-- 试题分析 -->
    <questions-analysis
      ref="questionsAnalysis"
      class="mr_10"
    />

  </div>
</template>

<script>

  import questionsAnalysis from "./questionsAnalysis"

  export default {

    components: {
      questionsAnalysis
    },

    methods: {
      initChange(formData){
        this.$refs.questionsAnalysis.initTable(formData)
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

</style>