<template>
  <div>
    <air-item
      v-for="(item,index) in subItemData"
      :key="index"
      :group-small-topic="item"
      :number="index + 1"
      @change-last-sub-topic-score="changeLastSubTopicScore"
    />
  </div>
</template>

<script>
import airItem from './_airItem' // 空
export default {
  components: {
    airItem,
  },
  props: {
    subItemData: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    changeLastSubTopicScore (obj) {
      this.$emit('change-last-sub-topic-score', obj)
    }
  },
}
</script>

<style lang="less" scoped>
</style>