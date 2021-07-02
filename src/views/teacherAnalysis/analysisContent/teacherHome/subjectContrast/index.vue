<template>
  <div class="overall_overview">
    <div class="condition_filter">
      <div class="title_name">
        <span>学科对比</span>
      </div>
      <div class="filter_btn Before_grade" v-if="tsid !=''">
        <div class="input_box">
          <div class="label_font">年级前N名 :</div>
          <hj-input
            v-model="topNum"
            class="search_input"
            class="rank_style"
          />
        </div>
        <exam-button type="primary" @click="handelSearch" style="margin-right: 10px;">确定</exam-button>
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
      ></exam-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        topNum:50,
        titleTopNum:50,
        tsid:'',

        parameter:{ // 全科
          tid: '',
          cid: '',
          url:this.URL.GetTeacherSubjectScoreContrast
        },

        singleParameter:{ // 单科
          tid: '',
          tsid: '',
          topNum:50,
          url:this.URL.GetTeacherClassScoreContrast
        },

        generalFixedHeader:[
          {
            prop:'sname',
            label:'学科',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'classAvgScore',
            label:'班级平均分',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeAvgScore',
            label:'年级平均分',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'classRank',
            label:'班级排名',
            width:'120',
            align:'center',
            type:'Html'
          }
        ],

        singleFixedHeader:[
          {
            prop:'rankIndex',
            label:'排序',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'referenceNumber',
            label:'考试人数',
            width:'120',
            align:'center',
            type:'Html'
          },
        ],

        empty:false
      }
    },

    computed: {
      ...mapState('subjectContrast',['tableLoading','headerTable','TableList']),

      tableColumn(){
        // 动态表头
        let header = this.tsid == '' ? this.generalFixedHeader : [
            ...this.singleFixedHeader,
            {
              prop:'rankTopNum',
              label: `年级前${this.titleTopNum}名`,
              width:'120',
              align:'center',
              type:'Html'
            }
          ]

        return this.headerTable.length ? [
          ...header,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `ratio_${ele.subname}`,
            type:'Html',
            sortable:this.tsid == '' ? false : true,
            minWidth:'120',
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map((item,index) =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              ...item,
              [`ratio_${item.name}`]:item.scale,
            }
          })

          let fixedObj = {}

          if(this.tsid == ''){
            fixedObj = {
              classAvgScore: item.classAvgScore,
              classRank: item.classRank,
              gradeAvgScore: item.gradeAvgScore,
              sname: item.sname,
              tsid: item.tsid,
            }
          }else{
            fixedObj = {
              rankIndex:index + 1,
              avgScore: item.avgScore,
              avgScoreRate: item.avgScoreRate,
              cid: item.cid,
              cname: item.cname,
              fullScore: item.fullScore,
              maxScore: item.maxScore,
              minScore: item.minScore,
              rank: item.rank,
              rankTopNum: item.rankTopNum,
              referenceNumber: item.referenceNumber,
              teacher: item.teacher
            }
          }
          return {
            ...fixedObj,
            ...dynamic,
          }
        }) : []
      }
    },

    methods: {
      initTable(obj) {
        this.empty = true
        this.parameter = {
          ...this.parameter,
          tid: obj.tid,
          cid: obj.cid,
        }

        this.singleParameter = {
          ...this.singleParameter,
          tid: obj.tid,
          tsid: obj.tsid,
          topNum:this.topNum
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

      emptyFunc(){
        this.empty = false
      },

      generalTable(){
        // 全科
        this.$store.dispatch('subjectContrast/subjectContrast', this.parameter)
      },

      singleTable(){
        // 单科
        this.$store.dispatch('subjectContrast/singleSubjectContrast', this.singleParameter)
      },

      handelSearch(){
        this.singleParameter.topNum = this.topNum
        this.$nextTick(()=>{
          this.singleTable()
          this.titleTopNum = this.topNum
        })
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .condition_filter{
    display: flex;

    .title_name {
      width: 870px;
    }

    .filter_btn{
      display: flex;

      .input_box{
        display: flex;
        font-size: 14px;
        margin-right: 10px;

        .label_font{
          margin-right: 10px;
          line-height: 28px;
        }

        .hj-input.el-input{
          width: 120px;
          margin-top: -5px;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  .condition_filter {
    .Before_grade{
      .input_box .hj-input.el-input{
        width: 70px!important;
      }
    }
  } 

  .condition_filter .title_name {
    width: 871px;
  }

  button.el-button.btn_column.el-button--default.el-button--medium{
    position: relative;
    top: 3px;
  }
</style>
