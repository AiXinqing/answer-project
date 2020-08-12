<template>
  <div class="space_group_item">
      <span>题</span>
      <span> 1 </span>
      <span> 空 </span>
      <el-input v-model.number="data.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span>分</span>
    </div>
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
}
</script>

<style lang="less" scoped>
</style>