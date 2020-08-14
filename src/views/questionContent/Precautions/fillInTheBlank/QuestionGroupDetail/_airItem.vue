<template>
  <div class="space_group_item">
      <span>第</span>
      <span> {{ number }} </span>
      <span> 空 </span>
      <el-input v-model.number="SmallTopic.score" size="mini" @blur="ChangeSpaceValue(SmallTopic)" @click.stop.native="clickFun"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
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
      default: 1
    }
  },
  data () {
    return {
      SmallTopic: {}
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
  methods: {
    clickFun () {

    },
    ChangeSpaceValue (obj) {
      console.log(obj)
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