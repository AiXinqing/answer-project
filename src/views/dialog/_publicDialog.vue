<template>
  <answer-question-dialog ref="AnswerQuestionDialog"/>
</template>

<script>
import AnswerQuestionDialog from './_AnswerQuestionDialog'
export default {
  components: {
    AnswerQuestionDialog,
  },
  computed: {
    isComponent () {
      return AnswerQuestionDialog
    }
  },
  methods: {
    opened (type) {
      switch (type) {
        case 'answerQuestion':
          this.$refs.AnswerQuestionDialog.opened()
          break
        default:
          break
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>