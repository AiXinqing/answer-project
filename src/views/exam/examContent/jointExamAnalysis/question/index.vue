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
          :theight="questionTableData.length < 10 ? questionTableData.length * 35 + 90 : theight"
          :loading="tableLoading"
        ></exam-table>
      </div>
      <student-details
        ref="studentDetails"
      />
    </div>

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
            fixed:'left',
            type:'Html'
          },
          {
            prop:'fullScore',
            label:'满分',
            width:'80',
            align:'center',
            type:'Html',
            fixed:'left',
            color:'font'
          },
          {
            prop:'answer',
            label:'正确答案',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
        ],
        rankArr:[
          {
            prop:'avgScore',
            label:'平均分',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'fullScoreNum',
            label:'满分人数',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'fullScoreScale',
            label:'满分率',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'zeroScoreNum',
            label:'零分人数',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        scidsStr:'',
        theight: document.body.clientHeight - 310 || 0,
        parameter:{
          scids:'',
          tid: '',
          tsid:'',
          url:this.URL.GetJointExamQuestionSummary
        },
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr']),
      ...mapState('jointExams', ['schoolArr']),
      ...mapState('jointQuestion', ['tableLoading','headerTable','TableList']),

      schoolIdsArr(){
        return this.schoolArr.length ? this.schoolArr.filter(item => item.check && item.scid != 'all')
                .map(ele => ele.scid).toString() : ''
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
            subjectList:this.schoolArr
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
              let obj = {
                type:'Html'
              }
              if(item.prop == 'fullScoreNum' || item.prop == 'zeroScoreNum'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,ele) => {
                        let obj = {
                          tid:ele.tid,
                          tsid:ele.tsid,
                          cid:ele.cid,
                          tqid:row.tqid,
                          type: ele.type_p,
                          scids:this.scidsStr
                        }
                        this.hanldePopFunc(obj)
                      }
                    }
                  ]
                }
              }
              return {
                ...ele,
                ...item,
                label:item.label,
                ...obj,
                type: index == 1 || index == 3  ? 'pop_Btn' : 'Html',
                type_p:index == 1 ? 'manfen' : index == 3 ? 'zero' : 0,
                prop:`${item.prop}_${ele.cname}`,
                tsid:this.tsid == '' ? tsid_s : this.tsid,
                tid:this.prmTid,
                classObj:ele.cname
              }
            })
          }))
        ] : []
      },

      questionTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          if(item.DynamicDetail[0].cname != undefined){

            item.DynamicDetail.forEach(element => {
              dynamic = {
                ...dynamic,
                ...element,
                [`avgScore_${element.cname}`]:element.avgScore,
                [`fullScoreNum_${element.cname}`]:element.fullScoreNum,
                [`fullScoreScale_${element.cname}`]:element.fullScoreScale,
                [`zeroScoreNum_${element.cname}`]:element.zeroScoreNum,
                [`cid_${element.cname}`]: element.cid,
              }
            })
          }

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
      schoolIdsArr: {
        immediate: true,
        handler () {
          this.scidsStr = this.schoolIdsArr
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
          this.scidsStr = this.schoolIdsArr
          // 获取动态表头
          this.getTable()
        })
      },

      handleCheckAllChange(scidsStr){
        // 班级查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        this.scidsStr = scidsStr
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
          scids:this.scidsStr,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.$store.dispatch('jointQuestion/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        window.open(`${this.URL.ExportJointExamQuestionSummary}?tid=${this.prmTid}&tsid=${this.tsid}&scids=${this.scidsStr}`)
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