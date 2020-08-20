<template>
  <div class="big-item">
    <span>几选几:</span>
    <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 选 </span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> ;每题 </span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 分;题号 </span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 到</span>
    <el-input v-model.number="data.end" size="mini" disabled @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
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
  methods: {
    groupTopicHanlde () {

    }
  },
}
</script>

<style lang="scss" scoped>
</style>