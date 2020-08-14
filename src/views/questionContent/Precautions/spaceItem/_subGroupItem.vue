<template>
  <el-collapse class="el-collapse-sub">
    <sub-collapse-item
      v-for="(item,i) in subChildData"
      :key="i"
      :sub-item-info="item"
    />
  </el-collapse>
</template>

<script>
import subCollapseItem from './_subCollapseItem'
export default {
  components: {
    subCollapseItem,
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