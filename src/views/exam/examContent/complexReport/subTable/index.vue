<template>
  <div class="complex_content">
    <hj-stretch
      v-for="(choose,i) in stretchBox"
      :key="i"
      :choose-list="choose">
    </hj-stretch>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left">
          <span class="titile_18">分数详情</span>
          <i>(点击学科的分数，可查看学生的答题卡)</i>
        </div>
        <div class="search_right">
          <exam-button type="primary">下载表格</exam-button>
          <exam-button type="primary">查询</exam-button>
          <hj-input v-model="text" placeholder="请输入12345">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </hj-input>
        </div>
      </div>

      <div class="el_table_wapper">
        <!-- <hj-table
          :tablecols='tableColumn'
        ></hj-table> -->
        <exam-table :is-combination="true" :tablecols="tableColumn"></exam-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        stretch: false,
        stretchBox:[
          {
            subject:'科目',
            type:'single',
            stretch:false,
            subjectList:[
              {
                name:'总分',
                id:1,
                check:true,
              },
              {
                name:'语文',
                id:2,
                check:false,
              },
              {
                name:'数学',
                id:3,
                check:false,
              },
              {
                name:'英语',
                id:4,
                check:false,
              }
            ]
          },
          {
            subject:'班级',
            type:'multiple',
            stretch:false,
            subjectList:[
              {
                name:'全部',
                id:1,
                check:true,
              },
              {
                name:'高中2020级01班',
                id:2,
                check:false,
              },
              {
                name:'高中2020级01班',
                id:3,
                check:false,
              },
              {
                name:'高中2020级01班',
                id:4,
                check:false,
              }
            ]
          }
        ],
        text:'',
        tableColumn:[
          {
            prop:'date',
            label:'姓名',
            minWidth:'80',
            fixed:'left'
          },{
            prop:'name',
            label:'考号',
            minWidth:'80',
          },
          {
            prop:'province',
            label:'学号',
            width:'1',
            childen:[
              {
                prop:'city',
                label:'班级',
                width:'80',
              },
              {
                prop:'address',
                label:'总分',
                minWidth:'140',
              },
              {
                prop:'zip',
                label:'客观题',
                width:'120',
              },
              {
                prop:'address',
                label:'客观题',
                minWidth:'180',
              },
            ]
          },
          {
            label: "操作",
            type: "Text",
            align: "left",
            fixed: "right",
            minWidth: 55,
          },
        ],
        tableData: [
          // {
          // date: '2016-05-03',
          // name: '王小虎',
          // province: '上海',
          // city: '普陀区',
          // address: '上海市普陀区金沙江路 1518 弄',
          // zip: 200333
          // },
          // {
          //   date: '2016-05-02',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // },
          // {
          //   date: '2016-05-04',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // },
          // {
          //   date: '2016-05-01',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // }, {
          //   date: '2016-05-08',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // }, {
          //   date: '2016-05-06',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // }, {
          //   date: '2016-05-07',
          //   name: '王小虎',
          //   province: '上海',
          //   city: '普陀区',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   zip: 200333
          // }
        ]
      }
    },
    methods: {
      handleStretch() {
        this.stretch = !this.stretch
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .complex_content{
    width: 100%;
    background-color: @white;
    margin-top: 10px;
    padding: 5px 0;
    height: 100%;
  }

  .table_wapper {
    height: auto;
    margin-top: 15px;
    padding: 0 15px 10px 15px;

    .table_search{
      display: flex;
      height: 40px;

      .search_left{
        width: 300px;
        flex-shrink:0;
        line-height: 40px;

        .titile_18{
          font-size: 18px;
        }
        i{
          font-size: 12px;
          margin-left: 10px;
          color: @font-909;
        }
      }

      .search_right{
        width: 100%;
        flex-shrink:1;
        justify-content:flex-end;

        &>div{
          margin-top: 10px;
          float: right;
          margin-left: 10px;
        }

        &:after {
          content: "";
          clear: both;
          display: block;
        }

        .exam_box{
          margin-top: 15px;
        }
      }
    }

    .el_table_wapper{
      margin-top: 30px;
    }
  }
</style>