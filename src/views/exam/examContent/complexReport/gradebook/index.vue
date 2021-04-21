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
          <hj-input v-model="keyWords" placeholder="请输入12345">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </hj-input>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table
          :tablecols="tableColumn"
          :tableData="tableData"
          :isIndex="false"
          ></exam-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        stretch: false,
        stretchBox:[],
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            minWidth:'140',
            align:'center',
            fixed:'left'
          },
          {
            prop:'stuname',
            label:'姓名',
            minWidth:'100',
            align:'center',
          },
          {
            prop:'tnumber',
            label:'考号',
            minWidth:'100',
            align:'center',
          },
          {
            prop:'snumber',
            label:'学号',
            minWidth:'120',
            align:'center',
          },
        ],
        columnMultiLine:[
          {
            prop:'tscore',
            label:'分数',
            width:'85',
            align:'center',
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            width:'90',
            align:'center',
          },
          {
            prop:'classRank',
            label:'班级排名',
            width:'90',
            align:'center',
          },
        ],
        tableColumn:[],
        tableData: [],
        prmTid: '',
        tsid:'',
        classIds:[],
        keyWords:'',
        pageTable: {
          pageIndex:1,
          pageSize:10,
        }
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','headerTable','TableList']),
      ...mapGetters('getExam', ['examInfo'])
    },

    mounted () {
      if(this.prmTid != ''){
        //this.getExamFunc(this.prmTid)
      }
    },

    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query.prmTid) {
            this.prmTid = query.prmTid
          }
        },
        immediate: true
      },
    },

    methods: {
      handleStretch() {
        this.stretch = !this.stretch
      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.stretchBox = this.examInfo
            this.subjectsArr.forEach((element,i) => {
              if(i == 0){
                this.tsid = element.tsid
              }
            })
            this.$nextTick(()=>{
              // 获取动态表头
              this.getDynamicHeader(prmTid,this.tsid)
              this.getTable(prmTid,this.tsid)
            })
          }
        })
      },

      getDynamicHeader(prmTid,tsid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: prmTid,tsid:tsid
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.tableColumn = [
              ...this.fixedHeader,
              ...this.headerTable.map(ele => ({
                ...ele,
                label:ele.sname,
                align:'center',
                childen:this.columnMultiLine.map(item => {
                  return {
                    ...item,
                    prop:`${item.prop}_${ele.sname}`,
                    label:item.label,
                    width:item.width,
                    align:item.align,
                    sortable:true
                  }
                }),
              }))
            ]
            // console.log(this.tableColumn)
          }
        })
      },

      getTable(prmTid,tsid) {
        // 获取table
        this.$store.dispatch('getExam/GetStuResults', {
          tid: prmTid,tsid:tsid,keyWords:this.keyWords,
          classIds:this.classIds,...this.pageTable
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.tableData = this.TableList.map(item =>{
              let dynamic = {}
              item.DynamicDetail.forEach(item => {
                dynamic = {
                  ...dynamic,
                  [`classRank_${item.sname}`]: item.classRank,
                  [`gradeRank_${item.sname}`]: item.gradeRank,
                  ord: item.ord,
                  sname: item.sname,
                  [`tscore_${item.sname}`]: item.tscore,
                  tsid: item.tsid
                }
              })

              return {
                cid: item.cid,
                cname: item.cname,
                snumber: item.snumber,
                stuname: item.stuname,
                tmid: item.tmid,
                tnumber: item.tnumber,
                totalscore: item.totalscore,
                ...dynamic
              }
            })
            // console.log(this.tableData)
          }
        })
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