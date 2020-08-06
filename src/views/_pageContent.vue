<template>
  <div class="container-card">
    <div
      v-for="(item, i) in contentData"
      :key="i"
      class="page-contents"
      :style="{ width: pageWidth + 'px' }"
    >
      <div
        v-for="(row, a) in item"
        :key="a"
        class="footer"
        :style="{ minHeight: row.castHeight + 'px' }"
      >
        <component
          :is="row.questionType"
          :content-data="row.content"
          :question-data="row"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
        />
      </div>
    </div>
    <!-- 学生标题 -->
    <column-dialog ref="studentDialog" />
    <!-- 准考证号 -->
    <admission-number-dialog ref="admissionDialog" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import columnDialog from './dialog/_studentColumnDialog'
import AdmissionNumberDialog from './dialog/_AdmissionNumberDialog'
export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    columnDialog,
    AdmissionNumberDialog,
  },
  data () {
    return {
      contentData: [],
    }
  },
  computed: {
    ...mapState('pageContent', ['pageLayout', 'pageData', 'page_size']),
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 520
        : 785
    }
  },
  watch: {
    pageData: {
      immediate: true,
      handler () {
        this.contentData = this.pageContentFunc(this.pageData)
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    ...mapActions('pageContent', ['getPageData']),
    hanldeStudent (Arr) {
      this.$refs.studentDialog.openedFrameFunc(Arr)
    },
    editAdmissionNumber () {
      this.$refs.admissionDialog.openedFrameFunc()
    },
    pageContentFunc (rects = []) {

      const results = []
      // currentPage.height 总高度
      var currentPage = {
        height: 0,
        rects: [],
      }
      // 重置高度
      function resetCurrentPage () {
        currentPage.height = 0
        currentPage.rects = []
      }
      rects.forEach((rect) => {
        const avalibleHeight = this.page_size - currentPage.height
        if (rect.height > avalibleHeight) {
          // 分页-剩余高度新建rect
          currentPage.rects.push({
            ...rect,
            castHeight: avalibleHeight,
          })
          results.push(currentPage.rects) // 增加一页
          resetCurrentPage()
          // 判断当前rect高度能分几页
          let height = rect.height - avalibleHeight
          while (height > this.page_size) {
            results.push([{
              ...rect,
              castHeight: this.page_size,
            },])
            height -= this.page_size
          }
          currentPage.height = height
          currentPage.rects.push({
            ...rect,
            castHeight: height,
          })
        } else {
          currentPage.height += rect.height
          currentPage.rects.push({
            ...rect,
            castHeight: rect.height,
          })
        }
      })
      if (currentPage.height) {
        results.push(currentPage.rects)
      }
      return results
    }
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
