<template>
  <el-collapse class="el-collapse-sub">
    <last-item
      v-for="(item,i) in subChildData"
      :key="i"
      :sub-item-info="item"
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