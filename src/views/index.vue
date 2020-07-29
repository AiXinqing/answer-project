<template>
  <div>
    s
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'app',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('answerSheet', ['GroupDataArr', 'PageLayout']),
  },
  mounted() {
    const TestData = [
      {
        id: 1,
        height: 380,
        questionType: 'AnswerSheetTitle',
        content: [{ title: '' }],
      },
      { id: 2, height: 120, questionType: 'ObjectiveQuestion', content: [] },
      // { id: 3, height: 90, questionType: '', content: [] },
      // { id: 4, height: 900, questionType: '', content: [] },
      // { id: 5, height: 350, questionType: '', content: [] }
    ]
    this.groupPage(TestData)
  },
  methods: {
    ...mapActions('answerSheet', ['editGroupData', 'groupPage', 'editLayout']),
  },
}
</script>

<style lang="scss" scoped></style>
