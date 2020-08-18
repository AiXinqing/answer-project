<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span class="space_group_title">1</span>
      <el-input v-model.number="data.space" size="mini" class="space_group_item"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic">+ 添加小题</span>
      <i class="el-icon-del " >-</i>
  </div>
  </template>
  <el-collapse class="sub_item">
    <answer-sub-item/>
  </el-collapse>
</el-collapse-item>
</template>

<script>
import answerSubItem from './_subItem'
export default {
  components: {
    answerSubItem,
  },
  data () {
    return {
      data: {}
    }
  },
}
</script>

<style lang="less" scoped>
.sub_item {
  width: 96%;
  margin-left: 2%;
}
.space_group_item {
  margin-left: 41%;
}
.el-collapse {
  border-bottom: none;
}
</style>
