<template>
  <section>
    <el-table
      :data="tableData"
      style="width: 100%">
      <!-- <el-table-column v-if="isIndex" type="index" :label="indexlabel"  width="50" :fixed="indexFixed"></el-table-column> -->
      <template v-if="!isCombination">
        <singleColumn
          v-for="(column,i) in tablecols"
          :key="i"
          :column="column"
        />
      </template>
      <template v-else>
        <doubleColumn
          v-for="(column,i) in tablecols"
          :key="i"
          :column="column"
        />
      </template>

    </el-table>
    <!-- 分页 -->
      <section class="ces-pagination" v-if='isPagination'>
        <el-pagination
          class="page-left"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total,sizes ,slot"
          :page-sizes="pageSizes"
          :page-size="pagination.pageSize"
          :current-page="pagination.pageNum"
          :total="pagination.total"
          popper-class="hj-page-select">
            <button type="button" :disabled="firstDisabled" @click="jumpPage('first')" class="btn-prev">
                <i class="el-icon el-icon-d-arrow-left"></i>
            </button>
        </el-pagination>
        <el-pagination
          class="page-right"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="prev, pager, next,slot,jumper"
          :page-sizes="pageSizes"
          :page-size="pagination.pageSize"
          :current-page="pagination.pageNum"
          :total="pagination.total"
          popper-class="hj-page-select">
            <button type="button" :disabled="lastDisabled" @click="jumpPage('last')" class="btn-next">
                <i class="el-icon el-icon-d-arrow-right"></i>
            </button>
        </el-pagination>
      </section>
  </section>
</template>

<script>
  import singleColumn from './singleColumn'
  import doubleColumn from './doubleColumn'
  export default {
    components: {
      singleColumn,
      doubleColumn
    },
    props: {
      // 表格列配置
      tablecols: {type: Array, default: () => []},
      isCombination:{
        type:Boolean,
        default:false
      },
      // 是否显示表格索引
      isIndex: {type: Boolean, default: true},
      indexlabel: {type: String, default: '序号'},
      indexFixed: {type: Boolean, default: false},
      // 是否显示分页
      isPagination: {type: Boolean, default: true},
      // 每页显示条数
      pageSizes: {type: Array, default: () => [20, 50, 100]},
    },
    data() {
      return {
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-06',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-07',
            name: '王小虎',
            province: '上海s',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }
        ],
        loading: false,
        firstDisabled: false,
        lastDisabled: false,
        // 分页数据
        pagination: {pageSize: 50, pageNum: 1, total: 0},
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
</style>