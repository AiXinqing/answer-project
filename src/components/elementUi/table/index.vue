<template>
  <section>
    <el-table
      :data="tableData"
      style="width: 100%">
      <!-- 标题栏- 合并 -->
      <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
      <el-table-column v-if="isIndex" type="index" :label="indexlabel" align="center" width="50" :fixed="indexFixed"></el-table-column>
      <singleColumn
        v-for="(column,i) in tablecols"
        :key="i"
        :column="column"
      />
      <!-- 标题栏- 合并 -->
    </el-table>
    <!-- 分页 -->
      <section class="ces-pagination" v-if='isPagination'>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageNum"
        :total="pagination.total"
        >
        </el-pagination>

      </section>
  </section>
</template>

<script>
  import singleColumn from './singleColumn'
  export default {
    components: {
      singleColumn,
    },
    props: {
      // 表格列配置
      tablecols: {type: Array, default: () => []},
      tableData: {type: Array, default: () => []},
      // 是否显示表格索引
      isIndex: {type: Boolean, default: true},
      // 是否显示表格复选框
      isSelection: {type: Boolean, default: false},
      indexlabel: {type: String, default: '序号'},
      indexFixed: {type: Boolean, default: false},
      // 是否显示分页
      isPagination: {type: Boolean, default: true},
      // 每页显示条数
      pageSizes: {type: Array, default: () => [10,20,30,50,100]},
      currentPage:{type: Number, default: 4},
      // pagination:{
      //   type:Object,
      //   default:() =>{}
      // }
    },
    data() {
      return {
        loading: false,
        firstDisabled: false,
        lastDisabled: false,
        // 分页数据
        pagination: {pageSize: 10, pageNum: 2, total: 100},
      }
    },
    methods: {
      // 显示第几页
      handleCurrentChange(val) {
        this.pagination.pageNum = val;
        this.getTableData(this.pagination.pageSize, val);
        this.$nextTick(()=>{
          this.$refs.cesTable.bodyWrapper.scrollTop = 0;
          this.$refs.cesTable.bodyWrapper.scrollLeft = 0;
        })
      },
      // 每页显示的条数
      handleSizeChange(val) {
          this.pagination.pageSize = val;
          // 在改变每页显示的条数时，要将页码显示到第一页
          this.pagination.pageNum = 1;
          this.getTableData(val, 1);
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el-table__row{
    &:nth-child(even){
      background-color: @bc_f5
    }
    &:nth-child(odd){
      background-color: @white
    }
  }

  .el-table .ascending .sort-caret.ascending{
    border-bottom-color:@main
  }
  .el-table {
    .descending {
      .sort-caret{
        &.descending{
          border-top-color:@main
        }
      }
    }
    .caret-wrapper{
      width: 17px;
    }
  }
  .el-table--medium td,
  .el-table--medium th{
    padding: 0px 0;
    padding-top: 6px;
  }
  .el-table--border td:first-child .cell, .el-table--border th:first-child .cell, .el-table .cell, .el-table th div{
    padding-left: 5px;
  }
  .el-table .cell, .el-table th div{
    padding-right: 5px;
  }

  // table分页
  .el-pagination{
    margin-top: 15px;
  }
  .el-pagination__sizes{
    .el-input{
      .el-input__inner{
        &:hover{
          border-color:@main
        }
      }
    }
  }
  .el-select-dropdown__item{
    &.selected{
      color:@main
    }
  }
  .el-pager{
    li{
      &:hover,
      &.active{
        color:@main;
        background-color: @main;
        color: @white;
      }
      background: @font-f4f5;
      margin: 0 4px;
      border-radius: 4px;
      padding: 0 0;
      color:@font-888;
    }
  }
  .el-pagination__editor{
    &.el-input{
      .el-input__inner{
        font-size: 14px;
      }
    }
  }
</style>