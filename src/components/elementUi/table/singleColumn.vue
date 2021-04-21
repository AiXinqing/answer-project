<template>
  <el-table-column
    v-if="!column.childen"
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth"
    :align="column.align"
    :fixed="column.fixed"
    :sortable="column.sortable"
    show-overflow-tooltip
    :render-header="column.require?renderHeader:null"
    :filters="column.filters ? column.filters : null"
    :filter-method="column.filterMethod ? column.filterMethod : null"
    :filter-placement="column.filterPlacement ? column.filterPlacement : null">
      <!-- <template slot-scope="scope">
        <span v-if="column.type==='Html'" v-html="item.html(scope.row)" :style="item.itemStyle ? item.itemStyle(scope.row): ''"></span>
      </template> -->
    </el-table-column>
  <el-table-column
    v-else
    :label="column.label"
    :align="column.align"
  >
  <template
    v-for="(ele,index) in column.childen"
  >
    <el-table-column
    :key="`${i}_${index}`"
    :prop="ele.prop"
    :label="ele.label"
    :width="ele.width"
    :min-width="ele.minWidth"
    :align="ele.align"
    :fixed="ele.fixed"
    :sortable="ele.sortable"
    show-overflow-tooltip
    :render-header="ele.require?renderHeader:null"
    :filters="ele.filters ? ele.filters : null"
    :filter-method="ele.filterMethod ? ele.filterMethod : null"
    :filter-placement="ele.filterPlacement ? ele.filterPlacement : null" />
  </template>
  </el-table-column>
</template>

<script>
  export default {
    props: {
      column: {
        type: Object,
        default: ()=> {}
      },
      isShow:{
        type: String,
        default: ''
      }
    },
  }
</script>

<style lang="less">
</style>