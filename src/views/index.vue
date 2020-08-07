<template>
  <div class="page-content">
    <!-- <answer-sheet-layout /> -->
    <!-- <div class="main-info">
      <answer-sheet-set />
      <answer-sheet-content />
    </div> -->
    <quill-editor></quill-editor>
  </div>
</template>

<script>
import quillEditor from '../components/quillEditor'
// import answerSheetLayout from './_pageLayout'
// import answerSheetSet from './_basicSet'
// import answerSheetContent from './_pageContent'
export default {
  components: {
    quillEditor,
    // answerSheetLayout,
    // answerSheetSet,
    // answerSheetContent,
  },
}
</script>
<style lang="less" scoped>
.page-content {
  padding-top: 50px;
  position: relative;
  height: calc(100% - 60px);
}
.main-info {
  height: calc(100% - 50px);
  position: absolute;
  top: 50px;
  width: 100%;
}
</style>
