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
      <template slot-scope="scope">
        <span v-if="column.type==='Html'" v-html="columnHtml(scope.row,column.prop)">{{column.prop}}</span>
        <el-button v-if="column.type==='Text'"  type="text" class="text_button" v-html="columnHtml(scope.row,column.prop)">{{column.prop}}</el-button>
      </template>
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
      :filter-placement="ele.filterPlacement ? ele.filterPlacement : null">
      <template slot-scope="scope">
        <span v-if="ele.type==='Html'" v-html="columnHtml(scope.row,ele.prop)">{{ele.prop}}</span>
        <el-button v-if="ele.type==='Text'"  type="text" class="text_button" v-html="columnHtml(scope.row,ele.prop)">{{ele.prop}}</el-button>
      </template>
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

    data() {
      return {
        columnHtml: (row,prop) => {
          return row[prop]
        }
      }
    },

    methods: {
      handleClick(row) {
        console.log(row)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el-button--medium.text_button{
    width:auto;
    padding: 0 15px;
    height:auto;
    line-height:28px;
    font-size:14px;
    position: relative;
    top: -1px;
  }
  .el-button--text{
    color:@main
  }
  .el-button.text_button:focus,
  .el-button.text_button:hover{
    // background-color:@bc_tr !important;
    // border-color:@bc_tr !important;
  }
</style>