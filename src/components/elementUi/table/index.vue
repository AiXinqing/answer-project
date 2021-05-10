<template>
  <section>
    <template v-if="height == 0">
      <el-table
        :data="tableData"
        :style="['width: 100%']"
        :element-loading-text="loadingText"
        :border="isBorder"
        element-loading-spinner="el-icon-loading"
        :highlight-current-row="true"
        v-loading="loading"
      >
      <!-- 标题栏- 合并 -->
        <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
        <el-table-column v-if="isIndex" type="index" :label="indexlabel" align="center" width="50" :fixed="indexFixed"></el-table-column>
        <singleColumn
          v-for="(column,i) in tablecols"
          :key="i"
          :column="column"
          @hanlde-pop-func="hanldePopFunc"
        />
        <!-- 标题栏- 合并 -->
      </el-table>
    </template>
    <template v-else>
      <el-table
        :data="tableData"
        :style="['width: 100%']"
        :element-loading-text="loadingText"
        :border="isBorder"

        element-loading-spinner="el-icon-loading"
        v-loading="loading"
      >
        <!-- 标题栏- 合并 -->
        <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
        <el-table-column v-if="isIndex" type="index" :label="indexlabel" align="center" width="50" :fixed="indexFixed"></el-table-column>
        <singleColumn
          v-for="(column,i) in tablecols"
          :key="i"
          :column="column"
          @hanlde-pop-func="hanldePopFunc"
        />
        <!-- 标题栏- 合并 -->
      </el-table>
    </template>
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
      theight: {type: Number, default: 500},
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
      pageSizes: {type: Array, default: () => [15,20,30,50,100]},
      currentPage:{type: Number, default: 4},
      // 行高,为计算显示区域
      rowHeight: {
        type: Number,
        default: 30
      },
      //是否显示表格竖向边框
      isBorder: {type: Boolean, default: true},
      loading:{
        type:Boolean,
        default: false
      },
      loadingText:{
        type:String,
        default:'拼命加载中'
      },
      pagination: {type: Object, default: () => ({
        pageSize: 15,
        pageNum: 1,
        total: 0
      })},
    },
    data() {
      return {
        firstDisabled: false,
        lastDisabled: false,
        // 分页数据
        height:500,
      }
    },

    watch: {
      theight: {
        immediate: true,
        handler () {
          this.height = this.theight
        }
      },

    },

    methods: {
      // 显示第几页
      handleCurrentChange(val) {
        this.$emit('handle-current-change',val)
      },
      // 每页显示的条数
      handleSizeChange(val) {
        this.$emit('handle-size-change',val)
      },

      hanldePopFunc(row){
        // 弹出框分数
        this.$emit('hanlde-pop-func',row)
      }

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el-table--enable-row-transition .el-table__body td{
    height:35px;
  }
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
    .cell.el-tooltip{
      height:100%;
      line-height:35px;
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
      font-size: 13px;
      min-width: 30.5px;
      font-weight: 500;
      height: 26px;
      line-height: 26px;
    }
  }
  .el-pagination__editor{
    &.el-input{
      .el-input__inner{
        font-size: 14px;
      }
    }
  }
  .el-table--medium td,
  .el-table--medium th{
    padding-top: 0
  }
  table tr td div:last-child{
    margin-bottom:0
  }
  .el-loading-spinner{
    i{
      color:@main
    }
    .el-loading-text{
      color:@main
    }
  }
  thead.is-group tr {
    height: 30px;
  }

  .el-table tbody tr:hover>td {
    background-color:@mainHover !important
  }

</style>