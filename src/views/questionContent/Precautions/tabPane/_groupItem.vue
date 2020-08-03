<template>
  <el-row class="group_item">
    <el-col :span="4" class="question_tabtitle">1</el-col>
    <el-col :span="20" class="group_item_right">
      <template v-if="activeNameItem == 'singleBox'">
        <el-input v-model="score" size="mini" />
        <span>分</span>
        <el-input v-model="select" size="mini" />
        <span>个选项</span>
      </template>
      <template v-if="activeNameItem == 'checkbox'">
        <el-input v-model="score" size="mini" />
        <span>分,少选得</span>
        <el-input v-model="lessScore" size="mini" />
        <span>分</span>
        <el-input v-model="select" size="mini" />
        <span>个选项</span>
      </template>
      <template v-if="activeNameItem == 'judgment'">
        <el-input v-model="score" size="mini" />
        <span>分</span>
        <el-input v-model="select" disabled size="mini" />
        <span>个选项</span>
      </template>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    childGroupData: {
      type: Object,
      default: () => {},
    },
    activeNameItem: {
      type: String,
      default: 'singleBox',
    },
  },
  data() {
    return {
      score: this.childGroupData.score,
      lessScore: this.childGroupData.lessScore,
      select: this.childGroupData.select,
    }
  },
}
</script>

<style lang="less" scoped></style>
