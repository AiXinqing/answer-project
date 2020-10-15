<template>
  <div class="page-content"
    @click.stop="isPopEditor"
  >
    <answer-sheet-layout />
    <div class="main-info">
      <answer-sheet-set />
      <answer-sheet-content
        ref="answerContent"
      />
    </div>
  </div>
</template>

<script>
import answerSheetLayout from './_pageLayout'
import answerSheetSet from './_basicSet'
import answerSheetContent from './_pageContent'
export default {
  components: {
    answerSheetLayout,
    answerSheetSet,
    answerSheetContent,
  },
  methods: {
    isPopEditor() {
      this.$refs.answerContent.isPopEditor()
    }
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
