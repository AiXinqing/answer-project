<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span class="p-5"> 题到 </span>
    <el-input v-model.number="data.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span class="p-5"> 题 </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    formData: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapState('questionType', [
      'currentQuestion',
      'AlreadyTopics',
      'determineTopic', // 确定小题数值
    ]),
  },
  watch: {
    formData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.formData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.currentQuestion
        }
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>