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
        <div class="search_left style_contents" style="width: auto">
          <span>试题类型:</span>
          <span
            class="question_style style_left"
            :class="{'active':type == 0}"
            @click="changeQustionType(0)"
          >客观题</span>
          <span
            class="question_style style_right"
            :class="{'active':type == 1}"
            @click="changeQustionType(1)"
          >主观题</span>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <umy-table
          :tablecols="questionTableColumn"
          :tableData="questionTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :single-height="50"
          :loading="tableLoading"
          @hanlde-pop-func="hanldePopFunc"
        />
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
      studentDetails
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
            label:'分值',
            width:'80',
            align:'center',
            type:'Html',
            fixed:'left',
            color:'font'
          },
          {
            prop:'respondentNum',
            label:'答题人数',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'avgScore',
            label:'平均分',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'scoreRate',
            label:'得分率',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'answer',
            label:'正确答案',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
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
            label:'占比',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        cidStr:'',
        theight: document.body.clientHeight - 300 || 0,
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          type: 0, // 0：客观题，1：主观题
          url:this.URL.GetAnswerStaticAnalysis
        },
        type:0
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapState('answerTheTest', ['tableLoading','headerTable','TableList']),

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
            label:ele,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map(item =>{
              let obj = {
                type:'Html'
              }
              if(item.prop == 'num'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,element) => {
                        let obj = {
                          tid:element.tid,
                          tsid:element.tsid,
                          cids: this.cidStr,
                          type:this.type,
                          tqid:row.tqid,
                          scoreOrOptions:ele,
                          name:row.name
                        }
                        // 详情数值为0时不弹出详情框
                        if(row[element.prop] != 0 && row[element.prop] != null){
                          this.hanldePopFunc(obj)
                        }
                      }
                    }
                  ]
                }
              }
              return {
                ...item,
                ...obj,
                label:item.label,
                prop:`${item.prop}_${ele}`,
                type: item.prop == 'num' ? 'pop_Btn' : 'Html',
                tsid:this.tsid == '' ? tsid_s : this.tsid,
                tid:this.prmTid,

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
              [`num_${element.name}`]:element.num,
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
            answer: item.answer,
            avgScore: item.avgScore,
            fullScore: item.fullScore,
            name: item.name,
            respondentNum: item.respondentNum,
            scoreRate: item.scoreRate,
            tqid: item.tqid,
            type: item.type,
            ...dynamic
          }
        }) : []
      }
    },

    created () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
          this.$nextTick(()=>{
            this.getHeight()
          })
        },
      },
    },

    methods: {
      getHeight () {
        this.theight = document.body.clientHeight - 350
      },

      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      changeQustionType(type){
        // 切换试题类型
        this.type = type
        this.parameter.type = type
        this.$nextTick(()=>{
          this.getTable()
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
        this.parameter.type = 0
        this.type = 0
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
        this.$store.dispatch('answerTheTest/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        window.open(`${this.URL.ExportAnswerStaticAnalysis}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}&type=${this.type}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .style_contents{
    font-size: 14px;
    .style_left{
      border-radius: 4px;
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-left: 10px;
    }
    .style_right{
      border-radius: 4px;
      border-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .question_style{
    display: inline-block;
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    border: 1px solid @eeefef;
    cursor: pointer;
    &.active{
      color: @white;
      background: @main;
      cursor: pointer;
    }
  }
</style>