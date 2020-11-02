<template>
  <div class="space_group_item" @click="clickFun">
      <span>第</span>
      <span> {{ number }} </span>
      <span> 空 </span>
      <el-input v-model="score" size="mini" @blur="changeLastSubTopicScore"
        onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span>分</span>
    </div>
</template>

<script>
export default {
  props: {
    GroupSmallTopic: {
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
      SmallTopic: {},
      score: Number(this.GroupSmallTopic.score.toString().match(/^\d+(?:\.\d{0,1})?/))
    }
  },
  watch: {
    GroupSmallTopic: {
      immediate: true,
      handler () {
        this.SmallTopic = { ...this.GroupSmallTopic }
        this.oldObj = JSON.parse(JSON.stringify(this.GroupSmallTopic));
      }
    }
  },

  methods: {
    clickFun () {

    },
    changeLastSubTopicScore () {
      console.log(12)
      let newObj = {
        ...this.SmallTopic,
        score: this.score
      }
      this.$emit('change-last-sub-topic-score', newObj, this.oldObj)
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