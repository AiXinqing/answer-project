<template>
  <div class="space_group_list">
    <span>题 1 共 </span>
    <el-input v-model.number="data.space" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 空 每空 </span>
    <el-input v-model.number="data.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 分 共4分 </span>
    <span class="add_groupTopic">+ 添加小题</span>
    <i class="el-icon-delete" @click="hanldeDel" ></i>
  </div>
</template>

<script>
export default {
  methods: {
    hanldeDel () {

    }
  },
}
</script>

<style lang="scss" scoped>
</style>