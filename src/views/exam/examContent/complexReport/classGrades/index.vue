<template>
  <div class="complex_content">
    <hj-stretch
      v-for="(choose,i) in stretchBox"
      :key="i"
      :choose-list="choose">
    </hj-stretch>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left is_active">
          <span>得分率说明：优秀：90% - 100% 良好：80% - 100% 及格：60% - 100% 低分：0% - 30%<a href="###" class="set_parameter">设置参数</a></span>
        </div>
        <div class="search_right">
          <exam-button type="primary">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table
          :is-combination="true"
          :tablecols="tableColumn"
          :is-pagination="false"
        ></exam-table>
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
  .table_wapper{
    .search_left{
      &.is_active{
        width: calc(100% - 120px);
        font-size: 14px;
        color: @font-666;
        span{
          display: block;
          width: 100%;
        }
      }
    }
    .el_table_wapper{
      margin-top: 10px;
    }
    .set_parameter{
      color: @main;
      margin-left: 10px;
    }
  }
</style>