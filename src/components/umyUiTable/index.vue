<template>
  <div>
    <ux-grid
      ref="plTable"
      :data="tableData"
      :height="autoHeight ? null : height_table + singleHeight"
      :max-height="maxHeight ? maxHeight : null"
      use-virtual
      :stripe="false"
      :row-style="{'height': rowStyle + 'px'}"
      :border="isBorder"
      v-loading="loading"
      :header-drag-style="false"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      show-overflow
      show-summary
      show-header-overflow="ellipsis"
      :pagination-show="isPagination"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.pageNum"
      :page-sizes="pageSizes"
      :data-changes-scroll-top="radio"
      @table-body-scroll="tableScroll"
      @handlePageSize="handlePageSize">

      <u-table-column v-if="isIndex" type="index" width="100" fixed/>

      <singleColumn
        v-for="(column,i) in tablecols"
        :key="i+Math.random()"
        :column="column"
        @hanlde-pop-func="hanldePopFunc"
      />

    </ux-grid>
  </div>
</template>

<script>
  import singleColumn from './_singleColumn'
  export default {
    components: {
      singleColumn,
    },
    props:{
      rowStyle:{
        Number,
        default: 35
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      theight: {type: Number, default: 500},
      maxHeight:{type: Number, default: 0},
       // 表格列配置
      tablecols: {type: Array, default: () => []},
      tableData: {type: Array, default: () => []},
      // 是否显示表格索引
      isIndex: {type: Boolean, default: true},
      // 是否显示分页
      isPagination: {type: Boolean, default: true},
      // 每页显示条数
      pageSizes: {type: Array, default: () => [15,20,30,50,100]},
      currentPage:{type: Number, default: 4},
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
      singleHeight:{
        Number,
        default: 0
      }
    },

    data() {
      return {
        radio: true,
        height_table:500,
      }
    },

    watch: {
      theight: {
        immediate: true,
        handler () {
          this.height_table = this.theight
        }
      },

      tableData: {
        immediate: true,
        handler () {
          this.pagingScrollTopLeft()
        }
      },
    },

    methods: {
      tableScroll () {
        //
        // {scrollTop， scrollLeft, table, judgeFlse: 这个参数返回一个boolean值，为true则代表表格滚动到了底部了，false没有滚动到底部，必须开起大数据渲染模式才能有值哦}, event
        // console.log(scrollTop, scrollLeft, table, judgeFlse)
      },

      hanldePopFunc(row){
        // 弹出框分数
        this.$emit('hanlde-pop-func',row)
      },

      // 分页事件
      handlePageSize ({page, size}) {
        this.$emit('hanlde-page-size',{page, size})
      },

      pagingScrollTopLeft () {
        if(this.$refs.plTable){
          this.$nextTick(()=>{
            let _this = this
            setTimeout(function(){
              _this.$refs.plTable.pagingScrollTopLeft(0, 0)
          },500)
          })
        }
      },
    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el-pagination{
    text-align: left;
    .btn-next,
    .btn-prev{
      background: @font-f4f5;
      margin: 0 4px;
      border-radius: 4px;
      padding: 0 0;
      color:@font-888;
      font-size: 13px;
      min-width: 30.5px;
      font-weight: 500;
    }
    button{
      &:hover{
        color:@main
      }
    }
  }
  .plTableBox {
    padding-bottom: 20px;
    .myPagination{
      padding-top: 0px;
    }
    .el-button--medium{
      width:auto
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
      font-size: 14px;
      min-width: 30.5px;
      font-weight: 500;
    }
  }
  
  .el-select-dropdown__item{
    &.selected{
      color:@main
    }
  }

  .el-pagination__sizes {
    .el-input {
      .el-input__inner{
        &:hover{
          border-color:@main
        }
      }
    }
  }
  
  .el-pagination__editor.el-input {
    .el-input__inner{
      font-size: 16px;
    }
  }
  .el-button--text{
    color:@main
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
  .elx-table .elx-body--column.col--ellipsis, .elx-table.elx-editable .elx-body--column, .elx-table .elx-footer--column.col--ellipsis, .elx-table .elx-header--column.col--ellipsis{
    height:auto
  }
  .elx-table .elx-body--column:not(.col--ellipsis), .elx-table .elx-footer--column:not(.col--ellipsis), .elx-table .elx-header--column:not(.col--ellipsis){
    padding:8px 0;
  }
  .elx-table .elx-body--row.row--checked, .elx-table .elx-body--row.row--current, .elx-table .elx-body--row.row--radio{
    background-color: @mainHover !important
  }
  .elx-table .elx-body--row.row--hover.row--current{
    background-color: @mainHover !important
  }
  .elx-table.border--full .elx-table--fixed-left-wrapper{
    border-right:none
  }

  button.el-button.el-button--default.el-button--medium.pop_Btn{
    background-color: transparent !important;
    font-size:14px;
    &:hover{
        color: @main !important;
        border-color: transparent !important;
        background-color: transparent !important;
    }
  }
  .el-button--text:focus{
    color: @main !important;
  }
  tr.elx-header--row th div{
    min-height: 35px;
  }

  .elx-table--body-wrapper, .elx-table--fixed-left-body-wrapper, .elx-table--fixed-right-body-wrapper{
    background-blend-mode:overlay
  }
</style>