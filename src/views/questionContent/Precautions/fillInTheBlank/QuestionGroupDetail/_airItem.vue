<template>
  <div class="space_group_item">
      <span>第</span>
      <span> {{ number }} </span>
      <span> 空 </span>
      <el-input v-model.number="score" size="mini" @blur="changeLastSubTopicScore(SmallTopic)" @click.stop.native="clickFun"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
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
      score: this.GroupSmallTopic.score
    }
  },
  watch: {
    GroupSmallTopic: {
      immediate: true,
      handler () {
        this.SmallTopic = { ...this.GroupSmallTopic }
      }
    }
  },
  mounted () {
    this.oldObj = JSON.parse(JSON.stringify(this.SmallTopic));
  },
  methods: {
    clickFun () {

    },
    changeLastSubTopicScore (obj) {
      let newObj = {
        ...obj,
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