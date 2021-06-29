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
        <div class="search_left is_active">
          <span class="scoring_rate">
            <span>得分率说明：</span>
            <span 
              v-for="item in headerTable"
              :key="item.tid"
            >
            {{item.subname}}: {{item.substart}} - {{item.subend}}
            </span>
            <span class="set_parameter" @click="setParameterFunc" >设置参数</span>
          </span>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <umy-table
          :tablecols="classTableColumn"
          :tableData="classTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :single-height="40"
          :loading="tableLoading"
        />
      </div>
    </div>

    <student-details
      ref="studentDetails"
    />
    <parameter-settings
      ref="parameterSet"
      @change-set="changeSet"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_classDetails'
  import parameterSettings from './_parameterSettings'
  export default {
    components: {
      studentDetails,
      parameterSettings
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
            prop:'scname',
            label:'学校',
            width:'140',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'referenceNumber',
            label:'参考人数',
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'teacher',
            label:'班主任',
            width:'90',
            align:'center',
            type:'Text',
            fixed:'left',
            color:'font'
          },
          {
            prop:'maxScore',
            label:'最高分',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'minScore',
            label:'最低分',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            label:'平均分',
            align:'center',
            childen:[
              {
                prop:'avgScore',
                label:'平均分',
                minWidth:'90',
                align:'center',
                type:'Html'
              },
              {
                prop:'avgScoreRate',
                label:'平均得分率',
                minWidth:'100',
                align:'center',
                type:'Html'
              },
              {
                prop:'rank',
                label:'排名',
                minWidth:'90',
                align:'center',
                type:'Html'
              }
            ]
          }
        ],

        rankArr:[
          {
            prop:'num',
            label:'人数',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'scale',
            label:'率',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'rank',
            label:'排名',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        scidsStr:'',
        theight: document.body.clientHeight - 340 || 0,
        parameter:{
          scids:'',
          tid: '',
          tsid:'',
          url:this.URL.GetJointExamClassScoreContrast
        },
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr']),
      ...mapState('jointExams', ['schoolArr']),
      ...mapState('classGradesCompared', ['tableLoading','headerTable','TableList']),

      schoolIdsArr(){
        return this.schoolArr.length ? this.schoolArr.filter(item => item.check && item.scid != 'all')
                .map(ele => ele.scid).toString() : ''
      },

      stretchBox(){
        return this.examInfo.length ? this.examInfo.map(element =>{
          return element.subject == '科目' ? {
            ...element,
            subjectList:element.subjectList.map((item,index) => {
              return index == 0 ? {...item,check:true} : {...item,check:false}
            })
          } : {
            ...element,
            subjectList:this.schoolArr
          }
        }) :[]
      },

      classTableColumn(){
        // 动态表头
        let tsid_s = this.subjectsArr.find((element,i) => i == 0).tsid
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map((item,index) =>{
              let obj = {
                type:'Html'
              }
              if(item.prop == 'num'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,ele) => {
                        let obj = {
                          tid:ele.tid,
                          tsid:ele.tsid,
                          cid:row.cid,
                          asid:ele.asid,
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
                label:index != this.rankArr.length ? `${ele.subname}${item.label}` : item.label,
                ...obj,
                type: item.prop == 'num' ? 'pop_Btn' : 'Html',
                prop:`${item.prop}_${ele.subname}`,
                tsid:this.tsid == '' ? tsid_s : this.tsid,
              }
            })
          }))
        ] : []
      },

      classTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              [`num_${element.name}`]:element.num,
              [`scale_${element.name}`]:element.scale,
              [`rank_${element.name}`]:element.rank,
              scoreRange: element.scoreRange
            }
          })

          return {
            avgScore: item.avgScore,
            avgScoreRate: item.avgScoreRate,
            fullScore: item.fullScore,
            maxScore: item.maxScore,
            minScore: item.minScore,
            rank: item.rank,
            rankTopNum: item.rankTopNum,
            referenceNumber: item.referenceNumber,
            scname: item.scname,
            cid: item.cid,
            cname: item.cname,
            teacher: item.teacher,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 340
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
          this.theight = document.body.clientHeight - 248 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable() {
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          // 获取动态表头
          this.getTable()
        })
      },

      handleCheckAllChange(scidsStr){
        // 条件查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        if(this.scids == ''){
          this.scids = this.schoolArr.find((element,i) => i == 0).scids
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
        this.$store.dispatch('classGradesCompared/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        window.open(`${this.URL.ExportJointExamClassScoreContrast}?tid=${this.prmTid}&tsid=${this.tsid}&scids=${this.scidsStr}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      },

      setParameterFunc(){
        
        let subject = ''
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          subject = '总分'
        }else{
          subject = this.subjectsArr.filter(element => element.tsid == this.tsid)[0].name
        }
        
        let obj = {
          parameter:{
            tid: this.prmTid,
            tsid:this.tsid,
            type:this.tsid == 'totalScore' ? 2 : 1,
            url:this.URL.GetASAnalyseSettingList
          },
          subject:subject
        }
        
        this.$refs.parameterSet.openFrame(obj)
      },

      changeSet(){
        // 保存得分率后更新数据
        this.getTable()
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>