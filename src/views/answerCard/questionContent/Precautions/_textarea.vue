<template>
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入答题卡标题"
    v-model="textareaVal"
    @change="editPrecautionsTitile"
    resize="none"
    id="inputs"
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
      var long=(e.replace(/\n/g, '<br>').split('<br>')).length-1
      let height = long * 40 + 40

      let answerTitle = this.pageData[0]
      this.pageData_edit({
        ...answerTitle,
        heightTitle:height,
        content: {
          ...answerTitle.content,
          textVal: e.replace(/\n/g, '<br>'),
        },
      })
    },
  },
}
</script>
