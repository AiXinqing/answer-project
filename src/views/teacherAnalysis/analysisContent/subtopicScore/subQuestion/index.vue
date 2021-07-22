<template>
  <div class="overall_overview">
    <div class="condition_filter">
      <div class="title_name">
        <span>学生小题得分情况</span>
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
        <exam-button  type="primary" @click="handleInquire" style="margin-right: 10px;margin-top: 5px;">查询</exam-button>
        <exam-button  type="primary" @click="downloadTranscript" style="margin-right: 10px;margin-top: 5px;">下载成绩单</exam-button>

      </div>
    </div>

    <div class="el_table_wapper">
      <umy-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :isPagination="false"
        :autoHeight="true"
        :loading="tableLoading"
        :maxHeight="maxHeight"
      />
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
          url:this.URL.GetTeacherClassStuSmallScore
        },

        HeadeParameter:{
          tid: '',
          tsid: '',
          url:this.URL.GetStuSmallScoreHeade
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
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'snumber',
            label:'学号',
            minWidth:'120',
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
          {
            prop:'totalscore',
            label:'总分',
            minWidth:'120',
            align:'center',
            type:'Text',
            url:this.URL.BrowsescoreAnsw
          },
          {
            prop:'ObjectiveScore',
            label:'客观题',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'SubjectiveScore',
            label:'主观题',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'classRank',
            label:'班级排名',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
        ],
        objective:[ // 客观
          {
            prop:'fullScore',
            label:'客观',
            minWidth:'120',
            align:'center',
          },
          {
            prop:'answer',
            label:'客观',
            minWidth:'120',
            align:'center',
          },
        ],
        subjective:[ // 主观
          {
            prop:'fullScore',
            label:'主',
            minWidth:'120',
            align:'center',
          },
        ],

        maxHeight: document.body.clientHeight - 310,

        empty:false,

      }
    },

    computed: {
      ...mapState('subQuestion',['tableLoading','headerTable','TableList']),
      ...mapState('questionAnalysis', ['classList']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length && this.empty && this.classList.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.title,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:ele.type == '0' ? this.objective.map((item,index) =>{
              let obj = {
                type:'Html'
              }
              return index == 0 ? {
                ...item,
                label:`得分/共${ele.fullScore}分`,
                ...obj,
                // type:'Text',
                type:'Html',
                prop:`${item.prop}_${ele.title}`,
                fontSize:true,
                fullScore:ele.fullScore,
                typeIndex:ele.type
              }: {
                ...item,
                label:`作答/答案${ele.answer}`,
                ...obj,
                prop:`${item.prop}_${ele.title}`,
                answer:ele.answer,
                typeIndex:ele.type
              }
            }) : this.subjective.map(item =>{
              return {
                ...item,
                label:`得分/共${ele.fullScore}分`,
                type:'Html',
                prop:`${item.prop}_${ele.title}`,
                fontSize:true,
                fullScore:ele.fullScore,
                typeIndex:ele.type
              }
            })
          }))
        ] : []
      },

      tableData(){

        return this.TableList.length && this.empty && this.classList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            switch (element.type) {
              case '0':
                  dynamic = {
                    ...dynamic,
                    [`answer_${element.title}`]:element.selected,
                    [`fullScore_${element.title}`]:element.score,
                    score: element.score,
                    selected: element.selected,
                    title: element.title,
                    type: element.type,
                  }
                break;
              default:
                  dynamic = {
                    ...dynamic,
                    [`fullScore_${element.title}`]:element.score,
                    score: element.score,
                    selected: element.selected,
                    title: element.title,
                    type: element.type,
                    answer: null,
                  }
                break;
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
            ObjectiveScore: item.ObjectiveScore,
            SubjectiveScore: item.SubjectiveScore,
            classRank: item.classRank,
            gradeRank: item.gradeRank,
            ...dynamic,
            jump:1,
            tsid: this.parameter.tsid,
            tid: this.parameter.tid,
          }
        }) : []
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

      generalTable(){
        // 全科
        this.$store.dispatch('subQuestion/GetStuResultsHeade', this.HeadeParameter)
        this.$store.dispatch('subQuestion/getTranscript', this.parameter)
      },


      downloadTranscript(){
        // 下载表格
        const {cid,keyWords,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportTeacherClassStuSmallScore}?tid=${tid}&tsid=${tsid}&cid=${cid}&keyWords=&${keyWords}`)
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

