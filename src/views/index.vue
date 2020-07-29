<template>
  <div class="page-content">
    <answer-sheet-layout />
    <div class="main-info">
      <answer-sheet-set />
    </div>
  </div>
</template>

<script>
import answerSheetLayout from './_answerSheetLayout'
import answerSheetSet from './_answerSheetSet'
export default {
  components: {
    answerSheetLayout,
    answerSheetSet,
  },
}
</script>
<style lang="less" scoped>
.page-content {
  padding-top: 50px;
  position: relative;
  height: calc(100% - 50px);
}
.main-info {
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
