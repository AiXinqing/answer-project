<template>
  <el-row >
    <el-col :span="4" class="question_tabtitle">{{childItem.topic}}</el-col>
    <el-col :span="20" class="group_item_right">
      <div>
        <el-input v-model="data.score" size="mini" @blur="editHanldeVal" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span>分</span>
        <el-input v-model="data.select" disabled size="mini" />
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
      data: {}
    }
  },
  watch: {
    childItem: {
      immediate: true,
      handler () {
        this.data = {
          ...this.childItem
        }
      }
    }
  },
  methods: {
    editHanldeVal () {
      let status = false
      if (this.data.score == '') {
        this.data.score = this.childItem.score
        status = true
      } else { status = false }
      if (!status) {
        this.$emit('edit-topic-func', this.data, 'judgment')
      }
    },
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
