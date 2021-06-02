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

        tableColumn:[
          {
            prop:'type',
            label:'题号',
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'fullScore',
            label:'小题分值',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'classScoreScale',
            label:'班级得分率',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeScoreScale',
            label:'年级得分率',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'scaleDifference',
            label:'得分率差值',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
        ],

        empty:false,
      }
    },

    computed: {
      ...mapState('questionAnalysis',['tableLoading','TableList']),

      tableData(){
        return this.TableList.length && this.empty ? this.TableList: []
      }
    },

    methods: {
      initTable(obj) {
        this.empty = true
        this.parameter = {
          ...this.parameter,
          ...obj
        }

        this.tid = obj.tid

        this.$nextTick(()=>{
          this.getTable()
        })

      },

      emptyFunc(){
        this.empty = false
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