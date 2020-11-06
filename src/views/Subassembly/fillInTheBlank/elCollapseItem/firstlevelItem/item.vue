<template>
  <div class="space_group_item" @click="clickFun">
      <span>第</span>
      <span> {{ data.smallTopic }} </span>
      <span> 空 </span>
      <el-input v-model="data.score" size="mini" @blur="preEditLastSubtopic"
        onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span>分</span>
    </div>
</template>

<script>
export default {
  props: {
    subtopic: {
      type: Object,
      default: () => []
    },
    number: {
      type: Number,
      default: 1,
      oldObj: {}
    }
  },
  data () {
    return {
      data: {},
      score: Number(this.subtopic.score.toString().match(/^\d+(?:\.\d{0,1})?/))
    }
  },
  watch: {
    subtopic: {
      immediate: true,
      handler () {

        this.data = { ...this.subtopic }
        this.oldObj = JSON.parse(JSON.stringify(this.subtopic));
      }
    }
  },

  methods: {
    clickFun () {

    },
    preEditLastSubtopic () {

      let newObj = {
        ...this.SmallTopic,
        score: this.score
      }
      this.$emit('pre-Edit-last-subtopic', newObj, this.oldObj)
    }
  },
}
</script>

<style lang="less" scoped>
.space_group_item {
  margin-bottom: 10px;
}

.space_group_item .el-input--mini {
  width: 48px;
}
</style>