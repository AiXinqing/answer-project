<template>
  <el-collapse class="el-collapse-sub">
    <last-item
      v-for="(item,i) in subChildData"
      :key="i"
      :sub-item-info="item"
      :number="i +1"
      @hanlde-last-topic-del="hanldeLastTopicDel"
      @change-last-sub-topic-score="changeLastSubTopicScore"
    />
  </el-collapse>
</template>

<script>
import lastItem from './_lastItem'
export default {
  components: {
    lastItem,
  },
  props: {
    subChildData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    hanldeLastTopicDel (obj) {
      this.$emit('hanlde-last-topic-del', obj)
    },
    changeLastSubTopicScore (obj, oldObj) {
      // last-sub分值改变
      this.$emit('change-last-sub-topic-score', obj, oldObj)
    }
  },
}
</script>

<style lang="less" scoped>
.el-collapse {
  padding: 0 5%;
  margin-bottom: 0;
}
.sub-item-group .el-input--mini {
  width: 48px;
}
.el-collapse {
  border-bottom: none;
}
</style>