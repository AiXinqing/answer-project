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
        <exam-button type="primary" @click="handleInquire" style="margin-right: 10px;">查询</exam-button>
        <exam-button type="primary" @click="downloadTranscript" style="margin-right: 10px;">下载成绩单</exam-button>
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
        keyWords:'',
        tsid:'',
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

        singleParameter:{ // 单科
          tid: '',
          tsid: '',
          cid:'',
          keyWords:'',
          url:this.URL.GetClassStuSubjectScore
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
      }
    },

    computed: {
      ...mapState('getExam',['tableLoading']),
      ...mapState('transcript',['headerTable','TableList']),

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
        ] : []
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
              tid: this.prmTid,
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
        }) : []
      }
    },

    methods: {
      initTable(obj) {
        this.parameter = {
          ...this.parameter,
          ...obj
        }
        this.singleParameter = {
          ...this.singleParameter,
          ...obj
        }

        if(obj.tsid == '0'){
          this.tsid = ''
          this.$nextTick(()=>{
            this.generalTable()
          })
        }else{
          this.tsid = obj.tsid
          this.$nextTick(()=>{
            this.singleTable()
          })
        }
      },

      generalTable(){
        // 全科
        this.$store.dispatch('transcript/getTranscript', this.parameter)
      },

      singleTable(){
        // 单科
        this.$store.dispatch('transcript/getSingleTranscript', this.singleParameter)
      },

      downloadTranscript(){
        // 下载表格
        let formData = this.parameter
        let url = this.URL.ExportClassStuTotalScore
        if(this.tsid != ''){
          formData = this.singleParameter
          url = this.URL.ExportClassStuSubjectScore
        }

        const {cid,keyWords,tid,tsid} = formData

        window.open(`${url}?tid=${tid}&tsid=${tsid}&cid=${cid}&keyWords=&${keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },

      handleInquire(){
        // 输入框查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
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