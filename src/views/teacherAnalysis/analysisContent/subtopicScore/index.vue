<template>
  <div class="teacher_wapper">
    <!-- 试题分析 -->
    <sub-question
      ref="subQuestion"
      class="mr_10"
    />

  </div>
</template>

<script>

  import subQuestion from "./subQuestion"

  export default {

    components: {
      subQuestion
    },

    methods: {
      initChange(formData){
        this.$refs.subQuestion.initTable(formData)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

</style>