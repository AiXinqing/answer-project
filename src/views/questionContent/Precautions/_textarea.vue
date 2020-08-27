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
import { mapMutations } from 'vuex'
export default {
  props: {
    textareaData: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      textareaVal: this.textareaData,
    }
  },
  methods: {
    ...mapMutations('titleSet', ['editTextarea']),
    editPrecautionsTitile (e) {
      this.editTextarea(e)
    },
  },
}
</script>

<style lang="scss" scoped></style>
