<template>
<div>
  <answer-question-dialog ref="AnswerQuestionDialog"/>
  <optional-question-dialog ref="optionalQuestionDialog"/>
</div>
</template>

<script>
import AnswerQuestionDialog from './_AnswerQuestionDialog'
import optionalQuestionDialog from './_optionalQuestionDialog'
export default {
  components: {
    AnswerQuestionDialog,
    optionalQuestionDialog,
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
        case 'optionalQuestion':
          this.$refs.optionalQuestionDialog.opened()
          break
        default:
          break
      }
    },
    openedEdit (type, obj, id) {
      switch (type) {
        case 'answerQuestion':
          this.$refs.AnswerQuestionDialog.openedEdit(obj)
          break
        case 'optionalQuestion':
          this.$refs.optionalQuestionDialog.openedEdit({ ...obj, id: id })
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