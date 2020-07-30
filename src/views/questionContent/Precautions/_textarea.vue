<template>
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入答题卡标题"
    v-model="textareaVal"
    @input="editPrecautionsTitile"
    resize="none"
  />
</template>

<script>
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions('answerSheetTitle', ['PrecautionsTextFunc']),
    editPrecautionsTitile(e) {
      this.PrecautionsTextFunc(e)
    },
  },
}
</script>

<style lang="scss" scoped></style>
