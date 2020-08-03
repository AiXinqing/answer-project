<template>
  <el-row >
    <el-col :span="4" class="question_tabtitle">{{childItem.topic}}</el-col>
    <el-col :span="20" class="group_item_right">
      <div>
        <el-input v-model="score" size="mini" />
        <span>分,少选得</span>
        <el-input v-model="lessScore" size="mini" />
        <span>分</span>
        <el-input v-model="select" size="mini" />
        <span>个选项</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    childItem: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      score: this.childItem.score,
      lessScore: this.childItem.lessScore,
      select: this.childItem.select,
    }
  },
}
</script>

<style lang="less" scoped>
.group_item {
  .el-row {
    border-bottom: 1px solid #888;
  }
  .el-row:last-child {
    border-bottom: none;
  }
}
</style>
