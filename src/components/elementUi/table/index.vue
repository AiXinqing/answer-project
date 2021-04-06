<template>
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
    },
    data() {
      return {
        tableData: [{
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
        }]
      }
    }
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