<template>
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入答题卡标题"
    v-model="textareaVal"
    @change="editPrecautionsTitile"
    resize="none"
  />
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    textareaData: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      textareaVal: this.textareaData,
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
  },
  methods: {
    ...mapMutations('page', ['pageData_edit']),
    editPrecautionsTitile(e) {
      let answerTitle = this.pageData[0]
      this.pageData_edit({
        ...answerTitle,
        content: {
          ...answerTitle.content,
          textVal: e,
        },
      })
    },
  },
}
</script>
