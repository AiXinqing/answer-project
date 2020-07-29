<template>
  <div class="container-card">
    <div
      v-for="(item, i) in GroupDataArr"
      :key="i"
      class="page-contents"
      :style="{ width: PageLayout.pageWidth + 'px' }"
    >
      <div
        v-for="(row, a) in item"
        :key="a"
        class="footer"
        :style="{ minHeight: row.castHeight + 'px' }"
      >
        <component :is="row.questionType" :content-data="row.content" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
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
    ]
    this.groupPage(TestData)
  },
  methods: {
    ...mapActions('answerSheet', ['editGroupData', 'groupPage', 'editLayout']),
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.container-card {
  position: relative;
  padding-top: 30px;
  width: calc(100% - 330px);
  height: calc(100% - 20px);
  overflow: auto;
  float: left;
}
.page-contents {
  width: 785px;
  height: 1170px;
  border: 1px solid @font-333;
  overflow: hidden;
  background: @white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  .footer {
    position: relative;
    padding-top: 20px;
    width: calc(100% - 40px);
    left: 20px;
  }
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
