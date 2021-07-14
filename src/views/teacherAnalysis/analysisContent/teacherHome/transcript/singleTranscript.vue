<template>
  <div class="overall_overview">
    <div class="condition_filter">
      <div class="title_name">
        <span>成绩单</span>
      </div>
      <div class="filter_btn">
        <div class="input_box">
          <span class="clear_box">
            <i class="el-icon-circle-close" @click="handleClear"></i>
          </span>
          <hj-input
            v-model="keyWords"
            class="search_input"
            placeholder="输入姓名/考号/学号进行搜索"
            :iSlot="iSlot"
          />
        </div>

        <exam-button  type="primary" @click="handleSingleInquire" style="margin-right: 10px;">查询</exam-button>
        <exam-button  type="primary" @click="downloadSingleTranscript" style="margin-right: 10px;">下载成绩单</exam-button>
      </div>
    </div>

    <div class="el_table_wapper">
      <exam-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :isPagination="false"
        :autoHeight="true"
        :loading="tableLoading"
        :maxHeight="maxHeight"
      ></exam-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        keyWords:'',
        tsid:'',
        tid:'',
        iSlot:[
          {
            type:'prefix',
            icon:'el-icon-search'
          }
        ],

        maxHeight: document.body.clientHeight - 200,

        singleParameter:{ // 单科
          tid: '',
          tsid: '',
          cid:'',
          keyWords:'',
          url:this.URL.GetClassStuSubjectScore
        },

        tableColumn:[
          {
            prop:'stuname',
            label:'姓名',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'tscore',
            label:'分数',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeRank',
            label:'年级排名',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeRankChange',
            label:'上次年级/升降名次',
            minWidth:'120',
            align:'center',
            type:'iconRank',
            iconList:[
              {
                beforeIcon:'lastGradeRank',
                afterIcon:'gradeRankChange',
                unit:'名'
              }
            ]
          },
          {
            prop:'classRank',
            label:'班级排名',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'lastClassRank',
            label:'上次班级/升降名次',
            minWidth:'120',
            align:'center',
            type:'iconRank',
            iconList:[
              {
                beforeIcon:'lastClassRank',
                afterIcon:'classRankChange',
                unit:'名'
              }
            ]
          },
          {
            label:'操作',
            minWidth:'120',
            align:'center',
            type:'operateBtn',
            btnList:[
              {
                label:'查看答题卡',
                handle: row => {

                  const {tid,tsid} = this.singleParameter
                  let obj = {
                    ...row,
                    tid: tid,
                    tsid: tsid,
                  }
                  if(row.totalscore != '缺考'){
                    this.lookAnswerSheet(obj)
                  }
                }
              }
            ]
          },
        ]
      }
    },

    computed: {
      ...mapState('transcript',['tableLoading','singleTableList']),
      ...mapState('questionAnalysis', ['classList']),

      tableData(){
        return this.singleTableList.length && this.classList.length ? this.singleTableList : []
      }
    },

    methods: {
      initTable(obj) {

        this.singleParameter = {
          ...this.singleParameter,
          ...obj
        }
        this.tid = obj.tid

        this.$nextTick(()=>{
          if(this.classList.length){
            this.singleTable()
          }
        })
      },

      singleTable(){
        // 单科
        this.$store.dispatch('transcript/getSingleTranscript', this.singleParameter)
      },

      downloadSingleTranscript(){
        //单科 下载表格
        const {cid,keyWords,tid,tsid} = this.singleParameter
        window.open(`${this.URL.ExportClassStuSubjectScore}?tid=${tid}&tsid=${tsid}&cid=${cid}&keyWords=&${keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },

      handleSingleInquire(){
        this.singleParameter.keyWords = this.keyWords
        this.$nextTick(()=>{
          this.singleTable()
        })
      },
      lookAnswerSheet(obj){
        const {tid,tsid,tnumber} = obj
        window.open(`${this.URL.BrowsescoreAnsw}?tid=${tid}&tsid=${tsid}&tnumber=${tnumber}`)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .condition_filter{
    .title_name {
      width: 726px;
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
<style lang="less" scoped>
  button.el-button.btn_column.el-button--default.el-button--medium{
    position: relative;
    top: 3px;
  }
</style>