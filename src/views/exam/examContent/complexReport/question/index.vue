<template>
  <div class="complex_content">
    <div ref="stretch">
      <hj-stretch
        v-for="(choose,i) in stretchBox"
        :key="i"
        :choose-list="choose"
        @handle-stretch="handleStretch"
        @handle-checkAll-change="handleCheckAllChange"
        @single-change="singleChange"
      >
      </hj-stretch>
    </div>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left" style="width: auto">
          <span class="titile_18">试题得分汇总详情</span>
          <i>(查看每题得分情况，点击对应的人数，可查看学生名单)</i>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper" :style="{'max-height':theight +'px'}">
        <exam-table
          :tablecols="questionTableColumn"
          :tableData="questionTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :loading="tableLoading"
          @hanlde-pop-func="hanldePopFunc"
        ></exam-table>
      </div>
    </div>
    <student-details
      ref="studentDetails"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_classDetails'
  export default {
    components: {
      studentDetails,
    },
    props: {
      prmTid: {
        type: String,
        default: ''
      },

      examInfo:{
        type:Array,
        default:() => []
      }
    },

    data() {
      return {
        stretch: false,
        fixedHeader:[
          {
            prop:'name',
            label:'题号',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'type',
            label:'题型',
            width:'72',
            align:'center',
            type:'Html'
          },
          {
            prop:'fullScore',
            label:'满分',
            width:'80',
            align:'center',
            type:'Html',
            color:'font'
          },
          {
            prop:'answer',
            label:'正确答案',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
        ],
        rankArr:[
          {
            prop:'avgScore',
            label:'平均分',
            width:'90',
            align:'center',
          },
          {
            prop:'fullScoreNum',
            label:'满分人数',
            width:'90',
            align:'center',
          },
          {
            prop:'fullScoreScale',
            label:'满分率',
            width:'90',
            align:'center',
          },
          {
            prop:'zeroScoreNum',
            label:'零分人数',
            width:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        cidStr:'',
        theight: document.body.clientHeight - 310 || 0,
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          url:this.URL.GetQuestionSummary
        },
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading','subjectsArr','classesArr']),
      ...mapState('classQuestion', ['headerTable','TableList',]),

      classIdsArr(){
        return this.classesArr.length ? this.classesArr.filter(item => item.check && item.cid != 'all')
                .map(ele => ele.cid).toString() : ''
      },

      stretchBox(){
        return this.examInfo.length ? this.examInfo.map(element =>{
          return element.subject == '科目' ? {
            ...element,
            subjectList:element.subjectList.filter(item => item.tsid != 'totalScore').map((item,index) => {
              return index == 0 ? {...item,check:true} : {...item,check:false}
            })
          } : {
            ...element,
            subjectList:this.classesArr
          }
        }) :[]
      },

      questionTableColumn(){
        // 动态表头
        let tsid_s = this.subjectsArr.find((element,i) => i == 1).tsid
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.cname,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map((item,index) =>{
              return {
                ...ele,
                ...item,
                label:item.label,
                type: index == 1 || index == 3  ? 'popBtn' : 'Html',
                type_p:index == 1 ? 'manfen' : index == 3 ? 'zero' : 0,
                prop:`${item.prop}_${ele.cname}`,
                tsid:this.tsid == '' ? tsid_s : this.tsid,
                tid:this.prmTid
              }
            })
          }))
        ] : []
      },

      questionTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`avgScore_${element.cname}`]:element.avgScore,
              [`fullScoreNum_${element.cname}`]:element.fullScoreNum,
              [`fullScoreScale_${element.cname}`]:element.fullScoreScale,
              [`zeroScoreNum_${element.cname}`]:element.zeroScoreNum,
            }
          })

          return {
            answer: item.answer,
            fullScore: item.fullScore,
            name: item.name,
            tqid: item.tqid,
            type: item.type,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 310
      })
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
        },
      },
    },

    methods: {
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable() {
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },400)
        })
      },

      handleCheckAllChange(cidStr){
        // 班级查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        this.cidStr = cidStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.parameter = {
          ...this.parameter,
          cids:this.cidStr,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.$store.dispatch('classQuestion/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {cids,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportQuestionSummary}?tid=${tid}&tsid=${tsid}&cids=${cids}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>