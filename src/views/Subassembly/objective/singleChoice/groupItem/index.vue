<template>
  <el-row >
    <el-col :span="4" class="question_tabtitle" >{{childItem.topic}}</el-col>
    <el-col :span="20" class="group_item_right">
      <div>
        <el-input v-model="data.score" size="mini" @blur="editHanldeVal" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
        <span>分</span>
        <el-input v-model.number="data.select" size="mini" @blur="editHanldeVal" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
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
        const {score,select} = this.childItem
        this.data = {
          ...this.childItem,
          score:Number(score.toString().match(/^\d+(?:\.\d{0,1})?/)),
          select: typeof(select)=='string' ? 4 : select,
        }
      }
    }
  },
  methods: {
    editHanldeVal () {
      let status = false
      let score = parseFloat(this.data.score)
      if (score == '') {
        score = this.childItem.score
        status = true
      } else { status = false }
      if (this.data.select == '') {
        this.data.select = this.childItem.select
        status = true
      } else { status = false }
      if (!status) {
        this.$emit('edit-topic-func', this.data, 'singleBox')
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
