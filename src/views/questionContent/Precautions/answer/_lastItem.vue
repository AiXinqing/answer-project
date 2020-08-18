<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span @click.stop="clickFun">题 {{data.topic}} 共 </span>
      <span v-if=" data.childGroup == undefined || data.childGroup.length <= 0">
        <el-input v-model.number="data.space" size="mini"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span @click.stop="clickFun"> 空 每空 </span>
        <el-input v-model.number="data.score" size="mini"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
      </span>
      <span v-else>{{data.sum}} 分</span>
      <span class="add_groupTopic">+ 添加小题</span>
      <i class="el-icon-del "  >-</i>
  </div>
  </template>
  <el-collapse >
    <points-item/>
  </el-collapse>
</el-collapse-item>
</template>

<script>
import pointsItem from './_pointsItem'
export default {
  components: {
    pointsItem,
  },
  data () {
    return {
      data: {}
    }
  },
}
</script>

<style lang="less" >
.el-collapse {
  border-bottom: none;
}
</style>