<template>
  <!-- 班级成绩概况 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>学科考试表现</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">各班级平均水平 <span class="span_tg">从平均水平看, 学校和各班级的各学科平均得分率如下表所示, 红色为总分低于全体平均分水平。</span></div>
        <div class="title_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
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
        />
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">各学科成绩等级结构比例 （得分率）</div>
        <div class="title_right">
          <exam-button type="primary" @click="subjectDownTable">下载表格</exam-button>
        </div>
      </div>
      <div class="el_table_wapper">
        <exam-table
          :tablecols="subjectTableColumn"
          :tableData="subjectTableData"
          :isIndex="false"
          :isPagination="false"
          :autoHeight="true"
          :loading="tableLoading"
          :maxHeight="maxHeight"
        />
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">总分等级结构表现</div>
        <div class="title_right">
          <div class="search_select search_style">
            <hj-select
              :items="options"
              size="mini"
              :value="tsid"
              @change="handelChange"
            />
          </div>
          <exam-button type="primary" @click="totalScoreDownTable">下载表格</exam-button>
        </div>
      </div>
      <div class="el_table_wapper">
        <exam-table
          :tablecols="totalScoretableColumn"
          :tableData="totalScoretableData"
          :isIndex="false"
          :isPagination="false"
          :autoHeight="true"
          :loading="tableLoading"
          :maxHeight="maxHeight"
        />
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState} from 'vuex'
  export default {
    props: {
      prmTid: {
        type: String,
        default: ''
      },
      subjectsArr:{
        type: Array,
        default:()=>[]
      }
    },

    data() {
      return {
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],
        rankArr:[
          {
            prop:'avgScore',
            label:'平均分',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'avgScoreScale',
            label:'平均得分率',
            minWidth:'120',
            align:'center',
          },
        ],

        subjectFixedHeader:[
          {
            prop:'sname',
            label:'学科',
            minWidth:'100',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],

        totalScoreFixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],

        parameter:{
          tid: '',
          url:this.URL.GetClassScoreSurvey
        },

        subjectParameter:{
          tid: '',
          url:this.URL.GetSubjectScoreLvlContrast
        },

        totalScoreParameter:{
          tid: '',
          tsid:'',
          showGrade:true,
          url:this.URL.GetClassScoreScaleNum
        },
        maxHeight: document.body.clientHeight - 200
      }
    },

    computed: {
      ...mapState('gradesOverview', ['tableLoading','headerTable','TableList']),
      ...mapState('subjectExam', ['tableLoading','subjectHeader','subjectTable']),
      ...mapState('totalGrade', ['tableLoading','totalScoreheader','totalScoreTable']),

      subjects(){
        return this.subjectsArr.length ? this.subjectsArr : []
      },

      options(){
        return this.subjects.length ? this.subjects.map(item => ({
          label:item.sname,
          value:item.tsid,
        })) : []
      },

      tableColumn(){
        // 动态表头

        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.sname,
            align:'center',
            childen:this.rankArr.map((item) =>{
              return {
                ...ele,
                ...item,
                label:item.label,
                type:'Html',
                prop:`${item.prop}_${ele.sname}`,
                tid:this.prmTid
              }
            })
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`avgScore_${element.sname}`]:element.avgScore,
              [`avgScoreScale_${element.sname}`]:element.avgScoreScale,
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            ...dynamic
          }
        }) : []
      },

      subjectTableColumn(){
        // 动态表头

        return this.subjectHeader.length ? [
          ...this.subjectFixedHeader,
          ...this.subjectHeader.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `scale_${ele.subname}`,
            type:'Html',
          }))
        ] : []
      },

      subjectTableData(){
        return this.subjectTable.length ? this.subjectTable.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
            sname: item.sname,
            tsid: item.tsid,
            ...dynamic
          }
        }) : []
      },

      totalScoretableColumn(){
        // 动态表头
        return this.totalScoreheader.length ? [
          ...this.totalScoreFixedHeader,
          ...this.totalScoreheader.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `scale_${ele.subname}`,
            type:'Html',
          }))
        ] : []
      },

      totalScoretableData(){
        return this.totalScoreTable.length ? this.totalScoreTable.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
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
            teacher: item.teacher,

            ...dynamic
          }
        }) : []
      }

    },

    watch: {
      subjectsArr: {
        immediate: true,
        handler () {
          this.tsid = this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 0).tsid :0
          if(this.tsid != 0){
            this.$nextTick(() => {
              if(this.totalScoreParameter.tsid != this.tsid){
                this.totalScoreParameter.tid = this.prmTid
                this.totalScoreParameter.tsid = this.tsid
                this.getTotalScoreTable()
              }
              
            })
          }
        },
      },
    },

    mounted () {
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.subjectParameter.tid = this.prmTid
        this.totalScoreParameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods:{

      downTable(){
        // 下载表格
        const {tid} = this.parameter
        window.open(`${this.URL.ExportClassScoreSurvey}?tid=${tid}`)
      },

      subjectDownTable(){
        // 各科成绩等级人数占比下载
        const {tid} = this.subjectParameter
        window.open(`${this.URL.ExportSubjectScoreLvlContrast}?tid=${tid}`)
      },

      totalScoreDownTable(){
        // 各科成绩等级人数占比下载
        const {tid,tsid,showGrade} = this.totalScoreParameter
        window.open(`${this.URL.ExportClassScoreScaleNum}?tid=${tid}&tsid=${tsid}&showGrade=${showGrade}`)
      },

      handelChange(val){
        this.totalScoreParameter.tsid = val
        this.tsid = val
        this.$nextTick(()=>{
          this.getTotalScoreTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('gradesOverview/GetStuResults', this.parameter)
        this.$store.dispatch('subjectExam/GetStuResults', this.subjectParameter) // 各科成绩等级人数占比比较
      },

      getTotalScoreTable() {
        // 获取table
        this.$store.dispatch('totalGrade/GetStuResults', this.totalScoreParameter) // 各班等级人数占比比较
      },
    }
  }
</script>

<style lang="less" >
  @import '~@/assets/css/variables.less';
  .title_left{
    span.span_tg{
      font-size: 12px;
      color: @font-888;
      margin-left: 20px;
    }
  }
  .title_right{
    display: flex;

    .search_select{
      margin-right: 20px;
    }
  }
  .total_sytle{
    &.no_data{
      text-align: center
    }
  }
</style>
