<template>
<div>
  <!-- 解答题 -->
  <answer-question-dialog ref="AnswerQuestionDialog"/>
  <!-- 选作题 -->
  <optional-question-dialog ref="optionalQuestionDialog"/>
  <!-- 作文英 -->
  <composition-english-dialog ref="compositionEnglish"/>
  <!-- 作文语文 -->
  <composition-language-dialog ref="compositionLanguage"/>
  <!-- 非作答区 -->
  <non-rresponse-area ref="NonRresponseArea"/>
</div>
</template>

<script>
import AnswerQuestionDialog from './_AnswerQuestionDialog'
import optionalQuestionDialog from './_optionalQuestionDialog'
import compositionEnglishDialog from './_compositionEnglishDialog'
import compositionLanguageDialog from './_compositionLanguageDialog'
import NonRresponseArea from './_NonRresponseArea'
export default {
  components: {
    AnswerQuestionDialog,
    optionalQuestionDialog,
    compositionEnglishDialog,
    compositionLanguageDialog,
    NonRresponseArea,
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
        case 'compositionEnglish':
          this.$refs.compositionEnglish.opened()
          break
        case 'compositionLanguage':
          this.$refs.compositionLanguage.opened()
          break
        case 'NonRresponseArea':
          this.$refs.NonRresponseArea.opened()
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
        case 'compositionEnglish':
          this.$refs.compositionEnglish.openedEdit({ ...obj, id: id })
          break
        case 'compositionLanguage':
          this.$refs.compositionLanguage.openedEdit({ ...obj, id: id })
          break
        case 'NonRresponseArea':
          this.$refs.NonRresponseArea.openedEdit({ ...obj, id: id })
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