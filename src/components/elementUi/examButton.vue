<template>
  <el-button v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-button>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>