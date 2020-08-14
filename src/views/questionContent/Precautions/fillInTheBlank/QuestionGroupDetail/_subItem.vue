<template>
  <div>
    <air-item
      v-for="(item,index) in subItemData"
      :key="index"
      :group-small-topic="item"
      :number="index + 1"
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
}
</script>

<style lang="less" scoped>
</style>