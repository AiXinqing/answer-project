<template>
  <div class="page-content">
    <answer-sheet-layout />
    <div class="main-info"></div>
  </div>
</template>

<script>
import answerSheetLayout from './answerSheetLayout'
export default {
  components: {
    answerSheetLayout,
  },
}
</script>
<style lang="less" scoped>
.page-content {
  margin-top: 50px;
  position: relative;
}
.main-info {
  height: 100%;
  padding-top: 50px;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
