<template>
  <div class="overall_overview">
    <div class="condition_filter">
      <div class="title_name question_analysis">
        <span>试题分析</span>
      </div>
      <div class="filter_btn">
        <exam-button  type="primary" @click="downloadAnalysis" style="margin-right: 10px;">试题分析下载</exam-button>
      </div>
    </div>

    <div class="el_table_wapper">
      <exam-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :isPagination="false"
        :theight="theight"
        :loading="tableLoading"
      ></exam-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        theight:0,
        tsid:'',
        tid:'',

        parameter:{
          tid: '',
          tsid: '',
          cid:'',
          url:this.URL.GetTeacherClassQuestion
        },

        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            minWidth:'100',
            align:'center',
            type:'Html'
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

      }
    },

    computed: {
      ...mapState('getExam',['tableLoading']),
      ...mapState('questionAnalysis',['headerTable','TableList']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.sname,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {
                type:'Html'
              }
              if(item.label == '分数' && ele.sname !='总分'){
                obj = {
                  type:'Text',
                  url:this.URL.BrowsescoreAnsw
                }
              }
              return {
                ...item,
                prop:`${item.prop}_${ele.sname}`,
                label:item.label,
                width:item.width,
                align:item.align,
                sortable:true,
                ...obj
              }
            }),
          }))
        ] :  []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`classRank_${item.sname}`]: item.classRank,
              [`gradeRank_${item.sname}`]: item.gradeRank,
              ord: item.ord,
              sname: item.sname,
              [`tscore_${item.sname}`]: item.tscore,
              tsid: item.tsid,
              tid: this.tid,
              jump:1
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
        }): []
      }
    },

    methods: {
      initTable(obj) {
        this.parameter = {
          ...this.parameter,
          ...obj
        }

        this.tid = obj.tid

        this.$nextTick(()=>{
          this.getTable()
        })

      },

      getTable(){
        // 全科
        this.$store.dispatch('questionAnalysis/getQuestionAnalysis', this.parameter)
      },

      downloadAnalysis(){
        // 下载表格
        const {cid,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportTeacherClassQuestion}?tid=${tid}&tsid=${tsid}&cid=${cid}`)
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .condition_filter{
    .title_name.question_analysis {
      width: 1061px;
    }

    .input_box{
      position: relative;
      .hj-input.el-input{
        width: 225px !important;
      }

      .clear_box{
        position: absolute;
        right: 5px;
        z-index: 1000;
        top: 4px;
        cursor: pointer;
      }
    }
  }
</style>