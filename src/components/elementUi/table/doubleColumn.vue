<template>
  <section>
    <template  v-if="column.childen">
      <el-table-column
        :label="column.label">
        <singleColumn
          v-for="(item,i) in column.childen"
          :key="i"
          :column="item"
          :is-show="column.prop"
        />
      </el-table-column>
    </template>
    <singleColumn :column="column"/>
  </section>
</template>
<script>
  import singleColumn from './singleColumn'
  export default {
    components: {
      singleColumn,
    },
    props: {
      column: {
        type: Object,
        default: ()=> {}
      },
    },
  }
</script>

<style lang="less">

</style>