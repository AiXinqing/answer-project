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
        <exam-button  type="primary" @click="handleInquire" style="margin-right: 10px;margin-top: 7px;">查询</exam-button>
        <exam-button  type="primary" @click="downloadTranscript" style="margin-right: 10px;margin-top: 7px;">下载成绩单</exam-button>

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

        parameter:{
          tid: '',
          tsid: '',
          cid:'',
          keyWords:'',
          url:this.URL.GetClassStuTotalScore
        },

        HeadeParameter:{
          tid: '',
          tsid: '',
          url:this.URL.GetStuResultsHeade
        },

        data:[],

        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
        ],

        columnMultiLine:[
          {
            prop:'tscore',
            label:'分数',
            minWidth:'85',
            align:'center',
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'classRank',
            label:'班级排名',
            minWidth:'90',
            align:'center',
          },
        ],

        empty:false,
        maxHeight: document.body.clientHeight - 200

      }
    },

    computed: {
      ...mapState('transcript',['tableLoading','headerTable','TableList']),
      ...mapState('questionAnalysis', ['classList']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length && this.classList.length ? [
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
                  url:this.URL.BrowsescoreAnsw,
                  subject:ele.sname
                }
              }
              return {
                ...item,
                prop:`${item.prop}_${ele.sname}`,
                label:item.label,
                width:item.width,
                align:item.align,
                ...obj
              }
            }),
          }))
        ] :  []
      },

      tableData(){
        return this.TableList.length && this.classList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`classRank_${item.sname}`]: item.classRank,
              [`gradeRank_${item.sname}`]: item.gradeRank,
              [`tsid_${item.sname}`]: item.tsid,
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
        this.empty = true
        this.parameter = {
          ...this.parameter,
          ...obj
        }

        this.HeadeParameter = {
          ...this.HeadeParameter,
          ...obj
        }

        this.tid = obj.tid

        this.$nextTick(()=>{
          if(this.classList.length){
            this.generalTable()
          }
        })

      },

      emptyFunc(){
        this.empty = false
      },

      generalTable(){
        // 全科
        this.$store.dispatch('transcript/GetStuResultsHeade', this.HeadeParameter)
        this.$store.dispatch('transcript/getTranscript', this.parameter)
      },


      downloadTranscript(){
        // 下载表格
        const {cid,keyWords,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportClassStuTotalScore}?tid=${tid}&tsid=${tsid}&cid=${cid}&keyWords=&${keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },

      handleInquire(){
        this.parameter.keyWords = this.keyWords
        this.$nextTick(()=>{
          this.generalTable()
        })
      },

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