<template>
  <div class="space_group_item">
      <span>题</span>
      <span> 1 </span>
      <span> 空 </span>
      <el-input v-model.number="SmallTopic.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span>分</span>
    </div>
</template>

<script>
export default {
  props: {
    GroupSmallTopic: {
      type: Object,
      default: () => []
    },
  },
  data () {
    return {
      SmallTopic: {}
    }
  },
  watch: {
    GroupSmallTopic: {
      immediate: true,
      handler () {
        this.SmallTopic = { ...this.GroupSmallTopic }
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>