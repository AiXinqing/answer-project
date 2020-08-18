<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span class="space_group_title">1.1</span>
      <el-input v-model.number="data.space" size="mini" class="space_group_items"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic">+ 添加小题</span>
      <i class="el-icon-del " >-</i>
  </div>
  </template>
  <el-collapse class="sub_item">
    <answer-last-item/>
  </el-collapse>
</el-collapse-item>
</template>

<script>
import answerLastItem from './_lastItem'
export default {
  components: {
    answerLastItem,
  },
  data () {
    return {
      data: {}
    }
  },
}
</script>

<style lang="less">
.space_group_items {
  margin-left: 38%;
}
.space_group_list {
  margin: 10px 0;
  width: 100%;
}
.el-collapse {
  border-bottom: none;
}
</style>



